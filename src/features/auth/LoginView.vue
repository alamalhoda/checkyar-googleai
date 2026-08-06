<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NForm, NFormItem, NInput, NButton, NAlert, NDivider, NSwitch, NTag, useMessage } from 'naive-ui';
import { useAuthStore } from '../../stores/auth';
import { useBackendSimulatorStore } from '../../stores/useBackendSimulatorStore';
import { getMockMode, setMockMode, isMockEnvEnabled } from '../../api';

const router = useRouter();
const authStore = useAuthStore();
const simulatorStore = useBackendSimulatorStore();
const toast = useMessage();

const isMockEnv = computed(() => isMockEnvEnabled());
const isMockActive = ref(getMockMode());
const identifier = ref(isMockEnv.value ? 'holder1' : '');
const password = ref(isMockEnv.value ? 'password123' : '');
const loading = ref(false);
const activePersonaId = ref<number | null>(null);
const errorMsg = ref('');
const errorDetails = ref<Record<string, string[]> | null>(null);

// Mock Users list with descriptive personas
const personas = computed(() => [
  {
    id: 1,
    username: 'holder1',
    name: 'رضا صبوری',
    role: 'check_holder',
    roleLabel: 'دارنده چک (فروشنده)',
    roleBadgeType: 'success' as const,
    colorClass: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/30 hover:border-emerald-400',
    icon: '🏦',
    desc: 'ثبت و واگذاری چک صیادی، دریافت پیشنهاد تنزیل و نقدکنندگی سریع',
    targetRoute: '/marketplace'
  },
  {
    id: 2,
    username: 'investor1',
    name: 'سرمایه‌گذاری نوین',
    role: 'investor',
    roleLabel: 'سرمایه‌گذار (خریدار)',
    roleBadgeType: 'info' as const,
    colorClass: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/30 hover:border-indigo-400',
    icon: '💼',
    desc: 'مرور بازار چک‌ها، ابراز تمایل خرید و مدیریت سبد سرمایه‌گذاری',
    targetRoute: '/marketplace'
  },
  {
    id: 3,
    username: 'moderator1',
    name: 'علی حسینی',
    role: 'moderator',
    roleLabel: 'ناظر و کارشناس اعتبار',
    roleBadgeType: 'warning' as const,
    colorClass: 'from-amber-500/10 to-amber-600/5 border-amber-500/30 hover:border-amber-400',
    icon: '🛡️',
    desc: 'بررسی صف آگهی‌های جدید، تایید/رد اسناد و احراز هویت کاربران',
    targetRoute: '/moderation'
  },
  {
    id: 4,
    username: 'admin1',
    name: 'مدیر سامانه چک‌یار',
    role: 'admin',
    roleLabel: 'مدیر کل سیستم',
    roleBadgeType: 'error' as const,
    colorClass: 'from-rose-500/10 to-rose-600/5 border-rose-500/30 hover:border-rose-400',
    icon: '⚡',
    desc: 'مدیریت کل سیستم، مشاهده آمارهای حاکمیتی، لاگ امنیتی و فیچرفلاگ‌ها',
    targetRoute: '/admin/stats'
  }
]);

const toggleMockMode = (val: boolean) => {
  isMockActive.value = val;
  setMockMode(val);
  if (val) {
    toast.info('حالت شبیه‌سازی (دمو) فعال گردید.');
  } else {
    toast.warning('حالت اتصال مستقیم به سرور اصلی (Live API) فعال شد.');
  }
};

const handleLogin = async (customUsername?: string, targetRouteOverride?: string) => {
  errorMsg.value = '';
  errorDetails.value = null;
  loading.value = true;

  const targetIdentifier = customUsername || identifier.value;

  try {
    await authStore.login({
      identifier: targetIdentifier,
      password: password.value || 'password123'
    });

    toast.success(`ورود با موفقیت انجام شد. خوش آمدید ${authStore.user?.name || ''}`);

    // Determine target route based on user role if not explicitly provided
    let redirectPath = targetRouteOverride || '/marketplace';
    if (!targetRouteOverride) {
      if (authStore.userRole === 'moderator') redirectPath = '/moderation';
      else if (authStore.userRole === 'admin') redirectPath = '/admin/stats';
    }

    router.push(redirectPath);
  } catch (err: any) {
    const apiError = err?.response?.data?.error || err?.error;
    if (apiError) {
      errorMsg.value = apiError.message || 'خطا در ورود به حساب کاربری.';
      if (apiError.details && typeof apiError.details === 'object' && !Array.isArray(apiError.details)) {
        errorDetails.value = apiError.details;
      }
    } else {
      errorMsg.value = err?.message || 'خطا در ارتباط با سرور.';
    }
  } finally {
    loading.value = false;
    activePersonaId.value = null;
  }
};

