import { ref, reactive, computed } from 'vue';
import { useUiStore } from '../../../stores/useUiStore';
import { message } from '../../../utils/discreteApi';
import { listingsApi } from '../../../api';
import { validateSayadId, validateNationalId, toEnglishDigits } from '../../../utils/persianUtils';
import { findBankByNameOrAlias, findBankByCode } from '../../../shared/banks/lookup';

function toBlobOrFile(data: string, defaultName: string): Blob {
  if (data.startsWith('data:')) {
    const arr = data.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], defaultName, { type: mime });
  }
  return new Blob([data], { type: 'text/plain' });
}

export interface UploadedDoc {
  id: string;
  name: string;
  url: string;
  type: 'cheque_front' | 'cheque_back' | 'contract' | 'other';
  size?: string;
  uploadedAt: string;
}

export interface ListingFormData {
  id?: number;
  // Step 1: Cheque Specs
  serialNumber: string;
  amount: number | null;
  dueDate: number | null;
  issuerName: string;
  issuerNationalId: string;
  issuerType: 'natural' | 'legal';
  bank: string;
  city: string;
  
  // Step 2: Documents
  chequeFrontImage: string | null;
  chequeBackImage: string | null;
  contractDoc: string | null;
  contractText: string;
  additionalDocs: UploadedDoc[];

  // Step 3: Pricing & Conditions
  discountRate: number | null;
  netPrice: number | null;
  suggestedRate: number | null;
  suggestedPrice: number | null;
  finalRate: number | null;
  finalPrice: number | null;
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
    issuerName: initialData?.issuerName || '',
    issuerNationalId: initialData?.issuerNationalId || '',
    issuerType: initialData?.issuerType || 'natural',
    bank: initialData?.bank || '',
    city: initialData?.city || 'تهران',

    chequeFrontImage: initialData?.chequeFrontImage || null,
    chequeBackImage: initialData?.chequeBackImage || null,
    contractDoc: initialData?.contractDoc || null,
    contractText: initialData?.contractText || '',
    additionalDocs: initialData?.additionalDocs || [],

