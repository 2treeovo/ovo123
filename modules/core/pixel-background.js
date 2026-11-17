export function shouldUseOpaqueFullFrame({
  transparentPixels,
  totalPixels,
  preserveOpaqueCanvas = true
} = {}) {
  if (!preserveOpaqueCanvas) return false;
  const total = Math.max(1, Number(totalPixels) || 0);
  const transparent = Math.max(0, Number(transparentPixels) || 0);
  return transparent < Math.max(4, Math.round(total * 0.001));
}

export function shouldPreserveOpaqueFullFrame({
  subjectPixels,
  totalPixels,
  backgroundModels = [],
  edgeTexture = {}
} = {}) {
  const total = Math.max(1, Number(totalPixels) || 0);
  const subjectRatio = Math.max(0, Number(subjectPixels) || 0) / total;
  const meanDelta = Math.max(0, Number(edgeTexture.meanDelta) || 0);
  const activeFraction = Math.max(0, Number(edgeTexture.activeFraction) || 0);
  if (subjectRatio < 0.72 && meanDelta >= 2.4 && activeFraction >= 0.16) return true;
  if (subjectRatio >= 0.18 || backgroundModels.length < 5) return false;

  const counts = backgroundModels
    .map((model) => Math.max(0, Number(model?.count) || 0))
    .filter((count) => count > 0);
  const sampled = counts.reduce((sum, count) => sum + count, 0);
  if (sampled <= 0) return false;

  const dominantShare = Math.max(...counts) / sampled;
  return dominantShare < 0.78;
}

export function measureOpaqueEdgeTexture(imageData) {
  const width = Math.max(0, Number(imageData?.width) || 0);
  const height = Math.max(0, Number(imageData?.height) || 0);
  const data = imageData?.data;
  if (!data || width < 2 || height < 2) return { meanDelta: 0, activeFraction: 0, samples: 0 };

  const band = Math.max(2, Math.min(12, Math.round(Math.min(width, height) * 0.02)));
  const step = Math.max(1, Math.floor(Math.min(width, height) / 256));
  let samples = 0;
  let active = 0;
  let deltaSum = 0;
  const compare = (firstPixel, secondPixel) => {
    const first = firstPixel * 4;
    const second = secondPixel * 4;
    if (data[first + 3] < 240 || data[second + 3] < 240) return;
    const dr = data[first] - data[second];
    const dg = data[first + 1] - data[second + 1];
    const db = data[first + 2] - data[second + 2];
    const delta = Math.sqrt(dr * dr * 0.30 + dg * dg * 0.59 + db * db * 0.11);
    samples += 1;
    deltaSum += delta;
    if (delta >= 3) active += 1;
  };

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (x >= band && y >= band && x < width - band && y < height - band) continue;
      const pixel = y * width + x;
      if (x + 1 < width) compare(pixel, pixel + 1);
      if (y + 1 < height) compare(pixel, pixel + width);
    }
  }
  return {
    meanDelta: deltaSum / Math.max(1, samples),
    activeFraction: active / Math.max(1, samples),
    samples
  };
}

export function opaquePixelRatio(imageData, alphaThreshold = 16) {
  const data = imageData?.data;
  if (!data?.length) return 0;
  let opaque = 0;
  for (let index = 3; index < data.length; index += 4) {
    if (data[index] > alphaThreshold) opaque += 1;
  }
  return opaque / Math.max(1, data.length / 4);
}

export function shouldRetrySparsePixelation({
  maskMode,
  sourceOpaqueRatio,
  outputOpaqueRatio,
  edgeTexture = {}
} = {}) {
  if (maskMode !== "edge-background") return false;
  if (Number(sourceOpaqueRatio) < 0.98) return false;
  const sparseRatio = Math.max(0, Number(outputOpaqueRatio) || 0);
  if (sparseRatio < 0.04) return true;
  if (sparseRatio >= 0.12) return false;
  const meanDelta = Math.max(0, Number(edgeTexture.meanDelta) || 0);
  const activeFraction = Math.max(0, Number(edgeTexture.activeFraction) || 0);
  return meanDelta >= 1.2 && activeFraction >= 0.08;
}

function contourCellLuma(color) {
  if (!color) return 0;
  return Number(color.r || 0) * 0.299 + Number(color.g || 0) * 0.587 + Number(color.b || 0) * 0.114;
}

export function repairDarkContourFringeCells(cells, width, height, options = {}) {
  const w = Math.max(0, Math.floor(Number(width) || 0));
  const h = Math.max(0, Math.floor(Number(height) || 0));
  if (!Array.isArray(cells) || w <= 0 || h <= 0 || cells.length < w * h) return cells;

  const source = cells.slice();
  const repaired = cells.slice();
  const minLumaGap = Math.max(8, Number(options.minLumaGap) || 24);
  const maxLumaRatio = Math.max(0.25, Math.min(0.9, Number(options.maxLumaRatio) || 0.68));
  const searchRadius = Math.max(1, Math.min(3, Math.round(Number(options.searchRadius) || 2)));
  const neighborCount = (x, y) => {
    let count = 0;
    for (let oy = -1; oy <= 1; oy += 1) {
      for (let ox = -1; ox <= 1; ox += 1) {
        if (ox === 0 && oy === 0) continue;
        const nx = x + ox;
        const ny = y + oy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (source[ny * w + nx]) count += 1;
      }
    }
    return count;
  };
  const medianChannel = (colors, channel) => {
    const values = colors.map((color) => Number(color[channel]) || 0).sort((left, right) => left - right);
    return Math.round(values[Math.floor(values.length / 2)]);
  };
  const supportMap = new Uint8Array(w * h);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (source[y * w + x]) supportMap[y * w + x] = neighborCount(x, y);
    }
  }

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const index = y * w + x;
      const current = source[index];
      if (!current) continue;
      const support = supportMap[index];
      if (support >= 8) continue;
      const currentLuma = contourCellLuma(current);
      const requiredSupport = Math.min(5, support + 1);
      let candidates = [];
      for (let radius = 1; radius <= searchRadius && candidates.length === 0; radius += 1) {
        for (let oy = -radius; oy <= radius; oy += 1) {
          for (let ox = -radius; ox <= radius; ox += 1) {
            if (Math.max(Math.abs(ox), Math.abs(oy)) !== radius) continue;
            const nx = x + ox;
            const ny = y + oy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const candidate = source[ny * w + nx];
            if (!candidate || supportMap[ny * w + nx] < requiredSupport) continue;
            if (contourCellLuma(candidate) - currentLuma < minLumaGap) continue;
            candidates.push(candidate);
          }
        }
      }
      if (candidates.length === 0) continue;
      const replacement = {
        r: medianChannel(candidates, "r"),
        g: medianChannel(candidates, "g"),
        b: medianChannel(candidates, "b")
      };
      const replacementLuma = contourCellLuma(replacement);
      if (replacementLuma - currentLuma < minLumaGap || currentLuma > replacementLuma * maxLumaRatio) continue;
      repaired[index] = {
        ...current,
        ...replacement,
        detailImportance: Math.min(Number(current.detailImportance) || 0, 0.2),
        fringeRepaired: true
      };
    }
  }
  return repaired;
}
