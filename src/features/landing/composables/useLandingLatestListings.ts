import { ref, shallowRef } from 'vue';
import { marketplaceApi } from '../../../api';
import type { MarketplaceListing } from '../../../types/api';

const listings = shallowRef<MarketplaceListing[]>([]);
const isLoading = ref(false);
const hasError = ref(false);
let fetchPromise: Promise<MarketplaceListing[]> | null = null;
let hasAttempted = false;

async function fetchLatestListings(force = false): Promise<MarketplaceListing[]> {
  if (fetchPromise && !force) {
    return fetchPromise;
  }
  if (hasAttempted && !force && !hasError.value) {
    return listings.value;
  }

  isLoading.value = true;
  hasError.value = false;

  fetchPromise = (async () => {
    try {
      const data = await marketplaceApi.getLatestListings();
      const sliced = (Array.isArray(data) ? data : []).slice(0, 4);
      listings.value = sliced;
      hasAttempted = true;
      return sliced;
    } catch (err) {
      console.error('Failed to load latest listings for landing:', err);
      hasError.value = true;
      listings.value = [];
      hasAttempted = true;
      throw err;
    } finally {
      isLoading.value = false;
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export function useLandingLatestListings() {
  if (!hasAttempted && !fetchPromise) {
    fetchLatestListings().catch(() => {
      // Handled internally by hasError
    });
  }

  return {
    listings,
    isLoading,
    hasError,
    refetch: () => fetchLatestListings(true),
  };
}

export function _resetLandingListingsState() {
  listings.value = [];
  isLoading.value = false;
  hasError.value = false;
  fetchPromise = null;
  hasAttempted = false;
}
