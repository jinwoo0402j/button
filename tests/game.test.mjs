import assert from "node:assert/strict";
import test from "node:test";

import {
  CAUSE_EMOJIS,
  CAUSE_TAGS,
  ETHICS_TARGETS,
  MONEY_GOALS,
  OPTIMIZED_PROCESSING_COUNT,
  POPULATION_BASE,
  POPULATION_EPOCH_MS,
  PROCESSING_OPTIMIZATION_COST,
  ROULETTE_DURATIONS_MS,
  SEX_EMOJIS,
  SYNTHETIC_NAMES,
  TARGET_SELECTION_KEY,
  canPurchaseProcessingOptimization,
  ageBarFor,
  commitPress,
  causeTagFor,
  createUniformRandom,
  createWeightedSampler,
  decodeWeights,
  defaultState,
  moneyForPresses,
  parseStoredState,
  parseTargetSelection,
  populationAt,
  progressionForPresses,
  purchaseProcessingOptimization,
  rouletteStopTimes,
  sampleVictim,
  serializeState,
  syntheticNameFor,
  weightedIndex,
} from "../game.js";
import {
  CAUSES,
  DEMOGRAPHIC_SHAPE,
  LOCATIONS,
} from "../stats.generated.js";

test("native emoji maps cover every visual roulette category", () => {
  assert.deepEqual(Object.keys(SEX_EMOJIS).sort(), ["female", "male"]);
  assert.deepEqual(
    Object.keys(CAUSE_EMOJIS).filter((id) => id !== "button").sort(),
    CAUSES.map((cause) => cause.id).sort(),
  );
  assert.equal(SEX_EMOJIS.female, "👩");
  assert.equal(SEX_EMOJIS.male, "👨");
  assert.equal(CAUSE_EMOJIS.button, "🔘");
});

test("population uses the fixed epoch, +2 per second, and processed units", () => {
  assert.equal(populationAt(POPULATION_EPOCH_MS - 60_000, 0), POPULATION_BASE);
  assert.equal(populationAt(POPULATION_EPOCH_MS, 0), POPULATION_BASE);
  assert.equal(populationAt(POPULATION_EPOCH_MS + 999, 0), POPULATION_BASE);
  assert.equal(populationAt(POPULATION_EPOCH_MS + 1_000, 0), POPULATION_BASE + 2);
  assert.equal(populationAt(POPULATION_EPOCH_MS + 10_000, 3), POPULATION_BASE + 17);
});

test("money is derived only from completed press records", () => {
  assert.equal(moneyForPresses(0), 0);
  assert.equal(moneyForPresses(1), 1_000_000);
  assert.equal(moneyForPresses(12), 12_000_000);
  assert.throws(() => moneyForPresses(-1), /outside the supported range/);
});

test("ethical target choices keep the exact order and session index contract", () => {
  assert.equal(TARGET_SELECTION_KEY, "jinwoo-button:target:v1");
  assert.deepEqual(ETHICS_TARGETS, [
    "전 세계 사람 중 무작위 1명",
    "유죄가 확정된 범죄자 중 1명",
    "흉악범 중 1명",
    "사형이 확정된 수형자 중 1명",
    "가상의 사형 집행 예정 시점이 가까운 상위 50% 중 1명",
  ]);
  ETHICS_TARGETS.forEach((_, index) => {
    assert.equal(parseTargetSelection(String(index)), index);
  });
  assert.equal(parseTargetSelection(null), null);
  assert.equal(parseTargetSelection("5"), null);
  assert.equal(parseTargetSelection("01"), null);
});

test("decodes the generated little-endian demographic payload", () => {
  const weights = decodeWeights();
  assert.equal(
    weights.length,
    DEMOGRAPHIC_SHAPE.locations
      * DEMOGRAPHIC_SHAPE.ages
      * DEMOGRAPHIC_SHAPE.sexes.length,
  );
  assert.equal(weights.length, 47_874);
  assert.equal(weights.some((weight) => weight > 0), true);
});

