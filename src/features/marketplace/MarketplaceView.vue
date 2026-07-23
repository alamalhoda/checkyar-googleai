<script setup lang="ts">
import { ref, onMounted, watch, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NInput, NSelect, NInputNumber, NButton, NPagination, NSpin, NEmpty,
  NDataTable, NTag, NSpace, NTabs, NTabPane, type DataTableColumns
} from 'naive-ui';
import {
  FilterOutline, RefreshOutline, GridOutline, ListOutline, BusinessOutline,
  CalendarOutline, TrendingDownOutline, ShieldCheckmarkOutline
} from '@vicons/ionicons5';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ListingCard from '../../shared/components/ListingCard.vue';
import LatestListingsWidget from './LatestListingsWidget.vue';
import { marketplaceApi } from '../../api';
import type { MarketplaceListing, ListingFilters } from '../../types/api';

const router = useRouter();

const listings = ref<MarketplaceListing[]>([]);
const totalCount = ref(0);
const loading = ref(false);
const viewMode = ref<'cards' | 'table'>('cards');

const filters = ref<ListingFilters>({
  page: 1,
  page_size: 20,
  ordering: undefined,
  risk_tier: undefined,
  bank_name: undefined,
  issuer_type: undefined,
  min_amount: undefined,
  max_amount: undefined,
  max_days_to_due: undefined
});

const bankOptions = [
  { label: 'همه بانک‌ها', value: '' },
  { label: 'بانک سامان', value: 'بانک سامان' },
  { label: 'بانک ملی ایران', value: 'بانک ملی ایران' },
  { label: 'بانک ملت', value: 'بانک ملت' },
  { label: 'بانک تجارت', value: 'بانک تجارت' },
  { label: 'بانک صادرات ایران', value: 'بانک صادرات ایران' },
  { label: 'بانک پاسارگاد', value: 'بانک پاسارگاد' },
  { label: 'بانک پارسیان', value: 'بانک پارسیان' },
  { label: 'بانک سپه', value: 'بانک سپه' }
];

const riskOptions = [
  { label: 'همه سطوح ریسک', value: '' },
  { label: 'کم‌ریسک (Low)', value: 'low' },
  { label: 'متوسط (Medium)', value: 'medium' },
  { label: 'پرریسک (High)', value: 'high' }
];

const issuerOptions = [
  { label: 'همه صادرکنندگان', value: '' },
  { label: 'حقوقی (شرکتی)', value: 'legal' },
  { label: 'حقیقی (شخصی)', value: 'natural' }
];

const formatTomans = (amountStr: string) => {
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return Math.floor(num / 10).toLocaleString('fa-IR');
};

const maskIdentity = (idStr?: string | null) => {
  if (!idStr || idStr.length < 5) return '***';
  return idStr.substring(0, 3) + '****' + idStr.substring(idStr.length - 2);
};

const columns: DataTableColumns<MarketplaceListing> = [
  {
    title: 'بانک و شناسه',
    key: 'bank_name',
    render(row) {
      return h('div', { class: 'space-y-0.5' }, [
        h('div', { class: 'font-bold text-slate-100 flex items-center gap-1' }, row.bank_name),
        h('div', { class: 'text-[11px] text-slate-400 font-mono' }, `صیاد: ${row.cheque_serial_number}`)
      ]);
    }
  },
  {
    title: 'مبلغ اسمی (تومان)',
    key: 'face_amount',
    sorter: true,
    render(row) {
      return h('span', { class: 'font-black text-emerald-400' }, `${formatTomans(row.face_amount)} تومان`);
    }
  },
  {
    title: 'تاریخ سررسید',
    key: 'due_date',
    sorter: true,
    render(row) {
      return h('span', { class: 'text-slate-300' }, row.due_date);
    }
  },
  {
    title: 'روز تا سررسید',
    key: 'days_to_due',
    sorter: true,
    render(row) {
      return h('span', { class: 'font-mono text-amber-400' }, `${row.days_to_due} روز`);
    }
  },
  {
    title: 'نرخ تنزیل',
    key: 'suggested_discount_rate',
    sorter: true,
    render(row) {
      return h('span', { class: 'text-indigo-400 font-bold' }, `${row.suggested_discount_rate || '2.5'}٪/ماه`);
    }
  },
  {
    title: 'صادرکننده',
    key: 'issuer_name',
    render(row) {
      return h('div', { class: 'text-xs' }, [
        h('div', { class: 'font-medium text-slate-200' }, row.issuer_name),
        h('div', { class: 'text-[10px] text-slate-400' }, `${row.issuer_type === 'legal' ? 'حقوقی' : 'حقیقی'} (${maskIdentity(row.issuer_national_id)})`)
      ]);
    }
  },
  {
    title: 'سطح ریسک',
    key: 'risk_tier',
    render(row) {
      const type = row.risk_tier === 'low' ? 'success' : row.risk_tier === 'medium' ? 'warning' : 'error';
      const label = row.risk_tier === 'low' ? 'کم‌ریسک' : row.risk_tier === 'medium' ? 'متوسط' : 'پرریسک';
      return h(NTag, { type, size: 'small', round: true }, () => label);
    }
  },
  {
    title: 'عملیات',
    key: 'actions',
    render(row) {
      return h(NSpace, { size: 'small' }, () => [
        h(NButton, {
          size: 'small',
          secondary: true,
          onClick: () => router.push(`/listings/${row.id}`)
        }, () => 'جزئیات'),
        h(NButton, {
          size: 'small',
          type: 'primary',
          onClick: () => router.push(`/matches/express-interest/${row.id}`)
        }, () => 'پیشنهاد خرید')
      ]);
    }
  }
];

