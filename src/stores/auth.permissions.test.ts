import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from './auth';

describe('auth store permissions', () => {
  beforeEach(() => {
    const storage: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => { storage[key] = value; },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
    };
    globalThis.localStorage = mockLocalStorage as any;

    setActivePinia(createPinia());
  });

  it('evaluates canAccessModeration correctly based on user role', () => {
    const authStore = useAuthStore();

    authStore.switchRole('check_holder');
    expect(authStore.canAccessModeration).toBe(false);

    authStore.switchRole('investor');
    expect(authStore.canAccessModeration).toBe(false);

    authStore.switchRole('moderator');
    expect(authStore.canAccessModeration).toBe(true);

    authStore.switchRole('admin');
    expect(authStore.canAccessModeration).toBe(true);
  });

  it('evaluates canAccessAdmin correctly based on user role', () => {
    const authStore = useAuthStore();

    authStore.switchRole('check_holder');
    expect(authStore.canAccessAdmin).toBe(false);

    authStore.switchRole('investor');
    expect(authStore.canAccessAdmin).toBe(false);

    authStore.switchRole('moderator');
    expect(authStore.canAccessAdmin).toBe(false);

    authStore.switchRole('admin');
    expect(authStore.canAccessAdmin).toBe(true);
  });
});
