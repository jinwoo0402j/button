import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");

test("the immersive UI removes visible meta copy and keeps the button label fixed", () => {
  assert.match(
    html,
    /<button\s+id="press-button"[\s\S]*?aria-keyshortcuts="Space"[\s\S]*?aria-label="버튼"[\s\S]*?type="button"[\s\S]*?hidden\s*>버튼<\/button>/,
  );

  for (const removedText of [
    "매초 +2 · 버튼 -1",
    "이 브라우저",
    "가상 추첨. 실제 사람 아님. 인구·확률은 추정.",
    "지난 기록.",
    "또 누른다",
    "버튼 누른다.",
    "너 빼고 한 명 죽는다.",
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

test("the approved CRT theme communicates state with text color instead of panels", () => {
  assert.match(html, /--background: #000000/);
  assert.match(html, /--foreground: #f2f5ef/);
  assert.match(html, /--muted: #777c76/);
  assert.match(html, /--amber: #e4aa3d/);
  assert.match(html, /--red: #ff4938/);
  assert.match(html, /body::before/);
  assert.match(html, /@media \(forced-colors: active\)/);
  assert.match(html, /\.button:not\(\[hidden\]\)::before[\s\S]*content: "\["/);
  assert.match(html, /\.button:not\(\[hidden\]\)::after[\s\S]*content: "\]"/);
  assert.match(
    html,
    /\.log-entry:not\(\.is-complete\) \.log-field__value[\s\S]*color: var\(--amber\)/,
  );
  assert.match(html, /\.button \{[\s\S]*?color: var\(--green\)/);
  assert.doesNotMatch(html, /border-radius: 50%/);
  assert.doesNotMatch(html, /background: var\(--red\)/);
});

test("the ethical prompt yields to money and roulette entries leave no visual log", () => {
  assert.match(html, /id="ethics-prompt"/);
  assert.match(html, /id="money-display"[\s\S]*?hidden/);
  assert.match(html, /id="goal-value"[^>]*>100만원<\/strong>/);
  assert.match(html, /id="celebration"[\s\S]*?aria-hidden="true"/);
  assert.equal(html.includes("data-log-sequence"), false);
  assert.equal(html.includes("data-log-state"), false);
  assert.ok(html.indexOf('id="roulette-log"') < html.indexOf('id="press-button"'));
  assert.match(script, /classList\.add\("is-dissolving"\)/);
  assert.match(script, /document\.addEventListener\("keydown", onSpaceKeyDown\)/);
  assert.match(script, /window\.addEventListener\("blur", releaseSpaceKey\)/);
  assert.match(script, /function announceGoal\(goal\)/);
  assert.match(
    html,
    /\.focus-stage\.is-celebrating \.money-display \{[\s\S]*?visibility: visible/,
  );
  assert.doesNotMatch(script, /if \(state\.lastVictim\)/);
});

test("ethical choices replace the title and gate every game input", () => {
  assert.match(html, /id="status-bar"[^>]*hidden/);
  assert.match(html, /id="ethics-question"[\s\S]*?>대상: 전 세계 사람 중 무작위 1명\. 한 명 죽는다\.<\/h1>/);
  assert.match(script, /`대상: \$\{target\}\. 한 명 죽는다\.`/);
  assert.match(html, /id="ethics-reward"[^>]*>너는 100만원 받는다\.<\/p>/);
  assert.match(html, /id="ethics-accept"[^>]*>\[ 받아들인다 \]<\/button>/);
  assert.match(html, /id="ethics-reject"[^>]*>\[ 거부한다 \]<\/button>/);
  assert.match(html, /id="target-label"[^>]*hidden/);
  assert.match(html, /\.ethics-actions \{[\s\S]*?flex-wrap: wrap/);
  assert.match(script, /TARGET_SELECTION_KEY = "jinwoo-button:target:v1"/);
  assert.match(script, /window\.sessionStorage\.getItem\(TARGET_SELECTION_KEY\)/);
  assert.match(script, /window\.sessionStorage\.setItem\(TARGET_SELECTION_KEY, String\(index\)\)/);
  assert.match(script, /function renderEthicsQuestion\(\)/);
  assert.match(script, /function acceptEthicsQuestion\(\)/);
  assert.match(script, /function rejectEthicsQuestion\(\)/);
  assert.match(script, /elements\.ethicsQuestion\.textContent = "너는 누르지 않았다\."/);
  assert.match(script, /function onPress\(\) \{[\s\S]*?if \(!gameStarted\) \{[\s\S]*?return;/);
  assert.match(script, /if \(!gameStarted\) \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?return;/);
  assert.doesNotMatch(html, /<dialog|modal/i);
  assert.match(
    readme,
    /대상군도 실제 범죄·수형자 데이터와 무관한 가상 조건이다\./,
  );
});

test("button feedback stays decorative, accessible, and reduced-motion safe", () => {
  assert.match(html, /id="button-wave"[^>]*aria-hidden="true"/);
  assert.match(html, /id="trade-record"/);
  assert.match(html, /\.button\.is-pressed[\s\S]*button-press 80ms/);
  assert.match(html, /\.button-wave\.is-active[\s\S]*button-wave 260ms/);
  assert.match(html, /\.money-display\.is-rolling[\s\S]*money-roll 190ms/);
  assert.match(html, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(script, /window\.AudioContext \|\| window\.webkitAudioContext/);
  assert.match(script, /navigator\.vibrate\(8\)/);
  assert.match(
    script,
    /function rollMoneyDisplay\(\) \{[\s\S]*?if \(reducedMotion\.matches\) \{[\s\S]*?return;/,
  );
  assert.match(
    script,
    /function playButtonFeedback\(progression\) \{[\s\S]*?if \(reducedMotion\.matches\) \{[\s\S]*?return;/,
  );
  assert.match(
    script,
    /function vibrateButton\(\) \{[\s\S]*?reducedMotion\.matches[\s\S]*?navigator\.vibrate\(8\)/,
  );
  assert.match(script, /renderMoney\(state\.balance, \{ flash: true, roll: true \}\)/);
  assert.doesNotMatch(`${html}\n${script}`, /confetti|firework|폭죽/i);
});

test("processing optimization is a single purchase with two independent victims", () => {
  assert.match(
    html,
    /id="processing-upgrade"[\s\S]*?type="button"[\s\S]*?disabled[\s\S]*?>\[ 처리 최적화 · 500만원 \]<\/button>/,
  );
  assert.match(html, /id="processing-status"[\s\S]*?hidden[\s\S]*?>처리 효율 ×2<\/span>/);
  assert.match(html, /\.processing-upgrade \{[\s\S]*?color: var\(--green\)/);
  assert.match(html, /\.processing-upgrade:disabled \{[\s\S]*?color: var\(--muted\)/);
  assert.match(script, /PROCESSING_OPTIMIZATION_COST = 5_000_000/);
  assert.match(script, /function onPurchaseProcessingOptimization\(\)/);
  assert.match(script, /function onProcessingUpgradeKeyDown\(event\)/);
  assert.match(script, /event\.target === elements\.processingUpgrade/);
  assert.match(script, /"keydown",\s*onProcessingUpgradeKeyDown/);
  assert.match(script, /announceProcessingOptimization\(\)/);
  assert.match(script, /processingOptimized: true/);
  assert.match(script, /const optimized = state\.processingOptimized/);
  assert.match(script, /const victimCount = optimized \? OPTIMIZED_PROCESSING_COUNT : 1/);
  assert.match(script, /victims\.forEach\(\(victim, slot\) => \{/);
  assert.match(script, /startRoll\(victim, firstSequence \+ slot, nextProgression, slot\)/);
  assert.doesNotMatch(`${html}\n${script}`, /처리\s+2건|Aggregate|aggregate/);
  assert.doesNotMatch(`${html}\n${script}`, /상점|모달|오프라인 수익|자동 처리/);
});

test("victim rows show synthetic identity and text infographics in order", () => {
  const locationIndex = html.indexOf("data-log-location");
  const nameIndex = html.indexOf("data-log-name");
  const ageIndex = html.indexOf("data-log-age");
  const sexIndex = html.indexOf("data-log-sex");
  const causeIndex = html.indexOf("data-log-cause");
  assert.ok(locationIndex < nameIndex);
  assert.ok(nameIndex < ageIndex);
  assert.ok(ageIndex < sexIndex);
  assert.ok(sexIndex < causeIndex);
  assert.match(script, /SYNTHETIC_NAMES = Object\.freeze/);
  assert.match(script, /syntheticNameFor\(victim, sequence, slot\)/);
  assert.match(script, /`\$\{ageLabel\(age\)\}  \$\{ageBarFor\(age\)\}`/);
  assert.match(script, /SEX_EMOJIS = Object\.freeze/);
  assert.match(script, /CAUSE_EMOJIS = Object\.freeze/);
  assert.match(script, /element\.dataset\.emoji = emoji/);
  assert.match(script, /setSexDisplay\(entry\.sex, victim\.sex\)/);
  assert.match(script, /setCauseDisplay\(entry\.cause, victim\)/);
  assert.match(
    html,
    /\.log-field__value\[data-emoji\]::before[\s\S]*?content: "\[" attr\(data-emoji\) "\]"/,
  );
  assert.doesNotMatch(script, /\[남\] 남성|\[여\] 여성/);
  assert.match(script, /`가상 이름 \$\{name\}\.`,/);
  assert.match(script, /const RESULT_HOLD_MS = 750/);
  assert.match(
    readme,
    /이름은 실제 개인과 무관한 합성 가상 이름이다\./,
  );
});
