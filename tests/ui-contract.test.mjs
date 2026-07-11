import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../game.js", import.meta.url), "utf8");

test("the immersive UI removes visible meta copy and keeps the button label fixed", () => {
  assert.match(
    html,
    /<button id="press-button" class="button" type="button">버튼<\/button>/,
  );

  for (const removedText of [
    "매초 +2 · 버튼 -1",
    "이 브라우저",
    "가상 추첨. 실제 사람 아님. 인구·확률은 추정.",
    "지난 기록.",
    "또 누른다",
  ]) {
    assert.equal(html.includes(removedText), false);
    assert.equal(script.includes(removedText), false);
  }

  assert.doesNotMatch(script, /elements\.button\.textContent\s*=/);
});

test("the UI uses a local pixel font and repeatable roulette log template", () => {
  assert.match(
    html,
    /url\("\.\/assets\/fonts\/Galmuri11-Bold\.woff2"\)/,
  );
  assert.match(html, /id="roulette-log"/);
  assert.match(html, /id="roulette-entry-template"/);
  assert.equal(
    statSync(new URL("../assets/fonts/Galmuri11-Bold.woff2", import.meta.url)).size,
    167_372,
  );
  assert.ok(
    statSync(new URL("../assets/fonts/Galmuri-OFL-1.1.md", import.meta.url)).size > 4_000,
  );
});
