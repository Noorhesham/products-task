import { useState, useEffect } from "react";

/**
 * Delays updating the returned value until `delay` ms have elapsed
 * since the last change to `value`. Used to prevent firing API
 * requests on every keystroke in search inputs.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
