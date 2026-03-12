/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Ralph Lauren Corporate sections.
 * Adds section breaks and section-metadata blocks based on template sections.
 * Selectors from captured DOM of https://corporate.ralphlauren.com/our-company
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const template = payload.template;

    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    // Process sections in reverse order to avoid DOM position shifts
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Find the section element using the selector from page-templates.json
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> before section (except the first section)
      if (section.id !== template.sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
