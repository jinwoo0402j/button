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
export const PLAYER_SETUP_KEY = "jinwoo-button:player:v1";
const SFX_PREFERENCE_KEY = "jinwoo-button:sfx:v1";
const BGM_PREFERENCE_KEY = "jinwoo-button:bgm:v1";
const DIALOGUE_BLIP_VOLUME_KEY = "jinwoo-button:dialogue-blip-volume:v1";
const SFX_MASTER_GAIN = 0.65;
const SFX_ROULETTE_INTERVAL_MS = 60;
const SFX_PRESS_VOICE_LIMIT = 3;
const DIALOGUE_BLIP_INTERVAL_MS = 60;
const DIALOGUE_BLIP_VOICE_LIMIT = 2;
const DIALOGUE_BLIP_VOLUME_DEFAULT = 1.4;
const DIALOGUE_BLIP_VOLUME_MIN = 0;
const DIALOGUE_BLIP_VOLUME_MAX = 2;
const DIALOGUE_BLIP_PROFILE = Object.freeze({
  oscillatorType: "triangle",
  startFrequencyHz: 220,
  endFrequencyHz: 196,
  lowpassFrequencyHz: 1_400,
  lowpassQ: 0.7,
  peakGain: 0.07,
  sustainGain: 0.028,
  attackMs: 3,
  sustainMs: 24,
  releaseMs: 58,
  durationMs: 62,
  detuneCents: Object.freeze([-10, -3, 4, 9]),
});
const OPENING_PARALLAX_PROFILE = Object.freeze({
  roomXInCqw: 0.45,
  roomYInCqh: 0.3,
  demonXInCqw: 0.9,
  demonYInCqh: 0.6,
});
const BGM_MASTER_GAIN = 0.18;
const BGM_TITLE_GAIN = 0.15;
const BGM_DUCK_GAIN = 0.08;
const BGM_FADE_IN_MS = 1_500;
const BGM_DUCK_ATTACK_MS = 80;
const BGM_DUCK_HOLD_MS = 500;
const BGM_DUCK_RELEASE_MS = 500;
const BGM_EARLY_END_FADE_MS = 1_000;
const BGM_DEFINITIONS = Object.freeze({
  title: Object.freeze({
    path: "./assets/audio/bgm-title-neon-static.mp3",
    gain: BGM_TITLE_GAIN,
  }),
  contract: Object.freeze({
    path: "./assets/audio/bgm-contract-salon.mp3",
    gain: BGM_MASTER_GAIN,
  }),
});
const SFX_DEFINITIONS = Object.freeze({
  switchPress: Object.freeze({
    path: "./assets/audio/switch-press.wav",
    gain: 0.55,
    group: "press",
  }),
  switchPressHeavy: Object.freeze({
    path: "./assets/audio/switch-press-heavy.wav",
    gain: 0.48,
    group: "press",
  }),
  rouletteLock: Object.freeze({
    path: "./assets/audio/roulette-lock.wav",
    gain: 0.18,
    group: "roulette",
  }),
  resultLatch: Object.freeze({
    path: "./assets/audio/result-latch.wav",
    gain: 0.42,
    group: "result",
  }),
  uiAdvance: Object.freeze({
    path: "./assets/audio/ui-advance.wav",
    gain: 0.35,
    group: "ui",
  }),
});
export const PLAYER_PROFILES = Object.freeze(["male", "female"]);
export const MAX_PLAYER_NAME_LENGTH = 12;
export const OPENING_BEATS = Object.freeze([
  {
    kind: "title",
    voice: null,
    visualState: "none",
    title: "100만원 버튼",
    copy: "",
    action: "[ 누르기 ]",
    actionLabel: "100만원 버튼을 누른다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: "“아, {name} 씨.\n잊으셨군요?”",
    action: "[ 설명을 듣는다 ]",
    actionLabel: "여성 악마의 설명을 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: "“그럼 제가 설명해 드릴게요.\n후훗.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: [
      "“오늘도 변함없는 야근.",
      "밤 11시 30분에야 퇴근했지요.”",
    ].join("\n"),
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: [
      "“월세 55만 원짜리 방에",
      "몸을 누이면 하루가 끝났지요.”",
    ].join("\n"),
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: [
      "“당신에게 소리치는 상사,",
      "참 지긋지긋했겠지요.”",
    ].join("\n"),
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: [
      "“매일 야근을 강요한 회사도",
      "블랙 기업과 다름없었지요.”",
    ].join("\n"),
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: "“나는 왜 살고 있는 걸까.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: "“어릴 때는 이런 삶을\n꿈꾸지 않았는데.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: "“살고 싶지 않다.\n그렇다고 죽고 싶은 것도 아니다.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: "“돈만… 돈만 있으면\n이 지긋지긋한 생활도 끝날 텐데.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: "“대학 학자금 대출도\n5,000만 원이나 남아 있었지요.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: "“당신에게는 돈이\n더 절실했겠지요.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "demon",
    title: "우아한 여성 악마",
    copy: "“젠장… 아, 죽고 싶다.\n캔맥주나 마시고 잠들어야겠다.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "room-hint",
    title: "우아한 여성 악마",
    copy: "“그렇게 하루를 끝내려던 그날,\n결국 과로로 쓰러졌어요.”",
    action: "[ 눈을 뜬다 ]",
    actionLabel: "과로로 쓰러진 뒤 눈을 뜬다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "room-reveal",
    title: "우아한 여성 악마",
    copy: "“다시 눈을 떴을 때…\n이미 이 방으로 끌려와 있었지요.”",
    action: "[ 방을 둘러본다 ]",
    actionLabel: "끌려온 방을 둘러본다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "room-reveal",
    title: "우아한 여성 악마",
    copy: "“이제 기억나시나요,\n{name} 씨?”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "room-reveal",
    title: "우아한 여성 악마",
    copy: "“버튼을 한 번 누를 때마다\n누군가 한 명이 죽어요.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "room-reveal",
    title: "우아한 여성 악마",
    copy: "“당신은 100만 원을 받아요.\n누가 죽을지는 룰렛이 고르지요.”",
    action: "[ 계속 듣는다 ]",
    actionLabel: "여성 악마의 설명을 계속 듣는다.",
  },
  {
    kind: "dialogue",
    voice: "elegant-demon",
    visualState: "room-reveal",
    title: "우아한 여성 악마",
    copy: "“누를지는 오직 당신이 정하지요.\n자, 시작해 볼까요?”",
    action: "[ 시작한다 ]",
    actionLabel: "설명을 듣고 대상 조건을 정한다.",
  },
].map(Object.freeze));
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
const SCENE_DISSOLVE_PHASE_MS = 180;
const SCENE_INPUT_GUARD_MS = 360;
const RESULT_HOLD_MS = 750;
const MONEY_FLASH_MS = 430;
const MONEY_ROLL_MS = 190;
const BUTTON_PRESS_MS = 80;
const BUTTON_WAVE_MS = 260;
const BUTTON_TRAIL_WAVE_MS = 420;
const CELEBRATION_HOLD_MS = 1_250;
const SPACE_REPEAT_THROTTLE_MS = 90;
const OPENING_ADVANCE_GUARD_MS = 350;
const OPENING_TEXT_PRESS_MS = 90;
const OPENING_TYPE_DELAY_MS = 30;
const OPENING_SHORT_PAUSE_MS = 90;
const OPENING_SENTENCE_PAUSE_MS = 160;

function openingCharacterDelay(character) {
  if (character === "," || character === "\n") {
    return OPENING_TYPE_DELAY_MS + OPENING_SHORT_PAUSE_MS;
  }
  if ([".", "?", "!", "…"].includes(character)) {
    return OPENING_TYPE_DELAY_MS + OPENING_SENTENCE_PAUSE_MS;
  }
  return OPENING_TYPE_DELAY_MS;
}

export function isDialogueBlipCharacter(character) {
  return typeof character === "string" && /^[\p{L}\p{N}]$/u.test(character);
}

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

export function normalizePlayerName(value) {
  if (typeof value !== "string") {
    return "";
  }
  const name = value.trim().replace(/\s+/gu, " ");
  return name.length > 0 && [...name].length <= MAX_PLAYER_NAME_LENGTH
    ? name
    : "";
}

