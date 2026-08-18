import { describe, it, expect } from 'vitest';
import { maskDisplayName } from './maskDisplayName';

describe('maskDisplayName utility', () => {
  it('handles empty, null, undefined, and whitespace inputs', () => {
    expect(maskDisplayName('')).toBe('');
    expect(maskDisplayName(null)).toBe('');
    expect(maskDisplayName(undefined)).toBe('');
    expect(maskDisplayName('   ')).toBe('');
  });

  it('handles single word names without truncation', () => {
    expect(maskDisplayName('علی')).toBe('علی');
    expect(maskDisplayName('شرکت')).toBe('شرکت');
    expect(maskDisplayName('سرمایه‌گذار')).toBe('سرمایه‌گذار');
  });

  it('handles company names with "شرکت" prefix', () => {
    expect(maskDisplayName('شرکت پارس')).toBe('شرکت پارس');
    expect(maskDisplayName('شرکت پارس گستر جنوب')).toBe('شرکت پارس …');
    expect(maskDisplayName('شرکت صنایع پتروشیمی خلیج فارس')).toBe('شرکت صنایع …');
  });

  it('masks multi-word personal or other names to first word + ellipsis', () => {
    expect(maskDisplayName('علی محمدی')).toBe('علی …');
    expect(maskDisplayName('محمدرضا حسینی مقدم')).toBe('محمدرضا …');
    expect(maskDisplayName('بازرگانی نوین شرق')).toBe('بازرگانی …');
  });
});
