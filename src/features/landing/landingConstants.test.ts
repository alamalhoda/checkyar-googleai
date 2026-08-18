import { describe, it, expect } from 'vitest';
import { DOCUMENT_TITLE, META_DESCRIPTION } from './constants';

describe('Landing page constants & Persian typography / ZWNJ integrity', () => {
  it('DOCUMENT_TITLE contains zero-width non-joiner (U+200C)', () => {
    expect(DOCUMENT_TITLE.includes('\u200c')).toBe(true);
    // Count occurrences of ZWNJ in DOCUMENT_TITLE (چک‌[1]یار, چک‌[2]های, مدت‌[3]دار)
    const zwnjCount = (DOCUMENT_TITLE.match(/\u200c/g) || []).length;
    expect(zwnjCount).toBeGreaterThanOrEqual(3);
  });

  it('META_DESCRIPTION contains zero-width non-joiner (U+200C)', () => {
    expect(META_DESCRIPTION.includes('\u200c')).toBe(true);
    // Count occurrences of ZWNJ in META_DESCRIPTION
    const zwnjCount = (META_DESCRIPTION.match(/\u200c/g) || []).length;
    expect(zwnjCount).toBeGreaterThanOrEqual(3);
  });

  it('matches the exact expected canonical text with zero-width non-joiners intact', () => {
    expect(DOCUMENT_TITLE).toBe('چک\u200cیار | سکوی دیجیتال کشف و اتصال در بازار نقدشوندگی چک\u200cهای مدت\u200cدار');
    expect(META_DESCRIPTION).toBe('چک\u200cیار سکوی دیجیتال کشف و اتصال در بازار نقدشوندگی چک\u200cهای مدت\u200cدار است؛ واسط فناورانه، نه نهاد مالی.');
  });
});
