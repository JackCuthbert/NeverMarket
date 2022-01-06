/// <reference types="web-ext-types"/>

const genericTileNodeName = 'SHARED-PRODUCT-TILE';
const genericTileElementName = 'shared-product-tile';
const marketBadgeSelector = '[alt="Everyday Market Product"]';

function isNodeComment(node: Node): boolean {
  return node.nodeName === '#comment';
}

/** Callback to handle changes to the DOM to continue nuking market tiles */
const callback: MutationCallback = (mutations) => {
  for (const mutation of mutations) {
    // Child list changes only
    if (mutation.type != 'childList') continue;

    // Single changes only
    if (mutation.addedNodes.length !== 1) continue;
    const node = mutation.addedNodes[0];

    // Not comments
    const isComment = isNodeComment(node);
    if (isComment) continue;

    // Only product tiles
    if (node.nodeName !== genericTileNodeName) continue;

    // Coerce into HTMLElement
    if (node.firstChild.nodeType !== 1) continue;
    const htmlElement = node.firstChild as HTMLElement;

    // Ignore unavailable items
    if (htmlElement.classList.contains('is-unavailable')) continue;

    // Find market badge, if there isn't one, it's not a market tile
    const badge = htmlElement.querySelector(marketBadgeSelector);
    if (badge == null) continue;

    // yeet the market tile
    node.parentElement.remove();
    htmlElement.style.backgroundColor = 'red';
  }
};

/** Remove all the market tiles at once */
function removeMarketTiles() {
  const tiles = document.querySelectorAll(genericTileElementName);

  for (const tile of tiles) {
    const badge = tile.querySelector(marketBadgeSelector);
    if (badge == null) continue;

    tile.parentElement.remove();
  }
}

const tileObserver = new MutationObserver(callback);

let rootElementTimer = null;
let targetNode = null;

const config = { attributes: true, childList: true, subtree: true };

rootElementTimer = setInterval(() => {
  targetNode = document.querySelector('#center-panel');

  if (targetNode != null) {
    // Found root element, start the observer
    tileObserver.observe(targetNode, config);

    // Manually clear all the market tiles
    removeMarketTiles();

    // Cancel the interval
    clearInterval(rootElementTimer);
  } else {
    tileObserver.disconnect();
  }
}, 100);
