const MIB = 1024 * 1024;

export function memoryPolicy(deviceMemoryGb = 4) {
  const memory = Math.max(1, Number(deviceMemoryGb) || 4);
  if (memory <= 2) return { softLimitBytes: 320 * MIB, hardLimitBytes: 480 * MIB };
  if (memory <= 4) return { softLimitBytes: 640 * MIB, hardLimitBytes: 900 * MIB };
  if (memory <= 8) return { softLimitBytes: 900 * MIB, hardLimitBytes: 1300 * MIB };
  return { softLimitBytes: 1200 * MIB, hardLimitBytes: 1700 * MIB };
}

export function formatBytes(bytes) {
  const value = Math.max(0, Number(bytes) || 0);
  if (value < 1024) return `${Math.round(value)} B`;
  if (value < MIB) return `${(value / 1024).toFixed(value < 10 * 1024 ? 1 : 0)} KB`;
  if (value < 1024 * MIB) return `${(value / MIB).toFixed(value < 10 * MIB ? 1 : 0)} MB`;
  return `${(value / (1024 * MIB)).toFixed(2)} GB`;
}

export function estimateWorkspaceBytes(roots) {
  const visitedObjects = new WeakSet();
  const visitedBuffers = new WeakSet();
  let pixelBytes = 0;
  let encodedBytes = 0;

  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (value instanceof ArrayBuffer) {
      if (!visitedBuffers.has(value)) {
        visitedBuffers.add(value);
        pixelBytes += value.byteLength;
      }
      return;
    }
    if (ArrayBuffer.isView(value)) {
      visit(value.buffer);
      return;
    }
    if (typeof Blob !== "undefined" && value instanceof Blob) {
      if (!visitedObjects.has(value)) {
        visitedObjects.add(value);
        encodedBytes += value.size || 0;
      }
      return;
    }
    if (visitedObjects.has(value)) return;
    visitedObjects.add(value);

    if (value.data && ArrayBuffer.isView(value.data) && Number.isFinite(value.width) && Number.isFinite(value.height)) {
      visit(value.data.buffer);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    Object.values(value).forEach(visit);
  };

  visit(roots);
  return {
    pixelBytes,
    encodedBytes,
    totalBytes: pixelBytes + encodedBytes
  };
}

export function memoryPressureLevel(totalBytes, policy) {
  if (totalBytes >= policy.hardLimitBytes) return "critical";
  if (totalBytes >= policy.softLimitBytes) return "warning";
  return "normal";
}
