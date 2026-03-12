/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import heroCardParser from './parsers/hero-card.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/ralphlauren-cleanup.js';
import sectionsTransformer from './transformers/ralphlauren-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'hero-card': heroCardParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'our-company',
  description: 'Corporate company overview page with brand story and company information',
  urls: [
    'https://corporate.ralphlauren.com/our-company',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: [
        'header.fullbleed.img-hero',
      ],
    },
    {
      name: 'hero-card',
      instances: [
        '.cid_our-company-history-bucket section.img-link',
        '.cid_our-company-strategy-bucket section.img-link',
        '.cid_our-company-leadership-bucket section.img-link',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: '.hero',
      style: 'dark',
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2-history',
      name: 'History Card Section',
      selector: '.cid_our-company-history-bucket',
      style: null,
      blocks: ['hero-card'],
      defaultContent: [],
    },
    {
      id: 'section-3-strategy',
      name: 'Strategy Card Section',
      selector: '.cid_our-company-strategy-bucket',
      style: null,
      blocks: ['hero-card'],
      defaultContent: [],
    },
    {
      id: 'section-4-leadership',
      name: 'Leadership Card Section',
      selector: '.cid_our-company-leadership-bucket',
      style: null,
      blocks: ['hero-card'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
