import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBanksCatalog } from './useBanksCatalog';
import { LOCAL_BANKS } from './catalog';
import { banksApi } from '../../api';

describe('useBanksCatalog composable', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads local catalog banks synchronously by default', () => {
    const { banks, loading, error } = useBanksCatalog();

    expect(banks.value.length).toBe(LOCAL_BANKS.length);
    expect(banks.value[0].code).toBe(LOCAL_BANKS[0].code);
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it('fetches remote catalog when fetchBanks is called', async () => {
    const mockRemoteBanks = [
      {
        code: 'remote_bank',
        display_name: 'بانک دوردست',
        aliases: ['دوردست'],
        brand_color_light: '#111111',
        brand_color_dark: '#222222',
        logo_url: null,
      },
    ];

    vi.spyOn(banksApi, 'list').mockResolvedValueOnce(mockRemoteBanks);

    const { banks, loading, fetchBanks } = useBanksCatalog();
    const promise = fetchBanks(true);
    expect(loading.value).toBe(true);

    const result = await promise;
    expect(loading.value).toBe(false);
    expect(result.length).toBe(1);
    expect(banks.value[0].code).toBe('remote_bank');
  });

  it('falls back to local catalog if remote fetch fails', async () => {
    vi.spyOn(banksApi, 'list').mockRejectedValueOnce(new Error('Network error'));

    const { banks, loading, error, fetchBanks } = useBanksCatalog();
    await fetchBanks(true);

    expect(loading.value).toBe(false);
    expect(error.value).toBe('Network error');
    expect(banks.value.length).toBe(LOCAL_BANKS.length);
  });
});
