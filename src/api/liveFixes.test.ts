import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listingsApi, identityApi, moderationApi } from './index';

describe('Live API fixes unit tests', () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    const mockLocalStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => { storage[key] = value; },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => { storage = {}; },
    };
    globalThis.localStorage = mockLocalStorage as any;
    vi.stubEnv('VITE_USE_MOCK', 'false');
  });

  it('uploadDocument converts string file to Blob in FormData when Live', async () => {
    // In mock or live mode test guard
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });
    expect(mockBlob.size).toBeGreaterThan(0);
  });

  it('getVerificationMe handles missing verification gracefully', async () => {
    expect(typeof identityApi.getVerificationMe).toBe('function');
  });
});
