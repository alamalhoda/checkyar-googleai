<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NCard, NTag, NButton, NSpin, NAlert, NDivider } from 'naive-ui';
import {
  BusinessOutline,
  CalendarOutline,
  ShieldCheckmarkOutline,
  PersonOutline,
  TrendingDownOutline,
  ArrowBackOutline
} from '@vicons/ionicons5';
import { listingsApi } from '../api';
import type { ChequeListing } from '../types/api';
import { LISTING_STATUS_LABELS } from '../types/api';

const route = useRoute();
const router = useRouter();

const listing = ref<ChequeListing | null>(null);
const loading = ref(false);

const loadDetail = async () => {
  const id = Number(route.params.id);
  if (!id) return;
  loading.value = true;
  try {
    listing.value = await listingsApi.getListing(id);
  } catch (err) {
    console.error('Error loading listing detail', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadDetail);

const formattedAmount = computed(() => {
  if (!listing.value) return { rials: '0', tomans: '0' };
  const num = Number(listing.value.face_amount);
  return {
    rials: num.toLocaleString('fa-IR'),
    tomans: Math.floor(num / 10).toLocaleString('fa-IR')
  };
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <NButton quaternary @click="router.back()">
        <template #icon><ArrowBackOutline class="w-4 h-4" /></template>
        بازگشت
      </NButton>

      <div class="flex gap-2" v-if="listing">
        <NButton v-if="listing.status === 'published'" type="primary" @click="router.push(`/matches/express-interest/${listing.id}`)">
          ثبت ابراز تمایل / پیشنهاد خرید
        </NButton>

        <NButton v-if="listing.status === 'rejected'" type="warning" @click="router.push(`/listings/${listing.id}/edit`)">
          ویرایش و ارسال مجدد
        </NButton>
      </div>
    </div>

    <NSpin :show="loading">
      <div v-if="listing" class="space-y-6">
        <!-- Rejection Alert if rejected -->
        <NAlert v-if="listing.status === 'rejected'" type="error" title="علت رد آگهی توسط ناظر" class="text-xs">
          <p>{{ listing.rejection_reason }}</p>
          <span v-if="listing.rejection_code" class="font-mono text-[10px] mt-1 block">کد خطای نظارت: {{ listing.rejection_code }}</span>
        </NAlert>

        <!-- Main Details Card -->
        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
          <div class="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BusinessOutline class="w-6 h-6" />
              </div>
              <div>
                <h1 class="text-lg font-black text-slate-100">{{ listing.bank_name }}</h1>
                <p class="text-xs text-slate-400 font-mono">شناسه صیادی: {{ listing.cheque_serial_number }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <NTag :type="listing.risk_tier === 'low' ? 'success' : listing.risk_tier === 'medium' ? 'warning' : 'error'" round>
                اعتبارسنجی: {{ listing.risk_tier === 'low' ? 'ریسک پایین' : listing.risk_tier === 'medium' ? 'ریسک متوسط' : 'ریسک بالا' }}
              </NTag>
              <NTag type="info" round>
                {{ LISTING_STATUS_LABELS[listing.status] }}
              </NTag>
            </div>
          </div>

          <!-- Face Amount Highlight -->
          <div class="p-5 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span class="text-xs text-slate-400 block mb-1">مبلغ اسمی چک:</span>
              <div class="text-2xl font-black text-emerald-400 tracking-tight">
                {{ formattedAmount.tomans }} <span class="text-sm font-normal text-slate-400">تومان</span>
              </div>
              <span class="text-[11px] text-slate-500">({{ formattedAmount.rials }} ریال)</span>
            </div>

            <div class="text-left bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span class="text-xs text-slate-400 block mb-1">نرخ تنزیل پیشنهادی:</span>
              <span class="text-lg font-bold text-indigo-400 flex items-center gap-1">
                <TrendingDownOutline class="w-5 h-5" />
                {{ listing.suggested_discount_rate || '۲.۵' }}٪ ماهیانه
              </span>
            </div>
          </div>

          <!-- Key Metadata Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div class="text-slate-400 font-semibold mb-2">مشخصات صادرکننده اصلی چک</div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">نام صادرکننده:</span>
                <span class="font-bold text-slate-200">{{ listing.issuer_name }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">شناسه/کد ملی:</span>
                <span class="font-mono text-slate-200">{{ listing.issuer_national_id }}</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-slate-400">امتیاز اعتباری صادرکننده:</span>
                <span class="font-bold text-emerald-400">{{ listing.issuer_profile?.credit_score || '۷۸۰' }} از ۱۰۰۰</span>
              </div>
            </div>

            <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div class="text-slate-400 font-semibold mb-2">زمان‌بندی و شرایط سررسید</div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">تاریخ سررسید چک:</span>
                <span class="font-bold text-amber-400">{{ listing.due_date }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">تعداد دفعات ارسال مجدد:</span>
                <span class="font-mono text-slate-200">{{ listing.resubmit_count }}</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-slate-400">تاریخ ثبت اولیه:</span>
                <span class="text-slate-300">{{ listing.created_at.split('T')[0] }}</span>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div v-if="listing.description" class="space-y-2">
            <h3 class="text-xs font-bold text-slate-200">توضیحات و بابت معامله:</h3>
            <p class="text-xs text-slate-300 leading-relaxed p-4 bg-slate-950/40 rounded-xl border border-slate-800">
              {{ listing.description }}
            </p>
          </div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
