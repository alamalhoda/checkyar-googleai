<script setup lang="ts">
import { ref, reactive } from 'vue';
import { landingContent } from '../content/landingContent';
import { validateLeadForm, type LeadFormInput } from '../forms/leadCaptureValidator';
import { message } from '../../../utils/discreteApi';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingSurfaceCard from '../components/LandingSurfaceCard.vue';

const form = reactive<LeadFormInput>({
  name: '',
  mobile: '',
  role: 'دارنده چک',
  note: '',
});

const errors = ref<Record<string, string>>({});
const submitted = ref(false);

function handleSubmit() {
  submitted.value = true;
  const result = validateLeadForm(form);
  errors.value = result.errors;

  if (!result.ok) {
    return;
  }

  // Pure UI Success - Zero Network Calls
  message.success(landingContent.leadCapture.successMessage);

  // Reset form
  form.name = '';
  form.mobile = '';
  form.role = 'دارنده چک';
  form.note = '';
  errors.value = {};
  submitted.value = false;
}
</script>

<template>
  <LandingSectionShell
    id="lead-capture-form"
    testId="landing-section-lead-capture-form"
    :title="landingContent.leadCapture.title"
    :subtitle="landingContent.leadCapture.subtitle"
    :eyebrow="landingContent.visual.sectionEyebrows.leadCapture"
    variant="default"
    :narrow="true"
    decorPattern="grid"
    decorIntensity="low"
  >
    <LandingSurfaceCard :glass="true" :accentTop="true" class="p-6 sm:p-10 shadow-xl shadow-black/30">
      <!-- Form -->
      <form
        data-testid="landing-lead-form"
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <!-- Name Field -->
        <div>
          <label class="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
            {{ landingContent.leadCapture.nameLabel }} <span class="text-emerald-400">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            data-testid="landing-lead-name"
            :placeholder="landingContent.leadCapture.namePlaceholder"
            class="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--theme-input)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition"
            :class="errors.name ? 'border-rose-500/80 focus:border-rose-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
          />
          <p v-if="errors.name" class="mt-1.5 text-xs text-rose-400 font-medium">
            {{ errors.name }}
          </p>
        </div>

        <!-- Mobile Field -->
        <div>
          <label class="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
            {{ landingContent.leadCapture.mobileLabel }} <span class="text-emerald-400">*</span>
          </label>
          <input
            v-model="form.mobile"
            type="tel"
            dir="ltr"
            data-testid="landing-lead-mobile"
            :placeholder="landingContent.leadCapture.mobilePlaceholder"
            class="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--theme-input)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition"
            :class="errors.mobile ? 'border-rose-500/80 focus:border-rose-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
          />
          <p v-if="errors.mobile" class="mt-1.5 text-xs text-rose-400 font-medium">
            {{ errors.mobile }}
          </p>
        </div>

        <!-- Role Selection -->
        <div>
          <label class="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
            {{ landingContent.leadCapture.roleLabel }} <span class="text-emerald-400">*</span>
          </label>
          <select
            v-model="form.role"
            data-testid="landing-lead-role"
            class="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--theme-input)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition"
          >
            <option
              v-for="role in landingContent.leadCapture.roles"
              :key="role"
              :value="role"
            >
              {{ role }}
            </option>
          </select>
        </div>

        <!-- Note (Optional) -->
        <div>
          <label class="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
            {{ landingContent.leadCapture.noteLabel }}
          </label>
          <textarea
            v-model="form.note"
            rows="3"
            data-testid="landing-lead-note"
            :placeholder="landingContent.leadCapture.notePlaceholder"
            class="w-full px-4 py-3 rounded-xl bg-[var(--theme-input)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition resize-none"
            :class="errors.note ? 'border-rose-500/80 focus:border-rose-500' : ''"
          ></textarea>
          <p v-if="errors.note" class="mt-1.5 text-xs text-rose-400 font-medium">
            {{ errors.note }}
          </p>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            data-testid="landing-lead-submit"
            class="w-full min-h-[46px] flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm sm:text-base shadow-[0_10px_24px_-8px_rgba(16,185,129,0.45)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
          >
            {{ landingContent.leadCapture.submitLabel }}
          </button>
        </div>
      </form>
    </LandingSurfaceCard>
  </LandingSectionShell>
</template>
