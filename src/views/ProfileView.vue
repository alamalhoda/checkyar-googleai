<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NForm, NFormItem, NInput, NButton, NTag, NAlert, NSpin } from 'naive-ui';
import { ShieldCheckmarkOutline, CheckmarkCircleOutline } from '@vicons/ionicons5';
import { identityApi } from '../api';
import { useAuthStore } from '../stores/auth';
import type { Profile } from '../types/api';

const authStore = useAuthStore();
const profile = ref<Profile | null>(null);
const loading = ref(false);

const fullName = ref('');
const nationalId = ref('');
const companyName = ref('');
const submittingKyc = ref(false);
const kycSuccess = ref(false);

const loadProfile = async () => {
  loading.value = true;
  try {
    profile.value = await identityApi.getProfile();
    if (profile.value) {
      fullName.value = profile.value.name;
    }
  } catch (err) {
    console.error('Failed to load profile', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadProfile);

const handleKycSubmit = async () => {
  submittingKyc.value = true;
  try {
    await identityApi.createVerification({
      full_name: fullName.value,
      national_id: nationalId.value,
      company_name: companyName.value
    });
    kycSuccess.value = true;
  } catch (err) {
    console.error('Failed to submit KYC', err);
  } finally {
    submittingKyc.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <NSpin :show="loading">
      <div v-if="profile" class="space-y-6">
        <!-- Identity Card -->
        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div>
              <h1 class="text-base font-bold text-slate-100">{{ profile.name }}</h1>
              <p class="text-xs text-slate-400 font-mono">نام کاربری: @{{ profile.username }}</p>
            </div>

            <NTag :type="profile.is_verified ? 'success' : 'warning'" round size="large">
              {{ profile.is_verified ? 'احراز هویت شده (تایید صیاد)' : 'در انتظار احراز هویت' }}
            </NTag>
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span class="text-slate-400 block mb-1">ایمیل:</span>
              <span class="font-mono text-slate-200">{{ profile.email }}</span>
            </div>
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span class="text-slate-400 block mb-1">شماره همراه:</span>
              <span class="font-mono text-slate-200">{{ profile.phone }}</span>
            </div>
          </div>
        </NCard>

        <!-- KYC Upload Form -->
        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div class="border-b border-slate-800 pb-3 mb-4">
            <h2 class="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheckmarkOutline class="w-5 h-5 text-emerald-400" />
              تکمیل مدارک و احراز هویت هوشمند (KYC)
            </h2>
          </div>

          <NAlert v-if="kycSuccess" type="success" class="mb-4 text-xs" closable>
            مدارک احراز هویت شما با موفقیت ارسال شد و در صف بررسی کارشناس قرار گرفت.
          </NAlert>

          <NForm @submit.prevent="handleKycSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NFormItem label="نام و نام خانوادگی اصلی">
                <NInput v-model:value="fullName" placeholder="مطابق کارت ملی" />
              </NFormItem>

              <NFormItem label="کد ملی / شناسه ملی">
                <NInput v-model:value="nationalId" placeholder="۱۰ یا ۱۱ رقم" />
              </NFormItem>
            </div>

            <NFormItem label="نام شرکت / مجموعه تجاری (اختیاری)">
              <NInput v-model:value="companyName" placeholder="در صورت داشتن شخصیت حقوقی" />
            </NFormItem>

            <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <div class="font-bold text-slate-200">بارگذاری مدارک (شبیه‌سازی شده):</div>
              <p>• تصویر روی کارت ملی جدید</p>
              <p>• تصویر پشت کارت ملی یا شناسنامه</p>
            </div>

            <NButton type="primary" size="large" attr-type="submit" :loading="submittingKyc" class="font-bold">
              ارسال جهت احراز هویت
            </NButton>
          </NForm>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
