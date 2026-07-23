import { api, setMockMode, getMockMode } from './client';
import { useBackendSimulatorStore } from '../stores/useBackendSimulatorStore';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  Profile,
  ChequeListing,
  CreateListingRequest,
  UpdateListingRequest,
  ListingFilters,
  MarketplaceListing,
  PaginatedResponse,
  Match,
  CreateMatchRequest,
  UpdateMatchStatusRequest,
  ModerationQueueItem,
  ModerationDecisionRequest,
  ModerationDecisionResponse,
  Notification,
  NotificationPreferences,
  Verification,
  CreateVerificationRequest,
  FeatureFlag,
  AuditEvent,
  AdminDashboardStats
} from '../types/api';

export { api, setMockMode, getMockMode };
export const isMock = () => getMockMode();

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (isMock()) return useBackendSimulatorStore().handleLogin(data);
    const res = await api.post('/auth/login/', data);
    return res.data;
  },
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    if (isMock()) return useBackendSimulatorStore().handleRegister(data);
    const res = await api.post('/auth/register/', data);
    return res.data;
  },
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    if (isMock()) {
      return {
        access: `mock-access-token-refreshed-${Date.now()}`,
        refresh: data.refresh,
        user: { id: 1, username: 'holder1', email: 'holder@chequeyar.ir', name: 'رضا صبوری', role: 'check_holder' }
      };
    }
    const res = await api.post('/auth/refresh/', data);
    return res.data;
  }
};

export const identityApi = {
  getProfile: async (): Promise<Profile> => {
    if (isMock()) return useBackendSimulatorStore().profiles[1];
    const res = await api.get('/identity/me/');
    return res.data;
  },
  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    if (isMock()) {
      const p = useBackendSimulatorStore().profiles[1];
      Object.assign(p, data);
      return p;
    }
    const res = await api.patch('/identity/me/', data);
    return res.data;
  },
  createVerification: async (data: CreateVerificationRequest): Promise<Verification> => {
    if (isMock()) {
      const store = useBackendSimulatorStore();
      const newV: Verification = {
        id: Date.now(),
        full_name: data.full_name,
        national_id: data.national_id || '0011223344',
        company_name: data.company_name || '',
        status: 'pending',
        rejection_reason: '',
        rejection_code: '',
        documents: []
      };
      store.verifications.unshift(newV);
      return newV;
    }
    const res = await api.post('/identity/verifications/', data);
    return res.data;
  }
};

export const marketplaceApi = {
  getListings: async (filters: ListingFilters): Promise<PaginatedResponse<MarketplaceListing>> => {
    if (isMock()) return useBackendSimulatorStore().getMarketplaceListings(filters);
    const res = await api.get('/marketplace/listings/', { params: filters });
    return res.data;
  },
  getLatestListings: async (): Promise<MarketplaceListing[]> => {
    if (isMock()) {
      const res = useBackendSimulatorStore().getMarketplaceListings({ page_size: 4 });
      return res.results;
    }
    const res = await api.get('/marketplace/listings/latest/');
    return res.data;
  },
  getListingDetail: async (id: number): Promise<MarketplaceListing> => {
    if (isMock()) {
      const l = useBackendSimulatorStore().getListingById(id);
      return {
        ...l,
        days_to_due: 30,
        interest_count: 2,
        published_at: l.updated_at
      };
    }
    const res = await api.get(`/marketplace/listings/${id}/`);
    return res.data;
  }
};

export const usersApi = {
  getMe: async () => {
    if (isMock()) {
      const u = useBackendSimulatorStore().users[0];
      return {
        id: u.id,
        username: u.username,
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role,
        is_verified: u.is_verified,
        created_at: u.created_at,
        updated_at: u.updated_at
      };
    }
    const res = await api.get('/users/me/');
    return res.data;
  },
  updateMe: async (data: Partial<{ name: string; email: string; phone: string; role: 'check_holder' | 'investor' }>) => {
    if (isMock()) {
      const u = useBackendSimulatorStore().users[0];
      if (data.name) u.name = data.name;
      if (data.email) u.email = data.email;
      if (data.phone) u.phone = data.phone;
      if (data.role) u.role = data.role;
      return u;
    }
    const res = await api.patch('/users/me/', data);
    return res.data;
  }
};

