<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert } from 'naive-ui';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

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

const roleOptions = [
  { label: 'دارنده چک (واگذارکننده / فروشنده)', value: 'check_holder' },
  { label: 'سرمایه‌گذار (خریدار چک)', value: 'investor' }
];

const handleRegister = async () => {
  errorMsg.value = '';
  errorDetails.value = null;

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
      email: email.value,
      name: name.value,
      phone: phone.value,
      password: password.value,
      password_confirm: passwordConfirm.value,
      role: role.value
    });
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
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 dir-rtl">
    <NCard class="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      <!-- Header -->
      <div class="text-center space-y-2 mb-6">
        <h1 class="text-xl font-black text-slate-100">ایجاد حساب کاربری جدید</h1>
        <p class="text-xs text-slate-400">اطلاعات کاربری خود را جهت ورود به شبکه معامله‌گران ثبت کنید</p>
      </div>

      <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
        <div>{{ errorMsg }}</div>
        <ul v-if="errorDetails" class="mt-2 list-disc pr-4 space-y-1">
          <li v-for="(msgs, field) in errorDetails" :key="field">
            <span class="font-bold">{{ field }}:</span> {{ msgs.join(', ') }}
          </li>
        </ul>
      </NAlert>

      <NForm @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="نام کاربری">
            <NInput v-model:value="username" placeholder="مثلا: reza_sabouri" />
          </NFormItem>

          <NFormItem label="نام و نام خانوادگی">
            <NInput v-model:value="name" placeholder="مثلا: رضا صبوری" />
          </NFormItem>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="ایمیل">
            <NInput v-model:value="email" placeholder="example@mail.com" />
          </NFormItem>

          <NFormItem label="شماره همراه">
            <NInput v-model:value="phone" placeholder="09123456789" />
          </NFormItem>
        </div>

        <NFormItem label="نقش کاربری">
          <NSelect v-model:value="role" :options="roleOptions" />
        </NFormItem>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="رمز عبور">
            <NInput v-model:value="password" type="password" show-password-on="click" placeholder="••••••••" />
          </NFormItem>

          <NFormItem label="تکرار رمز عبور">
            <NInput v-model:value="passwordConfirm" type="password" show-password-on="click" placeholder="••••••••" />
          </NFormItem>
        </div>

        <NButton
          type="primary"
          block
          size="large"
          attr-type="submit"
          :loading="loading"
          class="font-bold mt-2"
        >
          ثبت نام و شروع
        </NButton>
      </NForm>

      <div class="text-center mt-6 text-xs text-slate-400">
        قبلاً ثبت نام کرده‌اید؟
        <router-link to="/login" class="text-emerald-400 font-bold hover:underline mr-1">
          وارد شوید
        </router-link>
      </div>
    </NCard>
  </div>
</template>