test("weighted sampler honors zero weights and cumulative boundaries", () => {
  assert.equal(weightedIndex([0, 2, 3], () => 0), 1);
  assert.equal(weightedIndex([0, 2, 3], () => 0.399999), 1);
  assert.equal(weightedIndex([0, 2, 3], () => 0.4), 2);
  assert.equal(weightedIndex([0, 2, 3], () => 0.999999), 2);

  const sampler = createWeightedSampler([1, 0, 1]);
  assert.equal(sampler.total, 2);
  assert.equal(sampler(() => 0), 0);
  assert.equal(sampler(() => 0.5), 2);
});

test("53-bit random source stays inside the half-open unit interval", () => {
  const zeroCrypto = {
    getRandomValues(values) {
      values[0] = 0;
      values[1] = 0;
      return values;
    },
  };
  const maxCrypto = {
    getRandomValues(values) {
      values[0] = 0xffff_ffff;
      values[1] = 0xffff_ffff;
      return values;
    },
  };
  assert.equal(createUniformRandom(zeroCrypto)(), 0);
  const maximum = createUniformRandom(maxCrypto)();
  assert.ok(maximum < 1);
  assert.ok(maximum > 0.999999999999);
});

test("sampling decodes location, single age, sex, and a weighted cause", () => {
  const victim = sampleVictim({
    demographicSampler: () => 0,
    causeSampler: () => 0,
    rng: () => 0.5,
  });
  assert.deepEqual(victim, {
    locationCode: LOCATIONS[0].code,
    age: 0,
    sex: "male",
    causeId: CAUSES[0].id,
    buttonCause: false,
  });

  const buttonVictim = sampleVictim({
    demographicSampler: () => 203,
    causeSampler: () => 0,
    rng: () => 0,
  });
  assert.deepEqual(buttonVictim, {
    locationCode: LOCATIONS[1].code,
    age: 0,
    sex: "female",
    causeId: "button",
    buttonCause: true,
  });
});

test("synthetic identity and text infographic helpers stay local and stable", () => {
  const victim = {
    locationCode: LOCATIONS[0].code,
    age: 34,
    sex: "female",
    causeId: "ischaemic-heart-disease",
    buttonCause: false,
  };
  const name = syntheticNameFor(victim, 7, 1);
  assert.equal(SYNTHETIC_NAMES.includes(name), true);
  assert.equal(syntheticNameFor(victim, 7, 1), name);
  assert.equal(ageBarFor(34), "■■■░░░░░░░");
  assert.equal(ageBarFor(100), "■■■■■■■■■■");
  assert.equal(ageBarFor(0), "░░░░░░░░░░");
  assert.equal(causeTagFor(victim), "심장");
  assert.equal(CAUSE_TAGS.button, "버튼");
  assert.throws(() => syntheticNameFor(victim, 0, 0), /invalid/);
  assert.throws(() => ageBarFor(101), /invalid age/);
});

test("stored state migrates v1, preserves v2 balances, and rejects corruption", () => {
  const legacy = {
    version: 1,
    presses: 1,
    lastVictim: {
      locationCode: LOCATIONS[0].code,
      age: 42,
      sex: "female",
      causeId: CAUSES[0].id,
      buttonCause: false,
    },
  };
  const migrated = {
    version: 2,
    presses: 1,
    processed: 1,
    balance: 1_000_000,
    processingOptimized: false,
    lastVictim: { ...legacy.lastVictim },
  };
  assert.deepEqual(parseStoredState(JSON.stringify(legacy)), {
    state: migrated,
    recovered: false,
  });
  const encoded = serializeState(legacy);
  assert.deepEqual(parseStoredState(encoded), { state: migrated, recovered: false });

  assert.deepEqual(parseStoredState("not-json"), {
    state: defaultState(),
    recovered: true,
  });
  assert.equal(
    parseStoredState(JSON.stringify({ ...migrated, presses: -1 })).recovered,
    true,
  );
  assert.equal(
    parseStoredState(JSON.stringify({ ...migrated, balance: 0 })).recovered,
    true,
  );
  assert.equal(
    parseStoredState(JSON.stringify({ ...migrated, processed: 2 })).recovered,
    true,
  );
  assert.equal(
    parseStoredState(JSON.stringify({ ...legacy, lastVictim: { ...legacy.lastVictim, age: 101 } })).recovered,
    true,
  );
});

