import { describe, it, expect, vi, beforeEach } from 'vitest';
import { marketplaceApi } from '../../../api';
import { useLandingLatestListings, _resetLandingListingsState } from './useLandingLatestListings';
import type { MarketplaceListing } from '../../../types/api';

vi.mock('../../../api', () => ({
  marketplaceApi: {
    getLatestListings: vi.fn(),
  },
}));

function createMockListing(id: number): MarketplaceListing {
  return {
    id,
    owner_id: 1,
    issuer_profile: {
      id: 10 + id,
      national_or_company_id: '10101010101',
      name: `صادرکننده ${id}`,
      credit_score: 750,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    },
    bank_name: 'بانک ملت',
    cheque_serial_number: `1234567890${id}`,
    face_amount: '100000000',
    due_date: '2026-06-01',
    issuer_type: 'legal',
    issuer_name: `شرکت آزمایشی ${id}`,
    issuer_national_id: '10101010101',
    description: 'توضیحات تست',
    suggested_discount_rate: '2.5',
    risk_tier: 'low',
    status: 'published',
    days_to_due: 45,
    interest_count: 3,
    published_at: '2026-02-01',
    created_at: '2026-02-01',
    updated_at: '2026-02-01',
  };
}

describe('useLandingLatestListings composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resetLandingListingsState();
  });

  it('slices latest listings to a maximum of 4', async () => {
    const mockData = [1, 2, 3, 4, 5, 6].map(createMockListing);
    vi.mocked(marketplaceApi.getLatestListings).mockResolvedValue(mockData);

    const { listings, isLoading, hasError } = useLandingLatestListings();

    // Wait for the async fetch to complete
    await vi.waitFor(() => expect(isLoading.value).toBe(false));

    expect(marketplaceApi.getLatestListings).toHaveBeenCalledTimes(1);
    expect(listings.value).toHaveLength(4);
    expect(listings.value.map(l => l.id)).toEqual([1, 2, 3, 4]);
    expect(hasError.value).toBe(false);
  });

  it('shares reactive state across multiple consumers without re-fetching', async () => {
    const mockData = [1, 2].map(createMockListing);
    vi.mocked(marketplaceApi.getLatestListings).mockResolvedValue(mockData);

    const consumer1 = useLandingLatestListings();
    const consumer2 = useLandingLatestListings();

    await vi.waitFor(() => expect(consumer1.isLoading.value).toBe(false));

    expect(marketplaceApi.getLatestListings).toHaveBeenCalledTimes(1);
    expect(consumer1.listings.value).toBe(consumer2.listings.value);
    expect(consumer1.listings.value).toHaveLength(2);
  });

  it('handles empty results gracefully', async () => {
    vi.mocked(marketplaceApi.getLatestListings).mockResolvedValue([]);

    const { listings, isLoading, hasError } = useLandingLatestListings();

    await vi.waitFor(() => expect(isLoading.value).toBe(false));

    expect(listings.value).toEqual([]);
    expect(hasError.value).toBe(false);
  });

  it('handles API errors by setting hasError and clearing listings', async () => {
    vi.mocked(marketplaceApi.getLatestListings).mockRejectedValue(new Error('Network error'));

    const { listings, isLoading, hasError } = useLandingLatestListings();

    await vi.waitFor(() => expect(isLoading.value).toBe(false));

    expect(hasError.value).toBe(true);
    expect(listings.value).toEqual([]);
  });

  it('forces a re-fetch when refetch is called', async () => {
    const initialData = [1, 2].map(createMockListing);
    const updatedData = [1, 2, 3].map(createMockListing);

    vi.mocked(marketplaceApi.getLatestListings)
      .mockResolvedValueOnce(initialData)
      .mockResolvedValueOnce(updatedData);

    const { listings, isLoading, refetch } = useLandingLatestListings();

    await vi.waitFor(() => expect(isLoading.value).toBe(false));
    expect(listings.value).toHaveLength(2);

    await refetch();
    expect(marketplaceApi.getLatestListings).toHaveBeenCalledTimes(2);
    expect(listings.value).toHaveLength(3);
  });
});
