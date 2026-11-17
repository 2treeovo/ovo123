import {
  chooseProxyMaxSide,
  createImageSource,
  materializeFullResolution
} from "./modules/core/image-runtime.js";
import {
  estimateWorkspaceBytes,
  formatBytes,
  memoryPolicy,
  memoryPressureLevel
} from "./modules/core/memory-budget.js";
import {
  measureOpaqueEdgeTexture,
  opaquePixelRatio,
  repairDarkContourFringeCells,
  shouldPreserveOpaqueFullFrame,
  shouldRetrySparsePixelation,
  shouldUseOpaqueFullFrame
} from "./modules/core/pixel-background.js?v=professional-core-46";

const input = document.querySelector("#imageInput");
const videoInput = document.querySelector("#videoInput");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const selectionCanvas = document.querySelector("#selectionCanvas");
const selectionCtx = selectionCanvas.getContext("2d");
const eraserCursor = document.createElement("div");
eraserCursor.className = "eraser-cursor";
document.body.appendChild(eraserCursor);
const brushCursor = document.createElement("div");
brushCursor.className = "brush-cursor";
document.body.appendChild(brushCursor);
const brushPickIndicator = document.createElement("div");
brushPickIndicator.className = "brush-pick-indicator";
brushPickIndicator.hidden = true;
brushPickIndicator.innerHTML = '<div class="brush-pick-ring"></div><div class="brush-pick-core"></div>';
document.body.appendChild(brushPickIndicator);
const brushMagnifier = document.createElement("div");
brushMagnifier.className = "brush-magnifier";
brushMagnifier.hidden = true;
const brushMagnifierCanvas = document.createElement("canvas");
brushMagnifierCanvas.width = 96;
brushMagnifierCanvas.height = 96;
const brushMagnifierCtx = brushMagnifierCanvas.getContext("2d", { willReadFrequently: true });
brushMagnifier.appendChild(brushMagnifierCanvas);
document.body.appendChild(brushMagnifier);
const stage = document.querySelector("#stage");
const canvasScene = document.querySelector("#canvasScene");
const canvasTabs = document.querySelector("#canvasTabs");
const emptyState = document.querySelector("#emptyState");
const cropBox = document.querySelector("#cropBox");
const tolerance = document.querySelector("#tolerance");
const softness = document.querySelector("#softness");
const toleranceValue = document.querySelector("#toleranceValue");
const softnessValue = document.querySelector("#softnessValue");
const contiguous = document.querySelector("#contiguous");
const forceRemoveColor = document.querySelector("#forceRemoveColor");
const swatches = document.querySelector("#swatches");
const pickedColorsPanel = document.querySelector("#pickedColorsPanel");
const statusText = document.querySelector("#status");
const openFeedbackDialogBtn = document.querySelector("#openFeedbackDialogBtn");
const feedbackDialog = document.querySelector("#feedbackDialog");
const closeFeedbackDialogBtn = document.querySelector("#closeFeedbackDialogBtn");
const cancelFeedbackBtn = document.querySelector("#cancelFeedbackBtn");
const feedbackForm = document.querySelector("#feedbackForm");
const feedbackCategory = document.querySelector("#feedbackCategory");
const feedbackMessage = document.querySelector("#feedbackMessage");
const feedbackMessageCount = document.querySelector("#feedbackMessageCount");
const feedbackContact = document.querySelector("#feedbackContact");
const feedbackHoney = document.querySelector("#feedbackHoney");
const feedbackSubmitStatus = document.querySelector("#feedbackSubmitStatus");
const feedbackFallbackBtn = document.querySelector("#feedbackFallbackBtn");
const submitFeedbackBtn = document.querySelector("#submitFeedbackBtn");
const openDonationDialogBtn = document.querySelector("#openDonationDialogBtn");
const donationDialog = document.querySelector("#donationDialog");
const closeDonationDialogBtn = document.querySelector("#closeDonationDialogBtn");
const closeDonationActionBtn = document.querySelector("#closeDonationActionBtn");
const memoryLimitDialog = document.querySelector("#memoryLimitDialog");
const memoryLimitMessage = document.querySelector("#memoryLimitMessage");
const closeMemoryLimitDialogBtn = document.querySelector("#closeMemoryLimitDialogBtn");
const removeBtn = document.querySelector("#removeBtn");
const cutoutCommitRow = removeBtn?.closest(".cutout-commit-row");
const undoBtn = document.querySelector("#undoBtn");
const redoBtn = document.querySelector("#redoBtn");
const resetBtn = document.querySelector("#resetBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const downloadAllBtn = document.querySelector("#downloadAllBtn");
const clearColors = document.querySelector("#clearColors");
const originalTab = document.querySelector("#originalTab");
const resultTab = document.querySelector("#resultTab");
const fitBtn = document.querySelector("#fitBtn");
const checkerBgBtn = document.querySelector("#checkerBgBtn");
const darkBgBtn = document.querySelector("#darkBgBtn");
const lightBgBtn = document.querySelector("#lightBgBtn");
const greenBgBtn = document.querySelector("#greenBgBtn");
const customBgColor = document.querySelector("#customBgColor");
const toolbar = document.querySelector(".toolbar");
const modeTabs = document.querySelector(".mode-tabs");
const pickModeBtn = document.querySelector("#pickModeBtn");
const extractModeBtn = document.querySelector("#extractModeBtn");
const cropModeBtn = document.querySelector("#cropModeBtn");
const lassoModeBtn = document.querySelector("#lassoModeBtn");
const brushModeBtn = document.querySelector("#brushModeBtn");
const eraserModeBtn = document.querySelector("#eraserModeBtn");
const cancelToolBtn = document.querySelector("#cancelToolBtn");
const finishToolBtn = document.querySelector("#finishToolBtn");
const brushSizePopover = document.querySelector("#brushSizePopover");
const brushSize = document.querySelector("#brushSize");
const brushSizeValue = document.querySelector("#brushSizeValue");
const brushColorPreview = document.querySelector("#brushColorPreview");
const brushPaletteColor = document.querySelector("#brushPaletteColor");
const brushColorPalette = document.querySelector("#brushColorPalette");
const brushColorPaletteCtx = brushColorPalette?.getContext("2d", { willReadFrequently: true });
const brushHueRange = document.querySelector("#brushHueRange");
const brushPanelColorPreview = document.querySelector("#brushPanelColorPreview");
const brushPaletteHex = document.querySelector("#brushPaletteHex");
const brushPanelSize = document.querySelector("#brushPanelSize");
const brushPanelSizeValue = document.querySelector("#brushPanelSizeValue");
const brushPanelModeBtn = document.querySelector("#brushPanelModeBtn");
const eraserPanelModeBtn = document.querySelector("#eraserPanelModeBtn");
const createBlankCanvasBtn = document.querySelector("#createBlankCanvasBtn");
const createColorCanvasBtn = document.querySelector("#createColorCanvasBtn");
const clearCurrentCanvasBtn = document.querySelector("#clearCurrentCanvasBtn");
const newCanvasWidth = document.querySelector("#newCanvasWidth");
const newCanvasHeight = document.querySelector("#newCanvasHeight");
const eraserSizePopover = document.querySelector("#eraserSizePopover");
const eraserSize = document.querySelector("#eraserSize");
const eraserSizeValue = document.querySelector("#eraserSizeValue");
const rotateLeftBtn = document.querySelector("#rotateLeftBtn");
const rotateRightBtn = document.querySelector("#rotateRightBtn");
const flipHorizontalBtn = document.querySelector("#flipHorizontalBtn");
const flipVerticalBtn = document.querySelector("#flipVerticalBtn");
const smoothEdgesBtn = document.querySelector("#smoothEdgesBtn");
placeCanvasToolButtons();
const addShadowBtn = document.querySelector("#addShadowBtn");
const shadowStrength = document.querySelector("#shadowStrength");
const shadowStrengthValue = document.querySelector("#shadowStrengthValue");
const shadowSize = document.querySelector("#shadowSize");
const shadowSizeValue = document.querySelector("#shadowSizeValue");
const addOutlineBtn = document.querySelector("#addOutlineBtn");
const outlineColor = document.querySelector("#outlineColor");
const outlineStrength = document.querySelector("#outlineStrength");
const outlineStrengthValue = document.querySelector("#outlineStrengthValue");
const iconifyResizeBtn = document.querySelector("#iconifyResizeBtn");
const iconifySizePreset = document.querySelector("#iconifySizePreset");
const iconifyCustomSize = document.querySelector("#iconifyCustomSize");
const iconifyWidth = document.querySelector("#iconifyWidth");
const iconifyHeight = document.querySelector("#iconifyHeight");
const iconifyKeepPadding = document.querySelector("#iconifyKeepPadding");
const centerCropBtn = document.querySelector("#centerCropBtn");
const cropWidth = document.querySelector("#cropWidth");
const cropHeight = document.querySelector("#cropHeight");
const squareGreenCrop = document.querySelector("#squareGreenCrop");
const selectAllBtn = document.querySelector("#selectAllBtn");
const clearSelectionBtn = document.querySelector("#clearSelectionBtn");
const imageList = document.querySelector("#imageList");
const batchCount = document.querySelector("#batchCount");
const frameCount = document.querySelector("#frameCount");
const frameList = document.querySelector("#frameList");
const alignFramesBtn = document.querySelector("#alignFramesBtn");
const playFramesBtn = document.querySelector("#playFramesBtn");
const exportFramesBtn = document.querySelector("#exportFramesBtn");
const exportZipBtn = document.querySelector("#exportZipBtn");
const exportSheetBtn = document.querySelector("#exportSheetBtn");
const deleteBlockBtn = document.querySelector("#deleteBlockBtn");
const applyAllFrameEffectsBtn = document.querySelector("#applyAllFrameEffectsBtn");
const selectAllFramesBtn = document.querySelector("#selectAllFramesBtn");
const clearFrameSelectionBtn = document.querySelector("#clearFrameSelectionBtn");
const openFramePickerBtn = document.querySelector("#openFramePickerBtn");
const findDuplicateFramesBtn = document.querySelector("#findDuplicateFramesBtn");
const removeWatermarkBtn = document.querySelector("#removeWatermarkBtn");
const clearSequenceBtn = document.querySelector("#clearSequenceBtn");
const framePicker = document.querySelector("#framePicker");
const framePickerGrid = document.querySelector("#framePickerGrid");
const framePickerInfo = document.querySelector("#framePickerInfo");
const closeFramePickerBtn = document.querySelector("#closeFramePickerBtn");
const pickerSelectAllBtn = document.querySelector("#pickerSelectAllBtn");
const pickerClearBtn = document.querySelector("#pickerClearBtn");
const pickerInvertBtn = document.querySelector("#pickerInvertBtn");
const fpsInput = document.querySelector("#fpsInput");
const frameDelayInput = document.querySelector("#frameDelayInput");
const sequenceCanvasBar = document.querySelector("#sequenceCanvasBar");
const sequenceFramePosition = document.querySelector("#sequenceFramePosition");
const sequenceProgressInput = document.querySelector("#sequenceProgressInput");
const sequencePlayerFrames = document.querySelector("#sequencePlayerFrames");
const previousSequenceFrameBtn = document.querySelector("#previousSequenceFrameBtn");
const nextSequenceFrameBtn = document.querySelector("#nextSequenceFrameBtn");
const copyCurrentFrameBtn = document.querySelector("#copyCurrentFrameBtn");
const openFramePickerFromBarBtn = document.querySelector("#openFramePickerFromBarBtn");
const videoFpsInput = document.querySelector("#videoFpsInput");
const defaultVideoExtractFps = 8;
const legacyVideoExtractStorageKeys = [
  "videoFpsInput",
  "videoFps",
  "image-tool-video-fps",
  "image-tool-video-settings"
];
const extractVideoBtn = document.querySelector("#extractVideoBtn");
const clearVideoBtn = document.querySelector("#clearVideoBtn");
const sheetCols = document.querySelector("#sheetCols");
const sheetRows = document.querySelector("#sheetRows");
const extractSheetBtn = document.querySelector("#extractSheetBtn");
const autoExtractSubjectsBtn = document.querySelector("#autoExtractSubjectsBtn");
const transparentAutoExtract = document.querySelector("#transparentAutoExtract");
const exportLocationName = document.querySelector("#exportLocationName");
const chooseExportLocationBtn = document.querySelector("#chooseExportLocationBtn");
const clearExportLocationBtn = document.querySelector("#clearExportLocationBtn");
const exportSizePreset = document.querySelector("#exportSizePreset");
const exportCustomSize = document.querySelector("#exportCustomSize");
const exportWidth = document.querySelector("#exportWidth");
const exportHeight = document.querySelector("#exportHeight");
const exportKeepPadding = document.querySelector("#exportKeepPadding");
const exportGreenScreen = document.querySelector("#exportGreenScreen");
const exportBaseName = document.querySelector("#exportBaseName");
const exportModeHint = document.querySelector("#exportModeHint");
const exportDialog = document.querySelector("#exportDialog");
const sheetAlignmentDialog = document.querySelector("#sheetAlignmentDialog");
const exportSheetAlignedBtn = document.querySelector("#exportSheetAlignedBtn");
const exportSheetOriginalBtn = document.querySelector("#exportSheetOriginalBtn");
const cancelSheetExportBtn = document.querySelector("#cancelSheetExportBtn");
const assetCount = document.querySelector("#assetCount");
const assetList = document.querySelector("#assetList");
const selectAllAssetsBtn = document.querySelector("#selectAllAssetsBtn");
const clearAssetSelectionBtn = document.querySelector("#clearAssetSelectionBtn");
const removeUnselectedAssetsBtn = document.querySelector("#removeUnselectedAssetsBtn");
const trimTransparentBtn = document.querySelector("#trimTransparentBtn");
const cleanPseudoAlphaBtn = document.querySelector("#cleanPseudoAlphaBtn");
const rebuildAlphaBtn = document.querySelector("#rebuildAlphaBtn");
const splitDualAlphaBtn = document.querySelector("#splitDualAlphaBtn");
const fillInternalPixelsBtn = document.querySelector("#fillInternalPixelsBtn");
const alphaWhiteSlot = document.querySelector("#alphaWhiteSlot");
const alphaBlackSlot = document.querySelector("#alphaBlackSlot");
const alphaWhitePreview = document.querySelector("#alphaWhitePreview");
const alphaBlackPreview = document.querySelector("#alphaBlackPreview");
const alphaWhiteName = document.querySelector("#alphaWhiteName");
const alphaBlackName = document.querySelector("#alphaBlackName");
const dualAlphaSourceSlot = document.querySelector("#dualAlphaSourceSlot");
const dualAlphaPreview = document.querySelector("#dualAlphaPreview");
const dualAlphaName = document.querySelector("#dualAlphaName");
const originalSourcePicker = document.querySelector("#originalSourcePicker");
const originalSourcePickerGrid = document.querySelector("#originalSourcePickerGrid");
const originalSourcePickerTitle = document.querySelector("#originalSourcePickerTitle");
const originalSourcePickerInfo = document.querySelector("#originalSourcePickerInfo");
const closeOriginalSourcePickerBtn = document.querySelector("#closeOriginalSourcePickerBtn");
const clearOriginalSourceChoiceBtn = document.querySelector("#clearOriginalSourceChoiceBtn");
const contourPixelUi = installContourPixelPanel();
const contourPixelizeBtn = contourPixelUi.applyBtn;
const contourPixelSizePreset = contourPixelUi.sizePreset;
const contourPixelCustomSize = contourPixelUi.customSize;
const contourPixelWidth = contourPixelUi.widthInput;
const contourPixelHeight = contourPixelUi.heightInput;
const contourPixelPaletteSize = contourPixelUi.paletteSize;
const contourPixelPadding = contourPixelUi.padding;
const contourPixelPaddingValue = contourPixelUi.paddingValue;
const contourPixelStrength = contourPixelUi.strength;
const contourPixelStrengthValue = contourPixelUi.strengthValue;
const contourPixelBgTolerance = contourPixelUi.backgroundTolerance;
const contourPixelBgToleranceValue = contourPixelUi.backgroundToleranceValue;
const contourPixelSamplingMode = contourPixelUi.samplingMode;
const contourPixelClusterCleanup = contourPixelUi.clusterCleanup;
const contourPixelClusterCleanupValue = contourPixelUi.clusterCleanupValue;
const contourPixelDetailProtection = contourPixelUi.detailProtection;
const contourPixelDetailProtectionValue = contourPixelUi.detailProtectionValue;
const contourPixelCleanInteriorBackground = contourPixelUi.cleanInteriorBackground;
const contourPixelSplitSubjects = contourPixelUi.splitSubjects;
const contourPixelOutline = contourPixelUi.outline;
const contourPixelBottomAnchor = contourPixelUi.bottomAnchor;

const contourPixelDefaultSize = "64";
const contourPixelLegacyStorageKeys = [
  "contourPixelSizePreset",
  "contourPixelWidth",
  "contourPixelHeight",
  "image-tool-contour-pixel-size",
  "image-tool-contour-pixel-settings"
];

function migrateContourPixelDefaultSize() {
  // V6 did not intentionally persist this panel, but browsers may restore dynamic form values
  // and older builds may have left localStorage entries behind. Migrate only the legacy 256 default.
  try {
    for (const key of contourPixelLegacyStorageKeys) {
      const stored = window.localStorage.getItem(key);
      if (stored === null) continue;
      if (stored === "256") {
        window.localStorage.setItem(key, contourPixelDefaultSize);
        continue;
      }
      if (stored.trim().startsWith("{")) {
        const parsed = JSON.parse(stored);
        let changed = false;
        for (const field of ["size", "preset", "width", "height", "targetSize"]) {
          if (String(parsed?.[field]) === "256") {
            parsed[field] = Number.isFinite(Number(parsed[field])) ? 64 : contourPixelDefaultSize;
            changed = true;
          }
        }
        if (changed) window.localStorage.setItem(key, JSON.stringify(parsed));
      }
    }
  } catch {}

  if (contourPixelSizePreset?.value === "256" || !contourPixelSizePreset?.value) {
    contourPixelSizePreset.value = contourPixelDefaultSize;
  }
  for (const input of [contourPixelWidth, contourPixelHeight]) {
    if (!input) continue;
    if (input.value === "256" || !Number.isFinite(Number(input.value))) input.value = contourPixelDefaultSize;
    input.defaultValue = contourPixelDefaultSize;
  }
}

migrateContourPixelDefaultSize();
window.addEventListener("pageshow", () => {
  migrateContourPixelDefaultSize();
  updateContourPixelControls();
});
window.setTimeout(() => {
  migrateContourPixelDefaultSize();
  updateContourPixelControls();
}, 0);

function migrateVideoExtractFpsDefault() {
  const migrateStorage = (storage) => {
    if (!storage) return;
    for (const key of legacyVideoExtractStorageKeys) {
      let stored = null;
      try { stored = storage.getItem(key); } catch { stored = null; }
      if (stored === null) continue;
      try {
        if (String(stored).trim() === "8") {
          storage.setItem(key, String(defaultVideoExtractFps));
          continue;
        }
        if (String(stored).trim().startsWith("{")) {
          const parsed = JSON.parse(stored);
          let changed = false;
          for (const field of ["fps", "frameRate", "videoFps", "extractFps", "value"]) {
            if (Number(parsed?.[field]) === 8) {
              parsed[field] = defaultVideoExtractFps;
              changed = true;
            }
          }
          if (changed) storage.setItem(key, JSON.stringify(parsed));
        }
      } catch {}
    }
  };

  try { migrateStorage(window.localStorage); } catch {}
  try { migrateStorage(window.sessionStorage); } catch {}
  if (!videoFpsInput) return;
  videoFpsInput.defaultValue = String(defaultVideoExtractFps);
  videoFpsInput.value = String(defaultVideoExtractFps);
  videoFpsInput.setAttribute("value", String(defaultVideoExtractFps));
}

migrateVideoExtractFpsDefault();
window.addEventListener("pageshow", migrateVideoExtractFpsDefault);

const exportAssetsZipBtn = document.querySelector("#exportAssetsZipBtn");
const clearAssetsBtn = document.querySelector("#clearAssetsBtn");
const autoNameAssets = document.querySelector("#autoNameAssets");
const removeRecognizedText = document.querySelector("#removeRecognizedText");
const ocrSelfTestBtn = document.querySelector("#ocrSelfTestBtn");
const ocrRuntimeHint = document.querySelector("#ocrRuntimeHint");
const renameImageBtn = document.querySelector("#renameImageBtn");
const addOriginalsToSequenceBtn = document.querySelector("#addOriginalsToSequenceBtn");
const renameAssetBtn = document.querySelector("#renameAssetBtn");
const addAssetsToSequenceBtn = document.querySelector("#addAssetsToSequenceBtn");
const sequenceImageInput = document.querySelector("#sequenceImageInput");
const normalizeFramesBtn = document.querySelector("#normalizeFramesBtn");
const saveFramesToResultsBtn = document.querySelector("#saveFramesToResultsBtn");
const processingSourceButtons = Array.from(document.querySelectorAll("[data-processing-source]"));
const imagePreviewModal = document.querySelector("#imagePreviewModal");
const imagePreviewImg = document.querySelector("#imagePreviewImg");
const imagePreviewTitle = document.querySelector("#imagePreviewTitle");
const closeImagePreviewBtn = document.querySelector("#closeImagePreviewBtn");
const operationBusyOverlay = document.querySelector("#operationBusyOverlay");
const operationBusyText = document.querySelector("#operationBusyText");

// Default safety options: transparent padding and every green-screen export option are OFF by default.
// Some browsers restore checkbox states after reload, so apply once now and once after page show.
function applySafeDefaultCheckboxes() {
  for (const checkbox of [iconifyKeepPadding, exportKeepPadding, exportGreenScreen, squareGreenCrop, autoNameAssets, removeRecognizedText]) {
    if (!checkbox) continue;
    checkbox.defaultChecked = false;
    checkbox.checked = false;
    checkbox.removeAttribute("checked");
  }
}
applySafeDefaultCheckboxes();
window.addEventListener("pageshow", applySafeDefaultCheckboxes);
window.setTimeout(applySafeDefaultCheckboxes, 0);
function hexToRgbColor(hex, alpha = 255) {
  const normalized = String(hex || '').trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    a: alpha
  };
}

function rgbColorToHex(color) {
  const toHex = (value) => Math.max(0, Math.min(255, Math.round(value || 0))).toString(16).padStart(2, '0');
  return `#${toHex(color?.r)}${toHex(color?.g)}${toHex(color?.b)}`;
}

function hsvToRgbColor(hue, saturation, value, alpha = 255) {
  const h = ((Number(hue) % 360) + 360) % 360;
  const s = Math.max(0, Math.min(1, Number(saturation) || 0));
  const v = Math.max(0, Math.min(1, Number(value) || 0));
  const chroma = v * s;
  const segment = h / 60;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (segment < 1) [r1, g1, b1] = [chroma, secondary, 0];
  else if (segment < 2) [r1, g1, b1] = [secondary, chroma, 0];
  else if (segment < 3) [r1, g1, b1] = [0, chroma, secondary];
  else if (segment < 4) [r1, g1, b1] = [0, secondary, chroma];
  else if (segment < 5) [r1, g1, b1] = [secondary, 0, chroma];
  else [r1, g1, b1] = [chroma, 0, secondary];
  const match = v - chroma;
  return {
    r: Math.round((r1 + match) * 255),
    g: Math.round((g1 + match) * 255),
    b: Math.round((b1 + match) * 255),
    a: alpha
  };
}

function rgbToHsvColor(color) {
  const r = Math.max(0, Math.min(255, Number(color?.r) || 0)) / 255;
  const g = Math.max(0, Math.min(255, Number(color?.g) || 0)) / 255;
  const b = Math.max(0, Math.min(255, Number(color?.b) || 0)) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  if (delta > 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  if (hue < 0) hue += 360;
  return {
    h: hue,
    s: max === 0 ? 0 : delta / max,
    v: max
  };
}

function drawBrushColorPalette() {
  if (!brushColorPalette || !brushColorPaletteCtx) return;
  const width = brushColorPalette.width;
  const height = brushColorPalette.height;
  const image = brushColorPaletteCtx.createImageData(width, height);
  for (let y = 0; y < height; y += 1) {
    const value = 1 - y / Math.max(1, height - 1);
    for (let x = 0; x < width; x += 1) {
      const saturation = x / Math.max(1, width - 1);
      const color = hsvToRgbColor(brushPaletteHue, saturation, value, 255);
      const index = (y * width + x) * 4;
      image.data[index] = color.r;
      image.data[index + 1] = color.g;
      image.data[index + 2] = color.b;
      image.data[index + 3] = 255;
    }
  }
  brushColorPaletteCtx.putImageData(image, 0, 0);
  const markerX = brushPaletteSaturation * (width - 1);
  const markerY = (1 - brushPaletteValue) * (height - 1);
  brushColorPaletteCtx.save();
  brushColorPaletteCtx.beginPath();
  brushColorPaletteCtx.arc(markerX, markerY, 7, 0, Math.PI * 2);
  brushColorPaletteCtx.lineWidth = 2;
  brushColorPaletteCtx.strokeStyle = brushPaletteValue > 0.55 ? '#111111' : '#ffffff';
  brushColorPaletteCtx.stroke();
  brushColorPaletteCtx.beginPath();
  brushColorPaletteCtx.arc(markerX, markerY, 9, 0, Math.PI * 2);
  brushColorPaletteCtx.lineWidth = 1;
  brushColorPaletteCtx.strokeStyle = brushPaletteValue > 0.55 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
  brushColorPaletteCtx.stroke();
  brushColorPaletteCtx.restore();
}

function updateBrushPalettePresentation() {
  const hex = rgbColorToHex(brushColor);
  if (brushPaletteColor && document.activeElement !== brushPaletteColor) brushPaletteColor.value = hex;
  if (brushPaletteHex) brushPaletteHex.value = hex.toUpperCase();
  if (brushPanelColorPreview) brushPanelColorPreview.style.background = hex;
  if (brushColorPreview) brushColorPreview.style.background = `rgba(${brushColor.r}, ${brushColor.g}, ${brushColor.b}, ${Math.max(0.25, (brushColor.a ?? 255) / 255)})`;
}

function syncBrushPaletteFromColor(options = {}) {
  const hsv = rgbToHsvColor(brushColor);
  if (hsv.s > 0.001 || options.forceHue) brushPaletteHue = hsv.h;
  brushPaletteSaturation = hsv.s;
  brushPaletteValue = hsv.v;
  if (brushHueRange && document.activeElement !== brushHueRange) brushHueRange.value = String(Math.round(brushPaletteHue));
  updateBrushPalettePresentation();
  drawBrushColorPalette();
}

function syncBrushPaletteControls() {
  syncBrushPaletteFromColor();
  if (brushPanelSize && brushSize) brushPanelSize.value = brushSize.value;
  if (brushPanelSizeValue && brushSize) brushPanelSizeValue.value = brushSize.value;
}

function setBrushColorFromPalettePoint(event) {
  if (!brushColorPalette) return false;
  const rect = brushColorPalette.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  brushPaletteSaturation = x / rect.width;
  brushPaletteValue = 1 - y / rect.height;
  brushColor = hsvToRgbColor(brushPaletteHue, brushPaletteSaturation, brushPaletteValue, brushColor.a ?? 255);
  updateBrushPalettePresentation();
  drawBrushColorPalette();
  setStatus(`已从常驻取色盘选择 ${rgbColorToHex(brushColor).toUpperCase()}。`);
  return true;
}


function clampCanvasDimension(value, fallback = 512) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(16, Math.min(4096, Math.round(numeric)));
}

function createSolidImageData(width, height, color = { r: 255, g: 255, b: 255, a: 255 }) {
  const imageData = new ImageData(width, height);
  const data = imageData.data;
  for (let index = 0; index < data.length; index += 4) {
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
    data[index + 3] = color.a;
  }
  return imageData;
}

function normalizeSolidColor(color, fallback = { r: 255, g: 255, b: 255, a: 255 }) {
  const source = color || fallback;
  return {
    r: Math.max(0, Math.min(255, Math.round(source.r ?? fallback.r))),
    g: Math.max(0, Math.min(255, Math.round(source.g ?? fallback.g))),
    b: Math.max(0, Math.min(255, Math.round(source.b ?? fallback.b))),
    a: Math.max(0, Math.min(255, Math.round(source.a ?? fallback.a ?? 255)))
  };
}

function createDrawingCanvasFromColor(fillColor = { r: 255, g: 255, b: 255, a: 255 }, options = {}) {
  const width = clampCanvasDimension(newCanvasWidth?.value, 512);
  const height = clampCanvasDimension(newCanvasHeight?.value, 512);
  if (newCanvasWidth) newCanvasWidth.value = String(width);
  if (newCanvasHeight) newCanvasHeight.value = String(height);
  const baseColor = normalizeSolidColor(fillColor);
  const imageData = createSolidImageData(width, height, baseColor);
  const colorHex = rgbColorToHex(baseColor).toUpperCase();
  const label = options.label || (colorHex === '#FFFFFF' ? '白色画布' : `${colorHex} 画布`);
  const asset = addProcessedAsset(imageData, label, "画布", {
    name: options.name || uniqueProcessedName(`${label}-${width}x${height}`, "画布"),
    sourceKind: "draw",
    selected: true,
    takeOwnership: true
  });
  if (!asset) return null;
  asset.canvasBaseColor = { ...baseColor };
  asset.canvasKind = 'solid';
  activateProcessedAsset(asset, { scrollToLatest: true });
  setClickMode("brush", { silent: true });
  updateRangeLabels();
  syncBrushPaletteFromColor();
  setStatus(options.status || `已添加 ${width}×${height} 的${colorHex === '#FFFFFF' ? '纯白' : colorHex}画布，可直接开始绘制。`);
  return asset;
}

function createBlankDrawingCanvas() {
  return createDrawingCanvasFromColor({ r: 255, g: 255, b: 255, a: 255 }, {
    label: '白色画布',
    status: `已添加 ${clampCanvasDimension(newCanvasWidth?.value, 512)}×${clampCanvasDimension(newCanvasHeight?.value, 512)} 的纯白画布，可直接开始绘制。`
  });
}

function createCurrentColorCanvas() {
  const color = normalizeSolidColor(brushColor, { r: 255, g: 255, b: 255, a: 255 });
  return createDrawingCanvasFromColor(color, {
    label: `${rgbColorToHex(color).toUpperCase()} 画布`,
    status: `已添加 ${clampCanvasDimension(newCanvasWidth?.value, 512)}×${clampCanvasDimension(newCanvasHeight?.value, 512)} 的 ${rgbColorToHex(color).toUpperCase()} 画布。`
  });
}

function clearCurrentDrawingCanvas() {
  const current = processingSource === 'result' ? activeLibraryTarget : null;
  if (!current || current.sourceKind !== 'draw') {
    setStatus('请先选中要清空的绘制画布。');
    return false;
  }
  const width = current.imageData?.width || 0;
  const height = current.imageData?.height || 0;
  if (!width || !height) {
    setStatus('当前画布尺寸无效，无法清空。');
    return false;
  }
  const baseColor = normalizeSolidColor(current.canvasBaseColor || { r: 255, g: 255, b: 255, a: 255 });
  pushHistory();
  const cleared = createSolidImageData(width, height, baseColor);
  current.imageData = cleared;
  current.previewImageData = null;
  current.thumbnail = makeThumbnail(cleared);
  currentImageData = cleared;
  originalImageData = cleared;
  liveBaseImageData = null;
  cropSelection = null;
  hideCropBox();
  clearLassoSelection();
  renderPreviewImageData(cleared);
  renderAssetList();
  renderWorkspaceTabs();
  setButtons();
  setStatus(`已清空当前画布“${current.name}”上的绘制内容，并恢复为原始底色。`);
  return true;
}

function positionBrushMagnifier(clientX, clientY) {
  brushMagnifier.style.left = `${clientX}px`;
  brushMagnifier.style.top = `${clientY}px`;
}

function hideBrushMagnifier() {
  brushMagnifier.hidden = true;
  brushMagnifier.classList.remove("visible");
}

function renderBrushMagnifier(point, client = brushLongPressClient) {
  if (!brushMagnifierCtx || !currentImageData || !point) return;
  const width = brushMagnifierCanvas.width;
  const height = brushMagnifierCanvas.height;
  const cells = 11;
  const cellW = width / cells;
  const cellH = height / cells;
  const centerX = Math.max(0, Math.min(currentImageData.width - 1, Math.floor(point.x)));
  const centerY = Math.max(0, Math.min(currentImageData.height - 1, Math.floor(point.y)));
  const data = currentImageData.data;
  brushMagnifierCtx.clearRect(0, 0, width, height);
  for (let gy = 0; gy < cells; gy += 1) {
    for (let gx = 0; gx < cells; gx += 1) {
      const sourceX = Math.max(0, Math.min(currentImageData.width - 1, centerX + gx - Math.floor(cells / 2)));
      const sourceY = Math.max(0, Math.min(currentImageData.height - 1, centerY + gy - Math.floor(cells / 2)));
      const idx = (sourceY * currentImageData.width + sourceX) * 4;
      const alpha = (data[idx + 3] ?? 255) / 255;
      brushMagnifierCtx.fillStyle = `rgba(${data[idx]}, ${data[idx + 1]}, ${data[idx + 2]}, ${Math.max(0.18, alpha)})`;
      brushMagnifierCtx.fillRect(gx * cellW, gy * cellH, cellW + 0.4, cellH + 0.4);
    }
  }
  brushMagnifierCtx.strokeStyle = 'rgba(17,17,17,0.12)';
  brushMagnifierCtx.lineWidth = 1;
  for (let line = 1; line < cells; line += 1) {
    brushMagnifierCtx.beginPath();
    brushMagnifierCtx.moveTo(line * cellW, 0);
    brushMagnifierCtx.lineTo(line * cellW, height);
    brushMagnifierCtx.stroke();
    brushMagnifierCtx.beginPath();
    brushMagnifierCtx.moveTo(0, line * cellH);
    brushMagnifierCtx.lineTo(width, line * cellH);
    brushMagnifierCtx.stroke();
  }
  const centerCellX = Math.floor(cells / 2) * cellW;
  const centerCellY = Math.floor(cells / 2) * cellH;
  brushMagnifierCtx.strokeStyle = 'rgba(20,122,114,0.96)';
  brushMagnifierCtx.lineWidth = 2;
  brushMagnifierCtx.strokeRect(centerCellX + 1, centerCellY + 1, cellW - 2, cellH - 2);
  brushMagnifier.hidden = false;
  brushMagnifier.classList.add("visible");
  if (client) positionBrushMagnifier(client.clientX, client.clientY);
}

function placeCanvasToolButtons() {
  if (!toolbar || !modeTabs) return;
  let canvasMainTools = document.querySelector("#canvasMainTools");
  if (!canvasMainTools) {
    canvasMainTools = document.createElement("div");
    canvasMainTools.id = "canvasMainTools";
    canvasMainTools.className = "canvas-main-tools";
    canvasMainTools.setAttribute("role", "group");
    canvasMainTools.setAttribute("aria-label", "常用工具");
    modeTabs.insertAdjacentElement("afterend", canvasMainTools);
  }
  const cancelButton = document.querySelector("#cancelToolBtn");
  const finishButton = document.querySelector("#finishToolBtn");
  const brushPopover = document.querySelector("#brushSizePopover");
  const eraserPopover = document.querySelector("#eraserSizePopover");
  const firstPopover = brushPopover || eraserPopover;
  const buttonLabels = [
    [pickModeBtn, "取背景色"],
    [extractModeBtn, "提取主体"],
    [cropModeBtn, "矩形裁剪"],
    [lassoModeBtn, "自由裁剪"],
    [cancelButton, "取消"],
    [finishButton, "完成"],
    [brushModeBtn, "画笔"],
    [eraserModeBtn, "橡皮擦"],
    [smoothEdgesBtn, "去锯齿/毛刺"]
  ];
  for (const [button, label] of buttonLabels) {
    if (!button) continue;
    button.textContent = label;
    canvasMainTools.insertBefore(button, firstPopover || null);
  }
  if (brushPopover && brushPopover.parentElement !== canvasMainTools) canvasMainTools.appendChild(brushPopover);
  if (eraserPopover && eraserPopover.parentElement !== canvasMainTools) canvasMainTools.appendChild(eraserPopover);
}


function installContourPixelPanel() {
  const empty = {
    applyBtn: null,
    sizePreset: null,
    customSize: null,
    widthInput: null,
    heightInput: null,
    paletteSize: null,
    padding: null,
    paddingValue: null,
    strength: null,
    strengthValue: null,
    backgroundTolerance: null,
    backgroundToleranceValue: null,
    samplingMode: null,
    clusterCleanup: null,
    clusterCleanupValue: null,
    detailProtection: null,
    detailProtectionValue: null,
    cleanInteriorBackground: null,
    splitSubjects: null,
    outline: null,
    bottomAnchor: null
  };
  const anchor = iconifyResizeBtn?.closest(".panel-section, .tool-section, .control-section, fieldset, section")
    || iconifyResizeBtn?.parentElement
    || toolbar;
  if (!anchor) return empty;

  if (!document.querySelector("#contourPixelStyle")) {
    const style = document.createElement("style");
    style.id = "contourPixelStyle";
    style.textContent = `
      .contour-pixel-panel { grid-column: 1 / -1; width: 100%; flex: 1 0 100%; margin-top: 10px; padding: 0; border: 1px solid color-mix(in srgb, currentColor 18%, transparent); border-radius: 10px; background: color-mix(in srgb, currentColor 4%, transparent); overflow: hidden; }
      .contour-pixel-panel > summary { cursor: pointer; user-select: none; padding: 10px 12px; font-weight: 700; list-style-position: inside; }
      .contour-pixel-body { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px 10px; padding: 0 12px 12px; }
      .contour-pixel-field { display: grid; gap: 5px; min-width: 0; }
      .contour-pixel-field.full { grid-column: 1 / -1; }
      .contour-pixel-field label, .contour-pixel-check { font-size: 12px; opacity: .9; }
      .contour-pixel-field select, .contour-pixel-field input[type="number"] { width: 100%; min-width: 0; }
      .contour-pixel-range-label { display: flex; justify-content: space-between; gap: 8px; }
      .contour-pixel-custom { display: none; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: center; }
      .contour-pixel-custom.active { display: grid; }
      .contour-pixel-checks { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; }
      .contour-pixel-note { grid-column: 1 / -1; margin: 0; font-size: 11px; line-height: 1.45; opacity: .72; }
      .contour-pixel-apply { grid-column: 1 / -1; width: 100%; font-weight: 700; }
      #canvas.contour-pixel-preview, #selectionCanvas.contour-pixel-preview { image-rendering: pixelated !important; image-rendering: crisp-edges !important; }
      @media (max-width: 760px) { .contour-pixel-body { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);
  }

  const panel = document.createElement("details");
  panel.id = "contourPixelPanel";
  panel.className = "contour-pixel-panel";
  panel.innerHTML = `
    <summary title="按主体比例重建轮廓与内部颜色，并自动完成背景清理、细节保护和像素簇整理。">主体比例像素化</summary>
    <div class="contour-pixel-body">
      <div class="contour-pixel-field">
        <label for="contourPixelSizePreset">目标尺寸</label>
        <select id="contourPixelSizePreset">
          <option value="32">32 × 32</option>
          <option value="48">48 × 48</option>
          <option value="64" selected>64 × 64</option>
          <option value="96">96 × 96</option>
          <option value="128">128 × 128</option>
          <option value="256">256 × 256</option>
          <option value="custom">自定义</option>
        </select>
        <div id="contourPixelCustomSize" class="contour-pixel-custom">
          <input id="contourPixelWidth" type="number" min="8" max="512" value="64" aria-label="像素化宽度">
          <span>×</span>
          <input id="contourPixelHeight" type="number" min="8" max="512" value="64" aria-label="像素化高度">
        </div>
      </div>
      <div class="contour-pixel-field">
        <label for="contourPixelPaletteSize">颜色数量</label>
        <select id="contourPixelPaletteSize">
          <option value="8">8 色 · 极简</option>
          <option value="12">12 色</option>
          <option value="16">16 色 · 简洁</option>
          <option value="24">24 色 · 平衡</option>
          <option value="32" selected>32 色 · 推荐</option>
        </select>
      </div>
      <div class="contour-pixel-checks full">
        <label class="contour-pixel-check" title="适用于三视图、序列人物或一张图中存在多个互不相连主体的情况。"><input id="contourPixelSplitSubjects" type="checkbox"> 多个主体分别处理</label>
      </div>
      <p class="contour-pixel-note">不透明图片会保留完整画面进行像素化；需要去除背景时，请先使用抠图功能。透明素材仍会按主体轮廓整理，并自动清理孤立像素和外轮廓凸起色块。</p>
      <button id="contourPixelizeBtn" type="button" class="contour-pixel-apply">转换为像素风</button>
    </div>
  `;

  anchor.appendChild(panel);
  const applyBtn = panel.querySelector("#contourPixelizeBtn");
  if (iconifyResizeBtn?.className) applyBtn.className += ` ${iconifyResizeBtn.className}`;

  return {
    applyBtn,
    sizePreset: panel.querySelector("#contourPixelSizePreset"),
    customSize: panel.querySelector("#contourPixelCustomSize"),
    widthInput: panel.querySelector("#contourPixelWidth"),
    heightInput: panel.querySelector("#contourPixelHeight"),
    paletteSize: panel.querySelector("#contourPixelPaletteSize"),
    padding: panel.querySelector("#contourPixelPadding"),
    paddingValue: panel.querySelector("#contourPixelPaddingValue"),
    strength: panel.querySelector("#contourPixelStrength"),
    strengthValue: panel.querySelector("#contourPixelStrengthValue"),
    backgroundTolerance: panel.querySelector("#contourPixelBgTolerance"),
    backgroundToleranceValue: panel.querySelector("#contourPixelBgToleranceValue"),
    samplingMode: panel.querySelector("#contourPixelSamplingMode"),
    clusterCleanup: panel.querySelector("#contourPixelClusterCleanup"),
    clusterCleanupValue: panel.querySelector("#contourPixelClusterCleanupValue"),
    detailProtection: panel.querySelector("#contourPixelDetailProtection"),
    detailProtectionValue: panel.querySelector("#contourPixelDetailProtectionValue"),
    cleanInteriorBackground: panel.querySelector("#contourPixelCleanInteriorBackground"),
    splitSubjects: panel.querySelector("#contourPixelSplitSubjects"),
    outline: panel.querySelector("#contourPixelOutline"),
    bottomAnchor: panel.querySelector("#contourPixelBottomAnchor")
  };
}

let images = [];
let sequenceFrames = [];
let assetLibrary = [];
let processingSource = "original";
let assetCounter = 0;
let exportDirectoryHandle = null;
const ocrWorkerPromises = new Map();
let ocrQueue = Promise.resolve();
let frameSelectionOrder = 0;
let draggedFrameIndexes = [];
let frameDragJustFinished = false;
let loadedVideo = null;
let loadedVideoUrl = "";
let loadedVideoName = "";
let alphaWhiteImage = null;
let alphaBlackImage = null;
let dualAlphaSourceItem = null;
let originalSourcePickerMode = null;
let activeIndex = -1;
let activeFrameIndex = -1;
let activeLibraryTarget = null;
let workspaceTabs = [];
let activeWorkspaceTabId = "";
let workspaceTabCounter = 0;
let originalImageData = null;
let currentImageData = null;
let liveBaseImageData = null;
let history = [];
let redoStack = [];
let pickedColors = [];
let showOriginal = false;
let scale = 1;
let zoomLevel = 1;
let canvasLayoutFrame = 0;
let liveRenderTimer = null;
let clickMode = "view";
let cropSelection = null;
let lassoSelection = [];
let cropDragStart = null;
let lassoDrawing = false;
let eraserDrawing = false;
let eraserPreviewPoint = null;
let lastEraserPoint = null;
let brushDrawing = false;
let brushErasing = false;
let brushPreviewPoint = null;
let lastBrushPoint = null;
let brushPointerId = null;
let brushLongPressTimer = null;
let brushLongPressPoint = null;
let brushLongPressMoved = false;
let brushLongPressActive = false;
let brushLongPressClient = null;
let brushPickHideTimer = null;
let shadowEditor = null;
let shadowDragging = false;
let shadowDragOffset = null;
let toolSession = null;
let toolItemDragging = false;
let toolItemDragOffset = null;
let toolItemPointerHandled = false;
let toolSessionCounter = 0;
let canvasBackgroundMode = "checker";
let didCropDrag = false;
let playbackTimer = null;
let playbackIndex = 0;
let playbackPreviewFrameIndex = -1;
let previewJobToken = 0;
let previewJobBusy = false;
let pendingLivePreview = false;
let operationBusy = false;
let brushColor = { r: 34, g: 34, b: 34, a: 255 };
let brushPaletteHue = 0;
let brushPaletteSaturation = 0;
let brushPaletteValue = 34 / 255;
let brushPaletteDragging = false;
let activeLibraryKind = "original";
const librarySelectionAnchor = { original: -1, result: -1, sequence: -1 };
const libraryBatchSelectionMode = { original: false, result: false, sequence: false };
let outlinePreviewBaseImageData = null;
let outlinePreviewProxyImageData = null;
let outlinePreviewTarget = null;
let outlinePreviewTimer = null;
let outlinePreviewUsingProxy = false;
let outlinePreviewActive = false;
let outlineTransparencyCache = new WeakMap();
let liveDistanceCacheBySource = new WeakMap();
let livePreviewProxySource = null;
let livePreviewProxyImageData = null;
let livePreviewProxyPixelLimit = 0;
let livePreviewFullTimer = null;
let livePreviewFullBase = null;
let livePreviewFullKey = "";
let livePreviewFullImageData = null;
let livePreviewFastImageData = null;
let livePreviewSourceTarget = null;
let contiguousWorkspace = null;
let cutoutWorker = null;
let cutoutWorkerUrl = "";
let cutoutWorkerRequestId = 0;
const cutoutWorkerPending = new Map();

const maxCanvasSide = 3200;
const livePreviewDelayMs = 8;
const livePreviewFastPixelLimit = 420000;
const outlinePreviewFastPixelLimit = 36000;
const cutoutWorkerPixelThreshold = 260000;
// The full multi-pass transparent-edge cleanup is intentionally reserved for smaller images.
// On megapixel sources it performs several large neighbourhood scans and can lock the page.
const fullCutoutCleanupPixelLimit = 520000;
const exportSettingsDbName = "cutout-tool-settings";
const exportSettingsStoreName = "settings";
const maxHistoryStates = 12;
const maxRedoStates = 12;
const workspaceMemoryPolicy = memoryPolicy(navigator.deviceMemory || 4);
const feedbackEndpoint = "https://formsubmit.co/ajax/84618558@qq.com";
const feedbackCooldownMs = 60 * 1000;
let memoryLimitAcknowledged = false;

function pushBoundedState(stack, state, limit) {
  stack.push(state);
  if (stack.length > limit) stack.splice(0, stack.length - limit);
}

function setStatus(message) {
  statusText.textContent = message;
}

function workspaceMemoryReport() {
  return estimateWorkspaceBytes({
    images,
    sequenceFrames,
    assetLibrary,
    history,
    redoStack,
    originalImageData,
    currentImageData,
    liveBaseImageData
  });
}

function updateMemoryIndicator() {
  const report = workspaceMemoryReport();
  const level = memoryPressureLevel(report.totalBytes, workspaceMemoryPolicy);
  if (level === "normal") memoryLimitAcknowledged = false;
  if (level !== "critical" || memoryLimitAcknowledged || !memoryLimitDialog) return;
  if (memoryLimitMessage) {
    memoryLimitMessage.textContent = `当前工作区约占用 ${formatBytes(report.totalBytes)}。请先清理未使用的处理结果、原图或序列帧，再继续导入或处理图片。`;
  }
  memoryLimitDialog.hidden = false;
  syncModalOpenClass();
}

function compactHistoryForMemory() {
  let report = workspaceMemoryReport();
  while (history.length > 3 && report.totalBytes > workspaceMemoryPolicy.softLimitBytes) {
    history.shift();
    report = workspaceMemoryReport();
  }
  while (redoStack.length > 2 && report.totalBytes > workspaceMemoryPolicy.softLimitBytes) {
    redoStack.shift();
    report = workspaceMemoryReport();
  }
  updateMemoryIndicator();
}

let exportSuccessToastTimer = null;

function syncModalOpenClass() {
  const hasOpenModal = Boolean(document.querySelector(
    ".app-modal:not([hidden]), .image-preview-modal:not([hidden]), .frame-picker:not([hidden])"
  ));
  document.body.classList.toggle("modal-open", hasOpenModal);
}

function setCommunityDialogOpen(dialog, open) {
  if (!dialog) return;
  dialog.hidden = !open;
  syncModalOpenClass();
  if (open) {
    window.setTimeout(() => {
      dialog.querySelector("textarea, input:not([type='hidden']), select, button")?.focus();
    }, 0);
  }
}

function closeFeedbackDialog() {
  setCommunityDialogOpen(feedbackDialog, false);
}

function closeDonationDialog() {
  setCommunityDialogOpen(donationDialog, false);
}

function closeMemoryLimitDialog() {
  memoryLimitAcknowledged = true;
  setCommunityDialogOpen(memoryLimitDialog, false);
}

function feedbackCooldownRemaining() {
  try {
    const lastSubmitted = Number(localStorage.getItem("imageStudioLastFeedbackAt")) || 0;
    return Math.max(0, feedbackCooldownMs - (Date.now() - lastSubmitted));
  } catch {
    return 0;
  }
}

function rememberFeedbackSubmission() {
  try {
    localStorage.setItem("imageStudioLastFeedbackAt", String(Date.now()));
  } catch {
    // Private browsing can reject localStorage; the successful submission still counts.
  }
}

function feedbackPayload() {
  const category = String(feedbackCategory?.value || "其他").trim();
  const message = String(feedbackMessage?.value || "").trim();
  const contact = String(feedbackContact?.value || "").trim();
  return {
    message,
    fields: {
      _subject: `图片处理工具｜${category}`,
      _template: "table",
      _captcha: "false",
      "反馈类型": category,
      "留言内容": message,
      "联系方式": contact || "未填写",
      "来源页面": window.location.href,
      "提交时间": new Date().toLocaleString("zh-CN")
    }
  };
}

function feedbackFailureMessage(error) {
  if (error?.name === "AbortError") {
    return "提交超时。你可以稍后重试，或使用下方备用入口。";
  }
  const detail = String(error?.message || "");
  if (/needs activation|activate form|activation/i.test(detail)) {
    return "留言通道尚未激活。作者需要先在邮箱中点击“Activate Form”，激活后即可提交。";
  }
  if (/web server|browsed as html files/i.test(detail)) {
    return "邮件服务没有识别当前网页来源。请刷新网页后重试，或使用下方备用入口。";
  }
  return "自动提交没有成功。你可以稍后重试，或使用下方备用入口。";
}

function submitFeedbackInNewPage() {
  const { message, fields } = feedbackPayload();
  if (message.length < 10) {
    feedbackSubmitStatus.textContent = "请至少填写 10 个字，方便作者理解你的反馈。";
    feedbackMessage?.focus();
    return;
  }
  const fallbackForm = document.createElement("form");
  fallbackForm.action = "https://formsubmit.co/84618558@qq.com";
  fallbackForm.method = "POST";
  fallbackForm.target = "_blank";
  fallbackForm.hidden = true;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    fallbackForm.append(input);
  }
  document.body.append(fallbackForm);
  fallbackForm.submit();
  fallbackForm.remove();
  feedbackSubmitStatus.textContent = "已打开备用提交页面，请按页面提示完成提交。";
}

async function submitFeedback(event) {
  event.preventDefault();
  const { message, fields } = feedbackPayload();
  const honey = String(feedbackHoney?.value || "").trim();
  if (honey) {
    closeFeedbackDialog();
    return;
  }
  if (message.length < 10) {
    feedbackSubmitStatus.textContent = "请至少填写 10 个字，方便作者理解你的反馈。";
    feedbackMessage?.focus();
    return;
  }
  const cooldown = feedbackCooldownRemaining();
  if (cooldown > 0) {
    feedbackSubmitStatus.textContent = `请稍等 ${Math.ceil(cooldown / 1000)} 秒后再提交。`;
    return;
  }

  submitFeedbackBtn.disabled = true;
  submitFeedbackBtn.textContent = "正在提交…";
  feedbackSubmitStatus.textContent = "正在安全转发留言，请稍候…";
  if (feedbackFallbackBtn) feedbackFallbackBtn.hidden = true;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(feedbackEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(fields),
      signal: controller.signal
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error(result.message || "feedback service unavailable");
    }
    rememberFeedbackSubmission();
    feedbackForm.reset();
    if (feedbackMessageCount) feedbackMessageCount.textContent = "0";
    feedbackSubmitStatus.textContent = "留言已提交。感谢你的反馈！";
    setStatus("反馈已提交，将直接发送到作者邮箱。");
    window.setTimeout(closeFeedbackDialog, 1400);
  } catch (error) {
    feedbackSubmitStatus.textContent = feedbackFailureMessage(error);
    if (feedbackFallbackBtn) feedbackFallbackBtn.hidden = false;
  } finally {
    window.clearTimeout(timeout);
    submitFeedbackBtn.disabled = false;
    submitFeedbackBtn.textContent = "提交留言";
  }
}

function showExportSuccessToast(message) {
  let toast = document.querySelector("#exportSuccessToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "exportSuccessToast";
    toast.className = "export-success-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("visible");
  void toast.offsetWidth;
  toast.classList.add("visible");
  window.clearTimeout(exportSuccessToastTimer);
  exportSuccessToastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function finishExportSuccess(message) {
  const detail = String(message || "文件已保存。");
  setStatus(`导出成功：${detail}`);
  if (exportDialog) exportDialog.hidden = true;
  syncModalOpenClass();
  showExportSuccessToast(`导出成功 · ${detail}`);
}

function setCanvasBackground(mode, color = customBgColor.value) {
  canvasBackgroundMode = mode;
  stage.classList.toggle("solid-bg", mode !== "checker");
  const colors = {
    checker: "#ffffff",
    dark: "#050505",
    light: "#ffffff",
    green: "#00ff00",
    custom: color
  };
  stage.style.setProperty("--canvas-bg", colors[mode] || color || "#ffffff");
  checkerBgBtn.classList.toggle("active", mode === "checker");
  darkBgBtn.classList.toggle("active", mode === "dark");
  lightBgBtn.classList.toggle("active", mode === "light");
  greenBgBtn.classList.toggle("active", mode === "green");
}

function openExportSettingsDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(exportSettingsDbName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(exportSettingsStoreName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveExportDirectoryHandle(handle) {
  const db = await openExportSettingsDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(exportSettingsStoreName, "readwrite");
    transaction.objectStore(exportSettingsStoreName).put(handle, "exportDirectory");
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function removeSavedExportDirectoryHandle() {
  const db = await openExportSettingsDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(exportSettingsStoreName, "readwrite");
    transaction.objectStore(exportSettingsStoreName).delete("exportDirectory");
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function restoreExportDirectoryHandle() {
  try {
    const db = await openExportSettingsDb();
    const handle = await new Promise((resolve, reject) => {
      const request = db.transaction(exportSettingsStoreName).objectStore(exportSettingsStoreName).get("exportDirectory");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    if (!handle) return;
    exportDirectoryHandle = handle;
    const permission = await handle.queryPermission({ mode: "readwrite" });
    exportLocationName.value = permission === "granted" ? handle.name : `${handle.name}（导出时授权）`;
    exportLocationName.title = `当前导出位置：${handle.name}`;
    setButtons();
  } catch (error) {
    exportDirectoryHandle = null;
  }
}

function cloneImageData(imageData) {
  return new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
}

function cloneOptionalImageData(imageData) {
  return imageData ? cloneImageData(imageData) : null;
}

const fullResolutionRecipeKinds = new Set([
  "rotate",
  "flip",
  "smoothEdges",
  "shadow",
  "outline",
  "trimTransparent",
  "cleanPseudoAlpha",
  "fillInternalPixels",
  "cutout"
]);

function cloneRecipeValue(value) {
  if (value == null || typeof value !== "object") return value ?? null;
  if (Array.isArray(value)) return value.map(cloneRecipeValue);
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneRecipeValue(entry)]));
}

function cloneFullResolutionPipeline(pipeline) {
  return Array.isArray(pipeline)
    ? pipeline.map((recipe) => ({ kind: recipe.kind, value: cloneRecipeValue(recipe.value) }))
    : [];
}

function derivedFullResolutionOptions(record, operation, value = null) {
  if (!record?.fullResolutionSource || !fullResolutionRecipeKinds.has(operation)) {
    return { fullResolutionSource: null, fullResolutionPipeline: [] };
  }
  return {
    fullResolutionSource: record.fullResolutionSource,
    fullResolutionPipeline: [
      ...cloneFullResolutionPipeline(record.fullResolutionPipeline),
      { kind: operation, value: cloneRecipeValue(value) }
    ]
  };
}

function appendFullResolutionRecipe(target, kind, value = null) {
  if (!target?.fullResolutionSource || !fullResolutionRecipeKinds.has(kind)) return false;
  target.fullResolutionPipeline = [
    ...cloneFullResolutionPipeline(target.fullResolutionPipeline),
    { kind, value: cloneRecipeValue(value) }
  ];
  return true;
}

function invalidateFullResolutionSource(target) {
  if (!target) return;
  target.fullResolutionSource = null;
  target.fullResolutionPipeline = [];
}

function cloneSequencePlacement(placement) {
  if (!placement) return null;
  const canvasWidth = Math.round(Number(placement.canvasWidth));
  const canvasHeight = Math.round(Number(placement.canvasHeight));
  const offsetX = Math.round(Number(placement.offsetX));
  const offsetY = Math.round(Number(placement.offsetY));
  if (!Number.isFinite(canvasWidth) || !Number.isFinite(canvasHeight) || canvasWidth < 1 || canvasHeight < 1) return null;
  if (!Number.isFinite(offsetX) || !Number.isFinite(offsetY)) return null;
  return {
    canvasWidth,
    canvasHeight,
    offsetX,
    offsetY,
    sourceOffsetX: Number.isFinite(Number(placement.sourceOffsetX)) ? Math.round(Number(placement.sourceOffsetX)) : offsetX,
    sourceOffsetY: Number.isFinite(Number(placement.sourceOffsetY)) ? Math.round(Number(placement.sourceOffsetY)) : offsetY,
    sourceKind: String(placement.sourceKind || "extract")
  };
}

function canvasSnapshotState() {
  // ImageData objects are immutable at the library/state level: every editor operation
  // creates a replacement buffer. History can therefore share pixel buffers and copy
  // only metadata, avoiding a full megapixel clone before every click.
  return {
    originalImageData,
    currentImageData,
    liveBaseImageData,
    pickedColors: pickedColors.map((color) => ({ ...color }))
  };
}


function clampContourPixelDimension(value, fallback = 64) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(8, Math.min(512, Math.round(number)));
}

function updateContourPixelControls() {
  if (!contourPixelSizePreset) return;
  contourPixelCustomSize?.classList.toggle("active", contourPixelSizePreset.value === "custom");
  if (contourPixelPaddingValue) contourPixelPaddingValue.value = `${Number(contourPixelPadding?.value || 0)}%`;
  if (contourPixelStrengthValue) contourPixelStrengthValue.value = String(Number(contourPixelStrength?.value || 0));
  if (contourPixelClusterCleanupValue) contourPixelClusterCleanupValue.value = String(Number(contourPixelClusterCleanup?.value || 0));
  if (contourPixelDetailProtectionValue) contourPixelDetailProtectionValue.value = String(Number(contourPixelDetailProtection?.value || 0));
  if (contourPixelBgToleranceValue) contourPixelBgToleranceValue.value = String(Number(contourPixelBgTolerance?.value || 0));
}

const contourPixelDefaults = Object.freeze({
  paddingPercent: 4,
  contourStrength: 82,
  clusterCleanup: 45,
  detailProtection: 60,
  backgroundTolerance: 42,
  samplingMode: "dominant",
  cleanInteriorBackground: true,
  preserveOpaqueCanvas: true,
  darkOutline: false,
  bottomAnchor: true
});

function currentContourPixelOptions() {
  const preset = contourPixelSizePreset?.value || "64";
  const width = preset === "custom"
    ? clampContourPixelDimension(contourPixelWidth?.value, 64)
    : clampContourPixelDimension(preset, 64);
  const height = preset === "custom"
    ? clampContourPixelDimension(contourPixelHeight?.value, 64)
    : clampContourPixelDimension(preset, 64);
  return {
    width,
    height,
    paletteSize: Math.max(2, Math.min(48, Math.round(Number(contourPixelPaletteSize?.value) || 32))),
    paddingPercent: contourPixelDefaults.paddingPercent,
    contourStrength: contourPixelDefaults.contourStrength,
    clusterCleanup: contourPixelDefaults.clusterCleanup,
    detailProtection: contourPixelDefaults.detailProtection,
    backgroundTolerance: contourPixelDefaults.backgroundTolerance,
    samplingMode: contourPixelDefaults.samplingMode,
    cleanInteriorBackground: contourPixelDefaults.cleanInteriorBackground,
    preserveOpaqueCanvas: contourPixelDefaults.preserveOpaqueCanvas,
    splitSubjects: contourPixelSplitSubjects?.checked === true,
    darkOutline: contourPixelDefaults.darkOutline,
    bottomAnchor: contourPixelDefaults.bottomAnchor
  };
}

function weightedColorDistanceSquared(r, g, b, reference) {
  const dr = r - reference.r;
  const dg = g - reference.g;
  const db = b - reference.b;
  return dr * dr * 0.30 + dg * dg * 0.59 + db * db * 0.11;
}

function colorSaturation01(color) {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  return max <= 0 ? 0 : (max - min) / max;
}

function colorLuma(color) {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
}

function borderColorModels(imageData) {
  const { width, height, data } = imageData;
  const buckets = new Map();
  const band = Math.max(1, Math.min(10, Math.round(Math.min(width, height) * 0.018)));
  const step = Math.max(1, Math.floor(Math.min(width, height) / 280));
  const add = (x, y) => {
    const index = (y * width + x) * 4;
    if (data[index + 3] < 220) return;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const key = `${r >> 4},${g >> 4},${b >> 4}`;
    const bucket = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    bucket.count += 1;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    buckets.set(key, bucket);
  };
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (x < band || y < band || x >= width - band || y >= height - band) add(x, y);
    }
  }
  const sorted = Array.from(buckets.values()).sort((left, right) => right.count - left.count);
  if (sorted.length === 0) return [{ r: 255, g: 255, b: 255, count: 1 }];
  const minimum = Math.max(2, sorted[0].count * 0.035);
  return sorted
    .filter((bucket) => bucket.count >= minimum)
    .slice(0, 8)
    .map((bucket) => ({
      r: Math.round(bucket.r / bucket.count),
      g: Math.round(bucket.g / bucket.count),
      b: Math.round(bucket.b / bucket.count),
      count: bucket.count
    }));
}

function distanceToBackgroundModelsSquared(r, g, b, models) {
  let best = Infinity;
  for (const model of models) {
    best = Math.min(best, weightedColorDistanceSquared(r, g, b, model));
  }
  return best;
}

function labelMaskComponents(mask, width, height) {
  const total = width * height;
  const labels = new Int32Array(total);
  const queue = new Int32Array(total);
  const components = [];
  let label = 0;
  for (let start = 0; start < total; start += 1) {
    if (!mask[start] || labels[start]) continue;
    label += 1;
    let head = 0;
    let tail = 0;
    let area = 0;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    labels[start] = label;
    queue[tail++] = start;
    while (head < tail) {
      const pixel = queue[head++];
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      area += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const next = ny * width + nx;
          if (!mask[next] || labels[next]) continue;
          labels[next] = label;
          queue[tail++] = next;
        }
      }
    }
    components.push({
      label,
      area,
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    });
  }
  return { labels, components };
}

function cleanMaskComponents(mask, width, height) {
  const labeled = labelMaskComponents(mask, width, height);
  if (labeled.components.length === 0) return labeled;
  const largest = labeled.components.reduce((best, item) => Math.max(best, item.area), 0);
  const minimumArea = Math.max(2, Math.round(largest * 0.0012), Math.round(width * height * 0.000004));
  const keep = new Uint8Array(labeled.components.length + 1);
  for (const component of labeled.components) {
    if (component.area >= minimumArea) keep[component.label] = 1;
  }
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    if (mask[pixel] && !keep[labeled.labels[pixel]]) mask[pixel] = 0;
  }
  return labelMaskComponents(mask, width, height);
}

function buildContourSubjectMask(imageData, options) {
  const { width, height, data } = imageData;
  const total = width * height;
  const mask = new Uint8Array(total);
  let transparentCount = 0;
  for (let index = 3; index < data.length; index += 4) {
    if (data[index] < 245) transparentCount += 1;
  }

  let mode = "alpha";
  let backgroundModels = [];
  let edgeTexture = { meanDelta: 0, activeFraction: 0, samples: 0 };
  if (transparentCount >= Math.max(4, Math.round(total * 0.001))) {
    const alphaThreshold = Math.max(8, Math.round(34 - options.contourStrength * 0.18));
    for (let pixel = 0; pixel < total; pixel += 1) {
      mask[pixel] = data[pixel * 4 + 3] > alphaThreshold ? 1 : 0;
    }
  } else if (shouldUseOpaqueFullFrame({
    transparentPixels: transparentCount,
    totalPixels: total,
    preserveOpaqueCanvas: options.preserveOpaqueCanvas
  })) {
    mode = "full-opaque";
    for (let pixel = 0; pixel < total; pixel += 1) {
      if (data[pixel * 4 + 3] > 16) mask[pixel] = 1;
    }
  } else {
    mode = "edge-background";
    edgeTexture = measureOpaqueEdgeTexture(imageData);
    backgroundModels = borderColorModels(imageData);
    const background = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0;
    let tail = 0;
    const outerLimit = options.backgroundTolerance * options.backgroundTolerance;
    const innerTolerance = Math.max(5, options.backgroundTolerance * 0.78);
    const innerLimit = innerTolerance * innerTolerance;
    const distanceAt = (pixel) => {
      const index = pixel * 4;
      return distanceToBackgroundModelsSquared(data[index], data[index + 1], data[index + 2], backgroundModels);
    };
    const qualifies = (pixel) => data[pixel * 4 + 3] > 16 && distanceAt(pixel) <= outerLimit;
    const seed = (pixel) => {
      if (background[pixel] || !qualifies(pixel)) return;
      background[pixel] = 1;
      queue[tail++] = pixel;
    };
    for (let x = 0; x < width; x += 1) {
      seed(x);
      if (height > 1) seed((height - 1) * width + x);
    }
    for (let y = 1; y < height - 1; y += 1) {
      seed(y * width);
      if (width > 1) seed(y * width + width - 1);
    }
    while (head < tail) {
      const pixel = queue[head++];
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      const visit = (next) => {
        if (background[next] || !qualifies(next)) return;
        background[next] = 1;
        queue[tail++] = next;
      };
      if (x > 0) visit(pixel - 1);
      if (x + 1 < width) visit(pixel + 1);
      if (y > 0) visit(pixel - width);
      if (y + 1 < height) visit(pixel + width);
    }
    let subjectCount = 0;
    for (let pixel = 0; pixel < total; pixel += 1) {
      const index = pixel * 4;
      if (data[index + 3] <= 18) continue;
      const interiorBackground = options.cleanInteriorBackground && distanceAt(pixel) <= innerLimit;
      if (!background[pixel] && !interiorBackground) {
        mask[pixel] = 1;
        subjectCount += 1;
      }
    }
    if (subjectCount < Math.max(4, total * 0.0005)) {
      mask.fill(1);
      mode = "full";
    }
  }

  let labeled = cleanMaskComponents(mask, width, height);
  if (mode === "edge-background") {
    let subjectPixels = 0;
    for (let pixel = 0; pixel < mask.length; pixel += 1) subjectPixels += mask[pixel];
    if (shouldPreserveOpaqueFullFrame({
      subjectPixels,
      totalPixels: total,
      backgroundModels,
      edgeTexture
    })) {
      mask.fill(1);
      mode = "full-texture";
      backgroundModels = [];
      labeled = labelMaskComponents(mask, width, height);
    }
  }
  return { mask, mode, backgroundModels, edgeTexture, labels: labeled.labels, components: labeled.components };
}

function maskPixelBounds(mask, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) {
    return { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1, width, height };
  }
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function cleanupContourPixelCells(cells, width, height, strength = 55) {
  if (strength <= 0) return;
  const source = cells.slice();
  const minimumNeighbors = strength >= 75 ? 2 : 1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (!source[index]) continue;
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (source[ny * width + nx]) neighbors += 1;
        }
      }
      if (neighbors < minimumNeighbors) cells[index] = null;
    }
  }
}

function weightedMedianFromHistogram(histogram, totalWeight) {
  const target = totalWeight / 2;
  let running = 0;
  for (let index = 0; index < histogram.length; index += 1) {
    running += histogram[index];
    if (running >= target) return index;
  }
  return 0;
}

function sourcePixelLocalContrast(imageData, mask, x, y) {
  const { width, height, data } = imageData;
  const pixel = y * width + x;
  if (!mask[pixel]) return 0;
  const index = pixel * 4;
  const base = { r: data[index], g: data[index + 1], b: data[index + 2] };
  let contrast = 0;
  let comparisons = 0;
  const compare = (nx, ny) => {
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) return;
    const nextPixel = ny * width + nx;
    if (!mask[nextPixel]) return;
    const nextIndex = nextPixel * 4;
    const distance = Math.sqrt(weightedColorDistanceSquared(
      base.r,
      base.g,
      base.b,
      { r: data[nextIndex], g: data[nextIndex + 1], b: data[nextIndex + 2] }
    ));
    contrast += distance;
    comparisons += 1;
  };
  compare(x - 1, y);
  compare(x + 1, y);
  compare(x, y - 1);
  compare(x, y + 1);
  return comparisons > 0 ? contrast / comparisons : 0;
}

function mixContourColors(base, detail, amount) {
  const t = Math.max(0, Math.min(1, amount));
  return {
    r: Math.round(base.r * (1 - t) + detail.r * t),
    g: Math.round(base.g * (1 - t) + detail.g * t),
    b: Math.round(base.b * (1 - t) + detail.b * t)
  };
}

function sampleContourCellColor(imageData, mask, sx0, sy0, sx1, sy1, samplingMode, backgroundModels = [], backgroundTolerance = 42, suppressBackgroundSpill = true, detailProtection = 60) {
  const { width, data } = imageData;
  let samples = 0;
  let covered = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  let alphaWeight = 0;
  let confidenceWeight = 0;
  let bestConfidence = -1;
  let bestFallback = null;
  const bins = new Map();
  const histR = samplingMode === "median" ? new Float64Array(256) : null;
  const histG = samplingMode === "median" ? new Float64Array(256) : null;
  const histB = samplingMode === "median" ? new Float64Array(256) : null;
  const lowerDistance = Math.max(3, backgroundTolerance * 0.58);
  const upperDistance = Math.max(lowerDistance + 1, backgroundTolerance * 2.15);

  for (let sy = sy0; sy < sy1; sy += 1) {
    for (let sx = sx0; sx < sx1; sx += 1) {
      samples += 1;
      const pixel = sy * width + sx;
      if (!mask[pixel]) continue;
      const index = pixel * 4;
      const alpha = data[index + 3] / 255;
      if (alpha <= 0.04) continue;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      let confidence = 1;
      if (suppressBackgroundSpill && backgroundModels.length > 0) {
        const distance = Math.sqrt(distanceToBackgroundModelsSquared(r, g, b, backgroundModels));
        confidence = Math.max(0, Math.min(1, (distance - lowerDistance) / (upperDistance - lowerDistance)));
        confidence = confidence * confidence * (3 - 2 * confidence);
      }
      if (confidence > bestConfidence) {
        bestConfidence = confidence;
        bestFallback = { r, g, b };
      }
      if (confidence <= 0.025) continue;
      const weight = alpha * Math.max(0.05, confidence);
      const localContrast = sourcePixelLocalContrast(imageData, mask, sx, sy);
      covered += confidence;
      confidenceWeight += confidence;
      alphaWeight += weight;
      red += r * weight;
      green += g * weight;
      blue += b * weight;

      const key = `${r >> 3},${g >> 3},${b >> 3}`;
      const bin = bins.get(key) || { weight: 0, r: 0, g: 0, b: 0, contrast: 0, peakContrast: 0 };
      bin.weight += weight;
      bin.r += r * weight;
      bin.g += g * weight;
      bin.b += b * weight;
      bin.contrast += localContrast * weight;
      bin.peakContrast = Math.max(bin.peakContrast, localContrast);
      bins.set(key, bin);

      if (samplingMode === "median") {
        histR[r] += weight;
        histG[g] += weight;
        histB[b] += weight;
      }
    }
  }

  if (alphaWeight <= 0) {
    if (!bestFallback) return { samples, covered: 0, color: null };
    bestFallback.weight = 0.2;
    bestFallback.confidence = Math.max(0, bestConfidence);
    bestFallback.detailImportance = 0;
    return { samples, covered: Math.max(0.01, bestConfidence), color: bestFallback };
  }

  const meanColor = {
    r: Math.round(red / alphaWeight),
    g: Math.round(green / alphaWeight),
    b: Math.round(blue / alphaWeight)
  };
  let dominant = null;
  const preparedBins = [];
  for (const bin of bins.values()) {
    const item = {
      r: Math.round(bin.r / bin.weight),
      g: Math.round(bin.g / bin.weight),
      b: Math.round(bin.b / bin.weight),
      weight: bin.weight,
      fraction: bin.weight / alphaWeight,
      localContrast: bin.contrast / Math.max(0.0001, bin.weight),
      peakContrast: bin.peakContrast
    };
    preparedBins.push(item);
    if (!dominant || item.weight > dominant.weight) dominant = item;
  }

  let baseColor;
  if (samplingMode === "dominant") {
    baseColor = { r: dominant.r, g: dominant.g, b: dominant.b };
  } else if (samplingMode === "median") {
    baseColor = {
      r: weightedMedianFromHistogram(histR, alphaWeight),
      g: weightedMedianFromHistogram(histG, alphaWeight),
      b: weightedMedianFromHistogram(histB, alphaWeight)
    };
  } else if (samplingMode === "mean") {
    baseColor = meanColor;
  } else {
    // Adaptive starts from a stable blend: mostly dominant color, with enough mean color
    // to retain natural shading before the high-contrast detail pass.
    baseColor = mixContourColors(dominant, meanColor, 0.34);
  }

  const protection = Math.max(0, Math.min(1, detailProtection / 100));
  let salient = null;
  let salientScore = 0;
  for (const bin of preparedBins) {
    if (bin === dominant && samplingMode !== "mean") continue;
    const contrast = Math.sqrt(weightedColorDistanceSquared(bin.r, bin.g, bin.b, baseColor));
    const lumaContrast = Math.abs(colorLuma(bin) - colorLuma(baseColor));
    const chromaAdvantage = Math.max(0, colorSaturation01(bin) - colorSaturation01(baseColor));
    const fractionFactor = Math.min(1, Math.sqrt(Math.max(0, bin.fraction) * 7.5));
    const structureFactor = Math.min(1.7, 0.45 + bin.localContrast / 42 + bin.peakContrast / 150);
    const score = (contrast * 0.72 + lumaContrast * 0.42 + chromaAdvantage * 55) * fractionFactor * structureFactor;
    if (score > salientScore) {
      salient = bin;
      salientScore = score;
    }
  }

  let detailImportance = 0;
  if (salient && protection > 0) {
    const contrast = Math.sqrt(weightedColorDistanceSquared(salient.r, salient.g, salient.b, baseColor));
    const minimumContrast = 19 - protection * 7;
    const minimumFraction = Math.max(0.018, 0.075 - protection * 0.052);
    const scoreThreshold = 28 - protection * 10;
    if (contrast >= minimumContrast && salient.fraction >= minimumFraction && salientScore >= scoreThreshold) {
      const contrastStrength = Math.max(0, Math.min(1, (contrast - minimumContrast) / 54));
      const structureStrength = Math.max(0, Math.min(1, (salient.localContrast - 7) / 48));
      const fractionStrength = Math.max(0, Math.min(1, salient.fraction / 0.24));
      detailImportance = Math.max(0, Math.min(1,
        protection * (0.34 + contrastStrength * 0.36 + structureStrength * 0.22 + fractionStrength * 0.18)
      ));
      const chooseDetail = detailImportance >= (samplingMode === "adaptive" ? 0.62 : 0.70);
      if (chooseDetail) {
        baseColor = { r: salient.r, g: salient.g, b: salient.b };
      } else {
        baseColor = mixContourColors(baseColor, salient, detailImportance * (samplingMode === "mean" ? 0.28 : 0.48));
      }
    }
  }

  const coverage = covered / Math.max(1, samples);
  baseColor.weight = Math.max(0.2, coverage) * (1 + colorSaturation01(baseColor) * 1.55) * (1 + detailImportance * 2.1);
  baseColor.confidence = confidenceWeight / Math.max(1, samples);
  baseColor.detailImportance = detailImportance;
  baseColor.salientScore = salientScore;
  return { samples, covered, color: baseColor };
}

function repairContourCellColorSpill(cells, width, height) {
  const source = cells.slice();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const cell = source[index];
      if (!cell || (cell.confidence ?? 1) >= 0.42) continue;
      let best = null;
      let bestScore = -Infinity;
      for (let radius = 1; radius <= 3; radius += 1) {
        for (let dy = -radius; dy <= radius; dy += 1) {
          for (let dx = -radius; dx <= radius; dx += 1) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            const candidate = source[ny * width + nx];
            if (!candidate) continue;
            const confidence = candidate.confidence ?? 1;
            const distancePenalty = Math.abs(dx) + Math.abs(dy);
            const score = confidence * 4 - distancePenalty * 0.35;
            if (confidence >= 0.5 && score > bestScore) {
              best = candidate;
              bestScore = score;
            }
          }
        }
        if (best) break;
      }
      if (best) {
        cells[index] = {
          r: best.r,
          g: best.g,
          b: best.b,
          weight: Math.max(cell.weight || 0.2, (best.weight || 1) * 0.72),
          confidence: Math.max(cell.confidence || 0, best.confidence || 0.5),
          detailImportance: Math.max(cell.detailImportance || 0, (best.detailImportance || 0) * 0.65)
        };
      }
    }
  }
}

function medianCutPalette(colors, requestedCount) {
  if (colors.length === 0) return [{ r: 0, g: 0, b: 0 }];
  const unique = new Map();
  for (const color of colors) {
    const key = `${color.r},${color.g},${color.b}`;
    const item = unique.get(key) || { r: color.r, g: color.g, b: color.b, weight: 0 };
    item.weight += Number.isFinite(color.weight) ? Math.max(0.05, color.weight) : 1;
    unique.set(key, item);
  }
  const points = Array.from(unique.values());
  if (points.length <= requestedCount) return points.map(({ r, g, b }) => ({ r, g, b }));

  const boxes = [points];
  const boxScore = (box) => {
    let minR = 255;
    let minG = 255;
    let minB = 255;
    let maxR = 0;
    let maxG = 0;
    let maxB = 0;
    let weight = 0;
    for (const color of box) {
      minR = Math.min(minR, color.r);
      minG = Math.min(minG, color.g);
      minB = Math.min(minB, color.b);
      maxR = Math.max(maxR, color.r);
      maxG = Math.max(maxG, color.g);
      maxB = Math.max(maxB, color.b);
      weight += color.weight;
    }
    return Math.max(maxR - minR, maxG - minG, maxB - minB) * Math.sqrt(weight);
  };

  while (boxes.length < requestedCount) {
    let splitIndex = -1;
    let bestScore = -1;
    for (let index = 0; index < boxes.length; index += 1) {
      if (boxes[index].length < 2) continue;
      const score = boxScore(boxes[index]);
      if (score > bestScore) {
        bestScore = score;
        splitIndex = index;
      }
    }
    if (splitIndex < 0) break;
    const box = boxes.splice(splitIndex, 1)[0];
    let minR = 255;
    let minG = 255;
    let minB = 255;
    let maxR = 0;
    let maxG = 0;
    let maxB = 0;
    for (const color of box) {
      minR = Math.min(minR, color.r);
      minG = Math.min(minG, color.g);
      minB = Math.min(minB, color.b);
      maxR = Math.max(maxR, color.r);
      maxG = Math.max(maxG, color.g);
      maxB = Math.max(maxB, color.b);
    }
    const ranges = [maxR - minR, maxG - minG, maxB - minB];
    const channel = ranges.indexOf(Math.max(...ranges));
    const key = channel === 0 ? "r" : channel === 1 ? "g" : "b";
    box.sort((left, right) => left[key] - right[key]);
    const totalWeight = box.reduce((sum, color) => sum + color.weight, 0);
    let running = 0;
    let cut = 1;
    for (; cut < box.length; cut += 1) {
      running += box[cut - 1].weight;
      if (running >= totalWeight / 2) break;
    }
    boxes.push(box.slice(0, cut), box.slice(cut));
  }

  return boxes.map((box) => {
    const totalWeight = box.reduce((sum, color) => sum + color.weight, 0) || 1;
    return {
      r: Math.round(box.reduce((sum, color) => sum + color.r * color.weight, 0) / totalWeight),
      g: Math.round(box.reduce((sum, color) => sum + color.g * color.weight, 0) / totalWeight),
      b: Math.round(box.reduce((sum, color) => sum + color.b * color.weight, 0) / totalWeight)
    };
  });
}

function srgbChannelToLinear(value) {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function rgbToOklab(color) {
  const r = srgbChannelToLinear(color.r);
  const g = srgbChannelToLinear(color.g);
  const b = srgbChannelToLinear(color.b);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);
  return {
    L: 0.2104542553 * lRoot + 0.7936177850 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.4285922050 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.8086757660 * sRoot
  };
}

function nearestPaletteIndex(color, palette, paletteLab) {
  const lab = rgbToOklab(color);
  let bestIndex = 0;
  let bestDistance = Infinity;
  for (let index = 0; index < palette.length; index += 1) {
    const candidate = paletteLab[index];
    const dL = (lab.L - candidate.L) * 1.15;
    const da = lab.a - candidate.a;
    const db = lab.b - candidate.b;
    const distance = dL * dL + da * da + db * db;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  return bestIndex;
}

function cleanupPaletteIndices(indices, cells, width, height, palette, strength) {
  if (strength <= 0) return indices;
  const passes = strength >= 82 ? 2 : 1;
  const majorityThreshold = strength >= 82 ? 6 : 7;
  let source = new Int16Array(indices);
  for (let pass = 0; pass < passes; pass += 1) {
    const next = new Int16Array(source);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const index = y * width + x;
        const current = source[index];
        const cell = cells[index];
        if (current < 0 || !cell) continue;
        const detailImportance = cell.detailImportance || 0;
        // High-contrast microdetails are intentional until proven otherwise.
        if (detailImportance >= 0.30) continue;
        const counts = new Map();
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0) continue;
            const value = source[(y + dy) * width + x + dx];
            if (value >= 0) counts.set(value, (counts.get(value) || 0) + 1);
          }
        }
        let majority = current;
        let majorityCount = 0;
        for (const [value, count] of counts) {
          if (count > majorityCount) {
            majority = value;
            majorityCount = count;
          }
        }
        if (majority === current || majorityCount < majorityThreshold) continue;
        const currentColor = palette[current];
        const majorityColor = palette[majority];
        const saturationDifference = colorSaturation01(currentColor) - colorSaturation01(majorityColor);
        const lumaDifference = Math.abs(colorLuma(currentColor) - colorLuma(majorityColor));
        const perceptualContrast = Math.sqrt(weightedColorDistanceSquared(
          currentColor.r, currentColor.g, currentColor.b, majorityColor
        ));
        const accentProtection = saturationDifference > 0.13;
        const structuralContrast = lumaDifference > 32 || perceptualContrast > 34;
        if (!accentProtection && !structuralContrast) next[index] = majority;
      }
    }
    source = next;
  }
  return source;
}

function normalizeContourPixelOptions(options = {}) {
  return {
    width: clampContourPixelDimension(options.width, 64),
    height: clampContourPixelDimension(options.height, 64),
    paletteSize: Math.max(2, Math.min(48, Math.round(Number(options.paletteSize) || 24))),
    paddingPercent: Math.max(0, Math.min(30, Number(options.paddingPercent) || 0)),
    contourStrength: Math.max(0, Math.min(100, Number(options.contourStrength) || 82)),
    clusterCleanup: Math.max(0, Math.min(100, Number(options.clusterCleanup) || 45)),
    detailProtection: Math.max(0, Math.min(100, Number(options.detailProtection) || 60)),
    backgroundTolerance: Math.max(1, Math.min(160, Number(options.backgroundTolerance) || 42)),
    samplingMode: ["adaptive", "dominant", "median", "mean"].includes(options.samplingMode) ? options.samplingMode : "dominant",
    cleanInteriorBackground: options.cleanInteriorBackground !== false,
    preserveOpaqueCanvas: options.preserveOpaqueCanvas !== false,
    splitSubjects: options.splitSubjects === true,
    darkOutline: options.darkOutline === true,
    bottomAnchor: options.bottomAnchor !== false
  };
}

function contourPixelGeometry(bounds, options) {
  const targetWidth = clampContourPixelDimension(options.width, 64);
  const targetHeight = clampContourPixelDimension(options.height, 64);
  const paddingX = Math.min(Math.floor(targetWidth * 0.35), Math.round(targetWidth * options.paddingPercent / 100));
  const paddingY = Math.min(Math.floor(targetHeight * 0.35), Math.round(targetHeight * options.paddingPercent / 100));
  const availableWidth = Math.max(1, targetWidth - paddingX * 2);
  const availableHeight = Math.max(1, targetHeight - paddingY * 2);
  const scale = Math.min(availableWidth / Math.max(1, bounds.width), availableHeight / Math.max(1, bounds.height));
  const drawWidth = Math.max(1, Math.min(availableWidth, Math.round(bounds.width * scale)));
  const drawHeight = Math.max(1, Math.min(availableHeight, Math.round(bounds.height * scale)));
  const offsetX = Math.floor((targetWidth - drawWidth) / 2);
  const offsetY = options.bottomAnchor
    ? Math.max(0, targetHeight - paddingY - drawHeight)
    : Math.floor((targetHeight - drawHeight) / 2);
  return {
    targetWidth,
    targetHeight,
    bounds: { ...bounds },
    paddingX,
    paddingY,
    availableWidth,
    availableHeight,
    scale,
    drawWidth,
    drawHeight,
    offsetX: Math.trunc(offsetX),
    offsetY: Math.trunc(offsetY)
  };
}

function contourPixelizeMasked(imageData, subjectMask, options) {
  const targetWidth = clampContourPixelDimension(options.width, 64);
  const targetHeight = clampContourPixelDimension(options.height, 64);
  const sourceWidth = imageData.width;
  const sourceHeight = imageData.height;
  const detectedBounds = maskPixelBounds(subjectMask, sourceWidth, sourceHeight);
  const fixedGeometry = options.fixedGeometry;
  const geometry = fixedGeometry
    && fixedGeometry.targetWidth === targetWidth
    && fixedGeometry.targetHeight === targetHeight
    ? fixedGeometry
    : contourPixelGeometry(detectedBounds, options);
  const bounds = geometry.bounds;
  const paddingX = geometry.paddingX;
  const paddingY = geometry.paddingY;
  const availableWidth = geometry.availableWidth;
  const availableHeight = geometry.availableHeight;
  const scale = geometry.scale;
  const drawWidth = geometry.drawWidth;
  const drawHeight = geometry.drawHeight;
  const offsetX = Math.trunc(geometry.offsetX);
  const offsetY = Math.trunc(geometry.offsetY);
  let cells = new Array(targetWidth * targetHeight).fill(null);
  const coverageThreshold = Math.max(0.12, Math.min(0.58, 0.56 - options.contourStrength * 0.0044));

  for (let py = 0; py < drawHeight; py += 1) {
    const sy0 = Math.max(bounds.minY, Math.floor(bounds.minY + py * bounds.height / drawHeight));
    const sy1 = Math.min(bounds.maxY + 1, Math.max(sy0 + 1, Math.ceil(bounds.minY + (py + 1) * bounds.height / drawHeight)));
    for (let px = 0; px < drawWidth; px += 1) {
      const sx0 = Math.max(bounds.minX, Math.floor(bounds.minX + px * bounds.width / drawWidth));
      const sx1 = Math.min(bounds.maxX + 1, Math.max(sx0 + 1, Math.ceil(bounds.minX + (px + 1) * bounds.width / drawWidth)));
      const sampled = sampleContourCellColor(
        imageData,
        subjectMask,
        sx0,
        sy0,
        sx1,
        sy1,
        options.samplingMode,
        options.backgroundModels || [],
        options.backgroundTolerance,
        options.cleanInteriorBackground,
        options.detailProtection
      );
      if (!sampled.color) continue;
      const coverage = sampled.covered / Math.max(1, sampled.samples);
      const centerX = Math.min(sourceWidth - 1, Math.floor((sx0 + sx1 - 1) / 2));
      const centerY = Math.min(sourceHeight - 1, Math.floor((sy0 + sy1 - 1) / 2));
      const centerIncluded = Boolean(subjectMask[centerY * sourceWidth + centerX]);
      const preserveFineContour = options.contourStrength >= 62 && centerIncluded && coverage >= Math.max(0.045, coverageThreshold * 0.24);
      if (coverage < coverageThreshold && !preserveFineContour) continue;
      cells[(offsetY + py) * targetWidth + offsetX + px] = sampled.color;
    }
  }

  cleanupContourPixelCells(cells, targetWidth, targetHeight, options.clusterCleanup);
  if ((options.backgroundModels || []).length > 0 && options.cleanInteriorBackground) {
    repairContourCellColorSpill(cells, targetWidth, targetHeight);
  }
  if (!options.darkOutline) {
    cells = repairDarkContourFringeCells(cells, targetWidth, targetHeight);
  }
  const opaqueCells = cells.filter(Boolean);
  const palette = medianCutPalette(opaqueCells, options.paletteSize);
  const paletteLab = palette.map(rgbToOklab);
  const indices = new Int16Array(targetWidth * targetHeight);
  indices.fill(-1);
  for (let index = 0; index < cells.length; index += 1) {
    if (cells[index]) indices[index] = nearestPaletteIndex(cells[index], palette, paletteLab);
  }
  const cleanedIndices = cleanupPaletteIndices(indices, cells, targetWidth, targetHeight, palette, options.clusterCleanup);
  const output = new ImageData(targetWidth, targetHeight);
  const target = output.data;
  const averageLuma = opaqueCells.reduce((sum, color) => sum + colorLuma(color), 0) / Math.max(1, opaqueCells.length);
  const darkestIndex = palette.reduce((bestIndex, color, index) => colorLuma(color) < colorLuma(palette[bestIndex]) ? index : bestIndex, 0);
  const isEdge = (x, y) => {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= targetWidth || ny >= targetHeight) return true;
        if (cleanedIndices[ny * targetWidth + nx] < 0) return true;
      }
    }
    return false;
  };

  for (let y = 0; y < targetHeight; y += 1) {
    for (let x = 0; x < targetWidth; x += 1) {
      const index = y * targetWidth + x;
      let paletteIndex = cleanedIndices[index];
      if (paletteIndex < 0) continue;
      if (options.darkOutline && isEdge(x, y)) {
        if (averageLuma >= 95) {
          paletteIndex = darkestIndex;
        } else if (averageLuma >= 58) {
          const base = palette[paletteIndex];
          const darker = { r: Math.round(base.r * 0.72), g: Math.round(base.g * 0.72), b: Math.round(base.b * 0.72) };
          paletteIndex = nearestPaletteIndex(darker, palette, paletteLab);
        }
      }
      const color = palette[paletteIndex];
      const targetIndex = index * 4;
      target[targetIndex] = color.r;
      target[targetIndex + 1] = color.g;
      target[targetIndex + 2] = color.b;
      target[targetIndex + 3] = 255;
    }
  }
  // Pixel conversion creates a deliberately hard grid, but the coverage sampling can
  // still leave a one-cell burr on an otherwise straight silhouette. Run the same
  // conservative pixel-art contour pass used by edge cleanup before returning it:
  // it removes only unsupported exterior blocks and preserves thin blades, handles
  // and high-contrast detail.
  return cleanPixelArtEdgeImageData(output);
}

function copyImageDataInto(target, source, offsetX, offsetY) {
  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const sourceIndex = (y * source.width + x) * 4;
      const targetIndex = ((offsetY + y) * target.width + offsetX + x) * 4;
      target.data[targetIndex] = source.data[sourceIndex];
      target.data[targetIndex + 1] = source.data[sourceIndex + 1];
      target.data[targetIndex + 2] = source.data[sourceIndex + 2];
      target.data[targetIndex + 3] = source.data[sourceIndex + 3];
    }
  }
}

function requantizeOpaqueImageData(imageData, paletteSize) {
  const colors = [];
  for (let index = 0; index < imageData.data.length; index += 4) {
    if (imageData.data[index + 3] === 0) continue;
    colors.push({
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2],
      weight: 1
    });
  }
  if (colors.length === 0) return imageData;
  const palette = medianCutPalette(colors, paletteSize);
  const paletteLab = palette.map(rgbToOklab);
  const cache = new Map();
  for (let index = 0; index < imageData.data.length; index += 4) {
    if (imageData.data[index + 3] === 0) continue;
    const key = `${imageData.data[index]},${imageData.data[index + 1]},${imageData.data[index + 2]}`;
    let paletteIndex = cache.get(key);
    if (paletteIndex === undefined) {
      paletteIndex = nearestPaletteIndex({
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2]
      }, palette, paletteLab);
      cache.set(key, paletteIndex);
    }
    const color = palette[paletteIndex];
    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
  }
  return imageData;
}

function contourPixelizeImageData(imageData, options = {}) {
  const normalized = normalizeContourPixelOptions(options);
  const subject = buildContourSubjectMask(imageData, normalized);
  const subjectOptions = {
    ...normalized,
    backgroundModels: subject.backgroundModels,
    darkOutline: subject.mode.startsWith("full") ? false : normalized.darkOutline
  };
  const retrySparseResult = (converted) => {
    if (!shouldRetrySparsePixelation({
      maskMode: subject.mode,
      sourceOpaqueRatio: opaquePixelRatio(imageData),
      outputOpaqueRatio: opaquePixelRatio(converted),
      edgeTexture: subject.edgeTexture
    })) {
      return converted;
    }
    const fullMask = new Uint8Array(imageData.width * imageData.height);
    for (let pixel = 0; pixel < fullMask.length; pixel += 1) {
      if (imageData.data[pixel * 4 + 3] > 16) fullMask[pixel] = 1;
    }
    return contourPixelizeMasked(imageData, fullMask, {
      ...normalized,
      splitSubjects: false,
      cleanInteriorBackground: false,
      darkOutline: false,
      backgroundModels: []
    });
  };
  if (!normalized.splitSubjects || subject.components.length < 2) {
    return retrySparseResult(contourPixelizeMasked(imageData, subject.mask, subjectOptions));
  }

  const largest = subject.components.reduce((best, item) => Math.max(best, item.area), 0);
  const majorComponents = subject.components
    .filter((component) => component.area >= Math.max(8, largest * 0.04))
    .sort((left, right) => left.minX - right.minX || left.minY - right.minY)
    .slice(0, 12);
  if (majorComponents.length < 2) {
    return retrySparseResult(contourPixelizeMasked(imageData, subject.mask, subjectOptions));
  }

  const gap = Math.max(1, Math.round(normalized.width * 0.06));
  const output = new ImageData(majorComponents.length * normalized.width + (majorComponents.length - 1) * gap, normalized.height);
  for (let componentIndex = 0; componentIndex < majorComponents.length; componentIndex += 1) {
    const component = majorComponents[componentIndex];
    const componentMask = new Uint8Array(subject.mask.length);
    for (let pixel = 0; pixel < componentMask.length; pixel += 1) {
      if (subject.labels[pixel] === component.label) componentMask[pixel] = 1;
    }
    const converted = contourPixelizeMasked(imageData, componentMask, subjectOptions);
    copyImageDataInto(output, converted, componentIndex * (normalized.width + gap), 0);
  }
  return retrySparseResult(requantizeOpaqueImageData(output, normalized.paletteSize));
}

function contourPixelOpaqueMask(imageData, alphaThreshold = 128) {
  const mask = new Uint8Array(imageData.width * imageData.height);
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    if (imageData.data[pixel * 4 + 3] >= alphaThreshold) mask[pixel] = 1;
  }
  return mask;
}

function maskHasOpaqueNeighbor(mask, width, height, x, y, radius = 1) {
  for (let oy = -radius; oy <= radius; oy += 1) {
    for (let ox = -radius; ox <= radius; ox += 1) {
      if (ox === 0 && oy === 0) continue;
      const nx = x + ox;
      const ny = y + oy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (mask[ny * width + nx]) return true;
    }
  }
  return false;
}

function shouldRemoveTransientPixelComponent(component, labels, transientMask, currentMask, previousMask, nextMask, width, height) {
  let touchesCurrentShape = false;
  let touchesBroadSupport = false;
  let followsMotionInPrevious = false;
  let followsMotionInNext = false;

  for (let y = component.minY; y <= component.maxY; y += 1) {
    for (let x = component.minX; x <= component.maxX; x += 1) {
      const pixel = y * width + x;
      if (labels[pixel] !== component.label) continue;
      if (maskHasOpaqueNeighbor(previousMask, width, height, x, y, 1)) followsMotionInPrevious = true;
      if (maskHasOpaqueNeighbor(nextMask, width, height, x, y, 1)) followsMotionInNext = true;
      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          if (ox === 0 && oy === 0) continue;
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const neighbor = ny * width + nx;
          if (!currentMask[neighbor] || transientMask[neighbor]) continue;
          touchesCurrentShape = true;
          const support = pixelEdgeNeighborStats(currentMask, width, height, nx, ny);
          if (support.total >= 4 && support.orthogonal >= 2) touchesBroadSupport = true;
        }
      }
    }
  }

  // A tiny block protruding from a broad stable edge is the common video-mask
  // flicker artifact. Detached pixels are removed unless the same small feature
  // continues nearby in both adjacent frames, which protects moving particles.
  if (touchesCurrentShape) return touchesBroadSupport;
  return !(followsMotionInPrevious && followsMotionInNext);
}

function buildContourSequencePalette(frames, requestedCount) {
  const buckets = new Map();
  for (const frame of frames) {
    const data = frame.data;
    for (let index = 0; index < data.length; index += 4) {
      if (data[index + 3] < 128) continue;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      const bucket = buckets.get(key) || { r: 0, g: 0, b: 0, weight: 0 };
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.weight += 1;
      buckets.set(key, bucket);
    }
  }
  const colors = Array.from(buckets.values(), (bucket) => ({
    r: Math.round(bucket.r / bucket.weight),
    g: Math.round(bucket.g / bucket.weight),
    b: Math.round(bucket.b / bucket.weight),
    weight: bucket.weight
  }));
  return medianCutPalette(colors, requestedCount);
}

async function applyContourSequencePalette(frames, palette) {
  if (!palette.length) return frames;
  const paletteLab = palette.map(rgbToOklab);
  const cache = new Map();
  for (let frameIndex = 0; frameIndex < frames.length; frameIndex += 1) {
    const data = frames[frameIndex].data;
    for (let index = 0; index < data.length; index += 4) {
      if (data[index + 3] < 128) continue;
      const key = (data[index] << 16) | (data[index + 1] << 8) | data[index + 2];
      let paletteIndex = cache.get(key);
      if (paletteIndex === undefined) {
        paletteIndex = nearestPaletteIndex({
          r: data[index],
          g: data[index + 1],
          b: data[index + 2]
        }, palette, paletteLab);
        cache.set(key, paletteIndex);
      }
      const color = palette[paletteIndex];
      data[index] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
    }
    bleedOpaqueColorsIntoTransparentPixels(frames[frameIndex]);
    if (frameIndex % 8 === 7) await yieldToBrowser(0);
  }
  return frames;
}

async function stabilizeContourPixelSequence(frames, paletteSize) {
  if (frames.length < 2) return frames;
  const width = frames[0].width;
  const height = frames[0].height;
  if (!frames.every((frame) => frame.width === width && frame.height === height)) return frames;

  const source = frames.map(cloneImageData);
  const stabilized = frames.map(cloneImageData);
  const masks = source.map((frame) => contourPixelOpaqueMask(frame));
  const shorterSide = Math.min(width, height);
  const maxTransientArea = Math.max(1, Math.min(9, Math.round(shorterSide / 12)));
  const maxTransientSpan = shorterSide < 48 ? 2 : 3;

  for (let frameIndex = 1; frameIndex < source.length - 1; frameIndex += 1) {
    const previous = source[frameIndex - 1];
    const current = source[frameIndex];
    const next = source[frameIndex + 1];
    const previousMask = masks[frameIndex - 1];
    const currentMask = masks[frameIndex];
    const nextMask = masks[frameIndex + 1];
    const transientMask = new Uint8Array(currentMask.length);
    const oneFrameHoleMask = new Uint8Array(currentMask.length);

    for (let pixel = 0; pixel < currentMask.length; pixel += 1) {
      if (currentMask[pixel] && !previousMask[pixel] && !nextMask[pixel]) transientMask[pixel] = 1;
      if (!currentMask[pixel] && previousMask[pixel] && nextMask[pixel]) oneFrameHoleMask[pixel] = 1;
    }

    const transient = labelMaskComponents(transientMask, width, height);
    for (const component of transient.components) {
      if (component.area > maxTransientArea || component.width > maxTransientSpan || component.height > maxTransientSpan) continue;
      if (!shouldRemoveTransientPixelComponent(
        component,
        transient.labels,
        transientMask,
        currentMask,
        previousMask,
        nextMask,
        width,
        height
      )) continue;
      for (let y = component.minY; y <= component.maxY; y += 1) {
        for (let x = component.minX; x <= component.maxX; x += 1) {
          const pixel = y * width + x;
          if (transient.labels[pixel] === component.label) stabilized[frameIndex].data[pixel * 4 + 3] = 0;
        }
      }
    }

    const holes = labelMaskComponents(oneFrameHoleMask, width, height);
    for (const component of holes.components) {
      if (component.area > maxTransientArea || component.width > maxTransientSpan || component.height > maxTransientSpan) continue;
      for (let y = component.minY; y <= component.maxY; y += 1) {
        for (let x = component.minX; x <= component.maxX; x += 1) {
          const pixel = y * width + x;
          if (holes.labels[pixel] !== component.label) continue;
          const support = pixelEdgeNeighborStats(currentMask, width, height, x, y);
          if (support.orthogonal < 3 && support.total < 6) continue;
          const dataIndex = pixel * 4;
          stabilized[frameIndex].data[dataIndex] = Math.round((previous.data[dataIndex] + next.data[dataIndex]) / 2);
          stabilized[frameIndex].data[dataIndex + 1] = Math.round((previous.data[dataIndex + 1] + next.data[dataIndex + 1]) / 2);
          stabilized[frameIndex].data[dataIndex + 2] = Math.round((previous.data[dataIndex + 2] + next.data[dataIndex + 2]) / 2);
          stabilized[frameIndex].data[dataIndex + 3] = 255;
        }
      }
    }

    // Correct only strong one-frame color outliers in fully supported interior
    // pixels. Edge highlights and moving details remain untouched.
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const pixel = y * width + x;
        if (!previousMask[pixel] || !currentMask[pixel] || !nextMask[pixel]) continue;
        const previousSupport = pixelEdgeNeighborStats(previousMask, width, height, x, y);
        const currentSupport = pixelEdgeNeighborStats(currentMask, width, height, x, y);
        const nextSupport = pixelEdgeNeighborStats(nextMask, width, height, x, y);
        if (previousSupport.total < 7 || currentSupport.total < 7 || nextSupport.total < 7) continue;
        const dataIndex = pixel * 4;
        const previousColor = { r: previous.data[dataIndex], g: previous.data[dataIndex + 1], b: previous.data[dataIndex + 2] };
        const currentColor = { r: current.data[dataIndex], g: current.data[dataIndex + 1], b: current.data[dataIndex + 2] };
        const nextColor = { r: next.data[dataIndex], g: next.data[dataIndex + 1], b: next.data[dataIndex + 2] };
        const previousNextDistance = Math.sqrt(weightedColorDistanceSquared(
          previousColor.r, previousColor.g, previousColor.b, nextColor
        ));
        const currentPreviousDistance = Math.sqrt(weightedColorDistanceSquared(
          currentColor.r, currentColor.g, currentColor.b, previousColor
        ));
        const currentNextDistance = Math.sqrt(weightedColorDistanceSquared(
          currentColor.r, currentColor.g, currentColor.b, nextColor
        ));
        if (previousNextDistance > 16 || currentPreviousDistance < 40 || currentNextDistance < 40) continue;
        stabilized[frameIndex].data[dataIndex] = Math.round((previousColor.r + nextColor.r) / 2);
        stabilized[frameIndex].data[dataIndex + 1] = Math.round((previousColor.g + nextColor.g) / 2);
        stabilized[frameIndex].data[dataIndex + 2] = Math.round((previousColor.b + nextColor.b) / 2);
      }
    }

    if (frameIndex % 8 === 0) {
      setStatus(`正在清理仅闪现一帧的脏像素 ${frameIndex + 1}/${source.length}...`);
      await yieldToBrowser(0);
    }
  }

  setStatus("正在统一整段序列的像素调色板，减少颜色跳闪...");
  const sharedPalette = buildContourSequencePalette(stabilized, paletteSize);
  return applyContourSequencePalette(stabilized, sharedPalette);
}





async function contourPixelizeSequenceFramesShared(frames, options = {}, geometryFrames = frames) {
  if (!frames.length) return { converted: [], geometry: null };

  // This path is deliberately size-agnostic. 16×16, 32×32, 64×64, 128×128,
  // custom rectangular sizes, and future presets all share the exact same rule:
  // one source canvas, one scale, and one pair of integer offsets for the operation.
  const normalized = normalizeContourPixelOptions({ ...options, splitSubjects: false });
  const referenceFrames = geometryFrames?.length ? geometryFrames : frames;
  const canvasFrames = [...referenceFrames, ...frames];
  const sourceWidth = Math.max(...canvasFrames.map((frame) => frame.imageData.width));
  const sourceHeight = Math.max(...canvasFrames.map((frame) => frame.imageData.height));
  const preparedByFrame = new Map();

  const prepareFrame = (frame) => {
    const cached = preparedByFrame.get(frame);
    if (cached) return cached;
    const source = frame.imageData;
    // Never crop or recenter a frame here. Smaller sources retain their original
    // top-left origin inside the shared canvas, so their coordinates cannot drift.
    const unifiedImageData = source.width === sourceWidth && source.height === sourceHeight
      ? cloneImageData(source)
      : drawImageDataOnCanvas(source, sourceWidth, sourceHeight, 0, 0);
    const subject = buildContourSubjectMask(unifiedImageData, normalized);
    const prepared = { imageData: unifiedImageData, subject };
    preparedByFrame.set(frame, prepared);
    return prepared;
  };

  let unionMinX = sourceWidth;
  let unionMinY = sourceHeight;
  let unionMaxX = -1;
  let unionMaxY = -1;

  for (let index = 0; index < referenceFrames.length; index += 1) {
    const entry = prepareFrame(referenceFrames[index]);
    const bounds = maskPixelBounds(entry.subject.mask, sourceWidth, sourceHeight);
    unionMinX = Math.min(unionMinX, bounds.minX);
    unionMinY = Math.min(unionMinY, bounds.minY);
    unionMaxX = Math.max(unionMaxX, bounds.maxX);
    unionMaxY = Math.max(unionMaxY, bounds.maxY);
    setStatus(`正在分析序列帧统一画布 ${index + 1}/${referenceFrames.length}...`);
    await yieldToBrowser(0);
  }

  const unionBounds = unionMaxX >= unionMinX && unionMaxY >= unionMinY
    ? {
        minX: unionMinX,
        minY: unionMinY,
        maxX: unionMaxX,
        maxY: unionMaxY,
        width: unionMaxX - unionMinX + 1,
        height: unionMaxY - unionMinY + 1
      }
    : { minX: 0, minY: 0, maxX: sourceWidth - 1, maxY: sourceHeight - 1, width: sourceWidth, height: sourceHeight };

  const fixedGeometry = Object.freeze(contourPixelGeometry(unionBounds, normalized));
  const converted = [];

  for (let index = 0; index < frames.length; index += 1) {
    const entry = prepareFrame(frames[index]);
    setStatus(`正在以 ${fixedGeometry.targetWidth}×${fixedGeometry.targetHeight} 的统一缩放与整数偏移像素化 ${index + 1}/${frames.length}...`);
    converted.push(contourPixelizeMasked(entry.imageData, entry.subject.mask, {
      ...normalized,
      backgroundModels: entry.subject.backgroundModels,
      fixedGeometry
    }));
    await yieldToBrowser(0);
  }

  setStatus("正在进行序列帧时序去闪烁...");
  const stabilized = await stabilizeContourPixelSequence(converted, normalized.paletteSize);
  return { converted: stabilized, geometry: fixedGeometry };
}

function cloneImageItemState(item) {
  return {
    name: item.name,
    originalImageData: item.originalImageData || null,
    currentImageData: item.currentImageData || null,
    liveBaseImageData: item.liveBaseImageData || null,
    pickedColors: (item.pickedColors || []).map((color) => ({ ...color })),
    history: [],
    thumbnail: item.thumbnail,
    selected: Boolean(item.selected),
    pixelatedPreview: Boolean(item.pixelatedPreview),
    fullResolutionSource: item.fullResolutionSource || null,
    fullResolutionPipeline: cloneFullResolutionPipeline(item.fullResolutionPipeline)
  };
}

function cloneFrameState(frame) {
  return {
    name: frame.name,
    imageData: frame.imageData || null,
    thumbnail: frame.thumbnail,
    selected: Boolean(frame.selected),
    order: frame.order || 0,
    pixelatedPreview: Boolean(frame.pixelatedPreview),
    delayMs: normalizedFrameDelayMs(frame),
    fullResolutionSource: frame.fullResolutionSource || null,
    fullResolutionPipeline: cloneFullResolutionPipeline(frame.fullResolutionPipeline)
  };
}

function cloneAssetState(asset) {
  return {
    id: asset.id,
    name: asset.name,
    imageData: asset.imageData || null,
    previewImageData: asset.previewImageData || null,
    thumbnail: asset.thumbnail,
    selected: Boolean(asset.selected),
    pixelatedPreview: Boolean(asset.pixelatedPreview),
    sourceKind: asset.sourceKind,
    sourceName: asset.sourceName,
    canvasKind: asset.canvasKind || null,
    canvasBaseColor: asset.canvasBaseColor ? { ...asset.canvasBaseColor } : null,
    sequencePlacement: cloneSequencePlacement(asset.sequencePlacement),
    recognizing: Boolean(asset.recognizing),
    autoNameFromText: Boolean(asset.autoNameFromText),
    removeRecognizedText: Boolean(asset.removeRecognizedText),
    fullResolutionSource: asset.fullResolutionSource || null,
    fullResolutionPipeline: cloneFullResolutionPipeline(asset.fullResolutionPipeline)
  };
}

function activeLibrarySnapshot() {
  if (!activeLibraryTarget) return null;
  const assetIndex = assetLibrary.indexOf(activeLibraryTarget);
  return assetIndex >= 0 ? { type: "asset", index: assetIndex } : null;
}

function snapshotState() {
  return {
    version: 3,
    canvas: canvasSnapshotState(),
    images: images.map(cloneImageItemState),
    sequenceFrames: sequenceFrames.map(cloneFrameState),
    assetLibrary: assetLibrary.map(cloneAssetState),
    assetCounter,
    activeIndex,
    activeFrameIndex,
    activeLibraryTarget: activeLibrarySnapshot(),
    frameSelectionOrder,
    playbackIndex,
    processingSource
  };
}

function restoreState(snapshot) {
  if (!snapshot.version) {
    originalImageData = cloneOptionalImageData(snapshot.originalImageData);
    currentImageData = cloneOptionalImageData(snapshot.currentImageData);
    liveBaseImageData = cloneOptionalImageData(snapshot.liveBaseImageData);
    pickedColors = (snapshot.pickedColors || []).map((color) => ({ ...color }));
    return;
  }
  images = (snapshot.images || []).map(cloneImageItemState);
  sequenceFrames = (snapshot.sequenceFrames || []).map(cloneFrameState);
  assetLibrary = (snapshot.assetLibrary || []).map(cloneAssetState);
  assetCounter = snapshot.assetCounter || assetLibrary.length;
  activeIndex = Math.min(snapshot.activeIndex ?? -1, images.length - 1);
  activeFrameIndex = Math.min(snapshot.activeFrameIndex ?? -1, sequenceFrames.length - 1);
  frameSelectionOrder = snapshot.frameSelectionOrder || normalizeSelectionOrders(sequenceFrames);
  libraryBatchSelectionMode.original = images.filter((item) => item.selected).length > 1;
  libraryBatchSelectionMode.result = assetLibrary.filter((item) => item.selected).length > 1;
  libraryBatchSelectionMode.sequence = sequenceFrames.filter((item) => item.selected).length > 1;
  playbackIndex = Math.min(snapshot.playbackIndex || 0, Math.max(0, sequenceFrames.length - 1));
  processingSource = snapshot.processingSource || "original";
  activeLibraryTarget = snapshot.activeLibraryTarget?.type === "asset"
    ? assetLibrary[snapshot.activeLibraryTarget.index] || null
    : null;
  workspaceTabs = [];
  activeWorkspaceTabId = "";
  originalImageData = snapshot.canvas?.originalImageData || null;
  currentImageData = snapshot.canvas?.currentImageData || null;
  liveBaseImageData = snapshot.canvas?.liveBaseImageData || null;
  pickedColors = (snapshot.canvas?.pickedColors || []).map((color) => ({ ...color }));
}

function pushHistory() {
  if (!currentImageData && images.length === 0 && sequenceFrames.length === 0 && assetLibrary.length === 0) return;
  pushBoundedState(history, snapshotState(), maxHistoryStates);
  redoStack = [];
  compactHistoryForMemory();
}

function renderRestoredState() {
  clearOutlinePreviewState({ restore: false });
  cropSelection = null;
  hideCropBox();
  clearLassoSelection();
  renderSwatches();
  renderImageList();
  renderFrameList();
  renderAssetList();
  renderWorkspaceTabs();
  setProcessingSource(processingSource, { announce: false });
  if (currentImageData) {
    showResultMode();
    renderCanvas();
  } else if (activeFrameIndex >= 0 && sequenceFrames[activeFrameIndex]) {
    renderPreviewImageData(sequenceFrames[activeFrameIndex].imageData);
  } else {
    canvas.classList.remove("ready");
    selectionCanvas.classList.remove("ready");
    emptyState.hidden = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
  }
  setButtons();
}

function saveActiveImage() {
  // 原始图片库和处理结果库都是来源库。画布上的实时预览不会反写来源，
  // 正式处理会通过 addProcessedAsset 生成一个新结果。
}

function updateRangeLabels() {
  toleranceValue.value = tolerance.value;
  softnessValue.value = softness.value;
  if (brushSizeValue && brushSize) brushSizeValue.value = brushSize.value;
  if (brushPanelSizeValue && brushSize) brushPanelSizeValue.value = brushSize.value;
  if (brushPanelSize && brushSize && document.activeElement !== brushPanelSize) brushPanelSize.value = brushSize.value;
  eraserSizeValue.value = eraserSize.value;
  updateBrushPalettePresentation();
  if (outlineStrengthValue && outlineStrength) outlineStrengthValue.value = outlineStrength.value;
  if (shadowStrengthValue && shadowStrength) shadowStrengthValue.value = `${shadowStrength.value}%`;
  if (shadowSizeValue && shadowSize) shadowSizeValue.value = `${shadowSize.value}%`;
}

function syncSequencePlayerProgress(index = activeFrameIndex) {
  const safeIndex = sequenceFrames.length
    ? Math.max(0, Math.min(sequenceFrames.length - 1, Number(index) || 0))
    : 0;
  if (sequenceFramePosition) {
    sequenceFramePosition.value = sequenceFrames.length ? `${safeIndex + 1} / ${sequenceFrames.length}` : "0 / 0";
  }
  if (sequenceProgressInput) {
    sequenceProgressInput.max = String(Math.max(0, sequenceFrames.length - 1));
    sequenceProgressInput.value = String(safeIndex);
    sequenceProgressInput.disabled = sequenceFrames.length < 2;
    const progress = sequenceFrames.length > 1 ? safeIndex / (sequenceFrames.length - 1) : 0;
    sequenceProgressInput.style.setProperty("--sequence-progress", `${progress * 100}%`);
  }
  if (previousSequenceFrameBtn) previousSequenceFrameBtn.disabled = sequenceFrames.length === 0 || safeIndex <= 0;
  if (nextSequenceFrameBtn) nextSequenceFrameBtn.disabled = sequenceFrames.length === 0 || safeIndex >= sequenceFrames.length - 1;
  sequencePlayerFrames?.querySelectorAll(".sequence-player-frame").forEach((button) => {
    const isActive = Number(button.dataset.sequencePlayerIndex) === safeIndex;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

function renderSequencePlayerTimeline() {
  if (!sequencePlayerFrames) return;
  const fragment = document.createDocumentFragment();
  sequenceFrames.forEach((frame, index) => {
    const listItem = document.createElement("span");
    listItem.className = "sequence-player-frame-item";
    listItem.setAttribute("role", "listitem");

    const button = document.createElement("button");
    button.className = `sequence-player-frame${frame.selected ? " selected" : ""}`;
    button.type = "button";
    button.dataset.sequencePlayerIndex = String(index);
    button.title = `查看第 ${index + 1} 帧：${frame.name}`;
    button.setAttribute("aria-label", `第 ${index + 1} 帧：${frame.name}`);

    const thumbnail = document.createElement("img");
    thumbnail.alt = "";
    thumbnail.draggable = false;
    thumbnail.src = frame.thumbnail || makeThumbnail(frame.imageData);

    const frameNumber = document.createElement("span");
    frameNumber.className = "sequence-player-frame-number";
    frameNumber.textContent = String(index + 1);

    button.append(thumbnail, frameNumber);
    button.addEventListener("click", () => {
      stopPlayback();
      showSequenceFrame(index, false);
    });
    listItem.appendChild(button);
    fragment.appendChild(listItem);
  });
  sequencePlayerFrames.replaceChildren(fragment);
  syncSequencePlayerProgress(activeFrameIndex);
}

function syncSequenceCanvasBar(hasFrames = sequenceFrames.length > 0) {
  if (!sequenceCanvasBar) return;
  const activeFrame = activeFrameIndex >= 0 ? sequenceFrames[activeFrameIndex] : null;
  const visible = processingSource === "sequence" && hasFrames && Boolean(activeFrame);
  sequenceCanvasBar.hidden = !visible;
  if (!visible) return;

  const displayedIndex = playbackTimer && playbackPreviewFrameIndex >= 0
    ? playbackPreviewFrameIndex
    : activeFrameIndex;
  syncSequencePlayerProgress(displayedIndex);
  if (frameDelayInput) {
    frameDelayInput.disabled = !activeFrame;
    frameDelayInput.value = String(normalizedFrameDelayMs(activeFrame));
  }
  if (previousSequenceFrameBtn) previousSequenceFrameBtn.disabled = displayedIndex <= 0;
  if (nextSequenceFrameBtn) nextSequenceFrameBtn.disabled = displayedIndex >= sequenceFrames.length - 1;
  if (copyCurrentFrameBtn) copyCurrentFrameBtn.disabled = !activeFrame;
  if (openFramePickerFromBarBtn) openFramePickerFromBarBtn.disabled = !hasFrames;
}

function setButtons() {
  const hasImage = Boolean(currentImageData);
  const hasColors = pickedColors.length > 0;
  const hasBatch = images.length > 0;
  const selectedCount = images.filter((item) => item.selected).length;
  const hasFrames = sequenceFrames.length > 0;
  const selectedFrameCount = sequenceFrames.filter((frame) => frame.selected).length;
  const hasAssets = assetLibrary.length > 0;
  const selectedAssetCount = assetLibrary.filter((asset) => asset.selected).length;
  const sourceCount = processingSource === "sequence"
    ? targetFrames().length
    : sourceRecordsForProcessing().length;
  const hasEditableTarget = sourceCount > 0 && (processingSource === "sequence" || hasImage);
  const hasValidSelection = (cropSelection?.width >= 2 && cropSelection?.height >= 2) || lassoSelection.length >= 3;
  updateMemoryIndicator();

  removeBtn.disabled = operationBusy || !hasEditableTarget || !hasColors;
  if (cutoutCommitRow) cutoutCommitRow.hidden = !hasColors;
  if (pickedColorsPanel) pickedColorsPanel.hidden = !hasColors;
  undoBtn.disabled = history.length === 0;
  if (redoBtn) redoBtn.disabled = redoStack.length === 0;
  resetBtn.disabled = !hasImage;
  const exportItemCount = currentExportItems().length;
  downloadBtn.disabled = exportItemCount === 0;
  if (downloadAllBtn) downloadAllBtn.disabled = !hasAssets;
  if (exportModeHint) {
    exportModeHint.textContent = exportItemCount > 1
      ? `当前将导出 ${exportItemCount} 张图片，并自动打包为 ZIP。`
      : exportItemCount === 1
        ? "当前为单张图片，将导出 PNG。"
        : "请先选择或打开要导出的图片。";
  }
  fitBtn.disabled = !hasImage;
  for (const button of [rotateLeftBtn, rotateRightBtn, flipHorizontalBtn, flipVerticalBtn, smoothEdgesBtn, addShadowBtn, addOutlineBtn, iconifyResizeBtn, centerCropBtn]) {
    if (button) button.disabled = !hasEditableTarget;
  }
  updateToolSessionUi();
  if (contourPixelizeBtn) contourPixelizeBtn.disabled = !hasEditableTarget;

  selectAllBtn.disabled = !hasBatch;
  clearSelectionBtn.disabled = selectedCount === 0;
  renameImageBtn.disabled = !hasBatch || (selectedCount === 0 && activeIndex < 0);
  addOriginalsToSequenceBtn.disabled = !hasBatch || (selectedCount === 0 && activeIndex < 0);

  deleteBlockBtn.disabled = !hasEditableTarget || !hasValidSelection;
  applyAllFrameEffectsBtn.disabled = !hasFrames;
  alignFramesBtn.disabled = sequenceFrames.length < 2;
  normalizeFramesBtn.disabled = !hasFrames;
  saveFramesToResultsBtn.disabled = !hasFrames;
  playFramesBtn.disabled = !hasFrames;
  if (exportFramesBtn) exportFramesBtn.disabled = !hasFrames;
  if (exportZipBtn) exportZipBtn.disabled = !hasFrames;
  exportSheetBtn.disabled = exportItemCount < 2;
  selectAllFramesBtn.disabled = !hasFrames;
  clearFrameSelectionBtn.disabled = selectedFrameCount === 0;
  openFramePickerBtn.disabled = !hasFrames;
  findDuplicateFramesBtn.disabled = sequenceFrames.length < 2;
  if (removeWatermarkBtn) removeWatermarkBtn.disabled = !hasFrames;
  clearSequenceBtn.disabled = !hasFrames;

  extractVideoBtn.disabled = !loadedVideo;
  clearVideoBtn.disabled = !loadedVideo;
  extractSheetBtn.disabled = !hasImage;
  autoExtractSubjectsBtn.disabled = !hasImage;
  selectAllAssetsBtn.disabled = !hasAssets;
  clearAssetSelectionBtn.disabled = selectedAssetCount === 0;
  if (removeUnselectedAssetsBtn) removeUnselectedAssetsBtn.disabled = selectedAssetCount === 0 || selectedAssetCount === hasAssets;
  renameAssetBtn.disabled = !hasAssets || (selectedAssetCount === 0 && !activeLibraryTarget);
  addAssetsToSequenceBtn.disabled = !hasAssets || (selectedAssetCount === 0 && !activeLibraryTarget);
  for (const button of [trimTransparentBtn, cleanPseudoAlphaBtn, fillInternalPixelsBtn]) {
    if (button) button.disabled = !hasEditableTarget;
  }
  if (rebuildAlphaBtn) rebuildAlphaBtn.disabled = !alphaWhiteImage || !alphaBlackImage;
  if (splitDualAlphaBtn) splitDualAlphaBtn.disabled = !dualAlphaSourceItem;
  if (exportAssetsZipBtn) exportAssetsZipBtn.disabled = selectedAssetCount === 0;
  clearAssetsBtn.disabled = !hasAssets;
  clearExportLocationBtn.disabled = !exportDirectoryHandle;
  const isPlayingSequence = Boolean(playbackTimer);
  playFramesBtn.textContent = isPlayingSequence ? "⏸" : "▶";
  playFramesBtn.title = isPlayingSequence ? "暂停" : "播放";
  playFramesBtn.setAttribute("aria-label", isPlayingSequence ? "暂停序列帧" : "播放序列帧");
  playFramesBtn.setAttribute("aria-pressed", String(isPlayingSequence));
  syncSequenceCanvasBar(hasFrames);
}

function markActiveLibrary(kind, options = {}) {
  activeLibraryKind = kind;
  document.body.dataset.activeLibrary = kind;
  if (options.open !== false) {
    window.libraryDockUi?.openSection(kind, {
      scroll: options.scroll !== false,
      exclusive: options.exclusive === true
    });
  }
}

function applyLibraryClickSelection(kind, list, index, event) {
  const item = list[index];
  if (!item) return;
  const additive = Boolean(event.ctrlKey || event.metaKey);
  const range = Boolean(event.shiftKey);
  const anchor = librarySelectionAnchor[kind];
  const selectedCount = list.filter((entry) => entry.selected).length;
  const preserveBatchSelection = !additive
    && !range
    && selectedCount > 0
    && (libraryBatchSelectionMode[kind] || selectedCount > 1);

  // Once a library has entered multi-select mode, a normal click is a view/add action:
  // selected items stay selected, while a previously right-click-deselected item is added back.
  if (preserveBatchSelection) {
    if (!item.selected) {
      item.selected = true;
      if (kind === "sequence") {
        frameSelectionOrder = Math.max(0, ...list.map((entry) => entry.order || 0));
        item.order = ++frameSelectionOrder;
      }
    }
    libraryBatchSelectionMode[kind] = true;
    librarySelectionAnchor[kind] = index;
    markActiveLibrary(kind, { scroll: false });
    return;
  }

  if (kind === "sequence") {
    frameSelectionOrder = Math.max(0, ...list.map((entry) => entry.order || 0));
    if (range && anchor >= 0 && anchor < list.length) {
      if (!additive) {
        list.forEach((entry) => { entry.selected = false; entry.order = 0; });
        frameSelectionOrder = 0;
      }
      const start = Math.min(anchor, index);
      const end = Math.max(anchor, index);
      for (let cursor = start; cursor <= end; cursor += 1) {
        if (!list[cursor].selected) {
          list[cursor].selected = true;
          list[cursor].order = ++frameSelectionOrder;
        }
      }
      libraryBatchSelectionMode[kind] = list.filter((entry) => entry.selected).length > 1;
    } else if (additive) {
      if (item.selected) {
        item.selected = false;
        item.order = 0;
        frameSelectionOrder = normalizeSelectionOrders(list);
      } else {
        item.selected = true;
        item.order = ++frameSelectionOrder;
      }
      libraryBatchSelectionMode[kind] = list.some((entry) => entry.selected);
      librarySelectionAnchor[kind] = index;
    } else {
      list.forEach((entry) => { entry.selected = false; entry.order = 0; });
      item.selected = true;
      item.order = 1;
      frameSelectionOrder = 1;
      libraryBatchSelectionMode[kind] = false;
      librarySelectionAnchor[kind] = index;
    }
    markActiveLibrary(kind, { scroll: false });
    return;
  }

  if (range && anchor >= 0 && anchor < list.length) {
    if (!additive) list.forEach((entry) => { entry.selected = false; });
    const start = Math.min(anchor, index);
    const end = Math.max(anchor, index);
    for (let cursor = start; cursor <= end; cursor += 1) list[cursor].selected = true;
    libraryBatchSelectionMode[kind] = list.filter((entry) => entry.selected).length > 1;
  } else if (additive) {
    item.selected = !item.selected;
    libraryBatchSelectionMode[kind] = list.some((entry) => entry.selected);
    librarySelectionAnchor[kind] = index;
  } else {
    list.forEach((entry) => { entry.selected = false; });
    item.selected = true;
    libraryBatchSelectionMode[kind] = false;
    librarySelectionAnchor[kind] = index;
  }
  markActiveLibrary(kind, { scroll: false });
}

function deselectLibraryItem(kind, list, index) {
  const item = list[index];
  if (!item || !item.selected) return false;
  const selectedBefore = list.filter((entry) => entry.selected).length;
  item.selected = false;
  if (kind === "sequence") {
    item.order = 0;
    frameSelectionOrder = normalizeSelectionOrders(list);
  }
  const selectedAfter = list.filter((entry) => entry.selected).length;
  libraryBatchSelectionMode[kind] = selectedAfter > 0 && (libraryBatchSelectionMode[kind] || selectedBefore > 1);
  if (librarySelectionAnchor[kind] === index) librarySelectionAnchor[kind] = -1;
  markActiveLibrary(kind, { scroll: false });
  return true;
}

function selectAllLibraryItems(kind, list) {
  list.forEach((item, index) => {
    item.selected = true;
    if (kind === "sequence") item.order = index + 1;
  });
  if (kind === "sequence") frameSelectionOrder = list.length;
  libraryBatchSelectionMode[kind] = list.length > 0;
  librarySelectionAnchor[kind] = list.length ? 0 : -1;
  markActiveLibrary(kind, { scroll: false });
}

function clearLibrarySelection(kind, list) {
  list.forEach((item) => { item.selected = false; if (kind === "sequence") item.order = 0; });
  if (kind === "sequence") frameSelectionOrder = 0;
  libraryBatchSelectionMode[kind] = false;
  librarySelectionAnchor[kind] = -1;
  markActiveLibrary(kind, { scroll: false });
}

function clearFrameDragIndicators() {
  document.querySelectorAll(".frame-drop-before, .frame-drop-after, .frame-dragging").forEach((node) => {
    node.classList.remove("frame-drop-before", "frame-drop-after", "frame-dragging");
  });
}

function reorderSequenceFramesByDrag(sourceIndexes, targetIndex, insertAfter) {
  const indexes = Array.from(new Set(sourceIndexes)).filter((index) => index >= 0 && index < sequenceFrames.length).sort((a, b) => a - b);
  const targetFrame = sequenceFrames[targetIndex];
  if (!indexes.length || !targetFrame || indexes.includes(targetIndex)) return;

  const activeFrame = sequenceFrames[activeFrameIndex] || null;
  const movingFrames = indexes.map((index) => sequenceFrames[index]);
  const movingSet = new Set(movingFrames);
  const remaining = sequenceFrames.filter((frame) => !movingSet.has(frame));
  let insertionIndex = remaining.indexOf(targetFrame);
  if (insertionIndex < 0) insertionIndex = remaining.length;
  else if (insertAfter) insertionIndex += 1;

  pushHistory();
  sequenceFrames = [
    ...remaining.slice(0, insertionIndex),
    ...movingFrames,
    ...remaining.slice(insertionIndex)
  ];
  activeFrameIndex = activeFrame ? sequenceFrames.indexOf(activeFrame) : -1;
  librarySelectionAnchor.sequence = activeFrameIndex;
  renumberSelectedFramesByVisualOrder();
  renderFrameList();
  if (!framePicker.hidden) renderFramePicker();
  setButtons();
  setStatus(`已拖动调整 ${movingFrames.length} 个序列帧的位置。`);
}

function installFrameDragHandlers(button, index) {
  button.draggable = true;
  button.addEventListener("dragstart", (event) => {
    draggedFrameIndexes = [index];
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedFrameIndexes.join(","));
    window.requestAnimationFrame(() => button.classList.add("frame-dragging"));
  });
  button.addEventListener("dragover", (event) => {
    if (!draggedFrameIndexes.length) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    clearFrameDragIndicators();
    button.classList.add("frame-dragging");
    const rect = button.getBoundingClientRect();
    const insertAfter = button.classList.contains("frame-item")
      ? event.clientY >= rect.top + rect.height / 2
      : event.clientX >= rect.left + rect.width / 2;
    button.classList.add(insertAfter ? "frame-drop-after" : "frame-drop-before");
  });
  button.addEventListener("dragleave", () => {
    button.classList.remove("frame-drop-before", "frame-drop-after");
  });
  button.addEventListener("drop", (event) => {
    const transferred = String(event.dataTransfer?.getData("text/plain") || "")
      .split(",")
      .map((value) => Number(value))
      .filter(Number.isInteger);
    if (!draggedFrameIndexes.length && transferred.length) draggedFrameIndexes = transferred;
    if (!draggedFrameIndexes.length) return;
    event.preventDefault();
    const rect = button.getBoundingClientRect();
    const insertAfter = button.classList.contains("frame-item")
      ? event.clientY >= rect.top + rect.height / 2
      : event.clientX >= rect.left + rect.width / 2;
    const sourceIndexes = draggedFrameIndexes.slice();
    draggedFrameIndexes = [];
    clearFrameDragIndicators();
    reorderSequenceFramesByDrag(sourceIndexes, index, insertAfter);
    frameDragJustFinished = true;
    window.setTimeout(() => { frameDragJustFinished = false; }, 80);
  });
  button.addEventListener("dragend", () => {
    draggedFrameIndexes = [];
    clearFrameDragIndicators();
  });
}

function renderImageList() {
  batchCount.value = images.length;
  imageList.innerHTML = "";
  images.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = `image-item${index === activeIndex ? " active" : ""}${item.selected ? " selected" : ""}`;
    button.type = "button";
    button.title = `${item.name}（普通点击查看；处于多选状态时会保留其他选择并补选当前项，右键仅取消当前项，Shift 选择区间，Ctrl 逐项选择，双击放大）`;
    button.innerHTML = `<i class="image-check" aria-hidden="true"></i><img alt="" src="${item.thumbnail}"><span>${item.name}</span>`;
    button.addEventListener("click", (event) => {
      applyLibraryClickSelection("original", images, index, event);
      renderImageList();
      setButtons();
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
        setProcessingSource("original", { announce: false, scrollLibrary: false });
        selectImage(index);
      }
    });
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const changed = deselectLibraryItem("original", images, index);
      renderImageList();
      setButtons();
      setStatus(changed ? `已取消选择“${item.name}”，其他已选图片保持不变。` : `“${item.name}”当前未被选择。`);
    });
    button.addEventListener("focus", () => markActiveLibrary("original", { scroll: false }));
    button.addEventListener("dblclick", (event) => {
      event.preventDefault();
      openImagePreview(item.name, item.originalImageData);
    });
    imageList.appendChild(button);
  });
  updateOriginalSourceSelectors();
}

function renderFrameList() {
  frameCount.value = sequenceFrames.length;
  frameList.innerHTML = "";
  sequenceFrames.forEach((frame, index) => {
    const button = document.createElement("button");
    button.className = `frame-item${index === activeFrameIndex ? " active" : ""}${frame.selected ? " selected" : ""}`;
    button.type = "button";
    const delayMs = normalizedFrameDelayMs(frame);
    button.title = `${frame.name}${delayMs ? `（额外停留 ${delayMs} ms）` : ""}（普通点击查看；处于多选状态时会保留其他选择并补选当前帧，右键仅取消当前帧，拖动排序，Shift 选择区间，Ctrl 逐项选择，双击放大）`;
    const selectionNumber = frame.selected && frame.order ? String(frame.order) : "";
    const delayBadge = delayMs ? `<small class="frame-delay-badge">+${delayMs}ms</small>` : "";
    button.innerHTML = `<i class="image-check frame-selection-order" aria-hidden="true">${selectionNumber}</i><img alt="" src="${frame.thumbnail}"><span class="frame-item-label"><b>${frame.name}</b>${delayBadge}</span>`;
    button.querySelector("img")?.setAttribute("draggable", "false");
    installFrameDragHandlers(button, index);
    button.addEventListener("click", (event) => {
      if (frameDragJustFinished) {
        event.preventDefault();
        frameDragJustFinished = false;
        return;
      }
      applyLibraryClickSelection("sequence", sequenceFrames, index, event);
      renderFrameList();
      if (!framePicker.hidden) renderFramePicker();
      setButtons();
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
        setProcessingSource("sequence", { announce: false, scrollLibrary: false });
        showSequenceFrame(index);
      }
    });
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const changed = deselectLibraryItem("sequence", sequenceFrames, index);
      renderFrameList();
      if (!framePicker.hidden) renderFramePicker();
      setButtons();
      setStatus(changed ? `已取消选择帧“${frame.name}”，其他已选帧保持不变。` : `帧“${frame.name}”当前未被选择。`);
    });
    button.addEventListener("focus", () => markActiveLibrary("sequence", { scroll: false }));
    button.addEventListener("dblclick", (event) => {
      event.preventDefault();
      openImagePreview(frame.name, frame.imageData);
    });
    frameList.appendChild(button);
  });
  renderSequencePlayerTimeline();
}

function renderAssetList(scrollToLatest = false) {
  assetCount.value = assetLibrary.length;
  assetList.innerHTML = "";
  assetLibrary.forEach((asset, index) => {
    const button = document.createElement("button");
    button.className = `frame-item${activeLibraryTarget === asset ? " active" : ""}${asset.selected ? " selected" : ""}`;
    button.type = "button";
    button.title = `${asset.name}（普通点击查看；处于多选状态时会保留其他选择并补选当前项，右键仅取消当前项，Shift 选择区间，Ctrl 逐项选择，双击放大）`;
    const recognitionText = asset.recognizing ? " · 识别文字中" : "";
    button.innerHTML = `<i class="image-check" aria-hidden="true"></i><img alt="" src="${asset.thumbnail}"><span>${index + 1}. ${asset.name}${recognitionText}</span>`;
    button.addEventListener("click", (event) => {
      applyLibraryClickSelection("result", assetLibrary, index, event);
      renderAssetList();
      setButtons();
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
        setProcessingSource("result", { announce: false, scrollLibrary: false });
        openWorkspaceTab("asset", asset);
      }
    });
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const changed = deselectLibraryItem("result", assetLibrary, index);
      renderAssetList();
      setButtons();
      setStatus(changed ? `已取消选择“${asset.name}”，其他已选结果保持不变。` : `“${asset.name}”当前未被选择。`);
    });
    button.addEventListener("focus", () => markActiveLibrary("result", { scroll: false }));
    button.addEventListener("dblclick", (event) => {
      event.preventDefault();
      openImagePreview(asset.name, asset.imageData);
    });
    assetList.appendChild(button);
  });
  if (scrollToLatest) assetList.scrollTop = assetList.scrollHeight;
}

function workspaceTabName(tab) {
  const prefix = tab.type === "asset" ? "结果" : tab.type === "frame" ? "帧" : "原图";
  return `${prefix} · ${tab.target.name || "未命名"}`;
}

function workspaceTabTargetExists(tab) {
  if (!tab?.target) return false;
  if (tab.type === "image") return images.includes(tab.target);
  if (tab.type === "asset") return assetLibrary.includes(tab.target);
  if (tab.type === "frame") return sequenceFrames.includes(tab.target);
  return false;
}

function pruneWorkspaceTabs() {
  const activeStillExists = workspaceTabs.some((tab) => tab.id === activeWorkspaceTabId && workspaceTabTargetExists(tab));
  workspaceTabs = workspaceTabs.filter(workspaceTabTargetExists);
  if (!activeStillExists) {
    activeWorkspaceTabId = "";
    if (activeLibraryTarget && !assetLibrary.includes(activeLibraryTarget)) activeLibraryTarget = null;
  }
}

function deleteWorkspaceTabTarget(tab) {
  if (!tab?.target) return;
  if (!workspaceTabTargetExists(tab)) {
    closeWorkspaceTab(tab.id);
    return;
  }

  pushHistory();
  const target = tab.target;
  const tabIndex = workspaceTabs.indexOf(tab);
  const wasActive = activeWorkspaceTabId === tab.id;
  let removedIndex = -1;
  let label = target.name || "未命名图片";

  if (tab.type === "image") {
    const activeTarget = images[activeIndex] || null;
    removedIndex = images.indexOf(target);
    images = images.filter((item) => item !== target);
    activeIndex = activeTarget && activeTarget !== target ? images.indexOf(activeTarget) : -1;
    librarySelectionAnchor.original = -1;
    libraryBatchSelectionMode.original = images.filter((item) => item.selected).length > 1;
  } else if (tab.type === "frame") {
    const activeTarget = sequenceFrames[activeFrameIndex] || null;
    removedIndex = sequenceFrames.indexOf(target);
    sequenceFrames = sequenceFrames.filter((frame) => frame !== target);
    activeFrameIndex = activeTarget && activeTarget !== target ? sequenceFrames.indexOf(activeTarget) : -1;
    frameSelectionOrder = normalizeSelectionOrders(sequenceFrames);
    librarySelectionAnchor.sequence = -1;
    libraryBatchSelectionMode.sequence = sequenceFrames.filter((frame) => frame.selected).length > 1;
    playbackIndex = Math.min(playbackIndex, Math.max(0, sequenceFrames.length - 1));
    if (!sequenceFrames.length) stopPlayback();
  } else {
    removedIndex = assetLibrary.indexOf(target);
    assetLibrary = assetLibrary.filter((asset) => asset !== target);
    if (activeLibraryTarget === target) activeLibraryTarget = null;
    librarySelectionAnchor.result = -1;
    libraryBatchSelectionMode.result = assetLibrary.filter((asset) => asset.selected).length > 1;
  }

  workspaceTabs = workspaceTabs.filter((item) => item.target !== target);

  if (wasActive) {
    activeWorkspaceTabId = "";
    activeLibraryTarget = null;
    const fallbackTab = workspaceTabs[Math.min(Math.max(tabIndex, 0), workspaceTabs.length - 1)] || workspaceTabs[workspaceTabs.length - 1];
    if (fallbackTab) {
      activateWorkspaceTab(fallbackTab);
    } else if (tab.type === "image" && images.length) {
      openWorkspaceTab("image", images[Math.min(Math.max(removedIndex, 0), images.length - 1)]);
    } else if (tab.type === "frame" && sequenceFrames.length) {
      openWorkspaceTab("frame", sequenceFrames[Math.min(Math.max(removedIndex, 0), sequenceFrames.length - 1)]);
    } else if (tab.type === "asset" && assetLibrary.length) {
      openWorkspaceTab("asset", assetLibrary[Math.min(Math.max(removedIndex, 0), assetLibrary.length - 1)]);
    } else {
      clearImageWorkspace();
      renderWorkspaceTabs();
    }
  } else {
    renderImageList();
    renderFrameList();
    renderAssetList();
    renderWorkspaceTabs();
    setButtons();
  }

  setStatus(`已删除“${label}”，对应的顶部标签和素材库项目已同步移除。`);
}

function renderWorkspaceTabs() {
  pruneWorkspaceTabs();
  canvasTabs.innerHTML = "";
  workspaceTabs.forEach((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `canvas-tab${tab.id === activeWorkspaceTabId ? " active" : ""}`;
    button.title = `${workspaceTabName(tab)}（左键切换，鼠标右键删除）`;
    const thumbnail = tab.target.thumbnail || makeThumbnail(tab.target.imageData || tab.target.originalImageData);
    button.innerHTML = `<img class="canvas-tab-thumb" alt="" src="${thumbnail}">`;
    button.addEventListener("click", () => activateWorkspaceTab(tab));
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      deleteWorkspaceTabTarget(tab);
    });
    canvasTabs.appendChild(button);
  });
}

function ensureWorkspaceTab(type, target) {
  let tab = workspaceTabs.find((item) => item.type === type && item.target === target);
  if (!tab) {
    tab = { id: `canvas-${++workspaceTabCounter}`, type, target };
    workspaceTabs.push(tab);
  }
  return tab;
}

function openWorkspaceTab(type, target) {
  activateWorkspaceTab(ensureWorkspaceTab(type, target));
}

function closeWorkspaceTab(id) {
  const index = workspaceTabs.findIndex((tab) => tab.id === id);
  if (index < 0) return;
  const wasActive = activeWorkspaceTabId === id;
  workspaceTabs.splice(index, 1);
  if (wasActive) {
    const next = workspaceTabs[Math.min(index, workspaceTabs.length - 1)];
    if (next) {
      activateWorkspaceTab(next);
      return;
    }
    activeWorkspaceTabId = "";
    activeLibraryTarget = null;
    clearImageWorkspace();
  }
  renderWorkspaceTabs();
}

function removeWorkspaceTabsForTargets(targets) {
  const removed = new Set(targets);
  const activeRemoved = workspaceTabs.some((tab) => tab.id === activeWorkspaceTabId && removed.has(tab.target));
  workspaceTabs = workspaceTabs.filter((tab) => !removed.has(tab.target));
  if (activeRemoved) {
    activeWorkspaceTabId = "";
    activeLibraryTarget = null;
  }
  renderWorkspaceTabs();
}

function activateWorkspaceTab(tab) {
  if (outlinePreviewActive && outlinePreviewTarget && outlinePreviewTarget !== tab.target) {
    clearOutlinePreviewState({ restore: true });
  }
  activeWorkspaceTabId = tab.id;
  activeLibraryTarget = null;
  if (tab.type === "image") {
    setProcessingSource("original", { announce: false, scrollLibrary: false });
    selectImage(images.indexOf(tab.target), false);
  } else if (tab.type === "frame") {
    setProcessingSource("sequence", { announce: false, scrollLibrary: false });
    showSequenceFrame(sequenceFrames.indexOf(tab.target), false);
  } else {
    stopPlayback();
    setProcessingSource("result", { announce: false, scrollLibrary: false });
    activeIndex = -1;
    activeFrameIndex = -1;
    activeLibraryTarget = tab.target;
    currentImageData = tab.target.imageData;
    originalImageData = tab.target.imageData;
    liveBaseImageData = null;
    pickedColors = [];
    cropSelection = null;
    hideCropBox();
    clearLassoSelection();
    showResultMode();
    renderCanvas();
    renderSwatches();
    renderImageList();
    renderAssetList();
    renderWorkspaceTabs();
    setButtons();
  }
}

function normalizeSelectionOrders(list) {
  const selected = list
    .filter((frame) => frame.selected)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  selected.forEach((frame, index) => {
    frame.order = index + 1;
  });
  list.filter((frame) => !frame.selected).forEach((frame) => {
    frame.order = 0;
  });
  return selected.length;
}

function renumberSelectedFramesByVisualOrder() {
  let order = 0;
  sequenceFrames.forEach((frame) => {
    frame.order = frame.selected ? ++order : 0;
  });
  frameSelectionOrder = order;
}

function frameFingerprint(imageData, size = 18) {
  const source = document.createElement("canvas");
  source.width = imageData.width;
  source.height = imageData.height;
  const sourceCtx = source.getContext("2d");
  sourceCtx.putImageData(imageData, 0, 0);

  const reduced = document.createElement("canvas");
  reduced.width = size;
  reduced.height = size;
  const reducedCtx = reduced.getContext("2d", { willReadFrequently: true });
  reducedCtx.imageSmoothingEnabled = true;
  reducedCtx.imageSmoothingQuality = "high";
  reducedCtx.clearRect(0, 0, size, size);
  reducedCtx.drawImage(source, 0, 0, size, size);

  const pixels = reducedCtx.getImageData(0, 0, size, size).data;
  const values = [];
  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3] / 255;
    const gray = pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114;
    values.push(Math.round(gray * alpha + 255 * (1 - alpha)));
  }
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.map((value) => (value >= average ? "1" : "0")).join("");
}

function hammingDistance(left, right) {
  if (left.length !== right.length) return Infinity;
  let distance = 0;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) distance += 1;
  }
  return distance;
}

function findDuplicateFramesInList(list, options) {
  if (list.length < 2) return;

  list.forEach((frame) => {
    frame.selected = false;
    frame.order = 0;
  });

  const fingerprints = list.map((frame) => frameFingerprint(frame.imageData));
  const maxDistance = 4;
  let bestPair = null;
  let bestScore = Infinity;

  for (let index = 0; index < list.length - 1; index += 1) {
    for (let next = index + 1; next < list.length; next += 1) {
      const distance = hammingDistance(fingerprints[index], fingerprints[next]);
      if (distance <= maxDistance) {
        const span = next - index;
        const score = distance * 1000 - span;
        if (!bestPair || score < bestScore) {
          bestPair = [index, next, distance];
          bestScore = score;
        }
      }
    }
  }

  if (bestPair) {
    const [startIndex, endIndex] = bestPair;
    for (let index = startIndex; index <= endIndex; index += 1) {
      list[index].selected = true;
      list[index].order = ++options.orderCounter;
    }
  }
  options.orderCounter = normalizeSelectionOrders(list);

  options.render();
  setButtons();

  const duplicateCount = list.filter((frame) => frame.selected).length;
  if (duplicateCount === 0) {
    setStatus(`${options.label}中未找到可形成循环的一对相同帧。`);
  } else {
    setStatus(`${options.label}找到重复边界：第 ${bestPair[0] + 1} 帧和第 ${bestPair[1] + 1} 帧，已选中其间全部 ${duplicateCount} 帧。`);
  }
  return options.orderCounter;
}



function findDuplicateSequenceFrames() {
  frameSelectionOrder = findDuplicateFramesInList(sequenceFrames, {
    label: "序列帧处理区",
    orderCounter: 0,
    render: () => {
      renderFrameList();
      if (!framePicker.hidden) renderFramePicker();
    }
  }) || 0;
}

function orderedSelectedFrames(list) {
  return list
    .filter((frame) => frame.selected)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}







function renderFramePicker() {
  const selectedCount = sequenceFrames.filter((frame) => frame.selected).length;
  framePickerInfo.textContent = `${selectedCount}/${sequenceFrames.length} 已选择，可拖动缩略图排序`;
  framePickerGrid.innerHTML = "";
  sequenceFrames.forEach((frame, index) => {
    const button = document.createElement("button");
    button.className = `picker-frame${frame.selected ? " selected" : ""}`;
    button.type = "button";
    const delayMs = normalizedFrameDelayMs(frame);
    button.title = `${frame.name}${delayMs ? `（额外停留 ${delayMs} ms）` : ""}（拖动排序）`;
    const selectionNumber = frame.selected && frame.order ? String(frame.order) : "";
    const delayBadge = delayMs ? `<small class="frame-delay-badge">+${delayMs}ms</small>` : "";
    button.innerHTML = `<span class="picker-frame-media"><img alt="" src="${frame.thumbnail}"><i class="picker-frame-check" aria-hidden="true">${selectionNumber}</i></span><span class="picker-frame-label"><b>${frame.name}</b>${delayBadge}</span>`;
    button.querySelector("img")?.setAttribute("draggable", "false");
    installFrameDragHandlers(button, index);
    button.addEventListener("click", (event) => {
      if (frameDragJustFinished) {
        event.preventDefault();
        frameDragJustFinished = false;
        return;
      }
      applyLibraryClickSelection("sequence", sequenceFrames, index, event);
      renderFramePicker();
      renderFrameList();
      setButtons();
    });
    button.addEventListener("dblclick", () => showSequenceFrame(index));
    framePickerGrid.appendChild(button);
  });
}

function openFramePicker() {
  if (sequenceFrames.length === 0) return;
  renderFramePicker();
  framePicker.hidden = false;
}

function closeFramePicker() {
  framePicker.hidden = true;
  renderFrameList();
  setButtons();
}

function clearSequenceFrames() {
  if (sequenceFrames.length === 0) return;
  pushHistory();
  stopPlayback();
  const removedFrames = sequenceFrames.slice();
  const removedActiveTab = workspaceTabs.some((tab) => tab.id === activeWorkspaceTabId && removedFrames.includes(tab.target));
  sequenceFrames = [];
  removeWorkspaceTabsForTargets(removedFrames);
  activeFrameIndex = -1;
  playbackIndex = 0;
  frameSelectionOrder = 0;
  cropSelection = null;
  hideCropBox();
  clearLassoSelection();
  if (removedActiveTab) {
    const fallbackTab = workspaceTabs[workspaceTabs.length - 1];
    if (fallbackTab) activateWorkspaceTab(fallbackTab);
    else clearImageWorkspace();
  } else if (!currentImageData) {
    canvas.classList.remove("ready");
    selectionCanvas.classList.remove("ready");
    emptyState.hidden = false;
  } else {
    renderCanvas();
  }
  renderFrameList();
  if (!framePicker.hidden) closeFramePicker();
  setButtons();
  setStatus("已清空序列帧工作区，并同步移除相关顶部标签。");
}

function renderSwatches() {
  swatches.innerHTML = "";
  pickedColors.forEach((color, index) => {
    const button = document.createElement("button");
    button.className = "swatch";
    button.type = "button";
    button.title = `移除颜色 ${index + 1}`;
    button.ariaLabel = `移除颜色 ${index + 1}`;
    button.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
    button.addEventListener("click", () => {
      pickedColors.splice(index, 1);
      invalidateLiveDistanceCache({ keepTarget: true, keepProxy: true });
      renderSwatches();
      scheduleLivePreview({ fast: true });
      setButtons();
    });
    swatches.appendChild(button);
  });
}


function imageDataCanvas(imageData) {
  const work = document.createElement("canvas");
  work.width = imageData.width;
  work.height = imageData.height;
  work.getContext("2d").putImageData(imageData, 0, 0);
  return work;
}

function toolSessionMatchesCurrent() {
  return Boolean(toolSession && currentImageData && toolSession.sourceImageRef === currentImageData);
}

function currentToolSourceName() {
  return selectedFrame()?.name || currentSourceRecord()?.name || activeLibraryTarget?.name || images[activeIndex]?.name || "素材";
}

function ensureToolSession(mode = clickMode) {
  if (!currentImageData) return null;
  if (toolSession && toolSession.sourceImageRef === currentImageData) {
    toolSession.mode = mode;
    updateToolSessionUi();
    return toolSession;
  }
  if (toolSession) cancelToolSession({ silent: true });
  const editable = currentEditableImageTarget();
  const inheritedPlacement = editable?.kind === "result"
    ? cloneSequencePlacement(editable.target?.sequencePlacement)
    : null;
  toolSession = {
    id: ++toolSessionCounter,
    mode,
    sourceImageRef: currentImageData,
    sourceTarget: editable?.target || null,
    sourceKind: editable?.kind || processingSource,
    sourceName: currentToolSourceName(),
    width: currentImageData.width,
    height: currentImageData.height,
    sequencePlacementBase: inheritedPlacement || {
      canvasWidth: currentImageData.width,
      canvasHeight: currentImageData.height,
      offsetX: 0,
      offsetY: 0,
      sourceOffsetX: 0,
      sourceOffsetY: 0,
      sourceKind: editable?.kind || processingSource
    },
    workingBase: cloneImageData(currentImageData),
    busy: false,
    items: [],
    activeItemId: null
  };
  stage.classList.add("tool-session-active");
  updateToolSessionUi();
  return toolSession;
}

function cancelToolSession(options = {}) {
  if (!toolSession) {
    updateToolSessionUi();
    return;
  }
  toolSession = null;
  toolItemDragging = false;
  toolItemDragOffset = null;
  toolItemPointerHandled = false;
  stage.classList.remove("tool-session-active", "tool-session-busy");
  extractModeBtn?.classList.remove("extracting");
  finishToolBtn?.classList.remove("ready");
  hideCropBox();
  clearLassoSelection();
  if (currentImageData) {
    drawImageData(showOriginal ? originalImageData : currentImageData);
    updateSelectionCanvas();
  }
  updateToolSessionUi();
  if (!options.silent) setStatus("已取消，画布已恢复到进入提取或裁剪前的状态，未保存任何结果。");
}

function cancelActiveToolSession(options = {}) {
  cancelToolSession(options);
  setClickMode("view", { silent: true, preserveToolSession: true });
  setButtons();
}

function activeToolSessionModeButton() {
  if (clickMode === "extract") return extractModeBtn;
  if (clickMode === "crop") return cropModeBtn;
  if (clickMode === "lasso") return lassoModeBtn;
  return null;
}

function placeToolSessionActionsBesideActiveMode() {
  const activeButton = activeToolSessionModeButton();
  if (!activeButton || !cancelToolBtn || !finishToolBtn || !activeButton.parentElement) return;
  activeButton.after(cancelToolBtn, finishToolBtn);
}

function updateToolSessionUi() {
  const count = toolSession?.items.length || 0;
  const sessionVisible = Boolean(toolSession && ["extract", "crop", "lasso"].includes(clickMode));
  const busy = Boolean(toolSession?.busy);
  if (sessionVisible) placeToolSessionActionsBesideActiveMode();
  if (cancelToolBtn) {
    cancelToolBtn.hidden = !sessionVisible;
    cancelToolBtn.disabled = !sessionVisible || busy;
  }
  if (finishToolBtn) {
    finishToolBtn.hidden = !sessionVisible;
    finishToolBtn.disabled = !sessionVisible || busy || count === 0;
    finishToolBtn.textContent = count > 0 ? `完成 (${count})` : "完成";
    finishToolBtn.classList.toggle("ready", sessionVisible && count > 0 && !busy);
  }
  stage.classList.toggle("tool-session-active", sessionVisible);
}

function renderToolSessionPreview() {
  if (!toolSession) return false;
  // The source remains on the base canvas. Extracted/cropped pixels are rendered on the
  // independent overlay canvas so they stay visible when dragged beyond the source image.
  ctx.putImageData(toolSession.workingBase, 0, 0);
  updateSelectionCanvas();
  return true;
}

function createOutlineCanvas(imageData, color = "#2db7a3", radius = 2) {
  const source = imageDataCanvas(imageData);
  const pad = Math.max(1, radius + 1);
  const output = document.createElement("canvas");
  output.width = imageData.width + pad * 2;
  output.height = imageData.height + pad * 2;
  const out = output.getContext("2d");
  const mask = document.createElement("canvas");
  mask.width = imageData.width;
  mask.height = imageData.height;
  const maskCtx = mask.getContext("2d");
  maskCtx.drawImage(source, 0, 0);
  maskCtx.globalCompositeOperation = "source-in";
  maskCtx.fillStyle = color;
  maskCtx.fillRect(0, 0, mask.width, mask.height);
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      if (dx * dx + dy * dy > radius * radius) continue;
      out.drawImage(mask, pad + dx, pad + dy);
    }
  }
  out.globalCompositeOperation = "destination-out";
  out.drawImage(source, pad, pad);
  out.globalCompositeOperation = "source-over";
  return { canvas: output, pad };
}

function drawToolSessionLayers(context) {
  if (!toolSession) return;
  for (const item of toolSession.items) {
    if (!item.canvas) item.canvas = imageDataCanvas(item.imageData);
    context.drawImage(item.canvas, Math.round(item.x), Math.round(item.y));
  }
}

function drawToolSessionOutlines(context) {
  if (!toolSession) return;
  for (const item of toolSession.items) {
    const active = item.id === toolSession.activeItemId;
    const cacheKey = active ? "activeOutline" : "outline";
    if (!item[cacheKey]) item[cacheKey] = createOutlineCanvas(item.imageData, active ? "#ff9f43" : "#18a999", active ? 3 : 2);
    const outline = item[cacheKey];
    context.drawImage(outline.canvas, Math.round(item.x - outline.pad), Math.round(item.y - outline.pad));
    context.save();
    context.setLineDash(active ? [7, 4] : [4, 4]);
    context.lineWidth = active ? 2.5 : 1.5;
    context.strokeStyle = active ? "#ff9f43" : "#18a999";
    context.strokeRect(Math.round(item.x) + 0.5, Math.round(item.y) + 0.5, item.imageData.width, item.imageData.height);
    context.restore();
  }
}

function hitTestToolItem(point) {
  if (!toolSession) return null;
  for (let index = toolSession.items.length - 1; index >= 0; index -= 1) {
    const item = toolSession.items[index];
    const x = Math.floor(point.x - item.x);
    const y = Math.floor(point.y - item.y);
    if (x < 0 || y < 0 || x >= item.imageData.width || y >= item.imageData.height) continue;
    if (item.imageData.data[(y * item.imageData.width + x) * 4 + 3] > 8) return item;
  }
  return null;
}

function restoreToolItemToWorkingBase(session, item) {
  const sourceX = Math.round(Number.isFinite(item.sourceX) ? item.sourceX : item.x);
  const sourceY = Math.round(Number.isFinite(item.sourceY) ? item.sourceY : item.y);
  const source = item.imageData.data;
  const target = session.workingBase.data;
  for (let y = 0; y < item.imageData.height; y += 1) {
    const ty = sourceY + y;
    if (ty < 0 || ty >= session.height) continue;
    for (let x = 0; x < item.imageData.width; x += 1) {
      const tx = sourceX + x;
      if (tx < 0 || tx >= session.width) continue;
      const sourceIndex = (y * item.imageData.width + x) * 4;
      if (source[sourceIndex + 3] <= 0) continue;
      const targetIndex = (ty * session.width + tx) * 4;
      target[targetIndex] = source[sourceIndex];
      target[targetIndex + 1] = source[sourceIndex + 1];
      target[targetIndex + 2] = source[sourceIndex + 2];
      target[targetIndex + 3] = source[sourceIndex + 3];
    }
  }
}

function cancelToolItemAtEvent(event) {
  if (!toolSession || !["extract", "crop", "lasso"].includes(clickMode)) return false;
  const point = getLooseCanvasPoint(event);
  const item = point ? hitTestToolItem(point) : null;
  if (!item) return false;
  restoreToolItemToWorkingBase(toolSession, item);
  toolSession.items = toolSession.items.filter((entry) => entry !== item);
  toolSession.activeItemId = toolSession.items.at(-1)?.id || null;
  toolItemDragging = false;
  toolItemDragOffset = null;
  renderToolSessionPreview();
  updateSelectionCanvas();
  updateToolSessionUi();
  setButtons();
  const label = item.kind === "extract" ? "主体提取" : "裁剪";
  setStatus(`已取消当前${label}浮动图层，并把像素恢复到原位置；其他浮动图层保持不变。`);
  event.preventDefault();
  event.stopPropagation();
  return true;
}

function startToolItemDrag(event) {
  if (!toolSession || !["extract", "crop", "lasso"].includes(clickMode)) return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  const item = hitTestToolItem(point);
  if (!item) return false;
  toolSession.activeItemId = item.id;
  toolItemDragging = true;
  toolItemPointerHandled = true;
  toolItemDragOffset = { x: point.x - item.x, y: point.y - item.y };
  event.currentTarget.setPointerCapture?.(event.pointerId);
  renderToolSessionPreview();
  updateSelectionCanvas();
  event.preventDefault();
  return true;
}

function moveToolItemDrag(event) {
  if (!toolItemDragging || !toolSession) return false;
  const point = getLooseCanvasPoint(event);
  const item = toolSession.items.find((entry) => entry.id === toolSession.activeItemId);
  if (!point || !item) return false;
  const bounds = getToolWorkspaceBounds();
  const maxX = Math.max(bounds.minX, bounds.maxX - item.imageData.width);
  const maxY = Math.max(bounds.minY, bounds.maxY - item.imageData.height);
  item.x = Math.max(bounds.minX, Math.min(maxX, point.x - (toolItemDragOffset?.x || 0)));
  item.y = Math.max(bounds.minY, Math.min(maxY, point.y - (toolItemDragOffset?.y || 0)));
  renderToolSessionPreview();
  updateSelectionCanvas();
  event.preventDefault();
  return true;
}

function endToolItemDrag(event) {
  if (!toolItemDragging) return false;
  toolItemDragging = false;
  toolItemDragOffset = null;
  event.currentTarget.releasePointerCapture?.(event.pointerId);
  renderToolSessionPreview();
  updateSelectionCanvas();
  setStatus("已移动浮动图层。可继续提取或裁剪，点击“完成”后统一保存到处理结果库。");
  event.preventDefault();
  window.setTimeout(() => { toolItemPointerHandled = false; }, 0);
  return true;
}

function commitToolSessionBase(session) {
  const next = cloneImageData(session.workingBase);
  const editable = currentEditableImageTarget();
  if (editable?.target === session.sourceTarget) {
    if (editable.kind === "sequence") editable.target.imageData = next;
    else if (editable.kind === "result") {
      editable.target.imageData = next;
      editable.target.previewImageData = null;
    } else editable.target.currentImageData = next;
    invalidateFullResolutionSource(editable.target);
    if (editable.kind !== "original") editable.target.thumbnail = makeThumbnail(next);
  }
  currentImageData = next;
  if (session.sourceKind !== "original") originalImageData = next;
}

async function finishToolSession() {
  if (!toolSession || toolSession.busy || toolSession.items.length === 0) return;
  const session = toolSession;
  pushHistory();
  const created = [];
  session.items.forEach((item, index) => {
    const standaloneLayer = cloneImageData(item.imageData);
    const basePlacement = cloneSequencePlacement(session.sequencePlacementBase) || {
      canvasWidth: session.width,
      canvasHeight: session.height,
      offsetX: 0,
      offsetY: 0,
      sourceOffsetX: 0,
      sourceOffsetY: 0,
      sourceKind: session.sourceKind
    };
    const localSourceX = Math.round(Number.isFinite(item.sourceX) ? item.sourceX : item.x);
    const localSourceY = Math.round(Number.isFinite(item.sourceY) ? item.sourceY : item.y);
    const sequencePlacement = {
      canvasWidth: basePlacement.canvasWidth,
      canvasHeight: basePlacement.canvasHeight,
      offsetX: basePlacement.offsetX + localSourceX,
      offsetY: basePlacement.offsetY + localSourceY,
      sourceOffsetX: basePlacement.offsetX + localSourceX,
      sourceOffsetY: basePlacement.offsetY + localSourceY,
      sourceKind: item.kind
    };
    const asset = addProcessedAsset(standaloneLayer, session.sourceName, item.kind === "extract" ? "extractSubject" : "crop", {
      sourceKind: session.sourceKind,
      name: `${session.sourceName}-${item.kind === "extract" ? "主体" : "裁剪"}-${String(index + 1).padStart(2, "0")}`,
      sequencePlacement
    });
    created.push(asset);
  });
  commitToolSessionBase(session);
  toolSession = null;
  stage.classList.remove("tool-session-active", "tool-session-busy");
  extractModeBtn?.classList.remove("extracting");
  hideCropBox();
  clearLassoSelection();
  clickMode = "view";
  renderCanvas();
  renderImageList();
  renderAssetList(true);
  renderFrameList();
  renderWorkspaceTabs();
  updateToolSessionUi();
  setClickMode("view", { silent: true, preserveToolSession: true });
  setButtons();
  const queuedRecognition = queueAssetsTextRecognition(created);
  markActiveLibrary("result");
  setStatus(`已完成，共保存 ${created.length} 个独立图层到处理结果库；已同时记录原画布尺寸与主体原始坐标，加入序列帧时会自动恢复。${queuedRecognition > 0 ? " 正在执行文字识别，结果项会显示“识别文字中”。" : ""}`);
}

function showBrushSizePopover() {
  if (!brushSizePopover || !brushModeBtn) return;
  hideEraserSizePopover();
  brushSizePopover.hidden = false;
  const tools = brushModeBtn.closest("#canvasMainTools");
  if (tools) brushSizePopover.style.left = `${Math.max(4, brushModeBtn.offsetLeft)}px`;
  updateRangeLabels();
syncBrushPaletteControls();
drawBrushColorPalette();
}

function hideBrushSizePopover() {
  if (brushSizePopover) brushSizePopover.hidden = true;
}

function showEraserSizePopover() {
  if (!eraserSizePopover || !eraserModeBtn) return;
  hideBrushSizePopover();
  eraserSizePopover.hidden = false;
  const tools = eraserModeBtn.closest("#canvasMainTools");
  if (tools) eraserSizePopover.style.left = `${Math.max(4, eraserModeBtn.offsetLeft)}px`;
}

function hideEraserSizePopover() {
  if (eraserSizePopover) eraserSizePopover.hidden = true;
}

function drawImageData(imageData) {
  if (toolSession && !showOriginal && imageData === currentImageData && toolSessionMatchesCurrent()) {
    renderToolSessionPreview();
    return;
  }
  const shadowOptions = shadowEditor && clickMode === "shadow" && !showOriginal
    ? currentShadowOptionsFor(imageData)
    : null;
  const preview = shadowOptions ? addGroundShadowImageData(imageData, shadowOptions) : imageData;
  ctx.putImageData(preview, 0, 0);
}

function activeTargetUsesPixelPreview() {
  if (activeLibraryTarget) return Boolean(activeLibraryTarget.pixelatedPreview);
  if (activeFrameIndex >= 0 && sequenceFrames[activeFrameIndex]) return Boolean(sequenceFrames[activeFrameIndex].pixelatedPreview);
  if (activeIndex >= 0 && images[activeIndex]) return Boolean(images[activeIndex].pixelatedPreview);
  return false;
}

function updatePixelPreviewRendering() {
  const enabled = activeTargetUsesPixelPreview();
  canvas.classList.toggle("contour-pixel-preview", enabled);
  selectionCanvas.classList.toggle("contour-pixel-preview", enabled);
}

function renderCanvas() {
  if (!currentImageData) return;
  canvas.width = currentImageData.width;
  canvas.height = currentImageData.height;
  selectionCanvas.width = canvas.width;
  selectionCanvas.height = canvas.height;
  drawImageData(showOriginal ? originalImageData : currentImageData);
  updatePixelPreviewRendering();
  canvas.classList.add("ready");
  selectionCanvas.classList.add("ready");
  emptyState.hidden = true;
  fitCanvas();
  updateCropBox();
  updateSelectionCanvas();
}

function renderPreviewImageData(imageData) {
  if (!imageData) return;
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  selectionCanvas.width = imageData.width;
  selectionCanvas.height = imageData.height;
  drawImageData(imageData);
  updatePixelPreviewRendering();
  canvas.classList.add("ready");
  selectionCanvas.classList.add("ready");
  emptyState.hidden = true;
  fitCanvas();
  updateSelectionCanvas();
}

function fitCanvas(resetZoom = false) {
  if (!canvas.width || !canvas.height) return;
  if (resetZoom) zoomLevel = 1;
  const stageStyle = window.getComputedStyle(stage);
  const horizontalPadding = Number.parseFloat(stageStyle.paddingLeft) + Number.parseFloat(stageStyle.paddingRight);
  const verticalPadding = Number.parseFloat(stageStyle.paddingTop) + Number.parseFloat(stageStyle.paddingBottom);
  const maxWidth = Math.max(1, stage.clientWidth - horizontalPadding);
  const maxHeight = Math.max(1, stage.clientHeight - verticalPadding);
  const fitScale = Math.min(1, maxWidth / canvas.width, maxHeight / canvas.height);
  scale = fitScale * zoomLevel;
  const displayWidth = Math.max(1, Math.round(canvas.width * scale));
  const displayHeight = Math.max(1, Math.round(canvas.height * scale));
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;
  if (canvasScene) {
    canvasScene.style.width = `${displayWidth}px`;
    canvasScene.style.height = `${displayHeight}px`;
  }
  selectionCanvas.style.width = canvas.style.width;
  selectionCanvas.style.height = canvas.style.height;
  updateCropBox();
  updateSelectionCanvas();
}

function fitSmallIconPreview() {
  if (!canvas.width || !canvas.height) return;
  const longest = Math.max(canvas.width, canvas.height);
  if (longest > 160) {
    fitCanvas(true);
    return;
  }
  const targetPreviewSize = Math.min(360, Math.max(220, longest * 8));
  zoomLevel = Math.max(1, Math.min(10, targetPreviewSize / longest));
  fitCanvas(false);
}

function scheduleCanvasLayout() {
  if (!canvas.classList.contains("ready") || canvasLayoutFrame) return;
  canvasLayoutFrame = window.requestAnimationFrame(() => {
    canvasLayoutFrame = 0;
    fitCanvas();
  });
}

function setClickMode(mode, options = {}) {
  const allowedModes = new Set(["view", "pick", "extract", "crop", "lasso", "brush", "eraser", "watermark", "shadow"]);
  const nextMode = allowedModes.has(mode) ? mode : "view";
  const interactiveModes = new Set(["extract", "crop", "lasso"]);
  if (toolSession && !interactiveModes.has(nextMode) && !options.preserveToolSession) {
    cancelToolSession({ silent: true });
  }
  const cancelledShadow = clickMode === "shadow" && nextMode !== "shadow" && shadowEditor;
  if (cancelledShadow) {
    shadowEditor = null;
    shadowDragging = false;
    shadowDragOffset = null;
    if (addShadowBtn) addShadowBtn.textContent = "添加底部阴影";
  }
  clickMode = nextMode;
  if (interactiveModes.has(clickMode) && currentImageData) ensureToolSession(clickMode);
  pickModeBtn?.classList.toggle("active", clickMode === "pick");
  extractModeBtn?.classList.toggle("active", clickMode === "extract");
  cropModeBtn?.classList.toggle("active", clickMode === "crop");
  lassoModeBtn?.classList.toggle("active", clickMode === "lasso");
  brushModeBtn?.classList.toggle("active", clickMode === "brush");
  eraserModeBtn?.classList.toggle("active", clickMode === "eraser");
  removeWatermarkBtn?.classList.toggle("active", clickMode === "watermark");
  addShadowBtn?.classList.toggle("active", clickMode === "shadow");
  const cursor = clickMode === "extract" ? "cell" : (clickMode === "eraser" || clickMode === "brush") ? "none" : clickMode === "shadow" ? "move" : clickMode === "view" ? "default" : "crosshair";
  canvas.style.cursor = cursor;
  stage.style.cursor = cursor;
  if (clickMode !== "brush") {
    brushDrawing = false;
    brushErasing = false;
    brushPreviewPoint = null;
    lastBrushPoint = null;
    brushPointerId = null;
    if (brushLongPressTimer) { window.clearTimeout(brushLongPressTimer); brushLongPressTimer = null; }
    brushLongPressPoint = null;
    brushLongPressMoved = false;
    brushLongPressActive = false;
    brushLongPressClient = null;
    brushCursor.classList.remove("visible", "erase", "pixel-precision");
    brushPickIndicator.classList.remove("visible", "loading", "picked");
    brushPickIndicator.hidden = true;
    hideBrushSizePopover();
  }
  if (clickMode !== "eraser") {
    eraserPreviewPoint = null;
    lastEraserPoint = null;
    eraserCursor.classList.remove("visible");
    hideEraserSizePopover();
  }
  cropBox.classList.toggle("watermark-box", clickMode === "watermark");
  updateSelectionCanvas();
  updateToolSessionUi();
  if (cancelledShadow && currentImageData) drawImageData(showOriginal ? originalImageData : currentImageData);
  if (!currentImageData || options.silent) return;
  if (clickMode === "extract") {
    setStatus("主体提取：点击主体生成独立浮动图层；可在整个画布工作区拖动，最后点击“完成”。");
  } else if (clickMode === "crop") {
    setStatus("矩形裁剪：拖出区域后生成独立浮动图层；可越过原图边界拖动，最后点击“完成”。");
  } else if (clickMode === "lasso") {
    setStatus("自由裁剪：按住鼠标圈选，松开后生成独立浮动图层；可在整个画布工作区拖动。");
  } else if (clickMode === "brush") {
    setStatus("画笔模式：左键绘画，右键擦除，左键双击油漆桶填充；在画布上长按约 1 秒可取色，并显示放大镜辅助选色。画笔大小在按钮下方调节。");
  } else if (clickMode === "eraser") {
    setStatus("橡皮擦模式：直接修改当前图。橡皮大小在按钮下方调节，点击画布后自动收起。");
  } else if (clickMode === "watermark") {
    setStatus("去除水印：在当前帧拖出水印区域，松开后会把同一相对区域清除到全部序列帧。");
  } else if (clickMode === "shadow") {
    setStatus("阴影调整：拖动画布上的阴影可实时查看位置，调整强度和大小后点击“确认底部阴影”。");
  } else if (clickMode === "pick") {
    setStatus("取背景色模式：点击背景颜色即可实时预览，确认后保存抠图结果。");
  } else {
    setStatus("画布浏览模式：请选择取色、提取、裁剪、画笔或橡皮擦工具。");
  }
}


window.setCanvasToolMode = setClickMode;
window.getCanvasToolMode = () => clickMode;

function selectedFrame() {
  return activeFrameIndex >= 0 ? sequenceFrames[activeFrameIndex] : null;
}



function imageDataFromImage(img) {
  const ratio = Math.min(1, maxCanvasSide / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * ratio);
  const height = Math.round(img.naturalHeight * ratio);
  const work = document.createElement("canvas");
  work.width = width;
  work.height = height;
  const workCtx = work.getContext("2d", { willReadFrequently: true });
  workCtx.drawImage(img, 0, 0, width, height);
  return workCtx.getImageData(0, 0, width, height);
}

function makeThumbnail(imageData) {
  const size = 88;
  const work = document.createElement("canvas");
  const ratio = Math.min(size / imageData.width, size / imageData.height);
  work.width = Math.max(1, Math.round(imageData.width * ratio));
  work.height = Math.max(1, Math.round(imageData.height * ratio));
  const workCtx = work.getContext("2d");
  const bitmap = document.createElement("canvas");
  bitmap.width = imageData.width;
  bitmap.height = imageData.height;
  bitmap.getContext("2d").putImageData(imageData, 0, 0);
  workCtx.drawImage(bitmap, 0, 0, work.width, work.height);
  return work.toDataURL("image/png");
}

const transparentThumbnail = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

async function makeThumbnailAsync(imageData) {
  const size = 88;
  const ratio = Math.min(size / imageData.width, size / imageData.height);
  const width = Math.max(1, Math.round(imageData.width * ratio));
  const height = Math.max(1, Math.round(imageData.height * ratio));
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(imageData, {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: "high"
    });
    const work = document.createElement("canvas");
    work.width = width;
    work.height = height;
    work.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    return work.toDataURL("image/png");
  }
  return makeThumbnail(imageData);
}

function scheduleAssetThumbnail(asset) {
  const thumbnailSource = asset.previewImageData || asset.imageData;
  const scheduledImageData = asset.imageData;
  const start = () => {
    if (!assetLibrary.includes(asset)) return;
    makeThumbnailAsync(thumbnailSource).then((thumbnail) => {
      if (!assetLibrary.includes(asset)) return;
      asset.thumbnail = asset.imageData === scheduledImageData ? thumbnail : makeThumbnail(asset.imageData);
      renderAssetList();
    }).catch(() => {
      if (!assetLibrary.includes(asset)) return;
      asset.thumbnail = makeThumbnail(asset.imageData === scheduledImageData ? thumbnailSource : asset.imageData);
      renderAssetList();
    });
  };
  // Thumbnail generation is secondary UI work. Starting it in the same task as a
  // megapixel cutout made the save button feel frozen even though the cutout worker
  // had already finished.
  if (typeof requestIdleCallback === "function") requestIdleCallback(start, { timeout: 500 });
  else window.setTimeout(start, 60);
}

async function loadImageFile(file, options = {}) {
  const loaded = await createImageSource(file, { maxSide: options.maxSide });
  const data = loaded.imageData;
  return {
    name: file.name.replace(/\.[^.]+$/, "") || "image",
    // The original library owns one editable proxy buffer. The compressed File is
    // retained separately and decoded at full resolution only for export.
    originalImageData: data,
    currentImageData: data,
    liveBaseImageData: null,
    pickedColors: [],
    history: [],
    thumbnail: makeThumbnail(data),
    selected: false,
    pixelatedPreview: false,
    fullResolutionSource: loaded.source,
    fullResolutionPipeline: []
  };
}

async function loadImageDataFile(file, options = {}) {
  const loaded = await createImageSource(file, { maxSide: options.maxSide });
  return {
    name: file.name.replace(/\.[^.]+$/, "") || "image",
    imageData: loaded.imageData,
    fullResolutionSource: loaded.source
  };
}

function originalRecordFromItem(item) {
  if (!item || !images.includes(item)) return null;
  const index = images.indexOf(item);
  return {
    name: item.name || `原图-${index + 1}`,
    imageData: cloneImageData(item.originalImageData),
    source: item
  };
}

function selectedOriginalSourceForMode(mode) {
  if (mode === "white") return alphaWhiteImage?.source || null;
  if (mode === "black") return alphaBlackImage?.source || null;
  if (mode === "dual") return dualAlphaSourceItem || null;
  return null;
}

function originalSourcePickerLabel(mode) {
  if (mode === "white") return "选择白底原图";
  if (mode === "black") return "选择黑底原图";
  return "选择双背景合成原图";
}

function setOriginalSourceForMode(mode, item, announce = true) {
  if (mode === "white") alphaWhiteImage = originalRecordFromItem(item);
  else if (mode === "black") alphaBlackImage = originalRecordFromItem(item);
  else if (mode === "dual") dualAlphaSourceItem = item && images.includes(item) ? item : null;
  updateAlphaPairPreview();
  setButtons();
  if (originalSourcePicker && !originalSourcePicker.hidden) renderOriginalSourcePicker();
  if (announce) {
    const record = item ? originalRecordFromItem(item) : null;
    const role = mode === "white" ? "白底" : mode === "black" ? "黑底" : "双背景合成";
    setStatus(record ? `已选择${role}原图：${record.name}` : `已取消${role}原图。`);
  }
}

function updateOriginalSourceSelectors() {
  if (alphaWhiteImage?.source && !images.includes(alphaWhiteImage.source)) alphaWhiteImage = null;
  if (alphaBlackImage?.source && !images.includes(alphaBlackImage.source)) alphaBlackImage = null;
  if (dualAlphaSourceItem && !images.includes(dualAlphaSourceItem)) dualAlphaSourceItem = null;
  updateAlphaPairPreview();
  if (originalSourcePicker && !originalSourcePicker.hidden) renderOriginalSourcePicker();
}

function renderOriginalSourcePicker() {
  if (!originalSourcePickerGrid || !originalSourcePickerMode) return;
  const selectedSource = selectedOriginalSourceForMode(originalSourcePickerMode);
  originalSourcePickerTitle.textContent = originalSourcePickerLabel(originalSourcePickerMode);
  originalSourcePickerInfo.textContent = `${images.length} 张原图，点击缩略图即可选择`;
  originalSourcePickerGrid.innerHTML = "";
  images.forEach((item, index) => {
    const selected = item === selectedSource;
    const button = document.createElement("button");
    button.className = `picker-frame source-picker-frame${selected ? " selected" : ""}`;
    button.type = "button";
    button.title = item.name || `原图-${index + 1}`;
    button.innerHTML = `<span class="picker-frame-media"><img alt="" src="${item.thumbnail}"><i class="picker-frame-check" aria-hidden="true">${selected ? "✓" : ""}</i></span><span>${index + 1}. ${item.name || "未命名原图"}</span>`;
    button.addEventListener("click", () => {
      setOriginalSourceForMode(originalSourcePickerMode, item);
      closeOriginalSourcePicker();
    });
    button.addEventListener("dblclick", (event) => {
      event.preventDefault();
      openImagePreview(item.name, item.originalImageData);
    });
    originalSourcePickerGrid.appendChild(button);
  });
}

function openOriginalSourcePicker(mode) {
  if (!images.length) {
    setStatus("原始图片库为空，请先导入黑底、白底或双背景原图。");
    return;
  }
  originalSourcePickerMode = mode;
  renderOriginalSourcePicker();
  originalSourcePicker.hidden = false;
}

function closeOriginalSourcePicker() {
  if (!originalSourcePicker) return;
  originalSourcePicker.hidden = true;
}

function clearOriginalSourceChoice() {
  if (!originalSourcePickerMode) return;
  setOriginalSourceForMode(originalSourcePickerMode, null);
  renderOriginalSourcePicker();
}

function updateAlphaPairPreview() {
  const apply = (slot, preview, nameNode, image, fallback) => {
    if (!slot || !preview || !nameNode) return;
    slot.classList.toggle("loaded", Boolean(image));
    if (image) {
      preview.hidden = false;
      preview.src = makeThumbnail(image.imageData);
      nameNode.textContent = image.name;
      slot.title = image.name;
    } else {
      preview.hidden = true;
      preview.removeAttribute("src");
      nameNode.textContent = fallback;
      slot.removeAttribute("title");
    }
  };

  apply(alphaWhiteSlot, alphaWhitePreview, alphaWhiteName, alphaWhiteImage, "添加白底");
  apply(alphaBlackSlot, alphaBlackPreview, alphaBlackName, alphaBlackImage, "添加黑底");
  const dualRecord = originalRecordFromItem(dualAlphaSourceItem);
  apply(dualAlphaSourceSlot, dualAlphaPreview, dualAlphaName, dualRecord, "添加双背景");
}

function imageDataFromVideo(video) {
  const ratio = Math.min(1, maxCanvasSide / Math.max(video.videoWidth, video.videoHeight));
  const width = Math.max(1, Math.round(video.videoWidth * ratio));
  const height = Math.max(1, Math.round(video.videoHeight * ratio));
  const work = document.createElement("canvas");
  work.width = width;
  work.height = height;
  const workCtx = work.getContext("2d", { willReadFrequently: true });
  workCtx.drawImage(video, 0, 0, width, height);
  return workCtx.getImageData(0, 0, width, height);
}

function resizeImageDataTo(imageData, width, height) {
  if (imageData.width === width && imageData.height === height) return cloneImageData(imageData);
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = imageData.width;
  sourceCanvas.height = imageData.height;
  sourceCanvas.getContext("2d").putImageData(imageData, 0, 0);
  const targetCanvas = document.createElement("canvas");
  targetCanvas.width = width;
  targetCanvas.height = height;
  const targetCtx = targetCanvas.getContext("2d", { willReadFrequently: true });
  targetCtx.imageSmoothingEnabled = true;
  targetCtx.imageSmoothingQuality = "high";
  targetCtx.drawImage(sourceCanvas, 0, 0, width, height);
  return targetCtx.getImageData(0, 0, width, height);
}

function rebuildAlphaFromWhiteBlack(whiteImageData, blackImageData) {
  const width = Math.min(whiteImageData.width, blackImageData.width);
  const height = Math.min(whiteImageData.height, blackImageData.height);
  const white = resizeImageDataTo(whiteImageData, width, height);
  const black = resizeImageDataTo(blackImageData, width, height);
  const output = new ImageData(width, height);

  for (let i = 0; i < output.data.length; i += 4) {
    const wr = white.data[i];
    const wg = white.data[i + 1];
    const wb = white.data[i + 2];
    const br = black.data[i];
    const bg = black.data[i + 1];
    const bb = black.data[i + 2];

    const diffR = Math.max(0, wr - br);
    const diffG = Math.max(0, wg - bg);
    const diffB = Math.max(0, wb - bb);
    const backgroundTransmission = Math.max(diffR, diffG, diffB) / 255;
    let alpha = 1 - backgroundTransmission;
    if (alpha < 0.018) alpha = 0;
    if (alpha > 0.985) alpha = 1;

    const alphaByte = Math.round(alpha * 255);
    if (alphaByte === 0) {
      output.data[i] = 0;
      output.data[i + 1] = 0;
      output.data[i + 2] = 0;
      output.data[i + 3] = 0;
      continue;
    }

    const invAlpha = 1 / Math.max(alpha, 0.001);
    output.data[i] = Math.max(0, Math.min(255, Math.round(br * invAlpha)));
    output.data[i + 1] = Math.max(0, Math.min(255, Math.round(bg * invAlpha)));
    output.data[i + 2] = Math.max(0, Math.min(255, Math.round(bb * invAlpha)));
    output.data[i + 3] = alphaByte;
  }

  alphaMaskPostProcess(output, {
    alphaFloor: 6,
    weakAlpha: 26,
    minComponentArea: Math.max(2, Math.round(width * height * 0.00004))
  });
  bleedOpaqueColorsIntoTransparentPixels(output);
  return removeTransparentEdgeBlocks(output);
}


function dualAlphaPixelLuma(data, index) {
  return data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
}

function averageImageDataLuma(imageData, region = null) {
  const { width, height, data } = imageData;
  const x0 = Math.max(0, Math.floor(region?.x ?? 0));
  const y0 = Math.max(0, Math.floor(region?.y ?? 0));
  const x1 = Math.min(width, Math.ceil(x0 + (region?.width ?? width)));
  const y1 = Math.min(height, Math.ceil(y0 + (region?.height ?? height)));
  const step = Math.max(1, Math.floor(Math.max(x1 - x0, y1 - y0) / 180));
  let sum = 0;
  let count = 0;
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const index = (y * width + x) * 4;
      if (data[index + 3] < 20) continue;
      sum += dualAlphaPixelLuma(data, index);
      count += 1;
    }
  }
  return count > 0 ? sum / count : 0;
}

function averagePanelEdgeLuma(imageData) {
  const { width, height } = imageData;
  const edgeW = Math.max(3, Math.round(width * 0.08));
  const edgeH = Math.max(3, Math.round(height * 0.08));
  const regions = [
    { x: 0, y: 0, width: edgeW, height: edgeH },
    { x: width - edgeW, y: 0, width: edgeW, height: edgeH },
    { x: 0, y: height - edgeH, width: edgeW, height: edgeH },
    { x: width - edgeW, y: height - edgeH, width: edgeW, height: edgeH }
  ];
  return regions.reduce((sum, region) => sum + averageImageDataLuma(imageData, region), 0) / regions.length;
}

function averageSplitLineContrast(imageData, axis, position) {
  const { width, height, data } = imageData;
  const crossLength = axis === "vertical" ? height : width;
  const step = Math.max(1, Math.floor(crossLength / 260));
  let sum = 0;
  let count = 0;

  for (let cross = 0; cross < crossLength; cross += step) {
    const leftX = axis === "vertical" ? position - 1 : cross;
    const rightX = axis === "vertical" ? position : cross;
    const leftY = axis === "vertical" ? cross : position - 1;
    const rightY = axis === "vertical" ? cross : position;
    if (leftX < 0 || leftY < 0 || rightX >= width || rightY >= height) continue;
    const leftIndex = (leftY * width + leftX) * 4;
    const rightIndex = (rightY * width + rightX) * 4;
    if (data[leftIndex + 3] < 20 || data[rightIndex + 3] < 20) continue;
    sum += (
      Math.abs(data[leftIndex] - data[rightIndex]) +
      Math.abs(data[leftIndex + 1] - data[rightIndex + 1]) +
      Math.abs(data[leftIndex + 2] - data[rightIndex + 2])
    ) / 3;
    count += 1;
  }

  return count > 0 ? sum / count : 0;
}

function cropEqualDualPanels(imageData, axis, splitPosition) {
  const { width, height } = imageData;
  if (axis === "vertical") {
    const panelWidth = Math.min(splitPosition, width - splitPosition);
    if (panelWidth < Math.max(8, width * 0.25)) return null;
    return {
      first: cropImageData(imageData, { x: splitPosition - panelWidth, y: 0, width: panelWidth, height }),
      second: cropImageData(imageData, { x: splitPosition, y: 0, width: panelWidth, height }),
      orientationText: "左右",
      panelWidth,
      panelHeight: height
    };
  }

  const panelHeight = Math.min(splitPosition, height - splitPosition);
  if (panelHeight < Math.max(8, height * 0.25)) return null;
  return {
    first: cropImageData(imageData, { x: 0, y: splitPosition - panelHeight, width, height: panelHeight }),
    second: cropImageData(imageData, { x: 0, y: splitPosition, width, height: panelHeight }),
    orientationText: "上下",
    panelWidth: width,
    panelHeight
  };
}

function detectDualBackgroundCandidate(imageData, axis) {
  const { width, height } = imageData;
  const length = axis === "vertical" ? width : height;
  if (length < 16) return null;

  const center = Math.round(length / 2);
  const minSplit = Math.max(2, Math.floor(length * 0.35));
  const maxSplit = Math.min(length - 2, Math.ceil(length * 0.65));
  const searchStep = Math.max(1, Math.floor(length / 700));
  let bestSplit = center;
  let bestContrast = -1;

  for (let split = minSplit; split <= maxSplit; split += searchStep) {
    const contrast = averageSplitLineContrast(imageData, axis, split);
    const centerPenalty = Math.abs(split - center) / Math.max(1, length) * 20;
    const score = contrast - centerPenalty;
    if (score > bestContrast) {
      bestContrast = score;
      bestSplit = split;
    }
  }

  const centerContrast = averageSplitLineContrast(imageData, axis, center);
  if (Math.abs(bestSplit - center) <= Math.max(4, Math.round(length * 0.015)) || centerContrast >= bestContrast * 0.82) {
    bestSplit = center;
    bestContrast = centerContrast;
  }

  const panels = cropEqualDualPanels(imageData, axis, bestSplit);
  if (!panels) return null;
  const firstLuma = averagePanelEdgeLuma(panels.first);
  const secondLuma = averagePanelEdgeLuma(panels.second);
  const backgroundDifference = Math.abs(firstLuma - secondLuma);
  const centerBalance = 1 - Math.abs(bestSplit - center) / Math.max(1, length / 2);
  const score = backgroundDifference * 2 + Math.max(0, bestContrast) * 0.55 + centerBalance * 18;

  return {
    axis,
    split: bestSplit,
    contrast: bestContrast,
    backgroundDifference,
    firstLuma,
    secondLuma,
    score,
    ...panels
  };
}

function subjectBoundsForSolidBackgroundPanel(imageData) {
  const backgroundColor = dominantEdgeColor(imageData);
  const backgroundLuma = backgroundColor.r * 0.299 + backgroundColor.g * 0.587 + backgroundColor.b * 0.114;
  const threshold = backgroundLuma < 40 ? 18 : backgroundLuma > 215 ? 32 : 28;
  return subjectBoundsByBackground(imageData, backgroundColor, threshold);
}

function panelAlignmentWarning(firstPanel, secondPanel) {
  const firstBounds = subjectBoundsForSolidBackgroundPanel(firstPanel);
  const secondBounds = subjectBoundsForSolidBackgroundPanel(secondPanel);
  if (!firstBounds || !secondBounds) return "未能稳定识别两张底图中的主体边界，请确认主体位置完全一致。";

  const firstCenterX = (firstBounds.minX + firstBounds.maxX) / 2;
  const firstCenterY = (firstBounds.minY + firstBounds.maxY) / 2;
  const secondCenterX = (secondBounds.minX + secondBounds.maxX) / 2;
  const secondCenterY = (secondBounds.minY + secondBounds.maxY) / 2;
  const shiftX = Math.abs(firstCenterX - secondCenterX);
  const shiftY = Math.abs(firstCenterY - secondCenterY);
  const sizeDiff = Math.max(
    Math.abs(firstBounds.width - secondBounds.width),
    Math.abs(firstBounds.height - secondBounds.height)
  );
  const tolerance = Math.max(3, Math.round(Math.min(firstPanel.width, firstPanel.height) * 0.012));
  const sizeTolerance = Math.max(5, Math.round(Math.min(firstPanel.width, firstPanel.height) * 0.028));

  if (shiftX > tolerance || shiftY > tolerance) {
    return `检测到两张底图主体中心可能偏移：约 ${Math.round(shiftX)}px × ${Math.round(shiftY)}px。位置不一致会导致重建边缘发虚或重影。`;
  }
  if (sizeDiff > sizeTolerance) {
    return `检测到两张底图主体边界大小差异约 ${Math.round(sizeDiff)}px。请确认黑白底图不是缩放或裁剪后的不同版本。`;
  }
  return "";
}

function splitDualBackgroundImageData(imageData, sourceName = "dual-background") {
  if (!imageData || imageData.width < 16 || imageData.height < 16) return null;
  const candidates = [
    detectDualBackgroundCandidate(imageData, "vertical"),
    detectDualBackgroundCandidate(imageData, "horizontal")
  ].filter(Boolean).sort((left, right) => right.score - left.score);

  const best = candidates[0];
  if (!best || best.backgroundDifference < 70 || best.contrast < 35) return null;

  const firstIsWhite = best.firstLuma >= best.secondLuma;
  const whitePanel = firstIsWhite ? best.first : best.second;
  const blackPanel = firstIsWhite ? best.second : best.first;
  const warning = panelAlignmentWarning(whitePanel, blackPanel);
  const orientation = best.orientationText;
  const splitOffset = Math.abs(best.split - (best.axis === "vertical" ? imageData.width : imageData.height) / 2);

  return {
    white: {
      name: `${sourceName}-白底`,
      imageData: whitePanel
    },
    black: {
      name: `${sourceName}-黑底`,
      imageData: blackPanel
    },
    orientation,
    warning,
    splitOffset,
    panelWidth: best.panelWidth,
    panelHeight: best.panelHeight,
    firstLuma: best.firstLuma,
    secondLuma: best.secondLuma
  };
}

function applyAutoSplitAlphaPair(splitResult, sourceName = "dual-background") {
  alphaWhiteImage = {
    name: splitResult.white.name || `${sourceName}-白底`,
    imageData: cloneImageData(splitResult.white.imageData)
  };
  alphaBlackImage = {
    name: splitResult.black.name || `${sourceName}-黑底`,
    imageData: cloneImageData(splitResult.black.imageData)
  };
  updateAlphaPairPreview();
  setButtons();

  const offsetText = splitResult.splitOffset > 2 ? `，分割线偏离中心约 ${Math.round(splitResult.splitOffset)}px` : "";
  const warningText = splitResult.warning ? ` 注意：${splitResult.warning}` : " 两张底图主体位置检测基本一致。";
  setStatus(`已自动从一张图中按${splitResult.orientation}拆分出白底图和黑底图，单张尺寸 ${splitResult.panelWidth}×${splitResult.panelHeight}${offsetText}。${warningText}`);
}

function splitCurrentDualAlphaSource() {
  const source = originalRecordFromItem(dualAlphaSourceItem);
  if (!source) {
    setStatus("请先从原始图片库选择一张双背景合成图。");
    return;
  }
  const splitResult = splitDualBackgroundImageData(source.imageData, source.name);
  if (!splitResult) {
    setStatus("双背景图拆分失败。请确认原图包含左右或上下排列的完整黑底与白底版本，且主体位置一致。");
    return;
  }
  applyAutoSplitAlphaPair(splitResult, source.name);
  const imageData = rebuildAlphaFromWhiteBlack(splitResult.white.imageData, splitResult.black.imageData);
  const asset = addProcessedAsset(imageData, source.name, "dualAlpha", { sourceKind: "original" });
  activateProcessedAsset(asset);
  setStatus(`已拆分 ${source.name} 的黑白底图并完成透明重建，结果已保存到处理结果库。${splitResult.warning ? ` 注意：${splitResult.warning}` : ""}`);
}

function waitForVideoEvent(video, eventName) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener(eventName, onEvent);
      video.removeEventListener("error", onError);
    };
    const onEvent = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("video error"));
    };
    video.addEventListener(eventName, onEvent, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

async function seekVideo(video, time) {
  video.currentTime = Math.min(Math.max(0, time), Math.max(0, video.duration - 0.001));
  await waitForVideoEvent(video, "seeked");
}

async function loadVideoFile(file) {
  if (!file || !file.type.startsWith("video/")) {
    setStatus("请选择有效的视频文件。");
    return;
  }
  if (loadedVideoUrl) URL.revokeObjectURL(loadedVideoUrl);
  loadedVideoUrl = URL.createObjectURL(file);
  loadedVideoName = file.name.replace(/\.[^.]+$/, "") || "video";
  loadedVideo = document.createElement("video");
  loadedVideo.preload = "auto";
  loadedVideo.muted = true;
  loadedVideo.playsInline = true;
  loadedVideo.src = loadedVideoUrl;
  try {
    await waitForVideoEvent(loadedVideo, "loadedmetadata");
    await seekVideo(loadedVideo, 0);
    const firstFrame = imageDataFromVideo(loadedVideo);
    pushHistory();
    const previewAsset = addProcessedAsset(firstFrame, loadedVideoName, "处理结果", {
      name: `${loadedVideoName}-视频首帧`,
      sourceKind: "video"
    });
    activateProcessedAsset(previewAsset);
    setStatus("视频已载入，首帧预览已放入处理结果库。可取背景色后执行视频抽帧。");
  } catch (error) {
    console.error(error);
    loadedVideo = null;
    setStatus("视频读取失败，请换一个视频文件试试。");
  }
  setButtons();
}

function clearVideo() {
  if (loadedVideoUrl) URL.revokeObjectURL(loadedVideoUrl);
  loadedVideo = null;
  loadedVideoUrl = "";
  loadedVideoName = "";
  videoInput.value = "";
  setButtons();
  setStatus("已清除当前视频。可以重新选择视频导入。");
}

async function loadFiles(fileList) {
  const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
  if (files.length === 0) {
    setStatus("请选择有效的图片文件。");
    return;
  }

  saveActiveImage();
  const beforeImport = workspaceMemoryReport();
  if (beforeImport.totalBytes >= workspaceMemoryPolicy.hardLimitBytes) {
    compactHistoryForMemory();
  }
  const afterCompaction = workspaceMemoryReport();
  if (afterCompaction.totalBytes >= workspaceMemoryPolicy.hardLimitBytes) {
    setStatus("当前工作区内存已达安全上限。请先清理未使用的结果或序列帧，再继续导入。");
    return;
  }
  const proxyMaxSide = chooseProxyMaxSide({
    fileCount: files.length,
    currentBytes: afterCompaction.totalBytes,
    softLimitBytes: workspaceMemoryPolicy.softLimitBytes
  });
  setStatus(`正在载入图片并生成最长边 ${proxyMaxSide}px 的编辑代理…`);
  const loaded = [];
  for (const file of files) {
    try {
      loaded.push(await loadImageFile(file, { maxSide: proxyMaxSide }));
      updateMemoryIndicator();
    } catch {
      setStatus(`有图片读取失败，已跳过：${file.name}`);
    }
  }

  if (loaded.length === 0) return;
  images = images.concat(loaded);
  selectImage(images.length - loaded.length);
  compactHistoryForMemory();
  setStatus(`已载入 ${loaded.length} 张图片。原始分辨率已保留，画布使用 ${proxyMaxSide}px 以内的代理预览。`);
}

function rebuildAlphaPairImage() {
  if (!alphaWhiteImage || !alphaBlackImage) {
    setStatus("请先分别选择白底图和黑底图。");
    return;
  }
  pushHistory();
  const imageData = rebuildAlphaFromWhiteBlack(alphaWhiteImage.imageData, alphaBlackImage.imageData);
  const asset = addProcessedAsset(imageData, alphaWhiteImage.name || "双背景图片", "dualAlpha", { sourceKind: "dual-background" });
  activateProcessedAsset(asset);
  setStatus("已通过白底图和黑底图重建透明素材，并保存到处理结果库。");
}

function selectImage(index, openTab = true) {
  if (toolSession && toolSession.sourceTarget !== images[index]) cancelToolSession({ silent: true });
  if (!images[index]) return;
  if (openTab) {
    openWorkspaceTab("image", images[index]);
    return;
  }
  stopPlayback();
  setProcessingSource("original", { announce: false, scrollLibrary: false });
  activeLibraryTarget = null;
  activeFrameIndex = -1;
  activeIndex = index;
  const item = images[index];
  originalImageData = item.originalImageData;
  currentImageData = item.currentImageData || item.originalImageData;
  liveBaseImageData = null;
  pickedColors = [];
  invalidateLiveDistanceCache();
  cropSelection = null;
  clearLassoSelection();
  showResultMode();
  renderCanvas();
  renderSwatches();
  renderImageList();
  renderAssetList();
  renderWorkspaceTabs();
  setButtons();
}

function clearImageWorkspace() {
  clearOutlinePreviewState({ restore: false });
  activeIndex = -1;
  originalImageData = null;
  currentImageData = null;
  liveBaseImageData = null;
  pickedColors = [];
  cropSelection = null;
  activeFrameIndex = -1;
  hideCropBox();
  clearLassoSelection();
  canvas.classList.remove("ready", "contour-pixel-preview");
  selectionCanvas.classList.remove("ready", "contour-pixel-preview");
  if (canvasScene) {
    canvasScene.style.removeProperty("width");
    canvasScene.style.removeProperty("height");
  }
  emptyState.hidden = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
  renderSwatches();
  renderImageList();
  setButtons();
}

function deleteSelectedImages() {
  const selected = images.filter((item) => item.selected);
  const removedItems = selected.length ? selected : (activeIndex >= 0 && images[activeIndex] ? [images[activeIndex]] : []);
  const count = removedItems.length;
  if (count === 0) return;
  pushHistory();
  const removed = new Set(removedItems);
  const previousActive = activeIndex;
  images = images.filter((item) => !removed.has(item));
  removeWorkspaceTabsForTargets(removedItems);
  librarySelectionAnchor.original = -1;
  if (images.length === 0) {
    clearImageWorkspace();
    renderImageList();
    setButtons();
    setStatus(`已删除 ${count} 张原始图片。可以重新添加素材。`);
    return;
  }
  const nextIndex = Math.min(Math.max(previousActive, 0), images.length - 1);
  selectImage(nextIndex);
  setStatus(`已删除 ${count} 张原始图片。`);
}

function getCanvasPoint(event) {
  if (!currentImageData) return null;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null;
  return { x, y };
}

function getToolWorkspaceBounds() {
  if (!canvas.width || !canvas.height) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  const canvasRect = canvas.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const xScale = canvasRect.width / canvas.width || 1;
  const yScale = canvasRect.height / canvas.height || 1;
  const canvasContentLeft = canvasRect.left - stageRect.left + stage.scrollLeft;
  const canvasContentTop = canvasRect.top - stageRect.top + stage.scrollTop;
  return {
    minX: Math.floor(-canvasContentLeft / xScale),
    minY: Math.floor(-canvasContentTop / yScale),
    maxX: Math.ceil((stage.scrollWidth - canvasContentLeft) / xScale),
    maxY: Math.ceil((stage.scrollHeight - canvasContentTop) / yScale)
  };
}

function getLooseCanvasPoint(event) {
  if (!canvas.width || !canvas.height) return null;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
  const eraserMargin = clickMode === "eraser" ? Number(eraserSize.value) * 1.8 / Math.max(scale, 0.05) : 0;
  const bounds = toolSession
    ? getToolWorkspaceBounds()
    : {
        minX: -Math.max(96, eraserMargin, Math.round(Math.min(canvas.width, canvas.height) * 0.35)),
        minY: -Math.max(96, eraserMargin, Math.round(Math.min(canvas.width, canvas.height) * 0.35)),
        maxX: canvas.width + Math.max(96, eraserMargin, Math.round(Math.min(canvas.width, canvas.height) * 0.35)),
        maxY: canvas.height + Math.max(96, eraserMargin, Math.round(Math.min(canvas.width, canvas.height) * 0.35))
      };
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, y))
  };
}

function zoomCanvasAt(event) {
  if (!canvas.width || !canvas.height) return;
  const before = getLooseCanvasPoint(event);
  if (!before) return;
  const oldZoom = zoomLevel;
  const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
  zoomLevel = Math.max(0.2, Math.min(10, zoomLevel * factor));
  if (Math.abs(zoomLevel - oldZoom) < 0.001) return;

  fitCanvas();

  const rect = canvas.getBoundingClientRect();
  const afterClientX = rect.left + before.x * (rect.width / canvas.width);
  const afterClientY = rect.top + before.y * (rect.height / canvas.height);
  stage.scrollLeft += afterClientX - event.clientX;
  stage.scrollTop += afterClientY - event.clientY;
  updateCropBox();
  updateSelectionCanvas();
  setStatus(`缩放 ${Math.round(zoomLevel * 100)}%。`);
}

function getPickedColor(event) {
  const point = getCanvasPoint(event);
  if (!point) return null;
  const frame = selectedFrame();
  const sourceImage = frame ? frame.imageData : liveBaseImageData || (showOriginal ? originalImageData : currentImageData);
  const source = sourceImage.data;
  const index = (point.y * canvas.width + point.x) * 4;
  return {
    r: source[index],
    g: source[index + 1],
    b: source[index + 2],
    x: point.x,
    y: point.y
  };
}

function colorDistance(data, index, color) {
  const dr = data[index] - color.r;
  const dg = data[index + 1] - color.g;
  const db = data[index + 2] - color.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function rgbToHueSaturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  if (delta > 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return {
    hue,
    saturation: max === 0 ? 0 : delta / max,
    value: max
  };
}

function hueDistance(left, right) {
  const distance = Math.abs(left - right);
  return Math.min(distance, 360 - distance);
}

function bestDistanceSquared(data, index) {
  let best = Infinity;
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  for (const color of pickedColors) {
    const dr = r - color.r;
    const dg = g - color.g;
    const db = b - color.b;
    const distance = dr * dr + dg * dg + db * db;
    if (distance < best) best = distance;
  }
  return best;
}

function bestDistance(data, index) {
  return Math.sqrt(bestDistanceSquared(data, index));
}

function pickedColorSignature() {
  return pickedColors.map((color) => `${color.r},${color.g},${color.b}`).join("|");
}

function invalidateLiveDistanceCache(options = {}) {
  liveDistanceCacheBySource = new WeakMap();
  livePreviewFullBase = null;
  livePreviewFullKey = "";
  livePreviewFullImageData = null;
  livePreviewFastImageData = null;
  if (options.keepTarget !== true) livePreviewSourceTarget = null;
  if (options.keepProxy !== true) {
    livePreviewProxySource = null;
    livePreviewProxyImageData = null;
    livePreviewProxyPixelLimit = 0;
  }
}

function liveDistanceMapFor(imageData) {
  const signature = pickedColorSignature();
  const cached = liveDistanceCacheBySource.get(imageData);
  if (cached?.signature === signature && cached.map?.length === imageData.width * imageData.height) {
    return cached.map;
  }

  const source = imageData.data;
  const map = new Uint32Array(imageData.width * imageData.height);
  for (let pixel = 0; pixel < map.length; pixel += 1) {
    map[pixel] = bestDistanceSquared(source, pixel * 4);
  }
  liveDistanceCacheBySource.set(imageData, { signature, map });
  return map;
}

function livePreviewSettingsKey() {
  return [
    pickedColorSignature(),
    Number(tolerance.value),
    Number(softness.value),
    contiguous.checked ? 1 : 0,
    isForceRemoveEnabled() ? 1 : 0
  ].join(";");
}

function getLivePreviewProxy(imageData, pixelLimit = livePreviewFastPixelLimit) {
  if (!imageData || imageData.width * imageData.height <= pixelLimit) return imageData;
  if (
    livePreviewProxySource === imageData
    && livePreviewProxyImageData
    && livePreviewProxyPixelLimit === pixelLimit
  ) return livePreviewProxyImageData;

  const scale = Math.sqrt(pixelLimit / (imageData.width * imageData.height));
  const width = Math.max(1, Math.round(imageData.width * scale));
  const height = Math.max(1, Math.round(imageData.height * scale));
  const source = document.createElement("canvas");
  source.width = imageData.width;
  source.height = imageData.height;
  source.getContext("2d", { willReadFrequently: false }).putImageData(imageData, 0, 0);
  const proxy = document.createElement("canvas");
  proxy.width = width;
  proxy.height = height;
  const proxyCtx = proxy.getContext("2d", { willReadFrequently: true });
  proxyCtx.imageSmoothingEnabled = true;
  proxyCtx.imageSmoothingQuality = "medium";
  proxyCtx.drawImage(source, 0, 0, width, height);
  livePreviewProxySource = imageData;
  livePreviewProxyPixelLimit = pixelLimit;
  livePreviewProxyImageData = proxyCtx.getImageData(0, 0, width, height);
  return livePreviewProxyImageData;
}

function getContiguousWorkspace(pixelCount, width, height) {
  if (!contiguousWorkspace || contiguousWorkspace.pixelCount !== pixelCount) {
    contiguousWorkspace = {
      pixelCount,
      width,
      height,
      visited: new Uint8Array(pixelCount),
      candidate: new Uint8Array(pixelCount),
      alphaMap: new Uint8ClampedArray(pixelCount),
      queue: new Int32Array(pixelCount)
    };
  } else {
    contiguousWorkspace.width = width;
    contiguousWorkspace.height = height;
    contiguousWorkspace.visited.fill(0);
    contiguousWorkspace.candidate.fill(0);
  }
  return contiguousWorkspace;
}

function alphaFromDistance(distance, hardLimit, softRange) {
  if (distance <= hardLimit) return 0;
  if (softRange <= 0 || distance >= hardLimit + softRange) return 255;
  return Math.round(((distance - hardLimit) / softRange) * 255);
}

function alphaFromDistanceSquared(distanceSquared, hardLimit, softRange) {
  const hardSquared = hardLimit * hardLimit;
  if (distanceSquared <= hardSquared) return 0;
  const outerLimit = hardLimit + softRange;
  if (softRange <= 0 || distanceSquared >= outerLimit * outerLimit) return 255;
  return Math.round(((Math.sqrt(distanceSquared) - hardLimit) / softRange) * 255);
}

function isForceRemoveEnabled() {
  return Boolean(forceRemoveColor?.checked);
}

function applyGlobalRemoval(next, hardLimit, softRange, distanceMap = null) {
  const data = next.data;
  for (let pixel = 0; pixel < data.length / 4; pixel += 1) {
    const index = pixel * 4;
    const distanceSquared = distanceMap ? distanceMap[pixel] : bestDistanceSquared(data, index);
    const alpha = alphaFromDistanceSquared(distanceSquared, hardLimit, softRange);
    data[index + 3] = Math.min(data[index + 3], alpha);
  }
}

function applyForceColorRemoval(next, hardLimit, softRange) {
  const { width, height, data } = next;
  const removeLimit = hardLimit + softRange + 28;
  const pickedProfiles = pickedColors.map((color) => ({
    ...color,
    ...rgbToHueSaturation(color.r, color.g, color.b),
    isGreen: color.g > color.r + 20 && color.g > color.b + 20
  }));

  const shouldForceRemovePixel = (index, extra = 0, allowSpill = false) => {
    if (bestDistanceSquared(data, index) <= (removeLimit + extra) * (removeLimit + extra)) return true;
    if (!allowSpill) return false;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const profile = rgbToHueSaturation(r, g, b);
    const greenDominance = g - Math.max(r, b);
    return pickedProfiles.some((picked) => {
      if (picked.saturation < 0.18) return false;
      const hueMatch = hueDistance(profile.hue, picked.hue) <= (picked.isGreen ? 42 : 26);
      const enoughColor = profile.saturation >= 0.12 && profile.value >= 24;
      const greenSpill = picked.isGreen && greenDominance >= 7 && g >= 28 && profile.hue >= 70 && profile.hue <= 170;
      return enoughColor && (hueMatch || greenSpill);
    });
  };

  for (let index = 0; index < data.length; index += 4) {
    if (shouldForceRemovePixel(index, 0, false)) {
      data[index + 3] = 0;
    }
  }

  const originalAlpha = new Uint8ClampedArray(width * height);
  for (let pixel = 0; pixel < originalAlpha.length; pixel += 1) {
    originalAlpha[pixel] = data[pixel * 4 + 3];
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const index = pixel * 4;
      if (originalAlpha[pixel] === 0) continue;
      let transparentNeighbors = 0;
      let opaqueNeighbors = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const neighborAlpha = originalAlpha[ny * width + nx];
          if (neighborAlpha === 0) transparentNeighbors += 1;
          else opaqueNeighbors += 1;
        }
      }
      const nearRemoved = transparentNeighbors >= 3;
      const nearIsolated = opaqueNeighbors <= 2;
      if (
        (nearRemoved && shouldForceRemovePixel(index, 42, true)) ||
        (nearIsolated && shouldForceRemovePixel(index, 20, true))
      ) {
        data[index + 3] = 0;
      }
    }
  }
}

function applyContiguousRemoval(next, hardLimit, softRange, distanceMap = null) {
  const { width, height, data } = next;
  const pixelCount = width * height;
  const workspace = getContiguousWorkspace(pixelCount, width, height);
  const { visited, candidate, alphaMap, queue } = workspace;
  const outerLimit = hardLimit + softRange;
  const outerSquared = outerLimit * outerLimit;

  // Calculate colour distance once per pixel. The old implementation recalculated it
  // for every BFS neighbour, which became painfully expensive on large images.
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const distanceSquared = distanceMap ? distanceMap[pixel] : bestDistanceSquared(data, pixel * 4);
    if (distanceSquared <= outerSquared) candidate[pixel] = 1;
    alphaMap[pixel] = alphaFromDistanceSquared(distanceSquared, hardLimit, softRange);
  }

  let head = 0;
  let tail = 0;
  const enqueue = (pixel) => {
    if (pixel < 0 || pixel >= pixelCount || visited[pixel] || !candidate[pixel]) return;
    visited[pixel] = 1;
    queue[tail] = pixel;
    tail += 1;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const pixel = queue[head];
    head += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const index = pixel * 4;
    data[index + 3] = Math.min(data[index + 3], alphaMap[pixel]);

    if (x > 0) enqueue(pixel - 1);
    if (x < width - 1) enqueue(pixel + 1);
    if (y > 0) enqueue(pixel - width);
    if (y < height - 1) enqueue(pixel + width);
  }
}

function cleanTransparentEdges(imageData, sourceImageData, hardLimit, softRange) {
  const { width, height, data } = imageData;
  const source = sourceImageData.data;
  const original = new Uint8ClampedArray(data);
  const matteLimit = hardLimit + softRange;
  const fringeLimit = matteLimit + Math.max(46, softRange * 1.45);

  function hasTransparentNeighbor(x, y) {
    for (let dy = -3; dy <= 3; dy += 1) {
      for (let dx = -3; dx <= 3; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        if (original[(ny * width + nx) * 4 + 3] < 190) return true;
      }
    }
    return false;
  }

  function greenSpillScore(index) {
    if (pickedColors.length === 0) return 0;
    const r = source[index];
    const g = source[index + 1];
    const b = source[index + 2];
    const pickedGreen = pickedColors.some((color) => color.g > color.r + 25 && color.g > color.b + 25);
    if (!pickedGreen) return 0;
    return Math.max(0, g - Math.max(r, b));
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const index = pixel * 4;
      const alpha = data[index + 3];
      if (alpha === 0) continue;

      const distance = bestDistance(source, index);
      const nearTransparent = hasTransparentNeighbor(x, y);
      const spill = greenSpillScore(index);
      const shouldDefringe = alpha < 255 || (nearTransparent && (distance <= fringeLimit || spill >= 18));
      if (!shouldDefringe) continue;

      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let dy = -4; dy <= 4; dy += 1) {
        for (let dx = -4; dx <= 4; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const neighborIndex = (ny * width + nx) * 4;
          if (original[neighborIndex + 3] < 230) continue;
          if (bestDistance(source, neighborIndex) <= fringeLimit) continue;
          if (greenSpillScore(neighborIndex) >= 12) continue;
          r += original[neighborIndex];
          g += original[neighborIndex + 1];
          b += original[neighborIndex + 2];
          count += 1;
        }
      }

      if (count > 0) {
        const spillStrength = Math.min(1, spill / 90);
        const fringeStrength = Math.max(Math.max(0, 1 - distance / Math.max(1, fringeLimit)), spillStrength);
        const mix = Math.min(0.95, (255 - alpha) / 255 + 0.25 + fringeStrength * 0.45);
        data[index] = Math.round(data[index] * (1 - mix) + (r / count) * mix);
        data[index + 1] = Math.round(data[index + 1] * (1 - mix) + (g / count) * mix);
        data[index + 2] = Math.round(data[index + 2] * (1 - mix) + (b / count) * mix);
        if (nearTransparent && alpha === 255 && (distance <= matteLimit || spill >= 38)) {
          const spillAlpha = spill >= 38 ? Math.round(255 * Math.max(0.18, 1 - spill / 130)) : 255;
          const distanceAlpha = distance <= matteLimit ? Math.round(255 * (distance / Math.max(1, matteLimit))) : 255;
          data[index + 3] = Math.min(data[index + 3], spillAlpha, distanceAlpha);
        }
      } else if (nearTransparent && (distance <= matteLimit || spill >= 38)) {
        const spillAlpha = spill >= 38 ? Math.round(255 * Math.max(0.18, 1 - spill / 130)) : 255;
        const distanceAlpha = distance <= matteLimit ? Math.round(255 * (distance / Math.max(1, matteLimit))) : 255;
        data[index + 3] = Math.min(data[index + 3], spillAlpha, distanceAlpha);
      }
    }
  }
}

function alphaMaskPostProcess(imageData, options = {}) {
  const { width, height, data } = imageData;
  if (width <= 0 || height <= 0) return imageData;

  const alphaFloor = options.alphaFloor ?? 12;
  const weakAlpha = options.weakAlpha ?? (options.aggressive ? 92 : 64);
  const solidAlpha = options.solidAlpha ?? 178;
  const minComponentArea = options.minComponentArea ?? Math.max(3, Math.min(180, Math.round(width * height * 0.00022)));
  const pixelCount = width * height;
  const pixelIndex = (x, y) => y * width + x;

  const snapshotAlpha = () => {
    const alpha = new Uint8ClampedArray(pixelCount);
    for (let pixel = 0; pixel < pixelCount; pixel += 1) alpha[pixel] = data[pixel * 4 + 3];
    return alpha;
  };

  const neighborStats = (alpha, x, y, radius = 1) => {
    let transparent = 0;
    let weak = 0;
    let solid = 0;
    let total = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        total += 1;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          transparent += 1;
          continue;
        }
        const value = alpha[pixelIndex(nx, ny)];
        if (value <= alphaFloor) transparent += 1;
        else if (value < solidAlpha) weak += 1;
        else solid += 1;
      }
    }
    return { transparent, weak, solid, total };
  };

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const index = pixel * 4;
    if (data[index + 3] <= alphaFloor) data[index + 3] = 0;
  }

  for (let pass = 0; pass < 2; pass += 1) {
    const alpha = snapshotAlpha();
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const pixel = pixelIndex(x, y);
        const index = pixel * 4;
        const value = alpha[pixel];
        if (value === 0) continue;
        const near = neighborStats(alpha, x, y, 1);
        if (value < weakAlpha && (near.solid <= 1 || near.transparent >= 5)) {
          data[index + 3] = 0;
        } else if (value < 150 && near.transparent >= 6 && near.solid <= 2) {
          data[index + 3] = Math.min(data[index + 3], options.aggressive ? 0 : 36);
        }
      }
    }
  }

  const visited = new Uint8Array(pixelCount);
  const queue = [];
  for (let start = 0; start < pixelCount; start += 1) {
    if (visited[start] || data[start * 4 + 3] <= alphaFloor) continue;
    let head = 0;
    let area = 0;
    let strong = 0;
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    queue.length = 0;
    queue.push(start);
    visited[start] = 1;
    while (head < queue.length) {
      const pixel = queue[head];
      head += 1;
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      const alpha = data[pixel * 4 + 3];
      area += 1;
      if (alpha >= solidAlpha) strong += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      const neighbors = [
        x > 0 ? pixel - 1 : -1,
        x < width - 1 ? pixel + 1 : -1,
        y > 0 ? pixel - width : -1,
        y < height - 1 ? pixel + width : -1
      ];
      for (const nextPixel of neighbors) {
        if (nextPixel < 0 || visited[nextPixel]) continue;
        if (data[nextPixel * 4 + 3] <= alphaFloor) continue;
        visited[nextPixel] = 1;
        queue.push(nextPixel);
      }
    }

    const edgeTouch = minX === 0 || minY === 0 || maxX === width - 1 || maxY === height - 1;
    const thinSpan = Math.min(maxX - minX + 1, maxY - minY + 1);
    const weakComponent = strong <= Math.max(1, area * 0.18);
    const removeComponent = area < minComponentArea || (edgeTouch && weakComponent && area < minComponentArea * 4) || (thinSpan <= 2 && weakComponent);
    if (!removeComponent) continue;
    for (const pixel of queue) data[pixel * 4 + 3] = 0;
  }

  const fillAlpha = snapshotAlpha();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = pixelIndex(x, y);
      const index = pixel * 4;
      if (fillAlpha[pixel] > 48) continue;
      const near = neighborStats(fillAlpha, x, y, 1);
      if (near.solid >= 7) {
        let sum = 0;
        let count = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            const value = fillAlpha[pixelIndex(nx, ny)];
            if (value < solidAlpha) continue;
            sum += value;
            count += 1;
          }
        }
        if (count > 0) data[index + 3] = Math.max(data[index + 3], Math.round((sum / count) * 0.72));
      }
    }
  }

  return imageData;
}

function defringeTransparentEdgeColors(imageData, options = {}) {
  const { width, height, data } = imageData;
  const source = options.sourceImageData?.data || data;
  const backgroundColors = options.backgroundColors || [];
  const alpha = new Uint8ClampedArray(width * height);
  for (let pixel = 0; pixel < alpha.length; pixel += 1) alpha[pixel] = data[pixel * 4 + 3];

  const pixelIndex = (x, y) => y * width + x;
  const matchesBackground = (index) => {
    if (backgroundColors.length === 0) return false;
    const r = source[index];
    const g = source[index + 1];
    const b = source[index + 2];
    return backgroundColors.some((color) => {
      const dr = r - color.r;
      const dg = g - color.g;
      const db = b - color.b;
      return Math.sqrt(dr * dr + dg * dg + db * db) <= (options.aggressive ? 92 : 64);
    });
  };

  const hasTransparentTouch = (x, y, radius = 2) => {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) return true;
        if (alpha[pixelIndex(nx, ny)] <= 24) return true;
      }
    }
    return false;
  };

  const findInnerColor = (x, y) => {
    for (let radius = 2; radius <= 12; radius += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let weight = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = pixelIndex(nx, ny) * 4;
          const a = alpha[pixelIndex(nx, ny)];
          if (a < 220 || matchesBackground(ni)) continue;
          r += data[ni] * a;
          g += data[ni + 1] * a;
          b += data[ni + 2] * a;
          weight += a;
        }
      }
      if (weight > 0) return { r: r / weight, g: g / weight, b: b / weight };
    }
    return null;
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = pixelIndex(x, y);
      const index = pixel * 4;
      const a = alpha[pixel];
      if (a === 0 || (a >= 252 && !hasTransparentTouch(x, y, 1))) continue;
      const inner = findInnerColor(x, y);
      if (!inner) continue;
      const bgMatch = matchesBackground(index);
      const edgeAmount = Math.max((255 - a) / 255, bgMatch ? 0.82 : 0);
      if (edgeAmount <= 0.04 && !hasTransparentTouch(x, y, 2)) continue;
      const mix = Math.min(0.96, 0.30 + edgeAmount * (options.aggressive ? 0.66 : 0.52));
      data[index] = Math.round(data[index] * (1 - mix) + inner.r * mix);
      data[index + 1] = Math.round(data[index + 1] * (1 - mix) + inner.g * mix);
      data[index + 2] = Math.round(data[index + 2] * (1 - mix) + inner.b * mix);
      if (bgMatch && a > 0) data[index + 3] = Math.min(data[index + 3], Math.round(a * 0.58));
    }
  }

  return imageData;
}

function bleedOpaqueColorsIntoTransparentPixels(imageData) {
  const { width, height, data } = imageData;
  const pixelCount = width * height;
  let frontier = [];
  const owner = new Int32Array(pixelCount);
  owner.fill(-1);

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    if (data[pixel * 4 + 3] <= 0) continue;
    owner[pixel] = pixel;
    frontier.push(pixel);
  }

  for (let pass = 0; pass < 10 && frontier.length > 0; pass += 1) {
    const next = [];
    for (const pixel of frontier) {
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      const neighbors = [
        x > 0 ? pixel - 1 : -1,
        x < width - 1 ? pixel + 1 : -1,
        y > 0 ? pixel - width : -1,
        y < height - 1 ? pixel + width : -1
      ];
      for (const nextPixel of neighbors) {
        if (nextPixel < 0 || owner[nextPixel] !== -1) continue;
        owner[nextPixel] = owner[pixel];
        next.push(nextPixel);
      }
    }
    frontier = next;
  }

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const index = pixel * 4;
    if (data[index + 3] !== 0) continue;
    const sourcePixel = owner[pixel];
    if (sourcePixel < 0) {
      data[index] = 0;
      data[index + 1] = 0;
      data[index + 2] = 0;
      continue;
    }
    const sourceIndex = sourcePixel * 4;
    data[index] = data[sourceIndex];
    data[index + 1] = data[sourceIndex + 1];
    data[index + 2] = data[sourceIndex + 2];
  }

  return imageData;
}

function stripEdgeMattePollution(imageData, options = {}) {
  const { width, height, data } = imageData;
  const source = options.sourceImageData?.data || data;
  const backgroundColors = options.backgroundColors || [];
  if (width <= 0 || height <= 0) return imageData;

  const pixelIndex = (x, y) => y * width + x;
  const dataIndex = (x, y) => pixelIndex(x, y) * 4;

  const backgroundProfiles = backgroundColors.map((color) => ({
    ...color,
    ...rgbToHueSaturation(color.r, color.g, color.b),
    stats: colorStats(color.r, color.g, color.b)
  }));

  const isLightMatte = (r, g, b) => {
    const stats = colorStats(r, g, b);
    return stats.saturation <= 0.34 && stats.luma >= 176;
  };

  const backgroundPollutionScore = (r, g, b) => {
    const stats = colorStats(r, g, b);
    let score = isLightMatte(r, g, b) ? Math.min(1, (stats.luma - 168) / 78) * (1 - Math.min(1, stats.saturation / 0.46)) : 0;
    for (const color of backgroundProfiles) {
      const dr = r - color.r;
      const dg = g - color.g;
      const db = b - color.b;
      const distance = Math.sqrt(dr * dr + dg * dg + db * db);
      const profile = rgbToHueSaturation(r, g, b);
      const hueClose = color.saturation >= 0.18 && profile.saturation >= 0.08
        ? Math.max(0, 1 - hueDistance(profile.hue, color.hue) / 44)
        : 0;
      const channelMatch = Math.max(
        0,
        1 - Math.max(Math.abs(r - color.r), Math.abs(g - color.g), Math.abs(b - color.b)) / 128
      );
      const distanceMatch = Math.max(0, 1 - distance / 170);
      const lumaClose = Math.max(0, 1 - Math.abs(stats.luma - color.stats.luma) / 150);
      score = Math.max(score, Math.max(hueClose * 0.92, distanceMatch * 0.78, channelMatch * 0.72) * (0.55 + lumaClose * 0.45));
    }
    return Math.max(0, Math.min(1, score));
  };

  const isStrongChromaticSpill = (r, g, b) => {
    const profile = rgbToHueSaturation(r, g, b);
    if (profile.saturation < 0.08 || profile.value < 20) return false;
    return backgroundProfiles.some((color) => (
      color.saturation >= 0.28
      && hueDistance(profile.hue, color.hue) <= 38
      && Math.max(
        Math.abs(r - color.r),
        Math.abs(g - color.g),
        Math.abs(b - color.b)
      ) <= 185
    ));
  };

  const edgeProfile = (x, y, radius = 2) => {
    let transparent = 0;
    let solid = 0;
    let weak = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          transparent += 1;
          continue;
        }
        const alpha = data[dataIndex(nx, ny) + 3];
        if (alpha <= 24) transparent += 1;
        else if (alpha >= 190) solid += 1;
        else weak += 1;
      }
    }
    return { solid, transparent, weak };
  };

  const findCleanInnerColor = (x, y) => {
    for (let radius = 2; radius <= 14; radius += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let weight = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const index = dataIndex(nx, ny);
          const alpha = data[index + 3];
          if (alpha < 210) continue;
          const pollution = backgroundPollutionScore(source[index], source[index + 1], source[index + 2]);
          const stats = colorStats(source[index], source[index + 1], source[index + 2]);
          if (pollution >= 0.42 && stats.saturation <= 0.42) continue;
          const localWeight = alpha * (1 - Math.min(0.88, pollution));
          r += data[index] * localWeight;
          g += data[index + 1] * localWeight;
          b += data[index + 2] * localWeight;
          weight += localWeight;
        }
      }
      if (weight > 0) return { r: r / weight, g: g / weight, b: b / weight };
    }
    return null;
  };

  for (let pass = 0; pass < 3; pass += 1) {
    const snapshot = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = dataIndex(x, y);
        const alpha = snapshot[index + 3];
        if (alpha <= 0) continue;

        const edge = edgeProfile(x, y, pass === 0 ? 2 : 3);
        if (edge.transparent === 0 && edge.weak <= 1) continue;

        const sourcePollution = backgroundPollutionScore(source[index], source[index + 1], source[index + 2]);
        const currentPollution = backgroundPollutionScore(snapshot[index], snapshot[index + 1], snapshot[index + 2]);
        const pollution = Math.max(sourcePollution, currentPollution);
        if (pollution < 0.34) continue;

        const inner = findCleanInnerColor(x, y);
        const edgeStrength = Math.min(1, (edge.transparent + edge.weak * 0.45) / 12);
        const unsupported = edge.solid <= 2 && edge.transparent >= 4;
        const stats = colorStats(snapshot[index], snapshot[index + 1], snapshot[index + 2]);
        const chromaticSpill = isStrongChromaticSpill(source[index], source[index + 1], source[index + 2])
          || isStrongChromaticSpill(snapshot[index], snapshot[index + 1], snapshot[index + 2]);
        const neutralMatte = stats.saturation <= 0.34 && stats.luma >= 156;
        const mix = Math.min(0.94, 0.22 + pollution * 0.46 + edgeStrength * 0.24);

        if (inner) {
          data[index] = Math.round(snapshot[index] * (1 - mix) + inner.r * mix);
          data[index + 1] = Math.round(snapshot[index + 1] * (1 - mix) + inner.g * mix);
          data[index + 2] = Math.round(snapshot[index + 2] * (1 - mix) + inner.b * mix);
        }

        if (chromaticSpill && edgeStrength >= 0.18) {
          const keep = unsupported ? 0.12 : (edgeStrength >= 0.34 ? 0.36 : 0.52);
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * keep));
        } else if (unsupported || (pollution >= 0.62 && edgeStrength >= 0.36)) {
          const keep = unsupported ? 0.30 : 0.54;
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * keep));
        } else if (neutralMatte && edgeStrength >= 0.24 && edge.transparent >= 2) {
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * 0.68));
        } else if (pollution >= 0.48 && edgeStrength >= 0.28) {
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * 0.78));
        }
      }
    }
  }

  return imageData;
}

function removeBackgroundSpillResidue(imageData, options = {}) {
  const { width, height, data } = imageData;
  const source = options.sourceImageData?.data || data;
  const backgroundColors = options.backgroundColors || [];
  if (width <= 0 || height <= 0) return imageData;

  const colorProfiles = backgroundColors
    .map((color) => ({
      ...color,
      ...rgbToHueSaturation(color.r, color.g, color.b),
      stats: colorStats(color.r, color.g, color.b)
    }))
    .filter((color) => color.saturation >= 0.22);

  const dataIndex = (x, y) => (y * width + x) * 4;

  const localSupport = (snapshot, x, y, radius = 2) => {
    let transparent = 0;
    let weak = 0;
    let solid = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          transparent += 1;
          continue;
        }
        const alpha = snapshot[dataIndex(nx, ny) + 3];
        if (alpha <= 24) transparent += 1;
        else if (alpha >= 210) solid += 1;
        else weak += 1;
      }
    }
    return { transparent, weak, solid };
  };

  const chromaCloseScore = (r, g, b, color) => {
    const total = Math.max(1, r + g + b);
    const colorTotal = Math.max(1, color.r + color.g + color.b);
    const dr = r / total - color.r / colorTotal;
    const dg = g / total - color.g / colorTotal;
    const db = b / total - color.b / colorTotal;
    return Math.max(0, 1 - Math.sqrt(dr * dr + dg * dg + db * db) / 0.42);
  };

  const spillScore = (r, g, b) => {
    if (colorProfiles.length === 0) return 0;
    const profile = rgbToHueSaturation(r, g, b);
    if (profile.saturation < 0.04 || profile.value < 8) return 0;
    let best = 0;
    for (const color of colorProfiles) {
      const hueClose = Math.max(0, 1 - hueDistance(profile.hue, color.hue) / 68);
      const chromaClose = chromaCloseScore(r, g, b, color);
      const satSignal = Math.min(1, profile.saturation / Math.max(0.12, color.saturation * 0.42));
      const channels = [r, g, b];
      const colorChannels = [color.r, color.g, color.b];
      const minChannel = colorChannels.indexOf(Math.min(...colorChannels));
      const maxChannel = colorChannels.indexOf(Math.max(...colorChannels));
      const channelSpread = Math.max(channels[0], channels[1], channels[2]) - Math.min(channels[0], channels[1], channels[2]);
      const sameLowChannel = channelSpread >= 12
        && channels[minChannel] + 8 < Math.max(channels[0], channels[1], channels[2]);
      const sameHighChannel = channels[maxChannel] >= Math.min(245, Math.max(channels[0], channels[1], channels[2]) - 10);
      const channelSignature = sameLowChannel ? (sameHighChannel ? 0.88 : 0.74) : 0;
      const lumaAllowance = Math.max(0.48, 1 - Math.abs(colorStats(r, g, b).luma - color.stats.luma) / 230);
      const effectiveSaturation = Math.max(satSignal, sameLowChannel ? 0.76 : 0);
      best = Math.max(
        best,
        Math.max(hueClose * 0.82, chromaClose * 0.94, channelSignature) * effectiveSaturation * lumaAllowance
      );
    }
    return Math.max(0, Math.min(1, best));
  };

  const findReplacementColor = (snapshot, x, y) => {
    for (let radius = 2; radius <= 16; radius += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let weight = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const index = dataIndex(nx, ny);
          const alpha = snapshot[index + 3];
          if (alpha < 205) continue;
          const score = Math.max(
            spillScore(snapshot[index], snapshot[index + 1], snapshot[index + 2]),
            spillScore(source[index], source[index + 1], source[index + 2])
          );
          if (score >= 0.34) continue;
          const support = localSupport(snapshot, nx, ny, 1);
          if (support.transparent > 0 || support.weak > 2) continue;
          const localWeight = alpha / Math.max(1, 1 + Math.abs(dx) + Math.abs(dy));
          r += snapshot[index] * localWeight;
          g += snapshot[index + 1] * localWeight;
          b += snapshot[index + 2] * localWeight;
          weight += localWeight;
        }
      }
      if (weight > 0) return { r: r / weight, g: g / weight, b: b / weight };
    }
    return null;
  };

  for (let pass = 0; pass < 2; pass += 1) {
    const snapshot = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = dataIndex(x, y);
        const alpha = snapshot[index + 3];
        if (alpha <= 0) continue;

        const support = localSupport(snapshot, x, y, pass === 0 ? 2 : 3);
        const edgeStrength = Math.min(1, (support.transparent + support.weak * 0.42) / 12);
        if (edgeStrength <= 0 && alpha >= 245) continue;

        const score = Math.max(
          spillScore(snapshot[index], snapshot[index + 1], snapshot[index + 2]),
          spillScore(source[index], source[index + 1], source[index + 2])
        );
        const stats = colorStats(snapshot[index], snapshot[index + 1], snapshot[index + 2]);
        const neutralHalo = stats.saturation <= 0.30 && stats.luma >= 142 && support.transparent >= 2 && edgeStrength >= 0.18;
        if (score < 0.24 && !neutralHalo) continue;

        const weakIsland = support.solid <= 2 && support.transparent >= 5;
        const unsupportedEdge = support.solid <= 4 && edgeStrength >= 0.28;
        const replacement = findReplacementColor(snapshot, x, y);

        if (replacement) {
          const mix = Math.min(0.96, 0.34 + score * 0.42 + edgeStrength * 0.28 + (neutralHalo ? 0.18 : 0));
          data[index] = Math.round(snapshot[index] * (1 - mix) + replacement.r * mix);
          data[index + 1] = Math.round(snapshot[index + 1] * (1 - mix) + replacement.g * mix);
          data[index + 2] = Math.round(snapshot[index + 2] * (1 - mix) + replacement.b * mix);
        } else if (score >= 0.42) {
          const luma = Math.round(stats.luma);
          data[index] = Math.round(snapshot[index] * 0.35 + luma * 0.65);
          data[index + 1] = Math.round(snapshot[index + 1] * 0.35 + luma * 0.65);
          data[index + 2] = Math.round(snapshot[index + 2] * 0.35 + luma * 0.65);
        }

        if (score >= 0.50 && edgeStrength >= 0.14) {
          const keep = weakIsland ? 0.0 : (unsupportedEdge ? 0.08 : 0.22);
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * keep));
        } else if (score >= 0.34 && edgeStrength >= 0.20) {
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * (unsupportedEdge ? 0.18 : 0.34)));
        } else if (neutralHalo && unsupportedEdge) {
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * 0.36));
        }
      }
    }
  }

  return imageData;
}

function refineBackgroundMatteEdges(imageData, options = {}) {
  const { width, height, data } = imageData;
  const source = options.sourceImageData?.data || data;
  const backgroundColors = options.backgroundColors || [];
  if (width <= 0 || height <= 0) return imageData;

  const maxRadius = options.fast ? 2 : 3;
  const profiles = backgroundColors.map((color) => ({
    ...color,
    ...rgbToHueSaturation(color.r, color.g, color.b),
    stats: colorStats(color.r, color.g, color.b)
  }));
  const dataIndex = (x, y) => (y * width + x) * 4;

  const matteScore = (r, g, b) => {
    const stats = colorStats(r, g, b);
    const profile = rgbToHueSaturation(r, g, b);
    let best = 0;
    for (const bg of profiles) {
      const dr = r - bg.r;
      const dg = g - bg.g;
      const db = b - bg.b;
      const distanceScore = Math.max(0, 1 - Math.sqrt(dr * dr + dg * dg + db * db) / 150);
      const hueScore = bg.saturation >= 0.16 && profile.saturation >= 0.06
        ? Math.max(0, 1 - hueDistance(profile.hue, bg.hue) / 58)
        : 0;
      const lumaScore = Math.max(0, 1 - Math.abs(stats.luma - bg.stats.luma) / 125);
      best = Math.max(best, Math.max(distanceScore, hueScore * 0.92) * (0.55 + lumaScore * 0.45));
    }

    const neutralDark = stats.luma <= 54 && stats.saturation <= 0.48;
    const neutralLight = stats.luma >= 192 && stats.saturation <= 0.38;
    if (neutralDark) best = Math.max(best, Math.max(0, 1 - stats.luma / 62) * 0.9);
    if (neutralLight) best = Math.max(best, Math.max(0, (stats.luma - 182) / 73) * 0.86);
    return Math.max(0, Math.min(1, best));
  };

  const supportProfile = (snapshot, x, y, radius) => {
    let transparent = 0;
    let weak = 0;
    let solid = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          transparent += 1;
          continue;
        }
        const alpha = snapshot[dataIndex(nx, ny) + 3];
        if (alpha <= 18) transparent += 1;
        else if (alpha >= 210) solid += 1;
        else weak += 1;
      }
    }
    return { transparent, weak, solid };
  };

  const cleanInnerColor = (snapshot, x, y) => {
    const maxSearch = options.fast ? 8 : 16;
    for (let radius = 2; radius <= maxSearch; radius += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let weight = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const index = dataIndex(nx, ny);
          const alpha = snapshot[index + 3];
          if (alpha < 215) continue;
          const support = supportProfile(snapshot, nx, ny, 1);
          if (support.transparent > 0 || support.weak > 2) continue;
          const score = Math.max(
            matteScore(snapshot[index], snapshot[index + 1], snapshot[index + 2]),
            matteScore(source[index], source[index + 1], source[index + 2])
          );
          if (score >= 0.30) continue;
          const localWeight = alpha / Math.max(1, 1 + Math.abs(dx) + Math.abs(dy));
          r += snapshot[index] * localWeight;
          g += snapshot[index + 1] * localWeight;
          b += snapshot[index + 2] * localWeight;
          weight += localWeight;
        }
      }
      if (weight > 0) return { r: r / weight, g: g / weight, b: b / weight };
    }
    return null;
  };

  const passes = options.fast ? 1 : 2;
  for (let pass = 0; pass < passes; pass += 1) {
    const snapshot = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = dataIndex(x, y);
        const alpha = snapshot[index + 3];
        if (alpha <= 0) continue;

        const support = supportProfile(snapshot, x, y, maxRadius);
        const edgeStrength = Math.min(1, (support.transparent + support.weak * 0.36) / (maxRadius === 2 ? 10 : 16));
        if (edgeStrength <= 0.05 && alpha >= 245) continue;

        const score = Math.max(
          matteScore(snapshot[index], snapshot[index + 1], snapshot[index + 2]),
          matteScore(source[index], source[index + 1], source[index + 2])
        );
        if (score < 0.22) continue;

        const unsupported = support.solid <= (options.fast ? 3 : 5) && support.transparent >= (options.fast ? 3 : 5);
        const inner = cleanInnerColor(snapshot, x, y);
        if (inner) {
          const mix = Math.min(0.96, 0.28 + score * 0.48 + edgeStrength * 0.26);
          data[index] = Math.round(snapshot[index] * (1 - mix) + inner.r * mix);
          data[index + 1] = Math.round(snapshot[index + 1] * (1 - mix) + inner.g * mix);
          data[index + 2] = Math.round(snapshot[index + 2] * (1 - mix) + inner.b * mix);
        }

        if (unsupported && score >= 0.44) {
          data[index + 3] = 0;
        } else if (score >= 0.52 && edgeStrength >= 0.14) {
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * (unsupported ? 0.08 : 0.24)));
        } else if (score >= 0.34 && edgeStrength >= 0.22) {
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * (unsupported ? 0.20 : 0.46)));
        } else if (score >= 0.26 && edgeStrength >= 0.34 && alpha < 210) {
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * 0.68));
        }
      }
    }
  }

  return imageData;
}

function professionalTransparentCleanup(imageData, options = {}) {
  alphaMaskPostProcess(imageData, options);
  defringeTransparentEdgeColors(imageData, options);
  stripEdgeMattePollution(imageData, options);
  removeBackgroundSpillResidue(imageData, options);
  refineBackgroundMatteEdges(imageData, options);
  alphaMaskPostProcess(imageData, {
    ...options,
    alphaFloor: options.aggressive ? 20 : 14,
    weakAlpha: options.aggressive ? 110 : 72
  });
  bleedOpaqueColorsIntoTransparentPixels(imageData);
  return imageData;
}

function professionalMaskCleanup(cleaned, sourceImageData, backgroundColors = []) {
  if (!cleaned || !sourceImageData) return cleaned;
  const { width, height, data } = cleaned;
  const source = sourceImageData.data;
  if (width <= 0 || height <= 0) return cleaned;

  const pixelCount = width * height;
  const pixelIndex = (x, y) => y * width + x;
  const dataIndex = (x, y) => pixelIndex(x, y) * 4;
  const profiles = backgroundColors.map((color) => ({
    ...color,
    ...rgbToHueSaturation(color.r, color.g, color.b),
    stats: colorStats(color.r, color.g, color.b)
  }));

  const backgroundScore = (r, g, b) => {
    const stats = colorStats(r, g, b);
    const profile = rgbToHueSaturation(r, g, b);
    let score = 0;
    for (const bg of profiles) {
      const dr = r - bg.r;
      const dg = g - bg.g;
      const db = b - bg.b;
      const distance = Math.sqrt(dr * dr + dg * dg + db * db);
      const distanceScore = Math.max(0, 1 - distance / 150);
      const hueScore = bg.saturation >= 0.16 && profile.saturation >= 0.06
        ? Math.max(0, 1 - hueDistance(profile.hue, bg.hue) / 54)
        : 0;
      const lumaScore = Math.max(0, 1 - Math.abs(stats.luma - bg.stats.luma) / 132);
      score = Math.max(score, Math.max(distanceScore, hueScore * 0.92) * (0.54 + lumaScore * 0.46));
    }
    if (stats.saturation <= 0.34 && stats.luma <= 48) score = Math.max(score, 0.92);
    if (stats.saturation <= 0.26 && stats.luma >= 218) score = Math.max(score, 0.86);
    if (stats.saturation <= 0.18 && stats.luma >= 132 && stats.luma <= 205) score = Math.max(score, 0.58);
    return Math.max(0, Math.min(1, score));
  };

  const subjectScoreAt = (index) => {
    const stats = colorStats(source[index], source[index + 1], source[index + 2]);
    if (source[index + 3] <= 12) return 0;
    if (stats.saturation >= 0.34 && stats.luma >= 28) return 1;
    if (stats.saturation >= 0.20 && stats.luma < 220) return 0.72;
    if (stats.luma >= 54 && stats.luma <= 184) return 0.48;
    return 0;
  };

  const bgScore = new Uint8ClampedArray(pixelCount);
  const subjectScore = new Uint8ClampedArray(pixelCount);
  for (let p = 0; p < pixelCount; p += 1) {
    const index = p * 4;
    bgScore[p] = Math.round(Math.max(
      backgroundScore(data[index], data[index + 1], data[index + 2]),
      backgroundScore(source[index], source[index + 1], source[index + 2])
    ) * 255);
    subjectScore[p] = Math.round(subjectScoreAt(index) * 255);
  }

  const neighborhood = (x, y, radius = 2) => {
    let subject = 0;
    let strongSubject = 0;
    let transparent = 0;
    let background = 0;
    let darkSubjectSupport = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          transparent += 1;
          continue;
        }
        const index = dataIndex(nx, ny);
        const p = pixelIndex(nx, ny);
        const alpha = data[index + 3];
        if (alpha <= 12) {
          transparent += 1;
          continue;
        }
        if (bgScore[p] >= 168 && subjectScore[p] < 140) {
          background += 1;
          continue;
        }
        subject += 1;
        if (alpha >= 170 || subjectScore[p] >= 178) strongSubject += 1;
        if (subjectScore[p] >= 178) darkSubjectSupport += 1;
      }
    }
    return { subject, strongSubject, transparent, background, darkSubjectSupport };
  };

  const protectedMask = new Uint8Array(pixelCount);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = pixelIndex(x, y);
      const index = p * 4;
      if (data[index + 3] <= 0 && source[index + 3] <= 0) continue;
      const stats = colorStats(source[index], source[index + 1], source[index + 2]);
      const support = neighborhood(x, y, 2);
      if (
        (stats.saturation >= 0.34 && support.subject >= 2) ||
        (stats.saturation >= 0.22 && support.strongSubject >= 2 && bgScore[p] < 209) ||
        (stats.luma < 82 && support.darkSubjectSupport >= 3) ||
        (support.strongSubject >= 7 && bgScore[p] < 184)
      ) {
        protectedMask[p] = 1;
      }
    }
  }

  const restoreOvercutDetails = () => {
    const snapshot = new Uint8ClampedArray(data);
    const toRestore = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const p = pixelIndex(x, y);
        const index = dataIndex(x, y);
        if (snapshot[index + 3] !== 0 || source[index + 3] <= 12) continue;
        if (!protectedMask[p]) continue;
        const support = neighborhood(x, y, 2);
        if (support.strongSubject >= 3 || support.subject >= 8) {
          toRestore.push({ index, alpha: support.strongSubject >= 5 ? 230 : 185 });
        }
      }
    }
    for (const item of toRestore) {
      data[item.index] = source[item.index];
      data[item.index + 1] = source[item.index + 1];
      data[item.index + 2] = source[item.index + 2];
      data[item.index + 3] = Math.max(data[item.index + 3], Math.min(255, item.alpha));
    }
  };

  const removableBackgroundPixel = (x, y, looseness = 0) => {
    const p = pixelIndex(x, y);
    const alpha = data[p * 4 + 3];
    if (alpha === 0) return true;
    const score = bgScore[p];
    if (score < Math.round((0.58 - looseness * 0.04) * 255)) return false;
    if (protectedMask[p] && score < 219) return false;
    return true;
  };

  restoreOvercutDetails();

  const removed = new Uint8Array(pixelCount);
  const visited = new Uint8Array(pixelCount);
  const queue = [];
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = pixelIndex(x, y);
    if (visited[p] || !removableBackgroundPixel(x, y, 0)) return;
    visited[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let head = 0; head < queue.length; head += 1) {
    const p = queue[head];
    removed[p] = 1;
    const x = p % width;
    const y = Math.floor(p / width);
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        enqueue(x + dx, y + dy);
      }
    }
  }

  const applyRemoval = (p) => {
    const index = p * 4;
    data[index + 3] = 0;
    removed[p] = 1;
  };
  for (let p = 0; p < pixelCount; p += 1) {
    if (removed[p]) applyRemoval(p);
  }

  const componentVisited = new Uint8Array(pixelCount);
  const component = [];
  const work = [];
  const maxHoleArea = Math.max(24, Math.round(pixelCount * 0.006));
  for (let start = 0; start < pixelCount; start += 1) {
    if (componentVisited[start]) continue;
    const sx = start % width;
    const sy = Math.floor(start / width);
    if (!removableBackgroundPixel(sx, sy, 1)) continue;

    component.length = 0;
    work.length = 0;
    work.push(start);
    componentVisited[start] = 1;
    let touchesBorder = false;
    let subjectBorder = 0;
    let protectedCount = 0;
    let bgScoreSum = 0;

    for (let head = 0; head < work.length; head += 1) {
      const p = work[head];
      component.push(p);
      const x = p % width;
      const y = Math.floor(p / width);
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesBorder = true;
      bgScoreSum += bgScore[p] / 255;
      if (protectedMask[p]) protectedCount += 1;

      const neighbors = [
        x > 0 ? p - 1 : -1,
        x < width - 1 ? p + 1 : -1,
        y > 0 ? p - width : -1,
        y < height - 1 ? p + width : -1
      ];
      for (const next of neighbors) {
        if (next < 0) continue;
        const nx = next % width;
        const ny = Math.floor(next / width);
        if (removableBackgroundPixel(nx, ny, 1)) {
          if (!componentVisited[next]) {
            componentVisited[next] = 1;
            work.push(next);
          }
        } else if (data[next * 4 + 3] > 18) {
          subjectBorder += 1;
        }
      }
    }

    if (touchesBorder) continue;
    const area = component.length;
    const avgBgScore = bgScoreSum / Math.max(1, area);
    const enclosed = subjectBorder >= Math.max(8, area * 0.38);
    const mostlyBackground = avgBgScore >= 0.62 && protectedCount / Math.max(1, area) <= 0.32;
    if (area <= maxHoleArea && enclosed && mostlyBackground) {
      for (const p of component) applyRemoval(p);
    }
  }

  for (let pass = 0; pass < 2; pass += 1) {
    const snapshot = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const p = pixelIndex(x, y);
        const index = p * 4;
        const alpha = snapshot[index + 3];
        if (alpha <= 0) continue;
        const support = neighborhood(x, y, pass === 0 ? 1 : 2);
        const nearBackground = support.transparent + support.background;
        if (nearBackground < (pass === 0 ? 2 : 5)) continue;
        const score = bgScore[p] / 255;
        if (protectedMask[p] && score < 0.84) continue;
        if (score >= 0.72 && support.strongSubject <= 2) {
          data[index + 3] = 0;
        } else if (score >= 0.54 && nearBackground >= 4) {
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * 0.42));
        }
      }
    }
  }

  restoreOvercutDetails();
  refineBackgroundMatteEdges(cleaned, {
    sourceImageData,
    backgroundColors,
    fast: pixelCount > 900000
  });
  bleedOpaqueColorsIntoTransparentPixels(cleaned);
  return cleaned;
}



function cleanCheckerboardBackgroundByAlphaMatte(imageData) {
  const cleaned = cloneImageData(imageData);
  const { width, height, data } = cleaned;
  if (width <= 0 || height <= 0) return cleaned;

  const pixelCount = width * height;
  const pixelIndex = (x, y) => y * width + x;
  const dataIndex = (x, y) => pixelIndex(x, y) * 4;
  const distanceTo = (index, color) => Math.sqrt(
    (data[index] - color.r) ** 2 +
    (data[index + 1] - color.g) ** 2 +
    (data[index + 2] - color.b) ** 2
  );

  const samples = [];
  const addSample = (x, y, weight = 1) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = dataIndex(x, y);
    if (data[index + 3] <= 8) return;
    const stats = colorStats(data[index], data[index + 1], data[index + 2]);
    if (stats.saturation > 0.24 || stats.luma < 168) return;
    samples.push({ r: data[index], g: data[index + 1], b: data[index + 2], luma: stats.luma, weight });
  };

  const edgeStep = Math.max(1, Math.floor(Math.min(width, height) / 220));
  for (let x = 0; x < width; x += edgeStep) {
    addSample(x, 0, 5);
    addSample(x, height - 1, 5);
    addSample(x, 1, 3);
    addSample(x, height - 2, 3);
  }
  for (let y = 0; y < height; y += edgeStep) {
    addSample(0, y, 5);
    addSample(width - 1, y, 5);
    addSample(1, y, 3);
    addSample(width - 2, y, 3);
  }
  if (samples.length < 12) {
    samples.push({ r: 238, g: 238, b: 238, luma: 238, weight: 1 });
    samples.push({ r: 255, g: 255, b: 255, luma: 255, weight: 1 });
  }

  let dark = samples.reduce((best, sample) => (sample.luma < best.luma ? sample : best), samples[0]);
  let light = samples.reduce((best, sample) => (sample.luma > best.luma ? sample : best), samples[0]);
  for (let iter = 0; iter < 8; iter += 1) {
    const sums = [
      { r: 0, g: 0, b: 0, luma: 0, weight: 0 },
      { r: 0, g: 0, b: 0, luma: 0, weight: 0 }
    ];
    for (const sample of samples) {
      const darkDistance = (sample.r - dark.r) ** 2 + (sample.g - dark.g) ** 2 + (sample.b - dark.b) ** 2;
      const lightDistance = (sample.r - light.r) ** 2 + (sample.g - light.g) ** 2 + (sample.b - light.b) ** 2;
      const sum = sums[darkDistance <= lightDistance ? 0 : 1];
      sum.r += sample.r * sample.weight;
      sum.g += sample.g * sample.weight;
      sum.b += sample.b * sample.weight;
      sum.luma += sample.luma * sample.weight;
      sum.weight += sample.weight;
    }
    if (sums[0].weight > 0) dark = { r: sums[0].r / sums[0].weight, g: sums[0].g / sums[0].weight, b: sums[0].b / sums[0].weight, luma: sums[0].luma / sums[0].weight };
    if (sums[1].weight > 0) light = { r: sums[1].r / sums[1].weight, g: sums[1].g / sums[1].weight, b: sums[1].b / sums[1].weight, luma: sums[1].luma / sums[1].weight };
  }
  const checkerColors = [dark, light]
    .sort((a, b) => a.luma - b.luma)
    .map((color) => ({ r: Math.round(color.r), g: Math.round(color.g), b: Math.round(color.b), luma: color.luma, saturation: 0 }));

  const classify = (index) => distanceTo(index, checkerColors[0]) <= distanceTo(index, checkerColors[1]) ? 0 : 1;
  const runLengths = [];
  const scanLine = (points) => {
    let last = -1;
    let run = 0;
    for (const [x, y] of points) {
      const index = dataIndex(x, y);
      const stats = colorStats(data[index], data[index + 1], data[index + 2]);
      if (stats.saturation > 0.24 || stats.luma < 168) {
        if (run >= 4) runLengths.push(run);
        last = -1;
        run = 0;
        continue;
      }
      const label = classify(index);
      if (last < 0 || label === last) run += 1;
      else {
        if (run >= 4) runLengths.push(run);
        run = 1;
      }
      last = label;
    }
    if (run >= 4) runLengths.push(run);
  };
  for (const y of [0, 1, height - 2, height - 1]) {
    const points = [];
    for (let x = 0; x < width; x += 1) points.push([x, y]);
    scanLine(points);
  }
  for (const x of [0, 1, width - 2, width - 1]) {
    const points = [];
    for (let y = 0; y < height; y += 1) points.push([x, y]);
    scanLine(points);
  }
  runLengths.sort((a, b) => a - b);
  const tileSize = Math.max(6, Math.min(64, Math.round(runLengths[Math.floor(runLengths.length / 2)] || 20)));

  const fitPoints = [];
  const fitStep = Math.max(1, Math.floor(Math.min(width, height) / 180));
  for (let x = 0; x < width; x += fitStep) {
    for (const y of [0, 1, height - 2, height - 1]) {
      const index = dataIndex(x, y);
      const stats = colorStats(data[index], data[index + 1], data[index + 2]);
      if (stats.saturation <= 0.24 && stats.luma >= 168) fitPoints.push({ x, y, label: classify(index) });
    }
  }
  for (let y = 0; y < height; y += fitStep) {
    for (const x of [0, 1, width - 2, width - 1]) {
      const index = dataIndex(x, y);
      const stats = colorStats(data[index], data[index + 1], data[index + 2]);
      if (stats.saturation <= 0.24 && stats.luma >= 168) fitPoints.push({ x, y, label: classify(index) });
    }
  }

  let model = { ox: 0, oy: 0, invert: 0, mismatches: Infinity };
  for (let oy = 0; oy < tileSize; oy += 1) {
    for (let ox = 0; ox < tileSize; ox += 1) {
      for (let invert = 0; invert <= 1; invert += 1) {
        let mismatches = 0;
        for (const point of fitPoints) {
          const predicted = ((Math.floor((point.x + ox) / tileSize) + Math.floor((point.y + oy) / tileSize)) & 1) ^ invert;
          if (predicted !== point.label) mismatches += 1;
        }
        if (mismatches < model.mismatches) model = { ox, oy, invert, mismatches };
      }
    }
  }
  const expectedColor = (x, y) => checkerColors[((Math.floor((x + model.ox) / tileSize) + Math.floor((y + model.oy) / tileSize)) & 1) ^ model.invert];

  const backgroundCandidate = new Uint8Array(pixelCount);
  const subjectSeed = new Uint8Array(pixelCount);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = pixelIndex(x, y);
      const index = p * 4;
      const stats = colorStats(data[index], data[index + 1], data[index + 2]);
      const distance = distanceTo(index, expectedColor(x, y));
      const checkerLike = data[index + 3] <= 0 || (stats.saturation <= 0.30 && stats.luma >= 160 && distance <= 30);
      if (checkerLike) backgroundCandidate[p] = 1;
      if (data[index + 3] > 8 && !checkerLike && (stats.saturation >= 0.18 || stats.luma < 220 || distance > 42)) subjectSeed[p] = 1;
    }
  }

  const countNeighbors = (x, y, radius, predicate) => {
    let count = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        if (predicate(pixelIndex(nx, ny))) count += 1;
      }
    }
    return count;
  };

  const protectedMask = new Uint8Array(pixelCount);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = pixelIndex(x, y);
      const index = p * 4;
      if (data[index + 3] <= 0) continue;
      const stats = colorStats(data[index], data[index + 1], data[index + 2]);
      const subjectNear = countNeighbors(x, y, 2, (np) => subjectSeed[np] && data[np * 4 + 3] > 8);
      const checkerDistance = distanceTo(index, expectedColor(x, y));
      const checkerLike = backgroundCandidate[p] === 1;
      const petalLike = stats.luma >= 150 && stats.saturation <= 0.34 && subjectNear >= 5 && checkerDistance > 18;
      const darkDetail = stats.luma < 92 && subjectNear >= 2 && !checkerLike;
      if (subjectSeed[p] || (!checkerLike && subjectNear >= 4) || petalLike || darkDetail) protectedMask[p] = 1;
      if (protectedMask[p]) backgroundCandidate[p] = 0;
    }
  }

  const removed = new Uint8Array(pixelCount);
  const visited = new Uint8Array(pixelCount);
  const queue = [];
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = pixelIndex(x, y);
    if (visited[p] || !backgroundCandidate[p]) return;
    visited[p] = 1;
    queue.push(p);
  };
  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }
  for (let head = 0; head < queue.length; head += 1) {
    const p = queue[head];
    removed[p] = 1;
    const x = p % width;
    const y = Math.floor(p / width);
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx !== 0 || dy !== 0) enqueue(x + dx, y + dy);
      }
    }
  }
  for (let p = 0; p < pixelCount; p += 1) {
    if (removed[p]) data[p * 4 + 3] = 0;
  }

  const componentVisited = new Uint8Array(pixelCount);
  const component = [];
  const work = [];
  const maxHoleArea = Math.max(64, Math.round(pixelCount * 0.018));
  for (let start = 0; start < pixelCount; start += 1) {
    if (componentVisited[start] || !backgroundCandidate[start]) continue;
    component.length = 0;
    work.length = 0;
    work.push(start);
    componentVisited[start] = 1;
    let touchesBorder = false;
    let subjectBoundary = 0;
    let checkerScore = 0;
    for (let head = 0; head < work.length; head += 1) {
      const p = work[head];
      component.push(p);
      const x = p % width;
      const y = Math.floor(p / width);
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesBorder = true;
      checkerScore += Math.max(0, 1 - distanceTo(p * 4, expectedColor(x, y)) / 30);
      const neighbors = [x > 0 ? p - 1 : -1, x < width - 1 ? p + 1 : -1, y > 0 ? p - width : -1, y < height - 1 ? p + width : -1];
      for (const next of neighbors) {
        if (next < 0) continue;
        if (backgroundCandidate[next]) {
          if (!componentVisited[next]) {
            componentVisited[next] = 1;
            work.push(next);
          }
        } else if (data[next * 4 + 3] > 8) {
          const stats = colorStats(data[next * 4], data[next * 4 + 1], data[next * 4 + 2]);
          if (protectedMask[next] || stats.saturation >= 0.18 || stats.luma <= 150) subjectBoundary += 1;
        }
      }
    }
    const area = component.length;
    if (!touchesBorder && area <= maxHoleArea && subjectBoundary >= Math.max(5, area * 0.18) && checkerScore / Math.max(1, area) >= 0.52) {
      for (const p of component) data[p * 4 + 3] = 0;
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = pixelIndex(x, y);
      const index = p * 4;
      const alpha = data[index + 3];
      if (alpha <= 0) continue;
      const transparentNear = countNeighbors(x, y, 1, (np) => data[np * 4 + 3] <= 8);
      if (transparentNear < 2) continue;
      const distance = distanceTo(index, expectedColor(x, y));
      const checkerEdge = distance <= 22 && transparentNear >= 2;
      if (protectedMask[p] && !checkerEdge) continue;
      if (checkerEdge) data[index + 3] = 0;
      else if (distance <= 38 && transparentNear >= 4) data[index + 3] = Math.min(alpha, Math.round(alpha * 0.42));
    }
  }

  bleedOpaqueColorsIntoTransparentPixels(cleaned);
  return removeTransparentEdgeBlocks(cleaned);
}

function pixelCountOf(imageData) {
  return imageData ? imageData.width * imageData.height : 0;
}


function yieldToBrowser(delay = 0) {
  return new Promise((resolve) => window.setTimeout(resolve, delay));
}

function fillInternalTransparentPixels(imageData, options = {}) {
  if (!imageData) return imageData;
  const { width, height, data } = imageData;
  if (width <= 2 || height <= 2) return imageData;

  const alphaLimit = options.alphaLimit ?? 24;
  const fillAlpha = options.fillAlpha ?? 255;
  const pixelCount = width * height;
  const pixelIndex = (x, y) => y * width + x;
  const outside = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;

  const isTransparent = (pixel) => data[pixel * 4 + 3] <= alphaLimit;
  const pushOutside = (pixel) => {
    if (pixel < 0 || pixel >= pixelCount || outside[pixel] || !isTransparent(pixel)) return;
    outside[pixel] = 1;
    queue[tail] = pixel;
    tail += 1;
  };

  for (let x = 0; x < width; x += 1) {
    pushOutside(x);
    pushOutside((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    pushOutside(y * width);
    pushOutside(y * width + width - 1);
  }

  while (head < tail) {
    const pixel = queue[head];
    head += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (x > 0) pushOutside(pixel - 1);
    if (x < width - 1) pushOutside(pixel + 1);
    if (y > 0) pushOutside(pixel - width);
    if (y < height - 1) pushOutside(pixel + width);
  }

  const hole = new Uint8Array(pixelCount);
  let holeCount = 0;
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    if (isTransparent(pixel) && !outside[pixel]) {
      hole[pixel] = 1;
      holeCount += 1;
    }
  }
  if (holeCount === 0) return imageData;

  const visited = new Uint8Array(pixelCount);
  const fillR = new Uint8ClampedArray(pixelCount);
  const fillG = new Uint8ClampedArray(pixelCount);
  const fillB = new Uint8ClampedArray(pixelCount);
  head = 0;
  tail = 0;

  const seedFromOpaqueNeighbor = (pixel) => {
    if (!hole[pixel] || visited[pixel]) return;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    let bestAlpha = -1;
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const neighbor = pixelIndex(nx, ny);
        if (hole[neighbor]) continue;
        const index = neighbor * 4;
        const alpha = data[index + 3];
        if (alpha <= alphaLimit) continue;
        if (alpha > bestAlpha) {
          bestAlpha = alpha;
          r = data[index];
          g = data[index + 1];
          b = data[index + 2];
          count = 1;
        } else if (alpha === bestAlpha) {
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          count += 1;
        }
      }
    }
    if (count <= 0) return;
    visited[pixel] = 1;
    fillR[pixel] = Math.round(r / count);
    fillG[pixel] = Math.round(g / count);
    fillB[pixel] = Math.round(b / count);
    queue[tail] = pixel;
    tail += 1;
  };

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    if (hole[pixel]) seedFromOpaqueNeighbor(pixel);
  }

  while (head < tail) {
    const pixel = queue[head];
    head += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const neighbors = [
      x > 0 ? pixel - 1 : -1,
      x < width - 1 ? pixel + 1 : -1,
      y > 0 ? pixel - width : -1,
      y < height - 1 ? pixel + width : -1
    ];
    for (const nextPixel of neighbors) {
      if (nextPixel < 0 || !hole[nextPixel] || visited[nextPixel]) continue;
      visited[nextPixel] = 1;
      fillR[nextPixel] = fillR[pixel];
      fillG[nextPixel] = fillG[pixel];
      fillB[nextPixel] = fillB[pixel];
      queue[tail] = nextPixel;
      tail += 1;
    }
  }

  let filled = 0;
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    if (!visited[pixel]) continue;
    const index = pixel * 4;
    data[index] = fillR[pixel];
    data[index + 1] = fillG[pixel];
    data[index + 2] = fillB[pixel];
    data[index + 3] = fillAlpha;
    filled += 1;
  }
  imageData.filledInternalPixelCount = filled;
  return imageData;
}

function createCutoutWorker() {
  if (cutoutWorker) return cutoutWorker;
  const source = `
    const alphaFromDistanceSquared = (distanceSquared, hardLimit, softRange) => {
      const hardSquared = hardLimit * hardLimit;
      if (distanceSquared <= hardSquared) return 0;
      const outerLimit = hardLimit + softRange;
      if (softRange <= 0 || distanceSquared >= outerLimit * outerLimit) return 255;
      return Math.round(((Math.sqrt(distanceSquared) - hardLimit) / softRange) * 255);
    };
    self.onmessage = (event) => {
      const { id, buffer, width, height, colors, hardLimit, softRange, contiguous } = event.data;
      try {
        const pixels = new Uint8ClampedArray(buffer);
        const pixelCount = width * height;
        const distanceMap = new Uint32Array(pixelCount);
        for (let pixel = 0; pixel < pixelCount; pixel += 1) {
          const index = pixel * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          let best = 0xffffffff;
          for (let colorIndex = 0; colorIndex < colors.length; colorIndex += 1) {
            const color = colors[colorIndex];
            const dr = r - color.r;
            const dg = g - color.g;
            const db = b - color.b;
            const distance = dr * dr + dg * dg + db * db;
            if (distance < best) best = distance;
          }
          distanceMap[pixel] = best;
        }

        if (!contiguous) {
          for (let pixel = 0; pixel < pixelCount; pixel += 1) {
            const alpha = alphaFromDistanceSquared(distanceMap[pixel], hardLimit, softRange);
            const alphaIndex = pixel * 4 + 3;
            pixels[alphaIndex] = Math.min(pixels[alphaIndex], alpha);
          }
        } else {
          const outer = hardLimit + softRange;
          const outerSquared = outer * outer;
          const candidate = new Uint8Array(pixelCount);
          const visited = new Uint8Array(pixelCount);
          const alphaMap = new Uint8ClampedArray(pixelCount);
          const queue = new Int32Array(pixelCount);
          for (let pixel = 0; pixel < pixelCount; pixel += 1) {
            const distance = distanceMap[pixel];
            if (distance <= outerSquared) candidate[pixel] = 1;
            alphaMap[pixel] = alphaFromDistanceSquared(distance, hardLimit, softRange);
          }
          let head = 0;
          let tail = 0;
          const enqueue = (pixel) => {
            if (pixel < 0 || pixel >= pixelCount || visited[pixel] || !candidate[pixel]) return;
            visited[pixel] = 1;
            queue[tail++] = pixel;
          };
          for (let x = 0; x < width; x += 1) {
            enqueue(x);
            enqueue((height - 1) * width + x);
          }
          for (let y = 1; y < height - 1; y += 1) {
            enqueue(y * width);
            enqueue(y * width + width - 1);
          }
          while (head < tail) {
            const pixel = queue[head++];
            const x = pixel % width;
            const y = Math.floor(pixel / width);
            const alphaIndex = pixel * 4 + 3;
            pixels[alphaIndex] = Math.min(pixels[alphaIndex], alphaMap[pixel]);
            if (x > 0) enqueue(pixel - 1);
            if (x < width - 1) enqueue(pixel + 1);
            if (y > 0) enqueue(pixel - width);
            if (y < height - 1) enqueue(pixel + width);
          }
        }
        self.postMessage({ id, buffer: pixels.buffer, width, height }, [pixels.buffer]);
      } catch (error) {
        self.postMessage({ id, error: error?.message || String(error) });
      }
    };
  `;
  cutoutWorkerUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
  cutoutWorker = new Worker(cutoutWorkerUrl);
  cutoutWorker.addEventListener("message", (event) => {
    const pending = cutoutWorkerPending.get(event.data.id);
    if (!pending) return;
    cutoutWorkerPending.delete(event.data.id);
    if (event.data.error) {
      pending.reject(new Error(event.data.error));
      return;
    }
    pending.resolve(new ImageData(new Uint8ClampedArray(event.data.buffer), event.data.width, event.data.height));
  });
  cutoutWorker.addEventListener("error", (event) => {
    for (const pending of cutoutWorkerPending.values()) pending.reject(event.error || new Error(event.message || "cutout worker error"));
    cutoutWorkerPending.clear();
    cutoutWorker?.terminate();
    cutoutWorker = null;
    if (cutoutWorkerUrl) URL.revokeObjectURL(cutoutWorkerUrl);
    cutoutWorkerUrl = "";
  });
  return cutoutWorker;
}

function buildCutoutInWorker(baseImageData) {
  return new Promise((resolve, reject) => {
    const worker = createCutoutWorker();
    const id = ++cutoutWorkerRequestId;
    const data = new Uint8ClampedArray(baseImageData.data);
    cutoutWorkerPending.set(id, { resolve, reject });
    worker.postMessage({
      id,
      buffer: data.buffer,
      width: baseImageData.width,
      height: baseImageData.height,
      colors: pickedColors.map(({ r, g, b }) => ({ r, g, b })),
      hardLimit: Number(tolerance.value),
      softRange: Number(softness.value),
      contiguous: Boolean(contiguous.checked)
    }, [data.buffer]);
  });
}

async function buildCutoutForCommit(baseImageData) {
  const useWorker = typeof Worker !== "undefined"
    && baseImageData.width * baseImageData.height >= cutoutWorkerPixelThreshold
    && !isForceRemoveEnabled();
  if (!useWorker) return buildCutoutFromBase(baseImageData);
  try {
    return await buildCutoutInWorker(baseImageData);
  } catch (error) {
    console.warn("Cutout worker unavailable, falling back to main thread", error);
    return buildCutoutFromBase(baseImageData);
  }
}

function buildCutoutFromBase(baseImageData, options = {}) {
  const next = cloneImageData(baseImageData);
  const hardLimit = Number(tolerance.value);
  const softRange = Number(softness.value);
  const distanceMap = options.useLiveCache ? liveDistanceMapFor(baseImageData) : null;

  if (isForceRemoveEnabled()) {
    applyForceColorRemoval(next, hardLimit, softRange);
  } else if (contiguous.checked) {
    applyContiguousRemoval(next, hardLimit, softRange, distanceMap);
  } else {
    applyGlobalRemoval(next, hardLimit, softRange, distanceMap);
  }

  // Background removal itself must stay immediate. Heavy edge reconstruction belongs to
  // the dedicated transparent-background cleanup tools, not every slider movement.
  if (!options.fullCleanup) return next;

  cleanTransparentEdges(next, baseImageData, hardLimit, softRange);
  return professionalTransparentCleanup(next, {
    sourceImageData: baseImageData,
    backgroundColors: pickedColors,
    aggressive: isForceRemoveEnabled()
  });
}

function extractSubjectFromSolidBackdrop(source, point) {
  if (!source || !point) return null;
  const { width, height, data } = source;
  const pixelCount = width * height;
  if (width < 8 || height < 8 || pixelCount < 64) return null;

  const alphaCutoff = 16;
  let opaquePixels = 0;
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    if (data[pixel * 4 + 3] > alphaCutoff) opaquePixels += 1;
  }
  if (opaquePixels / pixelCount < 0.72) return null;

  const clickedX = Math.max(0, Math.min(width - 1, Math.floor(point.x)));
  const clickedY = Math.max(0, Math.min(height - 1, Math.floor(point.y)));
  const clickedPixel = clickedY * width + clickedX;
  const removed = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  const colorDistanceSquared = (pixel, color) => {
    const index = pixel * 4;
    const dr = data[index] - color.r;
    const dg = data[index + 1] - color.g;
    const db = data[index + 2] - color.b;
    return dr * dr + dg * dg + db * db;
  };
  const quantizedKey = (r, g, b, step = 16) => `${Math.floor(r / step)},${Math.floor(g / step)},${Math.floor(b / step)}`;
  const backgroundColors = [];

  // Build one or more edge colour models. This handles the ordinary case where the
  // entire picture is sitting on a green, blue, white, or other flat backdrop.
  const edgeBins = new Map();
  const addEdgeSample = (x, y) => {
    const pixel = y * width + x;
    const index = pixel * 4;
    if (data[index + 3] <= alphaCutoff) return;
    const key = quantizedKey(data[index], data[index + 1], data[index + 2], 16);
    const bin = edgeBins.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    bin.count += 1;
    bin.r += data[index];
    bin.g += data[index + 1];
    bin.b += data[index + 2];
    edgeBins.set(key, bin);
  };
  const edgeStep = Math.max(1, Math.floor(Math.min(width, height) / 240));
  for (let x = 0; x < width; x += edgeStep) {
    addEdgeSample(x, 0);
    addEdgeSample(x, height - 1);
  }
  for (let y = edgeStep; y < height - edgeStep; y += edgeStep) {
    addEdgeSample(0, y);
    addEdgeSample(width - 1, y);
  }
  const edgeSampleTotal = Array.from(edgeBins.values()).reduce((sum, bin) => sum + bin.count, 0);
  const edgeModels = Array.from(edgeBins.values())
    .sort((a, b) => b.count - a.count)
    .filter((bin) => bin.count >= Math.max(2, edgeSampleTotal * 0.035))
    .slice(0, 4)
    .map((bin) => ({
      r: Math.round(bin.r / bin.count),
      g: Math.round(bin.g / bin.count),
      b: Math.round(bin.b / bin.count),
      tolerance: 30
    }));
  if (!edgeModels.length) return null;
  backgroundColors.push(...edgeModels.map(({ r, g, b }) => ({ r, g, b })));

  const matchesAnyModel = (pixel, models, extra = 0) => models.some((model) => {
    const limit = (model.tolerance || 18) + extra;
    return colorDistanceSquared(pixel, model) <= limit * limit;
  });
  let head = 0;
  let tail = 0;
  const enqueueEdge = (pixel) => {
    if (pixel < 0 || pixel >= pixelCount || removed[pixel]) return;
    const index = pixel * 4;
    if (data[index + 3] <= alphaCutoff || !matchesAnyModel(pixel, edgeModels)) return;
    removed[pixel] = 1;
    queue[tail++] = pixel;
  };
  for (let x = 0; x < width; x += 1) {
    enqueueEdge(x);
    enqueueEdge((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueueEdge(y * width);
    enqueueEdge(y * width + width - 1);
  }
  while (head < tail) {
    const pixel = queue[head++];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (x > 0) enqueueEdge(pixel - 1);
    if (x < width - 1) enqueueEdge(pixel + 1);
    if (y > 0) enqueueEdge(pixel - width);
    if (y < height - 1) enqueueEdge(pixel + width);
  }
  const edgeRemovedCount = tail;
  if (edgeRemovedCount < Math.max(16, pixelCount * 0.015)) return null;

  let panelMinX = width;
  let panelMinY = height;
  let panelMaxX = -1;
  let panelMaxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      if (removed[pixel] || data[pixel * 4 + 3] <= alphaCutoff) continue;
      panelMinX = Math.min(panelMinX, x);
      panelMinY = Math.min(panelMinY, y);
      panelMaxX = Math.max(panelMaxX, x);
      panelMaxY = Math.max(panelMaxY, y);
    }
  }
  if (panelMaxX < panelMinX || panelMaxY < panelMinY) return null;
  const panelWidth = panelMaxX - panelMinX + 1;
  const panelHeight = panelMaxY - panelMinY + 1;
  const panelArea = panelWidth * panelHeight;

  // Look for large, nearly flat panels inside the outer backdrop. Typical examples are
  // a black card behind a sprite and a coloured rectangular frame around that card.
  const innerBins = new Map();
  const histogramStep = Math.max(1, Math.floor(Math.sqrt(panelArea / 150000)));
  for (let y = panelMinY; y <= panelMaxY; y += histogramStep) {
    for (let x = panelMinX; x <= panelMaxX; x += histogramStep) {
      const pixel = y * width + x;
      const index = pixel * 4;
      if (removed[pixel] || data[index + 3] <= alphaCutoff) continue;
      const key = quantizedKey(data[index], data[index + 1], data[index + 2], 12);
      const bin = innerBins.get(key) || { count: 0, r: 0, g: 0, b: 0 };
      bin.count += 1;
      bin.r += data[index];
      bin.g += data[index + 1];
      bin.b += data[index + 2];
      innerBins.set(key, bin);
    }
  }
  const candidates = Array.from(innerBins.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 18)
    .map((bin) => ({
      r: Math.round(bin.r / bin.count),
      g: Math.round(bin.g / bin.count),
      b: Math.round(bin.b / bin.count),
      count: bin.count,
      tolerance: 15
    }));

  const seen = new Uint8Array(pixelCount);
  const componentPixels = [];
  for (const candidate of candidates) {
    seen.fill(0);
    let best = null;
    const minCandidateArea = Math.max(28, Math.round(panelArea * 0.006));
    for (let y = panelMinY; y <= panelMaxY; y += 1) {
      for (let x = panelMinX; x <= panelMaxX; x += 1) {
        const start = y * width + x;
        if (seen[start] || removed[start] || data[start * 4 + 3] <= alphaCutoff) continue;
        seen[start] = 1;
        if (colorDistanceSquared(start, candidate) > candidate.tolerance * candidate.tolerance) continue;
        head = 0;
        tail = 0;
        queue[tail++] = start;
        let area = 0;
        let minX = x;
        let minY = y;
        let maxX = x;
        let maxY = y;
        componentPixels.length = 0;
        while (head < tail) {
          const pixel = queue[head++];
          componentPixels.push(pixel);
          area += 1;
          const cx = pixel % width;
          const cy = Math.floor(pixel / width);
          minX = Math.min(minX, cx);
          minY = Math.min(minY, cy);
          maxX = Math.max(maxX, cx);
          maxY = Math.max(maxY, cy);
          const neighbors = [cx > panelMinX ? pixel - 1 : -1, cx < panelMaxX ? pixel + 1 : -1, cy > panelMinY ? pixel - width : -1, cy < panelMaxY ? pixel + width : -1];
          for (const nextPixel of neighbors) {
            if (nextPixel < 0 || seen[nextPixel] || removed[nextPixel] || data[nextPixel * 4 + 3] <= alphaCutoff) continue;
            seen[nextPixel] = 1;
            if (colorDistanceSquared(nextPixel, candidate) <= candidate.tolerance * candidate.tolerance) queue[tail++] = nextPixel;
          }
        }
        if (area < minCandidateArea) continue;
        if (!best || area > best.area) best = { area, minX, minY, maxX, maxY, pixels: componentPixels.slice() };
      }
    }
    if (!best) continue;
    if (best.pixels.includes(clickedPixel)) continue;
    const componentWidth = best.maxX - best.minX + 1;
    const componentHeight = best.maxY - best.minY + 1;
    const spanX = componentWidth / panelWidth;
    const spanY = componentHeight / panelHeight;
    const fillRatio = best.area / Math.max(1, componentWidth * componentHeight);
    const rim = Math.max(2, Math.round(Math.min(componentWidth, componentHeight) * 0.04));
    let rimPixels = 0;
    for (const pixel of best.pixels) {
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      if (x - best.minX < rim || best.maxX - x < rim || y - best.minY < rim || best.maxY - y < rim) rimPixels += 1;
    }
    const rimRatio = rimPixels / best.area;
    const broadPanel = spanX >= 0.68 && spanY >= 0.68 && best.area >= panelArea * 0.016;
    const horizontalFrame = spanX >= 0.78 && spanY >= 0.30 && rimRatio >= 0.42 && best.area >= panelArea * 0.008;
    const verticalFrame = spanY >= 0.78 && spanX >= 0.30 && rimRatio >= 0.42 && best.area >= panelArea * 0.008;
    const filledPanel = fillRatio >= 0.42 && spanX >= 0.55 && spanY >= 0.55 && best.area >= panelArea * 0.025;
    if (!(broadPanel || horizontalFrame || verticalFrame || filledPanel)) continue;
    for (const pixel of best.pixels) removed[pixel] = 1;
    backgroundColors.push({ r: candidate.r, g: candidate.g, b: candidate.b });
  }

  if (backgroundColors.length < 2) {
    // A single ordinary background is still useful, but only switch to this special path
    // when the remaining clicked subject is not basically the entire canvas.
    const remaining = opaquePixels - edgeRemovedCount;
    if (remaining > pixelCount * 0.70) return null;
  }

  // Remove antialiased residue that is still close to one of the detected flat colours.
  const cleanupModels = backgroundColors.map((color, index) => ({ ...color, tolerance: index === 0 ? 34 : 24 }));
  for (let pass = 0; pass < 2; pass += 1) {
    const snapshot = new Uint8Array(removed);
    for (let y = panelMinY; y <= panelMaxY; y += 1) {
      for (let x = panelMinX; x <= panelMaxX; x += 1) {
        const pixel = y * width + x;
        if (snapshot[pixel] || data[pixel * 4 + 3] <= alphaCutoff || !matchesAnyModel(pixel, cleanupModels, pass * 5)) continue;
        let removedNeighbors = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            if (snapshot[ny * width + nx]) removedNeighbors += 1;
          }
        }
        if (removedNeighbors >= (pass === 0 ? 3 : 5)) removed[pixel] = 1;
      }
    }
  }

  const foreground = new Uint8Array(pixelCount);
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    if (!removed[pixel] && data[pixel * 4 + 3] > alphaCutoff) foreground[pixel] = 1;
  }

  let seed = foreground[clickedPixel] ? clickedPixel : -1;
  if (seed < 0) {
    const maxRadius = Math.max(24, Math.round(Math.min(width, height) * 0.10));
    let bestDistance = Infinity;
    for (let radius = 1; radius <= maxRadius && seed < 0; radius += 1) {
      const minX = Math.max(0, clickedX - radius);
      const maxX = Math.min(width - 1, clickedX + radius);
      const minY = Math.max(0, clickedY - radius);
      const maxY = Math.min(height - 1, clickedY + radius);
      for (let x = minX; x <= maxX; x += 1) {
        for (const y of [minY, maxY]) {
          const pixel = y * width + x;
          if (!foreground[pixel]) continue;
          const distance = (x - clickedX) ** 2 + (y - clickedY) ** 2;
          if (distance < bestDistance) { bestDistance = distance; seed = pixel; }
        }
      }
      for (let y = minY + 1; y < maxY; y += 1) {
        for (const x of [minX, maxX]) {
          const pixel = y * width + x;
          if (!foreground[pixel]) continue;
          const distance = (x - clickedX) ** 2 + (y - clickedY) ** 2;
          if (distance < bestDistance) { bestDistance = distance; seed = pixel; }
        }
      }
    }
  }
  if (seed < 0) return null;

  const keep = new Uint8Array(pixelCount);
  head = 0;
  tail = 0;
  queue[tail++] = seed;
  keep[seed] = 1;
  let keptPixels = 0;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  while (head < tail) {
    const pixel = queue[head++];
    keptPixels += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const nextPixel = ny * width + nx;
        if (keep[nextPixel] || !foreground[nextPixel]) continue;
        keep[nextPixel] = 1;
        queue[tail++] = nextPixel;
      }
    }
  }
  if (keptPixels < 12 || maxX < minX) return null;

  // Re-attach a one-pixel dark/light outline where it is tightly supported by the selected subject.
  const keepSnapshot = new Uint8Array(keep);
  for (let y = Math.max(0, minY - 1); y <= Math.min(height - 1, maxY + 1); y += 1) {
    for (let x = Math.max(0, minX - 1); x <= Math.min(width - 1, maxX + 1); x += 1) {
      const pixel = y * width + x;
      if (keepSnapshot[pixel] || !removed[pixel] || data[pixel * 4 + 3] <= alphaCutoff) continue;
      if (matchesAnyModel(pixel, edgeModels, 8)) continue;
      let support = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (keepSnapshot[ny * width + nx]) support += 1;
        }
      }
      if (support >= 3) {
        keep[pixel] = 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        keptPixels += 1;
      }
    }
  }

  const itemData = new ImageData(maxX - minX + 1, maxY - minY + 1);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const pixel = y * width + x;
      if (!keep[pixel]) continue;
      const sourceIndex = pixel * 4;
      const targetIndex = ((y - minY) * itemData.width + (x - minX)) * 4;
      itemData.data[targetIndex] = data[sourceIndex];
      itemData.data[targetIndex + 1] = data[sourceIndex + 1];
      itemData.data[targetIndex + 2] = data[sourceIndex + 2];
      itemData.data[targetIndex + 3] = data[sourceIndex + 3];
    }
  }
  return { imageData: itemData, keep, minX, minY, maxX, maxY, keptPixels, backgroundColors };
}


async function extractConnectedSubject(point) {
  const session = ensureToolSession("extract");
  if (!session) return;
  const source = session.workingBase;
  const { width, height, data } = source;
  const px = Math.max(0, Math.min(width - 1, Math.floor(point.x)));
  const py = Math.max(0, Math.min(height - 1, Math.floor(point.y)));
  const startPixel = py * width + px;
  const startIndex = startPixel * 4;
  const alphaCutoff = 16;
  if (data[startIndex + 3] <= alphaCutoff) {
    setStatus("这里已是透明区域，请点击尚未提取的主体内部。");
    return;
  }
  session.busy = true;
  extractModeBtn?.classList.add("extracting");
  stage.classList.add("tool-session-busy");
  updateToolSessionUi();
  setStatus("正在识别并剥离主体…");
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (toolSession !== session) {
    extractModeBtn?.classList.remove("extracting");
    stage.classList.remove("tool-session-busy");
    return;
  }

  const solidBackdropResult = extractSubjectFromSolidBackdrop(source, point);
  if (solidBackdropResult) {
    const { imageData: solidItemData, keep: solidKeep, minX: solidMinX, minY: solidMinY } = solidBackdropResult;
    for (let pixel = 0; pixel < solidKeep.length; pixel += 1) {
      if (solidKeep[pixel]) session.workingBase.data[pixel * 4 + 3] = 0;
    }
    session.busy = false;
    extractModeBtn?.classList.remove("extracting");
    stage.classList.remove("tool-session-busy");
    const solidItem = {
      id: `tool-item-${session.id}-${session.items.length + 1}`,
      kind: "extract",
      imageData: solidItemData,
      x: solidMinX,
      y: solidMinY,
      sourceX: solidMinX,
      sourceY: solidMinY
    };
    session.items.push(solidItem);
    session.activeItemId = solidItem.id;
    renderToolSessionPreview();
    updateSelectionCanvas();
    updateToolSessionUi();
    setButtons();
    setStatus(`已识别纯色外背景与内层色块，并生成第 ${session.items.length} 个主体浮动图层。可继续拖动、提取或点击“完成”。`);
    return;
  }

  const visited = new Uint8Array(width * height);
  const keep = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  queue[tail++] = startPixel;
  visited[startPixel] = 1;
  keep[startPixel] = 1;
  let keptPixels = 0;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  while (head < tail) {
    const pixel = queue[head++];
    keptPixels += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    const neighbors = [x > 0 ? pixel - 1 : -1, x < width - 1 ? pixel + 1 : -1, y > 0 ? pixel - width : -1, y < height - 1 ? pixel + width : -1];
    for (const nextPixel of neighbors) {
      if (nextPixel < 0 || visited[nextPixel]) continue;
      visited[nextPixel] = 1;
      if (data[nextPixel * 4 + 3] > alphaCutoff) {
        keep[nextPixel] = 1;
        queue[tail++] = nextPixel;
      }
    }
  }

  session.busy = false;
  extractModeBtn?.classList.remove("extracting");
  stage.classList.remove("tool-session-busy");
  updateToolSessionUi();
  if (keptPixels < 12 || maxX < minX) {
    setStatus("选中的主体区域太小，请点击主体更靠内的位置。");
    return;
  }
  const itemData = new ImageData(maxX - minX + 1, maxY - minY + 1);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const pixel = y * width + x;
      if (!keep[pixel]) continue;
      const si = pixel * 4;
      const ti = ((y - minY) * itemData.width + (x - minX)) * 4;
      itemData.data[ti] = data[si];
      itemData.data[ti + 1] = data[si + 1];
      itemData.data[ti + 2] = data[si + 2];
      itemData.data[ti + 3] = data[si + 3];
      session.workingBase.data[si + 3] = 0;
    }
  }
  const item = { id: `tool-item-${session.id}-${session.items.length + 1}`, kind: "extract", imageData: itemData, x: minX, y: minY, sourceX: minX, sourceY: minY };
  session.items.push(item);
  session.activeItemId = item.id;
  renderToolSessionPreview();
  updateSelectionCanvas();
  updateToolSessionUi();
  setButtons();
  setStatus(`已生成第 ${session.items.length} 个主体浮动图层。可越过原图边界拖动，继续提取或点击“完成”。`);
}


function rotateImageData(imageData, direction) {
  const next = new ImageData(imageData.height, imageData.width);
  const source = imageData.data;
  const target = next.data;
  for (let y = 0; y < imageData.height; y += 1) {
    for (let x = 0; x < imageData.width; x += 1) {
      const sourceIndex = (y * imageData.width + x) * 4;
      const tx = direction === "right" ? imageData.height - 1 - y : y;
      const ty = direction === "right" ? x : imageData.width - 1 - x;
      const targetIndex = (ty * next.width + tx) * 4;
      target[targetIndex] = source[sourceIndex];
      target[targetIndex + 1] = source[sourceIndex + 1];
      target[targetIndex + 2] = source[sourceIndex + 2];
      target[targetIndex + 3] = source[sourceIndex + 3];
    }
  }
  return next;
}

function flipImageData(imageData, axis) {
  const next = new ImageData(imageData.width, imageData.height);
  const source = imageData.data;
  const target = next.data;
  for (let y = 0; y < imageData.height; y += 1) {
    for (let x = 0; x < imageData.width; x += 1) {
      const sourceIndex = (y * imageData.width + x) * 4;
      const tx = axis === "horizontal" ? imageData.width - 1 - x : x;
      const ty = axis === "vertical" ? imageData.height - 1 - y : y;
      const targetIndex = (ty * imageData.width + tx) * 4;
      target[targetIndex] = source[sourceIndex];
      target[targetIndex + 1] = source[sourceIndex + 1];
      target[targetIndex + 2] = source[sourceIndex + 2];
      target[targetIndex + 3] = source[sourceIndex + 3];
    }
  }
  return next;
}

function clampIconDimension(value, fallback = 64) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(8, Math.min(512, Math.round(number)));
}

function currentIconifySize() {
  const preset = iconifySizePreset?.value || "64";
  const keepPadding = iconifyKeepPadding?.checked !== false;
  if (preset === "custom") {
    return {
      width: clampIconDimension(iconifyWidth?.value, 64),
      height: clampIconDimension(iconifyHeight?.value, 64),
      keepPadding
    };
  }
  const size = clampIconDimension(preset, 64);
  return { width: size, height: size, keepPadding };
}

function updateIconifySizeControls() {
  if (!iconifySizePreset || !iconifyCustomSize) return;
  iconifyCustomSize.classList.toggle("active", iconifySizePreset.value === "custom");
}

function subjectAlphaBounds(imageData, alphaLimit = 16) {
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] <= alphaLimit) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) {
    return { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1, width, height };
  }
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}

function croppedImageData(imageData, bounds, padding = 0) {
  const x = Math.max(0, bounds.minX - padding);
  const y = Math.max(0, bounds.minY - padding);
  const maxX = Math.min(imageData.width - 1, bounds.maxX + padding);
  const maxY = Math.min(imageData.height - 1, bounds.maxY + padding);
  const width = Math.max(1, maxX - x + 1);
  const height = Math.max(1, maxY - y + 1);
  const work = document.createElement("canvas");
  work.width = imageData.width;
  work.height = imageData.height;
  const workCtx = work.getContext("2d");
  workCtx.putImageData(imageData, 0, 0);
  return workCtx.getImageData(x, y, width, height);
}







function iconifyImageData(imageData, options = {}) {
  const targetWidth = clampIconDimension(options.width, 64);
  const targetHeight = clampIconDimension(options.height, 64);
  const keepPadding = options.keepPadding !== false;

  // 图标化与“主体比例像素化”共用同一套轮廓、内部色块、调色板和细节保护逻辑。
  // 图标面板只负责提供目标尺寸与是否额外留透明边，避免两套缩放算法产生不同结果。
  return contourPixelizeImageData(imageData, {
    ...contourPixelDefaults,
    width: targetWidth,
    height: targetHeight,
    paletteSize: 32,
    paddingPercent: keepPadding ? contourPixelDefaults.paddingPercent : 0,
    splitSubjects: false
  });
}








function processingSourceLabel(source = processingSource) {
  return source === "result" ? "处理结果库" : source === "sequence" ? "当前序列帧" : "原始图片库";
}

function setProcessingSource(source, options = {}) {
  if (!["original", "result", "sequence"].includes(source)) return;
  if (outlinePreviewActive && source !== processingSource) {
    clearOutlinePreviewState({ restore: true });
  }
  processingSource = source;
  markActiveLibrary(source, {
    scroll: options.scrollLibrary !== false,
    exclusive: options.focusLibrary === true
  });
  processingSourceButtons.forEach((button) => {
    const active = button.dataset.processingSource === source;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (options.announce !== false) {
    setStatus(`当前处理对象：${processingSourceLabel(source)}。`);
  }
  setButtons();
}

function sourceRecordsForProcessing() {
  if (processingSource === "original") {
    const selected = images.filter((item) => item.selected);
    const targets = selected.length > 0 ? selected : (activeIndex >= 0 && images[activeIndex] ? [images[activeIndex]] : []);
    return targets.map((item) => ({
      kind: "original",
      target: item,
      name: item.name || "原始图片",
      imageData: item.originalImageData,
      pixelatedPreview: Boolean(item.pixelatedPreview),
      fullResolutionSource: item.fullResolutionSource || null,
      fullResolutionPipeline: cloneFullResolutionPipeline(item.fullResolutionPipeline)
    }));
  }
  if (processingSource === "result") {
    const selected = assetLibrary.filter((asset) => asset.selected);
    const targets = selected.length > 0 ? selected : (activeLibraryTarget ? [activeLibraryTarget] : []);
    return targets.map((asset) => ({
      kind: "result",
      target: asset,
      name: asset.name || "处理结果",
      imageData: asset.imageData,
      pixelatedPreview: Boolean(asset.pixelatedPreview),
      fullResolutionSource: asset.fullResolutionSource || null,
      fullResolutionPipeline: cloneFullResolutionPipeline(asset.fullResolutionPipeline)
    }));
  }
  return [];
}

function operationNameSuffix(kind) {
  const names = {
    rotate: "旋转", flip: "镜像", smoothEdges: "去锯齿", shadow: "阴影",
    outline: "描边", iconify: "图标化", contourPixelize: "像素化", trimTransparent: "去透明边",
    cleanPseudoAlpha: "透明净化", fillInternalPixels: "透明修复", crop: "裁剪", cutout: "抠图",
    erase: "擦除", deleteBlock: "删除选区", dualAlpha: "双背景重建", extractSubject: "主体提取", extractSelection: "圈选提取"
  };
  return names[kind] || "处理结果";
}

function uniqueProcessedName(sourceName, operation) {
  const base = String(sourceName || "图片").replace(/\.(png|jpe?g|webp|gif|bmp)$/i, "");
  const suffix = operationNameSuffix(operation);
  const prefix = `${base}-${suffix}`;
  let name = prefix;
  let number = 2;
  const used = new Set(assetLibrary.map((asset) => asset.name));
  while (used.has(name)) name = `${prefix}-${number++}`;
  return name;
}

function addProcessedAsset(imageData, sourceName, operation, options = {}) {
  if (!imageData) return null;
  const storedImageData = options.takeOwnership ? imageData : cloneImageData(imageData);
  const asset = {
    id: `asset-${++assetCounter}`,
    name: options.name || uniqueProcessedName(sourceName, operation),
    imageData: storedImageData,
    previewImageData: options.previewImageData ? cloneImageData(options.previewImageData) : null,
    thumbnail: options.deferThumbnail ? transparentThumbnail : makeThumbnail(imageData),
    selected: Boolean(options.selected),
    pixelatedPreview: Boolean(options.pixelatedPreview),
    sourceKind: options.sourceKind || processingSource,
    sourceName: sourceName || "图片",
    sequencePlacement: cloneSequencePlacement(options.sequencePlacement),
    fullResolutionSource: options.fullResolutionSource || null,
    fullResolutionPipeline: cloneFullResolutionPipeline(options.fullResolutionPipeline),
    recognizing: false,
    autoNameFromText: false,
    removeRecognizedText: false
  };
  assetLibrary.push(asset);
  if (options.deferThumbnail) scheduleAssetThumbnail(asset);
  return asset;
}

function prepareAssetTextRecognition(asset) {
  if (!asset) return false;
  asset.autoNameFromText = Boolean(autoNameAssets?.checked);
  asset.removeRecognizedText = Boolean(removeRecognizedText?.checked);
  asset.recognizing = asset.autoNameFromText || asset.removeRecognizedText;
  return asset.recognizing;
}

function queueAssetTextRecognition(asset) {
  if (!prepareAssetTextRecognition(asset)) return false;
  recognizeAssetName(asset);
  return true;
}

function queueAssetsTextRecognition(assets) {
  const targets = (assets || []).filter(Boolean);
  let queued = 0;
  targets.forEach((asset) => {
    if (queueAssetTextRecognition(asset)) queued += 1;
  });
  if (queued > 0) renderAssetList(true);
  return queued;
}

function activateProcessedAsset(asset, options = {}) {
  if (toolSession && toolSession.sourceTarget !== asset) cancelToolSession({ silent: true });
  if (!asset) return;
  setProcessingSource("result", { announce: false });
  openWorkspaceTab("asset", asset);
  renderAssetList(options.scrollToLatest !== false);
  renderWorkspaceTabs();
  setButtons();
}

function createResultsFromRecords(records, transform, operation, message, options = {}) {
  if (!records.length) return [];
  pushHistory();
  const created = [];
  records.forEach((record, index) => {
    const next = transform(cloneImageData(record.imageData), record, index);
    if (!next) return;
    const recipeValue = typeof options.fullResolutionValue === "function"
      ? options.fullResolutionValue(record, index)
      : options.fullResolutionValue;
    created.push(addProcessedAsset(next, record.name, operation, {
      sourceKind: record.kind,
      pixelatedPreview: Boolean(options.pixelatedPreview || record.pixelatedPreview),
      ...derivedFullResolutionOptions(record, operation, recipeValue)
    }));
  });
  const valid = created.filter(Boolean);
  if (valid.length > 0) activateProcessedAsset(valid[valid.length - 1]);
  cropSelection = null;
  hideCropBox();
  clearLassoSelection();
  renderImageList();
  renderAssetList(true);
  setButtons();
  if (message) setStatus(`${message}${valid.length > 1 ? `，共生成 ${valid.length} 个处理结果。` : "。"}`);
  return valid;
}

function currentSourceRecord() {
  return sourceRecordsForProcessing()[0] || null;
}

function imageDataToPreviewUrl(imageData) {
  const preview = document.createElement("canvas");
  preview.width = imageData.width;
  preview.height = imageData.height;
  preview.getContext("2d").putImageData(imageData, 0, 0);
  return preview.toDataURL("image/png");
}

function openImagePreview(name, imageData) {
  if (!imagePreviewModal || !imagePreviewImg || !imageData) return;
  imagePreviewTitle.textContent = name || "图片预览";
  imagePreviewImg.src = imageDataToPreviewUrl(imageData);
  imagePreviewModal.hidden = false;
}

function closeImagePreview() {
  if (!imagePreviewModal) return;
  imagePreviewModal.hidden = true;
  imagePreviewImg.removeAttribute("src");
}

function selectedOrActiveOriginals() {
  const selected = images.filter((item) => item.selected);
  return selected.length ? selected : (activeIndex >= 0 && images[activeIndex] ? [images[activeIndex]] : []);
}

function selectedOrActiveAssets() {
  const selected = assetLibrary.filter((asset) => asset.selected);
  return selected.length ? selected : (activeLibraryTarget ? [activeLibraryTarget] : []);
}

function targetItems() {
  return sourceRecordsForProcessing().map((record) => ({
    __sourceRecord: record,
    name: record.name,
    originalImageData: cloneImageData(record.imageData),
    currentImageData: cloneImageData(record.imageData),
    liveBaseImageData: null,
    pickedColors: [],
    history: [],
    selected: false,
    pixelatedPreview: Boolean(record.pixelatedPreview)
  }));
}

function transformItems(transform, message) {
  const targets = targetItems();
  if (targets.length === 0) return;
  pushHistory();
  const created = [];
  targets.forEach((item) => {
    transform(item);
    const output = item.currentImageData || item.originalImageData;
    if (!output) return;
    const fullResolution = derivedFullResolutionOptions(
      item.__sourceRecord,
      transform.kind,
      transform.value
    );
    created.push(addProcessedAsset(output, item.__sourceRecord.name, transform.kind, {
      sourceKind: item.__sourceRecord.kind,
      pixelatedPreview: Boolean(item.pixelatedPreview || transform.kind === "iconify" || transform.kind === "contourPixelize"),
      ...fullResolution
    }));
  });
  const valid = created.filter(Boolean);
  if (valid.length > 0) activateProcessedAsset(valid[valid.length - 1]);
  cropSelection = null;
  hideCropBox();
  clearLassoSelection();
  renderImageList();
  renderAssetList(true);
  setButtons();
  setStatus(`${message}${valid.length > 1 ? `，共生成 ${valid.length} 个处理结果。` : "。"}`);
}

function transformImageData(imageData, kind, value) {
  if (kind === "rotate") return rotateImageData(imageData, value);
  if (kind === "flip") return flipImageData(imageData, value);
  if (kind === "smoothEdges") return smoothEdgeImageData(imageData, value || {});
  if (kind === "shadow") return addGroundShadowImageData(imageData);
  if (kind === "outline") return addOutlineImageData(imageData, value);
  if (kind === "iconify") return iconifyImageData(imageData, value);
  if (kind === "contourPixelize") return contourPixelizeImageData(imageData, value);
  if (kind === "trimTransparent") return removeTransparentEdgeBlocks(imageData);
  if (kind === "cleanPseudoAlpha") return cleanPseudoTransparentImageData(imageData);
  if (kind === "fillInternalPixels") return fillInternalTransparentPixels(cloneImageData(imageData));
  return imageData;
}

function shadowSubjectBounds(imageData, alphaLimit = 16) {
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha <= alphaLimit) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) return null;
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}

function defaultGroundShadowOptions(imageData) {
  const bounds = shadowSubjectBounds(imageData, 24);
  if (!bounds) return null;
  return {
    centerX: bounds.minX + bounds.width / 2,
    centerY: Math.min(imageData.height - 1, bounds.maxY + Math.max(2, bounds.height * 0.035)),
    strength: Number(shadowStrength?.value || 34),
    size: Number(shadowSize?.value || 100)
  };
}

function addGroundShadowImageData(imageData, options = {}) {
  const bounds = shadowSubjectBounds(imageData, 24);
  if (!bounds) return cloneImageData(imageData);
  const defaults = defaultGroundShadowOptions(imageData);
  const sizeScale = Math.max(0.2, Math.min(2, Number(options.size ?? defaults.size) / 100));
  const strengthScale = Math.max(0, Math.min(1, Number(options.strength ?? defaults.strength) / 100));
  const centerX = Number.isFinite(options.centerX) ? options.centerX : defaults.centerX;
  const centerY = Number.isFinite(options.centerY) ? options.centerY : defaults.centerY;
  const radiusX = Math.max(4, bounds.width * 0.34 * sizeScale);
  const radiusY = Math.max(2, bounds.height * 0.045 * Math.sqrt(sizeScale));
  const work = document.createElement("canvas");
  work.width = imageData.width;
  work.height = imageData.height;
  const workCtx = work.getContext("2d", { willReadFrequently: true });
  const gradient = workCtx.createRadialGradient(0, 0, 0, 0, 0, 1);
  gradient.addColorStop(0, `rgba(0, 0, 0, ${Math.min(0.72, strengthScale)})`);
  gradient.addColorStop(0.55, `rgba(0, 0, 0, ${Math.min(0.38, strengthScale * 0.5)})`);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  workCtx.save();
  workCtx.translate(centerX, centerY);
  workCtx.scale(radiusX, radiusY);
  workCtx.fillStyle = gradient;
  workCtx.beginPath();
  workCtx.arc(0, 0, 1, 0, Math.PI * 2);
  workCtx.fill();
  workCtx.restore();
  const subject = document.createElement("canvas");
  subject.width = imageData.width;
  subject.height = imageData.height;
  subject.getContext("2d").putImageData(imageData, 0, 0);
  workCtx.drawImage(subject, 0, 0);
  return workCtx.getImageData(0, 0, imageData.width, imageData.height);
}

function parseHexColor(hex) {
  const normalized = String(hex || "#ffffff").trim();
  const match = /^#?([0-9a-f]{6})$/i.exec(normalized);
  const value = match ? match[1] : "ffffff";
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function hasTransparentPixels(imageData) {
  if (!imageData) return false;
  const cached = outlineTransparencyCache.get(imageData);
  if (cached !== undefined) return cached;
  const data = imageData.data;
  let transparent = false;
  for (let index = 3; index < data.length; index += 4) {
    if (data[index] <= 16) {
      transparent = true;
      break;
    }
  }
  outlineTransparencyCache.set(imageData, transparent);
  return transparent;
}

function addOutlineImageData(imageData, options = {}) {
  if (!hasTransparentPixels(imageData)) return cloneImageData(imageData);
  const radius = Math.max(1, Math.min(32, Math.round(Number(options.size) || 4)));
  const color = parseHexColor(options.color || "#ffffff");
  const sourceWidth = imageData.width;
  const sourceHeight = imageData.height;
  const outputWidth = sourceWidth + radius * 2;
  const outputHeight = sourceHeight + radius * 2;
  const total = outputWidth * outputHeight;
  const output = new ImageData(outputWidth, outputHeight);
  const source = imageData.data;
  const target = output.data;
  const distance = new Uint16Array(total);
  distance.fill(65535);

  for (let y = 0; y < sourceHeight; y += 1) {
    for (let x = 0; x < sourceWidth; x += 1) {
      const sourceIndex = (y * sourceWidth + x) * 4;
      if (source[sourceIndex + 3] > 8) distance[(y + radius) * outputWidth + x + radius] = 0;
    }
  }

  // Two-pass chamfer distance transform. Unlike the old radius-kernel loop, this is
  // linear in the image size, so dragging outline parameters remains responsive.
  for (let y = 0; y < outputHeight; y += 1) {
    for (let x = 0; x < outputWidth; x += 1) {
      const p = y * outputWidth + x;
      let value = distance[p];
      if (x > 0) value = Math.min(value, distance[p - 1] + 3);
      if (y > 0) value = Math.min(value, distance[p - outputWidth] + 3);
      if (x > 0 && y > 0) value = Math.min(value, distance[p - outputWidth - 1] + 4);
      if (x < outputWidth - 1 && y > 0) value = Math.min(value, distance[p - outputWidth + 1] + 4);
      distance[p] = value;
    }
  }
  for (let y = outputHeight - 1; y >= 0; y -= 1) {
    for (let x = outputWidth - 1; x >= 0; x -= 1) {
      const p = y * outputWidth + x;
      let value = distance[p];
      if (x < outputWidth - 1) value = Math.min(value, distance[p + 1] + 3);
      if (y < outputHeight - 1) value = Math.min(value, distance[p + outputWidth] + 3);
      if (x < outputWidth - 1 && y < outputHeight - 1) value = Math.min(value, distance[p + outputWidth + 1] + 4);
      if (x > 0 && y < outputHeight - 1) value = Math.min(value, distance[p + outputWidth - 1] + 4);
      distance[p] = value;
    }
  }

  const limit = radius * 3;
  for (let p = 0; p < total; p += 1) {
    const value = distance[p];
    if (value === 0 || value > limit + 3) continue;
    const edgeAlpha = value <= limit ? 255 : Math.round(255 * (limit + 3 - value) / 3);
    const index = p * 4;
    target[index] = color.r;
    target[index + 1] = color.g;
    target[index + 2] = color.b;
    target[index + 3] = edgeAlpha;
  }

  for (let y = 0; y < sourceHeight; y += 1) {
    for (let x = 0; x < sourceWidth; x += 1) {
      const sourceIndex = (y * sourceWidth + x) * 4;
      const targetIndex = ((y + radius) * outputWidth + x + radius) * 4;
      const alpha = source[sourceIndex + 3] / 255;
      if (alpha <= 0) continue;
      const inverse = 1 - alpha;
      target[targetIndex] = Math.round(source[sourceIndex] * alpha + target[targetIndex] * inverse);
      target[targetIndex + 1] = Math.round(source[sourceIndex + 1] * alpha + target[targetIndex + 1] * inverse);
      target[targetIndex + 2] = Math.round(source[sourceIndex + 2] * alpha + target[targetIndex + 2] * inverse);
      target[targetIndex + 3] = Math.round(source[sourceIndex + 3] + target[targetIndex + 3] * inverse);
    }
  }
  return output;
}

function isLikelyPixelArtImageData(imageData, explicitHint = false) {
  if (explicitHint) return true;
  if (!imageData || imageData.width > 512 || imageData.height > 512) return false;
  const data = imageData.data;
  const pixelCount = imageData.width * imageData.height;
  const stride = Math.max(1, Math.floor(pixelCount / 12000));
  let sampled = 0;
  let hardAlpha = 0;
  let visible = 0;
  const alphaLevels = new Set();
  for (let pixel = 0; pixel < pixelCount; pixel += stride) {
    const alpha = data[pixel * 4 + 3];
    sampled += 1;
    if (alpha > 8) visible += 1;
    if (alpha <= 8 || alpha >= 247) hardAlpha += 1;
    if (alpha > 8 && alpha < 247 && alphaLevels.size < 32) alphaLevels.add(Math.round(alpha / 8));
  }
  if (visible === 0 || sampled === 0) return false;
  return hardAlpha / sampled >= 0.9 && alphaLevels.size <= 10;
}

function pixelEdgeNeighborStats(mask, width, height, x, y) {
  let orthogonal = 0;
  let diagonal = 0;
  const positions = [];
  for (let oy = -1; oy <= 1; oy += 1) {
    for (let ox = -1; ox <= 1; ox += 1) {
      if (ox === 0 && oy === 0) continue;
      const nx = x + ox;
      const ny = y + oy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (!mask[ny * width + nx]) continue;
      positions.push({ ox, oy });
      if (ox === 0 || oy === 0) orthogonal += 1;
      else diagonal += 1;
    }
  }
  return { orthogonal, diagonal, total: orthogonal + diagonal, positions };
}

function neighboringPixelColor(data, mask, width, height, x, y, minNeighbors = 1) {
  const colors = [];
  for (let radius = 1; radius <= 2; radius += 1) {
    for (let oy = -radius; oy <= radius; oy += 1) {
      for (let ox = -radius; ox <= radius; ox += 1) {
        if (ox === 0 && oy === 0) continue;
        const nx = x + ox;
        const ny = y + oy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const pixel = ny * width + nx;
        if (!mask[pixel]) continue;
        const index = pixel * 4;
        colors.push([data[index], data[index + 1], data[index + 2]]);
      }
    }
    if (colors.length >= minNeighbors) break;
  }
  if (!colors.length) return null;
  const median = (channel) => {
    const values = colors.map((color) => color[channel]).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };
  return { r: median(0), g: median(1), b: median(2) };
}

function cleanPixelArtEdgeImageData(imageData) {
  const { width, height } = imageData;
  const source = new Uint8ClampedArray(imageData.data);
  const result = new ImageData(new Uint8ClampedArray(source), width, height);
  const next = result.data;
  const pixelCount = width * height;
  let mask = new Uint8Array(pixelCount);

  // First remove the semi-transparent fringe produced by resampling and cutout masks.
  // Pixel art should have deliberate hard pixels, not a fog of low-alpha crumbs.
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const index = pixel * 4;
    const alpha = source[index + 3];
    if (alpha < 48) {
      next[index + 3] = 0;
      continue;
    }
    if (alpha >= 176) {
      next[index + 3] = 255;
      mask[pixel] = 1;
      continue;
    }
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    let strongNeighbors = 0;
    let visibleNeighbors = 0;
    for (let oy = -1; oy <= 1; oy += 1) {
      for (let ox = -1; ox <= 1; ox += 1) {
        if (ox === 0 && oy === 0) continue;
        const nx = x + ox;
        const ny = y + oy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const neighborAlpha = source[(ny * width + nx) * 4 + 3];
        if (neighborAlpha >= 176) strongNeighbors += 1;
        if (neighborAlpha >= 48) visibleNeighbors += 1;
      }
    }
    if (alpha >= 128 && (strongNeighbors >= 3 || visibleNeighbors >= 5)) {
      next[index + 3] = 255;
      mask[pixel] = 1;
    } else {
      next[index + 3] = 0;
    }
  }

  // Two conservative contour-cleanup passes. Only unsupported crumbs, diagonal dust
  // and weak tips are removed; one-pixel-wide handles and weapon blades remain intact.
  for (let pass = 0; pass < 2; pass += 1) {
    const updatedMask = new Uint8Array(mask);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const pixel = y * width + x;
        const index = pixel * 4;
        const stats = pixelEdgeNeighborStats(mask, width, height, x, y);
        if (mask[pixel]) {
          const sourceAlpha = source[index + 3];
          const neighborColor = neighboringPixelColor(next, mask, width, height, x, y, 1);
          const colorDistance = neighborColor
            ? Math.abs(next[index] - neighborColor.r) + Math.abs(next[index + 1] - neighborColor.g) + Math.abs(next[index + 2] - neighborColor.b)
            : 0;
          let structuralSpur = false;
          if (stats.total === 1 && stats.positions.length === 1) {
            const support = stats.positions[0];
            const supportStats = pixelEdgeNeighborStats(mask, width, height, x + support.ox, y + support.oy);
            // A lone pixel attached to a broad solid region is a burr; a lone pixel at
            // the end of a thin handle or blade is intentional and must survive.
            structuralSpur = Math.max(0, supportStats.total - 1) >= 4;
          } else if (stats.orthogonal === 1 && stats.diagonal === 2) {
            const support = stats.positions.find((position) => position.ox === 0 || position.oy === 0);
            if (support) {
              const supportStats = pixelEdgeNeighborStats(mask, width, height, x + support.ox, y + support.oy);
              // A one-pixel extrusion from an otherwise broad flat edge is the most
              // common opaque burr left by pixelization.
              structuralSpur = Math.max(0, supportStats.total - 1) >= 5;
            }
          }
          const isolatedDust = stats.total === 0 && sourceAlpha < 245;
          const diagonalDust = stats.orthogonal === 0 && stats.diagonal <= 1
            && (sourceAlpha < 245 || colorDistance > 105);
          const weakTip = stats.total <= 1 && (sourceAlpha < 245 || colorDistance > 105);
          if (isolatedDust || diagonalDust || weakTip || structuralSpur) updatedMask[pixel] = 0;
        } else {
          // Close only obvious single-pixel pinholes and deep one-pixel notches.
          if (stats.orthogonal >= 3 || stats.total >= 7) updatedMask[pixel] = 1;
        }
      }
    }
    mask = updatedMask;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const index = pixel * 4;
      if (!mask[pixel]) {
        next[index + 3] = 0;
        continue;
      }
      next[index + 3] = 255;
      const stats = pixelEdgeNeighborStats(mask, width, height, x, y);
      if (stats.total >= 8) continue;
      const color = neighboringPixelColor(next, mask, width, height, x, y, 3);
      if (!color) continue;
      const distance = Math.abs(next[index] - color.r) + Math.abs(next[index + 1] - color.g) + Math.abs(next[index + 2] - color.b);
      // Replace obvious matte-colored outliers instead of blurring every edge pixel.
      if (source[index + 3] < 245 || distance > 150) {
        next[index] = color.r;
        next[index + 1] = color.g;
        next[index + 2] = color.b;
      }
    }
  }

  bleedOpaqueColorsIntoTransparentPixels(result);
  return result;
}

function smoothEdgeImageData(imageData, options = {}) {
  const pixelArt = isLikelyPixelArtImageData(imageData, options.pixelArt === true);
  if (pixelArt) return cleanPixelArtEdgeImageData(imageData);

  const { width, height, data } = imageData;
  const result = new ImageData(new Uint8ClampedArray(data), width, height);
  const source = data;
  const next = result.data;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const alpha = source[i + 3];
      if (alpha === 0) continue;

      let transparentNeighbors = 0;
      let solidNeighbors = 0;
      let alphaSum = alpha;
      let alphaCount = 1;
      let r = 0;
      let g = 0;
      let b = 0;
      let colorWeight = 0;
      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          if (ox === 0 && oy === 0) continue;
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            transparentNeighbors += 1;
            continue;
          }
          const ni = (ny * width + nx) * 4;
          const neighborAlpha = source[ni + 3];
          if (neighborAlpha < 32) transparentNeighbors += 1;
          if (neighborAlpha > 190) {
            solidNeighbors += 1;
            r += source[ni] * neighborAlpha;
            g += source[ni + 1] * neighborAlpha;
            b += source[ni + 2] * neighborAlpha;
            colorWeight += neighborAlpha;
          }
          alphaSum += neighborAlpha;
          alphaCount += 1;
        }
      }

      if (alpha < 24 || (alpha < 104 && solidNeighbors <= 1)) {
        next[i + 3] = 0;
        continue;
      }

      if (alpha >= 245 && transparentNeighbors === 0) continue;

      const smoothedAlpha = Math.round((alphaSum / alphaCount) * 0.58 + alpha * 0.42);
      const nextAlpha = Math.max(0, Math.min(alpha, smoothedAlpha));
      next[i + 3] = nextAlpha < 12 ? 0 : nextAlpha;

      if (colorWeight > 0) {
        const blend = alpha < 210 ? 0.62 : 0.30;
        next[i] = Math.round(source[i] * (1 - blend) + (r / colorWeight) * blend);
        next[i + 1] = Math.round(source[i + 1] * (1 - blend) + (g / colorWeight) * blend);
        next[i + 2] = Math.round(source[i + 2] * (1 - blend) + (b / colorWeight) * blend);
      }
    }
  }

  stripEdgeMattePollution(result, { aggressive: true });
  bleedOpaqueColorsIntoTransparentPixels(result);
  return result;
}

function targetFrames() {
  if (processingSource !== "sequence") return [];
  const selected = orderedSelectedFrames(sequenceFrames);
  if (selected.length > 0) return selected;
  const frame = activeFrameIndex >= 0 ? sequenceFrames[activeFrameIndex] : null;
  return frame ? [frame] : [];
}

function refreshFrameEditPreview(targets, message) {
  targets.forEach((frame) => { frame.thumbnail = makeThumbnail(frame.imageData); });
  if (playbackTimer) {
    if (playbackIndex >= sequenceFrames.length) playbackIndex = 0;
    previewPlaybackFrame(playbackIndex);
  } else if (activeFrameIndex >= 0 && sequenceFrames[activeFrameIndex]) {
    currentImageData = cloneImageData(sequenceFrames[activeFrameIndex].imageData);
    originalImageData = cloneImageData(sequenceFrames[activeFrameIndex].imageData);
    renderPreviewImageData(sequenceFrames[activeFrameIndex].imageData);
  }
  cropSelection = null;
  hideCropBox();
  clearLassoSelection();
  renderFrameList();
  renderWorkspaceTabs();
  setButtons();
  setStatus(`${message}${targets.length > 1 ? `，共 ${targets.length} 帧。` : "。"}`);
}

function transformFrames(kind, value, message) {
  const targets = targetFrames();
  if (targets.length === 0) return false;
  pushHistory();
  targets.forEach((frame) => {
    frame.imageData = transformImageData(frame.imageData, kind, value);
    if (!appendFullResolutionRecipe(frame, kind, value) && !fullResolutionRecipeKinds.has(kind)) {
      invalidateFullResolutionSource(frame);
    }
    if (kind === "iconify" || kind === "contourPixelize") frame.pixelatedPreview = true;
  });
  refreshFrameEditPreview(targets, message);
  if (kind === "iconify") fitSmallIconPreview();
  return true;
}

function rotateItems(direction) {
  if (transformFrames("rotate", direction, direction === "right" ? "已将序列帧向右旋转 90 度" : "已将序列帧向左旋转 90 度")) {
    return;
  }
  const transform = (item) => {
    item.originalImageData = rotateImageData(item.originalImageData, direction);
    item.currentImageData = rotateImageData(item.currentImageData, direction);
  };
  transform.kind = "rotate";
  transform.value = direction;
  transformItems(transform, direction === "right" ? "已向右旋转 90 度" : "已向左旋转 90 度");
}

function flipItems(axis) {
  if (transformFrames("flip", axis, axis === "horizontal" ? "已水平镜像序列帧" : "已垂直镜像序列帧")) {
    return;
  }
  const transform = (item) => {
    item.originalImageData = flipImageData(item.originalImageData, axis);
    item.currentImageData = flipImageData(item.currentImageData, axis);
  };
  transform.kind = "flip";
  transform.value = axis;
  transformItems(transform, axis === "horizontal" ? "已水平镜像" : "已垂直镜像");
}

function trimTransparentEdges() {
  if (transformFrames("trimTransparent", null, "已去除序列帧透明边")) return;
  createResultsFromRecords(sourceRecordsForProcessing(), (imageData) => removeTransparentEdgeBlocks(imageData), "trimTransparent", "已去除透明边");
}

async function cleanPseudoTransparentBackground() {
  if (transformFrames("cleanPseudoAlpha", null, "已净化序列帧透明背景")) return;
  const records = sourceRecordsForProcessing();
  if (!records.length) return;
  cleanPseudoAlphaBtn.disabled = true;
  try {
    createResultsFromRecords(records, (imageData) => cleanPseudoTransparentImageData(imageData), "cleanPseudoAlpha", "已净化透明背景");
    await yieldToBrowser(0);
  } finally {
    setButtons();
  }
}

function fillInternalTransparentPixelHoles() {
  if (transformFrames("fillInternalPixels", null, "已补齐序列帧内部透明像素")) return;
  createResultsFromRecords(sourceRecordsForProcessing(), (imageData) => fillInternalTransparentPixels(imageData), "fillInternalPixels", "已补齐内部透明像素");
}

function replaceSourceRecordImageData(record, imageData) {
  if (!record || !record.target || !imageData) return false;
  if (record.kind === "original") {
    record.target.originalImageData = cloneImageData(imageData);
    record.target.currentImageData = cloneImageData(imageData);
    record.target.liveBaseImageData = null;
    record.target.thumbnail = makeThumbnail(imageData);
    return true;
  }
  if (record.kind === "result") {
    record.target.imageData = cloneImageData(imageData);
    record.target.previewImageData = null;
    record.target.thumbnail = makeThumbnail(imageData);
    return true;
  }
  return false;
}

function refreshSourcesAfterInPlaceTransform(records, message) {
  const targets = new Set(records.map((record) => record.target));
  let refreshedCanvas = false;
  if (activeIndex >= 0 && images[activeIndex] && targets.has(images[activeIndex])) {
    const item = images[activeIndex];
    originalImageData = cloneImageData(item.originalImageData);
    currentImageData = cloneImageData(item.currentImageData || item.originalImageData);
    liveBaseImageData = null;
    pickedColors = [];
    refreshedCanvas = true;
  } else if (activeLibraryTarget && targets.has(activeLibraryTarget)) {
    originalImageData = activeLibraryTarget.imageData;
    currentImageData = activeLibraryTarget.imageData;
    liveBaseImageData = null;
    pickedColors = [];
    refreshedCanvas = true;
  }

  cropSelection = null;
  hideCropBox();
  clearLassoSelection();
  renderImageList();
  renderAssetList();
  renderWorkspaceTabs();
  renderSwatches();
  if (refreshedCanvas) {
    showResultMode();
    renderCanvas();
  }
  setButtons();
  setStatus(`${message}${records.length > 1 ? `，已直接修改 ${records.length} 张所选图片。` : "，已直接修改当前图片。"}`);
}

async function smoothEdges() {
  if (processingSource === "sequence") {
    const frames = targetFrames();
    if (!frames.length) return;
    pushHistory();
    smoothEdgesBtn.disabled = true;
    try {
      for (let index = 0; index < frames.length; index += 1) {
        setStatus(`正在清理序列帧边缘锯齿和像素毛刺 ${index + 1}/${frames.length}...`);
        frames[index].imageData = smoothEdgeImageData(frames[index].imageData, {
          pixelArt: Boolean(frames[index].pixelatedPreview)
        });
        appendFullResolutionRecipe(frames[index], "smoothEdges", {
          pixelArt: Boolean(frames[index].pixelatedPreview)
        });
        frames[index].thumbnail = makeThumbnail(frames[index].imageData);
        await yieldToBrowser(0);
      }
      refreshFrameEditPreview(frames, "已清理序列帧边缘锯齿和像素毛刺");
    } finally {
      setButtons();
    }
    return;
  }

  const records = sourceRecordsForProcessing();
  if (!records.length) return;
  pushHistory();
  smoothEdgesBtn.disabled = true;
  const modified = [];
  try {
    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      setStatus(`正在清理边缘锯齿和像素毛刺 ${index + 1}/${records.length}...`);
      const next = smoothEdgeImageData(cloneImageData(record.imageData), {
        pixelArt: Boolean(record.pixelatedPreview)
      });
      if (replaceSourceRecordImageData(record, next)) {
        appendFullResolutionRecipe(record.target, "smoothEdges", {
          pixelArt: Boolean(record.pixelatedPreview)
        });
        modified.push(record);
      }
      await yieldToBrowser(0);
    }
    if (modified.length > 0) {
      refreshSourcesAfterInPlaceTransform(modified, "已清理边缘锯齿和像素毛刺");
    }
  } catch (error) {
    console.error("Smooth edge cleanup failed", error);
    setStatus(`去锯齿处理失败：${error?.message || "未知错误"}`);
  } finally {
    setButtons();
  }
}
function currentShadowOptionsFor(imageData) {
  const defaults = defaultGroundShadowOptions(imageData);
  if (!defaults) return null;
  if (!shadowEditor) return defaults;
  return {
    centerX: (shadowEditor.centerXRatio ?? (defaults.centerX / imageData.width)) * imageData.width,
    centerY: (shadowEditor.centerYRatio ?? (defaults.centerY / imageData.height)) * imageData.height,
    strength: Number(shadowStrength?.value || shadowEditor.strength || 34),
    size: Number(shadowSize?.value || shadowEditor.size || 100)
  };
}

function beginGroundShadowEditing() {
  if (!currentImageData) return;
  const defaults = defaultGroundShadowOptions(currentImageData);
  if (!defaults) {
    setStatus("当前图片没有可识别的非透明主体，无法建立底部阴影。");
    return;
  }
  shadowEditor = {
    centerXRatio: defaults.centerX / currentImageData.width,
    centerYRatio: defaults.centerY / currentImageData.height,
    strength: Number(shadowStrength?.value || 34),
    size: Number(shadowSize?.value || 100)
  };
  addShadowBtn.textContent = "确认底部阴影";
  setClickMode("shadow");
  drawImageData(currentImageData);
}

function commitGroundShadow() {
  if (!shadowEditor || !currentImageData) return;
  const common = {
    centerXRatio: shadowEditor.centerXRatio,
    centerYRatio: shadowEditor.centerYRatio,
    strength: Number(shadowStrength?.value || shadowEditor.strength || 34),
    size: Number(shadowSize?.value || shadowEditor.size || 100)
  };
  const transformOne = (imageData) => addGroundShadowImageData(imageData, {
    centerX: common.centerXRatio * imageData.width,
    centerY: common.centerYRatio * imageData.height,
    strength: common.strength,
    size: common.size
  });

  shadowEditor = null;
  addShadowBtn.textContent = "添加底部阴影";
  if (processingSource === "sequence") {
    const targets = targetFrames();
    if (!targets.length) return;
    pushHistory();
    targets.forEach((frame) => {
      frame.imageData = transformOne(frame.imageData);
      appendFullResolutionRecipe(frame, "shadow", common);
    });
    setClickMode("view", { silent: true });
    refreshFrameEditPreview(targets, "已添加可调底部阴影");
    return;
  }
  const records = sourceRecordsForProcessing();
  if (!records.length) return;
  setClickMode("view", { silent: true });
  createResultsFromRecords(
    records,
    (imageData) => transformOne(imageData),
    "shadow",
    "已添加可调底部阴影",
    { fullResolutionValue: common }
  );
}

function addGroundShadow() {
  if (shadowEditor && clickMode === "shadow") commitGroundShadow();
  else beginGroundShadowEditing();
}

function updateShadowEditorFromControls() {
  updateRangeLabels();
  if (!shadowEditor || clickMode !== "shadow" || !currentImageData) return;
  shadowEditor.strength = Number(shadowStrength?.value || 34);
  shadowEditor.size = Number(shadowSize?.value || 100);
  drawImageData(currentImageData);
}

function currentOutlinePreviewRecord() {
  if (processingSource === "sequence") {
    const frame = activeFrameIndex >= 0 ? sequenceFrames[activeFrameIndex] : null;
    return frame ? { target: frame, imageData: frame.imageData, previewImageData: frame.previewImageData || null } : null;
  }
  const record = currentSourceRecord();
  return record ? {
    target: record.target,
    imageData: record.imageData,
    previewImageData: record.target?.previewImageData || null
  } : null;
}

function renderOutlineProxyPreview(imageData) {
  if (!imageData) return;
  // Keep the canvas itself small while a range input is moving. Scaling a tiny proxy
  // into a two-million-pixel backing canvas was the real source of the visible pause.
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  selectionCanvas.width = imageData.width;
  selectionCanvas.height = imageData.height;
  drawImageData(imageData);
  canvas.classList.add("ready");
  selectionCanvas.classList.add("ready");
  emptyState.hidden = true;
  outlinePreviewUsingProxy = true;
  fitCanvas();
  updateSelectionCanvas();
}

function setOutlineEditingUi(active) {
  outlinePreviewActive = Boolean(active);
  if (!addOutlineBtn) return;
  addOutlineBtn.textContent = outlinePreviewActive ? "确认描边" : "添加描边";
  addOutlineBtn.classList.toggle("primary", outlinePreviewActive);
  addOutlineBtn.setAttribute("aria-pressed", String(outlinePreviewActive));
}

function clearOutlinePreviewState(options = {}) {
  window.clearTimeout(outlinePreviewTimer);
  outlinePreviewTimer = null;
  const currentRecord = currentOutlinePreviewRecord();
  const canRestore = !outlinePreviewTarget || currentRecord?.target === outlinePreviewTarget;
  if (options.restore && canRestore && outlinePreviewBaseImageData) {
    currentImageData = outlinePreviewBaseImageData;
    renderCanvas();
  }
  outlinePreviewBaseImageData = null;
  outlinePreviewProxyImageData = null;
  outlinePreviewTarget = null;
  outlinePreviewUsingProxy = false;
  setOutlineEditingUi(false);
}

function previewOutline(options = {}) {
  if (!outlinePreviewActive) return;
  const record = currentOutlinePreviewRecord();
  if (!record || (outlinePreviewTarget && outlinePreviewTarget !== record.target)) {
    clearOutlinePreviewState({ restore: false });
    setStatus("描边预览已取消：当前处理目标已经切换。");
    return;
  }
  const transparencySource = record.previewImageData || record.imageData;
  if (!hasTransparentPixels(transparencySource)) {
    clearOutlinePreviewState({ restore: true });
    setStatus("当前目标没有透明区域，请先抠图或净化透明背景后再添加描边。");
    return;
  }
  if (outlinePreviewTarget !== record.target) {
    outlinePreviewTarget = record.target;
    // Preview is read-only, so references are sufficient. Cloning a megapixel source
    // on the first slider movement served no purpose beyond making the UI stutter.
    outlinePreviewBaseImageData = record.imageData;
    outlinePreviewProxyImageData = record.previewImageData || null;
  }
  const size = Number(outlineStrength?.value) || 1;
  const color = outlineColor?.value || "#333333";
  const useFastProxy = options.fast === true
    && outlinePreviewBaseImageData.width * outlinePreviewBaseImageData.height > outlinePreviewFastPixelLimit;
  let previewBase = outlinePreviewBaseImageData;
  if (useFastProxy) {
    const availableProxy = outlinePreviewProxyImageData || outlinePreviewBaseImageData;
    previewBase = availableProxy.width * availableProxy.height > outlinePreviewFastPixelLimit
      ? getLivePreviewProxy(availableProxy, outlinePreviewFastPixelLimit)
      : availableProxy;
  }
  const previewSize = useFastProxy
    ? Math.max(1, Math.round(size * previewBase.width / outlinePreviewBaseImageData.width))
    : size;
  const next = addOutlineImageData(previewBase, { color, size: previewSize });
  showResultMode();
  if (useFastProxy) {
    renderOutlineProxyPreview(next);
  } else {
    outlinePreviewUsingProxy = false;
    currentImageData = next;
    renderCanvas();
  }
  setStatus(`描边实时预览：${size}px。调整完成后点击“确认描边”应用。`);
}

function scheduleOutlinePreview(options = {}) {
  updateRangeLabels();
  if (!outlinePreviewActive) return;
  const fast = options.fast === true;
  window.clearTimeout(outlinePreviewTimer);
  outlinePreviewTimer = window.setTimeout(() => previewOutline({ fast }), fast ? 0 : 12);
}

function beginOutlineEditing() {
  const record = currentOutlinePreviewRecord();
  if (!record) return;
  const transparencySource = record.previewImageData || record.imageData;
  if (!hasTransparentPixels(transparencySource)) {
    setStatus("当前目标没有透明区域，请先抠图或净化透明背景后再添加描边。");
    return;
  }
  outlinePreviewTarget = record.target;
  outlinePreviewBaseImageData = record.imageData;
  outlinePreviewProxyImageData = record.previewImageData || null;
  setOutlineEditingUi(true);
  setStatus("已进入描边调整。移动颜色或强度控件可预览，点击“确认描边”后才会应用。");
}

function addOutline() {
  if (!outlinePreviewActive) {
    beginOutlineEditing();
    return;
  }
  window.clearTimeout(outlinePreviewTimer);
  const record = currentOutlinePreviewRecord();
  if (!record || record.target !== outlinePreviewTarget) {
    clearOutlinePreviewState({ restore: false });
    setStatus("描边预览已取消：当前处理目标已经切换。");
    return;
  }
  const options = {
    color: outlineColor?.value || "#333333",
    size: Number(outlineStrength?.value) || 1
  };
  const message = `已添加 ${options.size}px 描边`;
  const confirmedTarget = outlinePreviewTarget;
  const confirmedBase = outlinePreviewBaseImageData
    ? cloneImageData(outlinePreviewBaseImageData)
    : cloneImageData(record.imageData);
  const frames = targetFrames();
  if (frames.length > 0 && !frames.some((frame) => hasTransparentPixels(frame.imageData))) {
    clearOutlinePreviewState({ restore: true });
    setStatus("当前目标没有透明区域，请先抠图或净化透明背景后再添加描边。");
    return;
  }
  clearOutlinePreviewState({ restore: true });
  if (transformFrames("outline", options, message)) {
    return;
  }
  const records = sourceRecordsForProcessing();
  if (records.length === 0) return;
  if (!records.some((item) => hasTransparentPixels(item.imageData))) {
    setStatus("当前图片没有透明区域，请先抠图或净化透明背景后再添加描边。");
    return;
  }
  createResultsFromRecords(
    records,
    (imageData, sourceRecord) => addOutlineImageData(
      sourceRecord.target === confirmedTarget ? confirmedBase : imageData,
      options
    ),
    "outline",
    message,
    { fullResolutionValue: options }
  );
}

function iconifyResize() {
  const size = currentIconifySize();
  const message = `已按主体比例像素化逻辑生成 ${size.width}×${size.height} 图标`;
  if (transformFrames("iconify", size, message)) {
    return;
  }
  const transform = (item) => {
    item.originalImageData = iconifyImageData(item.originalImageData, size);
    item.currentImageData = iconifyImageData(item.currentImageData, size);
  };
  transform.kind = "iconify";
  transform.value = size;
  transformItems(transform, message);
}


async function applyContourPixelize() {
  const options = currentContourPixelOptions();
  const subjectMode = options.splitSubjects ? "每个主体" : "整体主体";
  const message = `已将${subjectMode}转换为 ${options.width}×${options.height}、${options.paletteSize} 色像素图`;
  contourPixelizeBtn.disabled = true;
  try {
    if (processingSource === "sequence") {
      const frames = targetFrames();
      if (!frames.length) return;
      pushHistory();
      const { converted } = await contourPixelizeSequenceFramesShared(frames, options, sequenceFrames);
      for (let index = 0; index < frames.length; index += 1) {
        frames[index].imageData = converted[index];
        invalidateFullResolutionSource(frames[index]);
        frames[index].pixelatedPreview = true;
      }
      refreshFrameEditPreview(
        frames,
        `${message}；已锁定统一画布与整数位置，并完成时序脏点清理和共享调色板去闪烁`
      );
      fitSmallIconPreview();
      return;
    }
    const records = sourceRecordsForProcessing();
    if (!records.length) return;
    pushHistory();
    const created = [];
    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      setStatus(`正在轮廓像素化 ${index + 1}/${records.length}...`);
      const next = contourPixelizeImageData(record.imageData, options);
      created.push(addProcessedAsset(next, record.name, "contourPixelize", { sourceKind: record.kind, pixelatedPreview: true }));
      await yieldToBrowser(0);
    }
    activateProcessedAsset(created[created.length - 1]);
    fitSmallIconPreview();
    setStatus(`${message}${created.length > 1 ? `，共生成 ${created.length} 个处理结果。` : "。"}`);
  } finally {
    setButtons();
  }
}

function applyCurrentEffectsToImageData(imageData) {
  let next = cloneImageData(imageData);
  if (pickedColors.length > 0) next = buildCutoutFromBase(next, { previewOnly: true });
  return smoothEdgeImageData(next);
}

function applyAllFrameEffects() {
  if (sequenceFrames.length === 0) return;
  setProcessingSource("sequence", { announce: false });
  const targets = targetFrames();
  if (!targets.length) {
    setStatus("请先选择序列帧；需要处理全部帧时可先在右侧序列帧库点击“全选帧”。");
    return;
  }
  pushHistory();
  targets.forEach((frame, index) => {
    frame.imageData = applyCurrentEffectsToImageData(frame.imageData);
    invalidateFullResolutionSource(frame);
    frame.thumbnail = makeThumbnail(frame.imageData);
    if (index % 12 === 0) setStatus(`正在应用当前效果 ${index + 1}/${targets.length}...`);
  });
  refreshFrameEditPreview(targets, "已应用当前底色清除和边缘去锯齿效果");
}

function cropImageData(imageData, selection) {
  const x = Math.max(0, Math.floor(selection.x));
  const y = Math.max(0, Math.floor(selection.y));
  const width = Math.min(imageData.width - x, Math.floor(selection.width));
  const height = Math.min(imageData.height - y, Math.floor(selection.height));
  const work = document.createElement("canvas");
  work.width = imageData.width;
  work.height = imageData.height;
  const workCtx = work.getContext("2d");
  workCtx.putImageData(imageData, 0, 0);
  return workCtx.getImageData(x, y, width, height);
}

function rgbDistanceToColor(data, index, color) {
  if (!color) return Infinity;
  const dr = data[index] - color.r;
  const dg = data[index + 1] - color.g;
  const db = data[index + 2] - color.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function subjectBoundsByBackground(imageData, backgroundColor, threshold = 34) {
  if (!backgroundColor) return null;
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      if (data[index + 3] <= 16) continue;
      if (rgbDistanceToColor(data, index, backgroundColor) <= threshold) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) return null;
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}

function subjectBoundsForCentering(imageData, options = {}) {
  const alphaLimit = options.alphaLimit ?? 16;
  const alphaBounds = shadowSubjectBounds(imageData, alphaLimit);
  const hasTransparency = hasTransparentPixels(imageData);
  if (
    alphaBounds &&
    (hasTransparency || alphaBounds.width < imageData.width || alphaBounds.height < imageData.height)
  ) {
    return alphaBounds;
  }

  const backgroundColor = options.backgroundColor || dominantEdgeColor(imageData);
  const backgroundBounds = subjectBoundsByBackground(
    imageData,
    backgroundColor,
    options.backgroundThreshold ?? 34
  );
  if (backgroundBounds) return backgroundBounds;
  return alphaBounds;
}

function centerSubjectInImageData(imageData, options = {}) {
  if (!imageData || imageData.width <= 0 || imageData.height <= 0) return imageData;
  const bounds = subjectBoundsForCentering(imageData, options);
  if (!bounds || bounds.width <= 0 || bounds.height <= 0) return imageData;

  const targetX = Math.round((imageData.width - bounds.width) / 2);
  const targetY = Math.round((imageData.height - bounds.height) / 2);
  const dx = targetX - bounds.minX;
  const dy = targetY - bounds.minY;
  if (dx === 0 && dy === 0) return imageData;

  const work = document.createElement("canvas");
  work.width = imageData.width;
  work.height = imageData.height;
  const workCtx = work.getContext("2d", { willReadFrequently: true });
  const fillColor = options.backgroundColor || (!hasTransparentPixels(imageData) ? dominantEdgeColor(imageData) : null);
  if (fillColor && !hasTransparentPixels(imageData)) {
    workCtx.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
    workCtx.fillRect(0, 0, work.width, work.height);
  }

  const source = document.createElement("canvas");
  source.width = imageData.width;
  source.height = imageData.height;
  source.getContext("2d").putImageData(imageData, 0, 0);
  workCtx.drawImage(source, dx, dy);
  return workCtx.getImageData(0, 0, imageData.width, imageData.height);
}

function trimTransparentImageData(imageData, alphaLimit = 16) {
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] <= alphaLimit) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) return imageData;
  if (minX === 0 && minY === 0 && maxX === width - 1 && maxY === height - 1) return imageData;
  return cropImageData(imageData, {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  });
}

function trimSparseEdgePixels(imageData, alphaLimit = 32) {
  const { width, height, data } = imageData;
  const rowCounts = new Uint16Array(height);
  const colCounts = new Uint16Array(width);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] <= alphaLimit) continue;
      rowCounts[y] += 1;
      colCounts[x] += 1;
    }
  }

  const rowThreshold = Math.max(3, Math.min(16, Math.ceil(width * 0.025)));
  const colThreshold = Math.max(3, Math.min(16, Math.ceil(height * 0.025)));
  let minY = 0;
  let maxY = height - 1;
  let minX = 0;
  let maxX = width - 1;
  while (minY <= maxY && rowCounts[minY] < rowThreshold) minY += 1;
  while (maxY >= minY && rowCounts[maxY] < rowThreshold) maxY -= 1;
  while (minX <= maxX && colCounts[minX] < colThreshold) minX += 1;
  while (maxX >= minX && colCounts[maxX] < colThreshold) maxX -= 1;

  if (maxX < minX || maxY < minY) return imageData;
  if (minX === 0 && minY === 0 && maxX === width - 1 && maxY === height - 1) return imageData;
  return cropImageData(imageData, {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  });
}

function removeTransparentEdgeBlocks(imageData) {
  const cropped = trimTransparentImageData(imageData, 16);
  const sparseTrimmed = trimSparseEdgePixels(cropped, 32);
  return trimTransparentImageData(sparseTrimmed, 32);
}


function removeTransparentWhiteFringe(imageData, backgroundColors = []) {
  const { width, height, data } = imageData;
  if (width <= 0 || height <= 0) return imageData;

  const pixelIndex = (x, y) => y * width + x;
  const dataIndex = (x, y) => pixelIndex(x, y) * 4;

  const getStats = (r, g, b) => colorStats(r, g, b);

  const colorMatchBackground = (r, g, b, alpha) => {
    if (!backgroundColors || backgroundColors.length === 0) return false;
    const stats = getStats(r, g, b);
    return backgroundColors.some((color) => {
      const maxDistance = Math.max(Math.abs(r - color.r), Math.abs(g - color.g), Math.abs(b - color.b));
      const euclidean = Math.sqrt((r - color.r) ** 2 + (g - color.g) ** 2 + (b - color.b) ** 2);
      const tolerance = alpha < 245 ? 54 : 38;
      const lumaClose = Math.abs(stats.luma - color.luma) <= 88;
      return lumaClose && (maxDistance <= tolerance || euclidean <= tolerance * 1.55);
    });
  };

  const snapshotNeighborhood = (snapshot, x, y, radius = 2) => {
    let transparent = 0;
    let opaque = 0;
    let semi = 0;
    let paleOpaque = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          transparent += 1;
          continue;
        }
        const ni = dataIndex(nx, ny);
        const alpha = snapshot[ni + 3];
        if (alpha <= 24) transparent += 1;
        else if (alpha < 190) semi += 1;
        else {
          opaque += 1;
          const stats = getStats(snapshot[ni], snapshot[ni + 1], snapshot[ni + 2]);
          if (stats.luma >= 188 && stats.saturation <= 0.36) paleOpaque += 1;
        }
      }
    }
    return { transparent, opaque, semi, paleOpaque };
  };

  const isMatteLike = (r, g, b, alpha, backgroundMatched = false) => {
    const stats = getStats(r, g, b);
    const veryWhite = stats.luma >= 218 && stats.saturation <= 0.36;
    const neutralWhite = stats.luma >= 170 && stats.saturation <= 0.40;
    const semiTransparentMatte = alpha < 245 && stats.luma >= 132 && stats.saturation <= 0.52;
    return backgroundMatched || veryWhite || neutralWhite || semiTransparentMatte;
  };

  const hasInnerSubjectAnchor = (snapshot, x, y, baseStats) => {
    // 保护真正的白色花瓣/高光：如果附近有一小片同色系且不贴透明边的实体区域，就不要当作白边删掉。
    let anchors = 0;
    for (let radius = 3; radius <= 8; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = dataIndex(nx, ny);
          if (snapshot[ni + 3] < 235) continue;
          const stats = getStats(snapshot[ni], snapshot[ni + 1], snapshot[ni + 2]);
          const touch = snapshotNeighborhood(snapshot, nx, ny, 1);
          if (touch.transparent > 0 || touch.semi > 2) continue;
          if (Math.abs(stats.luma - baseStats.luma) <= 38 && Math.abs(stats.saturation - baseStats.saturation) <= 0.22) {
            anchors += 1;
            if (anchors >= 4) return true;
          }
        }
      }
    }
    return false;
  };

  const findInnerColor = (snapshot, x, y) => {
    let best = null;
    for (let radius = 2; radius <= 14; radius += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = dataIndex(nx, ny);
          const alpha = snapshot[ni + 3];
          if (alpha < 225) continue;
          const nr = snapshot[ni];
          const ng = snapshot[ni + 1];
          const nb = snapshot[ni + 2];
          const stats = getStats(nr, ng, nb);
          const neighbor = snapshotNeighborhood(snapshot, nx, ny, 1);
          const backgroundMatched = colorMatchBackground(nr, ng, nb, alpha);
          const thinPaleEdge = neighbor.transparent > 0 && stats.luma >= 176 && stats.saturation <= 0.38;
          if (backgroundMatched || thinPaleEdge) continue;
          r += nr;
          g += ng;
          b += nb;
          count += 1;
        }
      }
      if (count >= 3) {
        best = { r: r / count, g: g / count, b: b / count, count };
        break;
      }
    }
    return best;
  };

  // 多遍向内清理白色/灰白哑光边。第一遍处理透明边缘，后续会继续处理被上一遍暴露出来的白边。
  for (let pass = 0; pass < 4; pass += 1) {
    const snapshot = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = dataIndex(x, y);
        const alpha = snapshot[index + 3];
        if (alpha <= 0) continue;

        const near = snapshotNeighborhood(snapshot, x, y, pass < 2 ? 3 : 4);
        if (near.transparent <= 0 && near.semi <= 1) continue;

        const r = snapshot[index];
        const g = snapshot[index + 1];
        const b = snapshot[index + 2];
        const stats = getStats(r, g, b);
        const backgroundMatched = colorMatchBackground(r, g, b, alpha);
        const veryWhite = stats.luma >= 218 && stats.saturation <= 0.36;
        const thinWeakEdge = near.opaque <= 3 && near.transparent >= 4;
        const strongHalo = stats.luma >= 166 && stats.saturation <= 0.46 && near.transparent >= 3;
        const matteLike = isMatteLike(r, g, b, alpha, backgroundMatched) || strongHalo;
        if (!matteLike) continue;

        // 高饱和花朵、叶尖不当成白边；但低饱和白/灰边继续处理。
        if (stats.saturation > 0.56 && !backgroundMatched) continue;
        if (hasInnerSubjectAnchor(snapshot, x, y, stats) && !thinWeakEdge && !backgroundMatched) continue;

        const inner = findInnerColor(snapshot, x, y);
        const edgeStrength = Math.min(1, (near.transparent + near.semi * 0.35) / 14);

        if (inner) {
          const matteStrength = veryWhite ? 0.96 : (backgroundMatched ? 0.88 : 0.76);
          const mix = Math.min(0.98, matteStrength * (0.70 + edgeStrength * 0.30));
          data[index] = Math.round(r * (1 - mix) + inner.r * mix);
          data[index + 1] = Math.round(g * (1 - mix) + inner.g * mix);
          data[index + 2] = Math.round(b * (1 - mix) + inner.b * mix);

          if (veryWhite || backgroundMatched || alpha < 245 || thinWeakEdge) {
            const keep = veryWhite || backgroundMatched
              ? 0.20 + (1 - edgeStrength) * 0.34
              : 0.50 + (1 - edgeStrength) * 0.24;
            data[index + 3] = Math.min(data[index + 3], Math.max(0, Math.round(alpha * keep)));
          }
        } else {
          // 找不到主体内侧颜色的孤立白边，直接削弱或删除。
          const keep = veryWhite || thinWeakEdge || backgroundMatched ? 0.0 : 0.42;
          data[index + 3] = Math.min(data[index + 3], Math.round(alpha * keep));
        }
      }
    }
  }

  return imageData;
}

function cleanPseudoTransparentImageData(imageData) {
  return cleanCheckerboardBackgroundByAlphaMatte(imageData);

  const cleaned = cloneImageData(imageData);
  const { width, height, data } = cleaned;
  const sourcePixels = new Uint8ClampedArray(data);
  const visited = new Uint8Array(width * height);
  const removed = new Uint8Array(width * height);
  const queue = [];
  const pixelIndex = (x, y) => y * width + x;
  const dataIndex = (x, y) => pixelIndex(x, y) * 4;

  const buildBackgroundModel = () => {
    const samples = [];
    const addSample = (x, y, weight = 1) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const index = dataIndex(x, y);
      if (data[index + 3] < 16) return;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const stats = colorStats(r, g, b);
      if (stats.saturation > 0.36) return;
      if (stats.luma < 168) return;
      samples.push({ r, g, b, luma: stats.luma, saturation: stats.saturation, weight });
    };

    const edgeStep = Math.max(1, Math.floor(Math.min(width, height) / 180));
    for (let x = 0; x < width; x += edgeStep) {
      addSample(x, 0, 4);
      addSample(x, height - 1, 4);
      for (let inset = 1; inset <= 3; inset += 1) {
        addSample(x, inset, 2);
        addSample(x, height - 1 - inset, 2);
      }
    }
    for (let y = 0; y < height; y += edgeStep) {
      addSample(0, y, 4);
      addSample(width - 1, y, 4);
      for (let inset = 1; inset <= 3; inset += 1) {
        addSample(inset, y, 2);
        addSample(width - 1 - inset, y, 2);
      }
    }

    const gridStep = Math.max(10, Math.floor(Math.min(width, height) / 96));
    for (let y = Math.floor(gridStep / 2); y < height; y += gridStep) {
      for (let x = Math.floor(gridStep / 2); x < width; x += gridStep) {
        const index = dataIndex(x, y);
        const stats = colorStats(data[index], data[index + 1], data[index + 2]);
        if (stats.saturation <= 0.22 && stats.luma >= 218) addSample(x, y, 1);
      }
    }

    const clusters = [];
    for (const sample of samples) {
      let target = null;
      let bestDistance = Infinity;
      for (const cluster of clusters) {
        const dr = sample.r - cluster.r;
        const dg = sample.g - cluster.g;
        const db = sample.b - cluster.b;
        const distance = Math.sqrt(dr * dr + dg * dg + db * db);
        if (distance < bestDistance) {
          bestDistance = distance;
          target = cluster;
        }
      }
      if (!target || bestDistance > 18) {
        clusters.push({ ...sample, count: sample.weight });
      } else {
        const total = target.count + sample.weight;
        target.r = (target.r * target.count + sample.r * sample.weight) / total;
        target.g = (target.g * target.count + sample.g * sample.weight) / total;
        target.b = (target.b * target.count + sample.b * sample.weight) / total;
        target.luma = (target.luma * target.count + sample.luma * sample.weight) / total;
        target.saturation = (target.saturation * target.count + sample.saturation * sample.weight) / total;
        target.count = total;
      }
    }

    const colors = clusters
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((color) => ({
        r: Math.round(color.r),
        g: Math.round(color.g),
        b: Math.round(color.b),
        luma: color.luma,
        saturation: color.saturation,
        count: color.count
      }));

    if (colors.length === 0) {
      colors.push({ r: 255, g: 255, b: 255, luma: 255, saturation: 0, count: 1 });
      colors.push({ r: 245, g: 245, b: 245, luma: 245, saturation: 0, count: 1 });
    }

    return {
      colors,
      minLuma: Math.min(...colors.map((color) => color.luma)),
      maxLuma: Math.max(...colors.map((color) => color.luma))
    };
  };

  const backgroundModel = buildBackgroundModel();
  const backgroundColors = backgroundModel.colors;

  const colorMatchesBackground = (r, g, b, looseness = 0) => {
    const stats = colorStats(r, g, b);
    if (stats.saturation <= 0.18 + looseness * 0.0025 && stats.luma >= 236 - looseness * 0.58) return true;
    if (stats.saturation > 0.48 && stats.luma < 220) return false;
    return backgroundColors.some((color) => {
      const maxDistance = Math.max(Math.abs(r - color.r), Math.abs(g - color.g), Math.abs(b - color.b));
      const euclidean = Math.sqrt((r - color.r) ** 2 + (g - color.g) ** 2 + (b - color.b) ** 2);
      const lumaClose = Math.abs(stats.luma - color.luma) <= 34 + looseness;
      const chromaSafe = stats.saturation <= 0.34 + looseness * 0.002;
      const brightChecker = stats.luma >= Math.max(170, backgroundModel.minLuma - 42 - looseness) && chromaSafe;
      return chromaSafe && brightChecker && (maxDistance <= 28 + looseness || euclidean <= 44 + looseness * 1.45 || lumaClose);
    });
  };

  const isPseudoTransparentPixel = (index, looseness = 0) => {
    const alpha = data[index + 3];
    if (alpha === 0) return true;
    return colorMatchesBackground(data[index], data[index + 1], data[index + 2], looseness);
  };

  const neighborProfile = (x, y, snapshotRemoved = removed, radius = 1) => {
    let removedCount = 0;
    let subjectCount = 0;
    let backgroundLike = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          removedCount += 1;
          continue;
        }
        const p = pixelIndex(nx, ny);
        const index = p * 4;
        if (snapshotRemoved[p] || data[index + 3] === 0) {
          removedCount += 1;
        } else if (isPseudoTransparentPixel(index, 18)) {
          backgroundLike += 1;
        } else {
          subjectCount += 1;
        }
      }
    }
    return { removedCount, subjectCount, backgroundLike };
  };

  const subjectAnchorProfile = (x, y, snapshotRemoved = removed, radius = 2) => {
    let subjectAnchors = 0;
    let strongAnchors = 0;
    let colorAnchors = 0;
    let backgroundAnchors = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const p = pixelIndex(nx, ny);
        const index = p * 4;
        if (snapshotRemoved[p] || data[index + 3] === 0) continue;
        const stats = colorStats(data[index], data[index + 1], data[index + 2]);
        const obviousChecker = stats.saturation <= 0.16 && stats.luma >= 228;
        const probableSubject = !obviousChecker && (stats.luma < 218 || stats.saturation > 0.20 || !isPseudoTransparentPixel(index, 2));
        if (!probableSubject) {
          backgroundAnchors += 1;
          continue;
        }
        subjectAnchors += 1;
        if (stats.luma < 205) strongAnchors += 1;
        if (stats.saturation > 0.24) colorAnchors += 1;
      }
    }
    return {
      backgroundAnchors,
      colorAnchors,
      strongAnchors,
      subjectAnchors,
      protected: subjectAnchors >= 7 || strongAnchors >= 4 || (subjectAnchors >= 4 && colorAnchors >= 1)
    };
  };

  const removePixel = (p) => {
    removed[p] = 1;
    data[p * 4 + 3] = 0;
  };

  const softenPixel = (p, keep) => {
    const index = p * 4;
    data[index + 3] = Math.min(data[index + 3], Math.max(0, Math.round(data[index + 3] * keep)));
    if (data[index + 3] <= 18) removePixel(p);
  };

  const restoreOvercutSubjectDetails = () => {
    const totalPixels = width * height;
    const holeVisited = new Uint8Array(totalPixels);
    const component = [];
    const edgeQueue = [];

    const currentOpaqueSupport = (x, y, radius = 2) => {
      let opaque = 0;
      let strong = 0;
      let colored = 0;
      let transparent = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            transparent += 1;
            continue;
          }
          const index = dataIndex(nx, ny);
          const alpha = data[index + 3];
          if (alpha <= 24) {
            transparent += 1;
            continue;
          }
          const stats = colorStats(data[index], data[index + 1], data[index + 2]);
          if (colorMatchesBackground(data[index], data[index + 1], data[index + 2], 2) && stats.luma >= 224 && stats.saturation <= 0.20) {
            continue;
          }
          opaque += 1;
          if (alpha >= 180 && stats.luma < 216) strong += 1;
          if (stats.saturation > 0.22) colored += 1;
        }
      }
      return { colored, opaque, strong, transparent };
    };

    const sourceLooksLikeSubject = (p, support) => {
      const index = p * 4;
      const r = sourcePixels[index];
      const g = sourcePixels[index + 1];
      const b = sourcePixels[index + 2];
      const stats = colorStats(r, g, b);
      if (stats.saturation > 0.22 || stats.luma < 220) return true;
      if (support.strong >= 5 || support.opaque >= 12) return true;
      return !colorMatchesBackground(r, g, b, 0) && support.opaque >= 8;
    };

    const directionalSupport = (x, y) => {
      const directions = [
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: -1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: 1, dy: 1 }
      ];
      let supportedDirections = 0;
      let closeStrong = 0;
      for (const direction of directions) {
        let found = false;
        for (let step = 1; step <= 4; step += 1) {
          const nx = x + direction.dx * step;
          const ny = y + direction.dy * step;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) break;
          const index = dataIndex(nx, ny);
          const alpha = data[index + 3];
          if (alpha <= 24) continue;
          const stats = colorStats(data[index], data[index + 1], data[index + 2]);
          if (colorMatchesBackground(data[index], data[index + 1], data[index + 2], 2) && stats.luma >= 224 && stats.saturation <= 0.20) continue;
          found = true;
          if (alpha >= 180 && stats.luma < 218) closeStrong += 1;
          break;
        }
        if (found) supportedDirections += 1;
      }
      return { closeStrong, supportedDirections };
    };

    const restoreSourcePixel = (p, alpha = 220) => {
      const index = p * 4;
      data[index] = sourcePixels[index];
      data[index + 1] = sourcePixels[index + 1];
      data[index + 2] = sourcePixels[index + 2];
      data[index + 3] = Math.max(sourcePixels[index + 3], alpha);
      removed[p] = 0;
    };

    for (let start = 0; start < totalPixels; start += 1) {
      if (holeVisited[start] || data[start * 4 + 3] !== 0) continue;
      let head = 0;
      let touchesBorder = false;
      let supported = 0;
      let sourceSubject = 0;
      let sourceChecker = 0;
      component.length = 0;
      edgeQueue.length = 0;
      edgeQueue.push(start);
      holeVisited[start] = 1;

      while (head < edgeQueue.length) {
        const p = edgeQueue[head];
        head += 1;
        component.push(p);
        const x = p % width;
        const y = Math.floor(p / width);
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesBorder = true;

        const support = currentOpaqueSupport(x, y, 2);
        if (support.opaque >= 9 || support.strong >= 4) supported += 1;
        if (sourceLooksLikeSubject(p, support)) sourceSubject += 1;
        else sourceChecker += 1;

        const neighbors = [
          x > 0 ? p - 1 : -1,
          x < width - 1 ? p + 1 : -1,
          y > 0 ? p - width : -1,
          y < height - 1 ? p + width : -1
        ];
        for (const next of neighbors) {
          if (next < 0 || holeVisited[next] || data[next * 4 + 3] !== 0) continue;
          holeVisited[next] = 1;
          edgeQueue.push(next);
        }
      }

      const area = component.length;
      const supportedRatio = supported / Math.max(1, area);
      const sourceSubjectRatio = sourceSubject / Math.max(1, sourceSubject + sourceChecker);
      const interiorHole = !touchesBorder && area <= Math.max(48, Math.round(width * height * 0.0018));
      const anchoredCutout = area <= Math.max(26, Math.round(width * height * 0.0008)) && supportedRatio >= 0.38 && sourceSubjectRatio >= 0.52;
      if (!interiorHole && !anchoredCutout) continue;

      for (const p of component) {
        const x = p % width;
        const y = Math.floor(p / width);
        const support = currentOpaqueSupport(x, y, 2);
        if (!sourceLooksLikeSubject(p, support) && !(interiorHole && support.opaque >= 10)) continue;
        restoreSourcePixel(p, support.strong >= 5 ? 230 : 190);
      }
    }

    for (let pass = 0; pass < 4; pass += 1) {
      const alphaSnapshot = new Uint8ClampedArray(totalPixels);
      for (let p = 0; p < totalPixels; p += 1) alphaSnapshot[p] = data[p * 4 + 3];
      const toRestore = [];
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const p = pixelIndex(x, y);
          if (alphaSnapshot[p] !== 0) continue;
          const support = currentOpaqueSupport(x, y, pass < 2 ? 2 : 3);
          const direction = directionalSupport(x, y);
          const sourceSubject = sourceLooksLikeSubject(p, support);
          const enclosedNotch = direction.supportedDirections >= 5 && direction.closeStrong >= 3;
          const denseSupport = support.strong >= 7 || support.opaque >= 16 || (support.strong >= 4 && support.opaque >= 10);
          if (!sourceSubject) continue;
          if (denseSupport || enclosedNotch) toRestore.push({ p, alpha: denseSupport ? 226 : 196 });
        }
      }
      if (toRestore.length === 0) break;
      for (const item of toRestore) restoreSourcePixel(item.p, item.alpha);
    }
  };

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = pixelIndex(x, y);
    if (visited[p]) return;
    const index = p * 4;
    if (!isPseudoTransparentPixel(index, 6)) return;
    visited[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let head = 0; head < queue.length; head += 1) {
    const p = queue[head];
    const x = p % width;
    const y = Math.floor(p / width);
    removePixel(p);
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        enqueue(x + dx, y + dy);
      }
    }
  }

  for (let pass = 0; pass < 5; pass += 1) {
    const snapshotRemoved = new Uint8Array(removed);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const p = pixelIndex(x, y);
        if (snapshotRemoved[p]) continue;
        const index = p * 4;
        if (data[index + 3] === 0) {
          removed[p] = 1;
          continue;
        }
        const near = neighborProfile(x, y, snapshotRemoved, pass < 3 ? 1 : 2);
        if (near.removedCount === 0) continue;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const stats = colorStats(r, g, b);
        const support = subjectAnchorProfile(x, y, snapshotRemoved, pass < 2 ? 2 : 3);
        const protectedSubject = support.protected && !(near.removedCount >= 7 && near.subjectCount <= 1);
        const looseness = 8 + pass * 5;
        const backgroundLike = isPseudoTransparentPixel(index, looseness);
        const hardChecker = stats.saturation <= 0.22 && stats.luma >= 224 - pass * 2;
        const brightMatte = stats.saturation <= 0.34 && stats.luma >= 196 - pass * 3;
        const weakGrayFringe = stats.saturation <= 0.30 && stats.luma >= 118 && near.removedCount >= 6 && near.subjectCount <= 2;
        const darkScratch = stats.saturation <= 0.42 && stats.luma < 104 && near.removedCount >= 7 && near.subjectCount <= 1;
        const thinOrphan = near.subjectCount <= 2 && near.removedCount >= 4;

        if (hardChecker && near.removedCount >= 2 && support.subjectAnchors <= 2) {
          removePixel(p);
        } else if (!protectedSubject && (backgroundLike || (brightMatte && near.removedCount >= 3 && near.subjectCount <= 3) || weakGrayFringe || darkScratch)) {
          removePixel(p);
        } else if (!protectedSubject && thinOrphan && stats.saturation <= 0.40 && stats.luma < 172) {
          softenPixel(p, pass < 3 ? 0.26 : 0);
        } else if (!protectedSubject && brightMatte && near.removedCount >= 2 && support.subjectAnchors <= 3) {
          softenPixel(p, 0.42);
        }
      }
    }
  }

  const originalAlpha = new Uint8ClampedArray(width * height);
  for (let p = 0; p < originalAlpha.length; p += 1) originalAlpha[p] = data[p * 4 + 3];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = pixelIndex(x, y);
      const index = p * 4;
      if (originalAlpha[p] === 0) continue;
      const near = neighborProfile(x, y, removed, 1);
      if (near.removedCount < 3) continue;
      const stats = colorStats(data[index], data[index + 1], data[index + 2]);
      const support = subjectAnchorProfile(x, y, removed, 2);
      if (!support.protected && stats.saturation <= 0.34 && stats.luma >= 178 && near.subjectCount <= 2) softenPixel(p, 0.32);
    }
  }

  removeTransparentWhiteFringe(cleaned, backgroundColors);
  professionalTransparentCleanup(cleaned, {
    backgroundColors,
    aggressive: true,
    alphaFloor: 24,
    weakAlpha: 132,
    minComponentArea: Math.max(8, Math.min(320, Math.round(width * height * 0.00034)))
  });
  restoreOvercutSubjectDetails();
  professionalTransparentCleanup(cleaned, {
    backgroundColors,
    aggressive: false,
    alphaFloor: 12,
    weakAlpha: 72,
    minComponentArea: Math.max(4, Math.min(120, Math.round(width * height * 0.00012)))
  });
  return removeTransparentEdgeBlocks(professionalMaskCleanup(cleaned, imageData, backgroundColors));
}




function removeAutoExtractEdgeArtifacts(imageData) {
  const cleaned = cloneImageData(imageData);
  const { width, height, data } = cleaned;
  const visited = new Uint8Array(width * height);
  const queue = [];
  const pixelIndex = (x, y) => y * width + x;
  const dataIndex = (x, y) => pixelIndex(x, y) * 4;

  const isBorderArtifactPixel = (index) => {
    const alpha = data[index + 3];
    if (alpha === 0) return false;
    if (alpha < 245) return true;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const stats = colorStats(r, g, b);
    return stats.luma > 145 && stats.saturation < 0.2;
  };

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = pixelIndex(x, y);
    if (visited[p]) return;
    const index = p * 4;
    if (!isBorderArtifactPixel(index)) return;
    visited[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let head = 0; head < queue.length; head += 1) {
    const p = queue[head];
    const x = p % width;
    const y = Math.floor(p / width);
    data[p * 4 + 3] = 0;
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  return trimTransparentImageData(cleaned, 2);
}

function dominantEdgeColor(imageData) {
  const { width, height, data } = imageData;
  const counts = new Map();
  const add = (x, y) => {
    const index = (y * width + x) * 4;
    if (data[index + 3] < 200) return;
    const key = `${Math.round(data[index] / 8) * 8},${Math.round(data[index + 1] / 8) * 8},${Math.round(data[index + 2] / 8) * 8}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  };
  const step = Math.max(1, Math.floor(Math.min(width, height) / 80));
  for (let x = 0; x < width; x += step) {
    add(x, 0);
    add(x, height - 1);
  }
  for (let y = 0; y < height; y += step) {
    add(0, y);
    add(width - 1, y);
  }
  const [key] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || ["0,255,0"];
  const [r, g, b] = key.split(",").map(Number);
  return { r, g, b };
}

function dominantSelectionOutsideColor(imageData, selection) {
  if (!selection) return null;
  const { width, height, data } = imageData;
  const counts = new Map();
  const add = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = (y * width + x) * 4;
    if (data[index + 3] < 200) return;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const greenScore = g - Math.max(r, b);
    if (greenScore < 20 && !(g > 120 && r < 120 && b < 120)) return;
    const key = `${Math.round(r / 4) * 4},${Math.round(g / 4) * 4},${Math.round(b / 4) * 4}`;
    counts.set(key, (counts.get(key) || 0) + Math.max(1, greenScore));
  };

  const left = Math.floor(selection.x);
  const top = Math.floor(selection.y);
  const right = Math.ceil(selection.x + selection.width) - 1;
  const bottom = Math.ceil(selection.y + selection.height) - 1;
  const step = Math.max(1, Math.floor(Math.min(selection.width, selection.height) / 90));
  const offsets = [-3, -2, -1, 0, 1, 2, 3];
  for (let x = left; x <= right; x += step) {
    offsets.forEach((offset) => {
      add(x, top + offset);
      add(x, bottom + offset);
    });
  }
  for (let y = top; y <= bottom; y += step) {
    offsets.forEach((offset) => {
      add(left + offset, y);
      add(right + offset, y);
    });
  }

  const [key] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || [];
  if (!key) return null;
  const [r, g, b] = key.split(",").map(Number);
  return { r, g, b };
}

function squarePadWithGreenScreen(imageData, fillColor = null) {
  if (!squareGreenCrop.checked || imageData.width === imageData.height) return imageData;
  const size = Math.max(imageData.width, imageData.height);
  const fill = fillColor || dominantEdgeColor(imageData);
  const work = document.createElement("canvas");
  work.width = size;
  work.height = size;
  const workCtx = work.getContext("2d", { willReadFrequently: true });
  workCtx.fillStyle = `rgb(${fill.r}, ${fill.g}, ${fill.b})`;
  workCtx.fillRect(0, 0, size, size);
  const source = document.createElement("canvas");
  source.width = imageData.width;
  source.height = imageData.height;
  source.getContext("2d").putImageData(imageData, 0, 0);
  const x = Math.floor((size - imageData.width) / 2);
  const y = Math.floor((size - imageData.height) / 2);
  workCtx.drawImage(source, x, y);
  return workCtx.getImageData(0, 0, size, size);
}

function centerTransparentSubjectInTightCanvas(imageData, padding = 2) {
  if (!hasTransparentPixels(imageData)) return imageData;
  const bounds = subjectAlphaBounds(imageData, 0);
  if (!bounds || bounds.width <= 0 || bounds.height <= 0) return imageData;

  const source = document.createElement("canvas");
  source.width = imageData.width;
  source.height = imageData.height;
  source.getContext("2d").putImageData(imageData, 0, 0);

  const output = document.createElement("canvas");
  output.width = Math.max(1, bounds.width + padding * 2);
  output.height = Math.max(1, bounds.height + padding * 2);
  const outputCtx = output.getContext("2d", { willReadFrequently: true });
  outputCtx.clearRect(0, 0, output.width, output.height);
  outputCtx.drawImage(
    source,
    bounds.minX,
    bounds.minY,
    bounds.width,
    bounds.height,
    padding,
    padding,
    bounds.width,
    bounds.height
  );
  return outputCtx.getImageData(0, 0, output.width, output.height);
}

function finalizeCroppedImageData(imageData, fillColor = null) {
  if (!squareGreenCrop.checked) return centerTransparentSubjectInTightCanvas(imageData);
  return squarePadWithGreenScreen(
    centerSubjectInImageData(imageData, { backgroundColor: fillColor }),
    fillColor
  );
}

function lassoBoundsForImage(imageData) {
  if (lassoSelection.length < 3) return null;
  const xs = lassoSelection.map((point) => point.x);
  const ys = lassoSelection.map((point) => point.y);
  const x = Math.max(0, Math.floor(Math.min(...xs)));
  const y = Math.max(0, Math.floor(Math.min(...ys)));
  const right = Math.min(imageData.width, Math.ceil(Math.max(...xs)));
  const bottom = Math.min(imageData.height, Math.ceil(Math.max(...ys)));
  const width = Math.max(0, right - x);
  const height = Math.max(0, bottom - y);
  return { x, y, width, height };
}

function cropLassoImageData(imageData) {
  const bounds = lassoBoundsForImage(imageData);
  if (!bounds || bounds.width < 4 || bounds.height < 4) return null;
  const masked = cloneImageData(imageData);
  for (let py = 0; py < masked.height; py += 1) {
    for (let px = 0; px < masked.width; px += 1) {
      if (!isPointInPolygon(px + 0.5, py + 0.5, lassoSelection)) {
        masked.data[(py * masked.width + px) * 4 + 3] = 0;
      }
    }
  }
  return cropImageData(masked, bounds);
}

function cleanRecognizedAssetName(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[\\/:*?"<>|]/g, "")
    .trim()
    .slice(0, 60);
}

function averageRecognizedWordConfidence(words = []) {
  const values = words
    .map((word) => Number(word?.confidence))
    .filter((value) => Number.isFinite(value) && value >= 0);
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function bestRecognizedTextLine(text) {
  const candidates = String(text || "")
    .split(/\r?\n/)
    .map(cleanRecognizedAssetName)
    .filter((line) => /[\p{L}\p{N}\u3400-\u9fff]/u.test(line));
  candidates.sort((left, right) => {
    const score = (value) => {
      const compact = value.replace(/\s+/g, "");
      const punctuationPenalty = (value.match(/[^\p{L}\p{N}\u3400-\u9fff\s.-]/gu) || []).length * 8;
      const wordPenalty = Math.max(0, value.split(/\s+/).length - 4) * 4;
      return Math.min(compact.length, 24) * 3 - punctuationPenalty - wordPenalty;
    };
    return score(right) - score(left);
  });
  return candidates[0] || "";
}

function isReliableRecognizedAssetName(text, words = []) {
  const name = cleanRecognizedAssetName(text);
  const compact = name.replace(/\s+/g, "");
  if (!/[\p{L}\p{N}\u3400-\u9fff]/u.test(compact)) return false;
  if (compact.length < 2) return false;

  const confidence = averageRecognizedWordConfidence(words);
  const hasPositionedWords = words.length > 0;

  // Axe、Bow、Hoe、Log、Key 等短英文道具名本来就只有 3 个字母。
  // 旧逻辑把 1~3 个字母全部视为噪声，导致识别成功后仍不命名、也不删除文字。
  if (/^[a-z]{2,3}$/i.test(compact)) {
    return hasPositionedWords ? confidence >= 45 : /^[A-Z][a-z]{1,2}$/.test(name);
  }

  // 常见中文道具名可能只有两个汉字，例如“木头”“石头”。有定位结果时适当要求置信度。
  if (/^[\u3400-\u9fff]{1,2}$/u.test(compact)) {
    return compact.length === 2 && (!hasPositionedWords || confidence >= 45);
  }

  if (/^\d+\.?\s*[a-z]{1,2}$/i.test(name) && confidence < 70) return false;
  return compact.length >= 3;
}

function prepareImageForOcr(imageData) {
  const scale = Math.max(1, Math.min(4, Math.floor(1800 / Math.max(imageData.width, imageData.height))));
  const source = document.createElement("canvas");
  source.width = imageData.width;
  source.height = imageData.height;
  source.getContext("2d").putImageData(imageData, 0, 0);

  const prepared = document.createElement("canvas");
  prepared.width = imageData.width * scale;
  prepared.height = imageData.height * scale;
  const preparedCtx = prepared.getContext("2d", { willReadFrequently: true });
  preparedCtx.fillStyle = "#ffffff";
  preparedCtx.fillRect(0, 0, prepared.width, prepared.height);
  preparedCtx.imageSmoothingEnabled = true;
  preparedCtx.imageSmoothingQuality = "high";
  preparedCtx.drawImage(source, 0, 0, prepared.width, prepared.height);

  const pixels = preparedCtx.getImageData(0, 0, prepared.width, prepared.height);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const gray = pixels.data[index] * 0.299 + pixels.data[index + 1] * 0.587 + pixels.data[index + 2] * 0.114;
    const contrasted = Math.max(0, Math.min(255, (gray - 128) * 1.55 + 128));
    pixels.data[index] = contrasted;
    pixels.data[index + 1] = contrasted;
    pixels.data[index + 2] = contrasted;
    pixels.data[index + 3] = 255;
  }
  preparedCtx.putImageData(pixels, 0, 0);
  return { canvas: prepared, scale };
}

function isRecognizedWordSeparated(imageData, bbox, ocrScale) {
  const left = Math.max(0, Math.floor(bbox.x0 / ocrScale));
  const top = Math.max(0, Math.floor(bbox.y0 / ocrScale));
  const right = Math.min(imageData.width, Math.ceil(bbox.x1 / ocrScale));
  const bottom = Math.min(imageData.height, Math.ceil(bbox.y1 / ocrScale));
  const wordHeight = Math.max(1, bottom - top);
  const margin = Math.max(4, Math.round(wordHeight * 0.45));
  const outerLeft = Math.max(0, left - margin);
  const outerTop = Math.max(0, top - margin);
  const outerRight = Math.min(imageData.width, right + margin);
  const outerBottom = Math.min(imageData.height, bottom + margin);

  let ringPixels = 0;
  let transparentPixels = 0;
  let opaquePixels = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  let redSquared = 0;
  let greenSquared = 0;
  let blueSquared = 0;
  let brightness = 0;
  let chroma = 0;
  const colorBuckets = new Set();

  for (let y = outerTop; y < outerBottom; y += 1) {
    for (let x = outerLeft; x < outerRight; x += 1) {
      if (x >= left && x < right && y >= top && y < bottom) continue;
      ringPixels += 1;
      const index = (y * imageData.width + x) * 4;
      const alpha = imageData.data[index + 3];
      if (alpha < 40) {
        transparentPixels += 1;
        continue;
      }
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      opaquePixels += 1;
      red += r;
      green += g;
      blue += b;
      redSquared += r * r;
      greenSquared += g * g;
      blueSquared += b * b;
      brightness += (r + g + b) / 3;
      chroma += Math.max(r, g, b) - Math.min(r, g, b);
      colorBuckets.add(`${Math.round(r / 24)},${Math.round(g / 24)},${Math.round(b / 24)}`);
    }
  }

  if (ringPixels === 0) return false;
  if (transparentPixels / ringPixels >= 0.55) return true;
  if (opaquePixels === 0) return true;

  const averageBrightness = brightness / opaquePixels;
  const averageChroma = chroma / opaquePixels;
  const isSimpleLightPattern =
    colorBuckets.size <= 8 &&
    averageBrightness >= 175 &&
    averageChroma <= 14;
  if (isSimpleLightPattern) return true;

  const variance =
    redSquared / opaquePixels - (red / opaquePixels) ** 2 +
    greenSquared / opaquePixels - (green / opaquePixels) ** 2 +
    blueSquared / opaquePixels - (blue / opaquePixels) ** 2;
  return variance < 650;
}

function recognizedWordsFromBlocks(blocks, imageData, ocrScale) {
  const candidateLines = [];
  (blocks || []).forEach((block) => {
    (block.paragraphs || []).forEach((paragraph) => {
      (paragraph.lines || []).forEach((line) => {
        const words = [];
        (line.words || []).forEach((word) => {
          const text = cleanRecognizedAssetName(word.text || "");
          const confidence = Number(word.confidence || 0);
          const compactLength = text.replace(/\s+/g, "").length;
          const confidenceAccepted =
            confidence >= 55 ||
            (compactLength >= 6 && confidence >= 20);
          if (
            text &&
            confidenceAccepted &&
            /[\p{L}\p{N}\u3400-\u9fff]/u.test(text) &&
            word.bbox &&
            isRecognizedWordSeparated(imageData, word.bbox, ocrScale)
          ) {
            words.push({ text, confidence, bbox: word.bbox });
          }
        });
        if (words.length > 0) {
          const lineText = cleanRecognizedAssetName(words.map((word) => word.text).join(" "));
          const compactLength = lineText.replace(/\s+/g, "").length;
          const filenameBonus = /\.[a-z0-9]{2,5}$/i.test(lineText) ? 100 : 0;
          const averageConfidence = words.reduce((sum, word) => sum + word.confidence, 0) / words.length;
          candidateLines.push({
            words,
            score: filenameBonus + compactLength * 3 + averageConfidence / 10
          });
        }
      });
    });
  });
  candidateLines.sort((a, b) => b.score - a.score);
  return candidateLines[0]?.words || [];
}

function recognizedWordsFromTsv(tsv, imageData, ocrScale) {
  if (!tsv || typeof tsv !== "string") return [];
  const rows = tsv.trim().split(/\r?\n/);
  if (rows.length < 2) return [];
  const headers = rows[0].split("\t");
  const indexes = Object.fromEntries(headers.map((name, index) => [name, index]));
  const required = ["level", "block_num", "par_num", "line_num", "left", "top", "width", "height", "conf", "text"];
  if (required.some((name) => indexes[name] === undefined)) return [];

  const lineGroups = new Map();
  rows.slice(1).forEach((row) => {
    const fields = row.split("\t");
    if (Number(fields[indexes.level]) !== 5) return;
    const text = cleanRecognizedAssetName(fields.slice(indexes.text).join(" "));
    const confidence = Number(fields[indexes.conf] || 0);
    const compactLength = text.replace(/\s+/g, "").length;
    const confidenceAccepted = confidence >= 55 || (compactLength >= 6 && confidence >= 20);
    if (!text || !confidenceAccepted || !/[\p{L}\p{N}\u3400-\u9fff]/u.test(text)) return;

    const left = Number(fields[indexes.left] || 0);
    const top = Number(fields[indexes.top] || 0);
    const width = Number(fields[indexes.width] || 0);
    const height = Number(fields[indexes.height] || 0);
    if (width <= 0 || height <= 0) return;
    const bbox = { x0: left, y0: top, x1: left + width, y1: top + height };
    if (!isRecognizedWordSeparated(imageData, bbox, ocrScale)) return;

    const key = `${fields[indexes.block_num]}:${fields[indexes.par_num]}:${fields[indexes.line_num]}`;
    if (!lineGroups.has(key)) lineGroups.set(key, []);
    lineGroups.get(key).push({ text, confidence, bbox });
  });

  const candidateLines = Array.from(lineGroups.values()).map((words) => {
    const lineText = cleanRecognizedAssetName(words.map((word) => word.text).join(" "));
    const compactLength = lineText.replace(/\s+/g, "").length;
    const filenameBonus = /\.[a-z0-9]{2,5}$/i.test(lineText) ? 100 : 0;
    const averageConfidence = words.reduce((sum, word) => sum + word.confidence, 0) / Math.max(1, words.length);
    return { words, score: filenameBonus + compactLength * 3 + averageConfidence / 10 };
  });
  candidateLines.sort((a, b) => b.score - a.score);
  return candidateLines[0]?.words || [];
}

function removeRecognizedWordsFromImage(imageData, words, ocrScale) {
  const next = cloneImageData(imageData);
  words.forEach(({ bbox }) => {
    const wordHeight = Math.max(1, (bbox.y1 - bbox.y0) / Math.max(ocrScale, 1));
    const padding = Math.max(2, Math.round(wordHeight * 0.14));
    const left = Math.max(0, Math.floor(bbox.x0 / ocrScale) - padding);
    const top = Math.max(0, Math.floor(bbox.y0 / ocrScale) - padding);
    const right = Math.min(next.width, Math.ceil(bbox.x1 / ocrScale) + padding);
    const bottom = Math.min(next.height, Math.ceil(bbox.y1 / ocrScale) + padding);
    for (let y = top; y < bottom; y += 1) {
      for (let x = left; x < right; x += 1) {
        next.data[(y * next.width + x) * 4 + 3] = 0;
      }
    }
  });
  return next;
}

function syncRecognizedAssetView(asset) {
  if (activeLibraryTarget === asset) {
    currentImageData = asset.imageData;
    originalImageData = asset.imageData;
    liveBaseImageData = null;
    renderCanvas();
  }
  renderAssetList(true);
  renderWorkspaceTabs();
  setButtons();
}

const OCR_INIT_TIMEOUT_MS = 180000;
const OCR_RECOGNIZE_TIMEOUT_MS = 120000;

function ocrLanguageLabel(language) {
  return language === "chi_sim" ? "简体中文" : "英文";
}

function updateOcrRuntimeHint() {
  if (!ocrRuntimeHint) return;
  if (window.location.protocol === "file:") {
    ocrRuntimeHint.textContent = "当前为直接文件模式。文字识别需双击“启动工具.bat”后使用。";
    ocrRuntimeHint.dataset.state = "warning";
  } else {
    ocrRuntimeHint.textContent = "离线 OCR 已通过本地服务运行，无需联网。";
    ocrRuntimeHint.dataset.state = "ready";
  }
}

function ensureOcrRuntimeAvailable() {
  if (!window.Tesseract?.createWorker) {
    throw new Error("OCR 主程序未加载，请检查 vendor/tesseract.min.js");
  }
  if (window.location.protocol === "file:") {
    throw new Error("当前直接打开了 index.html，浏览器会阻止离线 OCR 的 Worker 和语言包。请关闭页面并双击“启动工具.bat”运行");
  }
}

function formatOcrProgress(message, language) {
  const status = String(message?.status || "");
  const progress = Number(message?.progress);
  const percent = Number.isFinite(progress) ? ` ${Math.round(progress * 100)}%` : "";
  const stageMap = {
    "loading tesseract core": "加载 OCR 核心",
    "initializing tesseract": "初始化 OCR 引擎",
    "loading language traineddata": `加载${ocrLanguageLabel(language)}语言包`,
    "initializing api": "初始化识别接口",
    "recognizing text": "识别文字"
  };
  return `${stageMap[status] || status || "准备 OCR"}${percent}`;
}

function withTimeout(promise, milliseconds, message = "OCR timeout") {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), milliseconds);
    Promise.resolve(promise).then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      }
    );
  });
}

async function terminateOcrWorker(language) {
  const pending = ocrWorkerPromises.get(language);
  ocrWorkerPromises.delete(language);
  if (!pending) return;
  try {
    const worker = await pending;
    await worker?.terminate?.();
  } catch (_) {
    // 初始化失败的 worker 无需再次处理。
  }
}

async function getOcrWorker(language = "eng") {
  ensureOcrRuntimeAvailable();
  if (!ocrWorkerPromises.has(language)) {
    const baseUrl = new URL(".", window.location.href);
    const oem = window.Tesseract.OEM?.LSTM_ONLY ?? 1;
    const workerPromise = window.Tesseract.createWorker(language, oem, {
      workerPath: new URL("vendor/worker.min.js", baseUrl).href,
      corePath: new URL("vendor/tesseract-core", baseUrl).href,
      langPath: new URL("vendor/tessdata", baseUrl).href,
      cacheMethod: "write",
      workerBlobURL: false,
      gzip: true,
      logger: (message) => {
        const progressText = formatOcrProgress(message, language);
        if (progressText) setStatus(`文字识别：${progressText}。`);
      },
      errorHandler: (error) => {
        console.error(`OCR ${language} worker error`, error);
      }
    }).then(async (worker) => {
      await worker.setParameters({
        tessedit_pageseg_mode: window.Tesseract.PSM.SPARSE_TEXT,
        preserve_interword_spaces: "1",
        user_defined_dpi: "300"
      });
      return worker;
    }).catch((error) => {
      ocrWorkerPromises.delete(language);
      throw error;
    });
    ocrWorkerPromises.set(language, workerPromise);
  }
  return ocrWorkerPromises.get(language);
}

function parseOcrResult(result, imageData, ocrScale) {
  let words = recognizedWordsFromBlocks(result?.data?.blocks, imageData, ocrScale);
  if (words.length === 0) words = recognizedWordsFromTsv(result?.data?.tsv, imageData, ocrScale);
  const positionedText = cleanRecognizedAssetName(words.map((word) => word.text).join(" "));
  const fallbackText = bestRecognizedTextLine(result?.data?.text || "");
  const recognizedName = positionedText || fallbackText;
  return {
    words,
    recognizedName,
    reliable: Boolean(recognizedName && isReliableRecognizedAssetName(recognizedName, words))
  };
}

async function runOcrPass(prepared, imageData, language) {
  let worker;
  try {
    worker = await withTimeout(
      getOcrWorker(language),
      OCR_INIT_TIMEOUT_MS,
      `${ocrLanguageLabel(language)} OCR 初始化超时`
    );
    const result = await withTimeout(
      worker.recognize(prepared.canvas, {}, { text: true, blocks: true, tsv: true }),
      OCR_RECOGNIZE_TIMEOUT_MS,
      `${ocrLanguageLabel(language)} OCR 识别超时`
    );
    return parseOcrResult(result, imageData, prepared.scale);
  } catch (error) {
    await terminateOcrWorker(language);
    throw error;
  }
}

function describeOcrError(error) {
  const message = String(error?.message || error || "离线 OCR 组件初始化失败");
  if (window.location.protocol === "file:" || /直接打开了 index\.html|启动工具\.bat/.test(message)) {
    return "当前使用直接文件模式，浏览器阻止了离线 OCR。请关闭页面并双击“启动工具.bat”重新打开";
  }
  if (/timeout|超时/i.test(message)) {
    return `${message}。请确认通过“启动工具.bat”运行，并点击“检测 OCR”查看具体加载阶段`;
  }
  if (/Network error|fetch|Failed to load|importScripts|Worker/i.test(message)) {
    return `${message}。请检查 vendor 文件夹是否完整，并通过“启动工具.bat”运行`;
  }
  return message;
}

function recognizeAssetName(asset) {
  ocrQueue = ocrQueue.then(async () => {
    try {
      ensureOcrRuntimeAvailable();
      const prepared = prepareImageForOcr(asset.imageData);
      const attempts = ["eng", "chi_sim"];
      let parsed = null;
      let lastError = null;

      for (const language of attempts) {
        try {
          setStatus(`正在使用${ocrLanguageLabel(language)}识别素材文字…`);
          const result = await runOcrPass(prepared, asset.imageData, language);
          if (result.reliable) {
            parsed = result;
            break;
          }
        } catch (error) {
          lastError = error;
          console.error(`OCR ${language} pass failed`, error);
        }
      }

      if (!parsed && lastError) throw lastError;
      if (parsed?.reliable) {
        const { recognizedName, words } = parsed;
        const actions = [];
        if (asset.autoNameFromText) {
          asset.name = recognizedName;
          actions.push(`命名为“${recognizedName}”`);
        }
        if (asset.removeRecognizedText && words.length > 0) {
          asset.imageData = removeRecognizedWordsFromImage(asset.imageData, words, prepared.scale);
          asset.thumbnail = makeThumbnail(asset.imageData);
          asset.previewImageData = null;
          actions.push("删除图片文字");
        } else if (asset.removeRecognizedText) {
          actions.push("识别到文字，但未取得可靠文字位置，未执行删除");
        }
        setStatus(`文字识别完成：${actions.length ? actions.join("，") : `识别到“${recognizedName}”`}。`);
      } else {
        setStatus("未识别到与主体分隔的清晰文本，已保留默认名称。");
      }
    } catch (error) {
      console.error("OCR processing failed", error);
      setStatus(`文字识别失败：${describeOcrError(error)}。素材已保留原状态。`);
    } finally {
      asset.recognizing = false;
      if (assetLibrary.includes(asset)) {
        syncRecognizedAssetView(asset);
      }
    }
  });
}

async function testOcrRuntime() {
  if (!ocrSelfTestBtn) return;
  ocrSelfTestBtn.disabled = true;
  const originalText = ocrSelfTestBtn.textContent;
  ocrSelfTestBtn.textContent = "检测中…";
  try {
    ensureOcrRuntimeAvailable();
    const requiredUrls = [
      "vendor/tesseract.min.js",
      "vendor/worker.min.js",
      "vendor/tesseract-core/tesseract-core-lstm.wasm.js",
      "vendor/tesseract-core/tesseract-core-lstm.wasm",
      "vendor/tessdata/eng.traineddata.gz"
    ].map((relative) => new URL(relative, window.location.href).href);
    for (const url of requiredUrls) {
      const response = await withTimeout(fetch(url, { cache: "no-store" }), 15000, `资源加载超时：${url.split("/").pop()}`);
      if (!response.ok) throw new Error(`资源加载失败：${url.split("/").pop()}（HTTP ${response.status}）`);
    }
    await withTimeout(getOcrWorker("eng"), OCR_INIT_TIMEOUT_MS, "英文 OCR 初始化超时");
    setStatus("OCR 检测通过：主程序、Worker、WASM 核心和英文语言包均可正常加载。");
  } catch (error) {
    console.error("OCR self-test failed", error);
    setStatus(`OCR 检测失败：${describeOcrError(error)}。`);
  } finally {
    ocrSelfTestBtn.disabled = false;
    ocrSelfTestBtn.textContent = originalText;
  }
}

function repairWorkspaceAfterAssetRemoval() {
  pruneWorkspaceTabs();
  if (activeLibraryTarget && !assetLibrary.includes(activeLibraryTarget)) activeLibraryTarget = null;
  if (activeWorkspaceTabId) {
    const activeTab = workspaceTabs.find((tab) => tab.id === activeWorkspaceTabId);
    if (activeTab) {
      activateWorkspaceTab(activeTab);
      return;
    }
    activeWorkspaceTabId = '';
  }
  if (activeLibraryTarget && assetLibrary.includes(activeLibraryTarget)) {
    activateProcessedAsset(activeLibraryTarget, { scrollToLatest: false });
    return;
  }
  if (assetLibrary.length) {
    activateProcessedAsset(assetLibrary[Math.max(0, assetLibrary.length - 1)], { scrollToLatest: false });
    return;
  }
  clearImageWorkspace();
  renderWorkspaceTabs();
  setButtons();
}

function deleteSelectedAssets() {
  const selected = assetLibrary.filter((asset) => asset.selected);
  const targets = selected.length ? selected : (activeLibraryTarget ? [activeLibraryTarget] : []);
  if (!targets.length) return;
  pushHistory();
  const deleted = new Set(targets);
  assetLibrary = assetLibrary.filter((asset) => !deleted.has(asset));
  librarySelectionAnchor.result = -1;
  libraryBatchSelectionMode.result = assetLibrary.filter((asset) => asset.selected).length > 1;
  workspaceTabs = workspaceTabs.filter((tab) => !deleted.has(tab.target));
  if (deleted.has(activeLibraryTarget)) {
    activeLibraryTarget = null;
    activeWorkspaceTabId = "";
  }
  repairWorkspaceAfterAssetRemoval();
  renderAssetList();
  renderWorkspaceTabs();
  setButtons();
  setStatus(`已删除 ${targets.length} 个处理结果。`);
}

function removeUnselectedAssets() {
  const kept = assetLibrary.filter((asset) => asset.selected);
  if (kept.length === 0) {
    setStatus("请先选中需要保留的处理结果。");
    return;
  }
  if (kept.length === assetLibrary.length) {
    setStatus("当前全部处理结果均已选中，没有可移除的非选定项。");
    return;
  }

  pushHistory();
  const removed = new Set(assetLibrary.filter((asset) => !asset.selected));
  const activeWasRemoved = removed.has(activeLibraryTarget);
  assetLibrary = kept;
  workspaceTabs = workspaceTabs.filter((tab) => !removed.has(tab.target));
  librarySelectionAnchor.result = assetLibrary.findIndex((asset) => asset.selected);
  libraryBatchSelectionMode.result = assetLibrary.length > 1;

  if (activeWasRemoved) {
    activeLibraryTarget = null;
    activeWorkspaceTabId = "";
  }

  repairWorkspaceAfterAssetRemoval();
  renderAssetList();
  renderWorkspaceTabs();
  setButtons();
  setStatus(`已移除 ${removed.size} 个非选定项，保留 ${assetLibrary.length} 个处理结果。`);
}

async function exportAssetsZip() {
  const selected = assetLibrary.filter((asset) => asset.selected);
  if (selected.length === 0) {
    setStatus("请先选择要批量导出的素材。");
    return;
  }

  setStatus(`正在打包 ${selected.length} 个${exportGreenScreen?.checked ? "绿幕" : "透明"} PNG 素材...`);
  const entries = [];
  const usedNames = new Set();
  for (let index = 0; index < selected.length; index += 1) {
    const asset = selected[index];
    const baseName = (asset.name || `素材-${index + 1}`)
      .replace(/\.png$/i, "")
      .replace(/[\\/:*?"<>|]/g, "_");
    if (!asset.imageData || asset.imageData.width < 1 || asset.imageData.height < 1) continue;
    entries.push({
      name: uniqueEntryName(`${baseName || `素材-${index + 1}`}.png`, usedNames),
      bytes: await pngBytesFor(asset.imageData)
    });
    if (index % 10 === 0) {
      setStatus(`正在打包 ${index + 1}/${selected.length}...`);
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    }
  }

  if (entries.length === 0) {
    setStatus("选中的素材没有可导出的有效图片。");
    return;
  }
  await downloadBlob("extracted-assets.zip", makeZip(entries));
  finishExportSuccess(`${entries.length} 个选中素材已保存。`);
}



function normalizeFramesToSameTileSize(frames) {
  if (frames.length === 0) return frames;
  const maxWidth = Math.max(...frames.map((frame) => frame.imageData.width));
  const maxHeight = Math.max(...frames.map((frame) => frame.imageData.height));
  return frames.map((frame) => {
    const dx = Math.floor((maxWidth - frame.imageData.width) / 2);
    const dy = Math.floor((maxHeight - frame.imageData.height) / 2);
    const normalized = drawImageDataOnCanvas(frame.imageData, maxWidth, maxHeight, dx, dy);
    return {
      ...frame,
      imageData: normalized,
      thumbnail: makeThumbnail(normalized)
    };
  });
}

function colorKey(r, g, b) {
  return `${Math.round(r / 8) * 8},${Math.round(g / 8) * 8},${Math.round(b / 8) * 8}`;
}

function colorStats(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return {
    luma: 0.2126 * r + 0.7152 * g + 0.0722 * b,
    saturation: max === 0 ? 0 : (max - min) / max
  };
}

function detectBackgroundKeys(imageData) {
  const { width, height, data } = imageData;
  const counts = new Map();
  const sample = (x, y) => {
    const index = (y * width + x) * 4;
    const key = colorKey(data[index], data[index + 1], data[index + 2]);
    counts.set(key, (counts.get(key) || 0) + 1);
  };

  const step = Math.max(1, Math.floor(Math.min(width, height) / 80));
  for (let x = 0; x < width; x += step) {
    sample(x, 0);
    sample(x, height - 1);
  }
  for (let y = 0; y < height; y += step) {
    sample(0, y);
    sample(width - 1, y);
  }

  return new Set([...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key]) => key));
}

function isLikelySubjectPixel(data, index, backgroundKeys) {
  if (data[index + 3] <= 2) return false;
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const stats = colorStats(r, g, b);
  if (backgroundKeys.has(colorKey(r, g, b)) && stats.luma > 150 && stats.saturation < 0.22) return false;
  return true;
}

function isTransparentAutoExtractEnabled() {
  return Boolean(transparentAutoExtract?.checked);
}

function buildAlphaSubjectMask(imageData, alphaLimit = 0) {
  const { data } = imageData;
  const mask = new Uint8Array(imageData.width * imageData.height);
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    if (data[pixel * 4 + 3] > alphaLimit) mask[pixel] = 1;
  }
  return mask;
}

function buildAutoExtractSubjectMask(imageData, backgroundKeys) {
  const { width, height, data } = imageData;
  const pixelCount = width * height;
  const baseMask = new Uint8Array(pixelCount);
  const mask = new Uint8Array(pixelCount);
  const pixelIndex = (x, y) => y * width + x;

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const index = pixel * 4;
    if (isLikelySubjectPixel(data, index, backgroundKeys)) {
      baseMask[pixel] = 1;
      mask[pixel] = 1;
    }
  }

  const countBaseNeighbors = (x, y, radius) => {
    let count = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        if (baseMask[pixelIndex(nx, ny)]) count += 1;
      }
    }
    return count;
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = pixelIndex(x, y);
      if (mask[pixel]) continue;
      const index = pixel * 4;
      if (data[index + 3] <= 2) continue;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const stats = colorStats(r, g, b);
      const backgroundLike = backgroundKeys.has(colorKey(r, g, b)) && stats.luma > 150 && stats.saturation < 0.22;
      if (!backgroundLike) continue;

      const nearTight = countBaseNeighbors(x, y, 1);
      const nearWide = countBaseNeighbors(x, y, 2);
      if (nearTight >= 2 || nearWide >= 5) {
        mask[pixel] = 1;
      }
    }
  }

  return mask;
}

function extractSubjectComponents(imageData) {
  const { width, height, data } = imageData;
  const mask = isTransparentAutoExtractEnabled()
    ? buildAlphaSubjectMask(imageData, 0)
    : buildAutoExtractSubjectMask(imageData, detectBackgroundKeys(imageData));
  const visited = new Uint8Array(width * height);

  const components = [];
  const minArea = Math.max(40, Math.floor(width * height * 0.00012));
  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || visited[start]) continue;
    const queue = [start];
    visited[start] = 1;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    let area = 0;

    for (let head = 0; head < queue.length; head += 1) {
      const pixel = queue[head];
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      area += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      const neighbors = [
        x > 0 ? pixel - 1 : -1,
        x < width - 1 ? pixel + 1 : -1,
        y > 0 ? pixel - width : -1,
        y < height - 1 ? pixel + width : -1
      ];
      for (const nextPixel of neighbors) {
        if (nextPixel < 0 || visited[nextPixel] || !mask[nextPixel]) continue;
        visited[nextPixel] = 1;
        queue.push(nextPixel);
      }
    }

    const boxWidth = maxX - minX + 1;
    const boxHeight = maxY - minY + 1;
    if (area >= minArea && boxWidth >= 8 && boxHeight >= 8) {
      components.push({ x: minX, y: minY, width: boxWidth, height: boxHeight, area });
    }
  }

  return components.sort((a, b) => (a.y - b.y) || (a.x - b.x));
}

function transparentCropFromComponent(imageData, component) {
  const padding = 2;
  const selection = {
    x: Math.max(0, component.x - padding),
    y: Math.max(0, component.y - padding),
    width: Math.min(imageData.width - Math.max(0, component.x - padding), component.width + padding * 2),
    height: Math.min(imageData.height - Math.max(0, component.y - padding), component.height + padding * 2)
  };
  const cropped = cropImageData(imageData, selection);
  if (isTransparentAutoExtractEnabled()) {
    return trimTransparentImageData(cropped, 0);
  }
  const backgroundKeys = detectBackgroundKeys(imageData);
  const keepMask = buildAutoExtractSubjectMask(cropped, backgroundKeys);
  for (let pixel = 0; pixel < keepMask.length; pixel += 1) {
    if (!keepMask[pixel]) {
      cropped.data[pixel * 4 + 3] = 0;
    }
  }
  return trimTransparentImageData(removeAutoExtractEdgeArtifacts(trimTransparentImageData(cropped, 2)), 2);
}



function cropSelectionForImageData(imageData, selection) {
  const x = Math.max(0, Math.min(imageData.width - 1, Math.floor(selection.x)));
  const y = Math.max(0, Math.min(imageData.height - 1, Math.floor(selection.y)));
  const width = Math.min(imageData.width - x, Math.floor(selection.width));
  const height = Math.min(imageData.height - y, Math.floor(selection.height));
  return { x, y, width, height };
}

function cropFrames(selection, message) {
  const targets = targetFrames();
  if (targets.length === 0) return false;
  pushHistory();
  const changed = [];
  targets.forEach((frame) => {
    const frameSelection = cropSelectionForImageData(frame.imageData, selection);
    if (frameSelection.width < 4 || frameSelection.height < 4) return;
    const greenFill = dominantSelectionOutsideColor(frame.imageData, frameSelection);
    frame.imageData = finalizeCroppedImageData(cropImageData(frame.imageData, frameSelection), greenFill);
    invalidateFullResolutionSource(frame);
    changed.push(frame);
  });
  if (changed.length === 0) {
    setStatus("裁剪区域太小，请重新设置。");
    return true;
  }
  refreshFrameEditPreview(changed, message);
  return true;
}

function cropFramesByLasso(message) {
  const targets = targetFrames();
  if (targets.length === 0) return false;
  pushHistory();
  const changed = [];
  targets.forEach((frame) => {
    const cropped = cropLassoImageData(frame.imageData);
    if (!cropped) return;
    const greenFill = dominantSelectionOutsideColor(frame.imageData, lassoBoundsForImage(frame.imageData));
    frame.imageData = finalizeCroppedImageData(cropped, greenFill);
    invalidateFullResolutionSource(frame);
    changed.push(frame);
  });
  if (changed.length === 0) {
    setStatus("自由选区太小，请重新圈选。");
    return true;
  }
  refreshFrameEditPreview(changed, message);
  return true;
}

function cropItems(selection, message) {
  const records = sourceRecordsForProcessing();
  if (!records.length) return;
  createResultsFromRecords(records, (imageData) => {
    const itemSelection = cropSelectionForImageData(imageData, selection);
    if (itemSelection.width < 4 || itemSelection.height < 4) return null;
    const fill = dominantSelectionOutsideColor(imageData, itemSelection);
    return finalizeCroppedImageData(cropImageData(imageData, itemSelection), fill);
  }, "crop", message);
}

function cropItemsByLasso(message) {
  const records = sourceRecordsForProcessing();
  if (!records.length) return false;
  const created = createResultsFromRecords(records, (imageData) => {
    const cropped = cropLassoImageData(imageData);
    if (!cropped) return null;
    return finalizeCroppedImageData(cropped, dominantSelectionOutsideColor(imageData, lassoBoundsForImage(imageData)));
  }, "crop", message);
  return created.length > 0;
}

function centerCrop() {
  const width = Math.floor(Number(cropWidth.value));
  const height = Math.floor(Number(cropHeight.value));
  if (!width || !height || width < 1 || height < 1) {
    setStatus("请输入有效的裁剪宽高。");
    return;
  }
  if (processingSource === "sequence") {
    const frames = targetFrames();
    if (!frames.length) return;
    pushHistory();
    frames.forEach((frame) => {
      const selection = {
        x: Math.floor((frame.imageData.width - Math.min(width, frame.imageData.width)) / 2),
        y: Math.floor((frame.imageData.height - Math.min(height, frame.imageData.height)) / 2),
        width: Math.min(width, frame.imageData.width),
        height: Math.min(height, frame.imageData.height)
      };
      frame.imageData = cropImageData(frame.imageData, selection);
      invalidateFullResolutionSource(frame);
    });
    refreshFrameEditPreview(frames, `已将序列帧居中裁剪为 ${width}×${height}`);
    return;
  }
  const records = sourceRecordsForProcessing();
  createResultsFromRecords(records, (imageData) => {
    const selection = {
      x: Math.floor((imageData.width - Math.min(width, imageData.width)) / 2),
      y: Math.floor((imageData.height - Math.min(height, imageData.height)) / 2),
      width: Math.min(width, imageData.width),
      height: Math.min(height, imageData.height)
    };
    return cropImageData(imageData, selection);
  }, "crop", `已居中裁剪为 ${width}×${height}`);
}

function showResultMode() {
  showOriginal = false;
  resultTab.classList.add("active");
  originalTab.classList.remove("active");
}

function renderLivePreviewImageData(imageData) {
  if (!imageData) return;
  if (canvas.width !== imageData.width || canvas.height !== imageData.height) {
    currentImageData = imageData;
    renderCanvas();
    return;
  }
  drawImageData(imageData);
  canvas.classList.add("ready");
  selectionCanvas.classList.add("ready");
  emptyState.hidden = true;
  updateSelectionCanvas();
}

function renderFastLivePreview(imageData, targetWidth, targetHeight) {
  if (!imageData) return;
  const dimensionsChanged = canvas.width !== targetWidth || canvas.height !== targetHeight;
  if (dimensionsChanged) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    selectionCanvas.width = targetWidth;
    selectionCanvas.height = targetHeight;
  }
  const proxy = document.createElement("canvas");
  proxy.width = imageData.width;
  proxy.height = imageData.height;
  proxy.getContext("2d").putImageData(imageData, 0, 0);
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "medium";
  ctx.drawImage(proxy, 0, 0, targetWidth, targetHeight);
  canvas.classList.add("ready");
  selectionCanvas.classList.add("ready");
  emptyState.hidden = true;
  if (dimensionsChanged) fitCanvas();
  updateSelectionCanvas();
}

async function refreshLivePreview(announce = false, options = {}) {
  if (!liveBaseImageData || pickedColors.length === 0) return;
  if (previewJobBusy) {
    pendingLivePreview = options.fast ? "fast" : "full";
    return;
  }
  const token = ++previewJobToken;
  previewJobBusy = true;
  const fast = options.fast === true && liveBaseImageData.width * liveBaseImageData.height > livePreviewFastPixelLimit;
  try {
    await yieldToBrowser(0);
    if (token !== previewJobToken) return;
    const previewBase = fast ? getLivePreviewProxy(liveBaseImageData) : liveBaseImageData;
    const next = buildCutoutFromBase(previewBase, { previewOnly: true, useLiveCache: true });
    if (token !== previewJobToken) return;
    showResultMode();
    if (fast) {
      livePreviewFastImageData = next;
      renderFastLivePreview(next, liveBaseImageData.width, liveBaseImageData.height);
    } else {
      currentImageData = next;
      livePreviewFullBase = liveBaseImageData;
      livePreviewFullKey = livePreviewSettingsKey();
      livePreviewFullImageData = next;
      renderLivePreviewImageData(next);
    }
    setButtons();
    if (announce && !fast) setStatus("抠图预览已更新。点击“保存抠图结果”才会写入处理结果库。");
  } finally {
    previewJobBusy = false;
    if (pendingLivePreview) {
      const pendingMode = pendingLivePreview;
      pendingLivePreview = false;
      scheduleLivePreview({ fast: pendingMode === "fast", announce: pendingMode !== "fast" });
    }
  }
}

function ensureLivePreviewBase() {
  if (liveBaseImageData) return true;
  if (pickedColors.length === 0) return false;
  const baseImageData = currentImageData || originalImageData;
  if (!baseImageData) return false;
  pushHistory();
  liveBaseImageData = cloneImageData(baseImageData);
  livePreviewSourceTarget = currentSourceRecord()?.target || selectedFrame() || activeLibraryTarget || null;
  invalidateLiveDistanceCache({ keepTarget: true });
  return true;
}

function scheduleLivePreview(options = {}) {
  updateRangeLabels();
  if (!ensureLivePreviewBase()) return;
  const fast = options.fast === true;
  const announce = options.announce === true;
  window.clearTimeout(liveRenderTimer);
  liveRenderTimer = window.setTimeout(
    () => refreshLivePreview(announce, { fast }),
    fast ? 0 : livePreviewDelayMs
  );

  // 大图始终使用缩略代理做交互预览，完整像素只在“保存抠图结果”时计算。
  // 否则每次松开滑块都来一次百万像素连通域扫描，网页自然会表演假死。
  window.clearTimeout(livePreviewFullTimer);
}

function setOperationBusyState(busy, message = "正在处理…", options = {}) {
  operationBusy = Boolean(busy);
  if (operationBusyText) operationBusyText.textContent = message;
  const showOverlay = operationBusy && options.overlay !== false;
  if (operationBusyOverlay) operationBusyOverlay.hidden = !showOverlay;
  document.body.classList.toggle("operation-busy-active", showOverlay);
  setButtons();
}

function currentCutoutRecipeValue() {
  return {
    colors: pickedColors.map(({ r, g, b }) => ({ r, g, b })),
    tolerance: Number(tolerance.value),
    softness: Number(softness.value),
    contiguous: Boolean(contiguous.checked),
    forceRemove: Boolean(forceRemoveColor?.checked)
  };
}

async function removeColors() {
  if (pickedColors.length === 0 || operationBusy) return;

  window.clearTimeout(liveRenderTimer);
  window.clearTimeout(livePreviewFullTimer);
  pendingLivePreview = false;
  previewJobToken += 1;

  const frameTargets = processingSource === "sequence" ? targetFrames() : [];
  const records = processingSource === "sequence" ? [] : sourceRecordsForProcessing();
  const targetCount = frameTargets.length || records.length;
  if (!targetCount) return;
  const fullResolutionCutoutValue = currentCutoutRecipeValue();
  const cachedPreviewReady = Boolean(
    livePreviewFullImageData
    && livePreviewFullBase === liveBaseImageData
    && livePreviewFullKey === livePreviewSettingsKey()
  );
  const showOverlay = targetCount > 1 || !cachedPreviewReady;
  setOperationBusyState(true, "正在保存抠图结果…", { overlay: showOverlay });
  if (showOverlay) await yieldToBrowser(0);

  try {
    if (processingSource === "sequence") {
      pushHistory();
      for (let index = 0; index < frameTargets.length; index += 1) {
        const frame = frameTargets[index];
        setStatus(`正在处理序列帧 ${index + 1}/${frameTargets.length}…`);
        const canReuse = frameTargets.length === 1
          && frame === livePreviewSourceTarget
          && cachedPreviewReady;
        frame.imageData = canReuse
          ? cloneImageData(livePreviewFullImageData)
          : await buildCutoutForCommit(frame.imageData);
        appendFullResolutionRecipe(frame, "cutout", fullResolutionCutoutValue);
        frame.thumbnail = makeThumbnail(frame.imageData);
        if (frameTargets.length > 1) await yieldToBrowser(0);
      }
      liveBaseImageData = null;
      invalidateLiveDistanceCache();
      refreshFrameEditPreview(frameTargets, "已保存序列帧抠图结果");
      return;
    }

    pushHistory();
    const created = [];
    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      if (records.length > 1) setStatus(`正在保存抠图结果 ${index + 1}/${records.length}…`);
      const canReuse = records.length === 1
        && record.target === livePreviewSourceTarget
        && cachedPreviewReady;
      const next = canReuse
        ? cloneImageData(livePreviewFullImageData)
        : await buildCutoutForCommit(record.imageData);
      const previewImageData = records.length === 1 && record.target === livePreviewSourceTarget
        ? livePreviewFastImageData
        : null;
      const asset = addProcessedAsset(next, record.name, "cutout", {
        sourceKind: record.kind,
        pixelatedPreview: Boolean(record.pixelatedPreview),
        previewImageData,
        deferThumbnail: true,
        takeOwnership: true,
        ...derivedFullResolutionOptions(record, "cutout", fullResolutionCutoutValue)
      });
      if (asset) created.push(asset);
      if (records.length > 1) await yieldToBrowser(0);
    }

    if (created.length > 0) activateProcessedAsset(created[created.length - 1]);
    cropSelection = null;
    hideCropBox();
    clearLassoSelection();
    renderImageList();
    renderAssetList(true);
    liveBaseImageData = null;
    pickedColors = [];
    invalidateLiveDistanceCache();
    renderSwatches();
    const queuedRecognition = queueAssetsTextRecognition(created);
    setStatus(`抠图结果已保存到处理结果库${created.length > 1 ? `，共生成 ${created.length} 个结果。` : "。"}${queuedRecognition > 0 ? " 正在执行文字识别处理。" : ""}`);
  } catch (error) {
    console.error("Background removal failed", error);
    setStatus(`保存抠图结果失败：${error?.message || "未知错误"}`);
  } finally {
    setOperationBusyState(false);
  }
}

function undo() {
  if (history.length === 0) return;
  pushBoundedState(redoStack, snapshotState(), maxRedoStates);
  restoreState(history.pop());
  renderRestoredState();
  setStatus("已撤销上一步。");
}

function redo() {
  if (redoStack.length === 0) return;
  pushBoundedState(history, snapshotState(), maxHistoryStates);
  restoreState(redoStack.pop());
  renderRestoredState();
  setStatus("已恢复撤销的操作。");
}

function reset() {
  if (processingSource === "sequence" && activeFrameIndex >= 0) {
    currentImageData = cloneImageData(sequenceFrames[activeFrameIndex].imageData);
    originalImageData = cloneImageData(sequenceFrames[activeFrameIndex].imageData);
    renderPreviewImageData(currentImageData);
  } else {
    const record = currentSourceRecord();
    if (!record) return;
    currentImageData = cloneImageData(record.imageData);
    originalImageData = cloneImageData(record.imageData);
    renderCanvas();
  }
  liveBaseImageData = null;
  pickedColors = [];
  cropSelection = null;
  hideCropBox();
  clearLassoSelection();
  renderSwatches();
  setButtons();
  setStatus("已还原画布预览，来源图片未被修改。");
}

function clampExportDimension(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(1, Math.min(4096, Math.round(number)));
}

function currentExportSize(imageData) {
  const preset = exportSizePreset?.value || "original";
  const keepPadding = exportKeepPadding?.checked !== false;
  if (preset === "original") {
    return {
      width: imageData.width,
      height: imageData.height,
      original: true,
      keepPadding
    };
  }
  if (preset === "custom") {
    return {
      width: clampExportDimension(exportWidth?.value, imageData.width),
      height: clampExportDimension(exportHeight?.value, imageData.height),
      original: false,
      keepPadding
    };
  }
  const size = clampExportDimension(preset, imageData.width);
  return { width: size, height: size, original: false, keepPadding };
}

function updateExportSizeControls() {
  if (!exportSizePreset || !exportCustomSize) return;
  exportCustomSize.classList.toggle("active", exportSizePreset.value === "custom");
}

function drawCanvasHighQuality(sourceCanvas, targetWidth, targetHeight) {
  let current = sourceCanvas;
  while (current.width * 0.5 > targetWidth && current.height * 0.5 > targetHeight) {
    const step = document.createElement("canvas");
    step.width = Math.max(targetWidth, Math.round(current.width * 0.5));
    step.height = Math.max(targetHeight, Math.round(current.height * 0.5));
    const stepCtx = step.getContext("2d");
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = "high";
    stepCtx.clearRect(0, 0, step.width, step.height);
    stepCtx.drawImage(current, 0, 0, step.width, step.height);
    current = step;
  }

  if (current.width === targetWidth && current.height === targetHeight) return current;

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = targetWidth;
  finalCanvas.height = targetHeight;
  const finalCtx = finalCanvas.getContext("2d");
  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = "high";
  finalCtx.clearRect(0, 0, targetWidth, targetHeight);
  finalCtx.drawImage(current, 0, 0, targetWidth, targetHeight);
  return finalCanvas;
}

function applyExportGreenScreen(sourceCanvas, options = {}) {
  if (options.skipGreenScreen || !exportGreenScreen?.checked) return sourceCanvas;
  const output = document.createElement("canvas");
  output.width = sourceCanvas.width;
  output.height = sourceCanvas.height;
  const outputCtx = output.getContext("2d");
  outputCtx.fillStyle = "#00ff00";
  outputCtx.fillRect(0, 0, output.width, output.height);
  outputCtx.drawImage(sourceCanvas, 0, 0);
  return output;
}

function exportCanvasFor(imageData, options = {}) {
  const size = currentExportSize(imageData);
  if (size.original || (size.keepPadding && size.width === imageData.width && size.height === imageData.height)) {
    return applyExportGreenScreen(imageDataCanvas(imageData), options);
  }

  const sourceImageData = size.keepPadding
    ? imageData
    : croppedImageData(imageData, subjectAlphaBounds(imageData, 8), 0);
  const source = imageDataCanvas(sourceImageData);
  const scale = size.keepPadding
    ? Math.min(size.width / sourceImageData.width, size.height / sourceImageData.height)
    : Math.min(size.width / sourceImageData.width, size.height / sourceImageData.height);
  const drawWidth = Math.max(1, Math.round(sourceImageData.width * scale));
  const drawHeight = Math.max(1, Math.round(sourceImageData.height * scale));
  const scaled = drawCanvasHighQuality(source, drawWidth, drawHeight);
  const output = document.createElement("canvas");
  output.width = size.width;
  output.height = size.height;
  const outputCtx = output.getContext("2d");
  outputCtx.imageSmoothingEnabled = true;
  outputCtx.imageSmoothingQuality = "high";
  outputCtx.clearRect(0, 0, output.width, output.height);
  outputCtx.drawImage(
    scaled,
    Math.floor((output.width - drawWidth) / 2),
    Math.floor((output.height - drawHeight) / 2)
  );
  return applyExportGreenScreen(output, options);
}

function exportSizeSuffix(imageData) {
  const size = currentExportSize(imageData);
  return size.original ? "" : `-${size.width}x${size.height}`;
}

function canvasDataUrlFor(imageData) {
  return exportCanvasFor(imageData).toDataURL("image/png");
}

async function pngBytesFor(imageData) {
  const response = await fetch(canvasDataUrlFor(imageData));
  return new Uint8Array(await response.arrayBuffer());
}

function fallbackDownloadDataUrl(name, dataUrl) {
  const link = document.createElement("a");
  link.download = name;
  link.href = dataUrl;
  link.click();
}

function fallbackDownloadBlob(name, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeExportName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_");
}

function uniqueEntryName(name, usedNames) {
  const safeName = safeExportName(String(name || "asset.png").normalize("NFC")) || "asset.png";
  const dotIndex = safeName.lastIndexOf(".");
  const base = dotIndex > 0 ? safeName.slice(0, dotIndex) : safeName;
  const extension = dotIndex > 0 ? safeName.slice(dotIndex) : "";
  let candidate = safeName;
  let number = 2;
  while (usedNames.has(candidate.toLowerCase())) {
    candidate = `${base}-${number}${extension}`;
    number += 1;
  }
  usedNames.add(candidate.toLowerCase());
  return candidate;
}

function timestampedExportName(name) {
  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const extension = dotIndex > 0 ? name.slice(dotIndex) : "";
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
  return `${base}-${stamp}${extension}`;
}

function withExportSizeSuffix(name, imageData) {
  const suffix = exportSizeSuffix(imageData);
  if (!suffix) return name;
  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const extension = dotIndex > 0 ? name.slice(dotIndex) : ".png";
  return `${base}${suffix}${extension}`;
}

async function uniqueDirectoryFileName(name) {
  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const extension = dotIndex > 0 ? name.slice(dotIndex) : "";
  let candidate = name;
  let number = 2;
  while (true) {
    try {
      await exportDirectoryHandle.getFileHandle(candidate);
      candidate = `${base}-${number}${extension}`;
      number += 1;
    } catch (error) {
      if (error?.name === "NotFoundError") return candidate;
      throw error;
    }
  }
}

async function saveBlobToExportLocation(name, blob, useFallback = true) {
  let safeName = safeExportName(name);
  const avoidOverwrite = safeName.toLowerCase().endsWith(".zip");
  if (!exportDirectoryHandle) {
    fallbackDownloadBlob(avoidOverwrite ? timestampedExportName(safeName) : safeName, blob);
    return;
  }

  try {
    let permission = await exportDirectoryHandle.queryPermission({ mode: "readwrite" });
    if (permission !== "granted") {
      permission = await exportDirectoryHandle.requestPermission({ mode: "readwrite" });
    }
    if (permission !== "granted") throw new Error("export permission denied");
    if (avoidOverwrite) {
      safeName = await uniqueDirectoryFileName(safeName);
    }
    const fileHandle = await exportDirectoryHandle.getFileHandle(safeName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (error) {
    if (!useFallback) throw error;
    fallbackDownloadBlob(avoidOverwrite ? timestampedExportName(safeName) : safeName, blob);
    setStatus("无法写入所选导出位置，已改用默认下载。");
  }
}

async function downloadDataUrl(name, dataUrl) {
  if (!exportDirectoryHandle) {
    fallbackDownloadDataUrl(safeExportName(name), dataUrl);
    return;
  }
  const response = await fetch(dataUrl);
  await saveBlobToExportLocation(name, await response.blob());
}

async function downloadBlob(name, blob) {
  await saveBlobToExportLocation(name, blob);
}

async function chooseExportLocation() {
  if (!window.showDirectoryPicker) {
    setStatus("当前浏览器不支持选择导出文件夹，将继续使用默认下载位置。");
    return;
  }
  try {
    exportDirectoryHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    exportLocationName.value = exportDirectoryHandle.name;
    exportLocationName.title = `当前导出位置：${exportDirectoryHandle.name}`;
    await saveExportDirectoryHandle(exportDirectoryHandle);
    setButtons();
    setStatus(`导出位置已设置为“${exportDirectoryHandle.name}”。`);
  } catch (error) {
    if (error?.name !== "AbortError") {
      setStatus("无法选择导出位置，将继续使用默认下载位置。");
    }
  }
}

async function clearExportLocation() {
  exportDirectoryHandle = null;
  await removeSavedExportDirectoryHandle();
  exportLocationName.value = "默认下载文件夹";
  exportLocationName.title = "当前导出位置";
  setButtons();
  setStatus("已恢复使用浏览器默认下载位置。");
}

function stripExportExtension(name) {
  return String(name || "").trim().replace(/\.(png|jpe?g|webp|gif|bmp|zip)$/i, "");
}

function defaultExportBaseName() {
  const items = currentExportItems();
  if (processingSource === "sequence") return "sequence";
  if (items.length === 1) return stripExportExtension(items[0].name) || "image";
  if (processingSource === "result") return "processed-results";
  return "selected-images";
}

function requestedExportBaseName() {
  const typed = stripExportExtension(exportBaseName?.value);
  const fallback = defaultExportBaseName();
  return safeExportName(typed || fallback || "export").replace(/^[. ]+|[. ]+$/g, "") || "export";
}

function prepareExportRenameStep(options = {}) {
  if (!exportBaseName) return;
  const suggested = defaultExportBaseName();
  if (options.force || !exportBaseName.value.trim() || exportBaseName.dataset.autofill === "true") {
    exportBaseName.value = suggested;
    exportBaseName.dataset.autofill = "true";
  }
  window.setTimeout(() => {
    exportBaseName.focus();
    exportBaseName.select();
  }, 0);
}

function applyExportRename(items) {
  const baseName = requestedExportBaseName();
  if (processingSource === "sequence") {
    return items.map((item, index) => ({
      ...item,
      name: `${baseName}-${String(index + 1).padStart(4, "0")}.png`
    }));
  }
  if (items.length === 1) return [{ ...items[0], name: `${baseName}.png` }];
  return items.map((item, index) => ({
    ...item,
    name: `${baseName}-${String(index + 1).padStart(4, "0")}.png`
  }));
}

function currentExportItems() {
  if (processingSource === "sequence") {
    return chosenSequenceFrames().map(({ frame, index }) => ({
      name: `${frame.name || "frame"}-${String(index + 1).padStart(4, "0")}.png`,
      imageData: frame.imageData,
      fullResolutionSource: frame.fullResolutionSource || null,
      fullResolutionPipeline: cloneFullResolutionPipeline(frame.fullResolutionPipeline)
    }));
  }
  if (processingSource === "result") {
    return selectedOrActiveAssets().filter((asset) => asset?.imageData).map((asset, index) => ({
      name: `${asset.name || `result-${index + 1}`}.png`,
      imageData: asset.imageData,
      fullResolutionSource: asset.fullResolutionSource || null,
      fullResolutionPipeline: cloneFullResolutionPipeline(asset.fullResolutionPipeline)
    }));
  }
  return selectedOrActiveOriginals().map((item, index) => ({
    name: `${item.name || `image-${index + 1}`}`.replace(/\.(png|jpe?g|webp|gif|bmp)$/i, "") + ".png",
    imageData: item.currentImageData || item.originalImageData,
    fullResolutionSource: item.fullResolutionSource || null,
    fullResolutionPipeline: cloneFullResolutionPipeline(item.fullResolutionPipeline)
  })).filter((item) => item.imageData);
}

function exportNeedsFullResolution(item) {
  if (!item?.fullResolutionSource) return false;
  const preset = exportSizePreset?.value || "original";
  if (preset === "original") return true;
  const requestedWidth = preset === "custom" ? Number(exportWidth?.value) : Number(preset);
  const requestedHeight = preset === "custom" ? Number(exportHeight?.value) : Number(preset);
  return requestedWidth > item.imageData.width || requestedHeight > item.imageData.height;
}

async function materializeExportItem(item) {
  if (!exportNeedsFullResolution(item)) return item;
  setStatus(`正在按需解码“${item.name}”的完整原图…`);
  try {
    let imageData = await materializeFullResolution(item.fullResolutionSource);
    if (!imageData) return item;
    for (const recipe of cloneFullResolutionPipeline(item.fullResolutionPipeline)) {
      if (recipe.kind === "cutout") {
        const settings = recipe.value || {};
        const saved = {
          pickedColors,
          tolerance: tolerance.value,
          softness: softness.value,
          contiguous: contiguous.checked,
          forceRemove: forceRemoveColor?.checked
        };
        try {
          pickedColors = (settings.colors || []).map((color) => ({ ...color }));
          tolerance.value = String(settings.tolerance ?? tolerance.value);
          softness.value = String(settings.softness ?? softness.value);
          contiguous.checked = Boolean(settings.contiguous);
          if (forceRemoveColor) forceRemoveColor.checked = Boolean(settings.forceRemove);
          imageData = buildCutoutFromBase(imageData);
        } finally {
          pickedColors = saved.pickedColors;
          tolerance.value = saved.tolerance;
          softness.value = saved.softness;
          contiguous.checked = saved.contiguous;
          if (forceRemoveColor) forceRemoveColor.checked = saved.forceRemove;
        }
      } else {
        let recipeValue = recipe.value;
        if (recipe.kind === "outline" && recipeValue?.size && item.fullResolutionSource?.proxyWidth) {
          const scaleRatio = imageData.width / item.fullResolutionSource.proxyWidth;
          recipeValue = {
            ...recipeValue,
            size: Math.max(1, Math.round(Number(recipeValue.size) * scaleRatio))
          };
        }
        imageData = transformImageData(imageData, recipe.kind, recipeValue);
      }
      await yieldToBrowser(0);
    }
    return { ...item, imageData };
  } catch (error) {
    console.error(error);
    setStatus(`“${item.name}”完整原图解码失败，已改用代理图导出。`);
    return item;
  }
}

async function exportItemsAsZip(items, zipName = "images.zip") {
  setStatus(`正在打包 ${items.length} 张图片…`);
  const entries = [];
  const usedNames = new Set();
  for (let index = 0; index < items.length; index += 1) {
    const item = await materializeExportItem(items[index]);
    entries.push({
      name: uniqueEntryName(safeExportName(withExportSizeSuffix(item.name, item.imageData)), usedNames),
      bytes: await pngBytesFor(item.imageData)
    });
    if (index % 10 === 0) await yieldToBrowser(0);
  }
  await downloadBlob(zipName, makeZip(entries));
  setStatus(`已将 ${entries.length} 张图片导出为 ZIP。`);
}

async function exportCurrentSelection() {
  const sourceItems = currentExportItems();
  if (!sourceItems.length) {
    setStatus("请先选择或打开要导出的图片。");
    return;
  }
  const items = applyExportRename(sourceItems);
  const baseName = requestedExportBaseName();
  if (items.length === 1) {
    const item = await materializeExportItem(items[0]);
    const name = withExportSizeSuffix(safeExportName(item.name), item.imageData);
    await downloadDataUrl(name, canvasDataUrlFor(item.imageData));
    finishExportSuccess(`已导出“${name}”。`);
    return;
  }
  await exportItemsAsZip(items, `${baseName}.zip`);
  finishExportSuccess(`${items.length} 张图片已按“${baseName}+顺序号”命名并打包为 ZIP。`);
}

let sheetAlignmentResolver = null;

function closeSheetAlignmentDialog(choice = null) {
  if (sheetAlignmentDialog) sheetAlignmentDialog.hidden = true;
  const resolve = sheetAlignmentResolver;
  sheetAlignmentResolver = null;
  if (resolve) resolve(choice);
}

function askSheetAlignmentMode() {
  if (!sheetAlignmentDialog) return Promise.resolve("aligned");
  if (sheetAlignmentResolver) closeSheetAlignmentDialog(null);
  sheetAlignmentDialog.hidden = false;
  return new Promise((resolve) => { sheetAlignmentResolver = resolve; });
}

function alphaBoundsFromCanvas(sourceCanvas) {
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const data = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
  let minX = sourceCanvas.width;
  let minY = sourceCanvas.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < sourceCanvas.height; y += 1) {
    for (let x = 0; x < sourceCanvas.width; x += 1) {
      if (data[(y * sourceCanvas.width + x) * 4 + 3] <= 16) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX) return { minX: 0, minY: 0, maxX: sourceCanvas.width - 1, maxY: sourceCanvas.height - 1 };
  return { minX, minY, maxX, maxY };
}

async function exportCurrentSelectionSheet() {
  const items = currentExportItems();
  if (items.length < 2) {
    setStatus("导出图集至少需要两张已选图片或序列帧。");
    return;
  }
  const alignmentMode = await askSheetAlignmentMode();
  if (!alignmentMode) {
    setStatus("已取消图集导出。");
    return;
  }
  const sources = items.map((item) => ({ item, canvas: exportCanvasFor(item.imageData, { skipGreenScreen: true }) }));
  const cellWidth = Math.max(...sources.map((entry) => entry.canvas.width));
  const cellHeight = Math.max(...sources.map((entry) => entry.canvas.height));
  const columns = Math.max(1, Math.ceil(Math.sqrt(sources.length)));
  const rows = Math.ceil(sources.length / columns);
  const sheet = document.createElement("canvas");
  sheet.width = cellWidth * columns;
  sheet.height = cellHeight * rows;
  const sheetCtx = sheet.getContext("2d");
  if (exportGreenScreen?.checked) {
    sheetCtx.fillStyle = "#00ff00";
    sheetCtx.fillRect(0, 0, sheet.width, sheet.height);
  } else {
    sheetCtx.clearRect(0, 0, sheet.width, sheet.height);
  }
  sources.forEach(({ canvas: source }, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    let dx = 0;
    let dy = 0;
    if (alignmentMode === "aligned") {
      const bounds = alphaBoundsFromCanvas(source);
      const subjectCenterX = (bounds.minX + bounds.maxX + 1) / 2;
      dx = Math.round(cellWidth / 2 - subjectCenterX);
      dy = Math.round(cellHeight - 1 - bounds.maxY);
    }
    sheetCtx.drawImage(source, column * cellWidth + dx, row * cellHeight + dy);
  });
  const sheetName = `${requestedExportBaseName()}-sheet.png`;
  await downloadDataUrl(sheetName, sheet.toDataURL("image/png"));
  finishExportSuccess(`${sources.length} 张图片的图集已保存，布局 ${columns}×${rows}${alignmentMode === "aligned" ? "，主体已居中并底部对齐" : "，保留原始位置"}。`);
}

function downloadPng() {
  if (!currentImageData) return;
  saveActiveImage();
  const baseName = `${activeLibraryTarget?.name || images[activeIndex]?.name || sequenceFrames[activeFrameIndex]?.name || "cutout"}-processed.png`;
  const name = withExportSizeSuffix(baseName, currentImageData);
  downloadDataUrl(name, canvasDataUrlFor(currentImageData));
}

async function exportPngItems(items, zipName, label) {
  if (items.length === 0) return;
  setStatus(`正在准备 ${items.length} 个${label}...`);

  const entries = [];
  for (let index = 0; index < items.length; index += 1) {
    const item = await materializeExportItem(items[index]);
    const bytes = await pngBytesFor(item.imageData);
    entries.push({ name: safeExportName(withExportSizeSuffix(item.name, item.imageData)), bytes });
    if (index % 10 === 0) {
      setStatus(`正在导出 ${index + 1}/${items.length}...`);
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    }
  }

  if (exportDirectoryHandle) {
    try {
      for (const entry of entries) {
        await saveBlobToExportLocation(entry.name, new Blob([entry.bytes], { type: "image/png" }), false);
      }
      setStatus(`已将 ${items.length} 个${label}导出到所选文件夹。`);
      return;
    } catch (error) {
      setStatus("所选文件夹无法写入，正在改为导出单个 ZIP...");
    }
  }

  await downloadBlob(zipName, makeZip(entries));
  setStatus(`已将 ${items.length} 个${label}打包为 ZIP，避免浏览器阻止多个下载。`);
}

async function downloadAll() {
  if (assetLibrary.length === 0) return;
  await exportPngItems(
    assetLibrary.map((asset, index) => ({
      name: `${asset.name || `result-${index + 1}`}.png`,
      imageData: asset.imageData,
      fullResolutionSource: asset.fullResolutionSource || null,
      fullResolutionPipeline: cloneFullResolutionPipeline(asset.fullResolutionPipeline)
    })),
    "processed-results.zip",
    "处理结果"
  );
  finishExportSuccess(`${assetLibrary.length} 个处理结果已保存。`);
}

function selectedSequenceFrames() {
  return sequenceFrames
    .map((frame, index) => ({ frame, index }))
    .filter((item) => item.frame.selected)
    .sort((a, b) => (a.frame.order || 0) - (b.frame.order || 0));
}

function playableSequenceFrames() {
  const selected = selectedSequenceFrames();
  if (selected.length) return selected;
  return sequenceFrames.map((frame, index) => ({ frame, index }));
}

function chosenSequenceFrames() {
  const selected = selectedSequenceFrames();
  if (selected.length) return selected;
  if (activeFrameIndex >= 0 && sequenceFrames[activeFrameIndex]) {
    return [{ frame: sequenceFrames[activeFrameIndex], index: activeFrameIndex }];
  }
  return [];
}

async function exportSequenceFrames() {
  if (sequenceFrames.length === 0) return;
  const selected = chosenSequenceFrames();
  if (selected.length === 0) {
    setStatus("请先选择或打开要导出的序列帧。");
    return;
  }
  if (selected.length === 1) {
    const { frame, index } = selected[0];
    const name = `${requestedExportBaseName()}-0001.png`;
    const item = await materializeExportItem({
      name,
      imageData: frame.imageData,
      fullResolutionSource: frame.fullResolutionSource || null,
      fullResolutionPipeline: cloneFullResolutionPipeline(frame.fullResolutionPipeline)
    });
    await downloadDataUrl(withExportSizeSuffix(name, item.imageData), canvasDataUrlFor(item.imageData));
    finishExportSuccess("当前序列帧 PNG 已保存。");
    return;
  }
  await exportPngItems(
    selected.map(({ frame }, exportIndex) => ({
      name: `${requestedExportBaseName()}-${String(exportIndex + 1).padStart(4, "0")}.png`,
      imageData: frame.imageData,
      fullResolutionSource: frame.fullResolutionSource || null,
      fullResolutionPipeline: cloneFullResolutionPipeline(frame.fullResolutionPipeline)
    })),
    `${requestedExportBaseName()}.zip`,
    "序列帧"
  );
  finishExportSuccess(`${selected.length} 个序列帧已保存。`);
}

function crc32(bytes) {
  let crc = -1;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function uint16(value) {
  return [value & 255, (value >>> 8) & 255];
}

function uint32(value) {
  return [value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255];
}

function dosDateTime(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: dosDate };
}

function makeZip(entries) {
  const encoder = new TextEncoder();
  const files = [];
  const central = [];
  let offset = 0;
  const stamp = dosDateTime();
  const utf8Flag = 0x0800;

  entries.forEach((entry) => {
    const nameBytes = encoder.encode(entry.name);
    const bytes = entry.bytes instanceof Uint8Array ? entry.bytes : new Uint8Array(entry.bytes);
    const checksum = crc32(bytes);
    const localHeader = new Uint8Array([
      ...uint32(0x04034b50),
      ...uint16(20),
      ...uint16(utf8Flag),
      ...uint16(0),
      ...uint16(stamp.time),
      ...uint16(stamp.date),
      ...uint32(checksum),
      ...uint32(bytes.length),
      ...uint32(bytes.length),
      ...uint16(nameBytes.length),
      ...uint16(0)
    ]);
    files.push(localHeader, nameBytes, bytes);

    const centralHeader = new Uint8Array([
      ...uint32(0x02014b50),
      ...uint16(20),
      ...uint16(20),
      ...uint16(utf8Flag),
      ...uint16(0),
      ...uint16(stamp.time),
      ...uint16(stamp.date),
      ...uint32(checksum),
      ...uint32(bytes.length),
      ...uint32(bytes.length),
      ...uint16(nameBytes.length),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint32(0),
      ...uint32(offset)
    ]);
    central.push(centralHeader, nameBytes);
    offset += localHeader.length + nameBytes.length + bytes.length;
  });

  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const endRecord = new Uint8Array([
    ...uint32(0x06054b50),
    ...uint16(0),
    ...uint16(0),
    ...uint16(entries.length),
    ...uint16(entries.length),
    ...uint32(centralSize),
    ...uint32(offset),
    ...uint16(0)
  ]);

  return new Blob([...files, ...central, endRecord], { type: "application/zip" });
}


async function exportSequenceSheet() {
  const chosen = chosenSequenceFrames();
  if (!chosen.length) {
    setStatus("请先选择或打开要导出为图集的序列帧。");
    return;
  }
  const cellWidth = Math.max(...chosen.map(({ frame }) => frame.imageData.width));
  const cellHeight = Math.max(...chosen.map(({ frame }) => frame.imageData.height));
  const columns = Math.max(1, Math.ceil(Math.sqrt(chosen.length)));
  const rows = Math.ceil(chosen.length / columns);
  const sheet = document.createElement("canvas");
  sheet.width = cellWidth * columns;
  sheet.height = cellHeight * rows;
  const sheetCtx = sheet.getContext("2d");
  if (exportGreenScreen?.checked) {
    sheetCtx.fillStyle = "#00ff00";
    sheetCtx.fillRect(0, 0, sheet.width, sheet.height);
  } else {
    sheetCtx.clearRect(0, 0, sheet.width, sheet.height);
  }
  chosen.forEach(({ frame }, index) => {
    const source = document.createElement("canvas");
    source.width = frame.imageData.width;
    source.height = frame.imageData.height;
    source.getContext("2d").putImageData(frame.imageData, 0, 0);
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = column * cellWidth + Math.floor((cellWidth - source.width) / 2);
    const y = row * cellHeight + (cellHeight - source.height);
    sheetCtx.drawImage(source, x, y);
  });
  await downloadDataUrl(`${requestedExportBaseName()}-sheet.png`, sheet.toDataURL("image/png"));
  finishExportSuccess(`${chosen.length} 帧图集已保存，布局为 ${columns}×${rows}。`);
}

async function exportSequenceZip() {
  if (sequenceFrames.length === 0) return;
  const selected = chosenSequenceFrames();
  if (selected.length === 0) {
    setStatus("请先选择或打开要打包导出的序列帧。");
    return;
  }
  setStatus(`正在打包 ${selected.length} 张${exportGreenScreen?.checked ? "绿幕" : "透明"} PNG...`);
  const entries = [];
  for (let index = 0; index < selected.length; index += 1) {
    const { frame, index: originalIndex } = selected[index];
    const exportItem = await materializeExportItem({
      name: frame.name || "frame",
      imageData: frame.imageData,
      fullResolutionSource: frame.fullResolutionSource || null,
      fullResolutionPipeline: cloneFullResolutionPipeline(frame.fullResolutionPipeline)
    });
    const number = String(originalIndex + 1).padStart(4, "0");
    const baseName = (frame.name || "frame").replace(/[\\/:*?"<>|]/g, "_");
    entries.push({
      name: withExportSizeSuffix(`${baseName}-${number}.png`, exportItem.imageData),
      bytes: await pngBytesFor(exportItem.imageData)
    });
    if (index % 10 === 0) await yieldToBrowser(0);
  }
  await downloadBlob(`${requestedExportBaseName()}.zip`, makeZip(entries));
  finishExportSuccess(`${selected.length} 张${exportGreenScreen?.checked ? "绿幕" : "透明"}单帧 PNG 已打包为 ZIP。`);
}

function frameFromImageItem(item, fallbackName) {
  const data = item.imageData || item.originalImageData || item.currentImageData;
  const placement = cloneSequencePlacement(item.sequencePlacement);
  // 提取结果在结果库中仍保持紧凑裁剪，便于查看和继续处理；
  // 加入序列帧时才恢复到原视频帧的统一画布与原始整数坐标。
  // 这样每帧即使透明边界不同，也不会再次按各自裁剪框从 (0, 0) 开始播放。
  const frameImageData = placement
    ? drawImageDataOnCanvas(data, placement.canvasWidth, placement.canvasHeight, placement.offsetX, placement.offsetY)
    : cloneImageData(data);
  return {
    name: item.name || fallbackName,
    imageData: frameImageData,
    thumbnail: makeThumbnail(frameImageData),
    selected: false,
    order: 0,
    pixelatedPreview: Boolean(item.pixelatedPreview),
    delayMs: normalizedFrameDelayMs(item),
    fullResolutionSource: placement ? null : (item.fullResolutionSource || null),
    fullResolutionPipeline: placement ? [] : cloneFullResolutionPipeline(item.fullResolutionPipeline)
  };
}



function addSelectedFrames() {
  const selected = selectedOrActiveOriginals();
  if (!selected.length) return;
  pushHistory();
  selected.forEach((item, index) => sequenceFrames.push(frameFromImageItem(item, `frame-${sequenceFrames.length + index + 1}`)));
  activeFrameIndex = sequenceFrames.length - 1;
  renderFrameList();
  setButtons();
  setStatus(`已添加 ${selected.length} 张原始图片到序列帧工作区。`);
}




async function importSequenceFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  pushHistory();
  let added = 0;
  for (const file of files) {
    try {
      const report = workspaceMemoryReport();
      const proxyMaxSide = chooseProxyMaxSide({
        fileCount: files.length,
        currentBytes: report.totalBytes,
        softLimitBytes: workspaceMemoryPolicy.softLimitBytes
      });
      const loaded = await loadImageDataFile(file, { maxSide: proxyMaxSide });
      sequenceFrames.push(frameFromImageItem({
        name: loaded.name,
        imageData: loaded.imageData,
        fullResolutionSource: loaded.fullResolutionSource,
        fullResolutionPipeline: []
      }, `frame-${sequenceFrames.length + 1}`));
      added += 1;
    } catch (error) {
      console.error(error);
    }
  }
  activeFrameIndex = sequenceFrames.length - 1;
  setProcessingSource("sequence", { announce: false });
  if (activeFrameIndex >= 0) showSequenceFrame(activeFrameIndex);
  renderFrameList();
  setButtons();
  setStatus(`已直接导入 ${added} 张序列帧图片。`);
  sequenceImageInput.value = "";
}

function addAssetsToSequence() {
  const selected = selectedOrActiveAssets();
  if (!selected.length) return;
  pushHistory();
  const restoredCount = selected.filter((asset) => cloneSequencePlacement(asset.sequencePlacement)).length;
  selected.forEach((asset, index) => sequenceFrames.push(frameFromImageItem(asset, `frame-${sequenceFrames.length + index + 1}`)));
  activeFrameIndex = sequenceFrames.length - 1;
  renderFrameList();
  setButtons();
  setStatus(restoredCount > 0
    ? `已添加 ${selected.length} 个处理结果到序列帧工作区，其中 ${restoredCount} 帧已恢复原视频画布与原始坐标。`
    : `已添加 ${selected.length} 个处理结果到序列帧工作区。`);
}

function renameOriginalImages() {
  const targets = selectedOrActiveOriginals();
  if (!targets.length) return;
  const value = window.prompt(targets.length > 1 ? "输入名称前缀（会自动编号）" : "输入新名称", targets[0].name || "原始图片");
  if (!value?.trim()) return;
  pushHistory();
  targets.forEach((item, index) => { item.name = targets.length > 1 ? `${value.trim()}-${index + 1}` : value.trim(); });
  renderImageList(); renderWorkspaceTabs(); setButtons();
  setStatus(`已重命名 ${targets.length} 张原始图片。`);
}

function renameProcessedAssets() {
  const targets = selectedOrActiveAssets();
  if (!targets.length) return;
  const value = window.prompt(targets.length > 1 ? "输入名称前缀（会自动编号）" : "输入新名称", targets[0].name || "处理结果");
  if (!value?.trim()) return;
  pushHistory();
  targets.forEach((asset, index) => { asset.name = targets.length > 1 ? `${value.trim()}-${index + 1}` : value.trim(); });
  renderAssetList(); renderWorkspaceTabs(); setButtons();
  setStatus(`已重命名 ${targets.length} 个处理结果。`);
}

function normalizeSequenceFramesBottom() {
  const targets = targetFrames().length ? targetFrames() : sequenceFrames.slice();
  if (!targets.length) return;
  pushHistory();
  const width = Math.max(...targets.map((frame) => frame.imageData.width));
  const height = Math.max(...targets.map((frame) => frame.imageData.height));
  targets.forEach((frame) => {
    const bounds = subjectBounds(frame.imageData);
    const subjectBottom = bounds.maxY + 1;
    const dx = Math.round((width - frame.imageData.width) / 2);
    const dy = Math.round(height - subjectBottom);
    frame.imageData = drawImageDataOnCanvas(frame.imageData, width, height, dx, dy);
    invalidateFullResolutionSource(frame);
  });
  refreshFrameEditPreview(targets, `已统一为 ${width}×${height} 并按主体底部对齐`);
}

function saveFramesToResults() {
  const targets = targetFrames().length ? targetFrames() : sequenceFrames.slice();
  if (!targets.length) return;
  pushHistory();
  const created = targets.map((frame) => addProcessedAsset(frame.imageData, frame.name, "处理结果", {
    sourceKind: "sequence",
    pixelatedPreview: frame.pixelatedPreview,
    fullResolutionSource: frame.fullResolutionSource || null,
    fullResolutionPipeline: cloneFullResolutionPipeline(frame.fullResolutionPipeline)
  }));
  activateProcessedAsset(created[created.length - 1]);
  setStatus(`已将 ${created.length} 个序列帧保存到处理结果库。`);
}

function deleteFrame() {
  const selectedIndexes = sequenceFrames
    .map((frame, index) => frame.selected ? index : -1)
    .filter((index) => index >= 0);
  const indexes = selectedIndexes.length ? selectedIndexes : (activeFrameIndex >= 0 ? [activeFrameIndex] : []);
  if (!indexes.length) return;
  pushHistory();
  const removed = indexes.map((index) => sequenceFrames[index]);
  indexes.slice().sort((a, b) => b - a).forEach((index) => sequenceFrames.splice(index, 1));
  removeWorkspaceTabsForTargets(removed);
  frameSelectionOrder = normalizeSelectionOrders(sequenceFrames);
  librarySelectionAnchor.sequence = -1;
  activeFrameIndex = Math.min(indexes[0], sequenceFrames.length - 1);
  playbackIndex = 0;
  if (sequenceFrames.length && activeFrameIndex >= 0) showSequenceFrame(activeFrameIndex);
  else { stopPlayback(); clearImageWorkspace(); }
  renderFrameList();
  setButtons();
  setStatus(`已删除 ${indexes.length} 个序列帧。`);
}

function deleteSelectedBlock() {
  if ((!currentImageData && processingSource !== "sequence") || (!cropSelection && lassoSelection.length < 3)) return;
  if (processingSource === "sequence") {
    const targets = targetFrames();
    if (!targets.length) return;
    pushHistory();
    const changed = [];
    targets.forEach((frame) => {
      const next = deleteSelectionFromImageData(frame.imageData);
      if (!next) return;
      frame.imageData = next;
      invalidateFullResolutionSource(frame);
      changed.push(frame);
    });
    if (changed.length) refreshFrameEditPreview(changed, "已删除序列帧中的选区图块");
    return;
  }
  const records = sourceRecordsForProcessing();
  createResultsFromRecords(records, (imageData) => deleteSelectionFromImageData(imageData), "deleteBlock", "已删除选区图块");
}

function deleteSelectionFromImageData(imageData) {
  const next = cloneImageData(imageData);
  if (lassoSelection.length >= 3) {
    const xs = lassoSelection.map((point) => point.x);
    const ys = lassoSelection.map((point) => point.y);
    const left = Math.max(0, Math.floor(Math.min(...xs)));
    const top = Math.max(0, Math.floor(Math.min(...ys)));
    const right = Math.min(next.width - 1, Math.ceil(Math.max(...xs)));
    const bottom = Math.min(next.height - 1, Math.ceil(Math.max(...ys)));

    for (let py = top; py <= bottom; py += 1) {
      for (let px = left; px <= right; px += 1) {
        if (isPointInPolygon(px + 0.5, py + 0.5, lassoSelection)) {
          next.data[(py * next.width + px) * 4 + 3] = 0;
        }
      }
    }
  } else {
    const x = Math.max(0, Math.floor(cropSelection.x));
    const y = Math.max(0, Math.floor(cropSelection.y));
    const right = Math.min(next.width, x + Math.floor(cropSelection.width));
    const bottom = Math.min(next.height, y + Math.floor(cropSelection.height));

    if (right - x < 2 || bottom - y < 2) {
      return null;
    }

    for (let py = y; py < bottom; py += 1) {
      for (let px = x; px < right; px += 1) {
        next.data[(py * next.width + px) * 4 + 3] = 0;
      }
    }
  }
  return next;
}

function eraserImageRadius() {
  const size = Math.max(1, Number(eraserSize.value) || 1);
  if (size <= 1) return 0.5;
  return Math.max(0.5, size / 2 / Math.max(scale, 0.05));
}

function eraseSinglePixelInPlace(imageData, point) {
  const x = Math.floor(point.x);
  const y = Math.floor(point.y);
  if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) return;
  imageData.data[(y * imageData.width + x) * 4 + 3] = 0;
}

function eraseCircleInPlace(imageData, point, radius) {
  const left = Math.max(0, Math.floor(point.x - radius));
  const right = Math.min(imageData.width - 1, Math.ceil(point.x + radius));
  const top = Math.max(0, Math.floor(point.y - radius));
  const bottom = Math.min(imageData.height - 1, Math.ceil(point.y + radius));
  const radiusSq = radius * radius;
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const dx = x - point.x;
      const dy = y - point.y;
      if (dx * dx + dy * dy <= radiusSq) imageData.data[(y * imageData.width + x) * 4 + 3] = 0;
    }
  }
}

function currentEditableImageTarget() {
  if (processingSource === "sequence") {
    const frame = selectedFrame();
    return frame ? { kind: "sequence", target: frame, imageData: frame.imageData } : null;
  }
  if (processingSource === "result" && activeLibraryTarget) {
    return { kind: "result", target: activeLibraryTarget, imageData: activeLibraryTarget.imageData };
  }
  if (processingSource === "original" && activeIndex >= 0 && images[activeIndex]) {
    const item = images[activeIndex];
    return { kind: "original", target: item, imageData: item.currentImageData || item.originalImageData };
  }
  return null;
}

function getEditableEraseFillColor(editable = currentEditableImageTarget()) {
  if (!editable) return null;
  if (editable.kind === 'result' && editable.target?.sourceKind === 'draw' && editable.target?.canvasBaseColor) {
    return normalizeSolidColor(editable.target.canvasBaseColor);
  }
  return null;
}

function applyFillColorAtPoint(imageData, point, color) {
  const x = Math.floor(point.x);
  const y = Math.floor(point.y);
  if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) return;
  const index = (y * imageData.width + x) * 4;
  imageData.data[index] = color.r;
  imageData.data[index + 1] = color.g;
  imageData.data[index + 2] = color.b;
  imageData.data[index + 3] = Number.isFinite(color.a) ? color.a : 255;
}

function applyFillColorCircle(imageData, point, radius, color) {
  const left = Math.max(0, Math.floor(point.x - radius));
  const right = Math.min(imageData.width - 1, Math.ceil(point.x + radius));
  const top = Math.max(0, Math.floor(point.y - radius));
  const bottom = Math.min(imageData.height - 1, Math.ceil(point.y + radius));
  const radiusSq = radius * radius;
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const dx = x - point.x;
      const dy = y - point.y;
      if (dx * dx + dy * dy <= radiusSq) {
        const index = (y * imageData.width + x) * 4;
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = Number.isFinite(color.a) ? color.a : 255;
      }
    }
  }
}

function prepareCurrentImageForEraser() {
  const editable = currentEditableImageTarget();
  if (!editable) return null;
  const working = cloneImageData(editable.imageData);
  if (editable.kind === "sequence") editable.target.imageData = working;
  else if (editable.kind === "result") {
    editable.target.imageData = working;
    editable.target.previewImageData = null;
  } else editable.target.currentImageData = working;
  invalidateFullResolutionSource(editable.target);
  currentImageData = working;
  liveBaseImageData = null;
  return editable;
}

function applyEraserAt(point) {
  if (!currentImageData) return;
  const editable = currentEditableImageTarget();
  const fillColor = getEditableEraseFillColor(editable);
  const pixelPrecision = Number(eraserSize.value) <= 1;
  const radius = eraserImageRadius();
  const from = lastEraserPoint || point;
  const distance = Math.hypot(point.x - from.x, point.y - from.y);
  const step = Math.max(1, radius * 0.35);
  const count = Math.max(1, Math.ceil(distance / step));
  for (let index = 0; index <= count; index += 1) {
    const t = count ? index / count : 1;
    const sample = {
      x: from.x + (point.x - from.x) * t,
      y: from.y + (point.y - from.y) * t
    };
    if (fillColor) {
      if (pixelPrecision) applyFillColorAtPoint(currentImageData, sample, fillColor);
      else applyFillColorCircle(currentImageData, sample, radius, fillColor);
    } else {
      if (pixelPrecision) eraseSinglePixelInPlace(currentImageData, sample);
      else eraseCircleInPlace(currentImageData, sample, radius);
    }
  }
  lastEraserPoint = point;
  drawImageData(currentImageData);
}

function updateEraserCursor(event) {
  if (clickMode !== "eraser") return;
  const size = Number(eraserSize.value);
  const pixelPrecision = size <= 1;
  eraserCursor.classList.toggle("pixel-precision", pixelPrecision);
  eraserCursor.style.width = `${pixelPrecision ? 10 : Math.max(6, size)}px`;
  eraserCursor.style.height = `${pixelPrecision ? 10 : Math.max(6, size)}px`;
  eraserCursor.style.left = `${event.clientX}px`;
  eraserCursor.style.top = `${event.clientY}px`;
  eraserCursor.classList.add("visible");
}

function brushImageRadius() {
  const size = Math.max(1, Number(brushSize?.value) || 1);
  if (size <= 1) return 0.5;
  return Math.max(0.5, size / 2 / Math.max(scale, 0.05));
}

function paintSinglePixelInPlace(imageData, point, color = brushColor) {
  const x = Math.floor(point.x);
  const y = Math.floor(point.y);
  if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) return;
  const index = (y * imageData.width + x) * 4;
  imageData.data[index] = color.r;
  imageData.data[index + 1] = color.g;
  imageData.data[index + 2] = color.b;
  imageData.data[index + 3] = Number.isFinite(color.a) ? color.a : 255;
}

function paintCircleInPlace(imageData, point, radius, color = brushColor) {
  const left = Math.max(0, Math.floor(point.x - radius));
  const right = Math.min(imageData.width - 1, Math.ceil(point.x + radius));
  const top = Math.max(0, Math.floor(point.y - radius));
  const bottom = Math.min(imageData.height - 1, Math.ceil(point.y + radius));
  const radiusSq = radius * radius;
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const dx = x - point.x;
      const dy = y - point.y;
      if (dx * dx + dy * dy > radiusSq) continue;
      const index = (y * imageData.width + x) * 4;
      imageData.data[index] = color.r;
      imageData.data[index + 1] = color.g;
      imageData.data[index + 2] = color.b;
      imageData.data[index + 3] = Number.isFinite(color.a) ? color.a : 255;
    }
  }
}

function updateBrushCursor(event, options = {}) {
  if (clickMode !== "brush") return;
  const size = Number(brushSize?.value || 1);
  const pixelPrecision = size <= 1;
  const erase = options.erase ?? brushErasing;
  brushCursor.classList.toggle("pixel-precision", pixelPrecision);
  brushCursor.classList.toggle("erase", erase);
  brushCursor.style.width = `${pixelPrecision ? 10 : Math.max(6, size)}px`;
  brushCursor.style.height = `${pixelPrecision ? 10 : Math.max(6, size)}px`;
  brushCursor.style.left = `${event.clientX}px`;
  brushCursor.style.top = `${event.clientY}px`;
  if (!erase) {
    brushCursor.style.borderColor = `rgba(${brushColor.r}, ${brushColor.g}, ${brushColor.b}, 0.96)`;
    brushCursor.style.background = `rgba(${brushColor.r}, ${brushColor.g}, ${brushColor.b}, 0.18)`;
  } else {
    brushCursor.style.borderColor = "#d99041";
    brushCursor.style.background = "rgba(217, 144, 65, 0.12)";
  }
  brushCursor.classList.add("visible");
}

function positionBrushPickIndicator(clientX, clientY) {
  brushPickIndicator.style.left = `${clientX}px`;
  brushPickIndicator.style.top = `${clientY}px`;
}

function hideBrushPickIndicator() {
  if (brushPickHideTimer) {
    window.clearTimeout(brushPickHideTimer);
    brushPickHideTimer = null;
  }
  brushPickIndicator.hidden = true;
  brushPickIndicator.classList.remove("visible", "loading", "picked");
  hideBrushMagnifier();
}

function showBrushPickLoading(clientX, clientY, point = brushLongPressPoint) {
  if (brushPickHideTimer) {
    window.clearTimeout(brushPickHideTimer);
    brushPickHideTimer = null;
  }
  positionBrushPickIndicator(clientX, clientY);
  brushPickIndicator.hidden = false;
  brushPickIndicator.classList.add("visible", "loading");
  brushPickIndicator.classList.remove("picked");
  const core = brushPickIndicator.querySelector('.brush-pick-core');
  if (core) core.style.background = 'rgba(255,255,255,0.94)';
  renderBrushMagnifier(point, { clientX, clientY });
}

function showBrushPickedColor(color) {
  const core = brushPickIndicator.querySelector('.brush-pick-core');
  if (core) core.style.background = `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.max(0.35, (color.a ?? 255) / 255)})`;
  brushPickIndicator.classList.remove("loading");
  brushPickIndicator.classList.add("visible", "picked");
  brushPickIndicator.hidden = false;
  renderBrushMagnifier(brushLongPressPoint || brushPreviewPoint, brushLongPressClient);
  if (brushPickHideTimer) window.clearTimeout(brushPickHideTimer);
  brushPickHideTimer = window.setTimeout(() => hideBrushPickIndicator(), 550);
}

function pickBrushColorFromPoint(point, client = brushLongPressClient) {
  if (!currentImageData) return false;
  const x = Math.max(0, Math.min(currentImageData.width - 1, Math.floor(point.x)));
  const y = Math.max(0, Math.min(currentImageData.height - 1, Math.floor(point.y)));
  const index = (y * currentImageData.width + x) * 4;
  brushColor = {
    r: currentImageData.data[index],
    g: currentImageData.data[index + 1],
    b: currentImageData.data[index + 2],
    a: currentImageData.data[index + 3] > 0 ? currentImageData.data[index + 3] : 255
  };
  updateRangeLabels();
  syncBrushPaletteFromColor();
  if (client) positionBrushPickIndicator(client.clientX, client.clientY);
  showBrushPickedColor(brushColor);
  setStatus(`已取到画笔颜色 RGB(${brushColor.r}, ${brushColor.g}, ${brushColor.b})。现在可直接绘画。`);
  return true;
}

function clearBrushLongPressTimer() {
  if (brushLongPressTimer) {
    window.clearTimeout(brushLongPressTimer);
    brushLongPressTimer = null;
  }
}

function beginBrushStroke(erasing, point, event) {
  if (brushDrawing || !currentImageData) return false;
  pushHistory();
  if (!prepareCurrentImageForEraser()) return false;
  brushDrawing = true;
  brushErasing = erasing;
  brushPreviewPoint = point;
  lastBrushPoint = point;
  brushPointerId = event.pointerId;
  if (event.currentTarget?.setPointerCapture) event.currentTarget.setPointerCapture(event.pointerId);
  updateBrushCursor(event, { erase: erasing });
  applyBrushAt(point, { erase: erasing });
  return true;
}

function applyBrushAt(point, options = {}) {
  if (!currentImageData) return;
  const erase = Boolean(options.erase);
  const editable = currentEditableImageTarget();
  const fillColor = erase ? getEditableEraseFillColor(editable) : null;
  const pixelPrecision = Number(brushSize?.value || 1) <= 1;
  const radius = brushImageRadius();
  const from = lastBrushPoint || point;
  const distance = Math.hypot(point.x - from.x, point.y - from.y);
  const step = Math.max(1, radius * 0.35);
  const count = Math.max(1, Math.ceil(distance / step));
  for (let index = 0; index <= count; index += 1) {
    const t = count ? index / count : 1;
    const sample = {
      x: from.x + (point.x - from.x) * t,
      y: from.y + (point.y - from.y) * t
    };
    if (erase) {
      if (fillColor) {
        if (pixelPrecision) applyFillColorAtPoint(currentImageData, sample, fillColor);
        else applyFillColorCircle(currentImageData, sample, radius, fillColor);
      } else {
        if (pixelPrecision) eraseSinglePixelInPlace(currentImageData, sample);
        else eraseCircleInPlace(currentImageData, sample, radius);
      }
    } else {
      if (pixelPrecision) paintSinglePixelInPlace(currentImageData, sample, brushColor);
      else paintCircleInPlace(currentImageData, sample, radius, brushColor);
    }
  }
  lastBrushPoint = point;
  drawImageData(currentImageData);
}

function finalizeDirectCanvasEdit(statusMessage = "已直接修改当前图。") {
  const editable = currentEditableImageTarget();
  if (editable?.kind === "sequence") {
    editable.target.thumbnail = makeThumbnail(editable.target.imageData);
    renderFrameList();
    if (!framePicker.hidden) renderFramePicker();
  } else if (editable?.kind === "result") {
    editable.target.thumbnail = makeThumbnail(editable.target.imageData);
    renderAssetList();
    renderWorkspaceTabs();
  } else if (editable?.kind === "original") {
    renderImageList();
    renderWorkspaceTabs();
  }
  setButtons();
  setStatus(statusMessage);
}

function floodFillCurrentImage(point) {
  if (clickMode !== "brush" || !currentImageData) return false;
  const editable = currentEditableImageTarget();
  if (!editable) return false;
  const width = editable.imageData.width;
  const height = editable.imageData.height;
  let x = Math.floor(point.x);
  let y = Math.floor(point.y);
  if (x < 0 || y < 0 || x >= width || y >= height) return false;
  const data = editable.imageData.data;
  const replacement = [brushColor.r, brushColor.g, brushColor.b, Number.isFinite(brushColor.a) ? brushColor.a : 255];
  const colorAt = (px, py) => {
    const idx = (py * width + px) * 4;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  };
  const sameColor = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  let target = colorAt(x, y);
  if (sameColor(target, replacement)) {
    let found = false;
    for (let radius = 1; radius <= 4 && !found; radius += 1) {
      for (let oy = -radius; oy <= radius && !found; oy += 1) {
        for (let ox = -radius; ox <= radius; ox += 1) {
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const candidate = colorAt(nx, ny);
          if (!sameColor(candidate, replacement)) {
            x = nx;
            y = ny;
            target = candidate;
            found = true;
            break;
          }
        }
      }
    }
    if (!found) return false;
  }
  pushHistory();
  if (!prepareCurrentImageForEraser()) return false;
  const work = currentImageData.data;
  const stack = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
    const idx = (cy * width + cx) * 4;
    if (work[idx] !== target[0] || work[idx + 1] !== target[1] || work[idx + 2] !== target[2] || work[idx + 3] !== target[3]) continue;
    work[idx] = replacement[0];
    work[idx + 1] = replacement[1];
    work[idx + 2] = replacement[2];
    work[idx + 3] = replacement[3];
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
  drawImageData(currentImageData);
  finalizeDirectCanvasEdit(`已用当前画笔颜色填充点击区域。`);
  return true;
}

function isPointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersects = ((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi || 1) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function showSequenceFrame(index, openTab = true) {
  const frame = sequenceFrames[index];
  if (toolSession && toolSession.sourceTarget !== frame) cancelToolSession({ silent: true });
  if (!frame) return;
  if (openTab) { openWorkspaceTab("frame", frame); return; }
  setProcessingSource("sequence", { announce: false, scrollLibrary: false });
  activeLibraryTarget = null;
  activeIndex = -1;
  activeFrameIndex = index;
  playbackPreviewFrameIndex = index;
  currentImageData = frame.imageData;
  originalImageData = frame.imageData;
  liveBaseImageData = null;
  cropSelection = null;
  hideCropBox();
  clearLassoSelection();
  renderPreviewImageData(frame.imageData);
  renderFrameList();
  renderImageList();
  renderAssetList();
  renderWorkspaceTabs();
  setButtons();
  setStatus(`正在编辑序列帧 ${index + 1}/${sequenceFrames.length}。`);
}

function previewPlaybackFrame(index) {
  const frame = sequenceFrames[index];
  if (!frame) return;
  playbackPreviewFrameIndex = index;
  cropSelection = null;
  hideCropBox();
  renderPreviewImageData(frame.imageData);
  syncSequencePlayerProgress(index);
}

function previewPlaybackSelectedFrame(selected, selectedIndex) {
  const item = selected[selectedIndex];
  if (!item) return;
  playbackPreviewFrameIndex = item.index;
  cropSelection = null;
  hideCropBox();
  renderPreviewImageData(item.frame.imageData);
  syncSequencePlayerProgress(item.index);
}

const maxFrameDelayMs = 10000;

function normalizedFrameDelayMs(frame) {
  const value = Number(frame?.delayMs);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(maxFrameDelayMs, Math.round(value)));
}

function playbackFrameDurationMs(frame) {
  const fps = Math.max(1, Math.min(60, Number(fpsInput.value) || 8));
  return 1000 / fps + normalizedFrameDelayMs(frame);
}

function stopPlayback() {
  if (playbackTimer) {
    window.clearTimeout(playbackTimer);
    playbackTimer = null;
  }
  setButtons();
}

function schedulePlaybackFrame() {
  const currentSelected = playableSequenceFrames();
  if (currentSelected.length === 0) {
    stopPlayback();
    return;
  }
  if (playbackIndex >= currentSelected.length) playbackIndex = 0;
  const currentItem = currentSelected[playbackIndex];
  previewPlaybackSelectedFrame(currentSelected, playbackIndex);
  playbackIndex = (playbackIndex + 1) % currentSelected.length;
  playbackTimer = window.setTimeout(schedulePlaybackFrame, playbackFrameDurationMs(currentItem.frame));
}

function togglePlayback() {
  if (playbackTimer) {
    const pausedFrameIndex = playbackPreviewFrameIndex;
    stopPlayback();
    if (pausedFrameIndex >= 0 && sequenceFrames[pausedFrameIndex]) {
      showSequenceFrame(pausedFrameIndex, false);
    }
    setStatus("已暂停序列帧播放。");
    return;
  }
  if (sequenceFrames.length === 0) return;
  const selected = playableSequenceFrames();
  const fps = Math.max(1, Math.min(60, Number(fpsInput.value) || 8));
  playbackIndex = Math.max(0, selected.findIndex((item) => item.index === activeFrameIndex));
  playbackPreviewFrameIndex = activeFrameIndex;
  schedulePlaybackFrame();
  setButtons();
  const delayedCount = selected.filter((item) => normalizedFrameDelayMs(item.frame) > 0).length;
  const selectedLabel = selectedSequenceFrames().length ? "个选中序列帧" : "个序列帧";
  setStatus(`正在以 ${fps} FPS 播放 ${selected.length} ${selectedLabel}${delayedCount ? `，其中 ${delayedCount} 帧使用单帧延迟` : ""}。`);
}

function showAdjacentSequenceFrame(direction) {
  if (sequenceFrames.length === 0) return;
  const current = playbackTimer && playbackPreviewFrameIndex >= 0
    ? playbackPreviewFrameIndex
    : (activeFrameIndex >= 0 ? activeFrameIndex : 0);
  const next = Math.max(0, Math.min(sequenceFrames.length - 1, current + direction));
  if (next === current) return;
  stopPlayback();
  showSequenceFrame(next, false);
}

function copiedSequenceFrameName(sourceName) {
  const baseName = String(sourceName || `frame-${activeFrameIndex + 1}`).trim() || `frame-${activeFrameIndex + 1}`;
  const existingNames = new Set(sequenceFrames.map((frame) => String(frame.name || "")));
  let candidate = `${baseName}-副本`;
  let suffix = 2;
  while (existingNames.has(candidate)) candidate = `${baseName}-副本-${suffix++}`;
  return candidate;
}

function copyCurrentSequenceFrame() {
  const sourceIndex = activeFrameIndex;
  const sourceFrame = sourceIndex >= 0 ? sequenceFrames[sourceIndex] : null;
  if (!sourceFrame) {
    setStatus("请先在序列帧库中打开要复制的帧。");
    return;
  }

  pushHistory();
  stopPlayback();

  const copiedImageData = cloneImageData(sourceFrame.imageData);
  const copiedFrame = {
    name: copiedSequenceFrameName(sourceFrame.name),
    imageData: copiedImageData,
    thumbnail: makeThumbnail(copiedImageData),
    selected: true,
    order: 1,
    pixelatedPreview: Boolean(sourceFrame.pixelatedPreview),
    delayMs: normalizedFrameDelayMs(sourceFrame),
    fullResolutionSource: sourceFrame.fullResolutionSource || null,
    fullResolutionPipeline: cloneFullResolutionPipeline(sourceFrame.fullResolutionPipeline)
  };
  const insertIndex = sourceIndex + 1;

  sequenceFrames.forEach((frame) => {
    frame.selected = false;
    frame.order = 0;
  });
  sequenceFrames.splice(insertIndex, 0, copiedFrame);
  frameSelectionOrder = 1;
  libraryBatchSelectionMode.sequence = false;
  librarySelectionAnchor.sequence = insertIndex;
  playbackIndex = insertIndex;
  activeFrameIndex = insertIndex;

  openWorkspaceTab("frame", copiedFrame);
  if (!framePicker.hidden) renderFramePicker();
  setStatus(`已复制“${sourceFrame.name || `第 ${sourceIndex + 1} 帧`}”，副本已插入为第 ${insertIndex + 1} 帧。`);
}

function subjectBounds(imageData) {
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha <= 16) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < 0) {
    return { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1, centerX: width / 2, centerY: height / 2 };
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    centerX: (minX + maxX + 1) / 2,
    centerY: (minY + maxY + 1) / 2
  };
}

function drawImageDataOnCanvas(imageData, width, height, dx, dy) {
  const source = document.createElement("canvas");
  source.width = imageData.width;
  source.height = imageData.height;
  source.getContext("2d").putImageData(imageData, 0, 0);

  const work = document.createElement("canvas");
  work.width = width;
  work.height = height;
  const workCtx = work.getContext("2d");
  workCtx.clearRect(0, 0, width, height);
  workCtx.drawImage(source, Math.round(dx), Math.round(dy));
  return workCtx.getImageData(0, 0, width, height);
}

function alignSequenceSubjects() {
  const selectedIndexes = sequenceFrames
    .map((frame, index) => frame.selected ? index : -1)
    .filter((index) => index >= 0);
  const indexes = selectedIndexes.length >= 2 ? selectedIndexes : sequenceFrames.map((frame, index) => index);
  if (indexes.length < 2) return;

  const frames = indexes.map((index) => sequenceFrames[index]);
  const maxWidth = Math.max(...frames.map((frame) => frame.imageData.width));
  const maxHeight = Math.max(...frames.map((frame) => frame.imageData.height));
  const targetX = maxWidth / 2;
  const targetY = maxHeight / 2;

  indexes.forEach((frameIndex) => {
    const frame = sequenceFrames[frameIndex];
    const bounds = subjectBounds(frame.imageData);
    const dx = targetX - bounds.centerX;
    const dy = targetY - bounds.centerY;
    const aligned = drawImageDataOnCanvas(frame.imageData, maxWidth, maxHeight, dx, dy);
    frame.imageData = aligned;
    invalidateFullResolutionSource(frame);
    frame.thumbnail = makeThumbnail(aligned);
  });

  activeFrameIndex = Math.max(0, activeFrameIndex);
  if (playbackTimer) {
    if (playbackIndex >= sequenceFrames.length) playbackIndex = 0;
    previewPlaybackFrame(playbackIndex);
  } else {
    showSequenceFrame(activeFrameIndex);
  }
  renderFrameList();
  setButtons();
  setStatus(`已将 ${indexes.length} 个序列帧中的主体自动对齐到同一位置。`);
}

function extractSpriteSheetFrames() {
  if (!currentImageData) return;
  stopPlayback();
  saveActiveImage();

  const cols = Math.max(1, Math.floor(Number(sheetCols.value) || 1));
  const rows = Math.max(1, Math.floor(Number(sheetRows.value) || 1));
  const frameWidth = Math.floor(currentImageData.width / cols);
  const frameHeight = Math.floor(currentImageData.height / rows);
  if (frameWidth < 1 || frameHeight < 1) {
    setStatus("图集行列设置无效，请重新输入。");
    return;
  }

  const sourceName = activeLibraryTarget?.name || images[activeIndex]?.name || sequenceFrames[activeFrameIndex]?.name || "spritesheet";
  const frames = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col + 1;
      const frameData = cropImageData(currentImageData, {
        x: col * frameWidth,
        y: row * frameHeight,
        width: frameWidth,
        height: frameHeight
      });
      frames.push({
        name: `${sourceName}-sheet`,
        imageData: cloneImageData(frameData),
        thumbnail: makeThumbnail(frameData),
        selected: false
      });
    }
  }

  const alignedFrames = normalizeFramesToSameTileSize(frames);
  pushHistory();
  const startIndex = sequenceFrames.length;
  sequenceFrames.push(...alignedFrames);
  activeFrameIndex = startIndex;
  showSequenceFrame(activeFrameIndex);
  renderFrameList();
  setButtons();
  setStatus(`已从图集拆出 ${alignedFrames.length} 张序列帧，并自动对齐主体位置。`);
}

function autoExtractSubjectsFromSheet() {
  if (!currentImageData) return;
  stopPlayback();
  const components = extractSubjectComponents(currentImageData);
  if (components.length === 0) {
    setStatus("没有识别到可提取的独立主体。可以先清除背景色后再试。");
    return;
  }
  const sourceName = activeLibraryTarget?.name || images[activeIndex]?.name || sequenceFrames[activeFrameIndex]?.name || "subject";
  const frames = components.map((component) => {
    const frameData = transparentCropFromComponent(currentImageData, component);
    return {
      name: `${sourceName}-subject`,
      imageData: cloneImageData(frameData),
      thumbnail: makeThumbnail(frameData),
      selected: false,
      order: 0
    };
  });
  const alignedFrames = normalizeFramesToSameTileSize(frames);
  pushHistory();
  const start = sequenceFrames.length;
  sequenceFrames.push(...alignedFrames);
  activeFrameIndex = start;
  setProcessingSource("sequence", { announce: false });
  showSequenceFrame(activeFrameIndex);
  setStatus(`已自动提取 ${alignedFrames.length} 个主体到序列帧工作区，并统一尺寸与位置。`);
}

async function extractVideoFrames() {
  if (!loadedVideo) return;
  stopPlayback();
  saveActiveImage();

  const fps = Math.max(1, Math.min(30, Number(videoFpsInput.value) || defaultVideoExtractFps));
  const duration = Number.isFinite(loadedVideo.duration) ? loadedVideo.duration : 0;
  if (duration <= 0) {
    setStatus("视频时长读取失败，无法抽帧。");
    return;
  }

  const frameTotal = Math.max(1, Math.floor(duration * fps));
  const useKeying = pickedColors.length > 0;
  pushHistory();
  const startCount = sequenceFrames.length;
  extractVideoBtn.disabled = true;
  setStatus(`正在抽取视频帧 0/${frameTotal}...`);

  for (let index = 0; index < frameTotal; index += 1) {
    const time = index / fps;
    await seekVideo(loadedVideo, time);
    const rawFrame = imageDataFromVideo(loadedVideo);
    const frameData = useKeying ? buildCutoutFromBase(rawFrame) : rawFrame;
    sequenceFrames.push({
      name: `${loadedVideoName}-frame`,
      imageData: cloneImageData(frameData),
      thumbnail: makeThumbnail(frameData),
      selected: false
    });

    if (index % Math.max(1, Math.floor(fps / 2)) === 0) {
      setStatus(`正在抽取视频帧 ${index + 1}/${frameTotal}...`);
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    }
  }

  activeFrameIndex = startCount;
  showSequenceFrame(activeFrameIndex);
  renderFrameList();
  setButtons();
  setStatus(`已从视频生成 ${frameTotal} 张序列帧${useKeying ? "，并应用当前底色抠图参数" : ""}。`);
}

function hideCropBox() {
  cropBox.hidden = true;
}

function clearLassoSelection() {
  lassoSelection = [];
  selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
}

function updateSelectionCanvas() {
  if (!canvas.width || !canvas.height) return;
  const canvasRect = canvas.getBoundingClientRect();
  const xScale = canvasRect.width / canvas.width || 1;
  const yScale = canvasRect.height / canvas.height || 1;
  const eraserMargin = Math.ceil(Math.max(96, Number(eraserSize.value) * 1.8 / Math.max(scale, 0.05)));
  const bounds = toolSession
    ? getToolWorkspaceBounds()
    : { minX: -eraserMargin, minY: -eraserMargin, maxX: canvas.width + eraserMargin, maxY: canvas.height + eraserMargin };
  const overlayWidth = Math.max(1, Math.ceil(bounds.maxX - bounds.minX));
  const overlayHeight = Math.max(1, Math.ceil(bounds.maxY - bounds.minY));
  if (selectionCanvas.width !== overlayWidth || selectionCanvas.height !== overlayHeight) {
    selectionCanvas.width = overlayWidth;
    selectionCanvas.height = overlayHeight;
  }

  selectionCanvas.style.left = `${bounds.minX * xScale}px`;
  selectionCanvas.style.top = `${bounds.minY * yScale}px`;
  selectionCanvas.style.width = `${overlayWidth * xScale}px`;
  selectionCanvas.style.height = `${overlayHeight * yScale}px`;
  selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
  selectionCtx.save();
  selectionCtx.translate(-bounds.minX, -bounds.minY);

  if (toolSession) {
    drawToolSessionLayers(selectionCtx);
    drawToolSessionOutlines(selectionCtx);
  }

  if (lassoSelection.length >= 2) {
    selectionCtx.lineWidth = Math.max(2, 2 / Math.max(scale, 0.1));
    selectionCtx.strokeStyle = "#d99041";
    selectionCtx.fillStyle = "rgba(217, 144, 65, 0.18)";
    selectionCtx.beginPath();
    selectionCtx.moveTo(lassoSelection[0].x, lassoSelection[0].y);
    for (const point of lassoSelection.slice(1)) {
      selectionCtx.lineTo(point.x, point.y);
    }
    if (!lassoDrawing && lassoSelection.length > 2) {
      selectionCtx.closePath();
      selectionCtx.fill();
    }
    selectionCtx.stroke();
  }

  selectionCtx.restore();
}

function updateCropBox() {
  if (!cropSelection || !currentImageData || cropBox.hidden) return;
  const canvasRect = canvas.getBoundingClientRect();
  const xScale = canvasRect.width / canvas.width;
  const yScale = canvasRect.height / canvas.height;
  const viewX = cropSelection.viewX ?? cropSelection.x;
  const viewY = cropSelection.viewY ?? cropSelection.y;
  const viewWidth = cropSelection.viewWidth ?? cropSelection.width;
  const viewHeight = cropSelection.viewHeight ?? cropSelection.height;
  cropBox.style.left = `${viewX * xScale}px`;
  cropBox.style.top = `${viewY * yScale}px`;
  cropBox.style.width = `${viewWidth * xScale}px`;
  cropBox.style.height = `${viewHeight * yScale}px`;
  updateSelectionCanvas();
}

function setCropSelection(start, end) {
  clearLassoSelection();
  const rawX = Math.min(start.x, end.x);
  const rawY = Math.min(start.y, end.y);
  const rawRight = Math.max(start.x, end.x);
  const rawBottom = Math.max(start.y, end.y);
  const x = Math.max(0, rawX);
  const y = Math.max(0, rawY);
  const right = Math.min(canvas.width, rawRight);
  const bottom = Math.min(canvas.height, rawBottom);
  const width = Math.max(0, right - x);
  const height = Math.max(0, bottom - y);
  cropSelection = {
    x,
    y,
    width,
    height,
    viewX: rawX,
    viewY: rawY,
    viewWidth: Math.max(0, rawRight - rawX),
    viewHeight: Math.max(0, rawBottom - rawY)
  };
  cropWidth.value = Math.round(width);
  cropHeight.value = Math.round(height);
  cropBox.hidden = cropSelection.width < 2 || cropSelection.height < 2;
  updateCropBox();
  setButtons();
}

function clearRectangleInPlace(imageData, selection) {
  const x = Math.max(0, Math.floor(selection.x));
  const y = Math.max(0, Math.floor(selection.y));
  const right = Math.min(imageData.width, Math.ceil(selection.x + selection.width));
  const bottom = Math.min(imageData.height, Math.ceil(selection.y + selection.height));
  for (let py = y; py < bottom; py += 1) {
    for (let px = x; px < right; px += 1) imageData.data[(py * imageData.width + px) * 4 + 3] = 0;
  }
}

function applyWatermarkSelectionToAllFrames() {
  if (!cropSelection || cropSelection.width < 2 || cropSelection.height < 2 || !sequenceFrames.length || !canvas.width || !canvas.height) return;
  const normalized = {
    x: cropSelection.x / canvas.width,
    y: cropSelection.y / canvas.height,
    width: cropSelection.width / canvas.width,
    height: cropSelection.height / canvas.height
  };
  pushHistory();
  sequenceFrames.forEach((frame) => {
    const next = cloneImageData(frame.imageData);
    clearRectangleInPlace(next, {
      x: normalized.x * next.width,
      y: normalized.y * next.height,
      width: normalized.width * next.width,
      height: normalized.height * next.height
    });
    frame.imageData = next;
    invalidateFullResolutionSource(frame);
    frame.thumbnail = makeThumbnail(next);
  });
  const active = sequenceFrames[activeFrameIndex];
  if (active) {
    currentImageData = active.imageData;
    originalImageData = active.imageData;
    renderPreviewImageData(active.imageData);
  }
  cropSelection = null;
  hideCropBox();
  setClickMode("view", { silent: true });
  renderFrameList();
  if (!framePicker.hidden) renderFramePicker();
  renderWorkspaceTabs();
  setButtons();
  setStatus(`已清除所选水印区域，并应用到全部 ${sequenceFrames.length} 个序列帧。`);
}

function startShadowDrag(event) {
  if (clickMode !== "shadow" || !shadowEditor || !currentImageData) return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  shadowDragging = true;
  shadowDragOffset = {
    x: point.x - shadowEditor.centerXRatio * currentImageData.width,
    y: point.y - shadowEditor.centerYRatio * currentImageData.height
  };
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
  return true;
}

function moveShadowDrag(event) {
  if (clickMode !== "shadow" || !shadowDragging || !shadowEditor || !currentImageData) return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  const x = point.x - (shadowDragOffset?.x || 0);
  const y = point.y - (shadowDragOffset?.y || 0);
  shadowEditor.centerXRatio = x / currentImageData.width;
  shadowEditor.centerYRatio = y / currentImageData.height;
  drawImageData(currentImageData);
  event.preventDefault();
  return true;
}

function endShadowDrag(event) {
  if (clickMode !== "shadow" || !shadowDragging) return false;
  shadowDragging = false;
  shadowDragOffset = null;
  event.currentTarget.releasePointerCapture?.(event.pointerId);
  event.preventDefault();
  setStatus("阴影位置已调整。可继续拖动或调节强度、大小，然后点击“确认底部阴影”。");
  return true;
}


function peelRectangleIntoToolSession(selection) {
  const session = ensureToolSession("crop");
  if (!session || !selection || selection.width < 4 || selection.height < 4) return false;
  const x = Math.max(0, Math.floor(selection.x));
  const y = Math.max(0, Math.floor(selection.y));
  const right = Math.min(session.width, Math.ceil(selection.x + selection.width));
  const bottom = Math.min(session.height, Math.ceil(selection.y + selection.height));
  if (right - x < 4 || bottom - y < 4) return false;
  const itemData = cropImageData(session.workingBase, { x, y, width: right - x, height: bottom - y });
  clearRectangleInPlace(session.workingBase, { x, y, width: right - x, height: bottom - y });
  const item = { id: `tool-item-${session.id}-${session.items.length + 1}`, kind: "crop", imageData: itemData, x, y, sourceX: x, sourceY: y };
  session.items.push(item);
  session.activeItemId = item.id;
  cropSelection = null;
  hideCropBox();
  renderToolSessionPreview();
  updateSelectionCanvas();
  updateToolSessionUi();
  setButtons();
  setStatus(`已生成第 ${session.items.length} 个矩形裁剪浮动图层。可在整个画布工作区拖动，完成后统一保存。`);
  return true;
}

function peelLassoIntoToolSession() {
  const session = ensureToolSession("lasso");
  if (!session || lassoSelection.length < 3) return false;
  const bounds = lassoBoundsForImage(session.workingBase);
  if (!bounds || bounds.width < 4 || bounds.height < 4) return false;
  const itemData = new ImageData(bounds.width, bounds.height);
  for (let y = bounds.y; y < bounds.y + bounds.height; y += 1) {
    for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) {
      if (!isPointInPolygon(x + 0.5, y + 0.5, lassoSelection)) continue;
      const si = (y * session.width + x) * 4;
      const ti = ((y - bounds.y) * bounds.width + (x - bounds.x)) * 4;
      itemData.data[ti] = session.workingBase.data[si];
      itemData.data[ti + 1] = session.workingBase.data[si + 1];
      itemData.data[ti + 2] = session.workingBase.data[si + 2];
      itemData.data[ti + 3] = session.workingBase.data[si + 3];
      session.workingBase.data[si + 3] = 0;
    }
  }
  const item = { id: `tool-item-${session.id}-${session.items.length + 1}`, kind: "crop", imageData: itemData, x: bounds.x, y: bounds.y, sourceX: bounds.x, sourceY: bounds.y };
  session.items.push(item);
  session.activeItemId = item.id;
  clearLassoSelection();
  renderToolSessionPreview();
  updateSelectionCanvas();
  updateToolSessionUi();
  setButtons();
  setStatus(`已生成第 ${session.items.length} 个自由裁剪浮动图层。可在整个画布工作区拖动，完成后统一保存。`);
  return true;
}

function startCropDrag(event) {
  if (clickMode !== "crop" && clickMode !== "watermark") return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  didCropDrag = false;
  cropDragStart = point;
  cropSelection = { x: point.x, y: point.y, width: 0, height: 0, viewX: point.x, viewY: point.y, viewWidth: 0, viewHeight: 0 };
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
  return true;
}

function moveCropDrag(event) {
  if ((clickMode !== "crop" && clickMode !== "watermark") || !cropDragStart) return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  didCropDrag = true;
  setCropSelection(cropDragStart, point);
  event.preventDefault();
  return true;
}

function endCropDrag(event) {
  if ((clickMode !== "crop" && clickMode !== "watermark") || !cropDragStart) return false;
  const point = getLooseCanvasPoint(event);
  if (point) setCropSelection(cropDragStart, point);
  cropDragStart = null;
  event.currentTarget.releasePointerCapture?.(event.pointerId);
  event.preventDefault();
  if (cropSelection && cropSelection.width >= 4 && cropSelection.height >= 4) {
    if (clickMode === "watermark") applyWatermarkSelectionToAllFrames();
    else peelRectangleIntoToolSession(cropSelection);
  }
  return true;
}

function startEraserDrag(event) {
  if (clickMode !== "eraser") return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  pushHistory();
  if (!prepareCurrentImageForEraser()) return false;
  eraserDrawing = true;
  eraserPreviewPoint = point;
  lastEraserPoint = point;
  event.currentTarget.setPointerCapture?.(event.pointerId);
  updateEraserCursor(event);
  applyEraserAt(point);
  event.preventDefault();
  return true;
}

function moveEraserDrag(event) {
  if (clickMode !== "eraser") return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  eraserPreviewPoint = point;
  updateEraserCursor(event);
  if (eraserDrawing) {
    applyEraserAt(point);
  }
  event.preventDefault();
  return true;
}

function endEraserDrag(event) {
  if (clickMode !== "eraser" || !eraserDrawing) return false;
  eraserDrawing = false;
  event.currentTarget.releasePointerCapture?.(event.pointerId);
  lastEraserPoint = null;
  const editable = currentEditableImageTarget();
  if (editable?.kind === "sequence") {
    editable.target.thumbnail = makeThumbnail(editable.target.imageData);
    renderFrameList();
    if (!framePicker.hidden) renderFramePicker();
  } else if (editable?.kind === "result") {
    editable.target.thumbnail = makeThumbnail(editable.target.imageData);
    renderAssetList();
    renderWorkspaceTabs();
  }
  setButtons();
  setStatus("已直接修改当前图；原始图片的初始像素仍保留在“原图”视图中。");
  event.preventDefault();
  return true;
}

function startBrushDrag(event) {
  if (clickMode !== "brush") return false;
  if (event.button !== 0 && event.button !== 2) return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  brushPreviewPoint = point;
  updateBrushCursor(event, { erase: event.button === 2 });
  if (event.button === 2) {
    clearBrushLongPressTimer();
    brushLongPressPoint = null;
    brushLongPressMoved = false;
    brushLongPressActive = false;
    hideBrushPickIndicator();
    if (!beginBrushStroke(true, point, event)) return false;
    event.preventDefault();
    return true;
  }
  clearBrushLongPressTimer();
  brushLongPressMoved = false;
  brushLongPressActive = false;
  brushLongPressPoint = point;
  brushLongPressClient = { clientX: event.clientX, clientY: event.clientY };
  showBrushPickLoading(event.clientX, event.clientY, point);
  brushLongPressTimer = window.setTimeout(() => {
    brushLongPressTimer = null;
    if (clickMode !== "brush" || brushLongPressMoved || !brushLongPressPoint) return;
    brushLongPressActive = true;
    pickBrushColorFromPoint(brushLongPressPoint, brushLongPressClient);
  }, 1000);
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
  return true;
}

function moveBrushDrag(event) {
  if (clickMode !== "brush") return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  brushPreviewPoint = point;
  updateBrushCursor(event, { erase: brushErasing || event.buttons === 2 });
  if (!brushDrawing && brushLongPressPoint && !brushLongPressActive) {
    const distance = Math.hypot(point.x - brushLongPressPoint.x, point.y - brushLongPressPoint.y);
    if (distance >= Math.max(2, brushImageRadius() * 0.35)) {
      brushLongPressMoved = true;
      clearBrushLongPressTimer();
      hideBrushPickIndicator();
      beginBrushStroke(false, point, event);
    } else {
      brushLongPressPoint = point;
      brushLongPressClient = { clientX: event.clientX, clientY: event.clientY };
      showBrushPickLoading(event.clientX, event.clientY, point);
    }
  } else if (brushDrawing) {
    applyBrushAt(point, { erase: brushErasing });
  }
  event.preventDefault();
  return true;
}

function endBrushDrag(event) {
  if (clickMode !== "brush") return false;
  if (brushDrawing) {
    brushDrawing = false;
    brushErasing = false;
    lastBrushPoint = null;
    brushPointerId = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    finalizeDirectCanvasEdit("已完成画笔修改。左键可继续画，右键可擦除，左键双击可油漆桶填充。");
    event.preventDefault();
    return true;
  }
  if (event.button === 0 && brushLongPressPoint) {
    const point = getLooseCanvasPoint(event) || brushLongPressPoint;
    const picked = brushLongPressActive;
    clearBrushLongPressTimer();
    brushLongPressPoint = null;
    brushLongPressClient = null;
    brushLongPressMoved = false;
    brushLongPressActive = false;
    if (!picked) {
      hideBrushPickIndicator();
      if (beginBrushStroke(false, point, event)) {
        brushDrawing = false;
        lastBrushPoint = null;
        brushPointerId = null;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
        finalizeDirectCanvasEdit("已完成画笔修改。左键可继续画，右键可擦除，左键双击可油漆桶填充。");
      }
    } else {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    event.preventDefault();
    return true;
  }
  return false;
}

function startLassoDrag(event) {
  if (clickMode !== "lasso") return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  lassoDrawing = true;
  lassoSelection = [point];
  cropSelection = null;
  hideCropBox();
  event.currentTarget.setPointerCapture?.(event.pointerId);
  updateSelectionCanvas();
  event.preventDefault();
  return true;
}

function moveLassoDrag(event) {
  if (clickMode !== "lasso" || !lassoDrawing) return false;
  const point = getLooseCanvasPoint(event);
  if (!point) return false;
  const previous = lassoSelection[lassoSelection.length - 1];
  if (!previous || Math.hypot(point.x - previous.x, point.y - previous.y) >= 2) {
    lassoSelection.push(point);
    updateSelectionCanvas();
    setButtons();
  }
  event.preventDefault();
  return true;
}

function endLassoDrag(event) {
  if (clickMode !== "lasso" || !lassoDrawing) return false;
  const point = getLooseCanvasPoint(event);
  if (point) lassoSelection.push(point);
  lassoDrawing = false;
  event.currentTarget.releasePointerCapture?.(event.pointerId);
  updateSelectionCanvas();
  setButtons();
  if (lassoSelection.length >= 3) peelLassoIntoToolSession();
  event.preventDefault();
  return true;
}

input.addEventListener("change", () => loadFiles(input.files));
videoInput.addEventListener("change", () => loadVideoFile(videoInput.files[0]));
alphaWhiteSlot?.addEventListener("click", () => openOriginalSourcePicker("white"));
alphaBlackSlot?.addEventListener("click", () => openOriginalSourcePicker("black"));
dualAlphaSourceSlot?.addEventListener("click", () => openOriginalSourcePicker("dual"));
closeOriginalSourcePickerBtn?.addEventListener("click", closeOriginalSourcePicker);
clearOriginalSourceChoiceBtn?.addEventListener("click", clearOriginalSourceChoice);
originalSourcePicker?.addEventListener("click", (event) => {
  if (event.target === originalSourcePicker) closeOriginalSourcePicker();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sheetAlignmentDialog && !sheetAlignmentDialog.hidden) {
    event.preventDefault();
    closeSheetAlignmentDialog(null);
    return;
  }
  if (event.key === "Escape" && originalSourcePicker && !originalSourcePicker.hidden) closeOriginalSourcePicker();
});

stage.addEventListener("dragover", (event) => {
  event.preventDefault();
  stage.classList.add("dragging");
});

stage.addEventListener("dragleave", () => stage.classList.remove("dragging"));

stage.addEventListener("drop", (event) => {
  event.preventDefault();
  stage.classList.remove("dragging");
  loadFiles(event.dataTransfer.files);
});

stage.addEventListener("wheel", (event) => {
  if (!event.ctrlKey && !event.altKey) return;
  event.preventDefault();
  zoomCanvasAt(event);
}, { passive: false });

stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 && !(clickMode === "brush" && event.button === 2)) return;
  if (event.target === canvas || event.target === selectionCanvas) return;
  hideBrushSizePopover();
  hideEraserSizePopover();
  if (startToolItemDrag(event)) return;
  if (startShadowDrag(event)) return;
  if (startBrushDrag(event)) return;
  if (startEraserDrag(event)) return;
  if (startLassoDrag(event)) return;
  startCropDrag(event);
});

stage.addEventListener("pointermove", (event) => {
  if (moveToolItemDrag(event)) return;
  if (moveShadowDrag(event)) return;
  if (moveBrushDrag(event)) return;
  if (moveEraserDrag(event)) return;
  if (moveLassoDrag(event)) return;
  moveCropDrag(event);
});

stage.addEventListener("pointerup", (event) => {
  if (endToolItemDrag(event)) return;
  if (endShadowDrag(event)) return;
  if (endBrushDrag(event)) return;
  if (endEraserDrag(event)) return;
  if (endLassoDrag(event)) return;
  endCropDrag(event);
});

stage.addEventListener("pointerleave", () => {
  if (clickMode === "eraser" && !eraserDrawing) {
    eraserCursor.classList.remove("visible");
  }
  if (clickMode === "brush" && !brushDrawing) {
    brushCursor.classList.remove("visible");
    hideBrushMagnifier();
  }
});

stage.addEventListener("contextmenu", (event) => {
  if (clickMode === "brush") {
    event.preventDefault();
    return;
  }
  cancelToolItemAtEvent(event);
});

canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 && !(clickMode === "brush" && event.button === 2)) return;
  hideBrushSizePopover();
  hideEraserSizePopover();
  if (startToolItemDrag(event)) return;
  if (startShadowDrag(event)) return;
  if (startBrushDrag(event)) return;
  if (startEraserDrag(event)) return;
  if (startLassoDrag(event)) return;
  if (startCropDrag(event)) return;
});

canvas.addEventListener("pointermove", (event) => {
  if (moveToolItemDrag(event)) return;
  if (moveShadowDrag(event)) return;
  if (moveBrushDrag(event)) return;
  if (moveEraserDrag(event)) return;
  if (moveLassoDrag(event)) return;
  if (moveCropDrag(event)) return;
});

canvas.addEventListener("pointerup", (event) => {
  if (endToolItemDrag(event)) return;
  if (endShadowDrag(event)) return;
  if (endBrushDrag(event)) return;
  if (endEraserDrag(event)) return;
  if (endLassoDrag(event)) return;
  if (endCropDrag(event)) return;
});

canvas.addEventListener("click", (event) => {
  if (clickMode === "brush" || clickMode === "eraser") {
    return;
  }


  if (clickMode === "lasso") {
    setStatus("请按住鼠标自由圈选区域，松开后保存到处理结果库。");
    return;
  }

  if (clickMode === "watermark") {
    if (didCropDrag) { didCropDrag = false; return; }
    setStatus("请拖拽框选水印区域；松开后会自动应用到全部序列帧。");
    return;
  }

  if (clickMode === "shadow") return;

  if (clickMode === "crop") {
    if (didCropDrag) {
      didCropDrag = false;
      return;
    }
    setStatus("请拖拽框选裁剪区域。");
    return;
  }

  if (clickMode === "extract") {
    if (toolItemPointerHandled) { toolItemPointerHandled = false; return; }
    const point = getCanvasPoint(event);
    if (point) void extractConnectedSubject(point);
    return;
  }

  if (clickMode !== "pick") return;


  const color = getPickedColor(event);
  if (!color) return;
  const duplicate = pickedColors.some((item) => (
    Math.abs(item.r - color.r) + Math.abs(item.g - color.g) + Math.abs(item.b - color.b) < 8
  ));
  if (!duplicate) {
    pickedColors.push(color);
    invalidateLiveDistanceCache({ keepTarget: true, keepProxy: true });
  }
  renderSwatches();

  // Start live cutout mode immediately after the first picked color.
  // This makes tolerance / softness sliders update the result in real time
  // without requiring the user to click the remove button first.
  if (!liveBaseImageData && currentImageData) {
    pushHistory();
    liveBaseImageData = cloneImageData(currentImageData);
    livePreviewSourceTarget = currentSourceRecord()?.target || selectedFrame() || activeLibraryTarget || null;
    invalidateLiveDistanceCache({ keepTarget: true });
  }
  scheduleLivePreview({ fast: true });

  saveActiveImage();
  setButtons();
  setStatus(`已取色 RGB(${color.r}, ${color.g}, ${color.b})。拖动颜色容差或边缘柔化会实时预览。`);
});

canvas.addEventListener("dblclick", (event) => {
  if (clickMode !== "brush" || event.button === 2) return;
  clearBrushLongPressTimer();
  brushLongPressPoint = null;
  brushLongPressMoved = false;
  brushLongPressActive = false;
  hideBrushPickIndicator();
  const point = getLooseCanvasPoint(event);
  if (!point) return;
  event.preventDefault();
  floodFillCurrentImage(point);
});

canvas.addEventListener("pointerleave", () => {
  if (clickMode === "eraser" && !eraserDrawing) {
    eraserPreviewPoint = null;
    eraserCursor.classList.remove("visible");
  }
  if (clickMode === "brush" && !brushDrawing) {
    brushPreviewPoint = null;
    brushCursor.classList.remove("visible");
    hideBrushMagnifier();
  }
});

tolerance.addEventListener("input", () => scheduleLivePreview({ fast: true }));
softness.addEventListener("input", () => scheduleLivePreview({ fast: true }));
tolerance.addEventListener("change", () => scheduleLivePreview({ fast: true }));
softness.addEventListener("change", () => scheduleLivePreview({ fast: true }));
contiguous.addEventListener("change", () => scheduleLivePreview({ fast: true }));
forceRemoveColor?.addEventListener("change", () => scheduleLivePreview({ fast: true }));
removeBtn.addEventListener("click", removeColors);
undoBtn.addEventListener("click", undo);
redoBtn?.addEventListener("click", redo);
resetBtn.addEventListener("click", reset);
document.querySelector("#openExportDialogBtn")?.addEventListener("click", () => prepareExportRenameStep({ force: true }));
exportBaseName?.addEventListener("input", () => {
  exportBaseName.dataset.autofill = "false";
});
exportBaseName?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  if (!downloadBtn.disabled) void exportCurrentSelection();
});

downloadBtn.addEventListener("click", () => void exportCurrentSelection());
downloadAllBtn?.addEventListener("click", downloadAll);
chooseExportLocationBtn.addEventListener("click", chooseExportLocation);
clearExportLocationBtn.addEventListener("click", clearExportLocation);
exportSizePreset?.addEventListener("change", () => {
  updateExportSizeControls();
  setStatus(exportSizePreset.value === "original"
    ? "导出尺寸已设为原始尺寸。"
    : "导出时将按所选尺寸高质量等比缩放，并用透明像素补边。");
});
exportWidth?.addEventListener("change", () => {
  exportWidth.value = clampExportDimension(exportWidth.value, 32);
});
exportHeight?.addEventListener("change", () => {
  exportHeight.value = clampExportDimension(exportHeight.value, 32);
});
fitBtn.addEventListener("click", () => fitCanvas(true));
checkerBgBtn.addEventListener("click", () => setCanvasBackground("checker"));
darkBgBtn.addEventListener("click", () => setCanvasBackground("dark"));
lightBgBtn.addEventListener("click", () => setCanvasBackground("light"));
greenBgBtn.addEventListener("click", () => setCanvasBackground("green"));
customBgColor.addEventListener("input", () => setCanvasBackground("custom", customBgColor.value));
pickModeBtn.addEventListener("click", () => setClickMode("pick"));
extractModeBtn.addEventListener("click", () => setClickMode("extract"));
cancelToolBtn?.addEventListener("click", () => cancelActiveToolSession());
finishToolBtn?.addEventListener("click", () => void finishToolSession());
cropModeBtn.addEventListener("click", () => setClickMode("crop"));
lassoModeBtn.addEventListener("click", () => setClickMode("lasso"));
brushModeBtn?.addEventListener("click", () => {
  setClickMode("brush");
  showBrushSizePopover();
});
brushPanelModeBtn?.addEventListener("click", () => {
  hideBrushSizePopover();
  hideEraserSizePopover();
  setClickMode("brush");
});
eraserPanelModeBtn?.addEventListener("click", () => {
  hideBrushSizePopover();
  hideEraserSizePopover();
  setClickMode("eraser");
});
createBlankCanvasBtn?.addEventListener("click", () => createBlankDrawingCanvas());
createColorCanvasBtn?.addEventListener("click", () => createCurrentColorCanvas());
clearCurrentCanvasBtn?.addEventListener("click", () => clearCurrentDrawingCanvas());
newCanvasWidth?.addEventListener("change", () => { newCanvasWidth.value = String(clampCanvasDimension(newCanvasWidth.value, 512)); });
newCanvasHeight?.addEventListener("change", () => { newCanvasHeight.value = String(clampCanvasDimension(newCanvasHeight.value, 512)); });
brushPaletteColor?.addEventListener("input", () => {
  const parsed = hexToRgbColor(brushPaletteColor.value, brushColor.a ?? 255);
  if (!parsed) return;
  brushColor = parsed;
  updateRangeLabels();
  syncBrushPaletteFromColor();
  setStatus(`已更新画笔颜色为 ${brushPaletteColor.value.toUpperCase()}。`);
});
brushHueRange?.addEventListener("input", () => {
  brushPaletteHue = Number(brushHueRange.value) || 0;
  brushColor = hsvToRgbColor(brushPaletteHue, brushPaletteSaturation, brushPaletteValue, brushColor.a ?? 255);
  updateRangeLabels();
  updateBrushPalettePresentation();
  drawBrushColorPalette();
});
brushColorPalette?.addEventListener("pointerdown", (event) => {
  brushPaletteDragging = true;
  brushColorPalette.setPointerCapture?.(event.pointerId);
  setBrushColorFromPalettePoint(event);
  event.preventDefault();
});
brushColorPalette?.addEventListener("pointermove", (event) => {
  if (!brushPaletteDragging) return;
  setBrushColorFromPalettePoint(event);
  event.preventDefault();
});
brushColorPalette?.addEventListener("pointerup", (event) => {
  if (!brushPaletteDragging) return;
  brushPaletteDragging = false;
  brushColorPalette.releasePointerCapture?.(event.pointerId);
  setBrushColorFromPalettePoint(event);
  event.preventDefault();
});
brushColorPalette?.addEventListener("pointercancel", () => {
  brushPaletteDragging = false;
});
brushSize?.addEventListener("input", () => {
  if (brushPanelSize && document.activeElement !== brushPanelSize) brushPanelSize.value = brushSize.value;
  updateRangeLabels();
  const pixelPrecision = Number(brushSize.value) <= 1;
  brushCursor.classList.toggle("pixel-precision", pixelPrecision);
  brushCursor.style.width = `${pixelPrecision ? 10 : Math.max(6, Number(brushSize.value))}px`;
  brushCursor.style.height = `${pixelPrecision ? 10 : Math.max(6, Number(brushSize.value))}px`;
});
brushPanelSize?.addEventListener("input", () => {
  if (brushSize) brushSize.value = brushPanelSize.value;
  updateRangeLabels();
  const pixelPrecision = Number(brushPanelSize.value) <= 1;
  brushCursor.classList.toggle("pixel-precision", pixelPrecision);
  brushCursor.style.width = `${pixelPrecision ? 10 : Math.max(6, Number(brushPanelSize.value))}px`;
  brushCursor.style.height = `${pixelPrecision ? 10 : Math.max(6, Number(brushPanelSize.value))}px`;
});
eraserModeBtn.addEventListener("click", () => {
  setClickMode("eraser");
  showEraserSizePopover();
});
eraserSize.addEventListener("input", () => {
  updateRangeLabels();
  const pixelPrecision = Number(eraserSize.value) <= 1;
  eraserCursor.classList.toggle("pixel-precision", pixelPrecision);
  eraserCursor.style.width = `${pixelPrecision ? 10 : Math.max(6, Number(eraserSize.value))}px`;
  eraserCursor.style.height = `${pixelPrecision ? 10 : Math.max(6, Number(eraserSize.value))}px`;
});
rotateLeftBtn.addEventListener("click", () => rotateItems("left"));
rotateRightBtn.addEventListener("click", () => rotateItems("right"));
flipHorizontalBtn.addEventListener("click", () => flipItems("horizontal"));
flipVerticalBtn.addEventListener("click", () => flipItems("vertical"));
smoothEdgesBtn.addEventListener("click", smoothEdges);
addShadowBtn.addEventListener("click", addGroundShadow);
shadowStrength?.addEventListener("input", updateShadowEditorFromControls);
shadowSize?.addEventListener("input", updateShadowEditorFromControls);
removeWatermarkBtn?.addEventListener("click", () => {
  if (!sequenceFrames.length) return;
  setProcessingSource("sequence", { announce: false });
  if (activeFrameIndex < 0) {
    const selectedIndex = sequenceFrames.findIndex((frame) => frame.selected);
    showSequenceFrame(selectedIndex >= 0 ? selectedIndex : 0, false);
  }
  cropSelection = null;
  hideCropBox();
  setClickMode("watermark");
});
addOutlineBtn.addEventListener("click", addOutline);
outlineStrength?.addEventListener("input", () => scheduleOutlinePreview({ fast: true }));
outlineColor?.addEventListener("input", () => scheduleOutlinePreview({ fast: true }));
outlineStrength?.addEventListener("change", () => scheduleOutlinePreview({ fast: true }));
outlineColor?.addEventListener("change", () => scheduleOutlinePreview({ fast: true }));
iconifyResizeBtn?.addEventListener("click", iconifyResize);
contourPixelizeBtn?.addEventListener("click", applyContourPixelize);
contourPixelSizePreset?.addEventListener("change", updateContourPixelControls);
contourPixelPadding?.addEventListener("input", updateContourPixelControls);
contourPixelStrength?.addEventListener("input", updateContourPixelControls);
contourPixelClusterCleanup?.addEventListener("input", updateContourPixelControls);
contourPixelDetailProtection?.addEventListener("input", updateContourPixelControls);
contourPixelBgTolerance?.addEventListener("input", updateContourPixelControls);
contourPixelWidth?.addEventListener("change", () => {
  contourPixelWidth.value = clampContourPixelDimension(contourPixelWidth.value, 64);
});
contourPixelHeight?.addEventListener("change", () => {
  contourPixelHeight.value = clampContourPixelDimension(contourPixelHeight.value, 64);
});
iconifySizePreset?.addEventListener("change", updateIconifySizeControls);
iconifyKeepPadding?.addEventListener("change", () => {
  setStatus(iconifyKeepPadding.checked ? "像素图标化时会额外保留透明边。" : "像素图标化时不额外留边，并保持主体比例。");
});
iconifyWidth?.addEventListener("change", () => {
  iconifyWidth.value = clampIconDimension(iconifyWidth.value, 64);
});
iconifyHeight?.addEventListener("change", () => {
  iconifyHeight.value = clampIconDimension(iconifyHeight.value, 64);
});
exportKeepPadding?.addEventListener("change", () => {
  setStatus(exportKeepPadding.checked ? "导出缩放会保留透明边。" : "导出缩放会裁掉透明边并铺满目标尺寸。");
});
exportGreenScreen?.addEventListener("change", () => {
  setStatus(exportGreenScreen.checked ? "导出时会将所有透明区域填充为纯绿色绿幕背景。" : "已关闭绿幕导出，透明区域将继续保持透明。");
});
centerCropBtn.addEventListener("click", centerCrop);

processingSourceButtons.forEach((button) => {
  button.addEventListener("click", () => setProcessingSource(button.dataset.processingSource, { focusLibrary: true }));
});
renameImageBtn.addEventListener("click", renameOriginalImages);
addOriginalsToSequenceBtn.addEventListener("click", addSelectedFrames);
renameAssetBtn.addEventListener("click", renameProcessedAssets);
addAssetsToSequenceBtn.addEventListener("click", addAssetsToSequence);
sequenceImageInput.addEventListener("change", () => importSequenceFiles(sequenceImageInput.files));
normalizeFramesBtn.addEventListener("click", normalizeSequenceFramesBottom);
saveFramesToResultsBtn.addEventListener("click", saveFramesToResults);
closeImagePreviewBtn?.addEventListener("click", closeImagePreview);
imagePreviewModal?.addEventListener("click", (event) => { if (event.target === imagePreviewModal) closeImagePreview(); });

deleteBlockBtn.addEventListener("click", deleteSelectedBlock);
applyAllFrameEffectsBtn.addEventListener("click", applyAllFrameEffects);
alignFramesBtn.addEventListener("click", alignSequenceSubjects);
playFramesBtn.addEventListener("click", togglePlayback);
previousSequenceFrameBtn?.addEventListener("click", () => showAdjacentSequenceFrame(-1));
nextSequenceFrameBtn?.addEventListener("click", () => showAdjacentSequenceFrame(1));
sequenceProgressInput?.addEventListener("input", () => {
  const index = Math.max(0, Math.min(sequenceFrames.length - 1, Number(sequenceProgressInput.value) || 0));
  stopPlayback();
  showSequenceFrame(index, false);
});
copyCurrentFrameBtn?.addEventListener("click", copyCurrentSequenceFrame);
openFramePickerFromBarBtn?.addEventListener("click", openFramePicker);
exportFramesBtn?.addEventListener("click", exportSequenceFrames);
exportZipBtn?.addEventListener("click", exportSequenceZip);
exportSheetBtn.addEventListener("click", () => void exportCurrentSelectionSheet());
exportSheetAlignedBtn?.addEventListener("click", () => closeSheetAlignmentDialog("aligned"));
exportSheetOriginalBtn?.addEventListener("click", () => closeSheetAlignmentDialog("original"));
cancelSheetExportBtn?.addEventListener("click", () => closeSheetAlignmentDialog(null));
sheetAlignmentDialog?.addEventListener("click", (event) => {
  if (event.target === sheetAlignmentDialog) closeSheetAlignmentDialog(null);
});
selectAllAssetsBtn.addEventListener("click", () => {
  selectAllLibraryItems("result", assetLibrary);
  renderAssetList();
  setButtons();
  setStatus(`已全选 ${assetLibrary.length} 个处理结果。`);
});
clearAssetSelectionBtn.addEventListener("click", () => {
  clearLibrarySelection("result", assetLibrary);
  renderAssetList();
  setButtons();
  setStatus("已取消处理结果选择。");
});
removeUnselectedAssetsBtn?.addEventListener("click", removeUnselectedAssets);
trimTransparentBtn.addEventListener("click", trimTransparentEdges);
cleanPseudoAlphaBtn.addEventListener("click", cleanPseudoTransparentBackground);
splitDualAlphaBtn.addEventListener("click", splitCurrentDualAlphaSource);
rebuildAlphaBtn?.addEventListener("click", rebuildAlphaPairImage);
fillInternalPixelsBtn.addEventListener("click", fillInternalTransparentPixelHoles);
exportAssetsZipBtn?.addEventListener("click", exportAssetsZip);
clearAssetsBtn.addEventListener("click", () => {
  if (assetLibrary.length === 0) return;
  pushHistory();
  const removed = new Set(assetLibrary);
  assetLibrary = [];
  workspaceTabs = workspaceTabs.filter((tab) => !removed.has(tab.target));
  if (removed.has(activeLibraryTarget)) {
    activeLibraryTarget = null;
    activeWorkspaceTabId = "";
  }
  repairWorkspaceAfterAssetRemoval();
  renderAssetList();
  renderWorkspaceTabs();
  setButtons();
  setStatus("已清空素材库。");
});
autoNameAssets.addEventListener("change", () => {
  setStatus(autoNameAssets.checked
    ? "已开启自动识别文字命名，新提取素材将自动识别名称。"
    : "已关闭自动识别文字命名，新提取素材将使用默认名称。");
});
removeRecognizedText.addEventListener("change", () => {
  setStatus(removeRecognizedText.checked
    ? "已开启识别后删除图片文字。"
    : "已关闭识别后删除图片文字，仅使用文字命名素材。");
});
ocrSelfTestBtn?.addEventListener("click", testOcrRuntime);
selectAllFramesBtn.addEventListener("click", () => {
  selectAllLibraryItems("sequence", sequenceFrames);
  renderFrameList();
  if (!framePicker.hidden) renderFramePicker();
  setButtons();
  setStatus(`已全选 ${sequenceFrames.length} 个序列帧。`);
});
clearFrameSelectionBtn.addEventListener("click", () => {
  clearLibrarySelection("sequence", sequenceFrames);
  renderFrameList();
  if (!framePicker.hidden) renderFramePicker();
  setButtons();
  setStatus("已取消序列帧选择。");
});
openFramePickerBtn.addEventListener("click", openFramePicker);
findDuplicateFramesBtn.addEventListener("click", findDuplicateSequenceFrames);
clearSequenceBtn.addEventListener("click", clearSequenceFrames);
closeFramePickerBtn.addEventListener("click", closeFramePicker);
framePicker.addEventListener("click", (event) => {
  if (event.target === framePicker) closeFramePicker();
});
pickerSelectAllBtn.addEventListener("click", () => {
  selectAllLibraryItems("sequence", sequenceFrames);
  renderFramePicker();
  renderFrameList();
  setButtons();
});
pickerClearBtn.addEventListener("click", () => {
  clearLibrarySelection("sequence", sequenceFrames);
  renderFramePicker();
  renderFrameList();
  setButtons();
});
pickerInvertBtn.addEventListener("click", () => {
  sequenceFrames.forEach((frame) => {
    if (frame.selected) {
      frame.selected = false;
      frame.order = 0;
    } else {
      frame.selected = true;
      frame.order = ++frameSelectionOrder;
    }
  });
  frameSelectionOrder = normalizeSelectionOrders(sequenceFrames);
  renderFramePicker();
  renderFrameList();
  setButtons();
});
extractVideoBtn.addEventListener("click", extractVideoFrames);
extractSheetBtn.addEventListener("click", extractSpriteSheetFrames);
autoExtractSubjectsBtn.addEventListener("click", autoExtractSubjectsFromSheet);
transparentAutoExtract?.addEventListener("change", () => {
  setStatus(transparentAutoExtract.checked
    ? "自动提取主体已切换为透明背景模式：只按透明度分离，不识别背景颜色。"
    : "自动提取主体已切换为普通模式：会识别并清除背景颜色。");
});
frameDelayInput?.addEventListener("change", () => {
  const frame = activeFrameIndex >= 0 ? sequenceFrames[activeFrameIndex] : null;
  if (!frame) return;
  const delayMs = Math.max(0, Math.min(maxFrameDelayMs, Math.round(Number(frameDelayInput.value) || 0)));
  if (delayMs === normalizedFrameDelayMs(frame)) {
    frameDelayInput.value = String(delayMs);
    return;
  }
  const wasPlaying = Boolean(playbackTimer);
  pushHistory();
  frame.delayMs = delayMs;
  frameDelayInput.value = String(delayMs);
  renderFrameList();
  if (!framePicker.hidden) renderFramePicker();
  if (wasPlaying) {
    stopPlayback();
    togglePlayback();
  } else {
    setButtons();
  }
  setStatus(delayMs
    ? `第 ${activeFrameIndex + 1} 帧将额外停留 ${delayMs} 毫秒。`
    : `第 ${activeFrameIndex + 1} 帧已恢复为普通播放时长。`);
});

fpsInput.addEventListener("change", () => {
  if (playbackTimer) {
    stopPlayback();
    togglePlayback();
  }
});
selectAllBtn.addEventListener("click", () => {
  selectAllLibraryItems("original", images);
  renderImageList();
  setButtons();
  setStatus(`已全选 ${images.length} 张原始图片。`);
});
clearSelectionBtn.addEventListener("click", () => {
  clearLibrarySelection("original", images);
  renderImageList();
  setButtons();
  setStatus("已取消原始图片选择。");
});
clearVideoBtn.addEventListener("click", clearVideo);

clearColors.addEventListener("click", () => {
  pickedColors = [];
  invalidateLiveDistanceCache();
  if (selectedFrame()) {
    renderSwatches();
    setButtons();
    setStatus("已清空当前序列帧的取色。");
    return;
  }
  if (liveBaseImageData) {
    currentImageData = cloneImageData(liveBaseImageData);
    liveBaseImageData = null;
  }
  renderSwatches();
  renderCanvas();
  saveActiveImage();
  setButtons();
  setStatus("已清空取色。");
});

resultTab.addEventListener("click", () => {
  showResultMode();
  renderCanvas();
});

originalTab.addEventListener("click", () => {
  if (!originalImageData) return;
  showOriginal = true;
  originalTab.classList.add("active");
  resultTab.classList.remove("active");
  renderCanvas();
});

window.addEventListener("resize", scheduleCanvasLayout);
window.visualViewport?.addEventListener("resize", scheduleCanvasLayout);
if (window.ResizeObserver) {
  new ResizeObserver(scheduleCanvasLayout).observe(stage);
}
stage.addEventListener("scroll", updateCropBox);
document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const isUndo = (event.ctrlKey || event.metaKey) && key === "z" && !event.shiftKey;
  const isRedo = (event.ctrlKey || event.metaKey) && (key === "y" || (event.shiftKey && key === "z"));
  const isExtractAsset = event.code === "Space" && !event.ctrlKey && !event.metaKey && !event.altKey;
  const isCancelTool = event.key === "Escape" && Boolean(toolSession);
  const isDelete = event.key === "Delete" && !event.ctrlKey && !event.metaKey && !event.altKey;
  if (!isUndo && !isRedo && !isExtractAsset && !isCancelTool && !isDelete) return;

  const target = event.target;
  const isTextInput = target && (
    target.tagName === "TEXTAREA"
    || target.tagName === "SELECT"
    || target.isContentEditable
    || (target.tagName === "INPUT" && !["checkbox", "radio", "button", "submit", "reset", "range"].includes(target.type))
  );
  if (isTextInput || !imagePreviewModal?.hidden || !framePicker?.hidden || !originalSourcePicker?.hidden || document.querySelector(".app-modal:not([hidden])")) return;

  event.preventDefault();
  event.stopPropagation();
  if (isCancelTool) {
    cancelActiveToolSession();
  } else if (isDelete) {
    const kind = document.body.dataset.activeLibrary || activeLibraryKind || processingSource;
    if (kind === "sequence") deleteFrame();
    else if (kind === "result") deleteSelectedAssets();
    else deleteSelectedImages();
  } else if (isExtractAsset) {
    if (finishToolBtn && !finishToolBtn.disabled) void finishToolSession();
  } else if (isUndo) {
    undo();
  } else {
    redo();
  }
}, true);

openFeedbackDialogBtn?.addEventListener("click", () => {
  if (feedbackSubmitStatus) feedbackSubmitStatus.textContent = "";
  if (feedbackFallbackBtn) feedbackFallbackBtn.hidden = true;
  setCommunityDialogOpen(feedbackDialog, true);
});
closeFeedbackDialogBtn?.addEventListener("click", closeFeedbackDialog);
cancelFeedbackBtn?.addEventListener("click", closeFeedbackDialog);
feedbackForm?.addEventListener("submit", submitFeedback);
feedbackFallbackBtn?.addEventListener("click", submitFeedbackInNewPage);
feedbackMessage?.addEventListener("input", () => {
  if (feedbackMessageCount) feedbackMessageCount.textContent = String(feedbackMessage.value.length);
});
openDonationDialogBtn?.addEventListener("click", () => setCommunityDialogOpen(donationDialog, true));
closeDonationDialogBtn?.addEventListener("click", closeDonationDialog);
closeDonationActionBtn?.addEventListener("click", closeDonationDialog);
closeMemoryLimitDialogBtn?.addEventListener("click", closeMemoryLimitDialog);
for (const dialog of [feedbackDialog, donationDialog, memoryLimitDialog]) {
  dialog?.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    if (dialog === memoryLimitDialog) closeMemoryLimitDialog();
    else if (dialog === feedbackDialog) closeFeedbackDialog();
    else closeDonationDialog();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (feedbackDialog && !feedbackDialog.hidden) closeFeedbackDialog();
  else if (donationDialog && !donationDialog.hidden) closeDonationDialog();
  else if (memoryLimitDialog && !memoryLimitDialog.hidden) closeMemoryLimitDialog();
});




updateRangeLabels();
syncBrushPaletteControls();
drawBrushColorPalette();
updateExportSizeControls();
updateIconifySizeControls();
updateContourPixelControls();
setCanvasBackground("checker");
renderImageList();
renderFrameList();
renderAssetList();
renderWorkspaceTabs();
setProcessingSource(processingSource, { announce: false });
updateOcrRuntimeHint();
setButtons();
window.addEventListener("beforeunload", () => {
  if (loadedVideoUrl) URL.revokeObjectURL(loadedVideoUrl);
  if (cutoutWorker) cutoutWorker.terminate();
  if (cutoutWorkerUrl) URL.revokeObjectURL(cutoutWorkerUrl);
  for (const pending of ocrWorkerPromises.values()) {
    pending.then((worker) => worker?.terminate?.()).catch(() => {});
  }
  ocrWorkerPromises.clear();
});

restoreExportDirectoryHandle();