const loginAsPersona = async (persona: typeof personas.value[0]) => {
  activePersonaId.value = persona.id;
  identifier.value = persona.username;
  password.value = 'password123';
  await handleLogin(persona.username, persona.targetRoute);
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 dir-rtl font-sans text-slate-100">
    <!-- Top Simulation Mode Switcher Header -->
    <div v-if="isMockEnv" class="w-full max-w-4xl mb-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 rounded-full animate-ping" :class="isMockActive ? 'bg-emerald-400' : 'bg-amber-400'"></div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-white">حالت تست و شبیه‌سازی سیستم (Mock Simulator)</span>
            <NTag size="small" :type="isMockActive ? 'success' : 'warning'" round>
              {{ isMockActive ? 'فعال (دمو)' : 'غیرفعال (سرور واقعی)' }}
            </NTag>
          </div>
          <p class="text-[11px] text-slate-400">
            {{ isMockActive ? 'در حالت شبیه‌سازی می‌توانید با کلیک روی هر نقش کاربری فوراً تجربه کاربری را آزمایش کنید.' : 'در حالت غیرفعال، درخواست‌ها به سرور واقعی ارسال می‌شوند.' }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400">حالت شبیه‌سازی:</span>
        <NSwitch :value="isMockActive" @update:value="toggleMockMode" size="small" data-testid="mock-mode-switch" />
      </div>
    </div>

    <!-- Main Container Layout -->
    <div class="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- Left Column: Simulation Personas Quick Login Panel (Shows when Mock Active & Mock Env) -->
      <div v-if="isMockEnv && isMockActive" class="lg:col-span-7 space-y-4">
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">👥</span>
              <div>
                <h2 class="text-sm font-bold text-white">انتخاب سریع نقش کاربری (شبیه‌ساز)</h2>
                <p class="text-[11px] text-slate-400">روی یکی از کاراکترهای زیر کلیک کنید تا بلافاصله وارد سیستم شوید</p>
              </div>
            </div>
            <NTag size="small" type="info" class="font-mono text-[10px]">۴ نقش آماده</NTag>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="p in personas"
              :key="p.id"
              class="relative group cursor-pointer bg-gradient-to-br p-4 rounded-xl border transition-all duration-200 space-y-2 hover:scale-[1.02]"
              :class="[
                p.colorClass,
                activePersonaId === p.id ? 'ring-2 ring-emerald-400 border-emerald-400 bg-slate-800' : 'bg-slate-950/60'
              ]"
              @click="loginAsPersona(p)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="text-2xl">{{ p.icon }}</span>
                  <div>
                    <div class="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                      {{ p.name }}
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono">@{{ p.username }}</div>
                  </div>
                </div>
                <NTag size="small" :type="p.roleBadgeType" round class="text-[10px]">
                  {{ p.roleLabel }}
                </NTag>
              </div>

              <p class="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-slate-800/60">
                {{ p.desc }}
              </p>

              <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                <span>رمز: password123</span>
                <span class="text-emerald-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                  ورود آنی ←
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Standard Login Form -->
      <div :class="(isMockEnv && isMockActive) ? 'lg:col-span-5' : (isMockEnv ? 'lg:col-span-8 lg:col-start-3' : 'lg:col-span-6 lg:col-start-4')">
        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
          <!-- Header Branding -->
          <div class="text-center space-y-2 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xl flex items-center justify-center mx-auto shadow-inner">
              چک
            </div>
            <h1 class="text-lg font-black text-slate-100">ورود به سامانه چک‌یار</h1>
            <p class="text-xs text-slate-400">بازار هوشمند معامله و مدیریت چِک صیادی و مطالبات مالی</p>
          </div>

          <!-- Error Display -->
          <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
            <div>{{ errorMsg }}</div>
            <ul v-if="errorDetails" class="mt-2 list-disc pr-4 space-y-1">
              <li v-for="(msgs, field) in errorDetails" :key="field">
                <span class="font-bold">{{ field }}:</span> {{ msgs.join(', ') }}
              </li>
            </ul>
          </NAlert>

          <!-- Standard Login Form -->
          <NForm @submit.prevent="handleLogin()" class="space-y-4">
            <NFormItem label="نام کاربری یا ایمیل">
              <NInput
                v-model:value="identifier"
                :input-props="{ 'data-testid': 'login-identifier' }"
                placeholder="مثلاً: holder1 یا reza@chequeyar.ir"
                size="large"
              />
            </NFormItem>

            <NFormItem label="رمز عبور">
              <NInput
                v-model:value="password"
                :input-props="{ 'data-testid': 'login-password' }"
                type="password"
                show-password-on="click"
                placeholder="••••••••"
                size="large"
              />
            </NFormItem>

            <NButton
              type="primary"
              block
              size="large"
              attr-type="submit"
              :loading="loading"
              data-testid="login-submit"
              class="font-bold shadow-lg shadow-emerald-950/50"
            >
              ورود به حساب کاربری
            </NButton>
          </NForm>

          <!-- Quick Fill Switcher if mock env enabled and mock mode inactive -->
          <template v-if="isMockEnv && !isMockActive">
            <NDivider class="my-5">
              <span class="text-[11px] text-slate-500">حساب‌های آزمایشی سرور</span>
            </NDivider>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <NButton size="small" secondary @click="identifier = 'holder1'; password = 'password123'">
                دارنده چک (holder1)
              </NButton>
              <NButton size="small" secondary @click="identifier = 'investor1'; password = 'password123'">
                سرمایه‌گذار (investor1)
              </NButton>
              <NButton size="small" secondary @click="identifier = 'moderator1'; password = 'password123'">
                ناظر (moderator1)
              </NButton>
              <NButton size="small" secondary @click="identifier = 'admin1'; password = 'password123'">
                مدیر کل (admin1)
              </NButton>
            </div>
          </template>

          <!-- Footer Link to Register -->
          <div class="text-center mt-6 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            حساب کاربری ندارید؟
            <router-link to="/register" class="text-emerald-400 font-bold hover:underline mr-1">
              ثبت نام کنید
            </router-link>
          </div>
        </NCard>
      </div>

    </div>
  </div>
</template>
