import { createApp } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import App from './App.vue';
import './index.css';
import { message } from './utils/discreteApi';

const app = createApp(App);
const pinia = createPinia();
setActivePinia(pinia);
app.use(pinia);

// Import router after Pinia is active
import router from './router';
app.use(router);

// Global Vue error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global Vue Error:', err, info);
  const errMsg = (err as any)?.message || 'خطای غیرمنتظره‌ای در برنامه رخ داد.';
  message.error(errMsg);
};

// Global unhandled promise rejection listener
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  const errMsg = event.reason?.response?.data?.error?.message ||
    event.reason?.message ||
    'خطای شبکه یا ارتباط با سرور رخ داد.';
  message.error(errMsg);
});

// Wait for router initial navigation to resolve before mounting
// This keeps the server/HTML initial placeholder (#app-initial-loading) visible
// until the matched view and its guards are fully resolved.
router.isReady().then(() => {
  app.mount('#app');
});
