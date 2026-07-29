export function shouldPreserveOpaqueFullFrame({
  subjectPixels,
  totalPixels,
  backgroundModels = []
} = {}) {
  const total = Math.max(1, Number(totalPixels) || 0);
  const subjectRatio = Math.max(0, Number(subjectPixels) || 0) / total;
  if (subjectRatio >= 0.18 || backgroundModels.length < 5) return false;

  const counts = backgroundModels
    .map((model) => Math.max(0, Number(model?.count) || 0))
    .filter((count) => count > 0);
  const sampled = counts.reduce((sum, count) => sum + count, 0);
  if (sampled <= 0) return false;

  const dominantShare = Math.max(...counts) / sampled;
  return dominantShare < 0.78;
}