export const listingsApi = {
  getMyListings: async (): Promise<ChequeListing[]> => {
    if (isMock()) return useBackendSimulatorStore().getMyListings(1);
    const res = await api.get('/listings/my/');
    return res.data;
  },
  getListing: async (id: number): Promise<ChequeListing> => {
    if (isMock()) return useBackendSimulatorStore().getListingById(id);
    const res = await api.get(`/listings/${id}/`);
    return res.data;
  },
  createListing: async (data: CreateListingRequest): Promise<ChequeListing> => {
    if (isMock()) return useBackendSimulatorStore().createListing(1, data);
    const res = await api.post('/listings/', data);
    return res.data;
  },
  updateListing: async (id: number, data: UpdateListingRequest): Promise<ChequeListing> => {
    if (isMock()) return useBackendSimulatorStore().updateListing(1, id, data);
    const res = await api.patch(`/listings/${id}/`, data);
    return res.data;
  },
  uploadDocument: async (id: number, documentType: string, fileName: string): Promise<any> => {
    if (isMock()) return useBackendSimulatorStore().uploadDocument(id, documentType, fileName);
    const formData = new FormData();
    formData.append('document_type', documentType);
    const res = await api.post(`/listings/${id}/documents/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  resubmitListing: async (id: number): Promise<ChequeListing> => {
    if (isMock()) return useBackendSimulatorStore().resubmitListing(id);
    const res = await api.post(`/moderation/listings/${id}/resubmit/`);
    return res.data;
  }
};

export const matchesApi = {
  getMyMatches: async (): Promise<Match[]> => {
    if (isMock()) {
      const store = useBackendSimulatorStore();
      const currentUserId = Number(localStorage.getItem('user_id')) || 1;
      return store.getMyMatches(currentUserId);
    }
    const res = await api.get('/matches/my/');
    return res.data;
  },
  createMatch: async (data: CreateMatchRequest): Promise<Match> => {
    if (isMock()) {
      const currentUserId = Number(localStorage.getItem('user_id')) || 2;
      return useBackendSimulatorStore().createMatch(currentUserId, data);
    }
    const res = await api.post('/matches/', data);
    return res.data;
  },
  updateStatus: async (matchId: number, data: UpdateMatchStatusRequest): Promise<Match> => {
    if (isMock()) return useBackendSimulatorStore().updateMatchStatus(matchId, data);
    const res = await api.patch(`/matches/${matchId}/status/`, data);
    return res.data;
  },
  acceptMatch: async (matchId: number): Promise<Match> => {
    if (isMock()) return useBackendSimulatorStore().updateMatchStatus(matchId, { status: 'accepted' });
    const res = await api.post(`/matches/${matchId}/accept/`);
    return res.data;
  },
  declineMatch: async (matchId: number, note?: string): Promise<Match> => {
    if (isMock()) return useBackendSimulatorStore().updateMatchStatus(matchId, { status: 'declined', terms: note });
    const res = await api.post(`/matches/${matchId}/decline/`, { note });
    return res.data;
  },
  cancelMatch: async (matchId: number): Promise<Match> => {
    if (isMock()) return useBackendSimulatorStore().updateMatchStatus(matchId, { status: 'cancelled' });
    const res = await api.post(`/matches/${matchId}/cancel/`);
    return res.data;
  },
  confirmOffPlatform: async (matchId: number): Promise<Match> => {
    if (isMock()) return useBackendSimulatorStore().updateMatchStatus(matchId, { status: 'off_platform_confirmed' });
    const res = await api.post(`/matches/${matchId}/confirm-off-platform/`);
    return res.data;
  }
};

export const notificationsApi = {
  getNotifications: async (filters?: { type?: string; status?: string; page?: number; page_size?: number }): Promise<PaginatedResponse<Notification>> => {
    if (isMock()) return useBackendSimulatorStore().getNotifications(filters);
    const res = await api.get('/notifications/', { params: filters });
    return res.data;
  },
  markAsRead: async (id: number): Promise<Notification> => {
    if (isMock()) return useBackendSimulatorStore().markNotificationRead(id);
    const res = await api.patch(`/notifications/${id}/`, { is_read: true });
    return res.data;
  },
  markAllRead: async (): Promise<void> => {
    if (isMock()) return useBackendSimulatorStore().markAllNotificationsRead();
    await api.post('/notifications/mark-all-read/');
  },
  getPreferences: async (): Promise<NotificationPreferences> => {
    if (isMock()) return useBackendSimulatorStore().notificationPrefs;
    const res = await api.get('/notifications/preferences/');
    return res.data;
  },
  updatePreferences: async (prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    if (isMock()) return useBackendSimulatorStore().updateNotificationPreferences(prefs);
    const res = await api.patch('/notifications/preferences/', prefs);
    return res.data;
  }
};

export const moderationApi = {
  getQueue: async (): Promise<ModerationQueueItem[]> => {
    if (isMock()) return useBackendSimulatorStore().getModerationQueue();
    const res = await api.get('/moderation/queue/');
    return res.data;
  },
  submitDecision: async (listingId: number, data: ModerationDecisionRequest): Promise<ModerationDecisionResponse> => {
    if (isMock()) return useBackendSimulatorStore().handleModerationDecision(listingId, 3, data);
    const res = await api.post(`/moderation/${listingId}/decision/`, data);
    return res.data;
  },
  getKycQueue: async (): Promise<Verification[]> => {
    if (isMock()) return useBackendSimulatorStore().getKycQueue();
    const res = await api.get('/moderation/kyc/');
    return res.data;
  },
  submitKycDecision: async (kycId: number, data: { decision: 'approve' | 'reject'; rejection_code?: string; rejection_note?: string }): Promise<Verification> => {
    if (isMock()) return useBackendSimulatorStore().handleKycDecision(kycId, data.decision === 'approve' ? 'approved' : 'rejected', data.rejection_note, data.rejection_code);
    const res = await api.post(`/moderation/kyc/${kycId}/decision/`, data);
    return res.data;
  }
};

export const adminApi = {
  getStats: async (): Promise<AdminDashboardStats> => {
    if (isMock()) return useBackendSimulatorStore().getAdminStats();
    const res = await api.get('/compliance/stats/');
    return res.data;
  },
  getFeatureFlags: async (): Promise<FeatureFlag[]> => {
    if (isMock()) return useBackendSimulatorStore().featureFlags;
    const res = await api.get('/compliance/feature-flags/');
    return res.data;
  },
  updateFeatureFlag: async (key: string, is_enabled: boolean): Promise<FeatureFlag> => {
    if (isMock()) {
      const flag = useBackendSimulatorStore().featureFlags.find(f => f.key === key);
      if (flag) flag.is_enabled = is_enabled;
      return flag!;
    }
    const res = await api.patch(`/compliance/feature-flags/${key}/`, { is_enabled });
    return res.data;
  },
  toggleFeatureFlag: async (key: string): Promise<void> => {
    if (isMock()) {
      useBackendSimulatorStore().toggleFeatureFlag(key);
      return;
    }
    await api.post(`/admin/feature-flags/${key}/toggle/`);
  },
  getAuditEvents: async (filters?: { page?: number; page_size?: number }): Promise<PaginatedResponse<AuditEvent> | AuditEvent[]> => {
    if (isMock()) return useBackendSimulatorStore().getAuditEvents(filters);
    const res = await api.get('/compliance/audit/', { params: filters });
    return res.data;
  }
};

export const complianceApi = {
  inquireSayadStatus: async (chequeSerial: string) => {
    return {
      cheque_serial: chequeSerial,
      status: 'white',
      status_display: 'وضعیت سفید (فاقد سابقه چک برگشتی)',
      inquiry_time: new Date().toISOString()
    };
  }
};
