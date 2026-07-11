import {
  CAUSES,
  DEMOGRAPHIC_SHAPE,
  DEMOGRAPHIC_WEIGHTS_BASE64,
  LOCATIONS,
} from "./stats.generated.js";

export const STORAGE_KEY = "jinwoo-button:v1";
export const STORAGE_VERSION = 2;
export const POPULATION_BASE = 8_199_768_010;
export const POPULATION_EPOCH_MS = Date.parse("2026-07-11T12:58:15Z");
export const REWARD_PER_PRESS = 1_000_000;
export const PROCESSING_OPTIMIZATION_COST = 5_000_000;
export const OPTIMIZED_PROCESSING_COUNT = 2;
export const BUTTON_CAUSE_RATE = 0.01;
export const TARGET_SELECTION_KEY = "jinwoo-button:target:v1";
export const ETHICS_TARGETS = Object.freeze([
  "전 세계 사람 중 무작위 1명",
  "유죄가 확정된 범죄자 중 1명",
  "흉악범 중 1명",
  "사형이 확정된 수형자 중 1명",
  "가상의 사형 집행 예정 시점이 가까운 상위 50% 중 1명",
]);
export const SYNTHETIC_NAMES = Object.freeze([
  "서윤",
  "지호",
  "하린",
  "도윤",
  "민서",
  "유진",
  "수아",
  "현우",
  "지민",
  "하준",
  "나래",
  "시온",
  "다온",
  "연우",
  "이안",
  "가온",
]);
export const CAUSE_TAGS = Object.freeze({
  "ischaemic-heart-disease": "심장",
  "covid-19": "감염",
  stroke: "뇌",
  copd: "폐",
  "lower-respiratory-infections": "감염",
  "trachea-bronchus-lung-cancers": "암",
  "alzheimers-and-other-dementias": "기억",
  "diabetes-mellitus": "혈당",
  "kidney-diseases": "신장",
  tuberculosis: "감염",
  other: "기타",
  button: "버튼",
});
export const SEX_EMOJIS = Object.freeze({
  male: "👨",
  female: "👩",
});
export const CAUSE_EMOJIS = Object.freeze({
  "ischaemic-heart-disease": "🫀",
  "covid-19": "🦠",
  stroke: "🧠",
  copd: "🫁",
  "lower-respiratory-infections": "🫁",
  "trachea-bronchus-lung-cancers": "🎗️",
  "alzheimers-and-other-dementias": "🧠",
  "diabetes-mellitus": "🩸",
  "kidney-diseases": "🩺",
  tuberculosis: "🦠",
  other: "❔",
  button: "🔘",
});
export const MONEY_GOALS = Object.freeze([
  { id: "1m", amount: 1_000_000, requiredPresses: 1, label: "100만원", reward: "첫 거래 기록" },
  { id: "3m", amount: 3_000_000, requiredPresses: 3, label: "300만원", reward: "버튼 잔상" },
  { id: "5m", amount: 5_000_000, requiredPresses: 5, label: "500만원", reward: "CRT 색상" },
  { id: "10m", amount: 10_000_000, requiredPresses: 10, label: "1000만원", reward: "목표 진행률" },
  { id: "25m", amount: 25_000_000, requiredPresses: 25, label: "2500만원", reward: "새 버튼 음색" },
  { id: "100m", amount: 100_000_000, requiredPresses: 100, label: "1억", reward: "SPACE 홀드 입력" },
  { id: "300m", amount: 300_000_000, requiredPresses: 300, label: "3억", reward: "룰렛 가속 Ⅰ" },
  { id: "500m", amount: 500_000_000, requiredPresses: 500, label: "5억", reward: "룰렛 가속 Ⅱ" },
  { id: "1b", amount: 1_000_000_000, requiredPresses: 1_000, label: "10억", reward: "룰렛 가속 Ⅲ" },
  { id: "5b", amount: 5_000_000_000, requiredPresses: 5_000, label: "50억", reward: "룰렛 가속 Ⅳ" },
  { id: "10b", amount: 10_000_000_000, requiredPresses: 10_000, label: "100억", reward: "모든 기능" },
].map(Object.freeze));
export const ROULETTE_DURATIONS_MS = Object.freeze([
  1_200,
  1_200,
  1_200,
  1_200,
  1_200,
  1_200,
  1_200,
  960,
  800,
  650,
  520,
  420,
]);

const MAX_PRESSES = Math.floor(Number.MAX_SAFE_INTEGER / REWARD_PER_PRESS);
const LEGACY_STORAGE_VERSION = 1;
const LOCATION_BY_CODE = new Map(LOCATIONS.map((location) => [location.code, location]));
const CAUSE_BY_ID = new Map(CAUSES.map((cause) => [cause.id, cause]));
const MAX_ANNOUNCEMENTS = 24;
const DISSOLVE_MS = 620;
const RESULT_HOLD_MS = 750;
const MONEY_FLASH_MS = 430;
const MONEY_ROLL_MS = 190;
const BUTTON_PRESS_MS = 80;
const BUTTON_WAVE_MS = 260;
const BUTTON_TRAIL_WAVE_MS = 420;
const CELEBRATION_HOLD_MS = 1_250;
const SPACE_REPEAT_THROTTLE_MS = 90;

