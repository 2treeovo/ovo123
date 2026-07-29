export const DEFAULT_PROXY_MAX_SIDE = 2560;
export const MIN_PROXY_MAX_SIDE = 1280;

function positiveInteger(value, fallback) {
  const number = Math.round(Number(value));
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

export function proxyDimensions(width, height, maxSide = DEFAULT_PROXY_MAX_SIDE) {
  const sourceWidth = positiveInteger(width, 1);
  const sourceHeight = positiveInteger(height, 1);
  const safeMaxSide = Math.max(256, positiveInteger(maxSide, DEFAULT_PROXY_MAX_SIDE));
  const ratio = Math.min(1, safeMaxSide / Math.max(sourceWidth, sourceHeight));
  return {
    width: Math.max(1, Math.round(sourceWidth * ratio)),
    height: Math.max(1, Math.round(sourceHeight * ratio)),
    scale: ratio
  };
}

export function chooseProxyMaxSide({
  fileCount = 1,
  currentBytes = 0,
  softLimitBytes = 640 * 1024 * 1024
} = {}) {
  const count = Math.max(1, positiveInteger(fileCount, 1));
  const pressure = softLimitBytes > 0 ? currentBytes / softLimitBytes : 0;
  if (count >= 24 || pressure >= 0.82) return 1280;
  if (count >= 10 || pressure >= 0.62) return 1600;
  if (count >= 4 || pressure >= 0.38) return 2048;
  return DEFAULT_PROXY_MAX_SIDE;
}

async function decodeWithImageElement(blob) {
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("图片解码失败"));
      image.src = url;
    });
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function decodeImageBlob(blob) {
  if (!blob || !String(blob.type || "").startsWith("image/")) {
    throw new Error("请选择有效的图片文件");
  }
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(blob, { imageOrientation: "from-image" });
    } catch {
      // Safari and a few older Chromium builds reject imageOrientation.
      return createImageBitmap(blob);
    }
  }
  return decodeWithImageElement(blob);
}

function drawableDimensions(drawable) {
  return {
    width: positiveInteger(drawable?.naturalWidth || drawable?.videoWidth || drawable?.width, 1),
    height: positiveInteger(drawable?.naturalHeight || drawable?.videoHeight || drawable?.height, 1)
  };
}

export function rasterizeDrawable(drawable, options = {}) {
  const source = drawableDimensions(drawable);
  const dimensions = options.fullResolution
    ? { width: source.width, height: source.height, scale: 1 }
    : proxyDimensions(source.width, source.height, options.maxSide);
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(drawable, 0, 0, dimensions.width, dimensions.height);
  return context.getImageData(0, 0, dimensions.width, dimensions.height);
}

export async function createImageSource(file, options = {}) {
  const drawable = await decodeImageBlob(file);
  try {
    const { width, height } = drawableDimensions(drawable);
    const imageData = rasterizeDrawable(drawable, { maxSide: options.maxSide });
    return {
      imageData,
      source: {
        blob: file,
        width,
        height,
        proxyWidth: imageData.width,
        proxyHeight: imageData.height,
        name: file.name || "image",
        type: file.type || "image/png"
      }
    };
  } finally {
    drawable.close?.();
  }
}

export async function materializeFullResolution(source) {
  if (!source?.blob) return null;
  const drawable = await decodeImageBlob(source.blob);
  try {
    return rasterizeDrawable(drawable, { fullResolution: true });
  } finally {
    drawable.close?.();
  }
}
