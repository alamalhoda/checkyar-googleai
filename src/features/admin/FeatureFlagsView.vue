<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NSwitch, NSpin, NTag, NButton, useMessage } from 'naive-ui';
import { ToggleOutline, RefreshOutline, LockClosedOutline } from '@vicons/ionicons5';
import { adminApi } from '../../api';
import type { FeatureFlag } from '../../types/api';

const message = useMessage();
const flags = ref<FeatureFlag[]>([]);
const loading = ref(false);
const updatingKey = ref<string | null>(null);

const loadFlags = async () => {
  loading.value = true;
  try {
    flags.value = await adminApi.getFeatureFlags();
  } catch (err: any) {
    message.error('خطا در دریافت لیست کلیدهای ویژگی.');
  } finally {
    loading.value = false;
  }
};

onMounted(loadFlags);

const handleToggle = async (flag: FeatureFlag, newValue: boolean) => {
  if (flag.is_system) {
    message.warning('قابلیت‌های سیستمی پایه قابل غیرفعال‌سازی نمی‌باشند.');
    return;
  }

  updatingKey.value = flag.key;
  try {
    await adminApi.updateFeatureFlag(flag.key, newValue);
    flag.is_enabled = newValue;
    message.success(`ویژگی «${flag.key}» با موفقیت ${newValue ? 'فعال' : 'غیرفعال'} گردید.`);
  } catch (err: any) {
    message.error('خطا در تغییر وضعیت کلید ویژگی.');
  } finally {
    updatingKey.value = null;
  }
};
</script>

<template>
  <div class="space-y-6 dir-rtl">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
          <ToggleOutline class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-100">مدیریت کلیدهای ویژگی (Feature Flags)</h1>
          <p class="text-xs text-slate-400 mt-0.5">کنترل و فعال/غیرفعال‌سازی آنی ماژول‌ها و سرویس‌های پلتفرم چک‌یار</p>
        </div>
      </div>

      <NButton secondary size="small" :loading="loading" @click="loadFlags">
        <template #icon><RefreshOutline class="w-4 h-4" /></template>
        بروزرسانی لیست
      </NButton>
    </div>

    <!-- Flags List -->
    <NSpin :show="loading">
      <div class="space-y-4 max-w-4xl">
        <NCard
          v-for="flag in flags"
          :key="flag.key"
          class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition-all"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-mono font-bold text-indigo-400 dir-ltr bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                  {{ flag.key }}
                </span>

                <NTag v-if="flag.is_system" size="small" type="warning" round class="font-bold">
                  <template #icon><LockClosedOutline class="w-3 h-3" /></template>
                  سیستمی (قفل شده)
                </NTag>

                <NTag size="small" :type="flag.is_enabled ? 'success' : 'default'" round>
                  {{ flag.is_enabled ? 'فعال در سیستم' : 'غیرفعال' }}
                </NTag>
              </div>

              <p class="text-xs text-slate-300 leading-relaxed">
                {{ flag.description }}
              </p>
            </div>

            <!-- Switch control -->
            <div class="shrink-0 flex items-center gap-2 self-end sm:self-center">
              <NSwitch
                :value="flag.is_enabled"
                :disabled="flag.is_system || updatingKey === flag.key"
                :loading="updatingKey === flag.key"
                size="medium"
                @update:value="(val) => handleToggle(flag, val)"
              >
                <template #checked>روشن</template>
                <template #unchecked>خاموش</template>
              </NSwitch>
            </div>
          </div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
