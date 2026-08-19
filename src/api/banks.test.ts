import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { banksApi, listingsApi } from './index';
import { api, setMockMode } from './client';

describe('banksApi and listingsApi bank payload contract', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('banksApi.list returns mock catalog when mock mode is enabled', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    setMockMode(true);

    const getSpy = vi.spyOn(api, 'get');

    const result = await banksApi.list();
    expect(getSpy).not.toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(b => b.code === 'mellat')).toBe(true);
  });

  it('banksApi.list calls GET /banks/ when mock mode is false', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    setMockMode(false);

    const mockBanks = [
      {
        code: 'melli',
        display_name: 'بانک ملی ایران',
        aliases: ['ملی'],
        brand_color_light: '#0058A8',
        brand_color_dark: '#1C75BC',
        logo_url: null,
      },
    ];

    const getSpy = vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: mockBanks,
    } as any);

    const result = await banksApi.list();
    expect(getSpy).toHaveBeenCalledWith('/banks/');
    expect(result).toEqual(mockBanks);
  });

  it('listingsApi.createListing transforms bank_name to bank code and strips bank_name from payload in live mode', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    setMockMode(false);

    const postSpy = vi.spyOn(api, 'post').mockResolvedValueOnce({
      data: { id: 101, bank: { code: 'mellat', display_name: 'بانک ملت' } },
    } as any);

    await listingsApi.createListing({
      issuer: 10,
      bank: 'mellat',
      bank_name: 'بانک ملت',
      face_amount: 10000000,
      due_date: '2025-10-01',
      cheque_serial_number: '1234567890123456',
      issuer_type: 'natural',
      issuer_name: 'رضا',
      issuer_national_id: '0071234567',
    } as any);

    expect(postSpy).toHaveBeenCalled();
    const sentPayload = postSpy.mock.calls[0][1] as any;
    expect(sentPayload.bank).toBe('mellat');
    expect(sentPayload.bank_name).toBeUndefined();
  });

  it('listingsApi.updateListing transforms bank_name to bank code and strips bank_name from payload in live mode', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    setMockMode(false);

    const patchSpy = vi.spyOn(api, 'patch').mockResolvedValueOnce({
      data: { id: 101, bank: { code: 'saman', display_name: 'بانک سامان' } },
    } as any);

    await listingsApi.updateListing(101, {
      bank: 'saman',
      bank_name: 'بانک سامان',
      face_amount: 20000000,
    } as any);

    expect(patchSpy).toHaveBeenCalled();
    const sentPayload = patchSpy.mock.calls[0][1] as any;
    expect(sentPayload.bank).toBe('saman');
    expect(sentPayload.bank_name).toBeUndefined();
  });
});
