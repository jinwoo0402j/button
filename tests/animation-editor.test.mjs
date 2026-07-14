import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

await import("../animation-editor-core.js");

const Core = globalThis.FrameAnimationCore;
const html = readFileSync(new URL("../animation-editor.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../animation-editor.js", import.meta.url), "utf8");

function makeProject({ loop = true } = {}) {
  return Core.normalizeProject({
    version: 1,
    name: "test-animation",
    canvas: { width: 720, height: 1060 },
    loop,
    referenceAssetId: "a",
    assets: [
      {
        id: "a",
        label: "A",
        src: "./assets/a.webp",
        fileName: "a.webp",
        width: 720,
        height: 1060,
        offsetX: 2,
        offsetY: -1,
      },
      {
        id: "b",
        label: "B",
        src: "./assets/b.webp",
        fileName: "b.webp",
        width: 720,
        height: 1060,
      },
      {
        id: "c",
        label: "C",
        src: "./assets/c.webp",
        fileName: "c.webp",
        width: 720,
        height: 1060,
      },
    ],
    sequence: [
      { id: "cue-a", assetId: "a", durationMs: 100 },
      { id: "cue-b", assetId: "b", durationMs: 200 },
      { id: "cue-c", assetId: "c", durationMs: 50 },
    ],
  });
}

