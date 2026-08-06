import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { createDiscreteApi, darkTheme } from 'naive-ui';

const { message } = createDiscreteApi(['message'], {
  configProviderProps: { theme: darkTheme }
});

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/marketplace' },
  { path: '/login', name: 'login', component: () => import('../features/auth/LoginView.vue'), meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: () => import('../features/auth/RegisterView.vue'), meta: { guestOnly: true } },

  { path: '/marketplace', name: 'marketplace', component: () => import('../features/marketplace/MarketplaceView.vue'), meta: { requiresAuth: true } },
  { path: '/me', name: 'profile', component: () => import('../features/profile/ProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/account', name: 'account', component: () => import('../features/profile/MyAccountView.vue'), meta: { requiresAuth: true } },

  { path: '/listings/create', name: 'listing-create', component: () => import('../features/listings/views/ListingCreateWizard.vue'), meta: { requiresAuth: true } },
  { path: '/listings/my', name: 'my-listings', component: () => import('../features/listings/MyListingsView.vue'), meta: { requiresAuth: true } },
  { path: '/listings/:id', name: 'listing-detail', component: () => import('../features/listings/ListingDetailView.vue'), meta: { requiresAuth: true } },
  { path: '/listings/:id/edit', name: 'listing-edit', component: () => import('../features/listings/views/ListingEdit.vue'), meta: { requiresAuth: true } },
  { path: '/listings/:id/upload', name: 'listing-upload', component: () => import('../features/listings/ListingDocumentUploadView.vue'), meta: { requiresAuth: true } },

  { path: '/matches/express-interest/:listingId', name: 'express-interest', component: () => import('../features/matches/ExpressInterestView.vue'), meta: { requiresAuth: true } },
  { path: '/matches', name: 'my-matches', component: () => import('../features/matches/MyMatchesView.vue'), meta: { requiresAuth: true } },
  { path: '/matches/:id', name: 'match-detail', component: () => import('../features/matches/views/TradeDetails.vue'), meta: { requiresAuth: true } },

  { path: '/notifications', name: 'notifications', component: () => import('../features/notifications/NotificationsView.vue'), meta: { requiresAuth: true } },
  { path: '/notifications/preferences', name: 'notification-preferences', component: () => import('../features/notifications/NotificationPreferencesView.vue'), meta: { requiresAuth: true } },

  { path: '/reports', name: 'user-reports', component: () => import('../features/reports/user/UserReportsDashboard.vue'), meta: { requiresAuth: true } },

  { path: '/moderation', name: 'moderation', component: () => import('../features/moderation/views/ModerationQueue.vue'), meta: { requiresAuth: true, requiresModeration: true } },
  { path: '/moderation/review/:id', name: 'moderation-review', component: () => import('../features/moderation/views/ModerationReview.vue'), meta: { requiresAuth: true, requiresModeration: true } },
  { path: '/moderation/kyc', name: 'moderation-kyc', component: () => import('../features/moderation/views/KYCQueue.vue'), meta: { requiresAuth: true, requiresModeration: true } },
  { path: '/moderation/kyc/:id', name: 'kyc-review', component: () => import('../features/moderation/views/KYCReview.vue'), meta: { requiresAuth: true, requiresModeration: true } },

  { path: '/admin/reports', redirect: '/admin/stats' },
  { path: '/admin/stats', name: 'admin-stats', component: () => import('../features/admin/AdminStatsView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/feature-flags', name: 'admin-flags', component: () => import('../features/admin/FeatureFlagsView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/audit', name: 'admin-audit', component: () => import('../features/admin/AuditEventsView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },

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
