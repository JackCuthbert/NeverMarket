/// <reference types="web-ext-types"/>

import { observeRootElement } from '../lib/observer';
import { hideElement } from '../lib/dom';

const genericTileNodeName = 'SHARED-PRODUCT-TILE';
const genericTileElementName = 'shared-product-tile';
const marketBadgeSelector = '[alt="Everyday Market Product"]';

function isNodeComment(node: Node): boolean {
  return node.nodeName === '#comment';
}

/** Callback to handle changes to the DOM to continue nuking market tiles */
const handleMutations: MutationCallback = (mutations) => {
  for (const mutation of mutations) {
    // Child list changes only
    if (mutation.type != 'childList') continue;

    // Single changes only
    if (mutation.addedNodes.length !== 1) continue;
    const node = mutation.addedNodes[0];

    // Not comments
    if (isNodeComment(node)) continue;

    // Only product tiles
    if (node.nodeName !== genericTileNodeName) continue;

    // Coerce into HTMLElement
    if (node.firstChild.nodeType !== Node.ELEMENT_NODE) continue;
    const htmlElement = node.firstChild as HTMLElement;

    // Ignore unavailable items
    if (htmlElement.classList.contains('is-unavailable')) continue;

    // Find market badge, if there isn't one, it's not a market tile
    const badge = htmlElement.querySelector(marketBadgeSelector);
    if (badge == null) continue;

    // yeet the market tile
    hideElement(node.parentElement);
  }
};

/** Remove all the market tiles at once */
function removeMarketTiles() {
  const tiles = document.querySelectorAll(genericTileElementName);

  for (const tile of tiles) {
    const badge = tile.querySelector(marketBadgeSelector);
    if (badge == null) continue;

    hideElement(tile.parentElement);
  }
}

observeRootElement('#center-panel', handleMutations, removeMarketTiles);
