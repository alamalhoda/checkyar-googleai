<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const mobileMenuOpen = ref(false);

const navLinks = [
  { label: 'نحوه کار', href: '#how-it-works' },
  { label: 'آگهی‌ها', href: '#live-listings' },
  { label: 'پرسش‌های متداول', href: '#faq' },
  { label: 'تماس با ما', href: '#contact-us' }
];

function scrollToSection(href: string) {
  mobileMenuOpen.value = false;
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function navigateTo(path: string) {
  mobileMenuOpen.value = false;
  router.push(path);
}
</script>

<template>
  <header
    id="landing-header"
    data-testid="landing-header"
    class="sticky top-0 z-50 w-full border-b border-[var(--theme-border)] bg-[var(--theme-surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--theme-surface)]/80"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Brand Lockup -->
      <div class="flex items-center gap-3">
        <a
          href="#hero"
          class="flex items-center gap-2.5 rounded-lg text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          aria-label="چک‌یار - صفحه اصلی"
        >
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-lg">
            چ
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold tracking-tight text-[var(--theme-text-primary)]">چک‌یار</span>
            <span class="text-[10px] text-[var(--theme-text-muted)] -mt-1 hidden sm:inline">سکوی کشف و اتصال بازار چک</span>
          </div>
        </a>
      </div>

      <!-- Desktop Navigation Anchors -->
      <nav class="hidden md:flex items-center gap-6" aria-label="ناوبری صفحه اصلی">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          @click.prevent="scrollToSection(link.href)"
          class="text-sm font-medium text-[var(--theme-text-secondary)] hover:text-emerald-400 transition-colors rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Desktop Auth CTAs -->
      <div class="hidden sm:flex items-center gap-3">
        <template v-if="authStore.isAuthenticated">
          <button
            type="button"
            data-testid="landing-nav-marketplace"
            @click="navigateTo('/marketplace')"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            ورود به بازارچه
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            data-testid="landing-nav-login"
            @click="navigateTo('/login')"
            class="inline-flex items-center justify-center rounded-lg border border-[var(--theme-border-subtle)] bg-[var(--theme-surface-muted)] px-3.5 py-1.5 text-sm font-medium text-[var(--theme-text-primary)] hover:border-emerald-500/40 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            ورود
          </button>
          <button
            type="button"
            data-testid="landing-nav-register"
            @click="navigateTo('/register')"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            ثبت‌نام
          </button>
        </template>
      </div>

      <!-- Mobile Menu Toggle Button -->
      <div class="flex items-center gap-2 sm:hidden">
        <button
          type="button"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen"
          aria-label="منوی ناوبری"
          class="inline-flex items-center justify-center rounded-md p-2 text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface-muted)] hover:text-[var(--theme-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div
      v-if="mobileMenuOpen"
      class="border-b border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-4 sm:hidden flex flex-col gap-3"
    >
      <nav class="flex flex-col gap-2" aria-label="ناوبری موبایل">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          @click.prevent="scrollToSection(link.href)"
          class="rounded-md px-3 py-2 text-sm font-medium text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface-muted)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {{ link.label }}
        </a>
      </nav>
      <div class="pt-3 border-t border-[var(--theme-border)] flex flex-col gap-2">
        <template v-if="authStore.isAuthenticated">
          <button
            type="button"
            data-testid="landing-nav-marketplace-mobile"
            @click="navigateTo('/marketplace')"
            class="w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            ورود به بازارچه
          </button>
        </template>
        <template v-else>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              data-testid="landing-nav-login-mobile"
              @click="navigateTo('/login')"
              class="w-full rounded-lg border border-[var(--theme-border-subtle)] bg-[var(--theme-surface-muted)] px-3 py-2 text-center text-sm font-medium text-[var(--theme-text-primary)] hover:border-emerald-500/40 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              ورود
            </button>
            <button
              type="button"
              data-testid="landing-nav-register-mobile"
              @click="navigateTo('/register')"
              class="w-full rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              ثبت‌نام
            </button>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>
