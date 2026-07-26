import { createApp } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { createDiscreteApi, darkTheme } from 'naive-ui';
import App from './App.vue';
import './index.css';

const { message } = createDiscreteApi(['message'], {
  configProviderProps: { theme: darkTheme }
});

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

app.mount('#app');
