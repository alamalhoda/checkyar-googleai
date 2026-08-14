<template>
  <div class="space-y-4">
    <div v-if="proposals.length === 0" class="text-center py-8 text-slate-500 text-xs">
      هنوز پیشنهادی ثبت نشده است.
    </div>

    <div
      v-for="prop in proposals"
      :key="prop.id"
      class="p-4 rounded-xl border transition-all"
      :class="[
        prop.senderRole === 'seller'
          ? 'bg-slate-900/80 border-cyan-500/30 mr-4'
          : 'bg-slate-800/80 border-slate-700 ml-4'
      ]"
    >
      <div class="flex items-center justify-between gap-2 mb-2">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-slate-100">{{ prop.senderName }}</span>
          <NTag size="small" :type="prop.senderRole === 'seller' ? 'info' : 'warning'">
            {{ prop.senderRole === 'seller' ? 'فروشنده' : 'خریدار' }}
          </NTag>
        </div>
        <span class="text-xs text-slate-400 font-mono">{{ formatDate(prop.createdAt) }}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 my-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
        <div>
          <span class="text-slate-500">مبلغ پیشنهادی: </span>
          <span class="font-bold text-emerald-400">{{ prop.amount.toLocaleString('fa-IR') }} تومان</span>
        </div>
        <div>
          <span class="text-slate-500">نرخ تنزیل: </span>
          <span class="text-amber-400 font-semibold">{{ prop.discountRate }}٪</span>
        </div>
        <div class="col-span-2">
          <span class="text-slate-500">روش تسویه: </span>
          <span>{{ settlementLabel(prop.settlementMethod) }}</span>
        </div>
      </div>

      <p v-if="prop.note" class="text-xs text-slate-300 italic mb-3">
        « {{ prop.note }} »
      </p>

      <!-- Action buttons for proposals -->
      <div v-if="prop.status === 'pending'" class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/60">
        <NButton size="tiny" type="success" @click="$emit('accept', prop.id)">
          پذیرش پیشنهاد
        </NButton>
        <NButton size="tiny" type="error" secondary @click="$emit('reject', prop.id)">
          رد پیشنهاد
        </NButton>
        <NButton size="tiny" type="warning" secondary @click="$emit('counter', prop)">
          پیشنهاد متقابل (پاسخ)
        </NButton>
      </div>

      <div v-else class="pt-2">
        <NTag size="small" :type="statusTagType(prop.status)">
          {{ statusLabel(prop.status) }}
        </NTag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTag, NButton } from 'naive-ui';
import type { ProposalItem } from '../stores/matchesStore';

defineProps<{
  proposals: ProposalItem[];
}>();

defineEmits<{
  (e: 'accept', proposalId: number): void;
  (e: 'reject', proposalId: number): void;
  (e: 'counter', proposal: ProposalItem): void;
}>();

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function settlementLabel(val: string) {
  const map: Record<string, string> = {
    escrow: 'پرداخت امن (Escrow)',
    cash: 'نقدی',
    bank_transfer: 'حواله بانکی',
    flexible: 'توافقی'
  };
  return map[val] || val;
}

function statusTagType(status: string) {
  switch (status) {
    case 'accepted': return 'success';
    case 'rejected': return 'error';
    case 'countered': return 'warning';
    default: return 'default';
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'accepted': return 'پذیرفته شده';
    case 'rejected': return 'رد شده';
    case 'countered': return 'پاسخ متقابل ارسال شد';
    default: return 'در انتظار پاسخ';
  }
}
</script>
