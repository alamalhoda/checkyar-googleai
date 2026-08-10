<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  NCard, NForm, NFormItem, NInput, NSelect, NButton, NSpin, NAlert, NTag,
  NDescriptions, NDescriptionsItem, useMessage
} from 'naive-ui';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { identityApi } from '../../api';
import type { Profile, UserRole, Verification } from '../../types/api';

const message = useMessage();

const profile = ref<Profile | null>(null);
const currentVerification = ref<Verification | null>(null);
const loading = ref(true);
const saving = ref(false);
const submittingKyc = ref(false);
const kycSuccess = ref(false);
const errorMsg = ref('');
const kycErrorMsg = ref('');
const kycErrorDetails = ref<Record<string, string[]> | null>(null);

// Form state for editable fields (bio, role)
const editableBio = ref('');
const editableRole = ref<UserRole>('check_holder');

// KYC Form state
const fullName = ref('');
const nationalId = ref('');
const companyName = ref('');
const frontFile = ref<File | string | undefined>(undefined);
const backFile = ref<File | string | undefined>(undefined);
const selfieFile = ref<File | string | undefined>(undefined);

const showConfirmModal = ref(false);

const roleOptions = [
  { label: 'دارنده چک (واگذارکننده / فروشنده)', value: 'check_holder' },
  { label: 'سرمایه‌گذار (خریدار چک)', value: 'investor' }
];

const loadProfile = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const [profRes, verifRes] = await Promise.all([
      identityApi.getProfile(),
      identityApi.getVerificationMe().catch(() => null)
    ]);
    profile.value = profRes;
    editableBio.value = profRes.bio || '';
    editableRole.value = profRes.role || 'check_holder';
    fullName.value = profRes.name || '';
    currentVerification.value = verifRes;
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در دریافت اطلاعات پروفایل.';
  } finally {
    loading.value = false;
  }
};

const handleFrontChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    frontFile.value = target.files[0];
  }
};

const handleBackChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    backFile.value = target.files[0];
  }
};

const handleSelfieChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selfieFile.value = target.files[0];
  }
};

