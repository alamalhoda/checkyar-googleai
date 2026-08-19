import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useBackendSimulatorStore } from '../stores/useBackendSimulatorStore';

function safeGetStorage(key: string): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}

function safeSetStorage(key: string, value: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export function isMockEnvEnabled(): boolean {
  return String(import.meta.env.VITE_USE_MOCK) === 'true';
}

// Default to mock mode ONLY when VITE_USE_MOCK is exactly 'true' and localStorage is not explicitly 'false'
let useMock = isMockEnvEnabled() && safeGetStorage('chequeyar_use_mock') !== 'false';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getMockMode(): boolean {
  if (!isMockEnvEnabled()) {
    return false;
  }
  return useMock;
}

export function setMockMode(enabled: boolean) {
  if (!isMockEnvEnabled()) {
    useMock = false;
    return;
  }
  useMock = enabled;
  safeSetStorage('chequeyar_use_mock', enabled ? 'true' : 'false');
}

// Request Interceptor: Attach Token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = safeGetStorage('chequeyar_access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Mock Simulator Router
api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const config = error.config as InternalAxiosRequestConfig;
    
    // If mock mode is explicitly on OR if network error occurs when mock env is enabled
    const isNetworkError = error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response;
    if (getMockMode() || (isMockEnvEnabled() && isNetworkError)) {
      if (!config) return Promise.reject(error);
      try {
        const mockResult = await handleMockRequest(config);
        return {
          data: mockResult,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        };
      } catch (err: any) {
        return Promise.reject({
          response: {
            status: err?.error?.code === 'AUTHENTICATION_ERROR' ? 401 : 400,
            data: err
          }
        });
      }
    }

    return Promise.reject(error);
  }
);

// Adapter for mock requests execution
async function handleMockRequest(config: InternalAxiosRequestConfig): Promise<any> {
  const simulator = useBackendSimulatorStore();
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
  const params = config.params || {};

  // Extract current user ID from token or default
  const userJson = safeGetStorage('chequeyar_auth_user');
  const currentUser = userJson ? JSON.parse(userJson) : { id: 1 };

  // Auth & Identity Endpoints
  if (url.includes('/auth/login') && method === 'post') {
    return simulator.handleLogin(body);
  }
  if ((url.includes('/auth/register') || url.includes('/identity/register')) && method === 'post') {
    return simulator.handleRegister(body);
  }
  if (url.includes('/identity/profile')) {
    const userId = currentUser.id || 1;
    if (method === 'get') {
      return simulator.profiles[userId] || simulator.profiles[1];
    }
    if (method === 'patch' || method === 'put') {
      if (simulator.profiles[userId]) {
        Object.assign(simulator.profiles[userId], body, { updated_at: new Date().toISOString() });
      }
      return simulator.profiles[userId] || simulator.profiles[1];
    }
  }
  if ((url.includes('/verifications') || url.includes('/identity/verifications')) && method === 'post') {
    return simulator.createVerification(body);
  }

  // Banks Catalog
  if ((url.endsWith('/banks') || url.endsWith('/banks/') || url.includes('/banks/')) && method === 'get') {
    return simulator.listBanks();
  }

  // Marketplace
  if (url.includes('/marketplace/listings/latest') && method === 'get') {
    return simulator.getMarketplaceListings({ page_size: 4 }).results;
  }
  if (url.includes('/marketplace/listings') && method === 'get') {
    return simulator.getMarketplaceListings(params);
  }

  // My Listings
  if (url.includes('/listings/my') && method === 'get') {
    return simulator.getMyListings(currentUser.id);
  }
  if (url.endsWith('/listings') && method === 'post') {
    return simulator.createListing(currentUser.id, body);
  }
  if (url.match(/\/listings\/\d+$/) && method === 'get') {
    const id = Number(url.split('/').pop());
    return simulator.getListingById(id);
  }
  if (url.match(/\/listings\/\d+$/) && (method === 'put' || method === 'patch')) {
    const id = Number(url.split('/').pop());
    return simulator.updateListing(currentUser.id, id, body);
  }

  // Matches
  if (url.includes('/matches/my') && method === 'get') {
    return simulator.getMyMatches(currentUser.id);
  }
  if (url.endsWith('/matches') && method === 'post') {
    return simulator.createMatch(currentUser.id, body);
  }
  if (url.match(/\/matches\/\d+\/status$/) && (method === 'post' || method === 'patch')) {
    const parts = url.split('/');
    const matchId = Number(parts[parts.length - 2]);
    return simulator.updateMatchStatus(matchId, body);
  }

  // Moderation
  if (url.includes('/moderation/queue') && method === 'get') {
    return simulator.getModerationQueue();
  }
  if (url.match(/\/moderation\/listings\/\d+\/decision$/) && method === 'post') {
    const parts = url.split('/');
    const listingId = Number(parts[parts.length - 2]);
    return simulator.handleModerationDecision(listingId, currentUser.id, body);
  }
  if (url.match(/\/moderation\/(\d+|listings\/\d+)\/resubmit$/) && method === 'post') {
    const parts = url.split('/');
    const listingId = Number(parts[parts.length - 2]);
    return simulator.resubmitListing(listingId);
  }
  if (url.includes('/moderation/kyc') && method === 'get') {
    return simulator.getKycQueue();
  }

  // Admin & Compliance
  if ((url.includes('/admin/stats') || url.includes('/compliance/stats')) && method === 'get') {
    return simulator.getAdminStats();
  }
  if ((url.includes('/admin/feature-flags') || url.includes('/compliance/feature-flags')) && method === 'get') {
    return simulator.featureFlags;
  }
  if (url.match(/\/(admin|compliance)\/feature-flags\/[^\/]+\/toggle$/) && method === 'post') {
    const parts = url.split('/');
    const flagKey = parts[parts.length - 2];
    simulator.toggleFeatureFlag(flagKey);
    return { status: 'success' };
  }
  if ((url.includes('/admin/audit') || url.includes('/compliance/audit')) && method === 'get') {
    return simulator.getAuditEvents(params);
  }

  // Notifications
  if (url.includes('/notifications') && method === 'get') {
    return simulator.notifications;
  }

  // Fallback direct simulator call
  return { status: 'success' };
}
