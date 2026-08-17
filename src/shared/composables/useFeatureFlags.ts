import { ref, computed } from 'vue';
import { adminApi, type FeatureFlag } from '../../api';

const flags = ref<FeatureFlag[]>([]);
const isLoading = ref(false);
const isLoaded = ref(false);
const error = ref<any>(null);

export function useFeatureFlags() {
  async function fetchFlags(force = false) {
    if (isLoaded.value && !force) return flags.value;
    isLoading.value = true;
    error.value = null;
    try {
      const data = await adminApi.getFeatureFlags();
      flags.value = Array.isArray(data) ? data : [];
      isLoaded.value = true;
    } catch (err) {
      console.warn('Failed to fetch feature flags:', err);
      error.value = err;
      // Do not throw, default to empty array
      flags.value = flags.value || [];
    } finally {
      isLoading.value = false;
    }
    return flags.value;
  }

  // Auto load if not yet fetched or loading
  if (!isLoaded.value && !isLoading.value) {
    fetchFlags();
  }

  const showRiskTier = computed(() => {
    const flag = flags.value.find(f => f.key === 'show_risk_tier');
    return flag ? flag.is_enabled : false;
  });

  const showLandingPage = computed(() => {
    const flag = flags.value.find(f => f.key === 'show_landing_page');
    return flag ? flag.is_enabled : false;
  });

  return {
    flags,
    isLoading,
    isLoaded,
    error,
    fetchFlags,
    showRiskTier,
    showLandingPage
  };
}
