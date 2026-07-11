import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const moduleSource = await readFile(new URL("../stats.generated.js", import.meta.url), "utf8");
const stats = await import(
  `data:text/javascript;base64,${Buffer.from(moduleSource).toString("base64")}`
);

function decodeWeights() {
  const raw = Buffer.from(stats.DEMOGRAPHIC_WEIGHTS_BASE64, "base64");
  const weights = new Uint32Array(stats.DEMOGRAPHIC_SHAPE.locations * 101 * 2);
  for (let index = 0; index < weights.length; index += 1) {
    weights[index] = raw.readUInt32LE(index * 4);
  }
  return { raw, weights };
}

test("exports the required generated-data interface", () => {
  assert.equal(stats.STATS_META.revision, "World Population Prospects 2024");
  assert.equal(stats.STATS_META.year, 2026);
  assert.equal(stats.STATS_META.variant, "Medium");
  assert.equal(stats.STATS_META.accessDate, "2026-07-11");
  assert.equal(stats.STATS_META.license, "CC BY 3.0 IGO");
  assert.equal(stats.LOCATIONS.length, 237);
  assert.deepEqual(stats.DEMOGRAPHIC_SHAPE, {
    locations: 237,
    ages: 101,
    sexes: ["male", "female"],
    order: ["location", "age", "sex"],
    ageRange: [0, 100],
    age100Plus: true,
    weightType: "uint32-le",
    unit: "persons",
  });
});

test("has 237 unique stable country/area identifiers", () => {
  const codes = new Set();
  const regionCodes = new Set();
  const m49Codes = new Set();
  for (const location of stats.LOCATIONS) {
    assert.match(location.code, /^[A-Z]{3}$/);
    assert.match(location.regionCode, /^[A-Z]{2}$/);
    assert.match(location.m49, /^\d{3}$/);
    assert.ok(location.nameEn.length > 0);
    codes.add(location.code);
    regionCodes.add(location.regionCode);
    m49Codes.add(location.m49);
  }
  assert.equal(codes.size, 237);
  assert.equal(regionCodes.size, 237);
  assert.equal(m49Codes.size, 237);
});

test("decodes exactly 47,874 little-endian Uint32 weights", () => {
  const { raw, weights } = decodeWeights();
  assert.equal(weights.length, 47_874);
  assert.equal(raw.length, 47_874 * Uint32Array.BYTES_PER_ELEMENT);
  assert.equal(raw.length, stats.STATS_META.byteLength);
  assert.equal(stats.STATS_META.cellCount, 47_874);
  assert.equal(weights.some((weight) => weight > 0), true);
  assert.equal(weights.every((weight) => Number.isInteger(weight) && weight >= 0), true);
  const sourceTotal = weights.reduce((sum, weight) => sum + weight, 0);
  assert.equal(sourceTotal, stats.STATS_META.sourceTotal);
});

test("matches the generated-byte SHA-256 checksum", () => {
  const { raw } = decodeWeights();
  assert.equal(createHash("sha256").update(raw).digest("hex"), stats.STATS_META.sha256);
});

test("encodes WHO public 2021 top-ten figures plus the remainder", () => {
  assert.equal(stats.CAUSES.length, 11);
  assert.equal(
    stats.CAUSES.reduce((sum, cause) => sum + cause.weight, 0),
    68_000_000,
  );
  assert.deepEqual(
    stats.CAUSES.slice(0, 10).map((cause) => cause.weight),
    [9_100_000, 8_800_000, 7_000_000, 3_500_000, 2_500_000, 1_900_000, 1_800_000, 1_600_000, 1_400_000, 1_400_000],
  );
  assert.deepEqual(stats.CAUSES.at(-1), { id: "other", label: "기타", weight: 29_000_000 });
});
