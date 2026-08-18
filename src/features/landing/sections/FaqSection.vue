<script setup lang="ts">
import { ref } from 'vue';
import { landingContent } from '../content/landingContent';

const content = landingContent.faq;
// All collapsed by default
const openItems = ref<number[]>([]);

function toggleItem(index: number) {
  const existingIdx = openItems.value.indexOf(index);
  if (existingIdx >= 0) {
    openItems.value.splice(existingIdx, 1);
  } else {
    openItems.value.push(index);
  }
}

function isOpen(index: number): boolean {
  return openItems.value.includes(index);
}
</script>

<template>
  <section
    id="faq"
    data-testid="landing-section-faq"
    class="w-full py-16 sm:py-20 border-b border-[var(--theme-border)] bg-[var(--theme-surface)] scroll-mt-16"
  >
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center mb-12">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--theme-text-primary)]">
          {{ content.title }}
        </h2>
        <p class="mt-3 text-sm sm:text-base text-[var(--theme-text-secondary)]">
          {{ content.subtitle }}
        </p>
      </div>

      <!-- FAQ Items Accordion -->
      <div class="space-y-3">
        <div
          v-for="(item, idx) in content.items"
          :key="idx"
          :data-testid="`landing-faq-item-${idx + 1}`"
          class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] transition-colors overflow-hidden"
        >
          <button
            type="button"
            :aria-expanded="isOpen(idx)"
            @click="toggleItem(idx)"
            class="w-full flex items-center justify-between gap-4 p-5 text-right font-medium text-[var(--theme-text-primary)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
          >
            <span class="text-sm sm:text-base font-bold">{{ item.question }}</span>
            <span class="shrink-0 flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--theme-surface-muted)] text-[var(--theme-text-secondary)]">
              <svg
                class="h-4 w-4 transform transition-transform duration-200"
                :class="{ 'rotate-180 text-emerald-400': isOpen(idx) }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>

          <div
            v-if="isOpen(idx)"
            class="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-[var(--theme-text-secondary)] border-t border-[var(--theme-border-subtle)]/50"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
