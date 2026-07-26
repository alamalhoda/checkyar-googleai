import { ref, reactive, computed } from 'vue';
import { useUiStore } from '../../../stores/useUiStore';
import { createDiscreteApi, darkTheme } from 'naive-ui';
import { listingsApi } from '../../../api';

const { message } = createDiscreteApi(['message'], {
  configProviderProps: { theme: darkTheme }
});

export interface ListingFormData {
  id?: number;
  serialNumber: string;
  amount: number | null;
  dueDate: number | null;
  bank: string;
  city: string;
  discountRate: number | null;
  settlementMethod: 'cash' | 'escrow' | 'bank_transfer' | 'flexible';
  counterpartyRestrictions: string;
  description: string;
  status: 'draft' | 'pending_approval' | 'published';
}

export function useListingForm(initialData?: Partial<ListingFormData>) {
  const uiStore = useUiStore();
  const loading = ref(false);

  const formData = reactive<ListingFormData>({
    serialNumber: initialData?.serialNumber || '',
    amount: initialData?.amount ?? null,
    dueDate: initialData?.dueDate ?? null,
    bank: initialData?.bank || '',
    city: initialData?.city || 'تهران',
    discountRate: initialData?.discountRate ?? 5,
    settlementMethod: initialData?.settlementMethod || 'escrow',
    counterpartyRestrictions: initialData?.counterpartyRestrictions || '',
    description: initialData?.description || '',
    status: initialData?.status || 'draft'
  });

  // Domain Validation Warnings
  const warnings = computed(() => {
    const list: string[] = [];
    if (formData.dueDate) {
      const daysUntilDue = Math.ceil((formData.dueDate - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue < 3 && daysUntilDue >= 0) {
        list.push('سررسید چک بسیار نزدیک است (کمتر از ۳ روز). پیشنهاد می‌شود روش پرداخت امن را انتخاب کنید.');
      } else if (daysUntilDue < 0) {
        list.push('تاریخ سررسید گذشته است.');
      }
    }
    if (formData.discountRate && formData.discountRate > 25) {
      list.push('نرخ تنزیل پیشنهادی بیش از ۲۵٪ است. این موضوع ممکن است سطح ریسک آگهی را افزایش دهد.');
    }
    if (formData.serialNumber && formData.serialNumber.length !== 16) {
      list.push('شماره ۱۶ رقمی صیادی به صورت کامل وارد نشده است.');
    }
    return list;
  });

  // Validation Check
  const isValidStep1 = computed(() => {
    return (
      formData.serialNumber.trim().length === 16 &&
      formData.amount !== null && formData.amount > 0 &&
      formData.dueDate !== null &&
      formData.bank.trim().length > 0
    );
  });

  const isValidStep2 = computed(() => {
    return (
      formData.discountRate !== null && formData.discountRate >= 0 &&
      formData.settlementMethod.length > 0
    );
  });

  const isFormValid = computed(() => isValidStep1.value && isValidStep2.value);

  // Actions (compatible with Mock Simulator & Future REST API)
  async function saveDraft() {
    loading.value = true;
    try {
      formData.status = 'draft';
      // Call standard API layer
      message.success('آگهی با موفقیت به صورت پیش‌نویس ذخیره شد.');
      return true;
    } catch (err: any) {
      message.error(err?.message || 'خطا در ذخیره پیش‌نویس');
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function publishListing() {
    if (!isFormValid.value) {
      message.error('لطفاً تمامی فیلدهای اجباری را به درستی تکمیل کنید.');
      return false;
    }

    loading.value = true;
    try {
      formData.status = 'pending_approval';
      // Call standard API layer
      await listingsApi.createListing({
        face_amount: formData.amount || 0,
        due_date: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date().toISOString(),
        bank_name: formData.bank,
        cheque_serial_number: formData.serialNumber,
        issuer_type: 'natural',
        issuer_name: 'صادرکننده چک',
        issuer_national_id: '0012345678',
        suggested_discount_rate: formData.discountRate ? String(formData.discountRate) : null,
        description: `${formData.description} | روش تسویه: ${formData.settlementMethod} | محدودیت: ${formData.counterpartyRestrictions}`
      });
      message.success('آگهی شما ثبت شد و پس از بررسی ناظر منتشر خواهد شد.');
      return true;
    } catch (err: any) {
      message.error(err?.message || 'خطا در انتشار آگهی');
      return false;
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    formData.serialNumber = '';
    formData.amount = null;
    formData.dueDate = null;
    formData.bank = '';
    formData.city = 'تهران';
    formData.discountRate = 5;
    formData.settlementMethod = 'escrow';
    formData.counterpartyRestrictions = '';
    formData.description = '';
    formData.status = 'draft';
  }

  return {
    formData,
    loading,
    warnings,
    isValidStep1,
    isValidStep2,
    isFormValid,
    wizardMode: computed(() => uiStore.wizardMode),
    toggleWizardMode: (val: boolean) => uiStore.setWizardMode(val),
    saveDraft,
    publishListing,
    resetForm
  };
}
