<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  NModal,
  NCard,
  NDataTable,
  NButton,
  NIcon,
  NTag,
  NSpin,
  NInput,
  NSpace,
  NDescriptions,
  NDescriptionsItem,
  type DataTableColumns
} from 'naive-ui';
import { CloseOutline, DownloadOutline, SearchOutline, LayersOutline } from '@vicons/ionicons5';
import VueApexCharts from 'vue3-apexcharts';
import { useReportsStore } from '../stores/reportsStore';
import { useUiStore } from '../../../stores/useUiStore';
import { getApexChartThemeConfig } from '../utils/chartTheming';
import type { DrilldownTableRow } from '../types/reports.types';

const store = useReportsStore();
const uiStore = useUiStore();

const searchKeyword = ref('');

const filteredRows = computed(() => {
  const rows = store.drilldownData?.rows || [];
  if (!searchKeyword.value.trim()) return rows;
  const kw = searchKeyword.value.toLowerCase();
  return rows.filter(
    (r) =>
      r.title?.toLowerCase().includes(kw) ||
      r.id?.toLowerCase().includes(kw) ||
      r.category?.toLowerCase().includes(kw) ||
      r.details?.toLowerCase().includes(kw)
  );
});

// Mini chart options for drilldown modal top section
const miniChartOptions = computed(() => {
  const themeConfig = getApexChartThemeConfig(uiStore.currentTheme);
  return {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    colors: [themeConfig.palette[0] || '#10b981'],
    plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    xaxis: {
      categories: store.drilldownData?.miniChartData?.map((d) => d.x) || [],
      labels: { style: { colors: themeConfig.labelsColor } },
      axisBorder: { color: themeConfig.axisBorder },
      axisTicks: { color: themeConfig.axisTicks }
    },
    yaxis: {
      labels: { style: { colors: themeConfig.labelsColor } }
    },
    grid: { borderColor: themeConfig.gridBorder },
    theme: { mode: themeConfig.mode },
    tooltip: { theme: themeConfig.tooltipTheme }
  };
});

const miniChartSeries = computed(() => {
  return [
    {
      name: 'مقدار تفکیکی',
      data: store.drilldownData?.miniChartData?.map((d) => d.y) || []
    }
  ];
});

// DataTable Columns Definition
const columns: DataTableColumns<DrilldownTableRow> = [
  {
    title: 'شناسه / شماره',
    key: 'id',
    width: 110,
    render(row) {
      return row.id;
    }
  },
  {
    title: 'عنوان / شرح رکورد',
    key: 'title',
    render(row) {
      return row.title;
    }
  },
  {
    title: 'دسته / بخش',
    key: 'category',
    width: 120,
    render(row) {
      return row.category;
    }
  },
  {
    title: 'مبلغ (ریال)',
    key: 'amount',
    width: 140,
    render(row) {
      return row.amount ? row.amount.toLocaleString('fa-IR') : '-';
    }
  },
  {
    title: 'تاریخ',
    key: 'date',
    width: 110,
    render(row) {
      return row.date || '-';
    }
  },
  {
    title: 'وضعیت / امتیاز ریسک',
    key: 'status',
    width: 140,
    render(row) {
      return row.riskScore !== undefined ? `امتیاز ریسک: ${row.riskScore}` : row.status || '-';
    }
  }
];

const exportToCsv = () => {
  const rows = filteredRows.value;
  if (!rows.length) return;
  const headers = ['شناسه', 'عنوان', 'دسته', 'مبلغ', 'تاریخ', 'وضعیت'];
  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((r) => [r.id, r.title, r.category, r.amount || '', r.date || '', r.status || ''].join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `drilldown_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <NModal
    v-model:show="store.drilldownVisible"
    preset="card"
    class="max-w-4xl w-[95vw] bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl shadow-2xl dir-rtl"
    :mask-closable="true"
    @close="store.closeDrilldown"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <NIcon size="20"><LayersOutline /></NIcon>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-slate-100">
              {{ store.drilldownContext?.title || 'بررسی جزئیات تفصیلی (Drilldown)' }}
            </h2>
            <NTag size="small" type="info">
              {{ store.drilldownContext?.sourceChart }}
            </NTag>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">
            فیلتر انتخاب‌شده: <span class="text-emerald-400 font-mono font-bold">{{ store.drilldownContext?.filterKey }}: {{ store.drilldownContext?.filterValue }}</span>
          </p>
        </div>
      </div>
    </template>

    <div v-if="store.drilldownLoading" class="py-12 flex flex-col items-center justify-center gap-3">
      <NSpin size="large" />
      <span class="text-xs text-slate-400">در حال دریافت داده‌های تفکیکی از سرور...</span>
    </div>

    <div v-else-if="store.drilldownData" class="space-y-6">
      <!-- Top Metrics & Mini Chart Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <!-- Summary Cards -->
        <div class="md:col-span-2 space-y-3">
          <h4 class="text-xs font-bold text-slate-300 mb-2">خلاصه آماری بخش انتخاب‌شده</h4>
          <NDescriptions column="2" label-placement="top" size="small">
            <NDescriptionsItem v-for="(metric, idx) in store.drilldownData.summaryMetrics" :key="idx" :label="metric.label">
              <span class="text-sm font-bold text-emerald-400 font-mono">{{ metric.value }}</span>
            </NDescriptionsItem>
          </NDescriptions>
        </div>

        <!-- Mini Chart -->
        <div v-if="store.drilldownData.miniChartData" class="h-28">
          <VueApexCharts type="bar" height="110" :options="miniChartOptions" :series="miniChartSeries" />
        </div>
      </div>

      <!-- Action Bar & Search Input -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="w-72">
          <NInput v-model:value="searchKeyword" placeholder="جستجو در داده‌های تفکیکی..." size="small" clearable>
            <template #prefix>
              <NIcon><SearchOutline /></NIcon>
            </template>
          </NInput>
        </div>

        <NSpace>
          <NButton size="small" type="primary" secondary @click="exportToCsv">
            <template #icon>
              <NIcon><DownloadOutline /></NIcon>
            </template>
            خروجی CSV اکسل
          </NButton>

          <NButton size="small" quaternary @click="store.closeDrilldown">
            بستن پنجره
          </NButton>
        </NSpace>
      </div>

      <!-- Data Table -->
      <NDataTable
        :columns="columns"
        :data="filteredRows"
        :pagination="{ pageSize: 5 }"
        size="small"
        bordered
        class="rounded-xl overflow-hidden"
      />
    </div>
  </NModal>
</template>