const loadListings = async () => {
  loading.value = true;
  try {
    const cleanFilters: ListingFilters = { ...filters.value };
    if (!cleanFilters.bank_name) delete cleanFilters.bank_name;
    if (!cleanFilters.risk_tier) delete cleanFilters.risk_tier;
    if (!cleanFilters.issuer_type) delete cleanFilters.issuer_type;

    const res = await marketplaceApi.getListings(cleanFilters);
    listings.value = res.results;
    totalCount.value = res.count;
  } catch (err) {
    console.error('Failed to load marketplace listings', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadListings);

watch(() => filters.value.page, loadListings);

const handleSorterChange = (sorter: any) => {
  if (sorter && sorter.columnKey && sorter.order) {
    const prefix = sorter.order === 'descend' ? '-' : '';
    filters.value.ordering = `${prefix}${sorter.columnKey}`;
  } else {
    filters.value.ordering = undefined;
  }
  filters.value.page = 1;
  loadListings();
};

const handleApplyFilters = () => {
  filters.value.page = 1;
  loadListings();
};

const handleResetFilters = () => {
  filters.value = {
    page: 1,
    page_size: 20,
    ordering: undefined,
    risk_tier: undefined,
    bank_name: undefined,
    issuer_type: undefined,
    min_amount: undefined,
    max_amount: undefined,
    max_days_to_due: undefined
  };
  loadListings();
};

const goToDetail = (id: number) => {
  router.push(`/listings/${id}`);
};

const goToExpressInterest = (id: number) => {
  router.push(`/matches/express-interest/${id}`);
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <!-- Latest Listings Widget -->
        <LatestListingsWidget />

        <!-- Main Marketplace Section -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Sidebar Filters -->
          <NCard class="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl h-fit">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div class="flex items-center gap-2">
                <FilterOutline class="w-5 h-5 text-emerald-400" />
                <h3 class="text-sm font-bold text-slate-100">فیلترهای پیشرفته</h3>
              </div>
              <NButton size="tiny" quaternary @click="handleResetFilters">
                <template #icon><RefreshOutline class="w-3.5 h-3.5" /></template>
                بازنشانی
              </NButton>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block text-slate-400 mb-1">بانک عامل:</label>
                <NSelect v-model:value="filters.bank_name" :options="bankOptions" placeholder="همه بانک‌ها" clearable />
              </div>

              <div>
                <label class="block text-slate-400 mb-1">سطح اعتبارسنجی:</label>
                <NSelect v-model:value="filters.risk_tier" :options="riskOptions" placeholder="همه سطوح" clearable />
              </div>

              <div>
                <label class="block text-slate-400 mb-1">نوع صادرکننده:</label>
                <NSelect v-model:value="filters.issuer_type" :options="issuerOptions" placeholder="همه صادرکنندگان" clearable />
              </div>

              <div>
                <label class="block text-slate-400 mb-1">حداکثر روز تا سررسید:</label>
                <NInputNumber v-model:value="filters.max_days_to_due" placeholder="مثلاً: ۱۲۰" :min="1" class="w-full" />
              </div>

              <div>
                <label class="block text-slate-400 mb-1">حداقل مبلغ اسمی (ریال):</label>
                <NInputNumber v-model:value="filters.min_amount" placeholder="حداقل مبلغ" :step="50000000" class="w-full" />
              </div>

              <div>
                <label class="block text-slate-400 mb-1">حداکثر مبلغ اسمی (ریال):</label>
                <NInputNumber v-model:value="filters.max_amount" placeholder="حداکثر مبلغ" :step="100000000" class="w-full" />
              </div>

              <NButton type="primary" block @click="handleApplyFilters" class="font-bold mt-2">
                اعمال فیلترها
              </NButton>
            </div>
          </NCard>

          <!-- Main Content Area -->
          <div class="lg:col-span-3 space-y-4">
            <!-- Top Controls bar -->
            <div class="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3">
              <div class="text-xs text-slate-400">
                نمایش <span class="font-bold text-slate-100">{{ listings.length }}</span> از <span class="font-bold text-slate-100">{{ totalCount }}</span> آگهی چک صیادی
              </div>

              <div class="flex items-center gap-2">
                <NButton
                  size="small"
                  :secondary="viewMode === 'cards'"
                  :tertiary="viewMode !== 'cards'"
                  @click="viewMode = 'cards'"
                >
                  <template #icon><GridOutline class="w-4 h-4" /></template>
                  کارت‌ها
                </NButton>
                <NButton
                  size="small"
                  :secondary="viewMode === 'table'"
                  :tertiary="viewMode !== 'table'"
                  @click="viewMode = 'table'"
                >
                  <template #icon><ListOutline class="w-4 h-4" /></template>
                  جدول
                </NButton>
              </div>
            </div>

            <!-- Content Grid/Table -->
            <NSpin :show="loading">
              <template v-if="listings.length > 0">
                <!-- Cards Mode -->
                <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ListingCard
                    v-for="item in listings"
                    :key="item.id"
                    :listing="item"
                    @view-detail="goToDetail"
                    @express-interest="goToExpressInterest"
                  />
                </div>

                <!-- Table Mode -->
                <div v-else class="bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-x-auto">
                  <NDataTable
                    :columns="columns"
                    :data="listings"
                    :bordered="false"
                    :single-line="false"
                    @update:sorter="handleSorterChange"
                  />
                </div>
              </template>

              <NEmpty v-else description="هیچ آگهی چک صیادی با مشخصات انتخاب شده یافت نشد." class="py-20 bg-slate-900 border border-slate-800 rounded-2xl" />
            </NSpin>

            <!-- Pagination -->
            <div v-if="totalCount > filters.page_size!" class="flex justify-center pt-4">
              <NPagination
                v-model:page="filters.page"
                :page-size="filters.page_size"
                :item-count="totalCount"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
