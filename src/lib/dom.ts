export function hideElement(element: HTMLElement): void {
  if (element.style.display === 'none') return;
  element.style.display = 'none';
}
