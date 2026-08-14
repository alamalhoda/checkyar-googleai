<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
    <!-- Match Info Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold text-slate-100">گفتگو و تنظیم شرایط معامله</h1>
          <NTag type="info" round size="small">کد معامله #{{ matchId }}</NTag>
        </div>
        <p v-if="matchStore.currentMatch" class="text-xs text-slate-400 flex items-center gap-3">
          <span>طرف معامله: <strong class="text-slate-100">{{ matchStore.currentMatch.counterpartyName }}</strong></span>
          <span>•</span>
          <span>بانک: <strong class="text-slate-100">{{ matchStore.currentMatch.listingBank }}</strong></span>
          <span>•</span>
          <span>مبلغ اسمی چک: <strong class="text-emerald-400">{{ matchStore.currentMatch.listingOriginalAmount.toLocaleString('fa-IR') }} تومان</strong></span>
        </p>
      </div>

      <!-- Power User Switcher -->
      <div class="flex items-center gap-3 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60">
        <span class="text-xs font-medium text-slate-300">حالت عادی (پاپ‌آپ)</span>
        <NSwitch
          :value="uiStore.isPowerUser"
          @update:value="(val) => uiStore.setPowerUser(val)"
          size="medium"
        />
        <span class="text-xs font-medium text-slate-300">حالت حرفه‌ای (فرم مستقیم)</span>
      </div>
    </div>

    <!-- Main Grid: Left Timeline + Right Form -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Trade Thread Timeline (7 Cols) -->
      <div class="lg:col-span-7 space-y-4">
        <NCard title="تاریخچه پیشنهادها و پیام‌ها" class="bg-slate-900/50 border-slate-800 h-full">
          <template #header-extra>
            <NButton v-if="!uiStore.isPowerUser" type="primary" size="small" @click="showModal = true">
              + ارسال پیشنهاد جدید
            </NButton>
          </template>

          <NSpin :show="matchStore.loading">
            <ProposalTimeline
              :proposals="matchStore.currentMatch?.proposals || []"
              @accept="(id) => matchStore.acceptProposal(id)"
              @reject="(id) => matchStore.rejectProposal(id)"
              @counter="handleCounterOffer"
            />
          </NSpin>
        </NCard>
      </div>

      <!-- Right Column: Direct Deal Form for Power Users (5 Cols) -->
      <div class="lg:col-span-5 space-y-4">
        <NCard class="bg-slate-900/50 border-slate-800 sticky top-20">
          <DealConditionsForm
            :state="matchStore.dealFormState"
            :loading="matchStore.loading"
            @submit="handleSendProposal"
          />
        </NCard>
      </div>
    </div>

    <!-- Proposal Modal for Standard Users -->
    <NModal
      v-model:show="showModal"
      preset="card"
      title="ارسال پیشنهاد سریع"
      class="max-w-md bg-slate-900 border-slate-800"
    >
      <DealConditionsForm
        :state="matchStore.dealFormState"
        :loading="matchStore.loading"
        @submit="async () => { await handleSendProposal(); showModal = false; }"
      />
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { NCard, NSwitch, NButton, NModal, NSpin, NTag } from 'naive-ui';
import { useMatchesStore, type ProposalItem } from '../stores/matchesStore';
import { useUiStore } from '../../../stores/useUiStore';
import ProposalTimeline from '../components/ProposalTimeline.vue';
import DealConditionsForm from '../components/DealConditionsForm.vue';

const route = useRoute();
const matchStore = useMatchesStore();
const uiStore = useUiStore();

const matchId = computed(() => Number(route.params.id) || 1);
const showModal = ref(false);

onMounted(() => {
  matchStore.fetchMatchDetails(matchId.value);
});

function handleCounterOffer(proposal: ProposalItem) {
  matchStore.fillCounterOffer(proposal);
  if (!uiStore.isPowerUser) {
    showModal.value = true;
  }
}

async function handleSendProposal() {
  if (!matchStore.dealFormState.amount) return;
  await matchStore.sendProposal({
    amount: matchStore.dealFormState.amount,
    discountRate: matchStore.dealFormState.discountRate,
    settlementMethod: matchStore.dealFormState.settlementMethod,
    note: matchStore.dealFormState.note
  });
}
</script>