    discountRate: initialData?.discountRate ?? 25,
    netPrice: initialData?.netPrice ?? null,
    suggestedRate: initialData?.suggestedRate ?? null,
    suggestedPrice: initialData?.suggestedPrice ?? null,
    finalRate: initialData?.finalRate ?? null,
    finalPrice: initialData?.finalPrice ?? null,
    settlementMethod: initialData?.settlementMethod || 'escrow',
    counterpartyRestrictions: initialData?.counterpartyRestrictions || '',
    description: initialData?.description || '',
    status: initialData?.status || 'draft'
  });

  // Validation Checks
  const sayadValidation = computed(() => validateSayadId(formData.serialNumber));

  const nationalIdValidation = computed(() =>
    validateNationalId(formData.issuerNationalId, formData.issuerType)
  );

  // Domain Warnings
  const warnings = computed(() => {
    const list: string[] = [];
    if (formData.dueDate) {
      const daysUntilDue = Math.ceil((formData.dueDate - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue < 3 && daysUntilDue >= 0) {
        list.push('سررسید چک بسیار نزدیک است (کمتر از ۳ روز). پیشنهاد می‌شود روش پرداخت امن را انتخاب کنید.');
      } else if (daysUntilDue < 0) {
        list.push('تاریخ سررسید گذشته است. لطفاً تاریخ معتبر وارد نمایید.');
      }
    }
    if (formData.discountRate && formData.discountRate > 25) {
      list.push('نرخ تنزیل پیشنهادی بیش از ۲۵٪ است. این موضوع ممکن است ریسک آگهی را برای خریدار تغییر دهد.');
    }
    if (formData.serialNumber && !sayadValidation.value.isValid) {
      list.push(`شماره صیادی: ${sayadValidation.value.message}`);
    }
    if (formData.issuerNationalId && !nationalIdValidation.value.isValid) {
      list.push(`شناسه/کد ملی صادرکننده: ${nationalIdValidation.value.message}`);
    }
    if (!formData.chequeFrontImage) {
      list.push('تصویر روی چک هنوز بارگذاری نشده است. بارگذاری تصویر چک جهت تأیید کارشناس الزامی است.');
    }
    return list;
  });

  // Step 1 Validation (Cheque Specs & Issuer)
  const isValidStep1 = computed(() => {
    const cleanSayad = toEnglishDigits(formData.serialNumber).trim();
    const cleanNationalId = toEnglishDigits(formData.issuerNationalId).trim();
    const matchedBank = findBankByCode(formData.bank) || findBankByNameOrAlias(formData.bank);
    return (
      cleanSayad.length === 16 &&
      formData.amount !== null && formData.amount >= 1_000_000 &&
      formData.dueDate !== null &&
      formData.dueDate > Date.now() - 86400000 && // not in the deep past
      formData.issuerName.trim().length >= 2 &&
      cleanNationalId.length >= 10 &&
      formData.bank.trim().length > 0 &&
      !!matchedBank
    );
  });

  // Step 2 Validation (Documents)
  const isValidStep2 = computed(() => {
    return formData.chequeFrontImage !== null;
  });

  // Step 3 Validation (Deal Conditions & Pricing)
  const isValidStep3 = computed(() => {
    return (
      formData.discountRate !== null &&
      formData.discountRate >= 0 &&
      formData.settlementMethod.length > 0
    );
  });

  const isFormValid = computed(() => isValidStep1.value && isValidStep2.value && isValidStep3.value);

  // Actions
  async function saveDraft() {
    loading.value = true;
    try {
      formData.status = 'draft';
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
      message.error('لطفاً تمامی مشخصات الزامی چک و تصویر روی چک را کامل و معتبر وارد کنید.');
      return false;
    }

    loading.value = true;
    try {
      formData.status = 'pending_approval';
      
      const cleanSayad = toEnglishDigits(formData.serialNumber).trim();
      const cleanNationalId = toEnglishDigits(formData.issuerNationalId).trim();

      const matchedBank = findBankByCode(formData.bank) || findBankByNameOrAlias(formData.bank);
      if (!matchedBank) {
        message.error('لطفاً بانک عامل معتبر انتخاب نمایید.');
        return false;
      }
      const bankCode = matchedBank.code;

      const newListing = await listingsApi.createListing({
        face_amount: formData.amount || 0,
        due_date: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date().toISOString(),
        bank: bankCode,
        cheque_serial_number: cleanSayad,
        issuer_type: formData.issuerType,
        issuer_name: formData.issuerName,
        issuer_national_id: cleanNationalId,
        suggested_discount_rate: formData.finalRate ? String(formData.finalRate) : (formData.discountRate ? String(formData.discountRate) : null),
        description: `${formData.description} | صادرکننده: ${formData.issuerName} (${formData.issuerType === 'natural' ? 'حقیقی' : 'حقوقی'}) | کدملی: ${cleanNationalId} | خالص دریافتی: ${(formData.finalPrice || formData.netPrice || 0).toLocaleString('fa-IR')} تومان | نرخ پیشنهادی موتور: ${formData.suggestedRate || '-'}٪ | نرخ نهایی: ${formData.finalRate || formData.discountRate || '-'}٪ | روش تسویه: ${formData.settlementMethod}`
      });

      if (newListing?.id) {
        if (formData.chequeFrontImage) {
          try {
            const frontFile = toBlobOrFile(formData.chequeFrontImage, 'cheque_front.png');
            await listingsApi.uploadDocument(newListing.id, 'cheque_image', frontFile);
          } catch (e) {
            console.warn('Document upload warning (cheque_front):', e);
          }
        }
        if (formData.chequeBackImage) {
          try {
            const backFile = toBlobOrFile(formData.chequeBackImage, 'cheque_back.png');
            await listingsApi.uploadDocument(newListing.id, 'cheque_back', backFile);
          } catch (e) {
            console.warn('Document upload warning (cheque_back):', e);
          }
        }
        const contractContent = formData.contractText || formData.contractDoc;
        if (contractContent) {
          try {
            const contractFile = toBlobOrFile(contractContent, 'contract.txt');
            await listingsApi.uploadDocument(newListing.id, 'supplementary', contractFile);
          } catch (e) {
            console.warn('Document upload warning (contract):', e);
          }
        }
      }

      message.success('آگهی ثبت شد و مدارک همراه جهت احراز به صف نظارت ارسال گردید.');
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
    formData.issuerName = '';
    formData.issuerNationalId = '';
    formData.issuerType = 'natural';
    formData.bank = '';
    formData.city = 'تهران';

    formData.chequeFrontImage = null;
    formData.chequeBackImage = null;
    formData.contractDoc = null;
    formData.contractText = '';
    formData.additionalDocs = [];

    formData.discountRate = 25;
    formData.netPrice = null;
    formData.suggestedRate = null;
    formData.suggestedPrice = null;
    formData.finalRate = null;
    formData.finalPrice = null;
    formData.settlementMethod = 'escrow';
    formData.counterpartyRestrictions = '';
    formData.description = '';
    formData.status = 'draft';
  }

  return {
    formData,
    loading,
    warnings,
    sayadValidation,
    nationalIdValidation,
    isValidStep1,
    isValidStep2,
    isValidStep3,
    isFormValid,
    wizardMode: computed(() => uiStore.wizardMode),
    toggleWizardMode: (val: boolean) => uiStore.setWizardMode(val),
    saveDraft,
    publishListing,
    resetForm
  };
}
