import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import LoginView from '../features/auth/LoginView.vue';
import RegisterView from '../features/auth/RegisterView.vue';
import ProfileView from '../features/profile/ProfileView.vue';
import MyAccountView from '../features/profile/MyAccountView.vue';
import ListingCreateView from '../features/listings/ListingCreateView.vue';
import MyListingsView from '../features/listings/MyListingsView.vue';
import ListingDetailView from '../features/listings/ListingDetailView.vue';
import ListingEditView from '../features/listings/ListingEditView.vue';
import ListingDocumentUploadView from '../features/listings/ListingDocumentUploadView.vue';
import MarketplaceView from '../features/marketplace/MarketplaceView.vue';
import ExpressInterestView from '../features/matches/ExpressInterestView.vue';
import MyMatchesView from '../features/matches/MyMatchesView.vue';
import MatchDetailView from '../views/MatchDetailView.vue';
import NotificationsView from '../features/notifications/NotificationsView.vue';
import NotificationPreferencesView from '../features/notifications/NotificationPreferencesView.vue';
import ModerationQueueView from '../features/moderation/ModerationQueueView.vue';
import KycQueueView from '../features/moderation/KycQueueView.vue';
import AdminStatsView from '../features/admin/AdminStatsView.vue';
import FeatureFlagsView from '../features/admin/FeatureFlagsView.vue';
import AuditEventsView from '../features/admin/AuditEventsView.vue';
import { createDiscreteApi, darkTheme } from 'naive-ui';

const { message } = createDiscreteApi(['message'], {
  configProviderProps: { theme: darkTheme }
});

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/marketplace' },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },

  { path: '/marketplace', name: 'marketplace', component: MarketplaceView, meta: { requiresAuth: true } },
  { path: '/me', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/account', name: 'account', component: MyAccountView, meta: { requiresAuth: true } },

  { path: '/listings/create', name: 'listing-create', component: ListingCreateView, meta: { requiresAuth: true } },
  { path: '/listings/my', name: 'my-listings', component: MyListingsView, meta: { requiresAuth: true } },
  { path: '/listings/:id', name: 'listing-detail', component: ListingDetailView, meta: { requiresAuth: true } },
  { path: '/listings/:id/edit', name: 'listing-edit', component: ListingEditView, meta: { requiresAuth: true } },
  { path: '/listings/:id/upload', name: 'listing-upload', component: ListingDocumentUploadView, meta: { requiresAuth: true } },

  { path: '/matches/express-interest/:listingId', name: 'express-interest', component: ExpressInterestView, meta: { requiresAuth: true } },
  { path: '/matches', name: 'my-matches', component: MyMatchesView, meta: { requiresAuth: true } },
  { path: '/matches/:id', name: 'match-detail', component: MatchDetailView, meta: { requiresAuth: true } },

  { path: '/notifications', name: 'notifications', component: NotificationsView, meta: { requiresAuth: true } },
  { path: '/notifications/preferences', name: 'notification-preferences', component: NotificationPreferencesView, meta: { requiresAuth: true } },

  { path: '/moderation', name: 'moderation', component: ModerationQueueView, meta: { requiresAuth: true, requiresModeration: true } },
  { path: '/moderation/kyc', name: 'moderation-kyc', component: KycQueueView, meta: { requiresAuth: true, requiresModeration: true } },

  { path: '/admin/stats', name: 'admin-stats', component: AdminStatsView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/feature-flags', name: 'admin-flags', component: FeatureFlagsView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/audit', name: 'admin-audit', component: AuditEventsView, meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', redirect: '/marketplace' }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next('/marketplace');
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    message.warning('جهت دسترسی به این بخش، لطفاً ابتدا وارد حساب کاربری خود شوید.');
    return next('/login');
  }

  if (to.meta.requiresModeration && !authStore.canAccessModeration) {
    message.warning('شما دسترسی لازم به بخش نظارت سیستم را ندارید.');
    return next('/marketplace');
  }

  if (to.meta.requiresAdmin && !authStore.canAccessAdmin) {
    message.warning('شما دسترسی مدیریت ارشد سیستم را ندارید.');
    return next('/marketplace');
  }

  next();
});

export default router;
