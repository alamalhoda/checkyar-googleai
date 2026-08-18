import { isValidIranianMobile } from './iranianMobile';

export interface LeadFormInput {
  name?: string;
  mobile?: string;
  role?: string;
  note?: string;
}

export const VALID_LEAD_ROLES = ['دارنده چک', 'سرمایه‌گذار', 'سایر'] as const;

export function validateLeadForm(input: LeadFormInput): { ok: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Name: required, 2-60 chars after trim
  const trimmedName = (input.name || '').trim();
  if (!trimmedName) {
    errors.name = 'نام الزامی است.';
  } else if (trimmedName.length < 2 || trimmedName.length > 60) {
    errors.name = 'نام باید بین ۲ تا ۶۰ کاراکتر باشد.';
  }

  // Mobile: required, isValidIranianMobile
  const rawMobile = (input.mobile || '').trim();
  if (!rawMobile) {
    errors.mobile = 'شماره موبایل الزامی است.';
  } else if (!isValidIranianMobile(rawMobile)) {
    errors.mobile = 'شماره موبایل نامعتبر است (مثال: ۰۹۱۲۳۴۵۶۷۸۹).';
  }

  // Role: required, exactly one of the valid roles
  const rawRole = (input.role || '').trim();
  if (!rawRole) {
    errors.role = 'انتخاب نقش الزامی است.';
  } else if (!VALID_LEAD_ROLES.includes(rawRole as any)) {
    errors.role = 'نقش انتخاب‌شده نامعتبر است.';
  }

  // Note: optional, max 500 chars
  const trimmedNote = (input.note || '').trim();
  if (trimmedNote && trimmedNote.length > 500) {
    errors.note = 'توضیحات نباید بیش از ۵۰۰ کاراکتر باشد.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors
  };
}
