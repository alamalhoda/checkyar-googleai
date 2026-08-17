/**
 * Pure helper function to determine routing redirect for landing gate.
 *
 * @param flagEnabled - Whether show_landing_page flag is enabled (fail-closed: false if absent, false, or on request failure)
 * @param targetPath - The requested route path ('/' or '/landing')
 * @returns The redirect path target, or null to allow navigation to proceed
 */
export function getLandingRedirect(flagEnabled: boolean, targetPath: string): string | null {
  if (targetPath === '/') {
    return flagEnabled ? '/landing' : '/marketplace';
  }
  if (targetPath === '/landing' && !flagEnabled) {
    return '/marketplace';
  }
  return null;
}
