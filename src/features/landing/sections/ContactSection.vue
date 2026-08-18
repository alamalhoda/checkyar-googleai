<script setup lang="ts">
import { ref, reactive } from 'vue';
import { landingContent } from '../content/landingContent';
import { validateContactForm, type ContactFormInput } from '../forms/contactValidator';
import { message } from '../../../utils/discreteApi';

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
  <section
    id="contact-us"
    data-testid="landing-section-contact-us"
    class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-surface)] scroll-mt-16"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-6 sm:p-10 shadow-lg">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--theme-text-primary)]">
            {{ landingContent.contactUs.title }}
          </h2>
          <p class="mt-2 text-sm text-[var(--theme-text-muted)]">
            {{ landingContent.contactUs.subtitle }}
          </p>
          <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-surface)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-secondary)]" dir="ltr">
            <span>{{ landingContent.contactUs.emailInfo }}</span>
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
              class="w-full px-4 py-2.5 rounded-lg bg-[var(--theme-surface)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition"
              :class="errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs text-red-400 font-medium">
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
              class="w-full px-4 py-2.5 rounded-lg bg-[var(--theme-surface)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition"
              :class="errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
            />
            <p v-if="errors.email" class="mt-1.5 text-xs text-red-400 font-medium">
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
              class="w-full px-4 py-2.5 rounded-lg bg-[var(--theme-surface)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition resize-y"
              :class="errors.message ? 'border-red-500/80 focus:border-red-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
            ></textarea>
            <p v-if="errors.message" class="mt-1.5 text-xs text-red-400 font-medium">
              {{ errors.message }}
            </p>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              data-testid="landing-contact-submit"
              class="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-lg text-black bg-emerald-400 hover:bg-emerald-300 transition duration-150 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {{ landingContent.contactUs.submitLabel }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
