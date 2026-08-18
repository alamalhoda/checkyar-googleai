<script setup lang="ts">
import { ref, reactive } from 'vue';
import { landingContent } from '../content/landingContent';
import { validateLeadForm, type LeadFormInput } from '../forms/leadCaptureValidator';
import { message } from '../../../utils/discreteApi';

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
  <section
    id="lead-capture-form"
    data-testid="landing-section-lead-capture-form"
    class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] scroll-mt-16"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-10 shadow-lg">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--theme-text-primary)]">
            {{ landingContent.leadCapture.title }}
          </h2>
          <p class="mt-2 text-sm text-[var(--theme-text-muted)]">
            {{ landingContent.leadCapture.subtitle }}
          </p>
        </div>

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
              class="w-full px-4 py-2.5 rounded-lg bg-[var(--theme-bg)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition"
              :class="errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs text-red-400 font-medium">
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
              class="w-full px-4 py-2.5 rounded-lg bg-[var(--theme-bg)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition"
              :class="errors.mobile ? 'border-red-500/80 focus:border-red-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
            />
            <p v-if="errors.mobile" class="mt-1.5 text-xs text-red-400 font-medium">
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
              class="w-full px-4 py-2.5 rounded-lg bg-[var(--theme-bg)] border text-[var(--theme-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition cursor-pointer"
              :class="errors.role ? 'border-red-500/80 focus:border-red-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
            >
              <option
                v-for="role in landingContent.leadCapture.roles"
                :key="role.value"
                :value="role.value"
                class="bg-[var(--theme-surface)] text-[var(--theme-text-primary)]"
              >
                {{ role.label }}
              </option>
            </select>
            <p v-if="errors.role" class="mt-1.5 text-xs text-red-400 font-medium">
              {{ errors.role }}
            </p>
          </div>

          <!-- Note Field -->
          <div>
            <label class="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
              {{ landingContent.leadCapture.noteLabel }}
            </label>
            <textarea
              v-model="form.note"
              rows="3"
              data-testid="landing-lead-note"
              :placeholder="landingContent.leadCapture.notePlaceholder"
              class="w-full px-4 py-2.5 rounded-lg bg-[var(--theme-bg)] border text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition resize-y"
              :class="errors.note ? 'border-red-500/80 focus:border-red-500' : 'border-[var(--theme-border)] focus:border-emerald-500'"
            ></textarea>
            <p v-if="errors.note" class="mt-1.5 text-xs text-red-400 font-medium">
              {{ errors.note }}
            </p>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              data-testid="landing-lead-submit"
              class="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-lg text-black bg-emerald-400 hover:bg-emerald-300 transition duration-150 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {{ landingContent.leadCapture.submitLabel }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
