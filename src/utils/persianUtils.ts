/**
 * Helper utility for Persian numbers, Sayad ID, and National ID validations
 */

// Convert digits to Persian numbers
export function toPersianDigits(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

// Convert Farsi digits to English numbers
export function toEnglishDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

// Validate Sayad 16-digit ID
export function validateSayadId(sayadId: string): { isValid: boolean; message: string } {
  const cleaned = toEnglishDigits(sayadId).trim();
  if (!cleaned) {
    return { isValid: false, message: 'وارد کردن شماره صیادی الزامی است.' };
  }
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, message: 'شماره صیادی باید فقط شامل اعداد باشد.' };
  }
  if (cleaned.length !== 16) {
    return { isValid: false, message: `شماره صیادی باید دقیقاً ۱۶ رقم باشد (${cleaned.length} رقم وارد شده).` };
  }
  return { isValid: true, message: 'شماره صیادی معتبر است.' };
}

// Validate Iranian National ID (10 digits for Natural, 11 digits for Legal)
export function validateNationalId(code: string, type: 'natural' | 'legal' = 'natural'): { isValid: boolean; message: string } {
  const cleaned = toEnglishDigits(code).trim();
  if (!cleaned) {
    return { isValid: false, message: 'کد/شناسه ملی الزامی است.' };
  }
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, message: 'کد ملی باید فقط شامل عدد باشد.' };
  }

  if (type === 'natural') {
    if (cleaned.length !== 10) {
      return { isValid: false, message: 'کد ملی شخص حقیقی باید ۱۰ رقم باشد.' };
    }
    // Basic checksum algorithm for Iranian National Code
    const check = parseInt(cleaned[9], 10);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i], 10) * (10 - i);
    }
    const remainder = sum % 11;
    const isValid = (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
    if (!isValid) {
      return { isValid: false, message: 'کد ملی وارد شده طبق الگوریتم ثبت احوال معتبر نیست.' };
    }
  } else {
    if (cleaned.length !== 11) {
      return { isValid: false, message: 'شناسه ملی شخص حقوقی باید ۱۱ رقم باشد.' };
    }
  }

  return { isValid: true, message: 'کد/شناسه ملی معتبر است.' };
}

// Convert Number to Persian Words for currency display (Toman)
export function amountToPersianWords(amountInToman: number | null): string {
  if (!amountInToman || amountInToman <= 0) return '';

  const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  const dahta = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
  const dahgan = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  const صدگان = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
  const steps = ['', ' هزار', ' میلیون', ' میلیارد', ' تریلیون'];

  function convertThreeDigits(num: number): string {
    if (num === 0) return '';
    const parts: string[] = [];

    const s = Math.floor(num / 100);
    const d = Math.floor((num % 100) / 10);
    const y = num % 10;

    if (s > 0) parts.push(صدگان[s]);

    if (d === 1) {
      parts.push(dahta[y]);
    } else {
      if (d > 1) parts.push(dahgan[d]);
      if (y > 0) parts.push(yekan[y]);
    }

    return parts.join(' و ');
  }

  let num = Math.floor(amountInToman);
  if (num === 0) return 'صفر تومان';

  const result: string[] = [];
  let stepIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkText = convertThreeDigits(chunk);
      result.unshift(chunkText + steps[stepIndex]);
    }
    num = Math.floor(num / 1000);
    stepIndex++;
  }

  return result.join(' و ') + ' تومان';
}

// Get Current Jalali Year in Persian Digits
export function getCurrentJalaliYear(date: Date = new Date()): string {
  try {
    const formatted = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(date);
    const digits = formatted.replace(/[^\d۰-۹]/g, '');
    return toPersianDigits(toEnglishDigits(digits));
  } catch {
    return '۱۴۰۵';
  }
}

// Format Toman from Rial amount (divide by 10, floor, Persian digits + separators, no currency word)
export function formatTomanFromRial(amount: string | number): string {
  const cleaned = typeof amount === 'number' ? amount : parseFloat(toEnglishDigits(String(amount).replace(/,/g, '').trim()));
  if (isNaN(cleaned) || cleaned < 0) return '۰';
  const toman = Math.floor(cleaned / 10);
  return toman.toLocaleString('fa-IR');
}

// Format ISO date (YYYY-MM-DD) to Jalali display date. Returns empty string on invalid/garbage input, never throws.
export function formatJalaliDate(isoDate: string): string {
  if (!isoDate || typeof isoDate !== 'string') return '';
  try {
    const d = new Date(isoDate.trim());
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  } catch {
    return '';
  }
}

