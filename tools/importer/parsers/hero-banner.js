/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner variant.
 * Base block: hero
 * Source: https://corporate.ralphlauren.com/our-company
 * Selector: header.fullbleed.img-hero
 *
 * Source DOM structure (from captured HTML):
 *   <header class="fullbleed img-hero corp-relative first-level">
 *     <div class="corp-picture-holder first-level">
 *       <picture>
 *         <source media="(min-width: 768px)" srcset="...STRATEGY_BANNER.jpg">
 *         <source media="(max-width: 767px)" srcset="...MOBILE_STRATEGY_BANNER.jpg">
 *         <img class="corp-image" src="...STRATEGY_BANNER.jpg" alt="">
 *       </picture>
 *     </div>
 *     <div class="copy-cont">
 *       <h1 class="title">NEXT GREAT CHAPTER: DRIVE</h1>
 *     </div>
 *   </header>
 *
 * Target block structure (from block library):
 *   Row 1: Background image (picture)
 *   Row 2: Title (heading), optional subheading, optional CTA
 */
export default function parse(element, { document }) {
  // Extract background image from picture element (from captured DOM: .corp-picture-holder picture)
  const picture = element.querySelector('.corp-picture-holder picture, picture');

  // Extract heading (from captured DOM: .copy-cont h1.title)
  const heading = element.querySelector('.copy-cont h1, .copy-cont h2, h1.title, h1');

  // Build cells matching hero block library structure
  const cells = [];

  // Row 1: Background image
  if (picture) {
    cells.push([picture]);
  }

  // Row 2: Heading content
  const contentCell = [];
  if (heading) {
    contentCell.push(heading);
  }
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