test("one commit creates exactly one death/reward record", () => {
  const victim = {
    locationCode: LOCATIONS[0].code,
    age: 31,
    sex: "male",
    causeId: CAUSES[1].id,
    buttonCause: false,
  };
  const before = defaultState();
  const after = commitPress(before, victim);

  assert.equal(before.presses, 0);
  assert.equal(after.presses, 1);
  assert.equal(after.processed, 1);
  assert.equal(after.balance, 1_000_000);
  assert.equal(after.processingOptimized, false);
  assert.notEqual(after.lastVictim, victim);
  assert.deepEqual(after.lastVictim, victim);
  assert.equal(moneyForPresses(after.presses), 1_000_000);
  assert.equal(
    populationAt(POPULATION_EPOCH_MS, after.processed),
    POPULATION_BASE - 1,
  );
});

test("rapid consecutive commits record every press and restore the latest victim", () => {
  const victims = [
    {
      locationCode: LOCATIONS[0].code,
      age: 19,
      sex: "female",
      causeId: CAUSES[0].id,
      buttonCause: false,
    },
    {
      locationCode: LOCATIONS[1].code,
      age: 44,
      sex: "male",
      causeId: CAUSES[1].id,
      buttonCause: false,
    },
    {
      locationCode: LOCATIONS[2].code,
      age: 81,
      sex: "female",
      causeId: "button",
      buttonCause: true,
    },
  ];

  const state = victims.reduce(commitPress, defaultState());
  const restored = parseStoredState(serializeState(state));

  assert.equal(state.presses, 3);
  assert.equal(state.processed, 3);
  assert.equal(state.balance, 3_000_000);
  assert.equal(
    populationAt(POPULATION_EPOCH_MS, state.processed),
    POPULATION_BASE - 3,
  );
  assert.deepEqual(state.lastVictim, victims.at(-1));
  assert.deepEqual(restored, { state, recovered: false });
});

test("processing optimization costs five million and doubles later processing", () => {
  const victim = {
    locationCode: LOCATIONS[0].code,
    age: 37,
    sex: "female",
    causeId: CAUSES[0].id,
    buttonCause: false,
  };
  let state = defaultState();
  for (let press = 0; press < 4; press += 1) {
    state = commitPress(state, victim);
  }

  assert.equal(state.balance, 4_000_000);
  assert.equal(canPurchaseProcessingOptimization(state), false);
  assert.throws(
    () => purchaseProcessingOptimization(state),
    /unavailable/,
  );

  state = commitPress(state, victim);
  assert.equal(state.balance, PROCESSING_OPTIMIZATION_COST);
  assert.equal(canPurchaseProcessingOptimization(state), true);

  const purchased = purchaseProcessingOptimization(state);
  assert.equal(state.balance, 5_000_000);
  assert.equal(purchased.balance, 0);
  assert.equal(purchased.processingOptimized, true);
  assert.equal(purchased.presses, 5);
  assert.equal(purchased.processed, 5);
  assert.equal(canPurchaseProcessingOptimization(purchased), false);
  assert.throws(
    () => purchaseProcessingOptimization(purchased),
    /unavailable/,
  );

  const secondVictim = {
    ...victim,
    age: 68,
    sex: "male",
    causeId: CAUSES[1].id,
  };
  assert.throws(() => commitPress(purchased, victim), /invalid victims/);
  const afterClick = commitPress(purchased, [victim, secondVictim]);
  assert.equal(OPTIMIZED_PROCESSING_COUNT, 2);
  assert.equal(afterClick.presses, 6);
  assert.equal(afterClick.processed, 7);
  assert.equal(afterClick.balance, 2_000_000);
  assert.deepEqual(afterClick.lastVictim, secondVictim);
  assert.equal(
    populationAt(POPULATION_EPOCH_MS, afterClick.processed),
    POPULATION_BASE - 7,
  );

  const afterSpace = commitPress(afterClick, [secondVictim, victim]);
  assert.equal(afterSpace.presses, 7);
  assert.equal(afterSpace.processed, 9);
  assert.equal(afterSpace.balance, 4_000_000);
  assert.deepEqual(afterSpace.lastVictim, victim);
  assert.deepEqual(parseStoredState(serializeState(afterSpace)), {
    state: afterSpace,
    recovered: false,
  });
});