test("the editor is a dependency-free frame replacement tool", () => {
  for (const id of [
    "frame-stage",
    "preview-canvas",
    "timeline",
    "play-toggle",
    "timeline-scrubber",
    "frame-input",
    "replace-input",
    "frame-duration",
    "onion-toggle",
    "difference-toggle",
    "ab-toggle",
    "export-project",
    "export-frame",
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /accept="\.png,\.webp,image\/png,image\/webp"/);
  assert.match(html, /<script src="\.\/animation-editor-core\.js"><\/script>/);
  assert.match(html, /<script src="\.\/animation-editor\.js"><\/script>/);
  assert.doesNotMatch(html, /https?:\/\//);
  assert.match(script, /opening-demon-blink-closed\.webp/);
  assert.match(script, /requestAnimationFrame\(tick\)/);
});

test("one cumulative timeline chooses exact frame boundaries", () => {
  const project = makeProject();
  assert.equal(Core.totalDuration(project), 350);
  assert.equal(Core.frameIndexAtTime(project, 0), 0);
  assert.equal(Core.frameIndexAtTime(project, 99), 0);
  assert.equal(Core.frameIndexAtTime(project, 100), 1);
  assert.equal(Core.frameIndexAtTime(project, 299), 1);
  assert.equal(Core.frameIndexAtTime(project, 300), 2);
  assert.equal(Core.frameIndexAtTime(project, 349), 2);
  assert.equal(Core.frameIndexAtTime(project, 350), 0);
  assert.equal(Core.frameIndexAtTime(project, 700), 0);

  const nonLooping = makeProject({ loop: false });
  assert.equal(Core.frameIndexAtTime(nonLooping, 350), 2);
  assert.equal(Core.frameIndexAtTime(nonLooping, 10_000), 2);
});

test("duration editing accepts only practical positive integer values", () => {
  assert.equal(Core.validateDuration(16), 16);
  assert.equal(Core.validateDuration(10_000), 10_000);
  for (const invalid of [0, -1, 15, 10_001, 20.5, Number.NaN, Infinity, "120"] ) {
    assert.throws(() => Core.validateDuration(invalid));
  }

  const project = makeProject();
  const updated = Core.updateCueDuration(project, "cue-b", 320);
  assert.equal(updated.sequence[1].durationMs, 320);
  assert.equal(Core.totalDuration(updated), 470);
  assert.equal(project.sequence[1].durationMs, 200);
});

test("adding frames creates stable unique assets and cues without mutating input", () => {
  const project = makeProject();
  const snapshot = JSON.stringify(project);
  const result = Core.addAssetCues(
    project,
    [
      {
        src: "blob:first",
        sourcePath: "./assets/new-frame.webp",
        fileName: "new-frame.webp",
        width: 720,
        height: 1060,
      },
      {
        src: "blob:second",
        sourcePath: "./assets/new-frame-copy.webp",
        fileName: "new-frame.webp",
        width: 720,
        height: 1060,
      },
    ],
    "cue-a",
  );

  assert.equal(JSON.stringify(project), snapshot);
  assert.deepEqual(
    result.project.sequence.slice(1, 3).map((cue) => cue.assetId),
    ["new-frame", "new-frame-2"],
  );
  assert.deepEqual(
    result.project.assets.slice(-2).map((asset) => asset.fileName),
    ["new-frame.webp", "new-frame-2.webp"],
  );
  assert.deepEqual(
    result.project.assets.slice(-2).map((asset) => asset.sourcePath),
    ["./assets/new-frame.webp", "./assets/new-frame-2.webp"],
  );
  assert.equal(result.project.sequence[1].durationMs, Core.DEFAULT_DURATION_MS);
  assert.equal(result.selectedCueId, result.project.sequence[2].id);
});

test("replacing an asset preserves its timeline identity, timing, and alignment", () => {
  const project = makeProject();
  const replaced = Core.replaceAsset(project, "a", {
    src: "blob:replacement",
    sourcePath: "./assets/replacement.webp",
    fileName: "replacement.webp",
    width: 720,
    height: 1060,
  });

  assert.equal(replaced.assets[0].id, "a");
  assert.equal(replaced.assets[0].label, "A");
  assert.equal(replaced.assets[0].offsetX, 2);
  assert.equal(replaced.assets[0].offsetY, -1);
  assert.equal(replaced.assets[0].src, "blob:replacement");
  assert.deepEqual(replaced.sequence, project.sequence);
  assert.equal(project.assets[0].src, "./assets/a.webp");
});

test("duplicate, reorder, and delete keep a valid selection and at least one cue", () => {
  const project = makeProject();
  const duplicate = Core.duplicateCue(project, "cue-b");
  assert.equal(duplicate.project.sequence.length, 4);
  assert.equal(duplicate.project.sequence[2].assetId, "b");
  assert.equal(duplicate.project.sequence[2].durationMs, 200);

  const moved = Core.moveCue(duplicate.project, duplicate.selectedCueId, 0);
  assert.equal(moved.sequence[0].id, duplicate.selectedCueId);
  assert.equal(moved.sequence[0].assetId, "b");

  const deleted = Core.deleteCue(moved, duplicate.selectedCueId);
  assert.equal(deleted.deleted, true);
  assert.equal(deleted.project.sequence.length, 3);
  assert.ok(deleted.project.sequence.some((cue) => cue.id === deleted.selectedCueId));

  const single = Core.normalizeProject({
    ...project,
    assets: [project.assets[0]],
    sequence: [project.sequence[0]],
  });
  const protectedLastCue = Core.deleteCue(single, "cue-a");
  assert.equal(protectedLastCue.deleted, false);
  assert.equal(protectedLastCue.project.sequence.length, 1);
});

test("portable JSON keeps frame order and paths but excludes session blob URLs", () => {
  const project = makeProject();
  project.assets[0].src = "blob:temporary-preview";
  project.assets[0].sourcePath = "./assets/a-approved.webp";
  const json = Core.serializeProject(project);
  const exported = JSON.parse(json);

  assert.equal(exported.version, 1);
  assert.deepEqual(exported.canvas, { width: 720, height: 1060 });
  assert.equal(exported.loop, true);
  assert.equal(exported.assets[0].src, "./assets/a-approved.webp");
  assert.equal(json.includes("blob:"), false);
  assert.deepEqual(
    exported.sequence.map((cue) => cue.assetId),
    ["a", "b", "c"],
  );
  assert.deepEqual(
    exported.sequence.map((cue) => cue.durationMs),
    [100, 200, 50],
  );
});
