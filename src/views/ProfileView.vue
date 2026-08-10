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

          <div class="grid grid-cols-3 gap-4 text-xs mb-4">
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span class="text-slate-400 block mb-1">نوع کاربر:</span>
              <NTag :type="profile.user_type === 'legal' ? 'warning' : 'info'" size="small" data-testid="kyc-user-type">
                {{ profile.user_type === 'legal' ? '🏢 شخص حقوقی' : '👤 شخص حقیقی' }}
              </NTag>
            </div>
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
            <div v-if="profile.user_type === 'legal'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NFormItem label="نام رسمی شرکت">
                <NInput v-model:value="companyName" data-testid="kyc-company-name" :input-props="{ 'data-testid': 'kyc-company-name' }" placeholder="مثال: شرکت بازرگانی صبوری" />
              </NFormItem>
              <NFormItem label="شناسه ملی شرکت (۱۱ رقم)">
                <NInput v-model:value="nationalId" data-testid="kyc-national-id" :input-props="{ 'data-testid': 'kyc-national-id' }" maxlength="11" placeholder="۱۱ رقم" />
              </NFormItem>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NFormItem :label="profile.user_type === 'legal' ? 'نام و نام خانوادگی نماینده قانونی' : 'نام و نام خانوادگی اصلی'">
                <NInput v-model:value="fullName" data-testid="kyc-full-name" :input-props="{ 'data-testid': 'kyc-full-name' }" placeholder="مطابق کارت ملی" />
              </NFormItem>

              <NFormItem v-if="profile.user_type !== 'legal'" label="کد ملی (۱۰ رقم)">
                <NInput v-model:value="nationalId" data-testid="kyc-national-id" :input-props="{ 'data-testid': 'kyc-national-id' }" maxlength="10" placeholder="۱۰ رقم" />
              </NFormItem>
            </div>

            <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <div class="font-bold text-slate-200">بارگذاری مدارک:</div>
              <input type="file" accept="image/*" data-testid="kyc-national-id-front" class="block w-full text-xs text-slate-400 my-1" />
              <input type="file" accept="image/*" data-testid="kyc-national-id-back" class="block w-full text-xs text-slate-400 my-1" />
              <input type="file" accept="image/*" data-testid="kyc-selfie" class="block w-full text-xs text-slate-400 my-1" />
            </div>

            <NButton type="primary" size="large" data-testid="kyc-submit" attr-type="submit" :loading="submittingKyc" class="font-bold">
              ارسال جهت احراز هویت
            </NButton>
          </NForm>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