export function defaultState() {
  return {
    version: STORAGE_VERSION,
    presses: 0,
    processed: 0,
    balance: 0,
    processingOptimized: false,
    lastVictim: null,
  };
}

export function populationAt(nowMs, processed) {
  if (!Number.isFinite(nowMs)) {
    throw new TypeError("nowMs must be finite");
  }
  if (!Number.isSafeInteger(processed) || processed < 0) {
    throw new TypeError("processed must be a non-negative safe integer");
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((nowMs - POPULATION_EPOCH_MS) / 1_000),
  );
  return Math.max(0, POPULATION_BASE + elapsedSeconds * 2 - processed);
}

export function moneyForPresses(presses) {
  if (!Number.isSafeInteger(presses) || presses < 0 || presses > MAX_PRESSES) {
    throw new TypeError("presses is outside the supported range");
  }
  return presses * REWARD_PER_PRESS;
}

export function parseTargetSelection(raw) {
  if (typeof raw !== "string" || !/^\d$/.test(raw)) {
    return null;
  }
  const index = Number(raw);
  return index >= 0 && index < ETHICS_TARGETS.length ? index : null;
}

export function progressionForPresses(presses) {
  const money = moneyForPresses(presses);
  let unlockedRewardCount = 0;
  while (
    unlockedRewardCount < MONEY_GOALS.length
    && presses >= MONEY_GOALS[unlockedRewardCount].requiredPresses
  ) {
    unlockedRewardCount += 1;
  }

  const previousGoal = unlockedRewardCount > 0
    ? MONEY_GOALS[unlockedRewardCount - 1]
    : null;
  const nextGoal = MONEY_GOALS[unlockedRewardCount] || null;
  const previousPresses = previousGoal?.requiredPresses || 0;
  const segmentPresses = nextGoal
    ? nextGoal.requiredPresses - previousPresses
    : 0;
  const completedSegmentPresses = nextGoal
    ? presses - previousPresses
    : 0;
  const segmentProgress = nextGoal
    ? Math.min(Math.max(completedSegmentPresses / segmentPresses, 0), 1)
    : 1;
  const remainingPresses = nextGoal
    ? Math.max(nextGoal.requiredPresses - presses, 0)
    : 0;

  return {
    money,
    unlockedRewardCount,
    previousGoal,
    nextGoal,
    segmentProgress,
    progressPercent: Math.floor(segmentProgress * 100),
    remainingPresses,
    remainingMoney: remainingPresses * REWARD_PER_PRESS,
    complete: nextGoal === null,
    tradeRecordUnlocked: presses >= 1,
    buttonTrailUnlocked: presses >= 3,
    crtColorUnlocked: presses >= 5,
    progressUnlocked: presses >= 10,
    enhancedSwitchToneUnlocked: presses >= 25,
    holdSpaceUnlocked: presses >= 100,
    rouletteDurationMs: ROULETTE_DURATIONS_MS[unlockedRewardCount],
  };
}

export function rouletteStopTimes(durationMs) {
  if (!Number.isSafeInteger(durationMs) || durationMs <= 0) {
    throw new TypeError("durationMs must be a positive safe integer");
  }
  return [
    Math.round(durationMs * (5 / 12)),
    Math.round(durationMs * (13 / 24)),
    Math.round(durationMs * (2 / 3)),
    Math.round(durationMs * (5 / 6)),
    durationMs,
  ];
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

export function syntheticNameFor(victim, sequence, slot = 0) {
  if (
    !isValidVictim(victim)
    || !Number.isSafeInteger(sequence)
    || sequence <= 0
    || !Number.isSafeInteger(slot)
    || slot < 0
  ) {
    throw new TypeError("invalid synthetic name salt");
  }

  const seed = [
    victim.locationCode,
    victim.age,
    victim.sex,
    victim.causeId,
    victim.buttonCause ? 1 : 0,
    sequence,
    slot,
  ].join("|");
  let hash = 2_166_136_261;
  for (const character of seed) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return SYNTHETIC_NAMES[(hash >>> 0) % SYNTHETIC_NAMES.length];
}

export function ageBarFor(age) {
  if (!Number.isInteger(age) || age < 0 || age > 100) {
    throw new TypeError("invalid age");
  }
  const filled = age === 100 ? 10 : Math.floor(age / 10);
  return `${"■".repeat(filled)}${"░".repeat(10 - filled)}`;
}

export function causeTagFor(victim) {
  if (!isValidVictim(victim)) {
    throw new TypeError("invalid victim");
  }
  return CAUSE_TAGS[victim.buttonCause ? "button" : victim.causeId] || "기타";
}

function validatePressAndVictimFields(value) {
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
}

function normalizeLegacyState(value) {
  validatePressAndVictimFields(value);
  return {
    version: STORAGE_VERSION,
    presses: value.presses,
    processed: value.presses,
    balance: moneyForPresses(value.presses),
    processingOptimized: false,
    lastVictim: value.lastVictim === null ? null : { ...value.lastVictim },
  };
}

function normalizeCurrentState(value) {
  validatePressAndVictimFields(value);
  if (
    !Number.isSafeInteger(value.processed)
    || value.processed < 0
    || value.processed > MAX_PRESSES
  ) {
    throw new TypeError("invalid processed count");
  }
  if (!Number.isSafeInteger(value.balance) || value.balance < 0) {
    throw new TypeError("invalid balance");
  }
  if (typeof value.processingOptimized !== "boolean") {
    throw new TypeError("invalid optimization state");
  }
  if (!value.processingOptimized && value.processed !== value.presses) {
    throw new TypeError("base processing count is inconsistent");
  }
  if (
    value.processingOptimized
    && (
      value.presses < 5
      || value.processed < value.presses
      || value.processed > value.presses * OPTIMIZED_PROCESSING_COUNT
    )
  ) {
    throw new TypeError("optimized processing count is inconsistent");
  }

  const expectedBalance = moneyForPresses(value.processed)
    - (value.processingOptimized ? PROCESSING_OPTIMIZATION_COST : 0);
  if (value.balance !== expectedBalance) {
    throw new TypeError("balance is inconsistent");
  }

  return {
    version: STORAGE_VERSION,
    presses: value.presses,
    processed: value.processed,
    balance: value.balance,
    processingOptimized: value.processingOptimized,
    lastVictim: value.lastVictim === null ? null : { ...value.lastVictim },
  };
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
    if (
      value.version !== LEGACY_STORAGE_VERSION
      && value.version !== STORAGE_VERSION
    ) {
      throw new TypeError("unsupported state version");
    }
    return {
      state: value.version === LEGACY_STORAGE_VERSION
        ? normalizeLegacyState(value)
        : normalizeCurrentState(value),
      recovered: false,
    };
  } catch {
    return { state: defaultState(), recovered: true };
  }
}

