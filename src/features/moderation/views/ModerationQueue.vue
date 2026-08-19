<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6 space-y-6" data-testid="moderation-queue-page">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
      <div>
        <h1 class="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>صف بررسی و نظارت آگهی‌ها</span>
          <NBadge :value="queueList.length" type="warning" />
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          لیست آگهی‌های منتظر تأیید ناظر به همراه شاخص ریسک و زمان انتظار
        </p>
      </div>

      <div class="flex items-center gap-3">
        <NSelect
          v-model:value="riskFilter"
          :options="riskOptions"
          size="small"
          class="w-36"
        />
        <NButton type="primary" secondary size="small" @click="store.fetchModerationQueue">
          بروزرسانی لیست
        </NButton>
      </div>
    </div>

    <!-- Queue List Table -->
    <NCard class="bg-slate-900/50 border-slate-800">
      <NSpin :show="store.loading">
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3">کد آگهی</th>
                <th class="p-3">شناسه صیادی / بانک</th>
                <th class="p-3">مبلغ (تومان)</th>
                <th class="p-3">زمان انتظار</th>
                <th class="p-3">شاخص ریسک اولیه</th>
                <th class="p-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-200">
              <tr
                v-for="item in filteredQueue"
                :key="item.id"
                data-testid="moderation-item"
                :data-serial="item.cheque_serial_number"
                class="hover:bg-slate-800/30 transition-colors"
              >
                <td class="p-3 font-mono font-bold text-slate-300">#{{ item.id }}</td>
                <td class="p-3">
                  <div class="font-mono text-slate-100 mb-1">{{ item.cheque_serial_number || '1234567890123456' }}</div>
                  <BankBadge
                    :bank="item.bank"
                    :fallback-name="item.bank_name || 'بانک ملت'"
                    size="compact"
                    theme="dark"
                  />
                </td>
                <td class="p-3 font-bold text-emerald-400">{{ Number(item.face_amount || 0).toLocaleString('fa-IR') }}</td>
                <td class="p-3 text-amber-300 font-mono">۱۵ دقیقه</td>
                <td class="p-3">
                  <NTag size="small" :type="item.risk_tier === 'high' ? 'error' : item.risk_tier === 'medium' ? 'warning' : 'success'">
                    سطح {{ item.risk_tier === 'high' ? 'پرریسک' : item.risk_tier === 'medium' ? 'متوسط' : 'کم‌ریسک' }}
                  </NTag>
                </td>
                <td class="p-3 text-center">
                  <NButton type="primary" size="small" data-testid="moderation-review-open" @click="goReview(item.id)">
                    بررسی و تصمیم‌گیری
                  </NButton>
                </td>
              </tr>
              <tr v-if="filteredQueue.length === 0">
                <td colspan="6" class="p-8 text-center text-slate-500">
                  هیچ آگهی در صف نظارت یافت نشد.
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NBadge, NSelect, NButton, NTag, NSpin } from 'naive-ui';
import BankBadge from '../../../shared/components/BankBadge.vue';
import { useModerationStore } from '../stores/moderationStore';

const router = useRouter();
const store = useModerationStore();
const riskFilter = ref<string>('all');

const riskOptions = [
  { label: 'همه سطوح ریسک', value: 'all' },
  { label: 'ریسک بالا (>۷۰)', value: 'high' },
  { label: 'ریسک متوسط (۴۰-۷۰)', value: 'medium' },
  { label: 'ریسک پایین (<۴۰)', value: 'low' }
];

const queueList = computed(() => Array.isArray(store.moderationQueue) ? store.moderationQueue : []);

const filteredQueue = computed(() => {
  const list = queueList.value;
  if (riskFilter.value === 'high') return list.filter(i => i?.risk_tier === 'high');
  if (riskFilter.value === 'medium') return list.filter(i => i?.risk_tier === 'medium');
  if (riskFilter.value === 'low') return list.filter(i => i?.risk_tier === 'low');
  return list;
});

onMounted(() => {
  store.fetchModerationQueue();
});

function goReview(id: number) {
  router.push(`/moderation/review/${id}`);
}
</script>
