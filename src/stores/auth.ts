import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginRequest, RegisterRequest } from '../types/api';
import { api, authApi, setMockMode } from '../api';

const TOKEN_KEY = 'chequeyar_access_token';
const REFRESH_KEY = 'chequeyar_refresh_token';
const USER_KEY = 'chequeyar_auth_user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const access = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const refresh = ref<string | null>(localStorage.getItem(REFRESH_KEY));
  const isMock = ref<boolean>(import.meta.env.VITE_USE_MOCK !== 'false');

  const isAuthenticated = computed(() => !!access.value && !!user.value);
  const userRole = computed(() => user.value?.role || 'check_holder');

  const canAccessModeration = computed(() => {
    return user.value?.role === 'moderator' || user.value?.role === 'admin';
  });

  const canAccessAdmin = computed(() => {
    return user.value?.role === 'admin';
  });

  function setTokens(accessToken: string, refreshToken: string) {
    access.value = accessToken;
    refresh.value = refreshToken;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  function setUser(userData: User) {
    user.value = userData;
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }

  function loadSavedUser() {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) {
        user.value = JSON.parse(savedUser);
      } else {
        // Default seed user fallback for instant demo
        user.value = {
          id: 1,
          username: 'holder1',
          email: 'holder@chequeyar.ir',
          name: 'رضا صبوری (دارنده چک)',
          phone: '09121111111',
          role: 'check_holder',
          is_verified: true
        };
        access.value = 'mock-access-token-1';
        localStorage.setItem(TOKEN_KEY, 'mock-access-token-1');
        localStorage.setItem(USER_KEY, JSON.stringify(user.value));
      }
    } catch (e) {
      user.value = null;
    }
  }

  async function login(credentials: LoginRequest) {
    const res = await authApi.login(credentials);
    setTokens(res.access, res.refresh);
    const u: User = {
      id: res.user.id,
      username: res.user.username,
      email: res.user.email,
      name: res.user.name,
      role: res.user.role || 'check_holder',
      is_verified: true
    };
    setUser(u);
    return res;
  }

  async function register(data: RegisterRequest) {
    const res = await authApi.register(data);
    setTokens(res.access, res.refresh);
    const u: User = {
      id: res.user.id,
      username: res.user.username,
      email: res.user.email,
      name: res.user.name,
      role: res.user.role,
      is_verified: false
    };
    setUser(u);
    return res;
  }

  async function refreshToken() {
    if (!refresh.value) return;
    const res = await authApi.refreshToken({ refresh: refresh.value });
    setTokens(res.access, res.refresh);
  }

  function logout() {
    user.value = null;
    access.value = null;
    refresh.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function switchRole(role: User['role']) {
    if (!user.value) return;
    user.value.role = role;
    if (role === 'check_holder') user.value.name = 'رضا صبوری (دارنده چک)';
    else if (role === 'investor') user.value.name = 'سرمایه‌گذاری نوین (سرمایه‌گذار)';
    else if (role === 'moderator') user.value.name = 'علی حسینی (ناظر)';
    else if (role === 'admin') user.value.name = 'مدیر سامانه چک‌یار';

    localStorage.setItem(USER_KEY, JSON.stringify(user.value));
  }

  // Load initial user state
  loadSavedUser();

  return {
    user,
    access,
    refresh,
    isMock,
    isAuthenticated,
    userRole,
    canAccessModeration,
    canAccessAdmin,
    login,
    register,
    refreshToken,
    logout,
    switchRole,
    loadUser: loadSavedUser
  };
});
