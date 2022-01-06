/**
 * Start a MutationObserver given a selector, callback, and initiliser function.
 *
 * @param selector The root element the mutation observer is attached to.
 * @param onMutations Code to run when mutations are observed.
 * @param onConnection Callback to run when the observer is connected. (i.e. when the root element is found)
 * @param retryDelay Time to wait until attempting to find the root element again (Default 200ms).
 */
export function observeRootElement(
  selector: string | (() => HTMLElement),
  onMutations: MutationCallback,
  onConnection?: VoidFunction,
  retryDelay = 200
) {
  let rootElementTimer = null;
  let targetNode = null;

  const observer = new MutationObserver(onMutations);

  rootElementTimer = setInterval(() => {
    targetNode = typeof selector === 'function' ? selector() : document.querySelector(selector);

    if (targetNode != null) {
      // Found root element, start the observer
      observer.observe(targetNode, {
        attributes: true,
        childList: true,
        subtree: true,
      });

      // Run the on connection
      if (onConnection != null) {
        onConnection();
      }

      // Cancel the retry
      clearInterval(rootElementTimer);
    } else {
      observer.disconnect();
    }
  }, retryDelay); // Arbitrary loop delay

  return observer;
}
