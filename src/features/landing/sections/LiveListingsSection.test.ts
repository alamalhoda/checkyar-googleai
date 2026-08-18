import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LiveListingsSection from './LiveListingsSection.vue';
import { marketplaceApi } from '../../../api';
import { _resetLandingListingsState } from '../composables/useLandingLatestListings';
import type { MarketplaceListing } from '../../../types/api';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('../../../api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api')>();
  return {
    ...actual,
    marketplaceApi: {
      ...actual.marketplaceApi,
      getLatestListings: vi.fn(),
    },
  };
});

function createMockListing(id: number): MarketplaceListing {
  return {
    id,
    owner_id: 1,
    issuer_profile: {
      id: 10 + id,
      national_or_company_id: '10101010101',
      name: `شرکت آزمایشی ${id}`,
      credit_score: 750,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    },
    bank_name: 'بانک ملت',
    cheque_serial_number: `1234567890${id}`,
    face_amount: '50000000',
    due_date: '2026-06-01',
    issuer_type: 'legal',
    issuer_name: `شرکت آزمایشی ${id}`,
    issuer_national_id: '10101010101',
    description: 'توضیحات تست',
    suggested_discount_rate: '2.5',
    risk_tier: 'low',
    status: 'published',
    days_to_due: 30,
    interest_count: 2,
    published_at: '2026-02-01',
    created_at: '2026-02-01',
    updated_at: '2026-02-01',
  };
}

describe('LiveListingsSection.vue', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    vi.clearAllMocks();
    _resetLandingListingsState();
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it('renders section and listings grid when data is loaded', async () => {
    const mockListings = [createMockListing(1), createMockListing(2)];
    vi.mocked(marketplaceApi.getLatestListings).mockResolvedValue(mockListings);

    const wrapper = mount(LiveListingsSection, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: true,
        },
        mocks: {
          $router: { push: vi.fn() },
        },
        provide: {
          router: { push: vi.fn() },
        },
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="landing-section-live-listings"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="landing-listings-grid"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="landing-listing-card-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="landing-listing-card-2"]').exists()).toBe(true);
    });
  });

  it('renders empty state when listings are empty', async () => {
    vi.mocked(marketplaceApi.getLatestListings).mockResolvedValue([]);

    const wrapper = mount(LiveListingsSection, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: true,
        },
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="landing-listings-empty"]').exists()).toBe(true);
    });
  });

  it('renders error state and retry button on API failure', async () => {
    vi.mocked(marketplaceApi.getLatestListings).mockRejectedValue(new Error('Network error'));

    const wrapper = mount(LiveListingsSection, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: true,
        },
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="landing-listings-error"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="landing-listings-retry"]').exists()).toBe(true);
    });
  });
});

