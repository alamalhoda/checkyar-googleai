/**
 * Shared Breakpoint SSOT & Utilities (Tailwind Breakpoints)
 * Standard MD breakpoint = 768px
 */

export const BREAKPOINT_MD = 768;

/**
 * Pure helper to test if a given viewport width satisfies the desktop (md) breakpoint.
 * Defaults to window.innerWidth if available in browser context.
 */
export function isDesktopBreakpoint(width?: number): boolean {
  if (typeof width === 'number') {
    return width >= BREAKPOINT_MD;
  }
  if (typeof window !== 'undefined') {
    return window.innerWidth >= BREAKPOINT_MD;
  }
  return true;
}

/**
 * Media query helper for matchMedia('(min-width: 768px)').
 */
export function matchDesktopMedia(): boolean {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia(`(min-width: ${BREAKPOINT_MD}px)`).matches;
  }
  return isDesktopBreakpoint();
}