test("money goals unlock sequentially at the requested boundaries", () => {
  assert.deepEqual(
    MONEY_GOALS.map((goal) => goal.amount),
    [
      1_000_000,
      3_000_000,
      5_000_000,
      10_000_000,
      25_000_000,
      100_000_000,
      300_000_000,
      500_000_000,
      1_000_000_000,
      5_000_000_000,
      10_000_000_000,
    ],
  );
  assert.deepEqual(
    MONEY_GOALS.map((goal) => goal.label),
    [
      "100만원",
      "300만원",
      "500만원",
      "1000만원",
      "2500만원",
      "1억",
      "3억",
      "5억",
      "10억",
      "50억",
      "100억",
    ],
  );
  assert.deepEqual(
    MONEY_GOALS.map((goal) => goal.requiredPresses),
    [1, 3, 5, 10, 25, 100, 300, 500, 1_000, 5_000, 10_000],
  );
  assert.deepEqual(
    MONEY_GOALS.slice(0, 5).map((goal) => goal.reward),
    ["첫 거래 기록", "버튼 잔상", "CRT 색상", "목표 진행률", "새 버튼 음색"],
  );

  MONEY_GOALS.forEach((goal, index) => {
    const before = progressionForPresses(goal.requiredPresses - 1);
    const reached = progressionForPresses(goal.requiredPresses);
    assert.equal(before.nextGoal.id, goal.id);
    assert.equal(before.unlockedRewardCount, index);
    assert.equal(reached.unlockedRewardCount, index + 1);
    assert.equal(reached.nextGoal?.id || null, MONEY_GOALS[index + 1]?.id || null);
  });
});

test("goal progress, remaining money, and roulette speeds derive only from presses", () => {
  assert.equal(progressionForPresses(0).progressPercent, 0);
  assert.equal(progressionForPresses(2).progressPercent, 50);
  assert.equal(progressionForPresses(4).progressPercent, 50);
  assert.equal(progressionForPresses(9).remainingMoney, 1_000_000);
  assert.equal(progressionForPresses(10).progressPercent, 0);
  assert.equal(progressionForPresses(55).progressPercent, 40);
  assert.equal(progressionForPresses(9_999).remainingPresses, 1);
  assert.equal(progressionForPresses(10_000).complete, true);
  assert.equal(progressionForPresses(10_001).segmentProgress, 1);
  assert.equal(ROULETTE_DURATIONS_MS.length, MONEY_GOALS.length + 1);
  assert.equal(progressionForPresses(25).rouletteDurationMs, 1_200);
  assert.equal(progressionForPresses(100).rouletteDurationMs, 1_200);
  assert.equal(progressionForPresses(300).rouletteDurationMs, 960);

  for (let index = 1; index < ROULETTE_DURATIONS_MS.length; index += 1) {
    assert.ok(ROULETTE_DURATIONS_MS[index] <= ROULETTE_DURATIONS_MS[index - 1]);
  }

  const stopTimes = rouletteStopTimes(1_200);
  assert.deepEqual(stopTimes, [500, 650, 800, 1_000, 1_200]);
  assert.ok(stopTimes.every((time, index) => index === 0 || time > stopTimes[index - 1]));
  assert.throws(() => progressionForPresses(-1), /outside the supported range/);
  assert.throws(() => rouletteStopTimes(0), /positive safe integer/);

  assert.equal(progressionForPresses(0).tradeRecordUnlocked, false);
  assert.equal(progressionForPresses(1).tradeRecordUnlocked, true);
  assert.equal(progressionForPresses(2).buttonTrailUnlocked, false);
  assert.equal(progressionForPresses(3).buttonTrailUnlocked, true);
  assert.equal(progressionForPresses(4).crtColorUnlocked, false);
  assert.equal(progressionForPresses(5).crtColorUnlocked, true);
  assert.equal(progressionForPresses(9).progressUnlocked, false);
  assert.equal(progressionForPresses(10).progressUnlocked, true);
  assert.equal(progressionForPresses(24).enhancedSwitchToneUnlocked, false);
  assert.equal(progressionForPresses(25).enhancedSwitchToneUnlocked, true);
  assert.equal(progressionForPresses(99).holdSpaceUnlocked, false);
  assert.equal(progressionForPresses(100).holdSpaceUnlocked, true);

  assert.deepEqual(Object.keys(defaultState()).sort(), [
    "balance",
    "lastVictim",
    "presses",
    "processed",
    "processingOptimized",
    "version",
  ]);
});
