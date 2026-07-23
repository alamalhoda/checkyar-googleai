<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NForm, NFormItem, NInput, NRadioGroup, NRadio, NButton, NAlert } from 'naive-ui';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const name = ref('');
const phone = ref('');
const role = ref<'check_holder' | 'investor'>('check_holder');

const loading = ref(false);
const errorMsg = ref('');

const handleRegister = async () => {
  errorMsg.value = '';
  if (!username.value || !password.value) {
    errorMsg.value = 'لطفا نام کاربری و رمز عبور را وارد کنید.';
    return;
  }
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = 'رمز عبور و تایید آن مطابقت ندارند.';
    return;
  }

  loading.value = true;
  try {
    await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value,
      password_confirm: passwordConfirm.value,
      name: name.value,
      phone: phone.value,
      role: role.value
    });
    router.push('/marketplace');
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.error?.message || err?.message || 'خطا در ثبت نام.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <NCard class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      <div class="text-center space-y-2 mb-6">
        <h1 class="text-xl font-black text-slate-100">ثبت نام در چک‌یار</h1>
        <p class="text-xs text-slate-400">ایجاد حساب برای معامله چک یا سرمایه‌گذاری مطالبات</p>
      </div>

      <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
        {{ errorMsg }}
      </NAlert>

      <NForm @submit.prevent="handleRegister" class="space-y-3">
        <NFormItem label="نوع فعالیت">
          <NRadioGroup v-model:value="role" class="w-full grid grid-cols-2 gap-2">
            <NRadio value="check_holder" class="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span class="text-xs">دارنده چک</span>
            </NRadio>
            <NRadio value="investor" class="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span class="text-xs">سرمایه‌گذار</span>
            </NRadio>
          </NRadioGroup>
        </NFormItem>

        <NFormItem label="نام و نام خانوادگی / نام شرکت">
          <NInput v-model:value="name" placeholder="مثال: شرکت بازرگانی صبوری" />
        </NFormItem>

        <NFormItem label="نام کاربری">
          <NInput v-model:value="username" placeholder="مثال: sabouri_trade" />
        </NFormItem>

        <NFormItem label="شماره همراه">
          <NInput v-model:value="phone" placeholder="09121111111" />
        </NFormItem>

        <NFormItem label="ایمیل">
          <NInput v-model:value="email" placeholder="email@example.com" />
        </NFormItem>

        <NFormItem label="رمز عبور">
          <NInput v-model:value="password" type="password" show-password-on="click" />
        </NFormItem>

        <NFormItem label="تکرار رمز عبور">
          <NInput v-model:value="passwordConfirm" type="password" show-password-on="click" />
        </NFormItem>

        <NButton type="primary" block size="large" attr-type="submit" :loading="loading" class="font-bold">
          ایجاد حساب و ورود
        </NButton>
      </NForm>

      <div class="text-center mt-6 text-xs text-slate-400">
        قبلا ثبت نام کرده‌اید؟
        <router-link to="/login" class="text-emerald-400 font-bold hover:underline mr-1">
          وارد شوید
        </router-link>
      </div>
    </NCard>
  </div>
</template>