const handleKycSubmit = async () => {
  kycErrorMsg.value = '';
  kycErrorDetails.value = null;

  const isLegal = profile.value?.user_type === 'legal';

  if (isLegal) {
    if (!companyName.value.trim()) {
      kycErrorMsg.value = 'لطفاً نام رسمی شرکت را وارد کنید.';
      return;
    }
    if (!/^\d{11}$/.test(nationalId.value.trim())) {
      kycErrorMsg.value = 'شناسه ملی شخص حقوقی باید دقیقاً ۱۱ رقم عددی باشد.';
      return;
    }
    if (!fullName.value.trim()) {
      kycErrorMsg.value = 'لطفاً نام نماینده قانونی / صاحب امضای مجاز را وارد کنید.';
      return;
    }
  } else {
    // Natural
    if (!fullName.value.trim()) {
      kycErrorMsg.value = 'لطفاً نام و نام خانوادگی مطابق کارت ملی را وارد کنید.';
      return;
    }
    if (!/^\d{10}$/.test(nationalId.value.trim())) {
      kycErrorMsg.value = 'کد ملی شخص حقیقی باید دقیقاً ۱۰ رقم عددی باشد.';
      return;
    }
  }

  submittingKyc.value = true;
  try {
    const created = await identityApi.createVerification({
      full_name: fullName.value.trim(),
      national_id: nationalId.value.trim(),
      company_name: isLegal ? companyName.value.trim() : undefined,
      national_id_front: frontFile.value,
      national_id_back: backFile.value,
      selfie: selfieFile.value
    });
    currentVerification.value = created;
    kycSuccess.value = true;
    message.success('مدارک احراز هویت جهت بررسی ارسال گردید.');
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    if (apiErr) {
      kycErrorMsg.value = apiErr.message || 'خطا در ارسال اطلاعات احراز هویت.';
      if (apiErr.details && typeof apiErr.details === 'object' && !Array.isArray(apiErr.details)) {
        kycErrorDetails.value = apiErr.details;
      }
    } else {
      kycErrorMsg.value = err?.message || 'خطا در ارتباط با سرور.';
    }
  } finally {
    submittingKyc.value = false;
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
  <div class="space-y-6 dir-rtl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-2xl font-black text-slate-100">پروفایل کاربری و احراز هویت</h1>
            <p class="text-xs text-slate-400 mt-1">مشاهده مشخصات عمومی، احراز هویت (KYC) و مدیریت نقش کاربری</p>
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
        <div v-else class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                <NDescriptionsItem label="نوع کاربر">
                  <NTag
                    :type="profile.user_type === 'legal' ? 'warning' : 'info'"
                    size="small"
                    data-testid="kyc-user-type"
                  >
                    {{ profile.user_type === 'legal' ? '🏢 شخص حقوقی' : '👤 شخص حقیقی' }}
                  </NTag>
                </NDescriptionsItem>

                <NDescriptionsItem label="ایمیل">
                  <span class="text-slate-300">{{ profile.email }}</span>
                </NDescriptionsItem>

                <NDescriptionsItem label="شماره همراه">
                  <span class="text-slate-300">{{ profile.phone || 'ثبت نشده' }}</span>
                </NDescriptionsItem>

                <NDescriptionsItem label="وضعیت احراز هویت">
                  <NTag :type="profile.is_verified || currentVerification?.status === 'approved' ? 'success' : currentVerification?.status === 'pending' ? 'warning' : 'default'" size="small">
                    {{ profile.is_verified || currentVerification?.status === 'approved' ? 'تایید شده (سطح ۲)' : currentVerification?.status === 'pending' ? 'در انتظار بررسی ناظر' : 'نیاز به تکمیل مدارک' }}
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
            <NCard class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg" title="ویرایش اطلاعات کاربری">
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

          <!-- KYC Submit Section -->
          <NCard data-testid="kyc-submit-page" class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg" title="تکمیل مدارک و احراز هویت (KYC Live)">
            <NAlert v-if="kycSuccess" type="success" class="mb-4 text-xs" closable @close="kycSuccess = false">
              اطلاعات احراز هویت با موفقیت ارسال شد و در صف بررسی ناظر سیستم قرار گرفت.
            </NAlert>

            <NAlert v-if="kycErrorMsg" type="error" class="mb-4 text-xs" closable @close="kycErrorMsg = ''">
              <div>{{ kycErrorMsg }}</div>
              <ul v-if="kycErrorDetails" class="mt-2 list-disc pr-4 space-y-1">
                <li v-for="(msgs, field) in kycErrorDetails" :key="field">
                  <span class="font-bold">{{ field }}:</span> {{ msgs.join(', ') }}
                </li>
              </ul>
            </NAlert>

            <div v-if="currentVerification && !kycSuccess" class="mb-6 p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-2">
              <div class="flex justify-between items-center">
                <span class="font-bold text-slate-200">آخرین وضعیت درخواست احراز هویت:</span>
                <NTag :type="currentVerification.status === 'approved' ? 'success' : currentVerification.status === 'rejected' ? 'error' : 'warning'" size="small">
                  {{ currentVerification.status === 'approved' ? 'تایید شده' : currentVerification.status === 'rejected' ? 'رد شده' : 'در انتظار بررسی' }}
                </NTag>
              </div>
              <div v-if="currentVerification.rejection_reason" class="text-rose-400">
                علت رد: {{ currentVerification.rejection_reason }}
              </div>
            </div>

            <NForm class="space-y-4" @submit.prevent="handleKycSubmit">
              <!-- Legal User Specific Fields -->
              <div v-if="profile.user_type === 'legal'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NFormItem label="نام رسمی شرکت (مطابق روزنامه رسمی)">
                  <NInput
                    v-model:value="companyName"
                    placeholder="مثلاً: شرکت توسعه تجارت نوین"
                    data-testid="kyc-company-name"
                    :input-props="{ 'data-testid': 'kyc-company-name' }"
                  />
                </NFormItem>

                <NFormItem label="شناسه ملی شرکت (۱۱ رقم)">
                  <NInput
                    v-model:value="nationalId"
                    placeholder="مثلاً: 10100012345"
                    maxlength="11"
                    data-testid="kyc-national-id"
                    :input-props="{ 'data-testid': 'kyc-national-id' }"
                  />
                </NFormItem>
              </div>

              <!-- Natural User Fields / Legal Representative Field -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NFormItem :label="profile.user_type === 'legal' ? 'نام و نام خانوادگی نماینده قانونی / صاحب امضا' : 'نام و نام خانوادگی (مطابق کارت ملی)'">
                  <NInput
                    v-model:value="fullName"
                    :placeholder="profile.user_type === 'legal' ? 'نام نماینده قانونی' : 'مطابق کارت ملی'"
                    data-testid="kyc-full-name"
                    :input-props="{ 'data-testid': 'kyc-full-name' }"
                  />
                </NFormItem>

                <NFormItem v-if="profile.user_type !== 'legal'" label="کد ملی (۱۰ رقم)">
                  <NInput
                    v-model:value="nationalId"
                    placeholder="مثلاً: 0012345678"
                    maxlength="10"
                    data-testid="kyc-national-id"
                    :input-props="{ 'data-testid': 'kyc-national-id' }"
                  />
                </NFormItem>
              </div>

              <!-- Upload Documents -->
              <div class="border-t border-slate-800 pt-4 space-y-3">
                <h3 class="text-xs font-bold text-slate-200">بارگذاری تصاویر مدارک:</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div class="space-y-1">
                    <label class="block text-slate-400">تصویر روی کارت ملی {{ profile.user_type === 'legal' ? 'نماینده' : '' }} *</label>
                    <input
                      type="file"
                      accept="image/*"
                      data-testid="kyc-national-id-front"
                      @change="handleFrontChange"
                      class="block w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-slate-400">تصویر پشت کارت ملی {{ profile.user_type === 'legal' ? 'نماینده' : '' }} *</label>
                    <input
                      type="file"
                      accept="image/*"
                      data-testid="kyc-national-id-back"
                      @change="handleBackChange"
                      class="block w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-slate-400">تصویر سلفی با تعهدنامه (اختیاری)</label>
                    <input
                      type="file"
                      accept="image/*"
                      data-testid="kyc-selfie"
                      @change="handleSelfieChange"
                      class="block w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <NButton
                  type="primary"
                  size="large"
                  data-testid="kyc-submit"
                  :loading="submittingKyc"
                  attr-type="submit"
                  class="font-bold px-8 bg-emerald-600 hover:bg-emerald-500"
                >
                  ارسال جهت بررسی و احراز هویت
                </NButton>
              </div>
            </NForm>
          </NCard>
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
