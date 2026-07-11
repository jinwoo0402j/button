import {
  CAUSES,
  DEMOGRAPHIC_SHAPE,
  DEMOGRAPHIC_WEIGHTS_BASE64,
  LOCATIONS,
} from "./stats.generated.js";

export const STORAGE_KEY = "jinwoo-button:v1";
export const STORAGE_VERSION = 1;
export const POPULATION_BASE = 8_199_768_010;
export const POPULATION_EPOCH_MS = Date.parse("2026-07-11T12:58:15Z");
export const REWARD_PER_PRESS = 1_000_000;
export const BUTTON_CAUSE_RATE = 0.01;

const MAX_PRESSES = Math.floor(Number.MAX_SAFE_INTEGER / REWARD_PER_PRESS);
const LOCATION_BY_CODE = new Map(LOCATIONS.map((location) => [location.code, location]));
const CAUSE_BY_ID = new Map(CAUSES.map((cause) => [cause.id, cause]));

export function defaultState() {
  return {
    version: STORAGE_VERSION,
    presses: 0,
    lastVictim: null,
  };
}

export function populationAt(nowMs, presses) {
  if (!Number.isFinite(nowMs)) {
    throw new TypeError("nowMs must be finite");
  }
  if (!Number.isSafeInteger(presses) || presses < 0) {
    throw new TypeError("presses must be a non-negative safe integer");
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((nowMs - POPULATION_EPOCH_MS) / 1_000),
  );
  return Math.max(0, POPULATION_BASE + elapsedSeconds * 2 - presses);
}

export function moneyForPresses(presses) {
  if (!Number.isSafeInteger(presses) || presses < 0 || presses > MAX_PRESSES) {
    throw new TypeError("presses is outside the supported range");
  }
  return presses * REWARD_PER_PRESS;
}

