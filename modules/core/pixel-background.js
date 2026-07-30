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
  if (Number(sourceOpaqueRatio) < 0.98 || Number(outputOpaqueRatio) >= 0.025) return false;
  const meanDelta = Math.max(0, Number(edgeTexture.meanDelta) || 0);
  const activeFraction = Math.max(0, Number(edgeTexture.activeFraction) || 0);
  return meanDelta >= 1.2 && activeFraction >= 0.08;
}
