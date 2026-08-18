export interface ContactFormInput {
  name?: string;
  email?: string;
  message?: string;
}

export function validateContactForm(input: ContactFormInput): { ok: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Name: required, 2-60 chars
  const trimmedName = (input.name || '').trim();
  if (!trimmedName) {
    errors.name = 'نام الزامی است.';
  } else if (trimmedName.length < 2 || trimmedName.length > 60) {
    errors.name = 'نام باید بین ۲ تا ۶۰ کاراکتر باشد.';
  }

  // Email: required, /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const trimmedEmail = (input.email || '').trim();
  if (!trimmedEmail) {
    errors.email = 'ایمیل الزامی است.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'ایمیل وارد شده معتبر نیست.';
  }

  // Message: required, 10-500 chars
  const trimmedMessage = (input.message || '').trim();
  if (!trimmedMessage) {
    errors.message = 'متن پیام الزامی است.';
  } else if (trimmedMessage.length < 10 || trimmedMessage.length > 500) {
    errors.message = 'متن پیام باید بین ۱۰ تا ۵۰۰ کاراکتر باشد.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors
  };
}
