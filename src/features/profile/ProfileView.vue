<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  NCard, NForm, NFormItem, NInput, NSelect, NButton, NSpin, NAlert, NTag,
  NDescriptions, NDescriptionsItem, NSpace, useMessage
} from 'naive-ui';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { identityApi } from '../../api';
import type { Profile, UserRole } from '../../types/api';

const message = useMessage();

const profile = ref<Profile | null>(null);
const loading = ref(true);
const saving = ref(false);
const errorMsg = ref('');

// Form state for editable fields (bio, role)
const editableBio = ref('');
const editableRole = ref<UserRole>('check_holder');

const showConfirmModal = ref(false);

const roleOptions = [
  { label: 'دارنده چک (واگذارکننده / فروشنده)', value: 'check_holder' },
  { label: 'سرمایه‌گذار (خریدار چک)', value: 'investor' }
];

const loadProfile = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await identityApi.getProfile();
    profile.value = res;
    editableBio.value = res.bio || '';
    editableRole.value = res.role || 'check_holder';
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در دریافت اطلاعات پروفایل.';
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
    const updated = await identityApi.updateProfile({
      bio: editableBio.value,
      role: editableRole.value
    });
    profile.value = updated;
    message.success('پروفایل با موفقیت بروزرسانی شد.');
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در ویرایش پروفایل.';
    message.error(errorMsg.value);
  } finally {
    saving.value = false;
  }
};

const roleLabel = (role?: UserRole) => {
  switch (role) {
    case 'check_holder': return 'دارنده چک';
    case 'investor': return 'سرمایه‌گذار';
    case 'moderator': return 'ناظر سامانه';
    case 'admin': return 'مدیر ارشد';
    default: return role || '-';
  }
};

onMounted(loadProfile);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-2xl font-black text-slate-100">پروفایل کاربری</h1>
            <p class="text-xs text-slate-400 mt-1">مشاهده و ویرایش مشخصات عمومی و نقش کاربری</p>
          </div>
          <NButton size="small" quaternary @click="loadProfile" :loading="loading">
            بروزرسانی اطلاعات
          </NButton>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <NSpin size="large" />
        </div>

        <!-- Error State -->
        <NAlert v-else-if="errorMsg && !profile" type="error" class="my-4">
          {{ errorMsg }}
        </NAlert>

        <!-- Empty / Not Found State -->
        <div v-else-if="!profile" class="text-center py-16 text-slate-400">
          اطلاعات پروفایل یافت نشد.
        </div>

        <!-- Content -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Read-Only Overview Card -->
          <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-lg flex items-center justify-center border border-emerald-500/30">
                  {{ profile.name ? profile.name.charAt(0) : 'ک' }}
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-100">{{ profile.name }}</h2>
                  <p class="text-xs text-slate-400">@{{ profile.username }}</p>
                </div>
              </div>
            </template>

            <NDescriptions column="1" label-placement="left" class="text-xs">
              <NDescriptionsItem label="شناسه کاربری (ID)">
                <span class="font-mono text-slate-300">#{{ profile.id }}</span>
              </NDescriptionsItem>

              <NDescriptionsItem label="ایمیل">
                <span class="text-slate-300">{{ profile.email }}</span>
              </NDescriptionsItem>

              <NDescriptionsItem label="شماره همراه">
                <span class="text-slate-300">{{ profile.phone || 'ثبت نشده' }}</span>
              </NDescriptionsItem>

              <NDescriptionsItem label="وضعیت احراز هویت">
                <NTag :type="profile.is_verified ? 'success' : 'warning'" size="small">
                  {{ profile.is_verified ? 'تایید شده' : 'در انتظار احراز' }}
                </NTag>
              </NDescriptionsItem>

              <NDescriptionsItem label="نقش فعلی">
                <NTag type="info" size="small">{{ roleLabel(profile.role) }}</NTag>
              </NDescriptionsItem>

              <NDescriptionsItem label="تاریخ عضویت">
                <span class="text-slate-400 text-xs">{{ new Date(profile.created_at).toLocaleDateString('fa-IR') }}</span>
              </NDescriptionsItem>
            </NDescriptions>
          </NCard>

          <!-- Edit Profile Form -->
          <NCard class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg" title="ویرایش پروفایل">
            <NForm class="space-y-4">
              <NFormItem label="نقش در سامانه">
                <NSelect v-model:value="editableRole" :options="roleOptions" />
              </NFormItem>

              <NFormItem label="درباره من / بیوگرافی">
                <NInput
                  v-model:value="editableBio"
                  type="textarea"
                  placeholder="توضیحات کوتاه درباره حوزه فعالیت، سابقه و ترجیحات شما..."
                  :rows="4"
                />
              </NFormItem>

              <div class="flex justify-end pt-2">
                <NButton
                  type="primary"
                  size="medium"
                  :loading="saving"
                  @click="triggerSave"
                  class="font-bold"
                >
                  ذخیره تغییرات
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
      title="تایید ویرایش پروفایل"
      message="آیا از ثبت و بروزرسانی تغییرات در اطلاعات پروفایل اطمینان دارید؟"
      confirm-text="ذخیره پروفایل"
      :loading="saving"
      @confirm="handleSave"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>
