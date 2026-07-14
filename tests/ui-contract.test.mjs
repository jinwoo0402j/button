import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const sfxFiles = [
  "switch-press.wav",
  "switch-press-heavy.wav",
  "roulette-lock.wav",
  "result-latch.wav",
  "ui-advance.wav",
];

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
  assert.ok([...html.matchAll(/border-radius: 50%/g)].length >= 2);
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
  assert.match(script, /window\.addEventListener\("blur", onWindowBlur\)/);
  assert.match(script, /function announceGoal\(goal\)/);
  assert.match(
    html,
    /\.focus-stage\.is-celebrating \.money-display \{[\s\S]*?visibility: visible/,
  );
  assert.doesNotMatch(script, /if \(state\.lastVictim\)/);
});

test("the title precedes language, profile, and name setup without accounts", () => {
  const setupTag = html.match(/<section[^>]*id="setup-screen"[^>]*>/)?.[0];
  const openingTag = html.match(/<section[^>]*id="opening-screen"[^>]*>/)?.[0];
  assert.ok(setupTag);
  assert.ok(openingTag);
  assert.match(setupTag, /hidden/);
  assert.doesNotMatch(openingTag, /hidden/);
  assert.match(html, /id="opening-title"[^>]*>100만원 버튼<\/h1>/);
  assert.match(
    html,
    /id="opening-advance"[\s\S]*?aria-label="100만원 버튼을 누른다\."[\s\S]*?>\[ 누르기 \]<\/button>/,
  );
  assert.match(html, /id="setup-title"[^>]*>어떤 언어로 플레이하시겠습니까\?<\/h1>/);
  assert.match(html, /현재는 한국어만 지원합니다\./);
  assert.match(html, /id="language-korean"[^>]*>\[ 한국어 \]<\/button>/);
  assert.match(html, /id="profile-male"[\s\S]*?data-profile="male"[\s\S]*?남성 프로필 선택/);
  assert.match(html, /id="profile-female"[\s\S]*?data-profile="female"[\s\S]*?여성 프로필 선택/);
  assert.match(html, /background-image: url\("\.\/assets\/profile-options\.png"\)/);
  assert.ok(statSync(new URL("../assets/profile-options.png", import.meta.url)).size > 100_000);
  assert.match(html, /id="player-name"[\s\S]*?maxlength="12"[\s\S]*?autocomplete="off"/);
  assert.match(html, /id="setup-name-form"[^>]*hidden[^>]*novalidate/);
  assert.match(script, /PLAYER_SETUP_KEY = "jinwoo-button:player:v1"/);
  assert.match(script, /window\.sessionStorage\.getItem\(PLAYER_SETUP_KEY\)/);
  assert.match(script, /window\.sessionStorage\.setItem\(PLAYER_SETUP_KEY, JSON\.stringify\(value\)\)/);
  assert.match(script, /function showSetupStep\(step\)/);
  assert.match(script, /function onSetupActionKeyDown\(event\)/);
  assert.match(script, /event\.currentTarget\.click\(\)/);
  assert.match(script, /function onSetupNameSubmit\(event\)/);
  assert.match(script, /function onPlayerNameKeyDown\(event\)/);
  assert.match(script, /elements\.setupNameForm\.requestSubmit\(\)/);
  assert.match(script, /elements\.setupScreen\.contains\(event\.target\)/);
  assert.match(script, /function showOpeningTitle\(\)/);
  assert.match(script, /function beginOpeningStory\(\)[\s\S]*?openingBeatIndex = 1/);
  assert.match(
    script,
    /if \(openingBeatIndex === 0\) \{[\s\S]*?if \(playerSetup\)[\s\S]*?beginOpeningStory\(\)[\s\S]*?showSetupStep\("language"\)/,
  );
  assert.match(
    script,
    /const restoredTargetIndex = loadTargetSelection\(\)[\s\S]*?revealGame\(\{ focusButton: false \}\)[\s\S]*?const restoredPlayerSetup = loadPlayerSetup\(\)[\s\S]*?showOpeningTitle\(\)/,
  );
  assert.doesNotMatch(script, /localStorage\.setItem\(PLAYER_SETUP_KEY/);
});

test("only semantic onboarding boundaries use the input-safe dissolve controller", () => {
  assert.match(script, /SCENE_DISSOLVE_PHASE_MS = 180/);
  assert.match(script, /SCENE_INPUT_GUARD_MS = 360/);
  assert.match(script, /function isSceneTransitioning\(\)/);
  assert.match(
    script,
    /function transitionScene\(commit\)[\s\S]*?cancelOpeningTyping\(\)[\s\S]*?reducedMotion\.matches[\s\S]*?is-scene-transitioning[\s\S]*?is-scene-exiting/,
  );
  assert.match(
    script,
    /function finishSceneTransition\(\)[\s\S]*?window\.clearTimeout\(sceneTransitionTimer\)[\s\S]*?commit\(\)[\s\S]*?clearSceneTransitionState\(\)/,
  );
  assert.match(script, /elements\.focusStage\.setAttribute\("aria-busy", "true"\)/);
  assert.match(script, /elements\.focusStage\.removeAttribute\("aria-busy"\)/);
  assert.match(
    script,
    /function onReducedMotionChange\(event\)[\s\S]*?completeOpeningTyping\(\)[\s\S]*?finishSceneTransition\(\)/,
  );
  assert.match(
    script,
    /if \(reducedMotion\.matches\) \{[\s\S]*?sceneTransition = \{ generation, phase: "in", commit: null \};[\s\S]*?commit\(\);[\s\S]*?SCENE_INPUT_GUARD_MS/,
  );

  function handlerSource(handler) {
    const start = script.indexOf(`function ${handler}`);
    assert.notEqual(start, -1, handler);
    const end = script.indexOf("\n  function ", start + 1);
    return script.slice(start, end === -1 ? undefined : end);
  }

  const chooseLanguage = handlerSource("chooseLanguage");
  const chooseProfile = handlerSource("chooseProfile");
  const submitName = handlerSource("onSetupNameSubmit");
  const advanceOpening = handlerSource("advanceOpening");
  const acceptEthics = handlerSource("acceptEthicsQuestion");
  const rejectEthics = handlerSource("rejectEthicsQuestion");

  assert.match(chooseLanguage, /showSetupStep\("profile"\)/);
  assert.doesNotMatch(chooseLanguage, /transitionScene\(/);
  assert.match(chooseProfile, /showSetupStep\("name"\)/);
  assert.doesNotMatch(chooseProfile, /transitionScene\(/);
  assert.match(submitName, /transitionScene\(\(\) => beginOpeningStory\(\)\)/);
  assert.match(acceptEthics, /transitionScene\(\(\) => revealGame\(\)\)/);
  assert.equal([...advanceOpening.matchAll(/transitionScene\(/g)].length, 2);
  assert.match(
    advanceOpening,
    /openingBeatIndex \+= 1;[\s\S]*?renderOpeningBeat\(\);[\s\S]*?return;/,
  );
  const intermediateBeatBranch = advanceOpening.match(
    /if \(openingBeatIndex < OPENING_BEATS\.length - 1\) \{([\s\S]*?)\n    \}/,
  )?.[1];
  assert.ok(intermediateBeatBranch);
  assert.doesNotMatch(intermediateBeatBranch, /transitionScene\(/);
  assert.equal([...rejectEthics.matchAll(/transitionScene\(/g)].length, 1);
  assert.match(
    rejectEthics,
    /lastEthicsRejectAt < SCENE_INPUT_GUARD_MS[\s\S]*?questionIndex \+= 1;[\s\S]*?renderEthicsQuestion\(\);/,
  );

  for (const source of [
    chooseLanguage,
    chooseProfile,
    submitName,
    advanceOpening,
    acceptEthics,
    rejectEthics,
  ]) {
    assert.match(source, /isSceneTransitioning\(\)/);
  }

  assert.match(
    script,
    /savePlayerSetup\(completedSetup\);[\s\S]{0,100}?transitionScene\(\(\) => beginOpeningStory\(\)\)/,
  );
  assert.match(
    script,
    /saveTargetSelection\(questionIndex\);[\s\S]{0,100}?transitionScene\(\(\) => revealGame\(\)\)/,
  );
  assert.match(
    script,
    /function onSetupActionKeyDown\(event\)[\s\S]*?event\.repeat \|\| isSceneTransitioning\(\)/,
  );
  assert.match(
    script,
    /function onEthicsDecisionKeyDown\(event\)[\s\S]*?event\.repeat \|\| isSceneTransitioning\(\)/,
  );
  assert.match(
    script,
    /function onSpaceKeyDown\(event\)[\s\S]*?if \(isSceneTransitioning\(\)\)[\s\S]*?event\.preventDefault\(\)/,
  );
  assert.match(
    script,
    /function onButtonKeyDown\(event\)[\s\S]*?event\.key === "Enter" && event\.repeat[\s\S]*?event\.preventDefault\(\)/,
  );
  assert.match(script, /elements\.button\.addEventListener\("keydown", onButtonKeyDown\)/);
  assert.match(
    script,
    /const restoredTargetIndex = loadTargetSelection\(\)[\s\S]*?revealGame\(\{ focusButton: false \}\)/,
  );

  assert.match(html, /body\.is-scene-transitioning \.game__content \{[\s\S]*?pointer-events: none/);
  assert.match(html, /scene-dissolve-out 180ms steps\(4, end\) both/);
  assert.match(html, /scene-dissolve-in 180ms steps\(4, end\) both/);
  assert.match(html, /@keyframes scene-dissolve-out/);
  assert.match(html, /@keyframes scene-dissolve-in/);
  assert.match(html, /body\.is-scene-exiting \.game__content/);
  assert.match(html, /body\.is-scene-entering \.game__content/);
  assert.doesNotMatch(html, /body\.is-scene-(?:exiting|entering) \.focus-stage/);
  assert.doesNotMatch(html, /body\.is-scene-entering \.button-wave/);
  assert.match(
    html,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?body\.is-scene-exiting \.game__content[\s\S]*?animation: none !important/,
  );
  assert.doesNotMatch(html, /opening-enter/);
  assert.match(html, /game\.js\?v=20260714-opening19-visual2-scene3-line2-copy2-titlelight2-identity1-dialoguekey1-voice2-sfx6-bgm3/);
});

test("the title separates a centered physical button into a flickering gray spotlight", () => {
  assert.match(html, /id="opening-screen"[\s\S]*?class="opening-screen is-title"/);
  assert.match(
    html,
    /\.opening-screen\.is-title \.opening-message \{[\s\S]*?inset: 20cqh 0 auto/,
  );
  assert.match(
    html,
    /\.opening-screen\.is-title \.opening-button \{[\s\S]*?top: 43\.055556cqh[\s\S]*?left: 40cqw[\s\S]*?width: 20cqw/,
  );
  assert.match(
    html,
    /\.opening-screen\.is-title \.opening-button::before \{[\s\S]*?rgba\(205, 211, 216, 0\.58\)[\s\S]*?title-spotlight-flicker 5\.4s steps\(1, end\) infinite/,
  );
  assert.match(
    html,
    /\.opening-screen\.is-title \.opening-button::after \{[\s\S]*?bottom: 4\.513889cqh[\s\S]*?width: 10cqw[\s\S]*?height: 6\.111111cqh[\s\S]*?radial-gradient[\s\S]*?#a94b52/,
  );
  assert.match(
    html,
    /\.opening-screen\.is-title \.opening-button:focus-visible \{[\s\S]*?outline: 0;[\s\S]*?\.opening-screen\.is-title \.opening-button:focus-visible::after \{[\s\S]*?0 0 0 2px rgba\(126, 255, 159, 0\.72\)/,
  );
  assert.match(html, /@keyframes title-spotlight-flicker/);
  assert.match(
    html,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.opening-screen\.is-title \.opening-button::before \{[\s\S]*?animation: none !important;[\s\S]*?opacity: 0\.68 !important;/,
  );
  assert.match(
    script,
    /elements\.openingScreen\.classList\.toggle\([\s\S]*?"is-title",[\s\S]*?beat\.kind === "title"/,
  );
});

test("opening screens share two fixed logical artboards without resize JavaScript", () => {
  const viewportMarkup = html.indexOf('<div class="viewport">');
  const stageMarkup = html.indexOf('<div class="stage">');
  const statusMarkup = html.indexOf('id="status-bar"');
  const gameMarkup = html.indexOf('<main class="game">');
  assert.ok(viewportMarkup < stageMarkup);
  assert.ok(stageMarkup < statusMarkup);
  assert.ok(statusMarkup < gameMarkup);

  assert.match(
    html,
    /\.stage \{[\s\S]*?--scene-circle-x: 25\.625cqw[\s\S]*?--scene-circle-y: 3\.333333cqh[\s\S]*?--scene-circle-width: 48\.75cqw[\s\S]*?--scene-circle-height: 86\.666667cqh/,
  );
  assert.match(
    html,
    /\.stage \{[\s\S]*?--scene-speaker-y: 72\.222222cqh[\s\S]*?--scene-copy-y: 78\.888889cqh[\s\S]*?--scene-copy-height: 7\.777778cqh[\s\S]*?--scene-button-x: 37\.5cqw[\s\S]*?--scene-button-y: 90cqh[\s\S]*?--scene-button-width: 25cqw[\s\S]*?--scene-button-height: 7\.777778cqh/,
  );
  assert.match(
    html,
    /\.stage \{[\s\S]*?width: min\(100vw, 177\.777778svh\)[\s\S]*?height: min\(100svh, 56\.25vw\)[\s\S]*?container-type: size/,
  );
  assert.match(
    html,
    /@media \(orientation: portrait\)[\s\S]*?--scene-circle-x: 3\.333333cqw[\s\S]*?--scene-circle-y: 2\.5cqh[\s\S]*?--scene-circle-width: 93\.333333cqw[\s\S]*?--scene-circle-height: 52\.5cqh[\s\S]*?--scene-speaker-y: 55\.625cqh[\s\S]*?--scene-copy-y: 62\.5cqh[\s\S]*?--scene-button-y: 86\.25cqh/,
  );
  assert.match(
    html,
    /@media \(orientation: portrait\)[\s\S]*?width: min\(100vw, 56\.25svh\)[\s\S]*?height: min\(100svh, 177\.777778vw\)/,
  );
  assert.match(html, /\.setup-screen \{[\s\S]*?overflow-y: auto/);
  assert.match(html, /\.opening-visual \{[\s\S]*?scale: 1\.5/);
  assert.match(html, /\.opening-visual__room \{[\s\S]*?object-fit: cover/);
  const openingRoomRule = html.match(/\.opening-visual__room \{([\s\S]*?)\n      \}/)?.[1];
  assert.ok(openingRoomRule);
  assert.doesNotMatch(openingRoomRule, /\n        scale:/);
  assert.match(
    html,
    /\.opening-visual__demon \{[\s\S]*?scale: 0\.8[\s\S]*?transform-origin: center/,
  );
  assert.match(
    html,
    /\.opening-demon-frame \{[\s\S]*?object-fit: contain[\s\S]*?object-position: right top/,
  );
  assert.match(html, /\.button \{[\s\S]*?position: absolute[\s\S]*?6\.25cqh 50%/);
  assert.match(html, /\.audio-controls \{[\s\S]*?position: fixed/);
  assert.ok(html.indexOf('class="audio-controls"') < viewportMarkup);

  assert.doesNotMatch(html, /width: min\(150%/);
  assert.doesNotMatch(html, /46svh|13svh|12svh/);
  assert.doesNotMatch(html, /translateY\(clamp/);
  assert.doesNotMatch(script, /addEventListener\("resize"|ResizeObserver/);
});

test("mouse viewpoint gives the room and demon separate parallax depths", () => {
  assert.match(
    script,
    /OPENING_PARALLAX_PROFILE = Object\.freeze\(\{[\s\S]*?roomXInCqw: 0\.45[\s\S]*?roomYInCqh: 0\.3[\s\S]*?demonXInCqw: 0\.9[\s\S]*?demonYInCqh: 0\.6/,
  );
  assert.match(script, /stage: document\.querySelector\("\.stage"\)/);
  assert.match(
    html,
    /\.opening-screen \{[\s\S]*?--opening-room-shift-x: 0cqw[\s\S]*?--opening-demon-shift-x: 0cqw/,
  );
  assert.match(
    html,
    /\.opening-visual__room \{[\s\S]*?transform: scale\(1\.06\)[\s\S]*?translate: var\(--opening-room-shift-x\) var\(--opening-room-shift-y\)[\s\S]*?translate 160ms/,
  );
  assert.match(
    html,
    /\.opening-visual__demon \{[\s\S]*?scale: 0\.8[\s\S]*?translate: var\(--opening-demon-shift-x\) var\(--opening-demon-shift-y\)[\s\S]*?translate 120ms/,
  );
  assert.match(
    html,
    /\[data-opening-visual="room-reveal"\] \.opening-visual__room \{[\s\S]*?transform: scale\(1\.04\)/,
  );
  assert.match(
    script,
    /function onOpeningParallaxPointerMove\(event\) \{[\s\S]*?event\.pointerType !== "mouse"[\s\S]*?scheduleOpeningParallaxFrame\(\)/,
  );
  assert.match(
    script,
    /function renderOpeningParallaxFrame\(\) \{[\s\S]*?getBoundingClientRect\(\)[\s\S]*?clampOpeningParallaxAxis[\s\S]*?applyOpeningParallax\(x, y\)/,
  );
  assert.match(script, /window\.addEventListener\("pointermove", onOpeningParallaxPointerMove\)/);
  assert.match(script, /elements\.stage\.addEventListener\("pointerleave", onOpeningParallaxPointerLeave\)/);
  assert.match(
    script,
    /openingParallaxPointer\.x < bounds\.left[\s\S]*?openingParallaxPointer\.y > bounds\.bottom[\s\S]*?applyOpeningParallax\(\)/,
  );
  assert.match(
    html,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.opening-visual__room \{[\s\S]*?translate: 0 0 !important[\s\S]*?\.opening-visual__demon \{[\s\S]*?translate: 0 0 !important/,
  );
  assert.match(script, /function onReducedMotionChange\(event\) \{[\s\S]*?resetOpeningParallax\(\)/);
  assert.match(html, /game\.js\?v=[^"\s]*parallax3/);
});

test("the demon uses five aligned raster frames for idle breathing and blinking", () => {
  const frameNames = [
    "opening-demon-idle-0.webp",
    "opening-demon-idle-1.webp",
    "opening-demon-idle-2.webp",
    "opening-demon-blink-half.webp",
    "opening-demon-blink-closed.webp",
  ];
  for (const frameName of frameNames) {
    assert.match(html, new RegExp(`src="\\./assets/${frameName}"`));
    assert.ok(statSync(new URL(`../assets/${frameName}`, import.meta.url)).size > 0);
  }
  assert.equal([...html.matchAll(/class="opening-demon-frame /g)].length, 5);
  assert.match(html, /@keyframes opening-demon-idle-frame-1/);
  assert.match(html, /@keyframes opening-demon-idle-frame-2/);
  assert.match(html, /@keyframes opening-demon-blink-half/);
  assert.match(html, /@keyframes opening-demon-blink-closed/);
  assert.match(
    html,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.opening-demon-frame \{[\s\S]*?animation: none !important;[\s\S]*?opacity: 0 !important;[\s\S]*?\.opening-demon-frame--idle-0 \{[\s\S]*?opacity: 1 !important;/,
  );
});

test("devil dialogue advances through pressed text without a separate button", () => {
  assert.match(
    html,
    /\.opening-screen\.is-dialogue \.opening-copy \{[\s\S]*?font-size: 1\.875cqw;[\s\S]*?line-height: 1\.1;/,
  );
  assert.match(
    html,
    /@media \(orientation: portrait\)[\s\S]*?\.opening-screen\.is-dialogue \.opening-copy \{[\s\S]*?font-size: 5\.833333cqw;[\s\S]*?line-height: 1\.2;/,
  );
  assert.match(
    html,
    /\.opening-screen\.is-dialogue \.opening-button \{[\s\S]*?display: none;/,
  );
  assert.match(
    html,
    /\.opening-screen\.is-dialogue \.opening-title,[\s\S]*?\.opening-screen\.is-dialogue \.opening-copy \{[\s\S]*?pointer-events: auto;[\s\S]*?touch-action: manipulation;/,
  );
  assert.match(
    html,
    /\.opening-message\.is-pressed \.opening-title,[\s\S]*?\.opening-message\.is-pressed \.opening-copy \{[\s\S]*?filter: brightness\(0\.72\);[\s\S]*?translate: 0 0\.35cqh;/,
  );
  assert.match(html, /game\.js\?v=[^"\s]*parallax3-textadvance1-copyfont1/);
  assert.match(script, /OPENING_TEXT_PRESS_MS = 90/);
  assert.match(script, /openingMessage: document\.querySelector\("#opening-message"\)/);
  assert.match(
    script,
    /function showOpeningTitle\(\)[\s\S]*?elements\.openingAdvance\.focus\(\{ preventScroll: true \}\)/,
  );
  assert.match(
    script,
    /function beginOpeningStory\(\)[\s\S]*?elements\.openingMessage\.focus\(\{ preventScroll: true \}\)/,
  );
  assert.match(
    script,
    /const isDialogue = beat\.kind === "dialogue";[\s\S]*?openingMessage\.tabIndex = isDialogue \? 0 : -1[\s\S]*?setAttribute\("role", "button"\)[\s\S]*?setAttribute\("aria-keyshortcuts", "Space Enter"\)[\s\S]*?openingAdvance\.hidden = isDialogue[\s\S]*?openingAdvance\.disabled = isDialogue/,
  );
  assert.match(
    script,
    /function triggerOpeningTextAdvance\(\) \{[\s\S]*?openingTextPressTimer !== null[\s\S]*?classList\.add\("is-pressed"\)[\s\S]*?setAttribute\("aria-pressed", "true"\)[\s\S]*?window\.setTimeout\(\(\) => \{[\s\S]*?classList\.remove\("is-pressed"\)[\s\S]*?advanceOpening\(\);[\s\S]*?reducedMotion\.matches \? 0 : OPENING_TEXT_PRESS_MS/,
  );
  assert.match(
    script,
    /function onSpaceKeyDown\(event\)[\s\S]*?if \(isOpeningDialogueActive\(\)\) \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?if \(!event\.repeat\) \{[\s\S]*?triggerOpeningTextAdvance\(\)/,
  );
  assert.match(script, /elements\.openingMessage\.addEventListener\("click", onOpeningMessageClick\)/);
  assert.match(script, /elements\.openingMessage\.addEventListener\("keydown", onOpeningMessageKeyDown\)/);
});

test("nineteen typed devil beats establish identity inside one demon-room scene", () => {
  assert.match(html, /id="status-bar"[^>]*hidden/);
  assert.ok(html.indexOf('id="opening-screen"') < html.indexOf('id="ethics-prompt"'));
  assert.match(html, /<title>100만원 버튼<\/title>/);
  assert.match(html, /id="opening-screen"[\s\S]*?data-opening-visual="none"/);
  assert.match(html, /id="player-identity"[^>]*hidden/);
  assert.ok(html.indexOf('class="opening-visual"') < html.indexOf('id="opening-message"'));
  assert.match(html, /<div class="opening-visual" aria-hidden="true">/);
  assert.match(
    html,
    /class="opening-visual__room"[\s\S]*?src="\.\/assets\/opening-room\.webp"[\s\S]*?width="1600"[\s\S]*?height="900"[\s\S]*?alt=""/,
  );
  assert.match(
    html,
    /class="opening-visual__demon"[\s\S]*?class="opening-demon-frame opening-demon-frame--idle-0"[\s\S]*?src="\.\/assets\/opening-demon-idle-0\.webp"[\s\S]*?width="720"[\s\S]*?height="1060"[\s\S]*?alt=""/,
  );
  const openingVisualBytes = ["opening-room.webp", "opening-demon.webp"]
    .map((fileName) => statSync(new URL(`../assets/${fileName}`, import.meta.url)).size);
  assert.ok(openingVisualBytes.every((bytes) => bytes > 0));
  assert.ok(openingVisualBytes.reduce((total, bytes) => total + bytes, 0) < 700_000);
  assert.match(html, /\.opening-visual \{[\s\S]*?display: none[\s\S]*?overflow: hidden/);
  assert.match(html, /\.opening-visual__demon \{[\s\S]*?filter: grayscale\(1\)/);
  assert.match(html, /\[data-opening-visual="demon"\] \.opening-visual__room \{[\s\S]*?opacity: 0\.16/);
  assert.match(html, /\[data-opening-visual="room-hint"\] \.opening-visual__room \{[\s\S]*?opacity: 0\.28/);
  assert.match(html, /\[data-opening-visual="room-reveal"\] \.opening-visual__room \{[\s\S]*?opacity: 1/);
  assert.match(
    html,
    /@media \(orientation: portrait\)[\s\S]*?--scene-circle-width: 93\.333333cqw[\s\S]*?--scene-circle-height: 52\.5cqh/,
  );
  assert.match(
    html,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.opening-visual__room \{[\s\S]*?transform: none !important;[\s\S]*?transition: none !important;[\s\S]*?\.opening-visual__demon \{[\s\S]*?transition: none !important;/,
  );
  assert.match(html, /id="opening-copy"[^>]*hidden><\/p>/);
  const openingMessageTag = html.match(/<div id="opening-message"[^>]*>/)?.[0];
  assert.ok(openingMessageTag);
  assert.doesNotMatch(openingMessageTag, /aria-live|aria-atomic/);
  assert.match(
    html,
    /id="opening-announcement"[\s\S]*?class="sr-only"[\s\S]*?aria-live="polite"[\s\S]*?aria-atomic="true"/,
  );
  assert.match(html, /\.opening-screen\.is-dialogue \.opening-title/);
  assert.match(html, /\.opening-screen\.is-dialogue \.opening-copy[\s\S]*?white-space: pre-line;/);
  assert.match(html, /id="ethics-prompt"[\s\S]*?hidden/);
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
  assert.match(script, /function initializeOpeningFlow\(\)/);
  assert.match(script, /OPENING_BEATS = Object\.freeze/);
  assert.match(script, /title: "우아한 여성 악마"/);
  assert.match(script, /밤 11시 30분에야 퇴근했지요\./);
  assert.match(script, /월세 55만 원짜리 방/);
  assert.match(script, /5,000만 원이나 남아 있었지요\./);
  assert.match(script, /결국 과로로 쓰러졌어요\./);
  assert.match(script, /버튼을 한 번 누를 때마다\\n누군가 한 명이 죽어요\./);
  assert.doesNotMatch(script, /길 한가운데|바닥에 떨어진 버튼|손이 닿는 순간/);
  assert.match(script, /function renderOpeningBeat\(\)/);
  assert.match(script, /elements\.openingScreen\.dataset\.openingVisual = beat\.visualState/);
  assert.match(script, /\.split\("\{name\}"\)\.join\(playerName\)/);
  assert.match(script, /function advanceOpening\(\)/);
  assert.match(script, /OPENING_ADVANCE_GUARD_MS = 350/);
  assert.match(script, /OPENING_TYPE_DELAY_MS = 30/);
  assert.match(script, /OPENING_SHORT_PAUSE_MS = 90/);
  assert.match(script, /OPENING_SENTENCE_PAUSE_MS = 160/);
  assert.match(script, /function openingCharacterDelay\(character\)/);
  assert.match(script, /const characters = Array\.from\(copy\)/);
  assert.match(
    script,
    /window\.setTimeout\([\s\S]*?typeNextCharacter,[\s\S]*?openingCharacterDelay\(character\)/,
  );
  assert.match(
    script,
    /function cancelOpeningTyping\(\)[\s\S]*?window\.clearTimeout\(openingTypingTimer\)/,
  );
  assert.match(script, /function completeOpeningTyping\(\)/);
  assert.match(
    script,
    /if \(now - lastOpeningAdvanceAt < OPENING_ADVANCE_GUARD_MS\)[\s\S]*?lastOpeningAdvanceAt = now[\s\S]*?playUiAdvance\(\)[\s\S]*?if \(!openingTypingComplete\) \{[\s\S]*?completeOpeningTyping\(\)[\s\S]*?return/,
  );
  assert.match(script, /if \(!copy \|\| beat\.kind === "title" \|\| reducedMotion\.matches\)/);
  assert.match(script, /reducedMotion\.addEventListener\("change", onReducedMotionChange\)/);
  assert.match(script, /elements\.openingAnnouncement\.textContent/);
  assert.match(
    script,
    /elements\.openingAnnouncement\.textContent = beat\.kind === "title"[\s\S]*?\? ""/,
  );
  assert.match(script, /"현재 대사를 끝까지 표시한다\."/);
  assert.match(script, /function onOpeningActionKeyDown\(event\)[\s\S]*?if \(event\.repeat\) \{[\s\S]*?return/);
  assert.match(script, /initializeOpeningFlow\(\);/);
  assert.match(script, /function renderEthicsQuestion\(\)/);
  assert.match(script, /function acceptEthicsQuestion\(\)/);
  assert.match(script, /function rejectEthicsQuestion\(\)/);
  assert.match(script, /lastEthicsRejectAt = Number\.NEGATIVE_INFINITY/);
  assert.match(script, /elements\.ethicsQuestion\.textContent = "너는 누르지 않았다\."/);
  assert.match(
    script,
    /function onPress\(\) \{[\s\S]*?if \(isSceneTransitioning\(\) \|\| !gameStarted\) \{[\s\S]*?return;/,
  );
  assert.match(script, /if \(!gameStarted\) \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?return;/);
  assert.match(script, /event\.target === elements\.openingAdvance/);
  assert.doesNotMatch(html, /<dialog|modal/i);
  assert.match(
    readme,
    /대상군도 실제 범죄·수형자 데이터와 무관한 가상 조건/,
  );
});

test("typed demon dialogue uses a restrained synthesized character voice", () => {
  assert.match(script, /DIALOGUE_BLIP_INTERVAL_MS = 60/);
  assert.match(script, /DIALOGUE_BLIP_VOICE_LIMIT = 2/);
  assert.match(script, /oscillatorType: "triangle"/);
  assert.match(script, /startFrequencyHz: 220/);
  assert.match(script, /endFrequencyHz: 196/);
  assert.match(script, /lowpassFrequencyHz: 1_400/);
  assert.match(script, /lowpassQ: 0\.7/);
  assert.match(script, /peakGain: 0\.07/);
  assert.match(script, /sustainGain: 0\.028/);
  assert.match(
    script,
    /function typeNextCharacter\(\)[\s\S]*?elements\.openingCopy\.textContent = visibleCopy;[\s\S]*?playDialogueBlip\(beat\.voice, character\)/,
  );
  assert.match(script, /voice: null/);
  assert.equal([...script.matchAll(/voice: "elegant-demon"/g)].length, 19);
  assert.match(script, /context\.createOscillator\(\)/);
  assert.match(script, /context\.createBiquadFilter\(\)/);
  assert.match(script, /filterNode\.type = "lowpass"/);
  assert.match(script, /activeDialogueSources\.length >= DIALOGUE_BLIP_VOICE_LIMIT/);
  assert.match(script, /function cancelOpeningTyping\(\)[\s\S]*?stopDialogueBlips\(\)/);
  assert.match(
    script,
    /function onWindowBlur\(\)[\s\S]*?completeOpeningTyping\(\)[\s\S]*?stopDialogueBlips\(\)/,
  );

  const playDialogueBlip = script.match(
    /function playDialogueBlip\(voice, character\) \{[\s\S]*?\n  \}\n\n  function playSoundEffect/,
  )?.[0];
  assert.ok(playDialogueBlip, "dialogue blip player must stay locally inspectable");
  assert.doesNotMatch(playDialogueBlip, /getAudioContext|\.resume\(/);
});

test("button feedback stays decorative, accessible, and reduced-motion safe", () => {
  assert.match(html, /id="button-wave"[^>]*aria-hidden="true"/);
  assert.match(html, /id="trade-record"/);
  assert.match(
    html,
    /id="sound-toggle"[\s\S]*?type="button"[\s\S]*?aria-pressed="true"[\s\S]*?>\[ 효과음: 켬 \]<\/button>/,
  );
  assert.match(html, /\.audio-controls \{[\s\S]*?position: fixed/);
  assert.match(html, /\.button\.is-pressed[\s\S]*button-press 80ms/);
  assert.match(html, /\.button-wave\.is-active[\s\S]*button-wave 260ms/);
  assert.match(html, /\.money-display\.is-rolling[\s\S]*money-roll 190ms/);
  assert.match(html, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(script, /window\.AudioContext \|\| window\.webkitAudioContext/);
  assert.match(script, /SFX_PREFERENCE_KEY = "jinwoo-button:sfx:v1"/);
  assert.match(script, /SFX_MASTER_GAIN = 0\.65/);
  assert.match(script, /SFX_ROULETTE_INTERVAL_MS = 60/);
  assert.match(script, /SFX_PRESS_VOICE_LIMIT = 3/);
  assert.match(script, /path: "\.\/assets\/audio\/switch-press\.wav"[\s\S]*?gain: 0\.55/);
  assert.match(script, /path: "\.\/assets\/audio\/switch-press-heavy\.wav"[\s\S]*?gain: 0\.48/);
  assert.match(script, /path: "\.\/assets\/audio\/roulette-lock\.wav"[\s\S]*?gain: 0\.18/);
  assert.match(script, /path: "\.\/assets\/audio\/result-latch\.wav"[\s\S]*?gain: 0\.42/);
  assert.match(script, /path: "\.\/assets\/audio\/ui-advance\.wav"[\s\S]*?gain: 0\.35/);
  assert.match(
    script,
    /window\.fetch\([\s\S]*?response\.arrayBuffer\(\)[\s\S]*?sfxEncodedData\.set\(name, bytes\)/,
  );
  assert.match(script, /decodeAudioData\(bytes\.slice\(0\)\)/);
  assert.match(
    script,
    /function primeSoundEffects\(\)[\s\S]*?getAudioContext\(\{ resume: true \}\)/,
  );
  assert.match(
    script,
    /document\.addEventListener\("pointerdown", primeAudio, \{ capture: true \}\)/,
  );
  assert.match(
    script,
    /context\.state !== "running"[\s\S]*?context\.resume\(\)[\s\S]*?startSoundEffect/,
  );
  assert.match(script, /function stopAllSoundEffects\(\)/);
  assert.match(script, /window\.localStorage\.getItem\(SFX_PREFERENCE_KEY\) !== "0"/);
  assert.match(script, /window\.localStorage\.setItem\(SFX_PREFERENCE_KEY, soundEnabled \? "1" : "0"\)/);
  assert.match(script, /function renderSoundToggle\(\)[\s\S]*?aria-pressed/);
  assert.match(script, /function playRouletteLock\(now\)[\s\S]*?reducedMotion\.matches/);
  assert.match(script, /function completeRollBatch\(batch\)[\s\S]*?playSoundEffect\("resultLatch"\)/);
  assert.match(
    script,
    /function playUiAdvance\(\) \{[\s\S]*?playSoundEffect\("uiAdvance"\)/,
  );
  assert.equal([...script.matchAll(/playUiAdvance\(\);/g)].length, 6);
  assert.match(
    script,
    /function advanceOpening\(\)[\s\S]*?OPENING_ADVANCE_GUARD_MS[\s\S]*?return;[\s\S]*?playUiAdvance\(\);[\s\S]*?if \(!openingTypingComplete\)/,
  );
  assert.match(
    script,
    /function onSetupNameSubmit\(event\)[\s\S]*?if \(!name \|\| !setupDraft\.language \|\| !setupDraft\.profile\)[\s\S]*?return;[\s\S]*?savePlayerSetup\(completedSetup\);[\s\S]*?playUiAdvance\(\);/,
  );
  assert.match(
    script,
    /function rejectEthicsQuestion\(\)[\s\S]*?SCENE_INPUT_GUARD_MS[\s\S]*?return;[\s\S]*?playUiAdvance\(\);/,
  );
  assert.ok(
    [...script.matchAll(/event\.target === elements\.soundToggle/g)].length >= 2,
  );
  assert.doesNotMatch(
    script,
    /getClickNoiseBuffer|clickNoiseBuffer|\.createBuffer\(/,
  );
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

  for (const fileName of sfxFiles) {
    const bytes = readFileSync(
      new URL(`../assets/audio/${fileName}`, import.meta.url),
    );
    assert.ok(bytes.length > 44, `${fileName} must contain WAV audio`);
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF");
    assert.equal(bytes.subarray(8, 12).toString("ascii"), "WAVE");
  }

  assert.match(readme, /87 Clickety Clips/);
  assert.match(readme, /click82\.wav/);
  assert.match(readme, /Mechanical Sounds/);
  assert.match(readme, /두 묶음은 모두 CC0/);
});

test("title music starts on the first gesture and switches when the demon appears", () => {
  assert.match(
    html,
    /id="music-toggle"[\s\S]*?type="button"[\s\S]*?aria-pressed="true"[\s\S]*?>\[ 음악: 켬 \]<\/button>/,
  );
  assert.match(html, /class="audio-controls"[\s\S]*?id="music-toggle"[\s\S]*?id="sound-toggle"/);
  assert.match(script, /BGM_PREFERENCE_KEY = "jinwoo-button:bgm:v1"/);
  assert.match(script, /BGM_MASTER_GAIN = 0\.18/);
  assert.match(script, /BGM_TITLE_GAIN = 0\.15/);
  assert.match(script, /BGM_DUCK_GAIN = 0\.08/);
  assert.match(script, /BGM_FADE_IN_MS = 1_500/);
  assert.match(script, /BGM_DUCK_ATTACK_MS = 80/);
  assert.match(script, /BGM_DUCK_HOLD_MS = 500/);
  assert.match(script, /BGM_DUCK_RELEASE_MS = 500/);
  assert.match(script, /title: Object\.freeze\(\{[\s\S]*?path: "\.\/assets\/audio\/bgm-title-neon-static\.mp3"[\s\S]*?gain: BGM_TITLE_GAIN/);
  assert.match(script, /contract: Object\.freeze\(\{[\s\S]*?path: "\.\/assets\/audio\/bgm-contract-salon\.mp3"[\s\S]*?gain: BGM_MASTER_GAIN/);
  assert.match(script, /bgmMasterGain = audioContext\.createGain\(\)/);
  assert.match(script, /source\.loop = true/);
  assert.match(
    script,
    /function showOpeningTitle\(\)[\s\S]*?activateBackgroundMusic\("title"\)[\s\S]*?openingBeatIndex = 0/,
  );
  assert.match(
    script,
    /function beginOpeningStory\(\)[\s\S]*?activateBackgroundMusic\("contract"\)[\s\S]*?openingBeatIndex = 1/,
  );
  assert.match(
    script,
    /function revealGame\([\s\S]*?activateBackgroundMusic\("contract"\)[\s\S]*?gameStarted = true/,
  );
  assert.match(
    script,
    /function completeRollBatch\(batch\)[\s\S]*?duckBackgroundMusic\(\)[\s\S]*?playSoundEffect\("resultLatch"\)/,
  );
  assert.match(
    script,
    /function onVisibility\(\)[\s\S]*?stopBackgroundMusic\(\{ preserveOffset: true \}\)[\s\S]*?primeAudio\(\)/,
  );
  assert.match(script, /window\.localStorage\.getItem\(BGM_PREFERENCE_KEY\) !== "0"/);
  assert.match(script, /window\.localStorage\.setItem\(BGM_PREFERENCE_KEY, musicEnabled \? "1" : "0"\)/);
  assert.match(script, /function onMusicToggle\(\)[\s\S]*?stopBackgroundMusic\(\{ preserveOffset: true \}\)/);
  assert.ok(
    [...script.matchAll(/event\.target === elements\.musicToggle/g)].length >= 2,
  );
  assert.match(
    script,
    /Missing or invalid music is silent and never blocks the game/,
  );
  assert.match(
    script,
    /Missing music is silent and never blocks the game/,
  );

  for (const musicFile of [
    "bgm-title-neon-static.mp3",
    "bgm-contract-salon.mp3",
  ]) {
    const musicBytes = readFileSync(
      new URL(`../assets/audio/${musicFile}`, import.meta.url),
    );
    assert.ok(musicBytes.length > 1_024, `${musicFile} must contain MP3 audio`);
    const hasId3Header = musicBytes.subarray(0, 3).toString("ascii") === "ID3";
    const hasMpegFrame = musicBytes[0] === 0xff && (musicBytes[1] & 0xe0) === 0xe0;
    assert.ok(hasId3Header || hasMpegFrame, `${musicFile} must have an MP3 header`);
  }

  assert.match(readme, /Neon Static/);
  assert.match(readme, /The Contract Salon/);
  assert.match(readme, /jinwoo-button:bgm:v1/);
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
  const purchaseHandler = script.match(
    /function onPurchaseProcessingOptimization\(\) \{[\s\S]*?\n  \}\n\n  function onProcessingUpgradeKeyDown/,
  )?.[0];
  assert.ok(purchaseHandler);
  assert.doesNotMatch(purchaseHandler, /playUiAdvance/);
  assert.match(script, /processingOptimized: true/);
  assert.match(script, /const optimized = state\.processingOptimized/);
  assert.match(script, /const victimCount = optimized \? OPTIMIZED_PROCESSING_COUNT : 1/);
  assert.match(script, /victims\.forEach\(\(victim, slot\) => \{/);
  assert.match(
    script,
    /startRoll\(\s*victim,\s*firstSequence \+ slot,\s*nextProgression,\s*slot,\s*rollBatch,\s*\)/,
  );
  assert.match(script, /const rollBatch = \{[\s\S]*?remaining: victims\.length[\s\S]*?latchPlayed: false/);
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