export function decodeWeights(base64 = DEMOGRAPHIC_WEIGHTS_BASE64) {
  let bytes;

  if (typeof globalThis.atob === "function") {
    const binary = globalThis.atob(base64);
    bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
  } else if (typeof globalThis.Buffer !== "undefined") {
    bytes = Uint8Array.from(globalThis.Buffer.from(base64, "base64"));
  } else {
    throw new Error("No base64 decoder is available");
  }

  if (bytes.byteLength % Uint32Array.BYTES_PER_ELEMENT !== 0) {
    throw new Error("The demographic payload is not aligned to Uint32 values");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const weights = new Uint32Array(bytes.byteLength / Uint32Array.BYTES_PER_ELEMENT);
  for (let index = 0; index < weights.length; index += 1) {
    weights[index] = view.getUint32(index * Uint32Array.BYTES_PER_ELEMENT, true);
  }
  return weights;
}

export function createUniformRandom(
  cryptoObject = globalThis.crypto,
  fallback = Math.random,
) {
  if (cryptoObject && typeof cryptoObject.getRandomValues === "function") {
    const values = new Uint32Array(2);
    return () => {
      cryptoObject.getRandomValues(values);
      const high27 = values[0] >>> 5;
      const low26 = values[1] >>> 6;
      return (high27 * 67_108_864 + low26) / 9_007_199_254_740_992;
    };
  }

  if (typeof fallback !== "function") {
    throw new TypeError("A random fallback function is required");
  }
  return () => {
    const value = fallback();
    if (!Number.isFinite(value)) {
      throw new Error("The random fallback returned a non-finite value");
    }
    return Math.min(Math.max(value, 0), 1 - Number.EPSILON);
  };
}

export function createWeightedSampler(weights) {
  if (!weights || typeof weights[Symbol.iterator] !== "function") {
    throw new TypeError("weights must be iterable");
  }

  const cumulative = new Float64Array(weights.length);
  let total = 0;
  let index = 0;
  for (const weight of weights) {
    if (!Number.isFinite(weight) || weight < 0) {
      throw new TypeError("weights must be finite and non-negative");
    }
    total += weight;
    cumulative[index] = total;
    index += 1;
  }
  if (!(total > 0) || !Number.isSafeInteger(total)) {
    throw new RangeError("weight total must be a positive safe integer");
  }

  const sampler = (rng = Math.random) => {
    const random = rng();
    if (!Number.isFinite(random)) {
      throw new TypeError("rng must return a finite number");
    }
    const target = Math.min(Math.max(random, 0), 1 - Number.EPSILON) * total;
    let low = 0;
    let high = cumulative.length - 1;
    while (low < high) {
      const middle = low + Math.floor((high - low) / 2);
      if (target < cumulative[middle]) {
        high = middle;
      } else {
        low = middle + 1;
      }
    }
    return low;
  };

  Object.defineProperties(sampler, {
    total: { value: total, enumerable: true },
    cumulative: { value: cumulative, enumerable: false },
  });
  return sampler;
}

export function weightedIndex(weights, rng = Math.random) {
  return createWeightedSampler(weights)(rng);
}

export function sampleVictim({
  locations = LOCATIONS,
  shape = DEMOGRAPHIC_SHAPE,
  causes = CAUSES,
  demographicSampler,
  causeSampler,
  rng = Math.random,
}) {
  if (typeof demographicSampler !== "function" || typeof causeSampler !== "function") {
    throw new TypeError("precomputed demographic and cause samplers are required");
  }

  const cellIndex = demographicSampler(rng);
  const sexesPerAge = shape.sexes.length;
  const cellsPerLocation = shape.ages * sexesPerAge;
  const locationIndex = Math.floor(cellIndex / cellsPerLocation);
  const withinLocation = cellIndex % cellsPerLocation;
  const age = Math.floor(withinLocation / sexesPerAge);
  const sex = shape.sexes[withinLocation % sexesPerAge];
  const location = locations[locationIndex];

  if (!location || !Number.isInteger(age) || !["male", "female"].includes(sex)) {
    throw new Error("The demographic sample decoded outside the configured shape");
  }

  const buttonCause = rng() < BUTTON_CAUSE_RATE;
  const cause = buttonCause ? null : causes[causeSampler(rng)];
  if (!buttonCause && !cause) {
    throw new Error("The cause sample decoded outside the configured table");
  }

  return {
    locationCode: location.code,
    age,
    sex,
    causeId: buttonCause ? "button" : cause.id,
    buttonCause,
  };
}

export function isValidVictim(victim) {
  if (!victim || typeof victim !== "object" || Array.isArray(victim)) {
    return false;
  }
  if (!LOCATION_BY_CODE.has(victim.locationCode)) {
    return false;
  }
  if (!Number.isInteger(victim.age) || victim.age < 0 || victim.age > 100) {
    return false;
  }
  if (!["male", "female"].includes(victim.sex)) {
    return false;
  }
  if (typeof victim.buttonCause !== "boolean") {
    return false;
  }
  if (victim.buttonCause) {
    return victim.causeId === "button";
  }
  return CAUSE_BY_ID.has(victim.causeId);
}

export function parseStoredState(raw) {
  if (raw === null || raw === undefined || raw === "") {
    return { state: defaultState(), recovered: false };
  }

  try {
    const value = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new TypeError("state is not an object");
    }
    if (value.version !== STORAGE_VERSION) {
      throw new TypeError("unsupported state version");
    }
    if (
      !Number.isSafeInteger(value.presses)
      || value.presses < 0
      || value.presses > MAX_PRESSES
    ) {
      throw new TypeError("invalid press count");
    }
    if (value.lastVictim !== null && !isValidVictim(value.lastVictim)) {
      throw new TypeError("invalid victim");
    }
    if (value.presses === 0 && value.lastVictim !== null) {
      throw new TypeError("zero presses cannot have a victim");
    }
    if (value.presses > 0 && value.lastVictim === null) {
      throw new TypeError("positive presses require a victim");
    }

    return {
      state: {
        version: STORAGE_VERSION,
        presses: value.presses,
        lastVictim: value.lastVictim === null ? null : { ...value.lastVictim },
      },
      recovered: false,
    };
  } catch {
    return { state: defaultState(), recovered: true };
  }
}

