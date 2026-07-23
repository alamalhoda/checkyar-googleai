<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NSwitch, NSpin, NTag } from 'naive-ui';
import { adminApi } from '../api';
import type { FeatureFlag } from '../types/api';

const flags = ref<FeatureFlag[]>([]);
const loading = ref(false);

const loadFlags = async () => {
  loading.value = true;
  try {
    flags.value = await adminApi.getFeatureFlags();
  } catch (err) {
    console.error('Failed to load feature flags', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadFlags);

const toggleFlag = async (key: string) => {
  try {
    await adminApi.toggleFeatureFlag(key);
    const flag = flags.value.find(f => f.key === key);
    if (flag) flag.is_enabled = !flag.is_enabled;
  } catch (err) {
    console.error('Failed to toggle flag', err);
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-base font-bold text-slate-100">مدیریت کلیدهای ویژگی سامانه (Feature Flags)</h1>
      <p class="text-xs text-slate-400">کنترل آنی قابلیت‌های عملیاتی پلتفرم چک‌یار</p>
    </div>

    <NSpin :show="loading">
      <div class="space-y-3">
        <NCard v-for="flag in flags" :key="flag.key" class="bg-slate-900 border border-slate-800 rounded-xl">
          <div class="flex items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold text-indigo-400">{{ flag.key }}</span>
                <NTag v-if="flag.is_system" size="small" type="warning" round>سیستمی</NTag>
              </div>
              <p class="text-xs text-slate-300">{{ flag.description }}</p>
            </div>

            <NSwitch :value="flag.is_enabled" @update:value="toggleFlag(flag.key)" />
          </div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
