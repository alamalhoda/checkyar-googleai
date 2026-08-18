/**
 * Determines the navigation target for a landing page listing card.
 * - Guest -> '/login'
 * - Signed-in -> '/listings/:id'
 */
export function getLandingListingTarget(isAuthenticated: boolean, listingId: number): string {
  if (!isAuthenticated) {
    return '/login';
  }
  return `/listings/${listingId}`;
}
