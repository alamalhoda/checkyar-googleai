import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { matchesApi, type Match } from '../../../api';
import { message } from '../../../utils/discreteApi';

export interface ProposalItem {
  id: number;
  senderName: string;
  senderRole: 'buyer' | 'seller';
  amount: number;
  discountRate: number;
  settlementMethod: string;
  note?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
}

export interface MatchDetailsData {
  id: number;
  listingId: number;
  listingSerial: string;
  listingBank: string;
  listingOriginalAmount: number;
  counterpartyName: string;
  counterpartyPhone: string;
  status: string;
  proposals: ProposalItem[];
}

export const useMatchesStore = defineStore('matches', () => {
  const loading = ref(false);
  const currentMatch = ref<MatchDetailsData | null>(null);

  const dealFormState = reactive({
    amount: null as number | null,
    discountRate: 5 as number,
    settlementMethod: 'escrow',
    note: ''
  });

  async function fetchMatchDetails(matchId: number) {
    loading.value = true;
    try {
      // Calls standard API layer (Mock Simulator or REST API)
      const resMatches = await matchesApi.getMyMatches();
      const matches: Match[] = Array.isArray(resMatches) ? resMatches : [];
      const res: Match = matches.find(m => m.id === matchId) || matches[0];
      const counterparty = res ? (res.investor?.name ? res.investor : res.check_holder) : { name: 'علی رضایی', phone: '09123456789' };

      currentMatch.value = {
        id: res?.id || matchId,
        listingId: res?.listing?.id || 1,
        listingSerial: '1234567890123456',
        listingBank: res?.listing?.bank_name || 'بانک ملت',
        listingOriginalAmount: res?.listing?.face_amount ? Number(res.listing.face_amount) : 100000000,
        counterpartyName: counterparty?.name || 'علی رضایی',
        counterpartyPhone: counterparty?.phone || '09123456789',
        status: res?.status || 'pending',
        proposals: [
          {
            id: 101,
            senderName: counterparty?.name || 'علی رضایی',
            senderRole: 'buyer',
            amount: res?.listing?.face_amount ? Number(res.listing.face_amount) * 0.95 : 95000000,
            discountRate: res?.final_discount_rate ? Number(res.final_discount_rate) : 5,
            settlementMethod: res?.settlement_type || 'escrow',
            note: res?.terms || res?.message || 'پیشنهاد اولیه خرید با تسویه امن',
            createdAt: res?.created_at || new Date().toISOString(),
            status: 'pending'
          }
        ]
      };

      // Prefill deal form
      dealFormState.amount = currentMatch.value.proposals[0]?.amount || currentMatch.value.listingOriginalAmount * 0.95;
      dealFormState.discountRate = currentMatch.value.proposals[0]?.discountRate || 5;
      dealFormState.settlementMethod = currentMatch.value.proposals[0]?.settlementMethod || 'escrow';
    } catch (err: any) {
      message.error(err?.message || 'خطا در دریافت اطلاعات گفتگوی معامله');
    } finally {
      loading.value = false;
    }
  }

  async function sendProposal(data: { amount: number; discountRate: number; settlementMethod: string; note?: string }) {
    if (!currentMatch.value) return false;
    loading.value = true;
    try {
      const newProposal: ProposalItem = {
        id: Date.now(),
        senderName: 'شما (فروشنده/خریدار)',
        senderRole: 'seller',
        amount: data.amount,
        discountRate: data.discountRate,
        settlementMethod: data.settlementMethod,
        note: data.note,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      currentMatch.value.proposals.unshift(newProposal);
      message.success('پیشنهاد با موفقیت ارسال شد.');
      return true;
    } catch (err: any) {
      message.error(err?.message || 'خطا در ثبت پیشنهاد جدید');
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function acceptProposal(proposalId: number) {
    if (!currentMatch.value) return;
    loading.value = true;
    try {
      await matchesApi.acceptMatch(currentMatch.value.id);
      const prop = currentMatch.value.proposals.find(p => p.id === proposalId);
      if (prop) prop.status = 'accepted';
      currentMatch.value.status = 'accepted';
      message.success('پیشنهاد پذیرفته شد و معامله وارد مرحله تسویه گردید.');
    } catch (err: any) {
      message.error(err?.message || 'خطا در پذیرش پیشنهاد');
    } finally {
      loading.value = false;
    }
  }

  async function rejectProposal(proposalId: number, reason?: string) {
    if (!currentMatch.value) return;
    loading.value = true;
    try {
      await matchesApi.declineMatch(currentMatch.value.id, reason);
      const prop = currentMatch.value.proposals.find(p => p.id === proposalId);
      if (prop) prop.status = 'rejected';
      message.info('پیشنهاد رد شد.');
    } catch (err: any) {
      message.error(err?.message || 'خطا در رد پیشنهاد');
    } finally {
      loading.value = false;
    }
  }

  function fillCounterOffer(proposal: ProposalItem) {
    dealFormState.amount = proposal.amount;
    dealFormState.discountRate = proposal.discountRate;
    dealFormState.settlementMethod = proposal.settlementMethod;
    dealFormState.note = `پاسخ متقابل به پیشنهاد #${proposal.id}`;
  }

  return {
    loading,
    currentMatch,
    dealFormState,
    fetchMatchDetails,
    sendProposal,
    acceptProposal,
    rejectProposal,
    fillCounterOffer
  };
});
