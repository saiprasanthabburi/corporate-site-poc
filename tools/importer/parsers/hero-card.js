/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-card variant.
 * Base block: hero
 * Source: https://corporate.ralphlauren.com/our-company
 * Selectors:
 *   - .cid_our-company-history-bucket section.img-link
 *   - .cid_our-company-strategy-bucket section.img-link
 *   - .cid_our-company-leadership-bucket section.img-link
 *
 * Source DOM structure (from captured HTML):
 *   <section class="img-link fullwidth no-deck overlay first-level">
 *     <div class="corp-relative">
 *       <div class="corp-picture-holder first-level">
 *         <picture>
 *           <source media="(min-width: 768px)" srcset="...OUR-COMPANY_HISTORY.jpg">
 *           <source media="(max-width: 767px)" srcset="...MOBILE_OUR-COMPANY_HISTORY.jpg">
 *           <img class="corp-image" src="...OUR-COMPANY_HISTORY.jpg" alt="">
 *         </picture>
 *       </div>
 *       <div class="copy-cont four-columns">
 *         <h2 class="title">History</h2>
 *       </div>
 *       <a class="first-level hotspot" href="..." aria-hidden="true"></a>
 *     </div>
 *     <div class="corp-cta-button">
 *       <a href="..."><span>Learn More</span></a>
 *     </div>
 *   </section>
 *
 * Target block structure (from block library):
 *   Row 1: Background image (picture)
 *   Row 2: Title (heading) + CTA link
 */
export default function parse(element, { document }) {
  // Extract background image (from captured DOM: .corp-picture-holder picture)
  const picture = element.querySelector('.corp-picture-holder picture, picture');

  // Extract heading (from captured DOM: .copy-cont h2.title)
  const heading = element.querySelector('.copy-cont h2, .copy-cont h1, h2.title, h2');

  // Extract CTA link (from captured DOM: .corp-cta-button a)
  const ctaLink = element.querySelector('.corp-cta-button a');

  // Build cells matching hero block library structure
  const cells = [];

  // Row 1: Background image
  if (picture) {
    cells.push([picture]);
  }

  // Row 2: Heading + CTA
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-card', cells });
  element.replaceWith(block);
}
