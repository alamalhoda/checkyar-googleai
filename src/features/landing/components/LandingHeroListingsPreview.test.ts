import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LandingHeroListingsPreview from './LandingHeroListingsPreview.vue';
import { marketplaceApi } from '../../../api';
import { _resetLandingListingsState } from '../composables/useLandingLatestListings';
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
      name: `شرکت صنایع آزمایشی ${id}`,
      credit_score: 750,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    },
    bank: {
      code: 'mellat',
      display_name: 'بانک ملت',
      brand_color_light: '#E21836',
      brand_color_dark: '#C4112C',
      logo_url: null,
    },
    bank_name: 'بانک ملت',
    cheque_serial_number: `1234567890${id}`,
    face_amount: '50000000',
    due_date: '2026-06-01',
    issuer_type: 'legal',
    issuer_name: `شرکت صنایع آزمایشی ${id}`,
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

describe('LandingHeroListingsPreview.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resetLandingListingsState();
  });

  it('renders preview container with data-testid', async () => {
    vi.mocked(marketplaceApi.getLatestListings).mockResolvedValue([createMockListing(1)]);
    const wrapper = mount(LandingHeroListingsPreview);

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="landing-hero-listings-preview"]').exists()).toBe(true);
    });
  });

  it('renders up to 2 real listings with bank, amount, rate, and masked issuer', async () => {
    const mockListings = [createMockListing(1), createMockListing(2), createMockListing(3)];
    vi.mocked(marketplaceApi.getLatestListings).mockResolvedValue(mockListings);

    const wrapper = mount(LandingHeroListingsPreview);

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('بانک ملت');
      expect(wrapper.text()).toContain('۵٬۰۰۰٬۰۰۰');
      expect(wrapper.text()).toContain('۲.۵٪');
      expect(wrapper.text()).toContain('منتشر شده');
      expect(wrapper.text()).toContain('شرکت صنایع …');
    });

    const listingLinks = wrapper.findAll('a[href="#live-listings"]');
    expect(listingLinks).toHaveLength(2);
  });

  it('renders empty state when no listings are returned', async () => {
    vi.mocked(marketplaceApi.getLatestListings).mockResolvedValue([]);

    const wrapper = mount(LandingHeroListingsPreview);

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('فعلاً آگهی منتشرشده‌ای برای پیش‌نمایش نیست');
    });
  });
});
