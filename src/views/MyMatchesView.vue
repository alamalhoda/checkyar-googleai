<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NTag, NButton, NSpin, NEmpty } from 'naive-ui';
import { matchesApi } from '../api';
import type { Match } from '../types/api';
import { MATCH_STATUS_LABELS } from '../types/api';

const router = useRouter();

const matchesList = ref<Match[]>([]);
const loading = ref(false);

const loadMatches = async () => {
  loading.value = true;
  try {
    matchesList.value = await matchesApi.getMyMatches();
  } catch (err) {
    console.error('Error loading my matches', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadMatches);

const statusTagType = (status: Match['status']) => {
  switch (status) {
    case 'accepted': return 'success';
    case 'pending': return 'warning';
    case 'declined': return 'error';
    case 'cancelled': return 'default';
    default: return 'info';
  }
};

const goToMatchDetail = (id: number) => {
  router.push(`/matches/${id}`);
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-base font-bold text-slate-100">تطابق‌ها و معامله‌های من</h1>
      <p class="text-xs text-slate-400">لیست پیشنهادهای خرید و توافقات چک صیادی</p>
    </div>

    <NSpin :show="loading">
      <div v-if="matchesList.length > 0" class="space-y-4">
        <NCard
          v-for="item in matchesList"
          :key="item.id"
          hoverable
          class="bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-all"
          @click="goToMatchDetail(item.id)"
        >
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-slate-100">{{ item.listing.bank_name }}</span>
                <NTag :type="statusTagType(item.status)" size="small" round>
                  {{ MATCH_STATUS_LABELS[item.status] }}
                </NTag>
              </div>
              <div class="text-xs text-slate-400 flex items-center gap-4">
                <span>دارنده: <strong class="text-slate-200">{{ item.check_holder.name }}</strong></span>
                <span>سرمایه‌گذار: <strong class="text-slate-200">{{ item.investor.name }}</strong></span>
              </div>
            </div>

            <div class="text-right">
              <div class="text-base font-black text-emerald-400">
                {{ Math.floor(Number(item.listing.face_amount) / 10).toLocaleString('fa-IR') }} تومان
              </div>
              <div class="text-[11px] text-slate-400">روش تسویه: {{ item.settlement_type === 'escrow' ? 'امانی' : 'حضوری/خارج پلتفرم' }}</div>
            </div>
          </div>
        </NCard>
      </div>

      <NEmpty v-else description="هنوز هیچ درخواست تطابق یا پیشنهادی ثبت نکرده‌اید." class="py-16" />
    </NSpin>
  </div>
</template>