export function commitPress(state, victim) {
  if (
    !state
    || state.version !== STORAGE_VERSION
    || !Number.isSafeInteger(state.presses)
    || state.presses < 0
    || state.presses >= MAX_PRESSES
  ) {
    throw new TypeError("invalid state");
  }
  if (!isValidVictim(victim)) {
    throw new TypeError("invalid victim");
  }
  return {
    version: STORAGE_VERSION,
    presses: state.presses + 1,
    lastVictim: { ...victim },
  };
}

export function serializeState(state) {
  const checked = parseStoredState(state);
  if (checked.recovered) {
    throw new TypeError("cannot serialize an invalid state");
  }
  return JSON.stringify(checked.state);
}

function initializeGame() {
  const elements = {
    population: document.querySelector("#population"),
    money: document.querySelector("#money"),
    button: document.querySelector("#press-button"),
    location: document.querySelector("#slot-location"),
    age: document.querySelector("#slot-age"),
    sex: document.querySelector("#slot-sex"),
    cause: document.querySelector("#slot-cause"),
    reward: document.querySelector("#reward"),
    warning: document.querySelector("#storage-warning"),
    announcement: document.querySelector("#announcement"),
  };

  if (Object.values(elements).some((element) => !element)) {
    throw new Error("The game markup is incomplete");
  }

  const numberFormatter = new Intl.NumberFormat("ko-KR");
  const moneyFormatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  });
  let regionNames = null;
  try {
    regionNames = new Intl.DisplayNames(["ko"], { type: "region" });
  } catch {
    regionNames = null;
  }

  const weights = decodeWeights();
  const expectedCells = DEMOGRAPHIC_SHAPE.locations
    * DEMOGRAPHIC_SHAPE.ages
    * DEMOGRAPHIC_SHAPE.sexes.length;
  if (weights.length !== expectedCells) {
    throw new Error(`Expected ${expectedCells} demographic cells, got ${weights.length}`);
  }

  const demographicSampler = createWeightedSampler(weights);
  const causeSampler = createWeightedSampler(CAUSES.map((cause) => cause.weight));
  const rng = createUniformRandom();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let state = defaultState();
  let persistenceAvailable = true;
  let rolling = false;

  try {
    const parsed = parseStoredState(window.localStorage.getItem(STORAGE_KEY));
    state = parsed.state;
    if (parsed.recovered) {
      elements.warning.textContent = "기록 망가짐. 처음부터.";
    }
  } catch {
    persistenceAvailable = false;
    elements.warning.textContent = "저장 못 함. 닫으면 잊음.";
  }

  function persist() {
    if (!persistenceAvailable) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, serializeState(state));
    } catch {
      persistenceAvailable = false;
      elements.warning.textContent = "저장 못 함. 닫으면 잊음.";
    }
  }

  function locationLabel(locationCode) {
    const location = LOCATION_BY_CODE.get(locationCode);
    if (!location) {
      return "알 수 없음";
    }
    if (regionNames && location.regionCode) {
      try {
        return regionNames.of(location.regionCode) || location.nameEn;
      } catch {
        // The static UN name remains a deterministic fallback.
      }
    }
    return location.nameEn;
  }

  function ageLabel(age) {
    return age === 100 ? "100세 이상" : `${age}세`;
  }

  function sexLabel(sex) {
    return sex === "male" ? "남성" : "여성";
  }

  function causeLabel(victim) {
    return victim.buttonCause
      ? "버튼"
      : (CAUSE_BY_ID.get(victim.causeId)?.label || "기타");
  }

  function renderVictim(victim) {
    elements.location.textContent = locationLabel(victim.locationCode);
    elements.age.textContent = ageLabel(victim.age);
    elements.sex.textContent = sexLabel(victim.sex);
    elements.cause.textContent = causeLabel(victim);
  }

  function renderPopulation() {
    elements.population.textContent = numberFormatter.format(
      populationAt(Date.now(), state.presses),
    );
  }

  function renderMoney(presses = state.presses) {
    elements.money.textContent = moneyFormatter.format(moneyForPresses(presses));
  }

  function randomLocationText() {
    const location = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
    return locationLabel(location.code);
  }

  function randomCauseText() {
    if (rng() < BUTTON_CAUSE_RATE) {
      return "버튼";
    }
    return CAUSES[Math.floor(rng() * CAUSES.length)].label;
  }

  function announce(victim) {
    elements.announcement.textContent = [
      "한 명 죽음.",
      locationLabel(victim.locationCode),
      ageLabel(victim.age),
      sexLabel(victim.sex),
      `사인 ${causeLabel(victim)}.`,
      "100만원 받음.",
    ].join(" ");
  }

  function impact() {
    document.body.classList.remove("impact");
    void document.body.offsetWidth;
    document.body.classList.add("impact");
    window.setTimeout(() => document.body.classList.remove("impact"), 180);
  }

  function finishRoll(victim, timer, onVisibility) {
    if (!rolling) {
      return;
    }
    if (timer !== null) {
      window.clearInterval(timer);
    }
    document.removeEventListener("visibilitychange", onVisibility);
    renderVictim(victim);
    renderMoney();
    elements.reward.textContent = "한 명 죽음. +100만원.";
    elements.button.textContent = "또 누른다";
    elements.button.disabled = false;
    rolling = false;
    announce(victim);
    impact();
  }

  function startRoll(victim) {
    rolling = true;
    elements.button.disabled = true;
    elements.button.textContent = "고르는 중…";
    elements.reward.textContent = "";

    const startedAt = performance.now();
    const fixed = [false, false, false, false];
    let timer = null;

    const renderAllFinal = () => {
      renderVictim(victim);
      fixed.fill(true);
    };

    const onVisibility = () => {
      if (!document.hidden) {
        tick();
      }
    };

    const tick = () => {
      const elapsed = performance.now() - startedAt;

      if (!fixed[0]) {
        if (elapsed >= 600) {
          elements.location.textContent = locationLabel(victim.locationCode);
          fixed[0] = true;
        } else {
          elements.location.textContent = randomLocationText();
        }
      }
      if (!fixed[1]) {
        if (elapsed >= 800) {
          elements.age.textContent = ageLabel(victim.age);
          fixed[1] = true;
        } else {
          elements.age.textContent = ageLabel(Math.floor(rng() * 101));
        }
      }
      if (!fixed[2]) {
        if (elapsed >= 1_000) {
          elements.sex.textContent = sexLabel(victim.sex);
          fixed[2] = true;
        } else {
          elements.sex.textContent = rng() < 0.5 ? "남성" : "여성";
        }
      }
      if (!fixed[3]) {
        if (elapsed >= 1_200) {
          elements.cause.textContent = causeLabel(victim);
          fixed[3] = true;
        } else {
          elements.cause.textContent = randomCauseText();
        }
      }

      if (elapsed >= 1_200) {
        finishRoll(victim, timer, onVisibility);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    if (reducedMotion.matches) {
      elements.location.textContent = "결정 중…";
      elements.age.textContent = "결정 중…";
      elements.sex.textContent = "결정 중…";
      elements.cause.textContent = "결정 중…";
      window.setTimeout(() => {
        renderAllFinal();
        finishRoll(victim, null, onVisibility);
      }, 250);
      return;
    }

    tick();
    timer = window.setInterval(tick, 70);
  }

  function onPress() {
    if (rolling || state.presses >= MAX_PRESSES) {
      return;
    }

    try {
      const victim = sampleVictim({
        demographicSampler,
        causeSampler,
        rng,
      });
      state = commitPress(state, victim);
      persist();
      renderPopulation();
      startRoll(victim);
    } catch {
      elements.warning.textContent = "추첨 실패. 다시 누름.";
      rolling = false;
      elements.button.disabled = false;
      elements.button.textContent = state.presses > 0 ? "또 누른다" : "누른다";
    }
  }

  renderPopulation();
  renderMoney();
  if (state.lastVictim) {
    renderVictim(state.lastVictim);
    elements.reward.textContent = "지난 기록.";
    elements.button.textContent = "또 누른다";
  }

  elements.button.addEventListener("click", onPress);
  window.setInterval(renderPopulation, 500);
}

if (typeof document !== "undefined") {
  initializeGame();
}
