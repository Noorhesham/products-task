import { useState, useEffect } from "react";

/**
 * A custom hook that tracks whether the viewport is below a mobile breakpoint.
 * Starts with false (safe for SSR) and resolves to correct value on client mount.
 */
export function useMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(media.matches);

    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [breakpoint]);

  return isMobile;
}
