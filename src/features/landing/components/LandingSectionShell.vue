<script setup lang="ts">
import LandingDecorLayer from './LandingDecorLayer.vue';

withDefaults(
  defineProps<{
    id: string;
    testId: string;
    title: string;
    subtitle?: string;
    eyebrow?: string;
    variant?: 'default' | 'muted' | 'elevated';
    narrow?: boolean;
    align?: 'center' | 'right';
    decorPattern?: 'dots' | 'grid' | 'stripes' | 'mesh' | 'mesh-center' | 'mesh-bottom-left' | 'none';
    decorOverlay?: 'dots' | 'grid' | 'stripes' | 'none';
    decorIntensity?: 'low' | 'medium' | 'high';
    decorPosition?: 'top-right' | 'bottom-left' | 'center' | 'full';
    decorOverlayPosition?: 'top-right' | 'bottom-left' | 'center' | 'full';
    decorVector?: 'connectionNodes' | 'arcRing' | 'gridWave' | 'abstractShield' | 'growthCurve' | 'none';
    decorVectorPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
    decorCornerStripe?: boolean;
  }>(),
  {
    variant: 'default',
    narrow: false,
    align: 'center',
    decorPattern: 'none',
    decorOverlay: 'none',
    decorIntensity: 'low',
    decorPosition: 'full',
    decorOverlayPosition: 'full',
    decorVector: 'none',
    decorVectorPosition: 'top-left',
    decorCornerStripe: false,
  }
);
</script>

<template>
  <section
    :id="id"
    :data-testid="testId"
    class="relative w-full py-20 sm:py-24 scroll-mt-16 overflow-hidden"
    :class="[
      variant === 'muted' ? 'bg-[var(--theme-surface)]' : 'bg-[var(--theme-bg)]',
    ]"
  >
    <!-- Background Decor Layer -->
    <LandingDecorLayer
      v-if="decorPattern !== 'none' || decorOverlay !== 'none' || decorVector !== 'none' || decorCornerStripe"
      :pattern="decorPattern"
      :overlay="decorOverlay"
      :intensity="decorIntensity"
      :position="decorPosition"
      :overlay-position="decorOverlayPosition"
      :vector="decorVector"
      :vector-position="decorVectorPosition"
      :corner-stripe="decorCornerStripe"
    />

    <!-- Subtle Gradient Separators for Elevated Variant -->
    <template v-if="variant === 'elevated'">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
    </template>

    <div
      class="relative z-10 mx-auto px-4 sm:px-6 lg:px-8"
      :class="narrow ? 'max-w-4xl' : 'max-w-7xl'"
    >
      <!-- Section Header -->
      <div
        class="mb-12 sm:mb-16"
        :class="align === 'center' ? 'mx-auto max-w-3xl text-center' : 'text-right'"
      >
        <!-- Eyebrow Pill -->
        <div v-if="eyebrow" class="inline-flex items-center justify-center mb-3.5">
          <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            {{ eyebrow }}
          </span>
        </div>

        <!-- Section Title -->
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--theme-text-primary)]">
          {{ title }}
        </h2>

        <!-- Section Subtitle -->
        <p
          v-if="subtitle"
          class="mt-3.5 text-sm sm:text-base leading-relaxed text-[var(--theme-text-secondary)]"
          :class="align === 'center' ? 'mx-auto max-w-2xl' : ''"
        >
          {{ subtitle }}
        </p>
      </div>

      <!-- Main Section Content -->
      <slot />
    </div>
  </section>
</template>
