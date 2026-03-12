var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-our-company.js
  var import_our_company_exports = {};
  __export(import_our_company_exports, {
    default: () => import_our_company_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const picture = element.querySelector(".corp-picture-holder picture, picture");
    const heading = element.querySelector(".copy-cont h1, .copy-cont h2, h1.title, h1");
    const cells = [];
    if (picture) {
      cells.push([picture]);
    }
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-card.js
  function parse2(element, { document }) {
    const picture = element.querySelector(".corp-picture-holder picture, picture");
    const heading = element.querySelector(".copy-cont h2, .copy-cont h1, h2.title, h2");
    const ctaLink = element.querySelector(".corp-cta-button a");
    const cells = [];
    if (picture) {
      cells.push([picture]);
    }
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    if (ctaLink) {
      contentCell.push(ctaLink);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ralphlauren-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        // OneTrust cookie consent
        "#usntA40Toggle",
        // UsableNet accessibility toggle
        "#transcend-consent-manager",
        // Transcend consent manager
        ".search-flyout",
        // Search flyout overlay
        '[class*="cookie"]'
        // Any cookie-related elements
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        // Site header with logo, nav, search, stock ticker
        "nav#navigation",
        // Main navigation
        "#footer",
        // Footer container
        "footer",
        // Footer element
        ".mobile-nav-blue-bar",
        // Mobile nav bar
        ".landing-page-bottom",
        // Empty bottom slot
        "#live-error-messages",
        // Accessibility live region
        ".corp-anchor",
        // Empty anchor divs (not authorable)
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/ralphlauren-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-our-company.js
  var parsers = {
    "hero-banner": parse,
    "hero-card": parse2
  };
  var PAGE_TEMPLATE = {
    name: "our-company",
    description: "Corporate company overview page with brand story and company information",
    urls: [
      "https://corporate.ralphlauren.com/our-company"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [
          "header.fullbleed.img-hero"
        ]
      },
      {
        name: "hero-card",
        instances: [
          ".cid_our-company-history-bucket section.img-link",
          ".cid_our-company-strategy-bucket section.img-link",
          ".cid_our-company-leadership-bucket section.img-link"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: ".hero",
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2-history",
        name: "History Card Section",
        selector: ".cid_our-company-history-bucket",
        style: null,
        blocks: ["hero-card"],
        defaultContent: []
      },
      {
        id: "section-3-strategy",
        name: "Strategy Card Section",
        selector: ".cid_our-company-strategy-bucket",
        style: null,
        blocks: ["hero-card"],
        defaultContent: []
      },
      {
        id: "section-4-leadership",
        name: "Leadership Card Section",
        selector: ".cid_our-company-leadership-bucket",
        style: null,
        blocks: ["hero-card"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_our_company_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_our_company_exports);
})();
