import assert from "node:assert/strict";
import test from "node:test";

import {
  BUTTON_CAUSE_RATE,
  createWeightedSampler,
  decodeWeights,
} from "../game.js";
import {
  CAUSES,
  DEMOGRAPHIC_SHAPE,
  LOCATIONS,
} from "../stats.generated.js";

const SAMPLE_COUNT = 1_000_000;
const MIN_ABSOLUTE_TOLERANCE = 0.002; // 0.2 percentage points.

function createLcg(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function assertProportion(label, observedCount, expectedProbability) {
  const observedProbability = observedCount / SAMPLE_COUNT;
  const sigma = Math.sqrt(
    expectedProbability * (1 - expectedProbability) / SAMPLE_COUNT,
  );
  const tolerance = Math.max(5 * sigma, MIN_ABSOLUTE_TOLERANCE);
  const difference = Math.abs(observedProbability - expectedProbability);

  assert.ok(
    difference <= tolerance,
    `${label}: observed=${observedProbability.toFixed(6)}, `
      + `expected=${expectedProbability.toFixed(6)}, `
      + `difference=${difference.toFixed(6)}, tolerance=${tolerance.toFixed(6)}`,
  );
}

test("one million demographic samples match location, age-band, and sex weights", () => {
  const weights = decodeWeights();
  const sampler = createWeightedSampler(weights);
  const sexCount = DEMOGRAPHIC_SHAPE.sexes.length;
  const cellsPerLocation = DEMOGRAPHIC_SHAPE.ages * sexCount;

  const expectedLocations = new Float64Array(LOCATIONS.length);
  const expectedAgeBands = new Float64Array(3);
  const expectedSexes = new Float64Array(sexCount);

  for (let cellIndex = 0; cellIndex < weights.length; cellIndex += 1) {
    const weight = weights[cellIndex];
    const locationIndex = Math.floor(cellIndex / cellsPerLocation);
    const withinLocation = cellIndex % cellsPerLocation;
    const age = Math.floor(withinLocation / sexCount);
    const sexIndex = withinLocation % sexCount;
    const ageBandIndex = age <= 14 ? 0 : age <= 64 ? 1 : 2;

    expectedLocations[locationIndex] += weight;
    expectedAgeBands[ageBandIndex] += weight;
    expectedSexes[sexIndex] += weight;
  }

  const observedLocations = new Uint32Array(LOCATIONS.length);
  const observedAgeBands = new Uint32Array(3);
  const observedSexes = new Uint32Array(sexCount);
  const rng = createLcg(0x20_26_07_11);

  for (let sample = 0; sample < SAMPLE_COUNT; sample += 1) {
    const cellIndex = sampler(rng);
    const locationIndex = Math.floor(cellIndex / cellsPerLocation);
    const withinLocation = cellIndex % cellsPerLocation;
    const age = Math.floor(withinLocation / sexCount);
    const sexIndex = withinLocation % sexCount;

    observedLocations[locationIndex] += 1;
    observedAgeBands[age <= 14 ? 0 : age <= 64 ? 1 : 2] += 1;
    observedSexes[sexIndex] += 1;
  }

  const topTenLocations = Array.from(expectedLocations, (weight, index) => ({
    index,
    weight,
  }))
    .sort((left, right) => right.weight - left.weight)
    .slice(0, 10);

  for (const { index, weight } of topTenLocations) {
    assertProportion(
      `location ${LOCATIONS[index].code}`,
      observedLocations[index],
      weight / sampler.total,
    );
  }

  const ageBandLabels = ["age 0-14", "age 15-64", "age 65+"];
  for (let index = 0; index < ageBandLabels.length; index += 1) {
    assertProportion(
      ageBandLabels[index],
      observedAgeBands[index],
      expectedAgeBands[index] / sampler.total,
    );
  }

  for (let index = 0; index < DEMOGRAPHIC_SHAPE.sexes.length; index += 1) {
    assertProportion(
      `sex ${DEMOGRAPHIC_SHAPE.sexes[index]}`,
      observedSexes[index],
      expectedSexes[index] / sampler.total,
    );
  }
});

test("one million cause samples match all eleven WHO-derived weights", () => {
  const causeWeights = CAUSES.map((cause) => cause.weight);
  const sampler = createWeightedSampler(causeWeights);
  const observed = new Uint32Array(CAUSES.length);
  const rng = createLcg(0xca_05_e5_21);

  for (let sample = 0; sample < SAMPLE_COUNT; sample += 1) {
    observed[sampler(rng)] += 1;
  }

  for (let index = 0; index < CAUSES.length; index += 1) {
    assertProportion(
      `cause ${CAUSES[index].id}`,
      observed[index],
      CAUSES[index].weight / sampler.total,
    );
  }
});

test("one million Bernoulli samples match the one-percent button cause", () => {
  const rng = createLcg(0xb0_77_00_01);
  let observed = 0;

  for (let sample = 0; sample < SAMPLE_COUNT; sample += 1) {
    if (rng() < BUTTON_CAUSE_RATE) {
      observed += 1;
    }
  }

  assertProportion("button cause", observed, BUTTON_CAUSE_RATE);
});
