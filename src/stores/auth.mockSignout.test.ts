import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from './auth';
import { setMockMode } from '../api';

describe('auth store mock sign-out marker transitions', () => {
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
    vi.stubEnv('VITE_USE_MOCK', 'true');
    setMockMode(true);
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('1. Fresh visit auto-seeds demo user in mock mode when marker is absent', () => {
    const authStore = useAuthStore();
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user?.username).toBe('holder1');
    expect(storage['chequeyar_access_token']).toBe('mock-access-token-1');
    expect(storage['chequeyar_mock_signed_out']).toBeUndefined();
  });

  it('2. Logout survives a reload in mock mode (sets marker and does not reseed)', () => {
    const authStore = useAuthStore();
    expect(authStore.isAuthenticated).toBe(true);

    // Explicit logout
    authStore.logout();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(storage['chequeyar_mock_signed_out']).toBe('true');

    // Simulate page reload by creating a fresh store and calling loadUser()
    setActivePinia(createPinia());
    const freshStore = useAuthStore();
    freshStore.loadUser();

    expect(freshStore.isAuthenticated).toBe(false);
    expect(freshStore.user).toBeNull();
    expect(storage['chequeyar_mock_signed_out']).toBe('true');
  });

  it('3. Successful login clears the mock sign-out marker', async () => {
    storage['chequeyar_mock_signed_out'] = 'true';
    const authStore = useAuthStore();
    authStore.loadUser();
    expect(authStore.isAuthenticated).toBe(false);

    // Perform mock login
    await authStore.login({ identifier: 'holder1', password: 'password123' });

    expect(authStore.isAuthenticated).toBe(true);
    expect(storage['chequeyar_mock_signed_out']).toBeUndefined();
  });

  it('4. Live mode (VITE_USE_MOCK=false) never auto-seeds user', () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    setMockMode(false);
    setActivePinia(createPinia());

    const authStore = useAuthStore();
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
  });
});
