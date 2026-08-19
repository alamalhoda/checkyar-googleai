import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useListingForm } from './useListingForm';
import { listingsApi } from '../../../api';

vi.mock('../../../api', () => ({
  listingsApi: {
    createListing: vi.fn(),
    uploadDocument: vi.fn(),
  },
}));

vi.mock('../../../utils/discreteApi', () => ({
  message: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useListingForm.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('marks step1 as invalid when bank is unknown or empty', () => {
    const form = useListingForm({
      serialNumber: '1234567890123456',
      amount: 50000000,
      dueDate: Date.now() + 86400000 * 30,
      issuerName: 'شرکت پترو آریا',
      issuerNationalId: '1010203040',
      bank: '',
    });

    expect(form.isValidStep1.value).toBe(false);

    // Unmatched bank string
    form.formData.bank = 'unknown_random_bank';
    expect(form.isValidStep1.value).toBe(false);

    // Valid bank code
    form.formData.bank = 'mellat';
    expect(form.isValidStep1.value).toBe(true);

    // Valid bank alias / name
    form.formData.bank = 'بانک ملت';
    expect(form.isValidStep1.value).toBe(true);
  });

  it('prevents publishListing and does not call createListing with unmatched bank', async () => {
    const form = useListingForm({
      serialNumber: '1234567890123456',
      amount: 50000000,
      dueDate: Date.now() + 86400000 * 30,
      issuerName: 'شرکت پترو آریا',
      issuerNationalId: '1010203040',
      bank: 'invalid_bank',
      chequeFrontImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      discountRate: 2.5,
      settlementMethod: 'escrow',
    });

    const result = await form.publishListing();
    expect(result).toBe(false);
    expect(listingsApi.createListing).not.toHaveBeenCalled();
  });

  it('calls createListing with resolved bank code on valid submission', async () => {
    vi.mocked(listingsApi.createListing).mockResolvedValue({ id: 999 } as any);

    const form = useListingForm({
      serialNumber: '1234567890123456',
      amount: 50000000,
      dueDate: Date.now() + 86400000 * 30,
      issuerName: 'شرکت پترو آریا',
      issuerNationalId: '1010203040',
      bank: 'بانک ملت', // alias / name should resolve to 'mellat'
      chequeFrontImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      discountRate: 2.5,
      settlementMethod: 'escrow',
    });

    const result = await form.publishListing();
    expect(result).toBe(true);
    expect(listingsApi.createListing).toHaveBeenCalledWith(
      expect.objectContaining({
        bank: 'mellat',
      })
    );
  });
});
