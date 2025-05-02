export function debounce(fn: Function, wait = 0) {
  let timeoutId: NodeJS.Timeout | string | number | undefined;

  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}
