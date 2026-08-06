import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getMockMode, setMockMode, isMockEnvEnabled } from './client';

describe('api client mock mode env gate', () => {
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
    vi.unstubAllEnvs();
  });

  it('returns false for getMockMode and isMockEnvEnabled when VITE_USE_MOCK is not true', () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');

    expect(isMockEnvEnabled()).toBe(false);
    expect(getMockMode()).toBe(false);
  });

  it('prevents setMockMode(true) from enabling mock when VITE_USE_MOCK is false', () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');

    setMockMode(true);

    expect(getMockMode()).toBe(false);
    expect(storage['chequeyar_use_mock']).toBeUndefined();
  });

  it('ignores leftover localStorage chequeyar_use_mock=true when VITE_USE_MOCK is false', () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    storage['chequeyar_use_mock'] = 'true';

    expect(getMockMode()).toBe(false);
  });

  it('allows mock mode when VITE_USE_MOCK is explicitly true', () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');

    expect(isMockEnvEnabled()).toBe(true);

    setMockMode(true);
    expect(getMockMode()).toBe(true);

    setMockMode(false);
    expect(getMockMode()).toBe(false);
  });
});
