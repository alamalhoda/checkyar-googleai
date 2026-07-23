<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NCard, NForm, NFormItem, NSelect, NUpload, NUploadDragger, NButton, NAlert, NSpin, useMessage
} from 'naive-ui';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import { listingsApi } from '../../api';
import type { ChequeListing } from '../../types/api';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const listingId = computed(() => Number(route.params.id));
const listing = ref<ChequeListing | null>(null);

const loadingListing = ref(true);
const uploading = ref(false);
const errorMsg = ref('');

const selectedDocType = ref<string>('cheque_image');
const fileList = ref<any[]>([]);

const docTypeOptions = [
  { label: 'تصویر روی چک صیادی (cheque_image)', value: 'cheque_image' },
  { label: 'کارت ملی / مدرک هویتی (id_document)', value: 'id_document' },
  { label: 'مدرک تکمیلی / فاکتور رسمی (supplementary)', value: 'supplementary' }
];

const loadListing = async () => {
  loadingListing.value = true;
  errorMsg.value = '';
  try {
    const res = await listingsApi.getListing(listingId.value);
    listing.value = res;
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در بارگذاری مشخصات آگهی.';
  } finally {
    loadingListing.value = false;
  }
};

const handleUploadSubmit = async () => {
  errorMsg.value = '';
  if (fileList.value.length === 0) {
    errorMsg.value = 'لطفاً حداقل یک فایل را جهت آپلود انتخاب نمایید.';
    return;
  }

  uploading.value = true;
  try {
    for (const f of fileList.value) {
      await listingsApi.uploadDocument(listingId.value, selectedDocType.value, f.name || 'document.pdf');
    }
    message.success('مدارک با موفقیت بارگذاری شد.');
    router.push(`/listings/${listingId.value}`);
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در بارگذاری مدارک.';
  } finally {
    uploading.value = false;
  }
};

onMounted(loadListing);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <NButton secondary size="small" @click="router.back()">← بازگشت</NButton>
            <div>
              <h1 class="text-2xl font-black text-slate-100">بارگذاری مدارک و تصاویر ضمیمه</h1>
              <p class="text-xs text-slate-400 mt-1">آگهی شماره: #{{ listingId }}</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingListing" class="flex justify-center items-center py-20">
          <NSpin size="large" />
        </div>

        <NAlert v-else-if="errorMsg && !listing" type="error" class="my-4">
          {{ errorMsg }}
        </NAlert>

        <NCard v-else class="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
            {{ errorMsg }}
          </NAlert>

          <NForm label-placement="top" class="space-y-6">
            <NFormItem label="نوع مدرک ارسالی">
              <NSelect v-model:value="selectedDocType" :options="docTypeOptions" size="large" />
            </NFormItem>

            <NFormItem label="انتخاب فایل مدرک">
              <NUpload
                v-model:file-list="fileList"
                directory-dnd
                :max="2"
                class="w-full"
              >
                <NUploadDragger class="bg-slate-950/60 border-dashed border-slate-700 hover:border-emerald-500 p-8 w-full">
                  <div class="text-center space-y-2">
                    <p class="text-sm font-bold text-slate-200">جهت آپلود، تصویر یا فایل PDF را اینجا بکشید یا رها کنید</p>
                    <p class="text-xs text-slate-400">فرمت‌های مجاز: JPG, PNG, PDF (حداکثر حجم ۱۰ مگابایت)</p>
                  </div>
                </NUploadDragger>
              </NUpload>
            </NFormItem>

            <div class="flex justify-end pt-4 border-t border-slate-800 gap-3">
              <NButton secondary @click="router.back()">انصراف</NButton>
              <NButton
                type="primary"
                size="large"
                :loading="uploading"
                @click="handleUploadSubmit"
                class="font-bold px-8 bg-emerald-600 hover:bg-emerald-500"
              >
                ارسال و ذخیره مدرک
              </NButton>
            </div>
          </NForm>
        </NCard>
      </main>
    </div>
  </div>
</template>
