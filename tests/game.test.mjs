import assert from "node:assert/strict";
import test from "node:test";

import {
  POPULATION_BASE,
  POPULATION_EPOCH_MS,
  commitPress,
  createUniformRandom,
  createWeightedSampler,
  decodeWeights,
  defaultState,
  moneyForPresses,
  parseStoredState,
  populationAt,
  sampleVictim,
  serializeState,
  weightedIndex,
} from "../game.js";
import {
  CAUSES,
  DEMOGRAPHIC_SHAPE,
  LOCATIONS,
} from "../stats.generated.js";

test("population uses the fixed epoch, +2 per second, and -1 per press", () => {
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

test("stored state accepts the v1 schema and rejects corruption", () => {
  const valid = {
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
  const encoded = serializeState(valid);
  assert.deepEqual(parseStoredState(encoded), { state: valid, recovered: false });

  assert.deepEqual(parseStoredState("not-json"), {
    state: defaultState(),
    recovered: true,
  });
  assert.equal(
    parseStoredState(JSON.stringify({ ...valid, presses: -1 })).recovered,
    true,
  );
  assert.equal(
    parseStoredState(JSON.stringify({ ...valid, lastVictim: { ...valid.lastVictim, age: 101 } })).recovered,
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
  assert.notEqual(after.lastVictim, victim);
  assert.deepEqual(after.lastVictim, victim);
  assert.equal(moneyForPresses(after.presses), 1_000_000);
  assert.equal(
    populationAt(POPULATION_EPOCH_MS, after.presses),
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
  assert.equal(moneyForPresses(state.presses), 3_000_000);
  assert.equal(
    populationAt(POPULATION_EPOCH_MS, state.presses),
    POPULATION_BASE - 3,
  );
  assert.deepEqual(state.lastVictim, victims.at(-1));
  assert.deepEqual(restored, { state, recovered: false });
});
