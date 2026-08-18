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
    class="sticky top-0 z-50 w-full border-b border-white/10 landing-glass-header shadow-[0_4px_24px_-4px_rgba(0,0,0,0.40)]"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Brand Lockup -->
      <div class="flex items-center gap-3">
        <a
          href="#hero"
          class="flex items-center gap-3 rounded-lg text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          aria-label="چک‌یار - صفحه اصلی"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-base shadow-sm">
            چک
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-extrabold tracking-tight text-[var(--theme-text-primary)]">چک‌یار</span>
            <span class="text-[11px] text-[var(--theme-text-muted)] -mt-0.5 hidden sm:inline font-medium">سکوی کشف و اتصال بازار چک</span>
          </div>
        </a>
      </div>

      <!-- Desktop Navigation Anchors -->
      <nav class="hidden md:flex items-center gap-7" aria-label="ناوبری صفحه اصلی">
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
            class="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-sm hover:bg-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer"
          >
            ورود به بازارچه
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            data-testid="landing-nav-login"
            @click="navigateTo('/login')"
            class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[var(--theme-surface-muted)]/80 px-3.5 py-1.5 text-sm font-medium text-[var(--theme-text-primary)] hover:border-emerald-500/40 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
          >
            ورود
          </button>
          <button
            type="button"
            data-testid="landing-nav-register"
            @click="navigateTo('/register')"
            class="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-1.5 text-sm font-bold text-slate-950 shadow-sm hover:bg-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer"
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
          class="inline-flex items-center justify-center rounded-lg p-2 text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface-muted)] hover:text-[var(--theme-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
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

    <!-- Mobile Dropdown Menu with Glass Style -->
    <div
      v-if="mobileMenuOpen"
      class="border-b border-white/10 bg-[var(--theme-surface)]/95 backdrop-blur-md px-4 py-4 sm:hidden flex flex-col gap-3 shadow-2xl"
    >
      <nav class="flex flex-col gap-2" aria-label="ناوبری موبایل">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          @click.prevent="scrollToSection(link.href)"
          class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface-muted)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {{ link.label }}
        </a>
      </nav>
      <div class="pt-3 border-t border-white/10 flex flex-col gap-2">
        <template v-if="authStore.isAuthenticated">
          <button
            type="button"
            data-testid="landing-nav-marketplace-mobile"
            @click="navigateTo('/marketplace')"
            class="w-full rounded-xl bg-emerald-400 px-4 py-2.5 text-center text-sm font-bold text-slate-950 shadow-sm hover:bg-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
              class="w-full rounded-xl border border-white/10 bg-[var(--theme-surface-muted)]/80 px-3 py-2.5 text-center text-sm font-medium text-[var(--theme-text-primary)] hover:border-emerald-500/40 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              ورود
            </button>
            <button
              type="button"
              data-testid="landing-nav-register-mobile"
              @click="navigateTo('/register')"
              class="w-full rounded-xl bg-emerald-400 px-3 py-2.5 text-center text-sm font-bold text-slate-950 shadow-sm hover:bg-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              ثبت‌نام
            </button>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>
