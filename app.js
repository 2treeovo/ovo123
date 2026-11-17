Warning: truncated output (original token count: 139654)
Total output lines: 14165

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
const compareTab = document.querySelector("#compareTab");
const compareCanvas = document.querySelector("#compareCanvas");
const compareCtx = compareCanvas?.getContext("2d", { willReadFrequently: true });
const compareRange = document.querySelector("#compareRange");
const compareDivider = document.querySelector("#compareDivider");
const compareOriginalLabel = document.querySelector("#compareOriginalLabel");
const compareResultLabel = document.querySelector("#compareResultLabel");
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
let comparisonActive = false;
let comparisonPosition = 50;
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
        baseColor = mixContourColors(baseColor, salient, detailImportance * (samplingMode === "mean…99654 tokens truncated…argets.length) return;
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
  comparisonActive = false;
  originalTab.classList.add("active");
  resultTab.classList.remove("active");
  compareTab?.classList.remove("active");
  compareTab?.setAttribute("aria-pressed", "false");
  updateComparisonVisibility();
  renderCanvas();
});

compareTab?.addEventListener("click", () => {
  if (!currentComparisonSource() || !currentImageData) {
    setStatus("当前图片还没有可用于对比的处理前版本。");
    return;
  }
  setComparisonActive(true);
  renderCanvas();
  setStatus("已开启原图与结果滑动对比；拖动分隔线，或用方向键精确调整。");
});

compareRange?.addEventListener("input", () => updateComparisonPosition(compareRange.value));
compareRange?.addEventListener("dblclick", () => updateComparisonPosition(50));

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
