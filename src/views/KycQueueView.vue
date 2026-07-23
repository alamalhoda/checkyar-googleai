<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NButton, NSpin, NEmpty, NTag } from 'naive-ui';
import { moderationApi } from '../api';
import { useBackendSimulatorStore } from '../stores/useBackendSimulatorStore';
import type { Verification } from '../types/api';

const simulatorStore = useBackendSimulatorStore();

const kycItems = ref<Verification[]>([]);
const loading = ref(false);

const loadKycQueue = async () => {
  loading.value = true;
  try {
    kycItems.value = await moderationApi.getKycQueue();
  } catch (err) {
    console.error('Failed to load KYC queue', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadKycQueue);

const handleDecision = (id: number, status: 'approved' | 'rejected') => {
  simulatorStore.handleKycDecision(id, status);
  kycItems.value = kycItems.value.filter(k => k.id !== id);
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-base font-bold text-slate-100">صف بررسی احراز هویت و مدارک (KYC Queue)</h1>
      <p class="text-xs text-slate-400">بررسی و استعلام تطابق اطلاعات هویتی و کارت ملی</p>
    </div>

    <NSpin :show="loading">
      <div v-if="kycItems.length > 0" class="space-y-4">
        <NCard v-for="item in kycItems" :key="item.id" class="bg-slate-900 border border-slate-800 rounded-xl">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-slate-100">{{ item.full_name }}</span>
                <span class="text-xs font-mono text-slate-400">کد ملی: {{ item.national_id }}</span>
                <NTag size="small" type="warning">در انتظار تایید</NTag>
              </div>
              <div v-if="item.company_name" class="text-xs text-slate-400">شرکت: {{ item.company_name }}</div>
            </div>

            <div class="flex items-center gap-2">
              <NButton type="error" secondary size="small" @click="handleDecision(item.id, 'rejected')">
                رد مدارک
              </NButton>
              <NButton type="primary" size="small" @click="handleDecision(item.id, 'approved')">
                تایید احراز هویت
              </NButton>
            </div>
          </div>
        </NCard>
      </div>

      <NEmpty v-else description="صف احراز هویت در حال حاضر خالی است." class="py-16" />
    </NSpin>
  </div>
</template>
