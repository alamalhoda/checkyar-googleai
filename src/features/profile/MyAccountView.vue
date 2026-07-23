<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  NCard, NForm, NFormItem, NInput, NSelect, NButton, NSpin, NAlert, NTag,
  NDescriptions, NDescriptionsItem, useMessage
} from 'naive-ui';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { usersApi } from '../../api';
import type { User, UserRole } from '../../types/api';

const message = useMessage();

const user = ref<User | null>(null);
const loading = ref(true);
const saving = ref(false);
const errorMsg = ref('');

// Form state
const name = ref('');
const email = ref('');
const phone = ref('');
const role = ref<'check_holder' | 'investor'>('check_holder');

const showConfirmModal = ref(false);

const roleOptions = [
  { label: 'دارنده چک (واگذارکننده)', value: 'check_holder' },
  { label: 'سرمایه‌گذار (خریدار)', value: 'investor' }
];

const loadUserData = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await usersApi.getMe();
    user.value = res;
    name.value = res.name || '';
    email.value = res.email || '';
    phone.value = res.phone || '';
    if (res.role === 'check_holder' || res.role === 'investor') {
      role.value = res.role;
    }
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در دریافت اطلاعات حساب کاربری.';
  } finally {
    loading.value = false;
  }
};

const triggerSave = () => {
  showConfirmModal.value = true;
};

const handleSave = async () => {
  showConfirmModal.value = false;
  saving.value = true;
  errorMsg.value = '';
  try {
    const updated = await usersApi.updateMe({
      name: name.value,
      email: email.value,
      phone: phone.value,
      role: role.value
    });
    user.value = updated;
    message.success('اطلاعات حساب با موفقیت به روز گردید.');
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در ویرایش حساب کاربری.';
    message.error(errorMsg.value);
  } finally {
    saving.value = false;
  }
};

const roleLabel = (roleStr?: UserRole) => {
  switch (roleStr) {
    case 'check_holder': return 'دارنده چک';
    case 'investor': return 'سرمایه‌گذار';
    case 'moderator': return 'ناظر سامانه';
    case 'admin': return 'مدیر ارشد';
    default: return roleStr || '-';
  }
};

onMounted(loadUserData);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-2xl font-black text-slate-100">مدیریت حساب کاربری</h1>
            <p class="text-xs text-slate-400 mt-1">مشاهده و ویرایش پارامترهای اصلی حساب (GET/PATCH /api/v1/users/me/)</p>
          </div>
          <NButton size="small" quaternary @click="loadUserData" :loading="loading">
            بارگذاری مجدد
          </NButton>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <NSpin size="large" />
        </div>

        <!-- Error State -->
        <NAlert v-else-if="errorMsg && !user" type="error" class="my-4">
          {{ errorMsg }}
        </NAlert>

        <!-- Empty State -->
        <div v-else-if="!user" class="text-center py-16 text-slate-400">
          اطلاعات حساب کاربری یافت نشد.
        </div>

        <!-- Content -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Overview Card -->
          <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
            <template #header>
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-100">اطلاعات سیستمی</span>
                <NTag :type="user.is_verified ? 'success' : 'warning'" size="small">
                  {{ user.is_verified ? 'تایید شده' : 'غیرفعال / در انتظار' }}
                </NTag>
              </div>
            </template>

            <NDescriptions column="1" label-placement="left" class="text-xs">
              <NDescriptionsItem label="شناسه کاربری (ID)">
                <span class="font-mono text-emerald-400">#{{ user.id }}</span>
              </NDescriptionsItem>

              <NDescriptionsItem label="نام کاربری (Username)">
                <span class="font-mono text-slate-200">@{{ user.username }}</span>
              </NDescriptionsItem>

              <NDescriptionsItem label="نقش سیستمی">
                <NTag type="info" size="small">{{ roleLabel(user.role) }}</NTag>
              </NDescriptionsItem>

              <NDescriptionsItem label="وضعیت احراز هویت">
                <span>{{ user.is_verified ? 'تایید هویت شده' : 'عدم تایید مدارک' }}</span>
              </NDescriptionsItem>
            </NDescriptions>
          </NCard>

          <!-- Edit Account Form -->
          <NCard class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg" title="ویرایش اطلاعات اصلی">
            <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
              {{ errorMsg }}
            </NAlert>

            <NForm class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NFormItem label="نام و نام خانوادگی">
                  <NInput v-model:value="name" placeholder="نام کامل" />
                </NFormItem>

                <NFormItem label="ایمیل">
                  <NInput v-model:value="email" placeholder="ایمیل کاربر" />
                </NFormItem>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NFormItem label="شماره همراه">
                  <NInput v-model:value="phone" placeholder="09123456789" />
                </NFormItem>

                <NFormItem label="نقش کاربری">
                  <NSelect v-model:value="role" :options="roleOptions" />
                </NFormItem>
              </div>

              <div class="flex justify-end pt-2">
                <NButton
                  type="primary"
                  size="medium"
                  :loading="saving"
                  @click="triggerSave"
                  class="font-bold"
                >
                  ذخیره تغییرات حساب
                </NButton>
              </div>
            </NForm>
          </NCard>
        </div>
      </main>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :show="showConfirmModal"
      title="ویرایش حساب کاربری"
      message="آیا از ثبت تغییرات در حساب کاربری خود اطمینان دارید؟"
      confirm-text="تایید و ذخیره"
      :loading="saving"
      @confirm="handleSave"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>
