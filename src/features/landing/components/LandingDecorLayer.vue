<script setup lang="ts">
import { computed } from 'vue';
import { landingVectors } from './landingVectors';

interface Props {
  pattern?: 'dots' | 'grid' | 'stripes' | 'mesh' | 'mesh-center' | 'mesh-bottom-left' | 'none';
  overlay?: 'dots' | 'grid' | 'stripes' | 'none';
  intensity?: 'low' | 'medium' | 'high';
  position?: 'top-right' | 'bottom-left' | 'center' | 'full';
  overlayPosition?: 'top-right' | 'bottom-left' | 'center' | 'full';
  vector?: 'connectionNodes' | 'arcRing' | 'gridWave' | 'abstractShield' | 'growthCurve' | 'none';
  vectorPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  cornerStripe?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pattern: 'none',
  overlay: 'none',
  intensity: 'low',
  position: 'full',
  overlayPosition: 'full',
  vector: 'none',
  vectorPosition: 'top-left',
  cornerStripe: false,
});

const intensityClass = computed(() => {
  return `landing-decor-intensity-${props.intensity}`;
});

const patternClass = computed(() => {
  switch (props.pattern) {
    case 'dots':
      return 'landing-bg-dots';
    case 'grid':
      return 'landing-bg-grid';
    case 'stripes':
      return 'landing-bg-stripes';
    case 'mesh':
      return 'landing-bg-mesh-emerald';
    case 'mesh-center':
      return 'landing-bg-mesh-center';
    case 'mesh-bottom-left':
      return 'landing-bg-mesh-bottom-left';
    default:
      return '';
  }
});

const overlayClass = computed(() => {
  switch (props.overlay) {
    case 'dots':
      return 'landing-bg-dots';
    case 'grid':
      return 'landing-bg-grid';
    case 'stripes':
      return 'landing-bg-stripes';
    default:
      return '';
  }
});

const positionClass = computed(() => {
  switch (props.position) {
    case 'top-right':
      return 'w-1/2 h-1/2 top-0 right-0';
    case 'bottom-left':
      return 'w-1/2 h-1/2 bottom-0 left-0';
    case 'center':
      return 'w-3/4 h-3/4 top-1/8 left-1/8';
    case 'full':
    default:
      return 'inset-0 w-full h-full';
  }
});

const overlayPositionClass = computed(() => {
  switch (props.overlayPosition) {
    case 'top-right':
      return 'w-1/2 h-1/2 top-0 right-0';
    case 'bottom-left':
      return 'w-1/2 h-1/2 bottom-0 left-0';
    case 'center':
      return 'w-3/4 h-3/4 top-1/8 left-1/8';
    case 'full':
    default:
      return 'inset-0 w-full h-full';
  }
});

const vectorSvg = computed(() => {
  if (!props.vector || props.vector === 'none') return null;
  return landingVectors[props.vector] || null;
});

const vectorPositionClass = computed(() => {
  switch (props.vectorPosition) {
    case 'top-right':
      return 'top-4 right-4 sm:top-8 sm:right-8 w-40 h-32 sm:w-56 sm:h-44';
    case 'top-left':
      return 'top-4 left-4 sm:top-8 sm:left-8 w-40 h-32 sm:w-56 sm:h-44';
    case 'bottom-right':
      return 'bottom-4 right-4 sm:bottom-8 sm:right-8 w-40 h-32 sm:w-56 sm:h-44';
    case 'bottom-left':
      return 'bottom-4 left-4 sm:bottom-8 sm:left-8 w-40 h-32 sm:w-56 sm:h-44';
    case 'center':
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 sm:w-80 sm:h-56';
    default:
      return 'top-6 left-6 w-48 h-36';
  }
});
</script>

<template>
  <div
    class="landing-decor pointer-events-none absolute inset-0 overflow-hidden select-none"
    :class="intensityClass"
    aria-hidden="true"
  >
    <!-- Base Pattern Background -->
    <div
      v-if="pattern !== 'none'"
      :class="['absolute', positionClass, patternClass]"
    />

    <!-- Stacking Overlay Layer (e.g. mesh + dots) -->
    <div
      v-if="overlay !== 'none'"
      :class="['absolute', overlayPositionClass, overlayClass]"
    />

    <!-- Optional Corner Stripe Accent Block -->
    <div
      v-if="cornerStripe"
      class="absolute top-0 right-0 w-48 h-48 landing-corner-stripes"
    />

    <!-- Optional SVG Vector Decor -->
    <div
      v-if="vectorSvg"
      :class="['absolute', vectorPositionClass, 'transition-opacity duration-500']"
      v-html="vectorSvg"
    />
  </div>
</template>
