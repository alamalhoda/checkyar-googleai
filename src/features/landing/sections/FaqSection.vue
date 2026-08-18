<script setup lang="ts">
import { ref } from 'vue';
import { landingContent } from '../content/landingContent';
import LandingSectionShell from '../components/LandingSectionShell.vue';

const content = landingContent.faq;
const visual = landingContent.visual;

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
  <LandingSectionShell
    id="faq"
    testId="landing-section-faq"
    :title="content.title"
    :subtitle="content.subtitle"
    :eyebrow="visual.sectionEyebrows.faq"
    variant="muted"
    :narrow="true"
    decorPattern="dots"
    decorIntensity="low"
  >
    <!-- FAQ Items Accordion with Glass Styling -->
    <div class="space-y-3.5">
      <div
        v-for="(item, idx) in content.items"
        :key="idx"
        :data-testid="`landing-faq-item-${idx + 1}`"
        class="rounded-2xl border transition-all duration-200 overflow-hidden"
        :class="[
          isOpen(idx)
            ? 'border-emerald-500/35 bg-[var(--theme-bg)]/90 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)]'
            : 'border-white/5 bg-[var(--theme-bg)]/70 hover:border-emerald-500/25'
        ]"
      >
        <button
          type="button"
          :aria-expanded="isOpen(idx)"
          @click="toggleItem(idx)"
          class="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-right font-medium text-[var(--theme-text-primary)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset cursor-pointer"
        >
          <span class="text-sm sm:text-base font-bold">{{ item.question }}</span>
          <span
            class="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg border transition-colors"
            :class="[
              isOpen(idx)
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[var(--theme-surface-muted)] border-[var(--theme-border-subtle)] text-[var(--theme-text-secondary)]'
            ]"
          >
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
          class="px-5 sm:px-6 pb-5 pt-3 text-xs sm:text-sm leading-relaxed text-[var(--theme-text-secondary)] border-t border-[var(--theme-border-subtle)]/40 bg-[var(--theme-surface)]/60 backdrop-blur-sm"
        >
          {{ item.answer }}
        </div>
      </div>
    </div>
  </LandingSectionShell>
</template>
