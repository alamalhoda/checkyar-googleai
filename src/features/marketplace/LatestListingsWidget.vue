<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NTag, NButton, NSpin, NEmpty } from 'naive-ui';
import { BusinessOutline, CalendarOutline, FlashOutline, ArrowBackOutline } from '@vicons/ionicons5';
import { marketplaceApi } from '../../api';
import type { MarketplaceListing } from '../../types/api';

const router = useRouter();
const latestListings = ref<MarketplaceListing[]>([]);
const loading = ref(true);

const formatTomans = (amountStr: string) => {
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return Math.floor(num / 10).toLocaleString('fa-IR');
};

const loadLatest = async () => {
  loading.value = true;
  try {
    const res = await marketplaceApi.getLatestListings();
    latestListings.value = res;
  } catch (err) {
    console.error('Failed to load latest listings:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadLatest);

const goToDetail = (id: number) => {
  router.push(`/listings/${id}`);
};
</script>

<template>
  <div class="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
          <FlashOutline class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-base font-bold text-slate-100">جدیدترین چک‌های منتشر شده</h2>
          <p class="text-xs text-slate-400">آخرین فرصت‌های سرمایه‌گذاری ثبت شده در بازار</p>
        </div>
      </div>
      <NButton text type="primary" size="small" @click="router.push('/marketplace')">
        مشاهده همه
        <template #icon><ArrowBackOutline class="w-4 h-4" /></template>
      </NButton>
    </div>

    <NSpin :show="loading">
      <div v-if="latestListings.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NCard
          v-for="item in latestListings"
          :key="item.id"
          hoverable
          class="bg-slate-900/90 border border-slate-800/80 rounded-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg cursor-pointer"
          @click="goToDetail(item.id)"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-200 flex items-center gap-1">
              <BusinessOutline class="w-3.5 h-3.5 text-indigo-400" />
              {{ item.bank_name }}
            </span>
            <NTag size="small" :type="item.risk_tier === 'low' ? 'success' : item.risk_tier === 'medium' ? 'warning' : 'error'" round class="text-[10px]">
              {{ item.risk_tier === 'low' ? 'کم‌ریسک' : item.risk_tier === 'medium' ? 'متوسط' : 'پرریسک' }}
            </NTag>
          </div>

          <div class="my-3">
            <div class="text-[11px] text-slate-400">مبلغ اسمی:</div>
            <div class="text-lg font-black text-emerald-400">
              {{ formatTomans(item.face_amount) }} <span class="text-xs text-slate-400 font-normal">تومان</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span class="flex items-center gap-1">
              <CalendarOutline class="w-3 h-3 text-amber-400" />
              {{ item.due_date }}
            </span>
            <span class="text-indigo-400 font-bold">
              {{ item.suggested_discount_rate || '۲.۵' }}٪/ماه
            </span>
          </div>
        </NCard>
      </div>

      <NEmpty v-else description="هیچ آگهی جدیدی موجود نیست" class="py-6" />
    </NSpin>
  </div>
</template>