export function parsePlayerSetup(raw) {
  if (typeof raw !== "string") {
    return null;
  }
  try {
    const value = JSON.parse(raw);
    const name = normalizePlayerName(value?.name);
    if (
      value?.language !== "ko"
      || !PLAYER_PROFILES.includes(value?.profile)
      || !name
    ) {
      return null;
    }
    return {
      language: "ko",
      profile: value.profile,
      name,
    };
  } catch {
    return null;
  }
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
    stage: document.querySelector(".stage"),
    setupScreen: document.querySelector("#setup-screen"),
    setupTitle: document.querySelector("#setup-title"),
    setupLanguage: document.querySelector("#setup-language"),
    languageKorean: document.querySelector("#language-korean"),
    setupProfile: document.querySelector("#setup-profile"),
    profileMale: document.querySelector("#profile-male"),
    profileFemale: document.querySelector("#profile-female"),
    setupNameForm: document.querySelector("#setup-name-form"),
    playerNameInput: document.querySelector("#player-name"),
    nameError: document.querySelector("#name-error"),
    nameConfirm: document.querySelector("#name-confirm"),
    openingScreen: document.querySelector("#opening-screen"),
    playerIdentity: document.querySelector("#player-identity"),
    playerAvatar: document.querySelector("#player-avatar"),
    openingPlayerName: document.querySelector("#opening-player-name"),
    openingMessage: document.querySelector("#opening-message"),
    openingTitle: document.querySelector("#opening-title"),
    openingCopy: document.querySelector("#opening-copy"),
    openingAnnouncement: document.querySelector("#opening-announcement"),
    openingAdvance: document.querySelector("#opening-advance"),
    statusBar: document.querySelector("#status-bar"),
    musicToggle: document.querySelector("#music-toggle"),
    soundToggle: document.querySelector("#sound-toggle"),
    dialogueBlipVolume: document.querySelector("#dialogue-volume"),
    dialogueBlipVolumeValue: document.querySelector("#dialogue-volume-value"),
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
    !elements.stage
    || !elements.setupScreen
    || !elements.setupTitle
    || !elements.setupLanguage
    || !elements.languageKorean
    || !elements.setupProfile
    || !elements.profileMale
    || !elements.profileFemale
    || !elements.setupNameForm
    || !elements.playerNameInput
    || !elements.nameError
    || !elements.nameConfirm
    || !elements.openingScreen
    || !elements.playerIdentity
    || !elements.playerAvatar
    || !elements.openingPlayerName
    || !elements.openingMessage
    || !elements.openingTitle
    || !elements.openingCopy
    || !elements.openingAnnouncement
    || !elements.openingAdvance
    || !elements.statusBar
    || !elements.musicToggle
    || !elements.soundToggle
    || !elements.dialogueBlipVolume
    || !elements.dialogueBlipVolumeValue
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
  const sfxEncodedData = new Map();
  const sfxBuffers = new Map();
  const sfxDecodePromises = new Map();
  const activeSfxSources = new Set();
  const activePressSources = [];
  const activeDialogueSources = [];
  let rollTimer = null;
  let moneyFlashTimer = null;
  let moneyRollTimer = null;
  let buttonPressTimer = null;
  let buttonWaveTimer = null;
  let audioContext = null;
  let sfxMasterGain = null;
  let bgmMasterGain = null;
  let sfxLoadPromise = null;
  const bgmEncodedData = new Map();
  const bgmBuffers = new Map();
  const bgmDecodePromises = new Map();
  const bgmLoadPromises = new Map();
  const bgmOffsets = new Map();
  let activeBgmSource = null;
  let activeBgmTrack = null;
  let bgmTrack = null;
  let bgmStartedAt = 0;
  let bgmStopTimer = null;
  let bgmShouldPlay = false;
  let soundEnabled = true;
  let soundPreferenceAvailable = true;
  let dialogueBlipVolume = DIALOGUE_BLIP_VOLUME_DEFAULT;
  let dialogueBlipVolumePreferenceAvailable = true;
  let musicEnabled = true;
  let musicPreferenceAvailable = true;
  let lastRouletteLockAt = Number.NEGATIVE_INFINITY;
  let lastDialogueBlipAt = Number.NEGATIVE_INFINITY;
  let dialogueBlipSequence = 0;
  let celebrationActive = false;
  let pendingMoneyFlash = false;
  let pendingMoneyRoll = false;
  let lastSpacePressAt = Number.NEGATIVE_INFINITY;
  let gameStarted = false;
  let playerSetup = null;
  let setupDraft = { language: null, profile: null };
  let openingBeatIndex = 0;
  let lastOpeningAdvanceAt = Number.NEGATIVE_INFINITY;
  let openingTextPressTimer = null;
  let openingTypingTimer = null;
  let openingTypingGeneration = 0;
  let openingFullCopy = "";
  let openingTypingComplete = true;
  let openingParallaxFrame = null;
  let openingParallaxPointer = null;
  let sceneTransition = null;
  let sceneTransitionTimer = null;
  let sceneTransitionGeneration = 0;
  let selectedTargetIndex = null;
  let questionIndex = 0;
  let lastEthicsRejectAt = Number.NEGATIVE_INFINITY;
  let targetStorageAvailable = true;
  let playerSetupStorageAvailable = true;

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

  try {
    soundEnabled = window.localStorage.getItem(SFX_PREFERENCE_KEY) !== "0";
  } catch {
    soundPreferenceAvailable = false;
    soundEnabled = true;
  }

  try {
    const storedDialogueBlipVolume = window.localStorage.getItem(
      DIALOGUE_BLIP_VOLUME_KEY,
    );
    if (storedDialogueBlipVolume !== null) {
      const parsedDialogueBlipVolume = Number(storedDialogueBlipVolume);
      if (Number.isFinite(parsedDialogueBlipVolume)) {
        dialogueBlipVolume = Math.min(
          Math.max(parsedDialogueBlipVolume, DIALOGUE_BLIP_VOLUME_MIN),
          DIALOGUE_BLIP_VOLUME_MAX,
        );
      }
    }
  } catch {
    dialogueBlipVolumePreferenceAvailable = false;
    dialogueBlipVolume = DIALOGUE_BLIP_VOLUME_DEFAULT;
  }

  try {
    musicEnabled = window.localStorage.getItem(BGM_PREFERENCE_KEY) !== "0";
  } catch {
    musicPreferenceAvailable = false;
    musicEnabled = true;
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

  function loadPlayerSetup() {
    if (!playerSetupStorageAvailable) {
      return playerSetup;
    }
    try {
      return parsePlayerSetup(
        window.sessionStorage.getItem(PLAYER_SETUP_KEY),
      );
    } catch {
      playerSetupStorageAvailable = false;
      return playerSetup;
    }
  }

  function savePlayerSetup(value) {
    playerSetup = value;
    if (!playerSetupStorageAvailable) {
      return;
    }
    try {
      window.sessionStorage.setItem(PLAYER_SETUP_KEY, JSON.stringify(value));
    } catch {
      playerSetupStorageAvailable = false;
    }
  }

  function isSceneTransitioning() {
    return sceneTransition !== null;
  }

  function clearSceneTransitionState() {
    if (sceneTransitionTimer !== null) {
      window.clearTimeout(sceneTransitionTimer);
      sceneTransitionTimer = null;
    }
    document.body.classList.remove(
      "is-scene-transitioning",
      "is-scene-exiting",
      "is-scene-entering",
    );
    elements.focusStage.removeAttribute("aria-busy");
    sceneTransition = null;
  }

  function finishSceneTransition() {
    if (!sceneTransition) {
      return false;
    }

    const activeTransition = sceneTransition;
    if (sceneTransitionTimer !== null) {
      window.clearTimeout(sceneTransitionTimer);
      sceneTransitionTimer = null;
    }
    sceneTransitionGeneration += 1;

    const commit = activeTransition.phase === "out"
      ? activeTransition.commit
      : null;
    activeTransition.commit = null;
    try {
      if (commit) {
        commit();
      }
    } finally {
      clearSceneTransitionState();
    }
    return true;
  }

  function transitionScene(commit) {
    if (typeof commit !== "function" || isSceneTransitioning()) {
      return false;
    }

    cancelOpeningTextPress();
    cancelOpeningTyping();
    if (reducedMotion.matches) {
      const generation = sceneTransitionGeneration + 1;
      sceneTransitionGeneration = generation;
      sceneTransition = { generation, phase: "in", commit: null };
      elements.focusStage.setAttribute("aria-busy", "true");
      document.body.classList.add("is-scene-transitioning");
      try {
        commit();
      } catch (error) {
        clearSceneTransitionState();
        throw error;
      }
      sceneTransitionTimer = window.setTimeout(() => {
        if (sceneTransition?.generation === generation) {
          clearSceneTransitionState();
        }
      }, SCENE_INPUT_GUARD_MS);
      return true;
    }

    const generation = sceneTransitionGeneration + 1;
    sceneTransitionGeneration = generation;
    sceneTransition = { generation, phase: "out", commit };
    elements.focusStage.setAttribute("aria-busy", "true");
    document.body.classList.add("is-scene-transitioning", "is-scene-exiting");

    sceneTransitionTimer = window.setTimeout(() => {
      if (sceneTransition?.generation !== generation) {
        return;
      }

      sceneTransitionTimer = null;
      const activeTransition = sceneTransition;
      const sceneCommit = activeTransition.commit;
      activeTransition.phase = "in";
      activeTransition.commit = null;
      try {
        sceneCommit();
      } catch (error) {
        clearSceneTransitionState();
        throw error;
      }

      document.body.classList.remove("is-scene-exiting");
      document.body.classList.add("is-scene-entering");
      sceneTransitionTimer = window.setTimeout(() => {
        if (sceneTransition?.generation === generation) {
          clearSceneTransitionState();
        }
      }, SCENE_DISSOLVE_PHASE_MS);
    }, SCENE_DISSOLVE_PHASE_MS);
    return true;
  }

  function renderEthicsQuestion() {
    const target = ETHICS_TARGETS[questionIndex];
    elements.ethicsPrompt.classList.remove("is-refused");
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

    cancelOpeningTyping();
    activateBackgroundMusic("contract");
    gameStarted = true;
    elements.setupScreen.hidden = true;
    elements.openingScreen.hidden = true;
    elements.ethicsPrompt.hidden = true;
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
    if (
      gameStarted
      || questionIndex >= ETHICS_TARGETS.length
      || isSceneTransitioning()
    ) {
      return;
    }

    saveTargetSelection(questionIndex);
    playUiAdvance();
    transitionScene(() => revealGame());
  }

  function rejectEthicsQuestion() {
    if (
      gameStarted
      || questionIndex >= ETHICS_TARGETS.length
      || isSceneTransitioning()
    ) {
      return;
    }
    const now = performance.now();
    if (now - lastEthicsRejectAt < SCENE_INPUT_GUARD_MS) {
      return;
    }
    lastEthicsRejectAt = now;
    playUiAdvance();
    if (questionIndex < ETHICS_TARGETS.length - 1) {
      questionIndex += 1;
      renderEthicsQuestion();
      return;
    }

    transitionScene(() => {
      questionIndex = ETHICS_TARGETS.length;
      fadeOutBackgroundMusic(BGM_EARLY_END_FADE_MS);
      elements.ethicsPrompt.classList.add("is-refused");
      elements.ethicsQuestion.textContent = "너는 누르지 않았다.";
      elements.ethicsQuestion.setAttribute("aria-label", "너는 누르지 않았다.");
      elements.ethicsReward.hidden = true;
      elements.ethicsActions.hidden = true;
      elements.ethicsQuestion.focus({ preventScroll: true });
    });
  }

  function onEthicsDecisionKeyDown(event) {
    if (event.code !== "Space" && event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    if (event.repeat || isSceneTransitioning()) {
      return;
    }
    if (event.currentTarget === elements.ethicsAccept) {
      acceptEthicsQuestion();
    } else {
      rejectEthicsQuestion();
    }
  }

  function cancelOpeningTextPress() {
    if (openingTextPressTimer !== null) {
      window.clearTimeout(openingTextPressTimer);
      openingTextPressTimer = null;
    }
    elements.openingMessage.classList.remove("is-pressed");
    elements.openingMessage.setAttribute("aria-pressed", "false");
  }

  function cancelOpeningTyping() {
    if (openingTypingTimer !== null) {
      window.clearTimeout(openingTypingTimer);
      openingTypingTimer = null;
    }
    openingTypingGeneration += 1;
    openingTypingComplete = true;
    stopDialogueBlips();
  }

  function completeOpeningTyping() {
    if (openingTypingComplete) {
      return false;
    }
    cancelOpeningTyping();
    elements.openingCopy.textContent = openingFullCopy;
    const beat = OPENING_BEATS[openingBeatIndex];
    if (beat) {
      elements.openingAdvance.setAttribute("aria-label", beat.actionLabel);
      elements.openingMessage.setAttribute("aria-label", beat.actionLabel);
    }
    return true;
  }

  function typeOpeningCopy(beat, copy) {
    cancelOpeningTyping();
    openingFullCopy = copy;
    elements.openingAnnouncement.textContent = beat.kind === "title"
      ? ""
      : [beat.title, copy].filter(Boolean).join(". ");
    elements.openingCopy.hidden = copy.length === 0;
    elements.openingCopy.textContent = copy;

    if (!copy || beat.kind === "title" || reducedMotion.matches) {
      return;
    }

    const characters = Array.from(copy);
    const generation = openingTypingGeneration;
    let characterIndex = 0;
    let visibleCopy = "";
    openingTypingComplete = false;
    elements.openingCopy.textContent = "";
    elements.openingAdvance.setAttribute(
      "aria-label",
      "현재 대사를 끝까지 표시한다.",
    );
    elements.openingMessage.setAttribute(
      "aria-label",
      "현재 대사를 끝까지 표시한다.",
    );

    function typeNextCharacter() {
      if (generation !== openingTypingGeneration) {
        return;
      }
      const character = characters[characterIndex];
      visibleCopy += character;
      characterIndex += 1;
      elements.openingCopy.textContent = visibleCopy;
      playDialogueBlip(beat.voice, character);

      if (characterIndex >= characters.length) {
        openingTypingTimer = null;
        openingTypingComplete = true;
        elements.openingAdvance.setAttribute(
          "aria-label",
          beat.actionLabel,
        );
        elements.openingMessage.setAttribute("aria-label", beat.actionLabel);
        return;
      }

      openingTypingTimer = window.setTimeout(
        typeNextCharacter,
        openingCharacterDelay(character),
      );
    }

    typeNextCharacter();
  }

  function isOpeningParallaxActive() {
    return !reducedMotion.matches
      && !elements.openingScreen.hidden
      && elements.openingScreen.classList.contains("is-dialogue")
      && elements.openingScreen.dataset.openingVisual !== "none";
  }

  function clampOpeningParallaxAxis(value) {
    return Math.min(Math.max(value, -1), 1);
  }

  function formatOpeningParallaxShift(value, unit) {
    const rounded = Number(value.toFixed(4));
    return `${rounded}${unit}`;
  }

  function applyOpeningParallax(x = 0, y = 0) {
    elements.openingScreen.style.setProperty(
      "--opening-room-shift-x",
      formatOpeningParallaxShift(
        -x * OPENING_PARALLAX_PROFILE.roomXInCqw,
        "cqw",
      ),
    );
    elements.openingScreen.style.setProperty(
      "--opening-room-shift-y",
      formatOpeningParallaxShift(
        -y * OPENING_PARALLAX_PROFILE.roomYInCqh,
        "cqh",
      ),
    );
    elements.openingScreen.style.setProperty(
      "--opening-demon-shift-x",
      formatOpeningParallaxShift(
        -x * OPENING_PARALLAX_PROFILE.demonXInCqw,
        "cqw",
      ),
    );
    elements.openingScreen.style.setProperty(
      "--opening-demon-shift-y",
      formatOpeningParallaxShift(
        -y * OPENING_PARALLAX_PROFILE.demonYInCqh,
        "cqh",
      ),
    );
  }

  function scheduleOpeningParallaxFrame() {
    if (openingParallaxFrame === null) {
      openingParallaxFrame = window.requestAnimationFrame(renderOpeningParallaxFrame);
    }
  }

  function renderOpeningParallaxFrame() {
    openingParallaxFrame = null;
    if (!openingParallaxPointer || !isOpeningParallaxActive()) {
      applyOpeningParallax();
      return;
    }
    const bounds = elements.stage.getBoundingClientRect();
    if (
      openingParallaxPointer.x < bounds.left
      || openingParallaxPointer.x > bounds.right
      || openingParallaxPointer.y < bounds.top
      || openingParallaxPointer.y > bounds.bottom
    ) {
      openingParallaxPointer = null;
      applyOpeningParallax();
      return;
    }
    const x = bounds.width > 0
      ? clampOpeningParallaxAxis(
        (openingParallaxPointer.x - bounds.left - (bounds.width / 2))
        / (bounds.width / 2),
      )
      : 0;
    const y = bounds.height > 0
      ? clampOpeningParallaxAxis(
        (openingParallaxPointer.y - bounds.top - (bounds.height / 2))
        / (bounds.height / 2),
      )
      : 0;
    applyOpeningParallax(x, y);
  }

  function resetOpeningParallax() {
    openingParallaxPointer = null;
    if (openingParallaxFrame !== null) {
      window.cancelAnimationFrame(openingParallaxFrame);
      openingParallaxFrame = null;
    }
    applyOpeningParallax();
  }

  function onOpeningParallaxPointerMove(event) {
    if (event.pointerType !== "mouse" || !isOpeningParallaxActive()) {
      return;
    }
    openingParallaxPointer = { x: event.clientX, y: event.clientY };
    scheduleOpeningParallaxFrame();
  }

  function onOpeningParallaxPointerLeave(event) {
    if (event.pointerType === "mouse") {
      resetOpeningParallax();
    }
  }

  function onReducedMotionChange(event) {
    if (event.matches) {
      cancelOpeningTextPress();
      resetOpeningParallax();
      completeOpeningTyping();
      stopDialogueBlips();
      finishSceneTransition();
    }
  }

  function showSetupStep(step) {
    cancelOpeningTextPress();
    cancelOpeningTyping();
    resetOpeningParallax();
    elements.setupScreen.hidden = false;
    elements.openingScreen.hidden = true;
    elements.ethicsPrompt.hidden = true;
    elements.setupLanguage.hidden = step !== "language";
    elements.setupProfile.hidden = step !== "profile";
    elements.setupNameForm.hidden = step !== "name";

    if (step === "language") {
      elements.setupTitle.textContent = "어떤 언어로 플레이하시겠습니까?";
      elements.languageKorean.focus({ preventScroll: true });
      return;
    }
    if (step === "profile") {
      elements.setupTitle.textContent = "당신은 누구입니까?";
      elements.profileMale.focus({ preventScroll: true });
      return;
    }

    elements.setupTitle.textContent = "당신의 이름은?";
    elements.nameError.hidden = true;
    elements.playerNameInput.removeAttribute("aria-invalid");
    elements.playerNameInput.focus({ preventScroll: true });
  }

  function chooseLanguage() {
    if (isSceneTransitioning()) {
      return;
    }
    setupDraft = { ...setupDraft, language: "ko" };
    playUiAdvance();
    showSetupStep("profile");
  }

  function chooseProfile(profile) {
    if (!PLAYER_PROFILES.includes(profile) || isSceneTransitioning()) {
      return;
    }
    setupDraft = { ...setupDraft, profile };
    playUiAdvance();
    showSetupStep("name");
  }

  function onSetupActionKeyDown(event) {
    if (event.code !== "Space" && event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    if (event.repeat || isSceneTransitioning()) {
      return;
    }
    event.currentTarget.click();
  }

  function renderPlayerIdentity() {
    if (!playerSetup) {
      return;
    }
    elements.playerAvatar.classList.toggle(
      "is-female",
      playerSetup.profile === "female",
    );
    elements.openingPlayerName.textContent = playerSetup.name;
    const profileLabel = playerSetup.profile === "female" ? "여성" : "남성";
    elements.playerIdentity.setAttribute(
      "aria-label",
      `플레이어 ${playerSetup.name}. ${profileLabel} 프로필.`,
    );
  }

  function showOpeningTitle() {
    activateBackgroundMusic("title");
    openingBeatIndex = 0;
    elements.setupScreen.hidden = true;
    elements.openingScreen.hidden = false;
    elements.ethicsPrompt.hidden = true;
    elements.playerIdentity.hidden = true;
    renderOpeningBeat();
    elements.openingAdvance.focus({ preventScroll: true });
  }

  function beginOpeningStory() {
    if (!playerSetup) {
      return;
    }
    activateBackgroundMusic("contract");
    openingBeatIndex = 1;
    elements.setupScreen.hidden = true;
    elements.openingScreen.hidden = false;
    elements.ethicsPrompt.hidden = true;
    renderPlayerIdentity();
    renderOpeningBeat();
    elements.openingMessage.focus({ preventScroll: true });
  }

  function onSetupNameSubmit(event) {
    event.preventDefault();
    if (isSceneTransitioning()) {
      return;
    }
    const name = normalizePlayerName(elements.playerNameInput.value);
    if (!name || !setupDraft.language || !setupDraft.profile) {
      elements.nameError.hidden = false;
      elements.playerNameInput.setAttribute("aria-invalid", "true");
      elements.playerNameInput.focus({ preventScroll: true });
      return;
    }

    const completedSetup = {
      language: setupDraft.language,
      profile: setupDraft.profile,
      name,
    };
    savePlayerSetup(completedSetup);
    playUiAdvance();
    transitionScene(() => beginOpeningStory());
  }

  function onPlayerNameKeyDown(event) {
    if (event.key !== "Enter" || event.isComposing) {
      return;
    }
    event.preventDefault();
    elements.setupNameForm.requestSubmit();
  }

  function initializeEthicsFlow() {
    cancelOpeningTextPress();
    cancelOpeningTyping();
    resetOpeningParallax();
    openingBeatIndex = OPENING_BEATS.length;
    elements.setupScreen.hidden = true;
    elements.openingScreen.hidden = true;
    elements.ethicsPrompt.hidden = false;
    renderEthicsQuestion();
    elements.ethicsQuestion.focus({ preventScroll: true });
  }

  function renderOpeningBeat() {
    cancelOpeningTextPress();
    const beat = OPENING_BEATS[openingBeatIndex];
    if (beat.kind !== "dialogue" || beat.visualState === "none") {
      resetOpeningParallax();
    }
    const playerName = playerSetup?.name || "당신";
    const copy = beat.copy.split("{name}").join(playerName);
    elements.openingScreen.classList.toggle(
      "is-narrative",
      beat.kind !== "title",
    );
    elements.openingScreen.classList.toggle(
      "is-title",
      beat.kind === "title",
    );
    elements.openingScreen.classList.toggle(
      "is-dialogue",
      beat.kind === "dialogue",
    );
    elements.openingScreen.dataset.openingVisual = beat.visualState;
    elements.playerIdentity.hidden = true;
    elements.openingTitle.textContent = beat.title;
    const isDialogue = beat.kind === "dialogue";
    elements.openingMessage.tabIndex = isDialogue ? 0 : -1;
    if (isDialogue) {
      elements.openingMessage.setAttribute("role", "button");
      elements.openingMessage.setAttribute("aria-keyshortcuts", "Space Enter");
      elements.openingMessage.setAttribute("aria-label", beat.actionLabel);
    } else {
      elements.openingMessage.removeAttribute("role");
      elements.openingMessage.removeAttribute("aria-keyshortcuts");
      elements.openingMessage.removeAttribute("aria-label");
      elements.openingMessage.removeAttribute("aria-pressed");
    }
    elements.openingAdvance.hidden = isDialogue;
    elements.openingAdvance.disabled = isDialogue;
    elements.openingAdvance.textContent = beat.kind === "dialogue"
      ? beat.action.replace(/^\[\s*|\s*\]$/gu, "")
      : beat.action;
    elements.openingAdvance.setAttribute("aria-label", beat.actionLabel);
    typeOpeningCopy(beat, copy);
  }

  function isOpeningDialogueActive() {
    return !gameStarted
      && !elements.openingScreen.hidden
      && elements.openingScreen.classList.contains("is-dialogue");
  }

  function triggerOpeningTextAdvance() {
    if (
      !isOpeningDialogueActive()
      || isSceneTransitioning()
      || openingTextPressTimer !== null
      || performance.now() - lastOpeningAdvanceAt < OPENING_ADVANCE_GUARD_MS
    ) {
      return false;
    }

    elements.openingMessage.classList.add("is-pressed");
    elements.openingMessage.setAttribute("aria-pressed", "true");
    openingTextPressTimer = window.setTimeout(() => {
      openingTextPressTimer = null;
      elements.openingMessage.classList.remove("is-pressed");
      elements.openingMessage.setAttribute("aria-pressed", "false");
      advanceOpening();
    }, reducedMotion.matches ? 0 : OPENING_TEXT_PRESS_MS);
    return true;
  }

  function onOpeningMessageClick() {
    triggerOpeningTextAdvance();
  }

  function onOpeningMessageKeyDown(event) {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    if (!event.repeat) {
      triggerOpeningTextAdvance();
    }
  }

  function advanceOpening() {
    if (
      gameStarted
      || openingBeatIndex >= OPENING_BEATS.length
      || isSceneTransitioning()
    ) {
      return;
    }

    const now = performance.now();
    if (now - lastOpeningAdvanceAt < OPENING_ADVANCE_GUARD_MS) {
      return;
    }
    lastOpeningAdvanceAt = now;
    playUiAdvance();
    if (!openingTypingComplete) {
      completeOpeningTyping();
      return;
    }

    if (openingBeatIndex === 0) {
      transitionScene(() => {
        if (playerSetup) {
          beginOpeningStory();
        } else {
          showSetupStep("language");
        }
      });
      return;
    }

    if (openingBeatIndex < OPENING_BEATS.length - 1) {
      openingBeatIndex += 1;
      renderOpeningBeat();
      return;
    }

    transitionScene(() => initializeEthicsFlow());
  }

  function onOpeningActionKeyDown(event) {
    if (event.code !== "Space" && event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    if (event.repeat) {
      return;
    }
    advanceOpening();
  }

  function initializeOpeningFlow() {
    const restoredTargetIndex = loadTargetSelection();
    if (restoredTargetIndex !== null) {
      selectedTargetIndex = restoredTargetIndex;
      elements.openingScreen.hidden = true;
      revealGame({ focusButton: false });
      return;
    }
    const restoredPlayerSetup = loadPlayerSetup();
    if (restoredPlayerSetup) {
      playerSetup = restoredPlayerSetup;
      setupDraft = {
        language: restoredPlayerSetup.language,
        profile: restoredPlayerSetup.profile,
      };
    }
    showOpeningTitle();
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

  function resetAudioState() {
    if (bgmStopTimer !== null) {
      window.clearTimeout(bgmStopTimer);
      bgmStopTimer = null;
    }
    audioContext = null;
    sfxMasterGain = null;
    bgmMasterGain = null;
    activeBgmSource = null;
    activeBgmTrack = null;
    bgmStartedAt = 0;
    bgmBuffers.clear();
    bgmDecodePromises.clear();
    sfxBuffers.clear();
    sfxDecodePromises.clear();
    activeSfxSources.clear();
    activePressSources.length = 0;
    activeDialogueSources.length = 0;
    lastDialogueBlipAt = Number.NEGATIVE_INFINITY;
    dialogueBlipSequence = 0;
  }

  function getAudioContext({ resume = false } = {}) {
    try {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) {
        return null;
      }
      if (audioContext?.state === "closed") {
        resetAudioState();
      }
      if (audioContext === null) {
        try {
          audioContext = new AudioContextConstructor({ latencyHint: "interactive" });
        } catch {
          audioContext = new AudioContextConstructor();
        }
        sfxMasterGain = audioContext.createGain();
        sfxMasterGain.gain.value = soundEnabled ? SFX_MASTER_GAIN : 0;
        sfxMasterGain.connect(audioContext.destination);
        bgmMasterGain = audioContext.createGain();
        bgmMasterGain.gain.value = 0;
        bgmMasterGain.connect(audioContext.destination);
      }
      if (resume && audioContext.state === "suspended") {
        void audioContext.resume().catch(() => {});
      }
      return audioContext;
    } catch {
      resetAudioState();
      return null;
    }
  }

  function decodeSoundEffect(context, name, bytes) {
    if (
      sfxBuffers.has(name)
      || sfxDecodePromises.has(name)
      || context.state === "closed"
    ) {
      return sfxDecodePromises.get(name) || Promise.resolve();
    }

    const decodePromise = context.decodeAudioData(bytes.slice(0))
      .then((buffer) => {
        if (audioContext === context && context.state !== "closed") {
          sfxBuffers.set(name, buffer);
        }
      })
      .catch(() => {
        // Invalid audio is silent and does not affect the game.
      })
      .finally(() => {
        if (sfxDecodePromises.get(name) === decodePromise) {
          sfxDecodePromises.delete(name);
        }
      });
    sfxDecodePromises.set(name, decodePromise);
    return decodePromise;
  }

  function decodeAvailableSoundEffects(context) {
    if (!context || context.state === "closed") {
      return Promise.resolve();
    }
    return Promise.all(
      Array.from(sfxEncodedData, ([name, bytes]) => (
        decodeSoundEffect(context, name, bytes)
      )),
    ).then(() => {});
  }

  function preloadSoundEffects() {
    if (sfxLoadPromise !== null) {
      return sfxLoadPromise;
    }

    if (typeof window.fetch !== "function") {
      sfxLoadPromise = Promise.resolve();
      return sfxLoadPromise;
    }

    sfxLoadPromise = Promise.all(
      Object.entries(SFX_DEFINITIONS).map(async ([name, definition]) => {
        try {
          const response = await window.fetch(
            new URL(definition.path, import.meta.url),
          );
          if (!response.ok) {
            return;
          }
          const bytes = await response.arrayBuffer();
          sfxEncodedData.set(name, bytes);
          const context = audioContext;
          if (context && context.state !== "closed") {
            await decodeSoundEffect(context, name, bytes);
          }
        } catch {
          // Missing audio is silent; gameplay never waits for an effect.
        }
      }),
    ).then(() => {});
    return sfxLoadPromise;
  }

  function decodeBackgroundMusic(context, track = bgmTrack) {
    const bytes = bgmEncodedData.get(track);
    if (
      !BGM_DEFINITIONS[track]
      || bgmBuffers.has(track)
      || bgmDecodePromises.has(track)
      || !bytes
      || context.state === "closed"
    ) {
      return bgmDecodePromises.get(track) || Promise.resolve();
    }

    const decodePromise = context.decodeAudioData(bytes.slice(0))
      .then((buffer) => {
        if (audioContext === context && context.state !== "closed") {
          bgmBuffers.set(track, buffer);
          if (bgmTrack === track) {
            startBackgroundMusic(context, track);
          }
        }
      })
      .catch(() => {
        // Missing or invalid music is silent and never blocks the game.
      })
      .finally(() => {
        if (bgmDecodePromises.get(track) === decodePromise) {
          bgmDecodePromises.delete(track);
        }
      });
    bgmDecodePromises.set(track, decodePromise);
    return decodePromise;
  }

  function preloadBackgroundMusic(track = bgmTrack) {
    const definition = BGM_DEFINITIONS[track];
    if (!definition) {
      return Promise.resolve();
    }
    if (bgmLoadPromises.has(track)) {
      return bgmLoadPromises.get(track);
    }

    if (typeof window.fetch !== "function") {
      const noFetchPromise = Promise.resolve();
      bgmLoadPromises.set(track, noFetchPromise);
      return noFetchPromise;
    }

    const loadPromise = (async () => {
      try {
        const response = await window.fetch(
          new URL(definition.path, import.meta.url),
        );
        if (!response.ok) {
          return;
        }
        const bytes = await response.arrayBuffer();
        bgmEncodedData.set(track, bytes);
        const context = audioContext;
        if (context && context.state !== "closed") {
          await decodeBackgroundMusic(context, track);
        }
      } catch {
        // Missing music is silent and never blocks the game.
      }
    })();
    bgmLoadPromises.set(track, loadPromise);
    return loadPromise;
  }

  function primeSoundEffects() {
    if (!soundEnabled) {
      return;
    }
    const context = getAudioContext({ resume: true });
    if (!context) {
      return;
    }
    void decodeAvailableSoundEffects(context);
    void preloadSoundEffects().then(() => decodeAvailableSoundEffects(context));
  }

  function primeAudio() {
    const context = getAudioContext({ resume: true });
    if (!context) {
      return;
    }
    if (soundEnabled) {
      void decodeAvailableSoundEffects(context);
      void preloadSoundEffects().then(() => decodeAvailableSoundEffects(context));
    }
    const track = bgmTrack;
    if (musicEnabled && track) {
      void decodeBackgroundMusic(context, track);
      void preloadBackgroundMusic(track)
        .then(() => decodeBackgroundMusic(context, track));
      startBackgroundMusic(context, track);
    }
  }

  function retireSoundSource(record) {
    activeSfxSources.delete(record);
    if (record.group === "press") {
      const index = activePressSources.indexOf(record);
      if (index >= 0) {
        activePressSources.splice(index, 1);
      }
    }
    if (record.group === "dialogue") {
      const index = activeDialogueSources.indexOf(record);
      if (index >= 0) {
        activeDialogueSources.splice(index, 1);
      }
    }
  }

  function stopSoundSource(record) {
    retireSoundSource(record);
    try {
      record.source.stop();
    } catch {
      // The source may already have ended.
    }
  }

  function stopAllSoundEffects() {
    for (const record of Array.from(activeSfxSources)) {
      stopSoundSource(record);
    }
    lastDialogueBlipAt = Number.NEGATIVE_INFINITY;
  }

  function stopDialogueBlips() {
    for (const record of Array.from(activeDialogueSources)) {
      stopSoundSource(record);
    }
    lastDialogueBlipAt = Number.NEGATIVE_INFINITY;
  }

  function updateSfxMasterGain() {
    if (!audioContext || !sfxMasterGain || audioContext.state === "closed") {
      return;
    }
    try {
      sfxMasterGain.gain.setValueAtTime(
        soundEnabled ? SFX_MASTER_GAIN : 0,
        audioContext.currentTime,
      );
    } catch {
      // Audio preference remains valid even if the context disappears.
    }
  }

  function cancelBgmStopTimer() {
    if (bgmStopTimer !== null) {
      window.clearTimeout(bgmStopTimer);
      bgmStopTimer = null;
    }
  }

  function normalizedBgmOffset(
    track = activeBgmTrack || bgmTrack,
    offset = bgmOffsets.get(track) || 0,
  ) {
    const buffer = bgmBuffers.get(track);
    if (!buffer || !Number.isFinite(buffer.duration) || buffer.duration <= 0) {
      return 0;
    }
    return ((offset % buffer.duration) + buffer.duration) % buffer.duration;
  }

  function currentBgmOffset() {
    const track = activeBgmTrack || bgmTrack;
    if (!activeBgmSource || !audioContext || !activeBgmTrack) {
      return normalizedBgmOffset(track);
    }
    return normalizedBgmOffset(
      activeBgmTrack,
      audioContext.currentTime - bgmStartedAt,
    );
  }

  function stopBackgroundMusic({ preserveOffset = false } = {}) {
    cancelBgmStopTimer();
    const source = activeBgmSource;
    const stoppedTrack = activeBgmTrack;
    if (stoppedTrack) {
      bgmOffsets.set(stoppedTrack, preserveOffset ? currentBgmOffset() : 0);
    }
    activeBgmSource = null;
    activeBgmTrack = null;
    bgmStartedAt = 0;

    if (bgmMasterGain && audioContext?.state !== "closed") {
      try {
        const now = audioContext.currentTime;
        bgmMasterGain.gain.cancelScheduledValues(now);
        bgmMasterGain.gain.setValueAtTime(0, now);
      } catch {
        // Music remains stopped even if gain automation is unavailable.
      }
    }

    if (!source) {
      return;
    }
    source.onended = null;
    try {
      source.stop();
    } catch {
      // The source may already have ended.
    }
    try {
      source.disconnect();
    } catch {
      // A disconnected source is already silent.
    }
  }

  function startBackgroundMusic(context = audioContext, track = bgmTrack) {
    const definition = BGM_DEFINITIONS[track];
    const buffer = bgmBuffers.get(track);
    if (
      !musicEnabled
      || !bgmShouldPlay
      || bgmTrack !== track
      || document.hidden
      || !context
      || context !== audioContext
      || context.state === "closed"
      || !bgmMasterGain
      || !definition
      || !buffer
      || activeBgmSource
    ) {
      return false;
    }

    try {
      cancelBgmStopTimer();
      const source = context.createBufferSource();
      const offset = normalizedBgmOffset(track);
      const now = context.currentTime;
      source.buffer = buffer;
      source.loop = true;
      source.connect(bgmMasterGain);
      source.onended = () => {
        if (activeBgmSource === source) {
          activeBgmSource = null;
          activeBgmTrack = null;
          bgmStartedAt = 0;
        }
        try {
          source.disconnect();
        } catch {
          // A disconnected source needs no cleanup.
        }
      };
      activeBgmSource = source;
      activeBgmTrack = track;
      bgmStartedAt = now - offset;
      bgmMasterGain.gain.cancelScheduledValues(now);
      bgmMasterGain.gain.setValueAtTime(0, now);
      bgmMasterGain.gain.linearRampToValueAtTime(
        definition.gain,
        now + (BGM_FADE_IN_MS / 1_000),
      );
      source.start(0, offset);
      return true;
    } catch {
      activeBgmSource = null;
      activeBgmTrack = null;
      bgmStartedAt = 0;
      return false;
    }
  }

  function activateBackgroundMusic(track) {
    if (!BGM_DEFINITIONS[track]) {
      return false;
    }
    bgmShouldPlay = true;
    if (bgmTrack !== track) {
      stopBackgroundMusic();
      bgmTrack = track;
      bgmOffsets.set(track, 0);
    }
    void preloadBackgroundMusic(track);
    if (audioContext && audioContext.state !== "closed") {
      void decodeBackgroundMusic(audioContext, track);
      startBackgroundMusic(audioContext, track);
    }
    return true;
  }

  function fadeOutBackgroundMusic(durationMs) {
    bgmShouldPlay = false;
    if (bgmTrack) {
      bgmOffsets.set(bgmTrack, 0);
    }
    cancelBgmStopTimer();
    if (!activeBgmSource || !audioContext || !bgmMasterGain) {
      stopBackgroundMusic();
      return;
    }

    try {
      const now = audioContext.currentTime;
      const stopAt = now + (durationMs / 1_000);
      bgmMasterGain.gain.cancelScheduledValues(now);
      bgmMasterGain.gain.setValueAtTime(bgmMasterGain.gain.value, now);
      bgmMasterGain.gain.linearRampToValueAtTime(0, stopAt);
      bgmStopTimer = window.setTimeout(() => {
        bgmStopTimer = null;
        stopBackgroundMusic();
      }, durationMs);
    } catch {
      stopBackgroundMusic();
    }
  }

  function duckBackgroundMusic() {
    if (
      !musicEnabled
      || !activeBgmSource
      || !audioContext
      || !bgmMasterGain
      || audioContext.state === "closed"
    ) {
      return;
    }

    try {
      const now = audioContext.currentTime;
      const attackAt = now + (BGM_DUCK_ATTACK_MS / 1_000);
      const releaseAt = attackAt + (BGM_DUCK_HOLD_MS / 1_000);
      const restoredAt = releaseAt + (BGM_DUCK_RELEASE_MS / 1_000);
      const restoredGain = BGM_DEFINITIONS[activeBgmTrack]?.gain
        ?? BGM_MASTER_GAIN;
      bgmMasterGain.gain.cancelScheduledValues(now);
      bgmMasterGain.gain.setValueAtTime(bgmMasterGain.gain.value, now);
      bgmMasterGain.gain.linearRampToValueAtTime(BGM_DUCK_GAIN, attackAt);
      bgmMasterGain.gain.setValueAtTime(BGM_DUCK_GAIN, releaseAt);
      bgmMasterGain.gain.linearRampToValueAtTime(restoredGain, restoredAt);
    } catch {
      // A missed duck never delays victim finalization.
    }
  }

  function startSoundEffect(context, name, definition, buffer) {
    if (
      !soundEnabled
      || audioContext !== context
      || context.state === "closed"
    ) {
      return false;
    }

    try {
      if (definition.group === "press") {
        while (activePressSources.length >= SFX_PRESS_VOICE_LIMIT) {
          stopSoundSource(activePressSources[0]);
        }
      }

      const source = context.createBufferSource();
      const gainNode = context.createGain();
      const record = { source, gainNode, group: definition.group };
      source.buffer = buffer;
      gainNode.gain.setValueAtTime(definition.gain, context.currentTime);
      source.connect(gainNode).connect(sfxMasterGain);
      source.onended = () => {
        retireSoundSource(record);
        source.disconnect();
        gainNode.disconnect();
      };
      activeSfxSources.add(record);
      if (record.group === "press") {
        activePressSources.push(record);
      }
      source.start();
      return true;
    } catch {
      // Audio feedback is optional and never blocks gameplay.
      return false;
    }
  }

  function startDialogueBlip(context, voice) {
    if (
      voice !== "elegant-demon"
      || !soundEnabled
      || dialogueBlipVolume <= 0
      || audioContext !== context
      || context.state !== "running"
      || !sfxMasterGain
    ) {
      return false;
    }

    try {
      while (activeDialogueSources.length >= DIALOGUE_BLIP_VOICE_LIMIT) {
        stopSoundSource(activeDialogueSources[0]);
      }

      const now = context.currentTime;
      const attackAt = now + (DIALOGUE_BLIP_PROFILE.attackMs / 1_000);
      const sustainAt = now + (DIALOGUE_BLIP_PROFILE.sustainMs / 1_000);
      const releaseAt = now + (DIALOGUE_BLIP_PROFILE.releaseMs / 1_000);
      const stopAt = now + (DIALOGUE_BLIP_PROFILE.durationMs / 1_000);
      const oscillator = context.createOscillator();
      const filterNode = context.createBiquadFilter();
      const gainNode = context.createGain();
      const detune = DIALOGUE_BLIP_PROFILE.detuneCents[
        dialogueBlipSequence % DIALOGUE_BLIP_PROFILE.detuneCents.length
      ];
      const record = {
        source: oscillator,
        filterNode,
        gainNode,
        group: "dialogue",
      };

      oscillator.type = DIALOGUE_BLIP_PROFILE.oscillatorType;
      oscillator.frequency.setValueAtTime(
        DIALOGUE_BLIP_PROFILE.startFrequencyHz,
        now,
      );
      oscillator.frequency.exponentialRampToValueAtTime(
        DIALOGUE_BLIP_PROFILE.endFrequencyHz,
        releaseAt,
      );
      oscillator.detune.setValueAtTime(detune, now);
      filterNode.type = "lowpass";
      filterNode.frequency.setValueAtTime(
        DIALOGUE_BLIP_PROFILE.lowpassFrequencyHz,
        now,
      );
      filterNode.Q.setValueAtTime(DIALOGUE_BLIP_PROFILE.lowpassQ, now);
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(
        DIALOGUE_BLIP_PROFILE.peakGain * dialogueBlipVolume,
        attackAt,
      );
      gainNode.gain.linearRampToValueAtTime(
        DIALOGUE_BLIP_PROFILE.sustainGain * dialogueBlipVolume,
        sustainAt,
      );
      gainNode.gain.exponentialRampToValueAtTime(0.0001, releaseAt);
      oscillator.connect(filterNode).connect(gainNode).connect(sfxMasterGain);
      oscillator.onended = () => {
        retireSoundSource(record);
        oscillator.disconnect();
        filterNode.disconnect();
        gainNode.disconnect();
      };
      activeSfxSources.add(record);
      activeDialogueSources.push(record);
      dialogueBlipSequence += 1;
      oscillator.start(now);
      oscillator.stop(stopAt);
      return true;
    } catch {
      // Character voice is optional and never delays the dialogue.
      return false;
    }
  }

  function playDialogueBlip(voice, character) {
    if (
      voice !== "elegant-demon"
      || !soundEnabled
      || !isDialogueBlipCharacter(character)
    ) {
      return false;
    }

    const now = performance.now();
    if (now - lastDialogueBlipAt < DIALOGUE_BLIP_INTERVAL_MS) {
      return false;
    }
    if (
      !audioContext
      || !sfxMasterGain
      || audioContext.state !== "running"
    ) {
      return false;
    }
    if (!startDialogueBlip(audioContext, voice)) {
      return false;
    }
    lastDialogueBlipAt = now;
    return true;
  }

  function playSoundEffect(name) {
    if (!soundEnabled) {
      return false;
    }

    const definition = SFX_DEFINITIONS[name];
    const context = getAudioContext();
    const buffer = sfxBuffers.get(name);
    if (!definition || !context || !sfxMasterGain || !buffer) {
      primeSoundEffects();
      return false;
    }

    if (context.state !== "running") {
      void context.resume()
        .then(() => startSoundEffect(context, name, definition, buffer))
        .catch(() => false);
      return true;
    }
    return startSoundEffect(context, name, definition, buffer);
  }

  function playUiAdvance() {
    return playSoundEffect("uiAdvance");
  }

  function renderSoundToggle() {
    elements.soundToggle.textContent = soundEnabled
      ? "[ 효과음: 켬 ]"
      : "[ 효과음: 끔 ]";
    elements.soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  }

  function renderDialogueBlipVolume() {
    const percentage = Math.round(dialogueBlipVolume * 100);
    elements.dialogueBlipVolume.value = String(percentage);
    elements.dialogueBlipVolumeValue.textContent = `${percentage}%`;
    elements.dialogueBlipVolume.setAttribute("aria-valuetext", `${percentage}%`);
  }

  function renderMusicToggle() {
    elements.musicToggle.textContent = musicEnabled
      ? "[ 음악: 켬 ]"
      : "[ 음악: 끔 ]";
    elements.musicToggle.setAttribute("aria-pressed", String(musicEnabled));
  }

  function persistSoundPreference() {
    if (!soundPreferenceAvailable) {
      return;
    }
    try {
      window.localStorage.setItem(SFX_PREFERENCE_KEY, soundEnabled ? "1" : "0");
    } catch {
      soundPreferenceAvailable = false;
    }
  }

  function persistDialogueBlipVolume() {
    if (!dialogueBlipVolumePreferenceAvailable) {
      return;
    }
    try {
      window.localStorage.setItem(
        DIALOGUE_BLIP_VOLUME_KEY,
        String(dialogueBlipVolume),
      );
    } catch {
      dialogueBlipVolumePreferenceAvailable = false;
    }
  }

  function persistMusicPreference() {
    if (!musicPreferenceAvailable) {
      return;
    }
    try {
      window.localStorage.setItem(BGM_PREFERENCE_KEY, musicEnabled ? "1" : "0");
    } catch {
      musicPreferenceAvailable = false;
    }
  }

  function onSoundToggle() {
    soundEnabled = !soundEnabled;
    renderSoundToggle();
    updateSfxMasterGain();
    persistSoundPreference();
    if (!soundEnabled) {
      stopAllSoundEffects();
      return;
    }
    primeSoundEffects();
  }

  function onDialogueBlipVolumeInput() {
    const percentage = Number(elements.dialogueBlipVolume.value);
    if (!Number.isFinite(percentage)) {
      return;
    }
    dialogueBlipVolume = Math.min(
      Math.max(percentage / 100, DIALOGUE_BLIP_VOLUME_MIN),
      DIALOGUE_BLIP_VOLUME_MAX,
    );
    renderDialogueBlipVolume();
    persistDialogueBlipVolume();
    primeAudio();
    playDialogueBlip("elegant-demon", "아");
  }

  function onMusicToggle() {
    musicEnabled = !musicEnabled;
    renderMusicToggle();
    persistMusicPreference();
    if (!musicEnabled) {
      stopBackgroundMusic({ preserveOffset: true });
      return;
    }
    primeAudio();
  }

  function playRouletteLock(now) {
    if (
      reducedMotion.matches
      || now - lastRouletteLockAt < SFX_ROULETTE_INTERVAL_MS
    ) {
      return;
    }
    if (playSoundEffect("rouletteLock")) {
      lastRouletteLockAt = now;
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
    playSoundEffect(
      progression.enhancedSwitchToneUnlocked
        ? "switchPressHeavy"
        : "switchPress",
    );
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

  function completeRollBatch(batch) {
    if (!batch || batch.remaining <= 0) {
      return;
    }
    batch.remaining -= 1;
    if (batch.remaining === 0 && !batch.latchPlayed) {
      batch.latchPlayed = true;
      duckBackgroundMusic();
      playSoundEffect("resultLatch");
    }
  }

  function finishRoll(roll) {
    if (!activeRolls.has(roll)) {
      return;
    }
    activeRolls.delete(roll);
    finishEntry(roll.entry, roll.victim, roll.sequence, roll.name);
    completeRollBatch(roll.batch);
    stopRollTimerIfIdle();
  }

  function tickRoll(roll, now) {
    const elapsed = now - roll.startedAt;
    const [locationStop, nameStop, ageStop, sexStop, causeStop] = roll.stopTimes;

    if (!roll.fixed[0]) {
      if (elapsed >= locationStop) {
        roll.entry.location.textContent = locationLabel(roll.victim.locationCode);
        roll.fixed[0] = true;
        playRouletteLock(now);
      } else {
        roll.entry.location.textContent = randomLocationText();
      }
    }
    if (!roll.fixed[1]) {
      if (elapsed >= nameStop) {
        roll.entry.name.textContent = roll.name;
        roll.fixed[1] = true;
        playRouletteLock(now);
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
        playRouletteLock(now);
      } else {
        roll.entry.age.textContent = ageDisplay(Math.floor(rng() * 101));
      }
    }
    if (!roll.fixed[3]) {
      if (elapsed >= sexStop) {
        setSexDisplay(roll.entry.sex, roll.victim.sex);
        roll.fixed[3] = true;
        playRouletteLock(now);
      } else {
        setSexDisplay(roll.entry.sex, rng() < 0.5 ? "male" : "female");
      }
    }
    if (!roll.fixed[4]) {
      if (elapsed >= causeStop) {
        setCauseDisplay(roll.entry.cause, roll.victim);
        roll.fixed[4] = true;
        playRouletteLock(now);
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

  function startRoll(victim, sequence, progression, slot, batch) {
    const entry = createLogEntry();
    const name = syntheticNameFor(victim, sequence, slot);

    if (reducedMotion.matches) {
      entry.location.textContent = "결정 중…";
      entry.name.textContent = "결정 중…";
      entry.age.textContent = "결정 중…";
      entry.sex.textContent = "결정 중…";
      entry.cause.textContent = "결정 중…";
      window.setTimeout(() => {
        finishEntry(entry, victim, sequence, name);
        completeRollBatch(batch);
      }, 250);
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
      batch,
    };
    activeRolls.add(roll);
    tickRoll(roll, roll.startedAt);
    ensureRollTimer();
  }

  function onVisibility() {
    if (document.hidden) {
      cancelOpeningTextPress();
      resetOpeningParallax();
      finishSceneTransition();
      completeOpeningTyping();
      stopDialogueBlips();
      stopBackgroundMusic({ preserveOffset: true });
      releaseSpaceKey();
      return;
    }
    primeAudio();
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
      || event.target === elements.openingAdvance
      || event.target === elements.musicToggle
      || event.target === elements.soundToggle
      || elements.setupScreen.contains(event.target)
      || isEditableTarget(event.target)
    ) {
      return;
    }
    if (isOpeningDialogueActive()) {
      event.preventDefault();
      if (!event.repeat) {
        triggerOpeningTextAdvance();
      }
      return;
    }
    if (isSceneTransitioning()) {
      event.preventDefault();
      releaseSpaceKey();
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
      || event.target === elements.openingAdvance
      || event.target === elements.processingUpgrade
      || event.target === elements.musicToggle
      || event.target === elements.soundToggle
      || elements.setupScreen.contains(event.target)
      || isEditableTarget(event.target)
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

  function onButtonKeyDown(event) {
    if (event.key === "Enter" && event.repeat) {
      event.preventDefault();
    }
  }

  function releaseSpaceKey() {
    elements.button.classList.remove("is-key-active");
  }

  function onWindowBlur() {
    cancelOpeningTextPress();
    resetOpeningParallax();
    completeOpeningTyping();
    stopDialogueBlips();
    releaseSpaceKey();
  }

  function onPurchaseProcessingOptimization() {
    if (
      isSceneTransitioning()
      || !gameStarted
      || !canPurchaseProcessingOptimization(state)
    ) {
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
    if (isSceneTransitioning() || !gameStarted) {
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
      const rollBatch = {
        remaining: victims.length,
        latchPlayed: false,
      };
      victims.forEach((victim, slot) => {
        startRoll(
          victim,
          firstSequence + slot,
          nextProgression,
          slot,
          rollBatch,
        );
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
  renderMusicToggle();
  renderSoundToggle();
  renderDialogueBlipVolume();
  void preloadSoundEffects();
  void Promise.all(Object.keys(BGM_DEFINITIONS).map(preloadBackgroundMusic));
  initializeOpeningFlow();

  elements.button.addEventListener("click", onPress);
  elements.button.addEventListener("keydown", onButtonKeyDown);
  elements.musicToggle.addEventListener("click", onMusicToggle);
  elements.soundToggle.addEventListener("click", onSoundToggle);
  elements.dialogueBlipVolume.addEventListener(
    "input",
    onDialogueBlipVolumeInput,
  );
  elements.languageKorean.addEventListener("click", chooseLanguage);
  elements.languageKorean.addEventListener("keydown", onSetupActionKeyDown);
  elements.profileMale.addEventListener(
    "click",
    () => chooseProfile("male"),
  );
  elements.profileFemale.addEventListener(
    "click",
    () => chooseProfile("female"),
  );
  elements.profileMale.addEventListener("keydown", onSetupActionKeyDown);
  elements.profileFemale.addEventListener("keydown", onSetupActionKeyDown);
  elements.setupNameForm.addEventListener("submit", onSetupNameSubmit);
  elements.playerNameInput.addEventListener("keydown", onPlayerNameKeyDown);
  elements.nameConfirm.addEventListener("keydown", onSetupActionKeyDown);
  elements.openingAdvance.addEventListener("click", advanceOpening);
  elements.openingAdvance.addEventListener("keydown", onOpeningActionKeyDown);
  elements.openingMessage.addEventListener("click", onOpeningMessageClick);
  elements.openingMessage.addEventListener("keydown", onOpeningMessageKeyDown);
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
  window.addEventListener("pointermove", onOpeningParallaxPointerMove);
  elements.stage.addEventListener("pointerleave", onOpeningParallaxPointerLeave);
  document.addEventListener("pointerdown", primeAudio, { capture: true });
  document.addEventListener("keydown", primeAudio, { capture: true });
  document.addEventListener("keydown", onSpaceKeyDown);
  document.addEventListener("keyup", onSpaceKeyUp);
  document.addEventListener("visibilitychange", onVisibility);
  reducedMotion.addEventListener("change", onReducedMotionChange);
  window.addEventListener("blur", onWindowBlur);
  window.setInterval(renderPopulation, 500);
}

if (typeof document !== "undefined") {
  initializeGame();
}
