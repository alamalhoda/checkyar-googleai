import { defineStore } from 'pinia';
import { ref } from 'vue';
import { moderationApi, listingsApi, isMock, type ModerationQueueItem, type Verification } from '../../../api';
import { createDiscreteApi, darkTheme } from 'naive-ui';

const { message } = createDiscreteApi(['message'], {
  configProviderProps: { theme: darkTheme }
});

export interface ReviewItemDetails {
  id: number;
  type: string;
  sayadId: string;
  amount: number;
  dueDate: string;
  bank: string;
  city: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  userName: string;
  userPhone: string;
  userTrustScore: number;
  userTradeCount: number;
  userKycStatus: string;
  waitingTime: string;
  documents: { title: string; url: string }[];
  historyEvents: { title: string; date: string }[];
}

export const useModerationStore = defineStore('moderation', () => {
  const loading = ref(false);
  const moderationQueue = ref<ModerationQueueItem[]>([]);
  const kycQueue = ref<Verification[]>([]);
  const currentReviewItem = ref<ReviewItemDetails | null>(null);

  async function fetchModerationQueue() {
    loading.value = true;
    try {
      const res = await moderationApi.getQueue();
      moderationQueue.value = Array.isArray(res) ? res : [];
    } catch (err: any) {
      message.error(err?.message || 'خطا در دریافت صف نظارت');
      moderationQueue.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchKycQueue() {
    loading.value = true;
    try {
      const res = await moderationApi.getKycQueue();
      kycQueue.value = Array.isArray(res) ? res : [];
    } catch (err: any) {
      message.error(err?.message || 'خطا در دریافت صف احراز هویت');
      kycQueue.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchReviewDetails(id: number) {
    loading.value = true;
    try {
      if (!isMock()) {
        const listing = await listingsApi.getListing(id);
        const docs = (listing.documents || []).map((d: any) => ({
          title: d.document_type === 'cheque_image' ? 'تصویر روی چک' :
                 d.document_type === 'cheque_back' ? 'تصویر پشت چک' :
                 d.document_type === 'contract' ? 'قرارداد پشتیبان' : 'مدرک پیوست',
          url: d.file_url || d.file || 'https://placehold.co/600x400/1e293b/fff?text=Doc'
        }));
        if (docs.length === 0) {
          docs.push({ title: 'تصویر روی چک صیادی', url: 'https://placehold.co/600x400/1e293b/fff?text=Cheque+Front' });
        }
        currentReviewItem.value = {
          id: listing.id,
          type: 'چک صیادی',
          sayadId: listing.cheque_serial_number || '۹۸۷۶۵۴۳۲۱۰۱۲۳۴۵۶',
          amount: Number(listing.face_amount) || 0,
          dueDate: listing.due_date ? new Date(listing.due_date).toLocaleDateString('fa-IR') : '۱۴۰۳/۰۸/۱۵',
          bank: listing.bank_name || 'بانک مبدا',
          city: listing.city || 'تهران',
          riskScore: listing.risk_score || 85,
          riskLevel: listing.risk_level || 'low',
          userName: listing.issuer_name || listing.user?.name || 'صادرکننده',
          userPhone: listing.user?.phone || '۰۹۱۲۰۰۰۰۰۰۰',
          userTrustScore: 90,
          userTradeCount: 5,
          userKycStatus: 'approved',
          waitingTime: 'در انتظار بررسی',
          documents: docs,
          historyEvents: [
            { title: 'ثبت آگهی در سامانه', date: new Date(listing.created_at || Date.now()).toLocaleDateString('fa-IR') }
          ]
        };
        return;
      }
      // Mock mode details
      currentReviewItem.value = {
        id,
        type: 'چک صیادی',
        sayadId: '9876543210123456',
        amount: 250000000,
        dueDate: '1403/08/15',
        bank: 'بانک پاسارگاد',
        city: 'تهران',
        riskScore: 82,
        riskLevel: 'low',
        userName: 'محمدرضا کاظمی',
        userPhone: '09121112233',
        userTrustScore: 94,
        userTradeCount: 18,
        userKycStatus: 'approved',
        waitingTime: '۴۵ دقیقه',
        documents: [
          { title: 'تصویر روی چک صیادی', url: 'https://placehold.co/600x400/1e293b/fff?text=Cheque+Front' },
          { title: 'تصویر کارت ملی صاحب حساب', url: 'https://placehold.co/600x400/1e293b/fff?text=ID+Card' }
        ],
        historyEvents: [
          { title: 'ثبت‌نام کاربر در سامانه', date: '۱۴۰۲/۱۱/۱۰' },
          { title: 'تأیید احراز هویت سطح ۲', date: '۱۴۰۲/۱۱/۱۲' },
          { title: 'تکمیل ۵ معامله موفق بدون گزارش خلاف', date: '۱۴۰۳/۰۲/۰۵' }
        ]
      };
    } catch (err: any) {
      message.error(err?.message || 'خطا در بارگذاری جزییات');
    } finally {
      loading.value = false;
    }
  }

  async function submitDecision(id: number, decision: 'approve' | 'reject', reasonCode?: any, note?: string) {
    loading.value = true;
    try {
      await moderationApi.submitDecision(id, {
        decision,
        rejection_code: reasonCode || undefined,
        rejection_note: note
      });
      message.success(decision === 'approve' ? 'آگهی با موفقیت تأیید شد.' : 'آگهی رد شد.');
      return true;
    } catch (err: any) {
      message.error(err?.message || 'خطا در ثبت تصمیم نظارتی');
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    moderationQueue,
    kycQueue,
    currentReviewItem,
    fetchModerationQueue,
    fetchKycQueue,
    fetchReviewDetails,
    submitDecision
  };
});
