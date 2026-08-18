import { describe, it, expect } from 'vitest';
import { validateLeadForm } from './leadCaptureValidator';

describe('validateLeadForm', () => {
  const validPayload = {
    name: 'علی حسینی',
    mobile: '09123456789',
    role: 'دارنده چک',
    note: 'درخواست بررسی و هماهنگی برای پایلوت'
  };

  it('validates a correct payload successfully', () => {
    const res = validateLeadForm(validPayload);
    expect(res.ok).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('accepts valid payload without optional note', () => {
    const res = validateLeadForm({
      name: 'سارا تهرانی',
      mobile: '۰۹۳۵۱۲۳۴۵۶۷',
      role: 'سرمایه‌گذار'
    });
    expect(res.ok).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('fails on empty name', () => {
    const res = validateLeadForm({
      ...validPayload,
      name: ''
    });
    expect(res.ok).toBe(false);
    expect(res.errors.name).toBeTruthy();
  });

  it('fails on short name (< 2 chars)', () => {
    const res = validateLeadForm({
      ...validPayload,
      name: 'ا'
    });
    expect(res.ok).toBe(false);
    expect(res.errors.name).toContain('۲');
  });

  it('fails on overly long name (> 60 chars)', () => {
    const res = validateLeadForm({
      ...validPayload,
      name: 'نام'.repeat(25)
    });
    expect(res.ok).toBe(false);
    expect(res.errors.name).toContain('۶۰');
  });

  it('fails on invalid mobile', () => {
    const res = validateLeadForm({
      ...validPayload,
      mobile: '12345'
    });
    expect(res.ok).toBe(false);
    expect(res.errors.mobile).toBeTruthy();
  });

  it('fails on missing or invalid role', () => {
    const resMissing = validateLeadForm({
      ...validPayload,
      role: ''
    });
    expect(resMissing.ok).toBe(false);
    expect(resMissing.errors.role).toBeTruthy();

    const resInvalid = validateLeadForm({
      ...validPayload,
      role: 'نقش ناشناخته'
    });
    expect(resInvalid.ok).toBe(false);
    expect(resInvalid.errors.role).toBeTruthy();
  });

  it('fails when note exceeds 500 characters', () => {
    const res = validateLeadForm({
      ...validPayload,
      note: 'متن طولانی '.repeat(60) // > 500 chars
    });
    expect(res.ok).toBe(false);
    expect(res.errors.note).toContain('۵۰۰');
  });
});
