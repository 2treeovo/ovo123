(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function createElement(tag, options = {}) {
    const node = document.createElement(tag);
    if (options.className) node.className = options.className;
    if (options.id) node.id = options.id;
    if (options.text) node.textContent = options.text;
    if (options.html) node.innerHTML = options.html;
    return node;
  }

  function move(node, target, before = null) {
    if (!node || !target) return node;
    if (before) target.insertBefore(node, before);
    else target.appendChild(node);
    return node;
  }

  function closestChildContaining(parent, selector) {
    const match = $(selector, parent);
    if (!match) return null;
    let node = match;
    while (node.parentElement && node.parentElement !== parent) node = node.parentElement;
    return node.parentElement === parent ? node : null;
  }

  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch {}
    }
  };

  function installLibraryDock(panel) {
    const dock = $(".library-dock");
    if (!dock) return;

    const definitions = [
      ["original", $(".batch-panel", panel), true],
      ["result", $(".asset-panel", panel), true],
      ["sequence", $(".sequence-library-panel", panel), true]
    ];

    const sections = new Map();
    for (const [kind, content, initiallyOpen] of definitions) {
      if (!content) continue;
      const details = createElement("details", { className: "library-section" });
      details.dataset.librarySection = kind;
      details.open = initiallyOpen;
      const summary = createElement("summary", { className: "library-section-summary" });
      const heading = $(".label-row", content);
      if (heading) move(heading, summary);
      else summary.textContent = kind === "original" ? "原始图片库" : kind === "result" ? "处理结果库" : "序列帧库";
      const body = createElement("div", { className: "library-section-body" });
      move(content, body);
      details.append(summary, body);
      dock.appendChild(details);
      sections.set(kind, details);
    }

    function openSection(kind, options = {}) {
      const section = sections.get(kind);
      if (!section) return;
      if (options.expandDock !== false && dock.classList.contains("collapsed")) {
        setDockCollapsed(false);
      }
      if (options.exclusive === true) {
        for (const [sectionKind, entry] of sections) {
          if (sectionKind !== kind) entry.open = false;
        }
      }
      section.open = true;
      for (const [sectionKind, entry] of sections) {
        entry.classList.toggle("active-library-section", sectionKind === kind);
      }
      if (options.scroll !== false) {
        const scrollToExactSection = () => {
          const dockRect = dock.getBoundingClientRect();
          const sectionRect = section.getBoundingClientRect();
          const targetTop = Math.max(0, dock.scrollTop + sectionRect.top - dockRect.top - 6);
          dock.scrollTo({
            top: targetTop,
            behavior: options.behavior === "instant" ? "auto" : "smooth"
          });
        };
        window.requestAnimationFrame(() => window.requestAnimationFrame(scrollToExactSection));
      }
    }

    dock.addEventListener("pointerdown", (event) => {
      const section = event.target.closest("[data-library-section]");
      if (section) document.body.dataset.activeLibrary = section.dataset.librarySection;
    });

    const toggleButton = $("#libraryDockToggleBtn", dock);
    function setDockCollapsed(collapsed, options = {}) {
      const value = Boolean(collapsed);
      document.body.classList.toggle("library-dock-collapsed", value);
      dock.classList.toggle("collapsed", value);
      if (value) document.documentElement.style.setProperty("--library-width", "52px");
      else document.documentElement.style.removeProperty("--library-width");
      if (toggleButton) {
        toggleButton.textContent = value ? "展开图库" : "收起图库";
        toggleButton.setAttribute("aria-expanded", String(!value));
      }
      if (options.persist !== false) storage.set("image-tool-library-collapsed", value ? "1" : "0");
      window.dispatchEvent(new Event("resize"));
    }
    toggleButton?.addEventListener("click", () => setDockCollapsed(!document.body.classList.contains("library-dock-collapsed")));
    setDockCollapsed(storage.get("image-tool-library-collapsed") === "1", { persist: false });

    window.libraryDockUi = Object.freeze({ openSection, setCollapsed: setDockCollapsed });
  }

  function installSidebarShell() {
    const panel = $(".panel");
    if (!panel || $("#sidebarNav")) return;

    installLibraryDock(panel);

    const brand = $(".brand", panel);
    const brandTitle = $("h1", brand);
    const brandDescription = $("p", brand);
    const status = $("#status", panel);
    const controls = $(".controls", panel);
    const actions = $(".actions", panel);
    const topCollapseButton = $("#sidebarTopToggleBtn");

    const header = createElement("div", { className: "sidebar-header" });
    move(brand, header);
    panel.prepend(header);

    const collapseButton = topCollapseButton || createElement("button", {
      id: "sidebarCollapseBtn",
      className: "sidebar-collapse",
      text: "收起"
    });
    collapseButton.type = "button";
    collapseButton.title = "收起或展开左侧功能栏";
    collapseButton.setAttribute("aria-controls", "sidebarBody");
    if (!topCollapseButton) header.appendChild(collapseButton);

    const nav = createElement("nav", { id: "sidebarNav", className: "sidebar-nav" });
    nav.setAttribute("aria-label", "图片处理功能");
    header.insertAdjacentElement("afterend", nav);

    const body = createElement("div", { id: "sidebarBody", className: "sidebar-body" });
    nav.insertAdjacentElement("afterend", body);

    const paneDefinitions = [
      ["cutout", "抠图", "取色与透明处理"],
      ["draw", "绘制", "画笔、取色盘与填充"],
      ["edit", "编辑", "裁剪、变换与调色"],
      ["pixel", "像素化", "主体比例像素转换"],
      ["sequence", "序列帧", "导入、拆帧、排序与播放"]
    ];

    const paneBrandCopy = new Map([
      ["cutout", ["主体抠图", "选择背景色、提取主体或手动擦除。结果不会覆盖原图。"]],
      ["draw", ["绘制功能", "常驻取色盘、画笔、右键擦除和油漆桶填充集中在这里。"]],
      ["edit", ["图片编辑", "旋转、镜像、裁剪、描边、阴影和颜色调整集中在这里。"]],
      ["pixel", ["主体像素化", "按主体比例重建轮廓和内部颜色，适合游戏素材。"]],
      ["sequence", ["序列帧", "视频抽帧、图集拆分、帧管理、播放和批量处理都在这里。"]]
    ]);

    const panes = new Map();
    for (const [id, label, description] of paneDefinitions) {
      const button = createElement("button", { className: "sidebar-tab" });
      button.type = "button";
      button.dataset.sidebarPane = id;
      button.innerHTML = `<strong>${label}</strong><small>${description}</small>`;
      nav.appendChild(button);

      const pane = createElement("section", { id: `sidebarPane-${id}`, className: "sidebar-pane" });
      pane.dataset.paneId = id;
      pane.hidden = true;
      body.appendChild(pane);
      panes.set(id, pane);
    }

    const cutoutPane = panes.get("cutout");
    const drawPane = panes.get("draw");
    const editPane = panes.get("edit");
    move($(".drawing-panel", panel), drawPane);
    if (controls) {
      const editBlock = closestChildContaining(controls, ".edit-tools");
      const toleranceLine = closestChildContaining(controls, "#toleranceValue");
      const softnessLine = closestChildContaining(controls, "#softnessValue");
      const swatchesBlock = closestChildContaining(controls, "#swatches");

      [
        toleranceLine,
        $("#tolerance", controls),
        softnessLine,
        $("#softness", controls),
        $("#contiguous", controls)?.closest("label"),
        $("#forceRemoveColor", controls)?.closest("label"),
        $(".watermark-tools", controls),
        swatchesBlock,
        $(".cutout-commit-row", controls),
        $(".cutout-advanced", controls)
      ].forEach((node) => move(node, cutoutPane));

      [
        editBlock,
        $(".shadow-tools", controls),
        $(".outline-tools", controls),
        $(".iconify-tools", controls),
        $("#squareGreenCrop", controls)?.closest("label"),
        $(".size-crop", controls)
      ].forEach((node) => move(node, editPane));
    }

    const pixelPane = panes.get("pixel");
    const movePixelPanel = () => {
      const pixelPanel = $("#contourPixelPanel");
      if (!pixelPanel) return false;
      pixelPanel.open = true;
      move(pixelPanel, pixelPane);
      return true;
    };
    if (!movePixelPanel()) {
      const observer = new MutationObserver(() => {
        if (movePixelPanel()) observer.disconnect();
      });
      observer.observe(panel, { childList: true, subtree: true });
    }

    const sequencePane = panes.get("sequence");
    const sourceGroup = createElement("section", {
      className: "sequence-source-group",
      html: '<div class="section-caption"><strong>建立序列帧</strong><small>可直接导入多张图片，也可从视频或当前图集生成。</small></div>'
    });
    sequencePane.appendChild(sourceGroup);
    move($(".video-panel", panel), sourceGroup);
    move($(".spritesheet-panel", panel), sourceGroup);
    move($(".sequence-panel", panel), sequencePane);

    if (controls && controls.children.length === 0) controls.remove();

    const footer = createElement("div", { className: "sidebar-footer" });
    move(actions, footer);
    move(status, footer);
    panel.appendChild(footer);

    function focusSidebarTarget(target) {
      const pane = target?.closest(".sidebar-pane");
      if (!pane) return;
      const paneRect = pane.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const nextTop = Math.max(0, pane.scrollTop + targetRect.top - paneRect.top - 6);
      pane.scrollTo({ top: nextTop, behavior: "auto" });
    }

    function activatePane(id, options = {}) {
      if (!panes.has(id)) return;
      for (const [paneId, pane] of panes) {
        const active = paneId === id;
        pane.hidden = !active;
        pane.classList.toggle("active", active);
      }
      $$(".sidebar-tab", nav).forEach((button) => {
        const active = button.dataset.sidebarPane === id;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      const copy = paneBrandCopy.get(id);
      if (copy) {
        if (brandTitle) brandTitle.textContent = copy[0];
        if (brandDescription) brandDescription.textContent = copy[1];
      }
      if (options.resetCanvasMode !== false) window.setCanvasToolMode?.("view", { silent: true });
      if (options.persist !== false) storage.set("image-tool-active-pane", id);
      if (options.focusTarget) {
        window.requestAnimationFrame(() => {
          focusSidebarTarget($(options.focusTarget));
          // A pane switch can change the workspace width after browser zoom.
          // Re-dispatch resize only after this frame so the canvas recalculates
          // against the settled grid instead of the previous column width.
          window.dispatchEvent(new Event("resize"));
        });
      }
    }

    nav.addEventListener("click", (event) => {
      const button = event.target.closest("[data-sidebar-pane]");
      if (button) activatePane(button.dataset.sidebarPane);
    });

    function setSidebarCollapsed(collapsed, options = {}) {
      const shouldCollapse = Boolean(collapsed);
      document.body.classList.toggle("sidebar-collapsed", shouldCollapse);
      collapseButton.textContent = shouldCollapse ? "展开" : "收起";
      collapseButton.setAttribute("aria-expanded", String(!shouldCollapse));
      if (topCollapseButton) {
        topCollapseButton.textContent = shouldCollapse ? "展开侧栏" : "收起侧栏";
        topCollapseButton.setAttribute("aria-expanded", String(!shouldCollapse));
        topCollapseButton.classList.toggle("active", shouldCollapse);
      }
      if (options.persist !== false) storage.set("image-tool-sidebar-collapsed", shouldCollapse ? "1" : "0");
      window.dispatchEvent(new Event("resize"));
      // The grid columns animate for 180ms. A second notification after the
      // transition prevents a media preview rendered during that animation
      // from retaining an intermediate canvas size.
      window.requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
      window.setTimeout(() => window.dispatchEvent(new Event("resize")), 220);
    }

    const toggleSidebar = () => setSidebarCollapsed(!document.body.classList.contains("sidebar-collapsed"));
    collapseButton.addEventListener("click", toggleSidebar);
    if (topCollapseButton && topCollapseButton !== collapseButton) topCollapseButton.addEventListener("click", toggleSidebar);

    setSidebarCollapsed(storage.get("image-tool-sidebar-collapsed") === "1", { persist: false });
    const initialPane = storage.get("image-tool-active-pane");
    activatePane(panes.has(initialPane) ? initialPane : "cutout", { persist: false });

    $("#pickModeBtn")?.addEventListener("click", () => activatePane("cutout", { resetCanvasMode: false }));
    ["#rotateLeftBtn", "#rotateRightBtn", "#addOutlineBtn"].forEach((selector) => {
      $(selector)?.addEventListener("click", () => activatePane("edit", { resetCanvasMode: false }));
    });

    window.cutoutUi = Object.freeze({
      activatePane,
      setSidebarCollapsed,
      isSidebarCollapsed: () => document.body.classList.contains("sidebar-collapsed")
    });
  }

  function setModalOpen(modal, open) {
    if (!modal) return;
    modal.hidden = !open;
    document.body.classList.toggle("modal-open", Boolean(open) || $$(".app-modal:not([hidden]), .image-preview-modal:not([hidden]), .frame-picker:not([hidden])").length > 0);
  }

  function installGlobalDialogs() {
    const importDialog = $("#importDialog");
    const exportDialog = $("#exportDialog");
    const imageInput = $("#imageInput");
    const videoInput = $("#videoInput");
    const videoName = $("#loadedVideoNameOutput");

    $("#openImportDialogBtn")?.addEventListener("click", () => setModalOpen(importDialog, true));
    $("#closeImportDialogBtn")?.addEventListener("click", () => setModalOpen(importDialog, false));
    importDialog?.addEventListener("click", (event) => {
      if (event.target === importDialog) setModalOpen(importDialog, false);
    });

    $("#openExportDialogBtn")?.addEventListener("click", () => setModalOpen(exportDialog, true));
    $("#closeExportDialogBtn")?.addEventListener("click", () => setModalOpen(exportDialog, false));
    exportDialog?.addEventListener("click", (event) => {
      if (event.target === exportDialog) setModalOpen(exportDialog, false);
    });

    imageInput?.addEventListener("change", () => {
      if (imageInput.files?.length) setModalOpen(importDialog, false);
    });
    videoInput?.addEventListener("change", () => {
      if (!videoInput.files?.length) return;
      if (videoName) videoName.textContent = videoInput.files[0].name;
      setModalOpen(importDialog, false);
      window.cutoutUi?.setSidebarCollapsed(false);
      window.cutoutUi?.activatePane("sequence", { focusTarget: ".video-panel" });
    });
    $("#clearVideoBtn")?.addEventListener("click", () => {
      if (videoName) videoName.textContent = "尚未导入视频";
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (importDialog && !importDialog.hidden) setModalOpen(importDialog, false);
      if (exportDialog && !exportDialog.hidden) setModalOpen(exportDialog, false);
    });
  }

  function syncProcessingTargetUi() {
    const buttons = $$('[data-processing-source]');
    const sync = () => {
      const active = buttons.find((button) => button.classList.contains("active"));
      const source = active?.dataset.processingSource || "original";
      document.body.dataset.processingSource = source;
    };
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        sync();
        document.body.dataset.activeLibrary = button.dataset.processingSource;
      });
      new MutationObserver(sync).observe(button, { attributes: true, attributeFilter: ["class"] });
    });
    sync();
  }

  function installOptionalOcrFallback() {
    const autoName = $("#autoNameAssets");
    const removeText = $("#removeRecognizedText");
    if (window.Tesseract?.createWorker || !autoName || !removeText) return;
    autoName.checked = false;
    autoName.disabled = true;
    autoName.closest("label")?.classList.add("feature-unavailable");
    autoName.closest("label")?.setAttribute("title", "未检测到离线 OCR 组件，其他功能不受影响。");
    removeText.checked = false;
    removeText.disabled = true;
    removeText.closest("label")?.classList.add("feature-unavailable");
  }

  function improveToolbar() {
    const toolbar = $(".toolbar");
    if (toolbar && !$(".toolbar-caption", toolbar)) {
      toolbar.prepend(createElement("span", { className: "toolbar-caption", text: "画布" }));
    }
  }

  function init() {
    installSidebarShell();
    installGlobalDialogs();
    syncProcessingTargetUi();
    installOptionalOcrFallback();
    improveToolbar();
    document.documentElement.classList.add("ui-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
