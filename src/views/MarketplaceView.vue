<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard,
  NInput,
  NSelect,
  NInputNumber,
  NButton,
  NPagination,
  NSpin,
  NEmpty
} from 'naive-ui';
import { FilterOutline, RefreshOutline } from '@vicons/ionicons5';
import ListingCard from '../shared/components/ListingCard.vue';
import { marketplaceApi } from '../api';
import type { MarketplaceListing, ListingFilters } from '../types/api';

const router = useRouter();

const listings = ref<MarketplaceListing[]>([]);
const totalCount = ref(0);
const loading = ref(false);

const filters = ref<ListingFilters>({
  page: 1,
  page_size: 6,
  risk_tier: undefined,
  bank_name: undefined,
  issuer_type: undefined,
  min_amount: undefined,
  max_amount: undefined,
  max_days_to_due: undefined
});

const bankOptions = [
  { label: 'همه بانک‌ها', value: '' },
  { label: 'بانک ملت', value: 'بانک ملت' },
  { label: 'بانک ملی ایران', value: 'بانک ملی ایران' },
  { label: 'بانک پاسارگاد', value: 'بانک پاسارگاد' },
  { label: 'بانک تجارت', value: 'بانک تجارت' },
  { label: 'بانک صادرات ایران', value: 'بانک صادرات ایران' },
  { label: 'بانک سامان', value: 'بانک سامان' },
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

const loadListings = async () => {
  loading.value = true;
  try {
    const res = await marketplaceApi.getListings(filters.value);
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

const handleApplyFilters = () => {
  filters.value.page = 1;
  loadListings();
};

const handleResetFilters = () => {
  filters.value = { page: 1, page_size: 6 };
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
  <div class="space-y-6">
    <!-- Filter Toolbar -->
    <NCard class="bg-slate-900 border border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <FilterOutline class="w-5 h-5 text-emerald-400" />
          <h3 class="text-sm font-bold text-slate-100">فیلترهای جستجو در بازار مطالبات</h3>
        </div>
        <div class="flex items-center gap-2">
          <NButton size="small" quaternary @click="handleResetFilters">
            <template #icon><RefreshOutline class="w-4 h-4" /></template>
            بازنشانی فیلترها
          </NButton>
          <NButton size="small" type="primary" @click="handleApplyFilters">
            اعمال فیلتر
          </NButton>
        </div>
      </div>

      <!-- Filter Controls Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div>
          <label class="block text-slate-400 mb-1">بانک عامل:</label>
          <NSelect v-model:value="filters.bank_name" :options="bankOptions" placeholder="انتخاب بانک" clearable />
        </div>

        <div>
          <label class="block text-slate-400 mb-1">سطح اعتبارسنجی:</label>
          <NSelect v-model:value="filters.risk_tier" :options="riskOptions" placeholder="ریسک" clearable />
        </div>

        <div>
          <label class="block text-slate-400 mb-1">نوع صادرکننده:</label>
          <NSelect v-model:value="filters.issuer_type" :options="issuerOptions" placeholder="نوع صادرکننده" clearable />
        </div>

        <div>
          <label class="block text-slate-400 mb-1">حداکثر روز تا سررسید:</label>
          <NInputNumber v-model:value="filters.max_days_to_due" placeholder="مثلا: ۱۲۰" :min="1" />
        </div>

        <div>
          <label class="block text-slate-400 mb-1">حداقل مبلغ (ریال):</label>
          <NInputNumber v-model:value="filters.min_amount" placeholder="حداقل مبلغ" :step="100000000" />
        </div>
      </div>
    </NCard>

    <!-- Listings Grid -->
    <NSpin :show="loading">
      <div v-if="listings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ListingCard
          v-for="item in listings"
          :key="item.id"
          :listing="item"
          @view-detail="goToDetail"
          @express-interest="goToExpressInterest"
        />
      </div>

      <NEmpty v-else description="هیچ آگهی چک صیادی با مشخصات انتخاب شده یافت نشد." class="py-16" />
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
</template>
