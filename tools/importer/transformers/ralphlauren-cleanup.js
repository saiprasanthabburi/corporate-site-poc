/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Ralph Lauren Corporate cleanup.
 * Selectors from captured DOM of https://corporate.ralphlauren.com/our-company
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent, accessibility widget, and search flyout (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',        // OneTrust cookie consent
      '#usntA40Toggle',                // UsableNet accessibility toggle
      '#transcend-consent-manager',    // Transcend consent manager
      '.search-flyout',                // Search flyout overlay
      '[class*="cookie"]',             // Any cookie-related elements
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'header',                        // Site header with logo, nav, search, stock ticker
      'nav#navigation',                // Main navigation
      '#footer',                       // Footer container
      'footer',                        // Footer element
      '.mobile-nav-blue-bar',          // Mobile nav bar
      '.landing-page-bottom',          // Empty bottom slot
      '#live-error-messages',          // Accessibility live region
      '.corp-anchor',                  // Empty anchor divs (not authorable)
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
