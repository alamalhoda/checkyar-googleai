<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NForm, NFormItem, NInput, NButton, NAlert, NTag, NDivider, useMessage } from 'naive-ui';
import { useAuthStore } from '../../stores/auth';
import { getMockMode } from '../../api';

const router = useRouter();
const authStore = useAuthStore();
const toast = useMessage();

const isMockActive = ref(getMockMode());
const username = ref('');
const email = ref('');
const name = ref('');
const phone = ref('');
const password = ref('');
const passwordConfirm = ref('');
const role = ref<'check_holder' | 'investor'>('check_holder');

const loading = ref(false);
const errorMsg = ref('');
const errorDetails = ref<Record<string, string[]> | null>(null);

const passwordMatch = computed(() => {
  if (!passwordConfirm.value) return true;
  return password.value === passwordConfirm.value;
});

const handleRegister = async () => {
  errorMsg.value = '';
  errorDetails.value = null;

  if (!name.value.trim()) {
    errorMsg.value = 'لطفاً نام و نام خانوادگی خود را وارد کنید.';
    return;
  }

  if (!username.value.trim()) {
    errorMsg.value = 'لطفاً نام کاربری را وارد کنید.';
    return;
  }

  if (password.value !== passwordConfirm.value) {
    errorMsg.value = 'رمز عبور و تکرار رمز عبور یکسان نیستند.';
    return;
  }

  if (password.value.length < 6) {
    errorMsg.value = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
    return;
  }

  loading.value = true;
  try {
    await authStore.register({
      username: username.value,
      email: email.value || `${username.value}@chequeyar.ir`,
      name: name.value,
      phone: phone.value || '09120000000',
      password: password.value,
      password_confirm: passwordConfirm.value,
      role: role.value
    });

    toast.success(`حساب کاربری جدید برای «${name.value}» با موفقیت ایجاد گردید.`);
    router.push('/marketplace');
  } catch (err: any) {
    const apiError = err?.response?.data?.error || err?.error;
    if (apiError) {
      errorMsg.value = apiError.message || 'خطا در ثبت نام.';
      if (apiError.details && typeof apiError.details === 'object' && !Array.isArray(apiError.details)) {
        errorDetails.value = apiError.details;
      }
    } else {
      errorMsg.value = err?.message || 'خطا در ارتباط با سرور.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 dir-rtl font-sans text-slate-100">
    <!-- Top Simulation Mode Banner -->
    <div v-if="isMockActive" class="w-full max-w-lg mb-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-300 flex items-center gap-2">
      <span>💡</span>
      <span>
        <strong>حالت شبیه‌سازی (دمو) فعال است:</strong> حساب جدید شما بلافاصله در حافظه محلی ذخیره شده و وارد سامانه خواهید شد.
      </span>
    </div>

    <NCard class="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      <!-- Header -->
      <div class="text-center space-y-2 mb-6">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xl flex items-center justify-center mx-auto shadow-inner">
          چک
        </div>
        <h1 class="text-lg font-black text-slate-100">ایجاد حساب کاربری جدید</h1>
        <p class="text-xs text-slate-400">به شبکه معامله‌گران و نقدکنندگی هوشمند چِک صیادی بپیوندید</p>
      </div>

      <!-- Error Message -->
      <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
        <div>{{ errorMsg }}</div>
        <ul v-if="errorDetails" class="mt-2 list-disc pr-4 space-y-1">
          <li v-for="(msgs, field) in errorDetails" :key="field">
            <span class="font-bold">{{ field }}:</span> {{ msgs.join(', ') }}
          </li>
        </ul>
      </NAlert>

      <!-- Registration Form -->
      <NForm @submit.prevent="handleRegister" class="space-y-4">
        
        <!-- Role Selection Cards -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-300">نقش اصلی شما در چک‌یار:</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Role Option 1: Holder -->
            <div
              class="cursor-pointer p-3.5 rounded-xl border transition-all duration-200 space-y-1.5"
              :class="[
                role === 'check_holder'
                  ? 'bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              ]"
              @click="role = 'check_holder'"
            >
              <div class="flex items-center justify-between">
                <span class="text-xl">🏦</span>
                <NTag size="small" :type="role === 'check_holder' ? 'success' : 'default'" round>
                  فروشنده
                </NTag>
              </div>
              <div class="font-bold text-xs text-white">دارنده چک</div>
              <p class="text-[10px] text-slate-400 leading-tight">
                ثبت آگهی واگذاری چک‌های صیادی، دریافت پیشنهاد تنزیل و نقدکنندگی
              </p>
            </div>

            <!-- Role Option 2: Investor -->
            <div
              class="cursor-pointer p-3.5 rounded-xl border transition-all duration-200 space-y-1.5"
              :class="[
                role === 'investor'
                  ? 'bg-indigo-950/30 border-indigo-500 ring-1 ring-indigo-500'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              ]"
              @click="role = 'investor'"
            >
              <div class="flex items-center justify-between">
                <span class="text-xl">💼</span>
                <NTag size="small" :type="role === 'investor' ? 'info' : 'default'" round>
                  خریدار
                </NTag>
              </div>
              <div class="font-bold text-xs text-white">سرمایه‌گذار</div>
              <p class="text-[10px] text-slate-400 leading-tight">
                خرید چک‌های معتبر با سود تنزیل شفاف و تسویه امن امانی
              </p>
            </div>
          </div>
        </div>

        <NDivider class="my-3" />

        <!-- User Information Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NFormItem label="نام و نام خانوادگی">
            <NInput v-model:value="name" placeholder="مثلاً: رضا صبوری" />
          </NFormItem>

          <NFormItem label="نام کاربری">
            <NInput v-model:value="username" placeholder="مثلاً: reza_sabouri" />
          </NFormItem>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NFormItem label="آدرس ایمیل">
            <NInput v-model:value="email" placeholder="reza@example.com" />
          </NFormItem>

          <NFormItem label="شماره همراه">
            <NInput v-model:value="phone" placeholder="09123456789" />
          </NFormItem>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NFormItem label="رمز عبور">
            <NInput v-model:value="password" type="password" show-password-on="click" placeholder="حداقل ۶ کاراکتر" />
          </NFormItem>

          <NFormItem label="تکرار رمز عبور">
            <NInput
              v-model:value="passwordConfirm"
              type="password"
              show-password-on="click"
              placeholder="تکرار دقیق رمز عبور"
              :status="!passwordMatch ? 'error' : undefined"
            />
          </NFormItem>
        </div>

        <p v-if="!passwordMatch" class="text-[11px] text-rose-400">
          ⚠️ رمز عبور و تکرار آن یکسان نیستند.
        </p>

        <NButton
          type="primary"
          block
          size="large"
          attr-type="submit"
          :loading="loading"
          class="font-bold shadow-lg shadow-emerald-950/50 mt-2"
        >
          ثبت‌نام و ورود به بازار
        </NButton>
      </NForm>

      <div class="text-center mt-6 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
        قبلاً ثبت‌نام کرده‌اید؟
        <router-link to="/login" class="text-emerald-400 font-bold hover:underline mr-1">
          وارد شوید
        </router-link>
      </div>
    </NCard>
  </div>
</template>
