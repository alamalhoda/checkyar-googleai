import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useBackendSimulatorStore } from '../stores/useBackendSimulatorStore';

let useMock = localStorage.getItem('chequeyar_use_mock') !== 'false';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getMockMode(): boolean {
  return useMock;
}

export function setMockMode(enabled: boolean) {
  useMock = enabled;
  localStorage.setItem('chequeyar_use_mock', enabled ? 'true' : 'false');
}

// Request Interceptor: Attach Token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('chequeyar_access_token');
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
    if (!useMock) {
      return Promise.reject(error);
    }

    // Process Mock Requests intercepted before network call or on error
    const config = error.config as InternalAxiosRequestConfig;
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
);

// Adapter for mock requests execution
async function handleMockRequest(config: InternalAxiosRequestConfig): Promise<any> {
  const simulator = useBackendSimulatorStore();
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
  const params = config.params || {};

  // Extract current user ID from token or default
  const userJson = localStorage.getItem('chequeyar_auth_user');
  const currentUser = userJson ? JSON.parse(userJson) : { id: 1 };

  // Auth Endpoints
  if (url.includes('/auth/login') && method === 'post') {
    return simulator.handleLogin(body);
  }
  if (url.includes('/auth/register') && method === 'post') {
    return simulator.handleRegister(body);
  }

  // Marketplace
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
