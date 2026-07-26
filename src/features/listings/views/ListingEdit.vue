<template>
  <div class="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
    <div class="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      <div>
        <h1 class="text-xl font-bold text-white">ویرایش آگهی چک صیادی</h1>
        <p class="text-xs text-slate-400 mt-1">شناسه آگهی: #{{ listingId }}</p>
      </div>

      <div class="flex items-center gap-3 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60">
        <span class="text-xs font-medium text-slate-300">یکپارچه</span>
        <NSwitch
          :value="!form.wizardMode.value"
          @update:value="(val) => form.toggleWizardMode(!val)"
          size="medium"
        />
        <span class="text-xs font-medium text-slate-300">ویزارد</span>
      </div>
    </div>

    <!-- Re-use the ListingCreateWizard view or form components -->
    <ListingCreateWizard />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { NSwitch } from 'naive-ui';
import ListingCreateWizard from './ListingCreateWizard.vue';
import { useListingForm } from '../composables/useListingForm';

const route = useRoute();
const listingId = computed(() => route.params.id);
const form = useListingForm();
</script>
