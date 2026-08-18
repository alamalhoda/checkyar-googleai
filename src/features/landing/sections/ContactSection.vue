<script setup lang="ts">
import { ref, reactive } from 'vue';
import { landingContent } from '../content/landingContent';
import { validateContactForm, type ContactFormInput } from '../forms/contactValidator';
import { message } from '../../../utils/discreteApi';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingSurfaceCard from '../components/LandingSurfaceCard.vue';

const form = reactive<ContactFormInput>({
  name: '',
  email: '',
  message: '',
});

const errors = ref<Record<string, string>>({});
const submitted = ref(false);

function handleSubmit() {
  submitted.value = true;
  const result = validateContactForm(form);
  errors.value = result.errors;

  if (!result.ok) {
    return;
  }

  // Pure UI Success - Zero Network Calls
  message.success(landingContent.contactUs.successMessage);

  // Reset form
  form.name = '';
  form.email = '';
  form.message = '';
  errors.value = {};
  submitted.value = false;
}
</script>

<template>
  <LandingSectionShell
    id="contact-us"
    testId="landing-section-contact-us"
    :title="landingContent.contactUs.title"
    :subtitle="landingContent.contactUs.subtitle"
    :eyebrow="landingContent.visual.sectionEyebrows.contactUs"
    variant="muted"
    :narrow="true"
    decorPattern="grid"
    decorIntensity="low"
  >
    <LandingSurfaceCard bg="base" :glass="true" :accentTop="true" class="p-6 sm:p-10 shadow-xl shadow-black/30">
      <!-- Email Direct Pill -->
      <div class="flex justify-center mb-8">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-surface)]/80 border border-white/10 text-xs text-[var(--theme-text-secondary)] shadow-sm" dir="ltr">
          <svg class="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span class="font-mono">{{ landingContent.contactUs.emailInfo }}</span>
        </div>
      </div>

      <!-- Form -->
      <form
        data-testid="landing-contact-form"
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <!-- Name Field -->
        <div>
          <label class="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
            {{ landingContent.contactUs.nameLabel }} <span class="text-emerald-400">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            data-testid="landing-contact-name"
            :placeholder="landingContent.contactUs.namePlaceholder"
            class="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--theme-input)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition"
            :class="errors.name ? 'border-rose-500/80 focus:border-rose-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
          />
          <p v-if="errors.name" class="mt-1.5 text-xs text-rose-400 font-medium">
            {{ errors.name }}
          </p>
        </div>

        <!-- Email Field -->
        <div>
          <label class="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
            {{ landingContent.contactUs.emailLabel }} <span class="text-emerald-400">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            dir="ltr"
            data-testid="landing-contact-email"
            :placeholder="landingContent.contactUs.emailPlaceholder"
            class="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--theme-input)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition"
            :class="errors.email ? 'border-rose-500/80 focus:border-rose-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
          />
          <p v-if="errors.email" class="mt-1.5 text-xs text-rose-400 font-medium">
            {{ errors.email }}
          </p>
        </div>

        <!-- Message Field -->
        <div>
          <label class="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
            {{ landingContent.contactUs.messageLabel }} <span class="text-emerald-400">*</span>
          </label>
          <textarea
            v-model="form.message"
            rows="4"
            data-testid="landing-contact-message"
            :placeholder="landingContent.contactUs.messagePlaceholder"
            class="w-full px-4 py-3 rounded-xl bg-[var(--theme-input)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition resize-none"
            :class="errors.message ? 'border-rose-500/80 focus:border-rose-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
          ></textarea>
          <p v-if="errors.message" class="mt-1.5 text-xs text-rose-400 font-medium">
            {{ errors.message }}
          </p>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            data-testid="landing-contact-submit"
            class="w-full min-h-[46px] flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm sm:text-base shadow-[0_10px_24px_-8px_rgba(16,185,129,0.45)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
          >
            {{ landingContent.contactUs.submitLabel }}
          </button>
        </div>
      </form>
    </LandingSurfaceCard>
  </LandingSectionShell>
</template>
