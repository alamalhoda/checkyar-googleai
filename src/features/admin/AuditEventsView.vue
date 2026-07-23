<script setup lang="ts">
import { ref, onMounted, watch, h } from 'vue';
import {
  NCard, NDataTable, NSpin, NPagination, NButton, NTag, useMessage,
  type DataTableColumns
} from 'naive-ui';
import { ListOutline, RefreshOutline, PersonOutline, CodeWorkingOutline } from '@vicons/ionicons5';
import { adminApi } from '../../api';
import type { AuditEvent } from '../../types/api';

const message = useMessage();
const events = ref<AuditEvent[]>([]);
const totalCount = ref(0);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);

const loadEvents = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getAuditEvents({ page: currentPage.value, page_size: pageSize.value });
    if (Array.isArray(res)) {
      events.value = res;
      totalCount.value = res.length;
    } else {
      events.value = res.results || [];
      totalCount.value = res.count || 0;
    }
  } catch (err: any) {
    message.error('خطا در دریافت دفتر لایو رویدادها.');
  } finally {
    loading.value = false;
  }
};

onMounted(loadEvents);

watch([currentPage], () => {
  loadEvents();
});

const getEventTagType = (eventType: string) => {
  if (eventType.includes('create') || eventType.includes('approved') || eventType.includes('accept')) return 'success';
  if (eventType.includes('reject') || eventType.includes('delete') || eventType.includes('decline')) return 'error';
  if (eventType.includes('login') || eventType.includes('auth')) return 'info';
  return 'warning';
};

const formatDate = (isoStr: string) => {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoStr;
  }
};

// Columns definition
const columns: DataTableColumns<AuditEvent> = [
  {
    title: 'شناسه',
    key: 'id',
    width: 80,
    render: (row) => h('span', { class: 'font-mono text-xs font-bold text-slate-300' }, `#${row.id}`)
  },
  {
    title: 'کاربر اقدام‌کننده',
    key: 'actor_username',
    width: 140,
    render: (row) => h('div', { class: 'flex items-center gap-1.5' }, [
      h(PersonOutline, { class: 'w-3.5 h-3.5 text-indigo-400' }),
      h('span', { class: 'font-mono text-xs font-bold text-slate-200' }, `@${row.actor_username}`)
    ])
  },
  {
    title: 'نوع رویداد',
    key: 'event_type',
    width: 180,
    render: (row) => h(NTag, {
      size: 'small',
      type: getEventTagType(row.event_type),
      round: true,
      class: 'font-mono text-[11px]'
    }, { default: () => row.event_type })
  },
  {
    title: 'نوع شیء',
    key: 'object_type',
    width: 120,
    render: (row) => h('span', { class: 'text-xs text-slate-300 font-semibold' }, row.object_type)
  },
  {
    title: 'شناسه شیء',
    key: 'object_id',
    width: 100,
    render: (row) => h('span', { class: 'font-mono text-xs text-emerald-400 font-bold' }, `#${row.object_id}`)
  },
  {
    title: 'آدرس IP',
    key: 'ip_address',
    width: 130,
    render: (row) => h('span', { class: 'font-mono text-xs text-slate-400 dir-ltr inline-block' }, row.ip_address)
  },
  {
    title: 'زمان وقوع',
    key: 'created_at',
    width: 160,
    render: (row) => h('span', { class: 'text-xs text-slate-400 font-mono' }, formatDate(row.created_at))
  }
];
</script>

<template>
  <div class="space-y-6 dir-rtl">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
          <ListOutline class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-100">دفتر لاگ رویدادها و حسابرسی (Audit Logs)</h1>
          <p class="text-xs text-slate-400 mt-0.5">ثبت غیرقابل‌تغییر تمامی فعالیت‌های امنیتی، مالی و سیستم</p>
        </div>
      </div>

      <NButton secondary size="small" :loading="loading" @click="loadEvents">
        <template #icon><RefreshOutline class="w-4 h-4" /></template>
        بروزرسانی لاگ‌ها
      </NButton>
    </div>

    <!-- Data Table -->
    <NSpin :show="loading">
      <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <NDataTable
          :columns="columns"
          :data="events"
          :bordered="false"
          class="custom-data-table"
        />

        <div v-if="totalCount > pageSize" class="flex justify-center pt-6 border-t border-slate-800/80 mt-4">
          <NPagination
            v-model:page="currentPage"
            :page-size="pageSize"
            :item-count="totalCount"
          />
        </div>
      </NCard>
    </NSpin>
  </div>
</template>
