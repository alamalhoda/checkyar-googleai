import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBackendSimulatorStore } from './useBackendSimulatorStore';
import { LOCAL_BANKS } from '../shared/banks/catalog';

describe('useBackendSimulatorStore bank catalog and listing operations', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('lists banks from catalog', () => {
    const store = useBackendSimulatorStore();
    const banks = store.listBanks();
    expect(banks.length).toBe(LOCAL_BANKS.length);
    expect(banks.some(b => b.code === 'mellat')).toBe(true);
  });

  it('filters marketplace listings with precedence for bank code over bank_name', () => {
    const store = useBackendSimulatorStore();
    store.resetToSeed();

    // All published listings
    const all = store.getMarketplaceListings({});
    expect(all.count).toBeGreaterThan(0);

    // Filter by bank code 'mellat'
    const mellatListings = store.getMarketplaceListings({ bank: 'mellat' });
    expect(mellatListings.count).toBeGreaterThan(0);
    expect(mellatListings.results.every(r => r.bank?.code === 'mellat')).toBe(true);

    // Filter by bank_name string 'پاسارگاد'
    const pasargadListings = store.getMarketplaceListings({ bank_name: 'پاسارگاد' });
    expect(pasargadListings.count).toBeGreaterThan(0);
    expect(pasargadListings.results.every(r => r.bank?.code === 'pasargad' || r.bank_name.includes('پاسارگاد'))).toBe(true);

    // Precedence: when both are passed, bank code takes precedence
    const precedenceListings = store.getMarketplaceListings({
      bank: 'mellat',
      bank_name: 'پاسارگاد',
    });
    expect(precedenceListings.results.every(r => r.bank?.code === 'mellat')).toBe(true);
  });

  it('creates listing with bank code and validates invalid bank code', () => {
    const store = useBackendSimulatorStore();

    // Invalid bank code should throw validation error
    expect(() => {
      store.createListing(1, {
        bank: 'invalid_bank_code',
        face_amount: 100000000,
        due_date: '2025-12-01',
        cheque_serial_number: '1234567890123456',
        issuer_type: 'natural',
        issuer_name: 'علی تقوی',
        issuer_national_id: '0071234567',
      });
    }).toThrow();

    // Valid bank code
    const listing = store.createListing(1, {
      bank: 'tejarat',
      face_amount: 250000000,
      due_date: '2025-12-01',
      cheque_serial_number: '1234567890123456',
      issuer_type: 'natural',
      issuer_name: 'علی تقوی',
      issuer_national_id: '0071234567',
    });

    expect(listing.bank).toBeDefined();
    expect(listing.bank?.code).toBe('tejarat');
    expect(listing.bank?.display_name).toBe('بانک تجارت');
    expect(listing.bank_name).toBe('بانک تجارت');
  });

  it('updates listing with bank code and rejects invalid bank code', () => {
    const store = useBackendSimulatorStore();
    store.resetToSeed();

    const existingListing = store.listings[0];
    const ownerId = existingListing.owner_id;

    // Update with valid code
    const updated = store.updateListing(ownerId, existingListing.id, {
      bank: 'pasargad',
    });

    expect(updated.bank?.code).toBe('pasargad');
    expect(updated.bank?.display_name).toBe('بانک پاسارگاد');
    expect(updated.bank_name).toBe('بانک پاسارگاد');

    // Update with invalid code throws
    expect(() => {
      store.updateListing(ownerId, existingListing.id, {
        bank: 'non_existent_bank',
      });
    }).toThrow();
  });

  it('hydrates legacy listings and matches lacking bank field upon init', () => {
    const legacyState = {
      listings: [
        {
          id: 999,
          owner_id: 1,
          bank_name: 'بانک ملت',
          cheque_serial_number: '1111222233334444',
          face_amount: '100000000',
          due_date: '2025-12-01',
          issuer_type: 'natural',
          issuer_name: 'تست',
          issuer_national_id: '0071234567',
          status: 'published',
          suggested_discount_rate: '2.5',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ],
      matches: [
        {
          id: 888,
          listing: {
            id: 999,
            bank_name: 'بانک آینده',
            face_amount: '100000000',
            due_date: '2025-12-01',
            status: 'published',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
          investor: { id: 2, username: 'investor', name: 'سرمایه‌گذار' },
          check_holder: { id: 1, username: 'holder', name: 'دارنده' },
          status: 'pending',
          settlement_type: 'escrow',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ],
    };

    localStorage.setItem('chequeyar_simulator_v1', JSON.stringify(legacyState));

    const store = useBackendSimulatorStore();
    store.init();

    const hydratedListing = store.listings.find(l => l.id === 999);
    expect(hydratedListing?.bank).toBeDefined();
    expect(hydratedListing?.bank?.code).toBe('mellat');

    const hydratedMatch = store.matches.find(m => m.id === 888);
    expect(hydratedMatch?.listing?.bank).toBeDefined();
    expect(hydratedMatch?.listing?.bank?.code).toBe('ayandeh');
  });
});
