(function initializeFrameAnimationEditor() {
  "use strict";

  const Core = globalThis.FrameAnimationCore;
  if (!Core) {
    throw new Error("FrameAnimationCore failed to load");
  }

  const DEFAULT_PROJECT_DATA = {
    version: 1,
    name: "opening-demon",
    canvas: { width: 720, height: 1060 },
    loop: true,
    referenceAssetId: "idle-1",
    assets: [
      {
        id: "idle-0",
        label: "idle 0",
        src: "./assets/opening-demon-idle-0.webp",
        fileName: "opening-demon-idle-0.webp",
        width: 720,
        height: 1060,
        offsetX: 0,
        offsetY: 0,
      },
      {
        id: "idle-1",
        label: "idle 1 / blink base",
        src: "./assets/opening-demon-idle-1.webp",
        fileName: "opening-demon-idle-1.webp",
        width: 720,
        height: 1060,
        offsetX: 0,
        offsetY: 0,
      },
      {
        id: "idle-2",
        label: "idle 2",
        src: "./assets/opening-demon-idle-2.webp",
        fileName: "opening-demon-idle-2.webp",
        width: 720,
        height: 1060,
        offsetX: 0,
        offsetY: 0,
      },
      {
        id: "blink-half",
        label: "blink half",
        src: "./assets/opening-demon-blink-half.webp",
        fileName: "opening-demon-blink-half.webp",
        width: 720,
        height: 1060,
        offsetX: 0,
        offsetY: 0,
      },
      {
        id: "blink-closed",
        label: "blink closed",
        src: "./assets/opening-demon-blink-closed.webp",
        fileName: "opening-demon-blink-closed.webp",
        width: 720,
        height: 1060,
        offsetX: 0,
        offsetY: 0,
      },
    ],
    sequence: [
      { id: "cue-idle-0-a", assetId: "idle-0", durationMs: 900 },
      { id: "cue-idle-1-a", assetId: "idle-1", durationMs: 160 },
      { id: "cue-idle-2", assetId: "idle-2", durationMs: 160 },
      { id: "cue-idle-1-b", assetId: "idle-1", durationMs: 160 },
      { id: "cue-idle-0-b", assetId: "idle-0", durationMs: 1600 },
      { id: "cue-idle-1-c", assetId: "idle-1", durationMs: 120 },
      { id: "cue-blink-half-a", assetId: "blink-half", durationMs: 70 },
      { id: "cue-blink-closed", assetId: "blink-closed", durationMs: 90 },
      { id: "cue-blink-half-b", assetId: "blink-half", durationMs: 70 },
      { id: "cue-idle-1-d", assetId: "idle-1", durationMs: 120 },
      { id: "cue-idle-0-c", assetId: "idle-0", durationMs: 1700 },
    ],
  };

  const elements = {
    abToggle: document.querySelector("#ab-toggle"),
    addFrames: document.querySelector("#add-frames"),
    canvas: document.querySelector("#preview-canvas"),
    deleteFrame: document.querySelector("#delete-frame"),
    differenceToggle: document.querySelector("#difference-toggle"),
    duplicateFrame: document.querySelector("#duplicate-frame"),
    exportFrame: document.querySelector("#export-frame"),
    exportProject: document.querySelector("#export-project"),
    frameDuration: document.querySelector("#frame-duration"),
    frameInput: document.querySelector("#frame-input"),
    frameOffsetX: document.querySelector("#frame-offset-x"),
    frameOffsetY: document.querySelector("#frame-offset-y"),
    frameWarning: document.querySelector("#frame-warning"),
    guidesToggle: document.querySelector("#guides-toggle"),
    importProject: document.querySelector("#import-project"),
    loopToggle: document.querySelector("#loop-toggle"),
    moveFrameLeft: document.querySelector("#move-frame-left"),
    moveFrameRight: document.querySelector("#move-frame-right"),
    nextFrame: document.querySelector("#next-frame"),
    onionOpacity: document.querySelector("#onion-opacity"),
    onionToggle: document.querySelector("#onion-toggle"),
    playToggle: document.querySelector("#play-toggle"),
    previousFrame: document.querySelector("#previous-frame"),
    projectInput: document.querySelector("#project-input"),
    referenceFrameName: document.querySelector("#reference-frame-name"),
    replaceFrame: document.querySelector("#replace-frame"),
    replaceInput: document.querySelector("#replace-input"),
    resetOffset: document.querySelector("#reset-offset"),
    resetProject: document.querySelector("#reset-project"),
    scrubber: document.querySelector("#timeline-scrubber"),
    selectedFrameName: document.querySelector("#selected-frame-name"),
    setReference: document.querySelector("#set-reference"),
    stage: document.querySelector("#frame-stage"),
    stageBadge: document.querySelector("#stage-badge"),
    status: document.querySelector("#editor-status"),
    timeReadout: document.querySelector("#time-readout"),
    timeline: document.querySelector("#timeline"),
    timelineSummary: document.querySelector("#timeline-summary"),
  };

  const context = elements.canvas.getContext("2d", { alpha: true });
  const imageCache = new Map();
  const ownedObjectUrls = new Set();
  let drawToken = 0;
  let statusTimer = 0;
  let draggedCueId = null;

  const state = {
    project: makeDefaultProject(),
    selectedCueId: null,
    playheadMs: 0,
    playing: false,
    animationFrameId: 0,
    playStartedAt: 0,
    playStartedFrom: 0,
    viewMode: "normal",
    guides: true,
    onionOpacity: 0.35,
    abFlashing: false,
    abShowingReference: false,
    abTimer: 0,
  };

  state.selectedCueId = state.project.sequence[0].id;

  function makeDefaultProject() {
    return Core.normalizeProject(JSON.parse(JSON.stringify(DEFAULT_PROJECT_DATA)));
  }

  function selectedCue() {
    return state.project.sequence.find((cue) => cue.id === state.selectedCueId)
      || state.project.sequence[0]
      || null;
  }

  function selectedAsset() {
    return Core.assetForCue(state.project, selectedCue());
  }

  function referenceAsset() {
    return state.project.assets.find(
      (asset) => asset.id === state.project.referenceAssetId,
    ) || state.project.assets[0] || null;
  }

  function selectedIndex() {
    return state.project.sequence.findIndex((cue) => cue.id === state.selectedCueId);
  }

  function formatMilliseconds(value) {
    return `${Math.max(0, Math.round(value)).toLocaleString("ko-KR")} ms`;
  }

  function showStatus(message, tone = "info", timeoutMs = 3400) {
    window.clearTimeout(statusTimer);
    elements.status.textContent = message;
    elements.status.dataset.tone = tone;
    elements.status.hidden = false;
    if (timeoutMs > 0) {
      statusTimer = window.setTimeout(() => {
        elements.status.hidden = true;
      }, timeoutMs);
    }
  }

  function updatePlayheadReadout() {
    const total = Core.totalDuration(state.project);
    elements.scrubber.max = String(Math.max(1, total));
    elements.scrubber.value = String(Math.min(total, Math.max(0, Math.round(state.playheadMs))));
    elements.timeReadout.value = `${formatMilliseconds(state.playheadMs)} / ${formatMilliseconds(total)}`;
    elements.timeReadout.textContent = elements.timeReadout.value;
  }

  function updateTimelineSelection() {
    const buttons = elements.timeline.querySelectorAll(".editor-cue");
    for (const button of buttons) {
      const selected = button.dataset.cueId === state.selectedCueId;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
  }

  function frameWarning(asset) {
    if (!asset) {
      return "프레임을 불러올 수 없습니다.";
    }
    const warnings = [];
    const { width, height } = state.project.canvas;
    if (asset.width !== width || asset.height !== height) {
      warnings.push(`크기 불일치: ${asset.width}×${asset.height} (기준 ${width}×${height})`);
    }
    if (asset.offsetX !== 0 || asset.offsetY !== 0) {
      warnings.push(`미리보기 이동: X ${asset.offsetX}, Y ${asset.offsetY}`);
    }
    if (asset.id === state.project.referenceAssetId) {
      warnings.push("현재 이미지가 정렬 기준입니다.");
    }
    return warnings.join(" · ");
  }

  function renderTimeline() {
    elements.timeline.replaceChildren();
    const fragment = document.createDocumentFragment();
    state.project.sequence.forEach((cue, index) => {
      const asset = Core.assetForCue(state.project, cue);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "editor-cue";
      button.dataset.cueId = cue.id;
      button.dataset.cueIndex = String(index);
      button.draggable = true;
      button.setAttribute("role", "option");
      button.setAttribute("aria-label", `${index + 1}번 ${asset?.label || cue.assetId}, ${cue.durationMs}밀리초`);
      button.setAttribute("aria-selected", String(cue.id === state.selectedCueId));
      button.tabIndex = cue.id === state.selectedCueId ? 0 : -1;
      button.classList.toggle("is-selected", cue.id === state.selectedCueId);
      button.classList.toggle("is-reference", cue.assetId === state.project.referenceAssetId);

      const image = document.createElement("img");
      image.src = asset?.src || "";
      image.alt = "";
      image.draggable = false;

      const label = document.createElement("span");
      label.className = "editor-cue__name";
      label.textContent = `${index + 1}. ${asset?.label || cue.assetId}`;

      const duration = document.createElement("span");
      duration.className = "editor-cue__duration";
      duration.textContent = `${cue.durationMs} ms`;

      button.append(image, label, duration);
      fragment.append(button);
    });
    elements.timeline.append(fragment);
    const total = Core.totalDuration(state.project);
    elements.timelineSummary.textContent = `${state.project.sequence.length} 구간 · ${formatMilliseconds(total)}`;
  }

  function renderSelection() {
    const cue = selectedCue();
    const asset = selectedAsset();
    const reference = referenceAsset();
    const index = selectedIndex();
    const hasSelection = Boolean(cue && asset);

    elements.selectedFrameName.textContent = hasSelection
      ? `${index + 1}. ${asset.label} · ${asset.fileName}`
      : "-";
    elements.referenceFrameName.textContent = reference
      ? `기준: ${reference.label} · ${reference.fileName}`
      : "기준: -";
    elements.frameWarning.textContent = frameWarning(asset);
    elements.frameDuration.value = cue ? String(cue.durationMs) : "120";
    elements.frameOffsetX.value = asset ? String(asset.offsetX) : "0";
    elements.frameOffsetY.value = asset ? String(asset.offsetY) : "0";
    elements.loopToggle.checked = state.project.loop;

    elements.deleteFrame.disabled = state.project.sequence.length <= 1;
    elements.moveFrameLeft.disabled = index <= 0;
    elements.moveFrameRight.disabled = index < 0 || index >= state.project.sequence.length - 1;
    elements.replaceFrame.disabled = !hasSelection;
    elements.duplicateFrame.disabled = !hasSelection;
    elements.setReference.disabled = !hasSelection;
    elements.exportFrame.disabled = !hasSelection;

    elements.playToggle.textContent = state.playing ? "정지" : "재생";
    elements.playToggle.setAttribute("aria-pressed", String(state.playing));
    elements.onionToggle.setAttribute("aria-pressed", String(state.viewMode === "onion"));
    elements.differenceToggle.setAttribute("aria-pressed", String(state.viewMode === "difference"));
    elements.guidesToggle.setAttribute("aria-pressed", String(state.guides));
    elements.abToggle.setAttribute("aria-pressed", String(state.abFlashing));
    elements.stageBadge.textContent = hasSelection
      ? `${index + 1}/${state.project.sequence.length} · ${asset.label}`
      : "프레임 없음";

    updateTimelineSelection();
    updatePlayheadReadout();
    drawPreview();
  }

  function renderProject() {
    const { width, height } = state.project.canvas;
    elements.canvas.width = width;
    elements.canvas.height = height;
    elements.stage.style.aspectRatio = `${width} / ${height}`;
    renderTimeline();
    renderSelection();
  }

  function loadImage(asset) {
    const cached = imageCache.get(asset.id);
    if (cached && cached.src === asset.src) {
      return cached.promise;
    }

    const image = new Image();
    image.decoding = "async";
    const promise = new Promise((resolve, reject) => {
      image.addEventListener("load", () => resolve(image), { once: true });
      image.addEventListener(
        "error",
        () => reject(new Error(`이미지를 읽을 수 없습니다: ${asset.src}`)),
        { once: true },
      );
    });
    image.src = asset.src;
    imageCache.set(asset.id, { src: asset.src, promise });
    promise.catch(() => {
      const current = imageCache.get(asset.id);
      if (current?.promise === promise) {
        imageCache.delete(asset.id);
      }
    });
    return promise;
  }

  function drawImageAtAssetOffset(targetContext, image, asset, alpha = 1, operation = "source-over") {
    targetContext.save();
    targetContext.globalAlpha = alpha;
    targetContext.globalCompositeOperation = operation;
    targetContext.drawImage(image, asset.offsetX, asset.offsetY);
    targetContext.restore();
  }

  function drawGuides() {
    if (!state.guides) {
      return;
    }
    const { width, height } = state.project.canvas;
    context.save();
    context.globalCompositeOperation = "source-over";
    context.lineWidth = Math.max(1, width / 720);
    context.setLineDash([8, 7]);
    context.strokeStyle = "rgba(95, 215, 232, 0.78)";
    context.beginPath();
    context.moveTo(width / 2 + 0.5, 0);
    context.lineTo(width / 2 + 0.5, height);
    context.moveTo(0, height * 0.24 + 0.5);
    context.lineTo(width, height * 0.24 + 0.5);
    context.stroke();
    context.setLineDash([3, 8]);
    context.strokeStyle = "rgba(228, 170, 61, 0.58)";
    context.beginPath();
    context.moveTo(0, height / 2 + 0.5);
    context.lineTo(width, height / 2 + 0.5);
    context.stroke();
    context.restore();
  }

  async function drawPreview() {
    const token = ++drawToken;
    const currentAsset = selectedAsset();
    const comparisonAsset = referenceAsset();
    context.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    if (!currentAsset) {
      return;
    }

    try {
      const needsReference = state.viewMode !== "normal" || state.abShowingReference;
      const [currentImage, comparisonImage] = await Promise.all([
        loadImage(currentAsset),
        needsReference && comparisonAsset ? loadImage(comparisonAsset) : Promise.resolve(null),
      ]);
      if (token !== drawToken) {
        return;
      }

      context.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
      if (state.abFlashing && state.abShowingReference && comparisonImage) {
        drawImageAtAssetOffset(context, comparisonImage, comparisonAsset);
      } else if (state.viewMode === "onion" && comparisonImage) {
        drawImageAtAssetOffset(
          context,
          comparisonImage,
          comparisonAsset,
          state.onionOpacity,
        );
        drawImageAtAssetOffset(context, currentImage, currentAsset, 0.82);
      } else if (state.viewMode === "difference" && comparisonImage) {
        context.save();
        context.fillStyle = "#000";
        context.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
        context.restore();
        drawImageAtAssetOffset(context, comparisonImage, comparisonAsset);
        drawImageAtAssetOffset(context, currentImage, currentAsset, 1, "difference");
      } else {
        drawImageAtAssetOffset(context, currentImage, currentAsset);
      }
      drawGuides();
    } catch (error) {
      if (token !== drawToken) {
        return;
      }
      elements.stageBadge.textContent = "이미지 로드 실패";
      showStatus(error.message, "error", 0);
    }
  }

  function selectCue(cueId, { seek = true, scroll = false } = {}) {
    const index = state.project.sequence.findIndex((cue) => cue.id === cueId);
    if (index < 0) {
      return;
    }
    state.selectedCueId = cueId;
    if (seek) {
      state.playheadMs = Core.cueStartTime(state.project, index);
    }
    renderSelection();
    if (scroll) {
      elements.timeline.querySelector(`[data-cue-id="${CSS.escape(cueId)}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }

  function pausePlayback({ render = true } = {}) {
    if (state.animationFrameId) {
      cancelAnimationFrame(state.animationFrameId);
      state.animationFrameId = 0;
    }
    state.playing = false;
    if (render) {
      renderSelection();
    }
  }

  function stopAbFlashing({ render = true } = {}) {
    if (state.abTimer) {
      window.clearInterval(state.abTimer);
      state.abTimer = 0;
    }
    state.abFlashing = false;
    state.abShowingReference = false;
    if (render) {
      renderSelection();
    }
  }

  function playPlayback() {
    const total = Core.totalDuration(state.project);
    if (state.playing || total <= 0) {
      return;
    }
    stopAbFlashing({ render: false });
    if (!state.project.loop && state.playheadMs >= total - 1) {
      state.playheadMs = 0;
    }
    state.playing = true;
    state.playStartedAt = performance.now();
    state.playStartedFrom = state.playheadMs;
    renderSelection();

    const tick = (now) => {
      if (!state.playing) {
        return;
      }
      const rawTime = state.playStartedFrom + (now - state.playStartedAt);
      if (!state.project.loop && rawTime >= total) {
        state.playheadMs = total - 1;
        const finalCue = state.project.sequence[state.project.sequence.length - 1];
        state.selectedCueId = finalCue.id;
        pausePlayback();
        return;
      }
      state.playheadMs = state.project.loop ? rawTime % total : rawTime;
      const index = Core.frameIndexAtTime(state.project, state.playheadMs);
      const cue = state.project.sequence[index];
      if (cue && cue.id !== state.selectedCueId) {
        state.selectedCueId = cue.id;
        renderSelection();
      } else {
        updatePlayheadReadout();
      }
      state.animationFrameId = requestAnimationFrame(tick);
    };
    state.animationFrameId = requestAnimationFrame(tick);
  }

  function togglePlayback() {
    if (state.playing) {
      pausePlayback();
    } else {
      playPlayback();
    }
  }

  function goToRelativeCue(delta) {
    pausePlayback({ render: false });
    const length = state.project.sequence.length;
    if (length === 0) {
      return;
    }
    const current = Math.max(0, selectedIndex());
    let next = current + delta;
    if (state.project.loop) {
      next = ((next % length) + length) % length;
    } else {
      next = Math.max(0, Math.min(length - 1, next));
    }
    selectCue(state.project.sequence[next].id, { seek: true, scroll: true });
  }

  function readImageFile(file) {
    const url = URL.createObjectURL(file);
    ownedObjectUrls.add(url);
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener(
        "load",
        () => resolve({
          src: url,
          sourcePath: `./assets/${file.name}`,
          fileName: file.name,
          label: file.name.replace(/\.[^.]+$/, ""),
          width: image.naturalWidth,
          height: image.naturalHeight,
        }),
        { once: true },
      );
      image.addEventListener(
        "error",
        () => {
          releaseObjectUrl(url);
          reject(new Error(`이미지를 읽을 수 없습니다: ${file.name}`));
        },
        { once: true },
      );
      image.src = url;
    });
  }

  function releaseObjectUrl(url) {
    if (ownedObjectUrls.has(url)) {
      URL.revokeObjectURL(url);
      ownedObjectUrls.delete(url);
    }
  }

  function releaseAllObjectUrls() {
    for (const url of ownedObjectUrls) {
      URL.revokeObjectURL(url);
    }
    ownedObjectUrls.clear();
    imageCache.clear();
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function addFiles(files) {
    if (files.length === 0) {
      return;
    }
    pausePlayback({ render: false });
    try {
      const descriptors = await Promise.all(Array.from(files, readImageFile));
      const result = Core.addAssetCues(state.project, descriptors, state.selectedCueId);
      state.project = result.project;
      state.selectedCueId = result.selectedCueId;
      state.playheadMs = Core.cueStartTime(state.project, selectedIndex());
      renderProject();
      showStatus(`${descriptors.length}개 프레임을 타임라인에 추가했습니다.`, "success");
    } catch (error) {
      showStatus(error.message, "error", 0);
    }
  }

  async function replaceSelectedFile(file) {
    const asset = selectedAsset();
    if (!asset || !file) {
      return;
    }
    pausePlayback({ render: false });
    try {
      const descriptor = await readImageFile(file);
      const previousSrc = asset.src;
      state.project = Core.replaceAsset(state.project, asset.id, descriptor);
      imageCache.delete(asset.id);
      releaseObjectUrl(previousSrc);
      renderProject();
      showStatus(
        `${asset.label} 이미지를 ${file.name}(으)로 교체했습니다. 같은 이미지를 쓰는 모든 구간에 반영됩니다.`,
        "success",
      );
    } catch (error) {
      showStatus(error.message, "error", 0);
    }
  }

  function changeCueDuration() {
    const cue = selectedCue();
    if (!cue) {
      return;
    }
    try {
      state.project = Core.updateCueDuration(
        state.project,
        cue.id,
        Number(elements.frameDuration.value),
      );
      elements.frameDuration.setCustomValidity("");
      state.playheadMs = Core.cueStartTime(state.project, selectedIndex());
      renderProject();
    } catch (error) {
      elements.frameDuration.setCustomValidity("16~10000 사이의 정수를 입력하세요.");
      elements.frameDuration.reportValidity();
      elements.frameDuration.value = String(cue.durationMs);
      showStatus(error.message, "error");
    }
  }

  function updateSelectedOffset(offsetX, offsetY) {
    const asset = selectedAsset();
    if (!asset) {
      return;
    }
    state.project = Core.updateAssetOffset(
      state.project,
      asset.id,
      offsetX,
      offsetY,
    );
    renderSelection();
  }

  function duplicateSelectedCue() {
    const result = Core.duplicateCue(state.project, state.selectedCueId);
    state.project = result.project;
    state.selectedCueId = result.selectedCueId;
    state.playheadMs = Core.cueStartTime(state.project, selectedIndex());
    renderProject();
  }

  function deleteSelectedCue() {
    const removedAsset = selectedAsset();
    const result = Core.deleteCue(state.project, state.selectedCueId);
    if (!result.deleted) {
      showStatus("타임라인에는 최소 한 구간이 필요합니다.", "error");
      return;
    }
    const assetStillExists = result.project.assets.some((asset) => asset.id === removedAsset?.id);
    if (!assetStillExists && removedAsset) {
      imageCache.delete(removedAsset.id);
      releaseObjectUrl(removedAsset.src);
    }
    state.project = result.project;
    state.selectedCueId = result.selectedCueId;
    state.playheadMs = Core.cueStartTime(state.project, selectedIndex());
    renderProject();
  }

  function moveSelectedCue(delta) {
    const index = selectedIndex();
    if (index < 0) {
      return;
    }
    state.project = Core.moveCue(state.project, state.selectedCueId, index + delta);
    state.playheadMs = Core.cueStartTime(state.project, selectedIndex());
    renderProject();
  }

  function toggleAbFlashing() {
    if (state.abFlashing) {
      stopAbFlashing();
      return;
    }
    pausePlayback({ render: false });
    state.abFlashing = true;
    state.abShowingReference = false;
    state.abTimer = window.setInterval(() => {
      state.abShowingReference = !state.abShowingReference;
      drawPreview();
    }, 240);
    renderSelection();
  }

  function resetProject() {
    pausePlayback({ render: false });
    stopAbFlashing({ render: false });
    releaseAllObjectUrls();
    state.project = makeDefaultProject();
    state.selectedCueId = state.project.sequence[0].id;
    state.playheadMs = 0;
    state.viewMode = "normal";
    renderProject();
    showStatus("현재 악마 프레임 5장과 권장 단일 타임라인을 다시 불러왔습니다.", "success");
  }

  function exportProject() {
    const json = Core.serializeProject(state.project);
    downloadBlob(
      new Blob([json], { type: "application/json" }),
      `${state.project.name}.animation.json`,
    );
    showStatus("프로젝트 JSON을 내보냈습니다.", "success");
  }

  async function exportCurrentFrame() {
    const asset = selectedAsset();
    if (!asset) {
      return;
    }
    try {
      const image = await loadImage(asset);
      const output = document.createElement("canvas");
      output.width = state.project.canvas.width;
      output.height = state.project.canvas.height;
      const outputContext = output.getContext("2d", { alpha: true });
      drawImageAtAssetOffset(outputContext, image, asset);
      const blob = await new Promise((resolve) => {
        output.toBlob(resolve, "image/webp", 0.96);
      });
      if (!blob) {
        throw new Error("이 브라우저에서 WebP를 만들 수 없습니다.");
      }
      const stem = asset.fileName.replace(/\.[^.]+$/, "");
      downloadBlob(blob, `${stem}-aligned.webp`);
      showStatus("현재 위치가 반영된 720×1060 WebP를 내보냈습니다.", "success");
    } catch (error) {
      showStatus(error.message, "error", 0);
    }
  }

  async function importProject(file) {
    if (!file) {
      return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      const project = Core.normalizeProject(parsed);
      pausePlayback({ render: false });
      stopAbFlashing({ render: false });
      releaseAllObjectUrls();
      state.project = project;
      state.selectedCueId = project.sequence[0].id;
      state.playheadMs = 0;
      state.viewMode = "normal";
      renderProject();
      showStatus(`${file.name} 프로젝트를 불러왔습니다.`, "success");
    } catch (error) {
      showStatus(`JSON을 불러오지 못했습니다: ${error.message}`, "error", 0);
    }
  }

  elements.timeline.addEventListener("click", (event) => {
    const button = event.target.closest(".editor-cue");
    if (!button) {
      return;
    }
    pausePlayback({ render: false });
    selectCue(button.dataset.cueId, { seek: true });
  });

  elements.timeline.addEventListener("dragstart", (event) => {
    const button = event.target.closest(".editor-cue");
    if (!button) {
      return;
    }
    draggedCueId = button.dataset.cueId;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedCueId);
  });

  elements.timeline.addEventListener("dragover", (event) => {
    if (event.target.closest(".editor-cue")) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }
  });

  elements.timeline.addEventListener("drop", (event) => {
    const target = event.target.closest(".editor-cue");
    const cueId = draggedCueId || event.dataTransfer.getData("text/plain");
    if (!target || !cueId) {
      return;
    }
    event.preventDefault();
    pausePlayback({ render: false });
    state.project = Core.moveCue(state.project, cueId, Number(target.dataset.cueIndex));
    state.selectedCueId = cueId;
    state.playheadMs = Core.cueStartTime(state.project, selectedIndex());
    draggedCueId = null;
    renderProject();
  });

  elements.playToggle.addEventListener("click", togglePlayback);
  elements.previousFrame.addEventListener("click", () => goToRelativeCue(-1));
  elements.nextFrame.addEventListener("click", () => goToRelativeCue(1));
  elements.addFrames.addEventListener("click", () => elements.frameInput.click());
  elements.replaceFrame.addEventListener("click", () => elements.replaceInput.click());
  elements.importProject.addEventListener("click", () => elements.projectInput.click());
  elements.exportProject.addEventListener("click", exportProject);
  elements.exportFrame.addEventListener("click", exportCurrentFrame);
  elements.resetProject.addEventListener("click", resetProject);
  elements.duplicateFrame.addEventListener("click", duplicateSelectedCue);
  elements.deleteFrame.addEventListener("click", deleteSelectedCue);
  elements.moveFrameLeft.addEventListener("click", () => moveSelectedCue(-1));
  elements.moveFrameRight.addEventListener("click", () => moveSelectedCue(1));
  elements.frameDuration.addEventListener("change", changeCueDuration);

  elements.frameInput.addEventListener("change", async () => {
    await addFiles(elements.frameInput.files);
    elements.frameInput.value = "";
  });
  elements.replaceInput.addEventListener("change", async () => {
    await replaceSelectedFile(elements.replaceInput.files[0]);
    elements.replaceInput.value = "";
  });
  elements.projectInput.addEventListener("change", async () => {
    await importProject(elements.projectInput.files[0]);
    elements.projectInput.value = "";
  });

  elements.loopToggle.addEventListener("change", () => {
    state.project = Core.cloneProject(state.project);
    state.project.loop = elements.loopToggle.checked;
    renderSelection();
  });

  elements.scrubber.addEventListener("input", () => {
    pausePlayback({ render: false });
    state.playheadMs = Number(elements.scrubber.value);
    const index = Core.frameIndexAtTime(state.project, state.playheadMs);
    if (index >= 0) {
      state.selectedCueId = state.project.sequence[index].id;
    }
    renderSelection();
  });

  elements.onionToggle.addEventListener("click", () => {
    stopAbFlashing({ render: false });
    state.viewMode = state.viewMode === "onion" ? "normal" : "onion";
    renderSelection();
  });

  elements.differenceToggle.addEventListener("click", () => {
    stopAbFlashing({ render: false });
    state.viewMode = state.viewMode === "difference" ? "normal" : "difference";
    renderSelection();
  });

  elements.abToggle.addEventListener("click", toggleAbFlashing);
  elements.guidesToggle.addEventListener("click", () => {
    state.guides = !state.guides;
    renderSelection();
  });
  elements.onionOpacity.addEventListener("input", () => {
    state.onionOpacity = Number(elements.onionOpacity.value) / 100;
    drawPreview();
  });

  elements.setReference.addEventListener("click", () => {
    const asset = selectedAsset();
    if (!asset) {
      return;
    }
    state.project = Core.setReferenceAsset(state.project, asset.id);
    renderProject();
    showStatus(`${asset.label} 이미지를 정렬 기준으로 설정했습니다.`, "success");
  });

  elements.frameOffsetX.addEventListener("change", () => {
    updateSelectedOffset(Number(elements.frameOffsetX.value), Number(elements.frameOffsetY.value));
  });
  elements.frameOffsetY.addEventListener("change", () => {
    updateSelectedOffset(Number(elements.frameOffsetX.value), Number(elements.frameOffsetY.value));
  });
  elements.resetOffset.addEventListener("click", () => updateSelectedOffset(0, 0));

  document.querySelectorAll("[data-nudge-x][data-nudge-y]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const asset = selectedAsset();
      if (!asset) {
        return;
      }
      const multiplier = event.shiftKey ? 10 : 1;
      updateSelectedOffset(
        asset.offsetX + Number(button.dataset.nudgeX) * multiplier,
        asset.offsetY + Number(button.dataset.nudgeY) * multiplier,
      );
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.target.closest("input, button, a")) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      togglePlayback();
    } else if (event.code === "ArrowLeft") {
      event.preventDefault();
      goToRelativeCue(-1);
    } else if (event.code === "ArrowRight") {
      event.preventDefault();
      goToRelativeCue(1);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.playing) {
      pausePlayback();
    }
  });
  window.addEventListener("beforeunload", releaseAllObjectUrls);

  renderProject();
  Promise.allSettled(state.project.assets.map(loadImage)).then((results) => {
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length > 0) {
      showStatus(`${failures.length}개 기본 프레임을 읽지 못했습니다. 파일 경로를 확인하세요.`, "error", 0);
    }
  });
})();