export function canPurchaseProcessingOptimization(state) {
  const checked = parseStoredState(state);
  return !checked.recovered
    && !checked.state.processingOptimized
    && checked.state.balance >= PROCESSING_OPTIMIZATION_COST;
}

export function purchaseProcessingOptimization(state) {
  const checked = parseStoredState(state);
  if (checked.recovered || !canPurchaseProcessingOptimization(checked.state)) {
    throw new TypeError("processing optimization is unavailable");
  }
  return {
    ...checked.state,
    balance: checked.state.balance - PROCESSING_OPTIMIZATION_COST,
    processingOptimized: true,
  };
}

export function commitPress(state, victimOrVictims) {
  const checked = parseStoredState(state);
  if (checked.recovered) {
    throw new TypeError("invalid state");
  }
  const current = checked.state;
  const processedPerPress = current.processingOptimized
    ? OPTIMIZED_PROCESSING_COUNT
    : 1;
  const victims = Array.isArray(victimOrVictims)
    ? victimOrVictims
    : [victimOrVictims];
  const reward = processedPerPress * REWARD_PER_PRESS;
  if (
    current.presses >= MAX_PRESSES
    || current.processed > MAX_PRESSES - processedPerPress
    || current.balance > Number.MAX_SAFE_INTEGER - reward
  ) {
    throw new TypeError("invalid state");
  }
  if (
    victims.length !== processedPerPress
    || victims.some((victim) => !isValidVictim(victim))
  ) {
    throw new TypeError("invalid victims");
  }
  return {
    version: STORAGE_VERSION,
    presses: current.presses + 1,
    processed: current.processed + processedPerPress,
    balance: current.balance + reward,
    processingOptimized: current.processingOptimized,
    lastVictim: { ...victims.at(-1) },
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
    statusBar: document.querySelector("#status-bar"),
    population: document.querySelector("#population"),
    money: document.querySelector("#money"),
    moneyDisplay: document.querySelector("#money-display"),
    targetLabel: document.querySelector("#target-label"),
    processingUpgrade: document.querySelector("#processing-upgrade"),
    processingStatus: document.querySelector("#processing-status"),
    tradeRecord: document.querySelector("#trade-record"),
    focusStage: document.querySelector("#focus-stage"),
    ethicsPrompt: document.querySelector("#ethics-prompt"),
    ethicsQuestion: document.querySelector("#ethics-question"),
    ethicsReward: document.querySelector("#ethics-reward"),
    ethicsActions: document.querySelector("#ethics-actions"),
    ethicsAccept: document.querySelector("#ethics-accept"),
    ethicsReject: document.querySelector("#ethics-reject"),
    goalStatus: document.querySelector("#goal-status"),
    goalLabel: document.querySelector("#goal-label"),
    goalValue: document.querySelector("#goal-value"),
    goalProgress: document.querySelector("#goal-progress"),
    celebration: document.querySelector("#celebration"),
    celebrationGoal: document.querySelector("#celebration-goal"),
    celebrationReward: document.querySelector("#celebration-reward"),
    button: document.querySelector("#press-button"),
    buttonWave: document.querySelector("#button-wave"),
    log: document.querySelector("#roulette-log"),
    template: document.querySelector("#roulette-entry-template"),
    warning: document.querySelector("#storage-warning"),
    announcements: document.querySelector("#announcements"),
  };

  if (
    !elements.statusBar
    || !elements.population
    || !elements.money
    || !elements.moneyDisplay
    || !elements.targetLabel
    || !elements.processingUpgrade
    || !elements.processingStatus
    || !elements.tradeRecord
    || !elements.focusStage
    || !elements.ethicsPrompt
    || !elements.ethicsQuestion
    || !elements.ethicsReward
    || !elements.ethicsActions
    || !elements.ethicsAccept
    || !elements.ethicsReject
    || !elements.goalStatus
    || !elements.goalLabel
    || !elements.goalValue
    || !elements.goalProgress
    || !elements.celebration
    || !elements.celebrationGoal
    || !elements.celebrationReward
    || !elements.button
    || !elements.buttonWave
    || !elements.log
    || !elements.template
    || !elements.warning
    || !elements.announcements
  ) {
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
  const activeRolls = new Set();
  const celebrationQueue = [];
  let rollTimer = null;
  let moneyFlashTimer = null;
  let moneyRollTimer = null;
  let buttonPressTimer = null;
  let buttonWaveTimer = null;
  let audioContext = null;
  let clickNoiseBuffer = null;
  let celebrationActive = false;
  let pendingMoneyFlash = false;
  let pendingMoneyRoll = false;
  let lastSpacePressAt = Number.NEGATIVE_INFINITY;
  let gameStarted = false;
  let selectedTargetIndex = null;
  let questionIndex = 0;
  let targetStorageAvailable = true;

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

  function loadTargetSelection() {
    if (!targetStorageAvailable) {
      return selectedTargetIndex;
    }
    try {
      return parseTargetSelection(
        window.sessionStorage.getItem(TARGET_SELECTION_KEY),
      );
    } catch {
      targetStorageAvailable = false;
      return selectedTargetIndex;
    }
  }

  function saveTargetSelection(index) {
    selectedTargetIndex = index;
    if (!targetStorageAvailable) {
      return;
    }
    try {
      window.sessionStorage.setItem(TARGET_SELECTION_KEY, String(index));
    } catch {
      targetStorageAvailable = false;
    }
  }

  function renderEthicsQuestion() {
    const target = ETHICS_TARGETS[questionIndex];
    elements.ethicsPrompt.classList.remove("is-dissolving", "is-refused");
    elements.ethicsQuestion.textContent = `대상: ${target}. 한 명 죽는다.`;
    elements.ethicsQuestion.setAttribute(
      "aria-label",
      `대상: ${target}. 한 명 죽는다.`,
    );
    elements.ethicsReward.hidden = false;
    elements.ethicsActions.hidden = false;
    elements.ethicsAccept.setAttribute(
      "aria-label",
      `대상 ${target}. 받아들인다.`,
    );
    elements.ethicsReject.setAttribute(
      "aria-label",
      `대상 ${target}. 거부한다.`,
    );
  }

  function revealGame({ focusButton = true } = {}) {
    if (selectedTargetIndex === null) {
      return;
    }

    gameStarted = true;
    elements.ethicsPrompt.hidden = true;
    elements.ethicsPrompt.classList.remove("is-dissolving");
    elements.statusBar.hidden = false;
    elements.moneyDisplay.hidden = false;
    elements.warning.hidden = false;
    elements.announcements.hidden = false;
    elements.button.hidden = false;
    elements.button.removeAttribute("aria-hidden");
    elements.buttonWave.hidden = false;
    elements.targetLabel.textContent = `대상: ${ETHICS_TARGETS[selectedTargetIndex]}`;
    elements.targetLabel.hidden = false;
    if (pendingMoneyFlash) {
      flashMoneyDisplay();
    }
    if (pendingMoneyRoll) {
      rollMoneyDisplay();
    }
    showNextCelebration();
    if (focusButton) {
      elements.button.focus({ preventScroll: true });
    }
  }

  function acceptEthicsQuestion() {
    if (gameStarted || questionIndex >= ETHICS_TARGETS.length) {
      return;
    }

    saveTargetSelection(questionIndex);
    const finish = () => revealGame();
    if (reducedMotion.matches) {
      finish();
      return;
    }

    elements.ethicsPrompt.classList.add("is-dissolving");
    window.setTimeout(finish, DISSOLVE_MS);
  }

  function rejectEthicsQuestion() {
    if (gameStarted || questionIndex >= ETHICS_TARGETS.length) {
      return;
    }
    if (questionIndex < ETHICS_TARGETS.length - 1) {
      questionIndex += 1;
      renderEthicsQuestion();
      return;
    }

    questionIndex = ETHICS_TARGETS.length;
    elements.ethicsPrompt.classList.add("is-refused");
    elements.ethicsQuestion.textContent = "너는 누르지 않았다.";
    elements.ethicsQuestion.setAttribute("aria-label", "너는 누르지 않았다.");
    elements.ethicsReward.hidden = true;
    elements.ethicsActions.hidden = true;
    elements.ethicsQuestion.focus({ preventScroll: true });
  }

  function onEthicsDecisionKeyDown(event) {
    if (event.code !== "Space" && event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    if (event.currentTarget === elements.ethicsAccept) {
      acceptEthicsQuestion();
    } else {
      rejectEthicsQuestion();
    }
  }

  function initializeEthicsFlow() {
    const restoredTargetIndex = loadTargetSelection();
    if (restoredTargetIndex !== null) {
      selectedTargetIndex = restoredTargetIndex;
      revealGame({ focusButton: false });
      return;
    }
    renderEthicsQuestion();
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

  function ageDisplay(age) {
    return `${ageLabel(age)}  ${ageBarFor(age)}`;
  }

  function setEmojiField(element, emoji, label) {
    element.dataset.emoji = emoji;
    element.textContent = label;
  }

  function setSexDisplay(element, sex) {
    setEmojiField(element, SEX_EMOJIS[sex] || "❔", sexLabel(sex));
  }

  function setCauseDisplay(element, victim) {
    const causeId = victim.buttonCause ? "button" : victim.causeId;
    setEmojiField(
      element,
      CAUSE_EMOJIS[causeId] || CAUSE_EMOJIS.other,
      causeLabel(victim),
    );
  }

  function renderPopulation() {
    elements.population.textContent = numberFormatter.format(
      populationAt(Date.now(), state.processed),
    );
  }

  function flashMoneyDisplay() {
    if (elements.moneyDisplay.hidden) {
      pendingMoneyFlash = true;
      return;
    }

    pendingMoneyFlash = false;
    if (moneyFlashTimer !== null) {
      window.clearTimeout(moneyFlashTimer);
    }
    elements.moneyDisplay.classList.remove("is-increased");
    void elements.moneyDisplay.offsetWidth;
    elements.moneyDisplay.classList.add("is-increased");
    moneyFlashTimer = window.setTimeout(() => {
      elements.moneyDisplay.classList.remove("is-increased");
      moneyFlashTimer = null;
    }, MONEY_FLASH_MS);
  }

  function rollMoneyDisplay() {
    if (reducedMotion.matches) {
      pendingMoneyRoll = false;
      return;
    }
    if (elements.moneyDisplay.hidden) {
      pendingMoneyRoll = true;
      return;
    }

    pendingMoneyRoll = false;
    if (moneyRollTimer !== null) {
      window.clearTimeout(moneyRollTimer);
    }
    elements.moneyDisplay.classList.remove("is-rolling");
    void elements.moneyDisplay.offsetWidth;
    elements.moneyDisplay.classList.add("is-rolling");
    moneyRollTimer = window.setTimeout(() => {
      elements.moneyDisplay.classList.remove("is-rolling");
      moneyRollTimer = null;
    }, MONEY_ROLL_MS);
  }

  function renderMoney(
    balance = state.balance,
    { flash = false, roll = false } = {},
  ) {
    elements.money.textContent = moneyFormatter.format(balance);
    if (roll) {
      rollMoneyDisplay();
    }
    if (flash) {
      flashMoneyDisplay();
    }
  }

  function renderProcessingUpgrade() {
    const purchased = state.processingOptimized;
    elements.processingUpgrade.hidden = purchased;
    elements.processingStatus.hidden = !purchased;
    elements.processingUpgrade.disabled = purchased
      || !canPurchaseProcessingOptimization(state);
  }

  function renderUnlocks(progression = progressionForPresses(state.presses)) {
    elements.tradeRecord.hidden = !progression.tradeRecordUnlocked;
    elements.tradeRecord.textContent = progression.tradeRecordUnlocked
      ? `거래 ${numberFormatter.format(state.presses)}회`
      : "";
    document.body.classList.toggle(
      "has-button-trail",
      progression.buttonTrailUnlocked,
    );
    document.body.classList.toggle(
      "has-crt-color",
      progression.crtColorUnlocked,
    );
  }

  function getAudioContext() {
    try {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) {
        return null;
      }
      if (audioContext?.state === "closed") {
        audioContext = null;
        clickNoiseBuffer = null;
      }
      if (audioContext === null) {
        try {
          audioContext = new AudioContextConstructor({ latencyHint: "interactive" });
        } catch {
          audioContext = new AudioContextConstructor();
        }
      }
      if (audioContext.state === "suspended") {
        void audioContext.resume().catch(() => {});
      }
      return audioContext;
    } catch {
      return null;
    }
  }

  function getClickNoiseBuffer(context) {
    if (clickNoiseBuffer !== null) {
      return clickNoiseBuffer;
    }

    const frameCount = Math.max(1, Math.floor(context.sampleRate * 0.032));
    clickNoiseBuffer = context.createBuffer(1, frameCount, context.sampleRate);
    const samples = clickNoiseBuffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      const decay = 1 - index / samples.length;
      samples[index] = (Math.random() * 2 - 1) * decay;
    }
    return clickNoiseBuffer;
  }

  function playSwitchClick(enhanced = false) {
    try {
      const context = getAudioContext();
      if (!context) {
        return;
      }

      const now = context.currentTime;
      const noise = context.createBufferSource();
      const noiseFilter = context.createBiquadFilter();
      const noiseGain = context.createGain();
      noise.buffer = getClickNoiseBuffer(context);
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(enhanced ? 2_600 : 1_850, now);
      noiseFilter.Q.setValueAtTime(0.72, now);
      noiseGain.gain.setValueAtTime(enhanced ? 0.052 : 0.042, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);
      noise.connect(noiseFilter).connect(noiseGain).connect(context.destination);
      noise.start(now);
      noise.stop(now + 0.04);

      const switchTone = context.createOscillator();
      const switchGain = context.createGain();
      switchTone.type = enhanced ? "square" : "triangle";
      switchTone.frequency.setValueAtTime(enhanced ? 620 : 280, now);
      switchTone.frequency.exponentialRampToValueAtTime(
        enhanced ? 110 : 72,
        now + 0.045,
      );
      switchGain.gain.setValueAtTime(enhanced ? 0.018 : 0.014, now);
      switchGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);
      switchTone.connect(switchGain).connect(context.destination);
      switchTone.start(now);
      switchTone.stop(now + 0.05);
    } catch {
      // Audio feedback is optional and never blocks a press.
    }
  }

  function vibrateButton() {
    if (
      reducedMotion.matches
      || navigator.maxTouchPoints <= 0
      || typeof navigator.vibrate !== "function"
    ) {
      return;
    }
    try {
      navigator.vibrate(8);
    } catch {
      // Haptic feedback is optional and never blocks a press.
    }
  }

  function playButtonFeedback(progression) {
    playSwitchClick(progression.enhancedSwitchToneUnlocked);
    vibrateButton();

    if (reducedMotion.matches) {
      return;
    }

    if (buttonPressTimer !== null) {
      window.clearTimeout(buttonPressTimer);
    }
    elements.button.classList.remove("is-pressed");
    void elements.button.offsetWidth;
    elements.button.classList.add("is-pressed");
    buttonPressTimer = window.setTimeout(() => {
      elements.button.classList.remove("is-pressed");
      buttonPressTimer = null;
    }, BUTTON_PRESS_MS);

    if (buttonWaveTimer !== null) {
      window.clearTimeout(buttonWaveTimer);
    }
    elements.buttonWave.classList.remove("is-active");
    void elements.buttonWave.offsetWidth;
    elements.buttonWave.classList.add("is-active");
    buttonWaveTimer = window.setTimeout(() => {
      elements.buttonWave.classList.remove("is-active");
      buttonWaveTimer = null;
    }, progression.buttonTrailUnlocked
      ? BUTTON_TRAIL_WAVE_MS
      : BUTTON_WAVE_MS);
  }

  function renderGoal(progression = progressionForPresses(state.presses)) {
    elements.goalStatus.classList.toggle("is-complete", progression.complete);

    if (progression.complete) {
      elements.goalLabel.textContent = "목표";
      elements.goalValue.textContent = "전부 달성";
      elements.goalProgress.hidden = true;
      elements.goalProgress.textContent = "";
      return;
    }

    elements.goalLabel.textContent = "다음 목표";
    elements.goalValue.textContent = progression.nextGoal.label;
    elements.goalProgress.hidden = !progression.progressUnlocked;
    elements.goalProgress.textContent = progression.progressUnlocked
      ? `진행 ${progression.progressPercent}%`
      : "";
  }

  function showNextCelebration() {
    if (
      celebrationActive
      || celebrationQueue.length === 0
      || !gameStarted
    ) {
      return;
    }

    celebrationActive = true;
    const goal = celebrationQueue.shift();
    elements.celebrationGoal.textContent = goal.label;
    elements.celebrationReward.textContent = `기능 해금 · ${goal.reward}`;
    elements.celebration.classList.remove("is-dissolving");
    elements.celebration.hidden = false;
    elements.focusStage.classList.add("is-celebrating");
    announceGoal(goal);

    window.setTimeout(() => {
      const finish = () => {
        elements.celebration.hidden = true;
        elements.celebration.classList.remove("is-dissolving");
        elements.focusStage.classList.remove("is-celebrating");
        celebrationActive = false;
        showNextCelebration();
      };

      if (reducedMotion.matches) {
        finish();
        return;
      }

      elements.celebration.classList.add("is-dissolving");
      window.setTimeout(finish, DISSOLVE_MS);
    }, CELEBRATION_HOLD_MS);
  }

  function queueCelebrations(previousCount, nextCount) {
    for (let index = previousCount; index < nextCount; index += 1) {
      const goal = MONEY_GOALS[index];
      if (goal) {
        celebrationQueue.push(goal);
      }
    }
    showNextCelebration();
  }

  function randomLocationText() {
    const location = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
    return locationLabel(location.code);
  }

  function setRandomCauseDisplay(element) {
    if (rng() < BUTTON_CAUSE_RATE) {
      setEmojiField(element, CAUSE_EMOJIS.button, "버튼");
      return;
    }
    const cause = CAUSES[Math.floor(rng() * CAUSES.length)];
    setEmojiField(
      element,
      CAUSE_EMOJIS[cause.id] || CAUSE_EMOJIS.other,
      cause.label,
    );
  }

  function createLogEntry() {
    const fragment = elements.template.content.cloneNode(true);
    const item = fragment.querySelector(".log-entry");
    const entry = {
      item,
      location: item?.querySelector("[data-log-location]"),
      name: item?.querySelector("[data-log-name]"),
      age: item?.querySelector("[data-log-age]"),
      sex: item?.querySelector("[data-log-sex]"),
      cause: item?.querySelector("[data-log-cause]"),
      result: item?.querySelector("[data-log-result]"),
    };

    if (Object.values(entry).some((element) => !element)) {
      throw new Error("The roulette log template is incomplete");
    }

    elements.log.appendChild(fragment);
    elements.log.scrollTop = elements.log.scrollHeight;
    return entry;
  }

  function renderEntryVictim(entry, victim, name) {
    entry.location.textContent = locationLabel(victim.locationCode);
    entry.name.textContent = name;
    entry.age.textContent = ageDisplay(victim.age);
    setSexDisplay(entry.sex, victim.sex);
    setCauseDisplay(entry.cause, victim);
  }

  function announce(victim, sequence, name) {
    const message = document.createElement("p");
    message.textContent = [
      `${sequence}번째.`,
      "한 명 죽음.",
      locationLabel(victim.locationCode),
      `가상 이름 ${name}.`,
      ageLabel(victim.age),
      sexLabel(victim.sex),
      `사인 ${causeLabel(victim)}.`,
      "100만원 받음.",
    ].join(" ");

    elements.announcements.appendChild(message);
    while (elements.announcements.childElementCount > MAX_ANNOUNCEMENTS) {
      elements.announcements.firstElementChild?.remove();
    }
  }

  function announceProcessingOptimization() {
    const message = document.createElement("p");
    message.textContent = "처리 최적화 구매. 500만원 지불. 처리 효율 2배.";
    elements.announcements.appendChild(message);
    while (elements.announcements.childElementCount > MAX_ANNOUNCEMENTS) {
      elements.announcements.firstElementChild?.remove();
    }
  }

  function announceGoal(goal) {
    const message = document.createElement("p");
    message.textContent = `목표 ${goal.label} 달성. ${goal.reward} 해금.`;
    elements.announcements.appendChild(message);
    while (elements.announcements.childElementCount > MAX_ANNOUNCEMENTS) {
      elements.announcements.firstElementChild?.remove();
    }
  }

  function scheduleEntryRemoval(item) {
    window.setTimeout(() => {
      if (reducedMotion.matches) {
        item.remove();
        return;
      }

      item.classList.add("is-dissolving");
      window.setTimeout(() => item.remove(), DISSOLVE_MS);
    }, RESULT_HOLD_MS);
  }

  function finishEntry(
    entry,
    victim,
    sequence,
    name,
    { announceResult = true, impactResult = true } = {},
  ) {
    renderEntryVictim(entry, victim, name);
    entry.result.textContent = "한 명 죽음. +100만원.";
    entry.item.classList.add("is-complete");

    if (impactResult && !reducedMotion.matches) {
      entry.item.classList.add("is-impact");
      window.setTimeout(() => entry.item.classList.remove("is-impact"), 180);
    }

    if (announceResult) {
      announce(victim, sequence, name);
    }

    elements.log.scrollTop = elements.log.scrollHeight;

    scheduleEntryRemoval(entry.item);
  }

  function stopRollTimerIfIdle() {
    if (activeRolls.size === 0 && rollTimer !== null) {
      window.clearInterval(rollTimer);
      rollTimer = null;
    }
  }

  function finishRoll(roll) {
    if (!activeRolls.has(roll)) {
      return;
    }
    activeRolls.delete(roll);
    finishEntry(roll.entry, roll.victim, roll.sequence, roll.name);
    stopRollTimerIfIdle();
  }

  function tickRoll(roll, now) {
    const elapsed = now - roll.startedAt;
    const [locationStop, nameStop, ageStop, sexStop, causeStop] = roll.stopTimes;

    if (!roll.fixed[0]) {
      if (elapsed >= locationStop) {
        roll.entry.location.textContent = locationLabel(roll.victim.locationCode);
        roll.fixed[0] = true;
      } else {
        roll.entry.location.textContent = randomLocationText();
      }
    }
    if (!roll.fixed[1]) {
      if (elapsed >= nameStop) {
        roll.entry.name.textContent = roll.name;
        roll.fixed[1] = true;
      } else {
        roll.entry.name.textContent = SYNTHETIC_NAMES[
          Math.floor(rng() * SYNTHETIC_NAMES.length)
        ];
      }
    }
    if (!roll.fixed[2]) {
      if (elapsed >= ageStop) {
        roll.entry.age.textContent = ageDisplay(roll.victim.age);
        roll.fixed[2] = true;
      } else {
        roll.entry.age.textContent = ageDisplay(Math.floor(rng() * 101));
      }
    }
    if (!roll.fixed[3]) {
      if (elapsed >= sexStop) {
        setSexDisplay(roll.entry.sex, roll.victim.sex);
        roll.fixed[3] = true;
      } else {
        setSexDisplay(roll.entry.sex, rng() < 0.5 ? "male" : "female");
      }
    }
    if (!roll.fixed[4]) {
      if (elapsed >= causeStop) {
        setCauseDisplay(roll.entry.cause, roll.victim);
        roll.fixed[4] = true;
      } else {
        setRandomCauseDisplay(roll.entry.cause);
      }
    }

    if (elapsed >= causeStop) {
      finishRoll(roll);
    }
  }

  function tickActiveRolls() {
    const now = performance.now();
    for (const roll of Array.from(activeRolls)) {
      tickRoll(roll, now);
    }
  }

  function ensureRollTimer() {
    if (rollTimer === null) {
      rollTimer = window.setInterval(tickActiveRolls, 70);
    }
  }

  function startRoll(victim, sequence, progression, slot = 0) {
    const entry = createLogEntry();
    const name = syntheticNameFor(victim, sequence, slot);

    if (reducedMotion.matches) {
      entry.location.textContent = "결정 중…";
      entry.name.textContent = "결정 중…";
      entry.age.textContent = "결정 중…";
      entry.sex.textContent = "결정 중…";
      entry.cause.textContent = "결정 중…";
      window.setTimeout(() => finishEntry(entry, victim, sequence, name), 250);
      return;
    }

    const roll = {
      entry,
      victim,
      sequence,
      name,
      startedAt: performance.now(),
      fixed: [false, false, false, false, false],
      stopTimes: rouletteStopTimes(progression.rouletteDurationMs),
    };
    activeRolls.add(roll);
    tickRoll(roll, roll.startedAt);
    ensureRollTimer();
  }

  function onVisibility() {
    if (document.hidden) {
      releaseSpaceKey();
      return;
    }
    tickActiveRolls();
  }

  function isEditableTarget(target) {
    return Boolean(
      target
      && (
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
        || target.isContentEditable
      )
    );
  }

  function onSpaceKeyDown(event) {
    if (
      event.code !== "Space"
      || event.isComposing
    ) {
      return;
    }
    if (
      event.target === elements.ethicsAccept
      || event.target === elements.ethicsReject
    ) {
      return;
    }
    if (!gameStarted) {
      event.preventDefault();
      return;
    }
    if (
      event.target === elements.processingUpgrade
      || isEditableTarget(event.target)
    ) {
      return;
    }

    event.preventDefault();
    const progression = progressionForPresses(state.presses);
    if (event.repeat && !progression.holdSpaceUnlocked) {
      return;
    }

    const now = performance.now();
    if (event.repeat && now - lastSpacePressAt < SPACE_REPEAT_THROTTLE_MS) {
      return;
    }

    lastSpacePressAt = now;
    elements.button.classList.add("is-key-active");
    onPress();
  }

  function onSpaceKeyUp(event) {
    if (
      event.code !== "Space"
      || event.target === elements.ethicsAccept
      || event.target === elements.ethicsReject
      || event.target === elements.processingUpgrade
    ) {
      return;
    }
    if (!gameStarted) {
      event.preventDefault();
      releaseSpaceKey();
      return;
    }
    if (!isEditableTarget(event.target)) {
      event.preventDefault();
    }
    releaseSpaceKey();
  }

  function releaseSpaceKey() {
    elements.button.classList.remove("is-key-active");
  }

  function onPurchaseProcessingOptimization() {
    if (!gameStarted || !canPurchaseProcessingOptimization(state)) {
      renderProcessingUpgrade();
      return;
    }

    try {
      state = purchaseProcessingOptimization(state);
      persist();
      renderMoney(state.balance);
      renderProcessingUpgrade();
      announceProcessingOptimization();
      elements.button.focus({ preventScroll: true });
    } catch {
      elements.warning.textContent = "구매 실패. 다시 누름.";
    }
  }

  function onProcessingUpgradeKeyDown(event) {
    if (
      !gameStarted
      || (event.code !== "Space" && event.key !== "Enter")
    ) {
      return;
    }
    event.preventDefault();
    onPurchaseProcessingOptimization();
  }

  function onPress() {
    if (!gameStarted) {
      return;
    }
    if (state.presses >= MAX_PRESSES) {
      elements.button.disabled = true;
      return;
    }

    try {
      const previousProgression = progressionForPresses(state.presses);
      const optimized = state.processingOptimized;
      const victimCount = optimized ? OPTIMIZED_PROCESSING_COUNT : 1;
      const victims = Array.from({ length: victimCount }, () => (
        sampleVictim({
          demographicSampler,
          causeSampler,
          rng,
        })
      ));
      state = commitPress(state, optimized ? victims : victims[0]);
      const nextProgression = progressionForPresses(state.presses);
      renderUnlocks(nextProgression);
      playButtonFeedback(nextProgression);
      persist();
      renderPopulation();
      renderMoney(state.balance, { flash: true, roll: true });
      renderProcessingUpgrade();
      renderGoal(nextProgression);
      const firstSequence = state.processed - victims.length + 1;
      victims.forEach((victim, slot) => {
        startRoll(victim, firstSequence + slot, nextProgression, slot);
      });
      if (
        nextProgression.unlockedRewardCount
        > previousProgression.unlockedRewardCount
      ) {
        queueCelebrations(
          previousProgression.unlockedRewardCount,
          nextProgression.unlockedRewardCount,
        );
      }
    } catch {
      elements.warning.textContent = "추첨 실패. 다시 누름.";
    }
  }

  renderPopulation();
  renderMoney();
  renderProcessingUpgrade();
  const initialProgression = progressionForPresses(state.presses);
  renderUnlocks(initialProgression);
  renderGoal(initialProgression);
  initializeEthicsFlow();

  elements.button.addEventListener("click", onPress);
  elements.ethicsAccept.addEventListener("click", acceptEthicsQuestion);
  elements.ethicsReject.addEventListener("click", rejectEthicsQuestion);
  elements.ethicsAccept.addEventListener("keydown", onEthicsDecisionKeyDown);
  elements.ethicsReject.addEventListener("keydown", onEthicsDecisionKeyDown);
  elements.processingUpgrade.addEventListener(
    "click",
    onPurchaseProcessingOptimization,
  );
  elements.processingUpgrade.addEventListener(
    "keydown",
    onProcessingUpgradeKeyDown,
  );
  document.addEventListener("keydown", onSpaceKeyDown);
  document.addEventListener("keyup", onSpaceKeyUp);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("blur", releaseSpaceKey);
  window.setInterval(renderPopulation, 500);
}

if (typeof document !== "undefined") {
  initializeGame();
}
