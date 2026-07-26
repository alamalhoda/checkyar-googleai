<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
      <div>
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span>صف بررسی احراز هویت (KYC)</span>
          <NBadge :value="store.kycQueue.length" type="info" />
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          درخواست‌های احراز هویت کاربران در انتظار تأیید مدارک هویت
        </p>
      </div>

      <NButton type="primary" secondary size="small" @click="store.fetchKycQueue">
        بروزرسانی لیست
      </NButton>
    </div>

    <!-- KYC Table -->
    <NCard class="bg-slate-900/50 border-slate-800">
      <NSpin :show="store.loading">
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3">شناسه کاربری</th>
                <th class="p-3">نام و نام خانوادگی</th>
                <th class="p-3">کد ملی</th>
                <th class="p-3">تاریخ ارسال</th>
                <th class="p-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-200">
              <tr v-for="item in store.kycQueue" :key="item.id" class="hover:bg-slate-800/30 transition-colors">
                <td class="p-3 font-mono font-bold text-slate-300">#{{ item.user_id }}</td>
                <td class="p-3 font-semibold text-white">{{ item.full_name }}</td>
                <td class="p-3 font-mono text-slate-300">{{ item.national_id }}</td>
                <td class="p-3 text-slate-400 font-mono">{{ formatDate(item.submitted_at) }}</td>
                <td class="p-3 text-center">
                  <NButton type="primary" size="small" @click="goReview(item.id)">
                    بررسی مدارک KYC
                  </NButton>
                </td>
              </tr>
              <tr v-if="store.kycQueue.length === 0">
                <td colspan="5" class="p-8 text-center text-slate-500">
                  درخواستی در صف احراز هویت وجود ندارد.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </NSpin>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NBadge, NButton, NSpin } from 'naive-ui';
import { useModerationStore } from '../stores/moderationStore';

const router = useRouter();
const store = useModerationStore();

onMounted(() => {
  store.fetchKycQueue();
});

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('fa-IR');
  } catch {
    return iso;
  }
}

function goReview(id: number) {
  router.push(`/moderation/kyc/${id}`);
}
</script>
