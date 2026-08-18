import { describe, it, expect } from 'vitest';
import { validateContactForm } from './contactValidator';

describe('validateContactForm', () => {
  const validPayload = {
    name: 'مهدی رضایی',
    email: 'mehdi@example.com',
    message: 'این یک پیام تستی با طول مناسب جهت تست فرم تماس است.'
  };

  it('validates a correct payload successfully', () => {
    const res = validateContactForm(validPayload);
    expect(res.ok).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('fails on empty or short name (< 2 chars)', () => {
    const resEmpty = validateContactForm({ ...validPayload, name: '' });
    expect(resEmpty.ok).toBe(false);
    expect(resEmpty.errors.name).toBeTruthy();

    const resShort = validateContactForm({ ...validPayload, name: 'م' });
    expect(resShort.ok).toBe(false);
    expect(resShort.errors.name).toContain('۲');
  });

  it('fails on invalid email format', () => {
    const resInvalid = validateContactForm({ ...validPayload, email: 'not-an-email' });
    expect(resInvalid.ok).toBe(false);
    expect(resInvalid.errors.email).toBeTruthy();

    const resEmpty = validateContactForm({ ...validPayload, email: '' });
    expect(resEmpty.ok).toBe(false);
    expect(resEmpty.errors.email).toBeTruthy();
  });

  it('fails on empty or short message (< 10 chars)', () => {
    const resEmpty = validateContactForm({ ...validPayload, message: '' });
    expect(resEmpty.ok).toBe(false);
    expect(resEmpty.errors.message).toBeTruthy();

    const resShort = validateContactForm({ ...validPayload, message: 'سلام' });
    expect(resShort.ok).toBe(false);
    expect(resShort.errors.message).toContain('۱۰');
  });

  it('fails on overly long message (> 500 chars)', () => {
    const resLong = validateContactForm({ ...validPayload, message: 'پیام تستی '.repeat(60) });
    expect(resLong.ok).toBe(false);
    expect(resLong.errors.message).toContain('۵۰۰');
  });
});
