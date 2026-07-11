#!/usr/bin/env python3
"""Build the browser-ready demographic weights from the official UN WPP 2024 CSV.

The source CSV reports population in thousands. This generator selects the 2026
Medium projection for the 237 Country/Area leaves, converts each male/female
single-age value to persons, and emits location -> age -> sex Uint32 weights.
"""

from __future__ import annotations

import argparse
import base64
import contextlib
import csv
from dataclasses import dataclass, field
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import gzip
import hashlib
import io
import json
from pathlib import Path
import struct
import sys
import tempfile
from typing import BinaryIO, Iterator, TextIO
import urllib.parse
import urllib.request


SOURCE_URL = (
    "https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/"
    "CSV_FILES/WPP2024_PopulationBySingleAgeSex_Medium_2024-2100.csv.gz"
)
SOURCE_CATALOG_URL = "https://population.un.org/wpp/assets/downloads.json"
SOURCE_REVISION = "World Population Prospects 2024"
SOURCE_YEAR = 2026
SOURCE_VARIANT = "Medium"
ACCESS_DATE = "2026-07-11"
LICENSE = "CC BY 3.0 IGO"
LICENSE_URL = "https://creativecommons.org/licenses/by/3.0/igo/"

EXPECTED_LOCATIONS = 237
AGE_COUNT = 101
SEX_COUNT = 2
EXPECTED_CELLS = EXPECTED_LOCATIONS * AGE_COUNT * SEX_COUNT
UINT32_MAX = (1 << 32) - 1

REQUIRED_COLUMNS = {
    "SortOrder",
    "LocID",
    "ISO3_code",
    "ISO2_code",
    "SDMX_code",
    "LocTypeName",
    "Location",
    "Variant",
    "Time",
    "AgeGrp",
    "AgeGrpStart",
    "PopMale",
    "PopFemale",
    "PopTotal",
}

CAUSES = [
    {"id": "ischaemic-heart-disease", "label": "허혈성 심장 질환", "weight": 9_100_000},
    {"id": "covid-19", "label": "코로나19", "weight": 8_800_000},
    {"id": "stroke", "label": "뇌졸중", "weight": 7_000_000},
    {"id": "copd", "label": "만성 폐쇄성 폐질환", "weight": 3_500_000},
    {"id": "lower-respiratory-infections", "label": "하부 호흡기 감염", "weight": 2_500_000},
    {
        "id": "trachea-bronchus-lung-cancers",
        "label": "기관·기관지·폐암",
        "weight": 1_900_000,
    },
    {
        "id": "alzheimers-and-other-dementias",
        "label": "알츠하이머병 및 기타 치매",
        "weight": 1_800_000,
    },
    {"id": "diabetes-mellitus", "label": "당뇨병", "weight": 1_600_000},
    {"id": "kidney-diseases", "label": "신장 질환", "weight": 1_400_000},
    {"id": "tuberculosis", "label": "결핵", "weight": 1_400_000},
    {"id": "other", "label": "기타", "weight": 29_000_000},
]


class BuildError(RuntimeError):
    """The source does not satisfy the expected WPP schema or invariants."""


@dataclass
class LocationRows:
    sort_order: int
    code: str
    region_code: str
    m49: str
    name_en: str
    by_age: dict[int, tuple[int, int]] = field(default_factory=dict)


@contextlib.contextmanager
def open_source(source: str) -> Iterator[TextIO]:
    """Open an official URL or local .csv[.gz] source as UTF-8 CSV text."""

    parsed = urllib.parse.urlparse(source)
    response: BinaryIO | None = None
    local_file: BinaryIO | None = None
    binary: BinaryIO

    try:
        if parsed.scheme in {"http", "https"}:
            request = urllib.request.Request(
                source,
                headers={"User-Agent": "jinwoo-button-stats-builder/1.0"},
            )
            response = urllib.request.urlopen(request, timeout=120)
            binary = response
        else:
            local_file = open(Path(source).expanduser(), "rb")
            binary = local_file

        if parsed.path.lower().endswith(".gz") or source.lower().endswith(".gz"):
            compressed: BinaryIO = gzip.GzipFile(fileobj=binary)
        else:
            compressed = binary

        text = io.TextIOWrapper(compressed, encoding="utf-8-sig", newline="")
        try:
            yield text
        finally:
            text.close()
    finally:
        if response is not None:
            response.close()
        if local_file is not None and not local_file.closed:
            local_file.close()


def parse_age(row: dict[str, str], line_number: int) -> int:
    label = row["AgeGrp"].strip()
    expected_label = "100+" if row["AgeGrpStart"].strip() == "100" else row["AgeGrpStart"].strip()
    if label != expected_label:
        raise BuildError(
            f"line {line_number}: AgeGrp {label!r} disagrees with AgeGrpStart "
            f"{row['AgeGrpStart']!r}"
        )
    try:
        age = int(row["AgeGrpStart"])
    except ValueError as error:
        raise BuildError(f"line {line_number}: invalid age {row['AgeGrpStart']!r}") from error
    if not 0 <= age <= 100:
        raise BuildError(f"line {line_number}: age {age} is outside 0..100")
    return age


