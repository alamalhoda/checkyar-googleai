<script setup lang="ts">
import { message } from '../../utils/discreteApi';
import { getCurrentJalaliYear } from '../../utils/persianUtils';
import { landingContent } from './content/landingContent';

const currentYear = getCurrentJalaliYear();

function handlePlaceholderClick() {
  message.info('به‌زودی');
}
</script>

<template>
  <footer
    id="landing-footer"
    data-testid="landing-footer"
    class="w-full border-t border-[var(--theme-border)] bg-[var(--theme-surface)] py-12 text-[var(--theme-text-secondary)]"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Brand & Description -->
        <div class="space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-base">
              چ
            </div>
            <span class="text-lg font-bold text-[var(--theme-text-primary)]">چک‌یار</span>
          </div>
          <p class="text-xs leading-relaxed text-[var(--theme-text-muted)]">
            {{ landingContent.hero.oneLiner }}. {{ landingContent.responsibilityBoundary.closingSentence }}
          </p>
        </div>

        <!-- Quick Links -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-primary)]">دسترسی سریع</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                href="#how-it-works"
                class="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                نحوه کار سامانه
              </a>
            </li>
            <li>
              <a
                href="#live-listings"
                class="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                تابلوی آگهی‌ها
              </a>
            </li>
            <li>
              <a
                href="#faq"
                class="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                پرسش‌های متداول
              </a>
            </li>
            <li>
              <a
                href="#responsibility-boundary"
                class="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                مرز مسئولیت‌ها
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal & Company Placeholders -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-primary)]">قوانین و شرکت</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <button
                type="button"
                data-testid="landing-footer-link-terms"
                @click="handlePlaceholderClick"
                class="text-left text-[var(--theme-text-secondary)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                قوانین و مقررات
              </button>
            </li>
            <li>
              <button
                type="button"
                data-testid="landing-footer-link-privacy"
                @click="handlePlaceholderClick"
                class="text-left text-[var(--theme-text-secondary)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                حریم خصوصی
              </button>
            </li>
            <li>
              <button
                type="button"
                data-testid="landing-footer-link-about"
                @click="handlePlaceholderClick"
                class="text-left text-[var(--theme-text-secondary)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                درباره ما
              </button>
            </li>
            <li>
              <button
                type="button"
                data-testid="landing-footer-link-contact"
                @click="handlePlaceholderClick"
                class="text-left text-[var(--theme-text-secondary)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                تماس با ما
              </button>
            </li>
          </ul>
        </div>

        <!-- Social Channels & Community -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-primary)]">شبکه‌های اطلاع‌رسانی</h4>
          <p class="text-xs text-[var(--theme-text-muted)]">
            جهت دریافت آخرین اخبار و تغییرات قوانین معاملاتی با ما همراه باشید.
          </p>
          <div class="flex items-center gap-3 pt-1">
            <button
              type="button"
              data-testid="landing-footer-link-telegram"
              @click="handlePlaceholderClick"
              aria-label="کانال تلگرام چک‌یار"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--theme-border-subtle)] bg-[var(--theme-surface-muted)] text-[var(--theme-text-secondary)] hover:border-emerald-500/40 hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .36z"/>
              </svg>
            </button>
            <button
              type="button"
              data-testid="landing-footer-link-linkedin"
              @click="handlePlaceholderClick"
              aria-label="صفحه لینکدین چک‌یار"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--theme-border-subtle)] bg-[var(--theme-surface-muted)] text-[var(--theme-text-secondary)] hover:border-emerald-500/40 hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </button>
            <button
              type="button"
              data-testid="landing-footer-link-bale"
              @click="handlePlaceholderClick"
              aria-label="پیام‌رسان بله چک‌یار"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--theme-border-subtle)] bg-[var(--theme-surface-muted)] text-[var(--theme-text-secondary)] hover:border-emerald-500/40 hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span class="text-xs font-bold text-emerald-400">بله</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Copyright & Disclaimer Notice -->
      <div class="mt-10 border-t border-[var(--theme-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-muted)]">
        <p>© {{ currentYear }} تمامی حقوق مادی و معنوی برای چک‌یار محفوظ است.</p>
        <p>تسویه و انتقال چک بیرون از پلتفرم انجام می‌شود.</p>
      </div>
    </div>
  </footer>
</template>
