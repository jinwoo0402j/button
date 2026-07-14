(function attachFrameAnimationCore(root) {
  "use strict";

  const MIN_DURATION_MS = 16;
  const MAX_DURATION_MS = 10_000;
  const DEFAULT_DURATION_MS = 120;

  function cloneProject(project) {
    return {
      ...project,
      canvas: { ...project.canvas },
      assets: project.assets.map((asset) => ({ ...asset })),
      sequence: project.sequence.map((cue) => ({ ...cue })),
    };
  }

  function integer(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.round(number) : fallback;
  }

  function positiveInteger(value, label) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number <= 0) {
      throw new TypeError(`${label} must be a positive integer`);
    }
    return number;
  }

  function validateDuration(value) {
    const duration = value;
    if (
      typeof duration !== "number"
      || !Number.isSafeInteger(duration)
      || duration < MIN_DURATION_MS
      || duration > MAX_DURATION_MS
    ) {
      throw new RangeError(
        `durationMs must be an integer between ${MIN_DURATION_MS} and ${MAX_DURATION_MS}`,
      );
    }
    return duration;
  }

  function requireString(value, label) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new TypeError(`${label} must be a non-empty string`);
    }
    return value.trim();
  }

  function slugify(value, fallback) {
    const slug = String(value ?? "")
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || fallback;
  }

  function uniqueId(base, usedIds) {
    let candidate = base;
    let suffix = 2;
    while (usedIds.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(candidate);
    return candidate;
  }

  function uniqueFileName(fileName, usedNames) {
    const normalized = fileName.toLowerCase();
    if (!usedNames.has(normalized)) {
      usedNames.add(normalized);
      return fileName;
    }
    const extensionIndex = fileName.lastIndexOf(".");
    const stem = extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;
    const extension = extensionIndex > 0 ? fileName.slice(extensionIndex) : "";
    let suffix = 2;
    let candidate = `${stem}-${suffix}${extension}`;
    while (usedNames.has(candidate.toLowerCase())) {
      suffix += 1;
      candidate = `${stem}-${suffix}${extension}`;
    }
    usedNames.add(candidate.toLowerCase());
    return candidate;
  }

  function replacePathFileName(path, fileName) {
    const slashIndex = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return slashIndex >= 0 ? `${path.slice(0, slashIndex + 1)}${fileName}` : fileName;
  }

  function normalizeProject(input) {
    if (!input || typeof input !== "object") {
      throw new TypeError("project must be an object");
    }

    const width = positiveInteger(input.canvas?.width, "canvas.width");
    const height = positiveInteger(input.canvas?.height, "canvas.height");
    if (!Array.isArray(input.assets) || input.assets.length === 0) {
      throw new RangeError("project must contain at least one asset");
    }
    if (!Array.isArray(input.sequence) || input.sequence.length === 0) {
      throw new RangeError("project must contain at least one sequence cue");
    }

    const assetIds = new Set();
    const assets = input.assets.map((source, index) => {
      const id = requireString(source.id, `assets[${index}].id`);
      if (assetIds.has(id)) {
        throw new RangeError(`duplicate asset id: ${id}`);
      }
      assetIds.add(id);
      const src = requireString(source.src, `assets[${index}].src`);
      const fileName = requireString(
        source.fileName || src.split(/[\\/]/).pop(),
        `assets[${index}].fileName`,
      );
      return {
        id,
        label: typeof source.label === "string" && source.label.trim()
          ? source.label.trim()
          : id,
        src,
        sourcePath: typeof source.sourcePath === "string" && source.sourcePath.trim()
          ? source.sourcePath.trim()
          : src,
        fileName,
        width: positiveInteger(source.width || width, `assets[${index}].width`),
        height: positiveInteger(source.height || height, `assets[${index}].height`),
        offsetX: integer(source.offsetX),
        offsetY: integer(source.offsetY),
      };
    });

    const cueIds = new Set();
    const sequence = input.sequence.map((source, index) => {
      const id = requireString(source.id, `sequence[${index}].id`);
      if (cueIds.has(id)) {
        throw new RangeError(`duplicate cue id: ${id}`);
      }
      cueIds.add(id);
      const assetId = requireString(
        source.assetId,
        `sequence[${index}].assetId`,
      );
      if (!assetIds.has(assetId)) {
        throw new RangeError(`unknown asset id: ${assetId}`);
      }
      return {
        id,
        assetId,
        durationMs: validateDuration(source.durationMs),
      };
    });

    const requestedReference = typeof input.referenceAssetId === "string"
      ? input.referenceAssetId
      : "";
    const referenceAssetId = assetIds.has(requestedReference)
      ? requestedReference
      : sequence[0].assetId;

    return {
      version: 1,
      name: typeof input.name === "string" && input.name.trim()
        ? input.name.trim()
        : "frame-animation",
      canvas: { width, height },
      loop: input.loop !== false,
      referenceAssetId,
      assets,
      sequence,
    };
  }

  function assetForCue(project, cueOrId) {
    const cue = typeof cueOrId === "string"
      ? project.sequence.find((candidate) => candidate.id === cueOrId)
      : cueOrId;
    if (!cue) {
      return null;
    }
    return project.assets.find((asset) => asset.id === cue.assetId) || null;
  }

  function totalDuration(project) {
    return project.sequence.reduce((sum, cue) => sum + cue.durationMs, 0);
  }

  function cueStartTime(project, cueIndex) {
    const index = Math.max(0, Math.min(project.sequence.length, integer(cueIndex)));
    let elapsed = 0;
    for (let cursor = 0; cursor < index; cursor += 1) {
      elapsed += project.sequence[cursor].durationMs;
    }
    return elapsed;
  }

  function frameIndexAtTime(project, elapsedMs) {
    if (!Number.isFinite(elapsedMs)) {
      throw new TypeError("elapsedMs must be finite");
    }
    const duration = totalDuration(project);
    if (duration <= 0 || project.sequence.length === 0) {
      return -1;
    }

    let cursorTime;
    if (project.loop) {
      cursorTime = ((elapsedMs % duration) + duration) % duration;
    } else {
      cursorTime = Math.max(0, Math.min(elapsedMs, duration - 1));
    }

    let boundary = 0;
    for (let index = 0; index < project.sequence.length; index += 1) {
      boundary += project.sequence[index].durationMs;
      if (cursorTime < boundary) {
        return index;
      }
    }
    return project.sequence.length - 1;
  }

  function moveCue(project, cueId, targetIndex) {
    const next = cloneProject(project);
    const sourceIndex = next.sequence.findIndex((cue) => cue.id === cueId);
    if (sourceIndex < 0) {
      return next;
    }
    const boundedTarget = Math.max(
      0,
      Math.min(next.sequence.length - 1, integer(targetIndex)),
    );
    if (sourceIndex === boundedTarget) {
      return next;
    }
    const [cue] = next.sequence.splice(sourceIndex, 1);
    next.sequence.splice(boundedTarget, 0, cue);
    return next;
  }

  function duplicateCue(project, cueId) {
    const next = cloneProject(project);
    const sourceIndex = next.sequence.findIndex((cue) => cue.id === cueId);
    if (sourceIndex < 0) {
      return { project: next, selectedCueId: cueId };
    }
    const usedIds = new Set(next.sequence.map((cue) => cue.id));
    const source = next.sequence[sourceIndex];
    const id = uniqueId(`${source.id}-copy`, usedIds);
    next.sequence.splice(sourceIndex + 1, 0, { ...source, id });
    return { project: next, selectedCueId: id };
  }

  function deleteCue(project, cueId) {
    const next = cloneProject(project);
    const sourceIndex = next.sequence.findIndex((cue) => cue.id === cueId);
    if (sourceIndex < 0 || next.sequence.length === 1) {
      return { project: next, selectedCueId: cueId, deleted: false };
    }
    const [removed] = next.sequence.splice(sourceIndex, 1);
    const stillUsed = next.sequence.some((cue) => cue.assetId === removed.assetId);
    if (!stillUsed) {
      next.assets = next.assets.filter((asset) => asset.id !== removed.assetId);
      if (next.referenceAssetId === removed.assetId) {
        next.referenceAssetId = next.sequence[0].assetId;
      }
    }
    const selectionIndex = Math.min(sourceIndex, next.sequence.length - 1);
    return {
      project: next,
      selectedCueId: next.sequence[selectionIndex].id,
      deleted: true,
    };
  }

  function addAssetCues(project, descriptors, afterCueId) {
    if (!Array.isArray(descriptors) || descriptors.length === 0) {
      return { project: cloneProject(project), selectedCueId: afterCueId };
    }
    const next = cloneProject(project);
    const usedAssetIds = new Set(next.assets.map((asset) => asset.id));
    const usedCueIds = new Set(next.sequence.map((cue) => cue.id));
    const usedFileNames = new Set(next.assets.map((asset) => asset.fileName.toLowerCase()));
    const insertedCues = [];

    for (const [index, descriptor] of descriptors.entries()) {
      const requestedFileName = requireString(
        descriptor.fileName || descriptor.src?.split(/[\\/]/).pop(),
        `descriptors[${index}].fileName`,
      );
      const fileName = uniqueFileName(requestedFileName, usedFileNames);
      const baseId = slugify(descriptor.id || fileName.replace(/\.[^.]+$/, ""), `frame-${index + 1}`);
      const id = uniqueId(baseId, usedAssetIds);
      const src = requireString(descriptor.src, `descriptors[${index}].src`);
      const requestedSourcePath = descriptor.sourcePath || `./assets/${requestedFileName}`;
      next.assets.push({
        id,
        label: descriptor.label || fileName.replace(/\.[^.]+$/, ""),
        src,
        sourcePath: replacePathFileName(requestedSourcePath, fileName),
        fileName,
        width: positiveInteger(descriptor.width || next.canvas.width, "asset.width"),
        height: positiveInteger(descriptor.height || next.canvas.height, "asset.height"),
        offsetX: integer(descriptor.offsetX),
        offsetY: integer(descriptor.offsetY),
      });
      const cueId = uniqueId(`cue-${id}`, usedCueIds);
      insertedCues.push({
        id: cueId,
        assetId: id,
        durationMs: validateDuration(descriptor.durationMs || DEFAULT_DURATION_MS),
      });
    }

    const anchorIndex = next.sequence.findIndex((cue) => cue.id === afterCueId);
    const insertionIndex = anchorIndex < 0 ? next.sequence.length : anchorIndex + 1;
    next.sequence.splice(insertionIndex, 0, ...insertedCues);
    return {
      project: next,
      selectedCueId: insertedCues[insertedCues.length - 1].id,
    };
  }

  function replaceAsset(project, assetId, descriptor) {
    const next = cloneProject(project);
    const index = next.assets.findIndex((asset) => asset.id === assetId);
    if (index < 0) {
      return next;
    }
    const current = next.assets[index];
    const requestedFileName = requireString(
      descriptor.fileName || descriptor.src?.split(/[\\/]/).pop(),
      "replacement.fileName",
    );
    const usedFileNames = new Set(
      next.assets
        .filter((asset) => asset.id !== assetId)
        .map((asset) => asset.fileName.toLowerCase()),
    );
    const fileName = uniqueFileName(requestedFileName, usedFileNames);
    const requestedSourcePath = descriptor.sourcePath || `./assets/${requestedFileName}`;
    next.assets[index] = {
      ...current,
      src: requireString(descriptor.src, "replacement.src"),
      sourcePath: replacePathFileName(requestedSourcePath, fileName),
      fileName,
      width: positiveInteger(descriptor.width || next.canvas.width, "replacement.width"),
      height: positiveInteger(descriptor.height || next.canvas.height, "replacement.height"),
    };
    return next;
  }

  function updateCueDuration(project, cueId, durationMs) {
    const duration = validateDuration(durationMs);
    const next = cloneProject(project);
    const cue = next.sequence.find((candidate) => candidate.id === cueId);
    if (cue) {
      cue.durationMs = duration;
    }
    return next;
  }

  function updateAssetOffset(project, assetId, offsetX, offsetY) {
    const next = cloneProject(project);
    const asset = next.assets.find((candidate) => candidate.id === assetId);
    if (asset) {
      asset.offsetX = integer(offsetX);
      asset.offsetY = integer(offsetY);
    }
    return next;
  }

  function setReferenceAsset(project, assetId) {
    const next = cloneProject(project);
    if (next.assets.some((asset) => asset.id === assetId)) {
      next.referenceAssetId = assetId;
    }
    return next;
  }

  function portableProject(project) {
    const normalized = normalizeProject({
      ...project,
      assets: project.assets.map((asset) => ({
        ...asset,
        src: asset.sourcePath || asset.src,
        sourcePath: asset.sourcePath || asset.src,
      })),
    });
    return {
      version: normalized.version,
      name: normalized.name,
      canvas: normalized.canvas,
      loop: normalized.loop,
      referenceAssetId: normalized.referenceAssetId,
      assets: normalized.assets.map((asset) => ({
        id: asset.id,
        label: asset.label,
        src: asset.src,
        fileName: asset.fileName,
        width: asset.width,
        height: asset.height,
        offsetX: asset.offsetX,
        offsetY: asset.offsetY,
      })),
      sequence: normalized.sequence,
    };
  }

  function serializeProject(project) {
    return `${JSON.stringify(portableProject(project), null, 2)}\n`;
  }

  root.FrameAnimationCore = Object.freeze({
    DEFAULT_DURATION_MS,
    MAX_DURATION_MS,
    MIN_DURATION_MS,
    addAssetCues,
    assetForCue,
    cloneProject,
    cueStartTime,
    deleteCue,
    duplicateCue,
    frameIndexAtTime,
    moveCue,
    normalizeProject,
    portableProject,
    replaceAsset,
    serializeProject,
    setReferenceAsset,
    totalDuration,
    updateAssetOffset,
    updateCueDuration,
    validateDuration,
  });
})(globalThis);