def persons(value: str, field_name: str, line_number: int) -> int:
    if not value.strip():
        raise BuildError(f"line {line_number}: missing {field_name}")
    try:
        number = Decimal(value) * Decimal(1000)
        rounded = int(number.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    except (InvalidOperation, ValueError) as error:
        raise BuildError(f"line {line_number}: invalid {field_name} {value!r}") from error
    if rounded < 0:
        raise BuildError(f"line {line_number}: negative {field_name} {rounded}")
    if rounded > UINT32_MAX:
        raise BuildError(f"line {line_number}: {field_name} exceeds Uint32: {rounded}")
    return rounded


def normalized_m49(row: dict[str, str], line_number: int) -> str:
    raw = row["SDMX_code"].strip() or row["LocID"].strip()
    if not raw.isdigit():
        raise BuildError(f"line {line_number}: invalid M49/SDMX code {raw!r}")
    return raw.zfill(3)


def read_projection(source: str) -> tuple[list[dict[str, str]], list[int], int]:
    records: dict[str, LocationRows] = {}
    published_total = 0
    selected_rows = 0

    with open_source(source) as stream:
        reader = csv.DictReader(stream)
        if reader.fieldnames is None:
            raise BuildError("source CSV has no header")
        missing_columns = REQUIRED_COLUMNS.difference(reader.fieldnames)
        if missing_columns:
            raise BuildError(f"source CSV is missing columns: {sorted(missing_columns)}")

        for line_number, row in enumerate(reader, start=2):
            if row["Time"].strip() != str(SOURCE_YEAR):
                continue
            if row["Variant"].strip() != SOURCE_VARIANT:
                continue
            if row["LocTypeName"].strip() != "Country/Area":
                continue

            code = row["ISO3_code"].strip()
            if not code:
                raise BuildError(f"line {line_number}: Country/Area row has no ISO3 code")
            if len(code) != 3 or not code.isalpha() or code != code.upper():
                raise BuildError(f"line {line_number}: invalid ISO3 code {code!r}")

            region_code = row["ISO2_code"].strip()
            if len(region_code) != 2 or not region_code.isalpha() or region_code != region_code.upper():
                raise BuildError(f"line {line_number}: invalid ISO2 code {region_code!r} for {code}")

            try:
                sort_order = int(row["SortOrder"])
            except ValueError as error:
                raise BuildError(
                    f"line {line_number}: invalid SortOrder {row['SortOrder']!r}"
                ) from error

            location = records.get(code)
            metadata = (
                sort_order,
                region_code,
                normalized_m49(row, line_number),
                row["Location"].strip(),
            )
            if not metadata[3]:
                raise BuildError(f"line {line_number}: missing Location name for {code}")
            if location is None:
                location = LocationRows(sort_order, code, metadata[1], metadata[2], metadata[3])
                records[code] = location
            elif (
                location.sort_order,
                location.region_code,
                location.m49,
                location.name_en,
            ) != metadata:
                raise BuildError(f"line {line_number}: inconsistent metadata for {code}")

            age = parse_age(row, line_number)
            if age in location.by_age:
                raise BuildError(f"line {line_number}: duplicate {code} age {age}")

            male = persons(row["PopMale"], "PopMale", line_number)
            female = persons(row["PopFemale"], "PopFemale", line_number)
            total = persons(row["PopTotal"], "PopTotal", line_number)
            if abs((male + female) - total) > 1:
                raise BuildError(
                    f"line {line_number}: PopMale + PopFemale disagrees with PopTotal for "
                    f"{code} age {age}"
                )
            location.by_age[age] = (male, female)
            published_total += total
            selected_rows += 1

    if len(records) != EXPECTED_LOCATIONS:
        raise BuildError(f"expected {EXPECTED_LOCATIONS} locations, found {len(records)}")
    if selected_rows != EXPECTED_LOCATIONS * AGE_COUNT:
        raise BuildError(
            f"expected {EXPECTED_LOCATIONS * AGE_COUNT} demographic rows, found {selected_rows}"
        )

    sort_orders = [record.sort_order for record in records.values()]
    if len(sort_orders) != len(set(sort_orders)):
        raise BuildError("country/area SortOrder values are not unique")

    ordered = sorted(records.values(), key=lambda item: item.sort_order)
    locations: list[dict[str, str]] = []
    weights: list[int] = []
    expected_ages = set(range(AGE_COUNT))

    for location in ordered:
        ages = set(location.by_age)
        if ages != expected_ages:
            missing = sorted(expected_ages.difference(ages))
            extra = sorted(ages.difference(expected_ages))
            raise BuildError(f"{location.code}: missing ages {missing}, extra ages {extra}")
        locations.append(
            {
                "code": location.code,
                "regionCode": location.region_code,
                "m49": location.m49,
                "nameEn": location.name_en,
            }
        )
        for age in range(AGE_COUNT):
            weights.extend(location.by_age[age])

    if len(weights) != EXPECTED_CELLS:
        raise BuildError(f"expected {EXPECTED_CELLS} weights, found {len(weights)}")
    if not any(weight > 0 for weight in weights):
        raise BuildError("all demographic weights are zero")
    if any(weight < 0 or weight > UINT32_MAX for weight in weights):
        raise BuildError("demographic weight outside Uint32 range")

    generated_total = sum(weights)
    if abs(generated_total - published_total) > selected_rows:
        raise BuildError(
            "rounded male/female source total is inconsistent with rounded PopTotal sum: "
            f"{generated_total} vs {published_total}"
        )
    if not 7_000_000_000 <= generated_total <= 10_000_000_000:
        raise BuildError(f"implausible 2026 source total: {generated_total}")

    return locations, weights, published_total


def js_export(name: str, value: object) -> str:
    return f"export const {name} = {json.dumps(value, ensure_ascii=False, indent=2)};\n"


def build_module(source: str) -> tuple[str, dict[str, object]]:
    locations, weights, published_total = read_projection(source)
    raw = struct.pack(f"<{len(weights)}I", *weights)
    encoded = base64.b64encode(raw).decode("ascii")
    digest = hashlib.sha256(raw).hexdigest()

    if len(raw) != EXPECTED_CELLS * 4:
        raise BuildError(f"unexpected byte length: {len(raw)}")
    if hashlib.sha256(base64.b64decode(encoded, validate=True)).hexdigest() != digest:
        raise BuildError("base64 checksum verification failed")
    if sum(cause["weight"] for cause in CAUSES) != 68_000_000:
        raise BuildError("WHO cause weights must total 68,000,000")

    meta: dict[str, object] = {
        "sourceUrl": SOURCE_URL,
        "sourceCatalogUrl": SOURCE_CATALOG_URL,
        "revision": SOURCE_REVISION,
        "year": SOURCE_YEAR,
        "variant": SOURCE_VARIANT,
        "accessDate": ACCESS_DATE,
        "sourceUnit": "thousands of persons",
        "generatedUnit": "persons",
        "sourceTotal": sum(weights),
        "publishedTotal": published_total,
        "locationCount": len(locations),
        "cellCount": len(weights),
        "byteLength": len(raw),
        "sha256": digest,
        "license": LICENSE,
        "licenseUrl": LICENSE_URL,
    }
    shape = {
        "locations": EXPECTED_LOCATIONS,
        "ages": AGE_COUNT,
        "sexes": ["male", "female"],
        "order": ["location", "age", "sex"],
        "ageRange": [0, 100],
        "age100Plus": True,
        "weightType": "uint32-le",
        "unit": "persons",
    }

    parts = [
        "// Generated by scripts/build-stats.py from UN WPP 2024. Do not edit by hand.\n",
        "// WHO cause weights use only the public 2021 top-ten aggregate figures.\n\n",
        js_export("STATS_META", meta),
        "\n",
        js_export("LOCATIONS", locations),
        "\n",
        js_export("DEMOGRAPHIC_SHAPE", shape),
        "\n",
        f"export const DEMOGRAPHIC_WEIGHTS_BASE64 = {json.dumps(encoded)};\n\n",
        js_export("CAUSES", CAUSES),
    ]
    return "".join(parts), meta


def parse_args() -> argparse.Namespace:
    script_path = Path(__file__).resolve()
    default_output = script_path.parent.parent / "stats.generated.js"
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        default=SOURCE_URL,
        help="official .csv.gz URL or local .csv[.gz] path",
    )
    parser.add_argument("--output", type=Path, default=default_output)
    parser.add_argument(
        "--check",
        action="store_true",
        help="verify the output is current without writing it",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        module, meta = build_module(args.source)
        output = args.output.resolve()
        if args.check:
            try:
                existing = output.read_text(encoding="utf-8")
            except FileNotFoundError as error:
                raise BuildError(f"output does not exist: {output}") from error
            if existing != module:
                raise BuildError(f"output is stale: {output}")
            action = "verified"
        else:
            output.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(
                "w",
                encoding="utf-8",
                newline="\n",
                dir=output.parent,
                prefix=f".{output.name}.",
                suffix=".tmp",
                delete=False,
            ) as temporary:
                temporary.write(module)
                temporary_path = Path(temporary.name)
            temporary_path.replace(output)
            action = "wrote"

        print(
            f"{action} {output}: {meta['locationCount']} locations, "
            f"{meta['cellCount']} weights, {meta['byteLength']} bytes, "
            f"source total {meta['sourceTotal']}, sha256 {meta['sha256']}"
        )
        return 0
    except (BuildError, OSError, csv.Error) as error:
        print(f"build-stats: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
