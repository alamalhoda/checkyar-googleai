<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  NCard,
  NGrid,
  NGridItem,
  NSelect,
  NDatePicker,
  NInputNumber,
  NButton,
  NSwitch,
  NTag,
  NIcon,
  NSpace
} from 'naive-ui';
import { FilterOutline, RefreshOutline, FlashOutline } from '@vicons/ionicons5';
import BankSelect from '../../../shared/components/BankSelect.vue';
import { useReportsStore } from '../stores/reportsStore';
import type { DateBucket } from '../types/reports.types';

const store = useReportsStore();

// Local copy for date picker handling
const dateRange = ref<[number, number] | null>(null);

const bucketOptions = [
  { label: 'روزانه (Day)', value: 'day' },
  { label: 'هفتگی (Week)', value: 'week' },
  { label: 'ماهانه (Month)', value: 'month' }
];

const riskOptions = [
  { label: 'همه سطوح ریسک', value: 'all' },
  { label: 'کم ریسک (Low)', value: 'low' },
  { label: 'ریسک متوسط (Medium)', value: 'medium' },
  { label: 'پرریسک (High)', value: 'high' }
];

const provinceOptions = [
  { label: 'همه استان‌ها', value: '' },
  { label: 'تهران', value: 'تهران' },
  { label: 'اصفهان', value: 'اصفهان' },
  { label: 'خراسان رضوی', value: 'خراسان رضوی' },
  { label: 'فارس', value: 'فارس' },
  { label: 'آذربایجان شرقی', value: 'آذربایجان شرقی' }
];

const handleBucketChange = (val: DateBucket) => {
  store.setFilters({ bucket: val });
};

const handleRiskChange = (val: string) => {
  store.setFilters({ riskLevel: val as any });
};

const handleProvinceChange = (val: string) => {
  store.setFilters({ province: val });
};

const handleBankChange = (val: string) => {
  store.setFilters({ bank: val });
};

const handleDateChange = (val: [number, number] | null) => {
  if (val) {
    const fromStr = new Date(val[0]).toISOString().split('T')[0];
    const toStr = new Date(val[1]).toISOString().split('T')[0];
    store.setFilters({ from: fromStr, to: toStr });
  } else {
    store.setFilters({ from: undefined, to: undefined });
  }
};

const applyFilters = () => {
  store.triggerDashboardFetch();
};

const resetFilters = () => {
  dateRange.value = null;
  store.resetFilters();
};
</script>

<template>
  <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-md mb-6">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-3">
      <div class="flex items-center gap-2">
        <NIcon size="18" class="text-emerald-400"><FilterOutline /></NIcon>
        <span class="font-bold text-sm text-slate-100">فیلترهای عمومی گزارشات (Global Filters)</span>
        <NTag size="small" type="info" class="mr-2">زیرساخت REST API / Simulator Mode</NTag>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <NSwitch v-model:value="store.autoRefresh" size="small" />
          <span class="flex items-center gap-1">
            <NIcon size="14" class="text-amber-400"><FlashOutline /></NIcon>
            بروزرسانی لحظه‌ای خودکار
          </span>
        </div>

        <NSpace>
          <NButton size="small" quaternary @click="resetFilters">
            بازنشانی فیلترها
          </NButton>

          <NButton size="small" type="primary" :loading="store.loading" @click="applyFilters" class="font-bold">
            <template #icon>
              <NIcon><RefreshOutline /></NIcon>
            </template>
            اعمال فیلترها
          </NButton>
        </NSpace>
      </div>
    </div>

    <!-- Filter Inputs Grid -->
    <NGrid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:6" responsive="screen">
      <!-- Date Range Picker -->
      <NGridItem span="1 s:2 m:2">
        <div class="flex flex-col gap-1">
          <label class="text-[11px] font-semibold text-slate-400">بازه زمانی تاریخ</label>
          <NDatePicker
            v-model:value="dateRange"
            type="daterange"
            clearable
            size="small"
            @update:value="handleDateChange"
            placeholder="انتخاب از تاریخ تا تاریخ"
          />
        </div>
      </NGridItem>

      <!-- Date Bucket Granularity -->
      <NGridItem>
        <div class="flex flex-col gap-1">
          <label class="text-[11px] font-semibold text-slate-400">گام زمانی (Bucket)</label>
          <NSelect
            :value="store.filters.bucket"
            :options="bucketOptions"
            size="small"
            @update:value="handleBucketChange"
          />
        </div>
      </NGridItem>

      <!-- Province Filter -->
      <NGridItem>
        <div class="flex flex-col gap-1">
          <label class="text-[11px] font-semibold text-slate-400">استان / منطقه</label>
          <NSelect
            :value="store.filters.province || ''"
            :options="provinceOptions"
            size="small"
            @update:value="handleProvinceChange"
          />
        </div>
      </NGridItem>

      <!-- Bank Filter -->
      <NGridItem>
        <div class="flex flex-col gap-1">
          <label class="text-[11px] font-semibold text-slate-400">بانک صادرکننده</label>
          <BankSelect
            :value="store.filters.bank || ''"
            allow-all
            size="small"
            placeholder="همه بانک‌ها"
            @update:value="handleBankChange"
          />
        </div>
      </NGridItem>

      <!-- Risk Level -->
      <NGridItem>
        <div class="flex flex-col gap-1">
          <label class="text-[11px] font-semibold text-slate-400">سطح ریسک</label>
          <NSelect
            :value="store.filters.riskLevel || 'all'"
            :options="riskOptions"
            size="small"
            @update:value="handleRiskChange"
          />
        </div>
      </NGridItem>
    </NGrid>
  </NCard>
</template>
