<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NForm, NFormItem, NInput, NButton, NAlert, NDivider } from 'naive-ui';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const identifier = ref('holder1');
const password = ref('password123');
const loading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  errorMsg.value = '';
  loading.value = true;
  try {
    await authStore.login({
      identifier: identifier.value,
      password: password.value
    });
    router.push('/marketplace');
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.error?.message || err?.message || 'خطا در ورود به حساب کاربری.';
  } finally {
    loading.value = false;
  }
};

const quickFill = (userType: string) => {
  if (userType === 'holder') {
    identifier.value = 'holder1';
  } else if (userType === 'investor') {
    identifier.value = 'investor1';
  } else if (userType === 'moderator') {
    identifier.value = 'mod1';
  } else if (userType === 'admin') {
    identifier.value = 'admin1';
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <NCard class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      <!-- Header Branding -->
      <div class="text-center space-y-2 mb-6">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xl flex items-center justify-center mx-auto">
          چک
        </div>
        <h1 class="text-xl font-black text-slate-100">ورود به سامانه چک‌یار</h1>
        <p class="text-xs text-slate-400">سامانه معامله و مدیریت چِک صیادی و مطالبات مالی</p>
      </div>

      <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
        {{ errorMsg }}
      </NAlert>

      <NForm @submit.prevent="handleLogin" class="space-y-4">
        <NFormItem label="نام کاربری یا ایمیل">
          <NInput
            v-model:value="identifier"
            placeholder="مثلا: holder1"
            size="large"
          />
        </NFormItem>

        <NFormItem label="رمز عبور">
          <NInput
            v-model:value="password"
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
          class="font-bold"
        >
          ورود به حساب
        </NButton>
      </NForm>

      <NDivider class="my-6">
        <span class="text-xs text-slate-500">ورود سریع تست (دمو)</span>
      </NDivider>

      <!-- Quick Demo Login Buttons -->
      <div class="grid grid-cols-2 gap-2 text-xs">
        <NButton size="small" secondary @click="quickFill('holder')">
          دارنده چک (Holder)
        </NButton>
        <NButton size="small" secondary @click="quickFill('investor')">
          سرمایه‌گذار (Investor)
        </NButton>
        <NButton size="small" secondary @click="quickFill('moderator')">
          ناظر (Moderator)
        </NButton>
        <NButton size="small" secondary @click="quickFill('admin')">
          مدیر ارشد (Admin)
        </NButton>
      </div>

      <div class="text-center mt-6 text-xs text-slate-400">
        حساب کاربری ندارید؟
        <router-link to="/register" class="text-emerald-400 font-bold hover:underline mr-1">
          ثبت نام کنید
        </router-link>
      </div>
    </NCard>
  </div>
</template>
