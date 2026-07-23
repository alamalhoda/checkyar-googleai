<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NCard, NTag, NButton, NSpin, NAlert } from 'naive-ui';
import { matchesApi } from '../api';
import type { Match } from '../types/api';
import { MATCH_STATUS_LABELS } from '../types/api';

const route = useRoute();
const router = useRouter();

const matchId = Number(route.params.id);
const match = ref<Match | null>(null);
const loading = ref(false);
const updating = ref(false);

const loadMatch = async () => {
  loading.value = true;
  try {
    const list = await matchesApi.getMyMatches();
    match.value = list.find(m => m.id === matchId) || list[0] || null;
  } catch (err) {
    console.error('Error loading match detail', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadMatch);

const updateStatus = async (newStatus: Match['status']) => {
  if (!match.value) return;
  updating.value = true;
  try {
    const updated = await matchesApi.updateStatus(match.value.id, { status: newStatus });
    match.value = updated;
  } catch (err) {
    console.error('Failed to update match status', err);
  } finally {
    updating.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <NButton quaternary @click="router.back()">بازگشت به لیست تطابق‌ها</NButton>

    <NSpin :show="loading">
      <div v-if="match" class="space-y-6">
        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h1 class="text-base font-bold text-slate-100">جزئیات توافق معامله چک</h1>
              <p class="text-xs text-slate-400 mt-1">بانک {{ match.listing.bank_name }} - {{ match.listing.due_date }}</p>
            </div>

            <NTag type="info" round size="large">
              {{ MATCH_STATUS_LABELS[match.status] }}
            </NTag>
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span class="text-slate-400 block mb-1">دارنده چک:</span>
              <span class="font-bold text-slate-100">{{ match.check_holder.name }}</span>
            </div>

            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span class="text-slate-400 block mb-1">سرمایه‌گذار پیشنهادی:</span>
              <span class="font-bold text-slate-100">{{ match.investor.name }}</span>
            </div>
          </div>

          <div class="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div class="text-xs font-bold text-slate-300">پیام و پیشنهاد اولیه:</div>
            <p class="text-xs text-slate-400 leading-relaxed">{{ match.message }}</p>
          </div>

          <div class="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div class="text-xs font-bold text-slate-300">روش و شیوه‌نامه تسویه:</div>
            <div class="text-xs font-semibold text-emerald-400">
              {{ match.settlement_type === 'escrow' ? 'امانی سامانه چک‌یار (Escrow)' : 'توافق حضوری (Off Platform)' }}
            </div>
            <p v-if="match.terms" class="text-xs text-slate-400 mt-1">{{ match.terms }}</p>
          </div>

          <!-- Actions -->
          <div v-if="match.status === 'pending'" class="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <NButton type="error" quaternary :loading="updating" @click="updateStatus('declined')">
              رد پیشنهاد
            </NButton>
            <NButton type="primary" :loading="updating" @click="updateStatus('accepted')">
              پذیرش پیشنهاد و توافق نهایی
            </NButton>
          </div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
