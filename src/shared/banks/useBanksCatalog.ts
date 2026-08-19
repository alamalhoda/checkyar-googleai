import { ref, type Ref } from 'vue';
import type { Bank } from '../../types/api';
import { LOCAL_BANKS } from './catalog';
import { banksApi } from '../../api';

// Module-level cached state so multiple components/call sites share the same state
const banks: Ref<Bank[]> = ref<Bank[]>([...LOCAL_BANKS]);
const loading: Ref<boolean> = ref<boolean>(false);
const error: Ref<string | null> = ref<string | null>(null);
let fetched = false;

export function useBanksCatalog() {
  async function fetchBanks(force = false): Promise<Bank[]> {
    if (fetched && !force && banks.value.length > 0) {
      return banks.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const result = await banksApi.list();
      if (Array.isArray(result) && result.length > 0) {
        banks.value = result;
      } else {
        banks.value = [...LOCAL_BANKS];
      }
      fetched = true;
      return banks.value;
    } catch (err: any) {
      // In case of network or 5xx error in live mode, fall back to LOCAL_BANKS without throwing
      banks.value = [...LOCAL_BANKS];
      error.value = err?.message || 'خطا در دریافت لیست بانک‌ها';
      return banks.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    banks,
    loading,
    error,
    fetchBanks
  };
}
