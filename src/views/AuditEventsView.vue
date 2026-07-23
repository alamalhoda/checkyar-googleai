<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NDataTable, NSpin } from 'naive-ui';
import { adminApi } from '../api';
import type { AuditEvent } from '../types/api';

const events = ref<AuditEvent[]>([]);
const loading = ref(false);

const loadEvents = async () => {
  loading.value = true;
  try {
    events.value = await adminApi.getAuditEvents();
  } catch (err) {
    console.error('Failed to load audit events', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadEvents);
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-base font-bold text-slate-100">دفتر لاگ رویدادها و حسابرسی (Audit Logs)</h1>
      <p class="text-xs text-slate-400">ثبت دقیق تمامی فعالیت‌های حساس کاربران و مدیران</p>
    </div>

    <NSpin :show="loading">
      <div class="space-y-3">
        <NCard v-for="item in events" :key="item.id" class="bg-slate-900 border border-slate-800 rounded-xl">
          <div class="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-emerald-400">{{ item.event_type }}</span>
                <span class="text-slate-400">توسط: <strong class="text-slate-200">@{{ item.actor_username }}</strong></span>
              </div>
              <div class="text-slate-400">شیء: <span class="font-mono text-slate-300">{{ item.object_type }} #{{ item.object_id }}</span></div>
            </div>

            <div class="text-right">
              <div class="font-mono text-slate-400 text-[11px]">{{ item.ip_address }}</div>
              <div class="text-[10px] text-slate-500 font-mono">{{ item.created_at.split('T')[0] }}</div>
            </div>
          </div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
