<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { NCard, NSpin, NButton, NIcon, NTooltip } from 'naive-ui';
import { AnalyticsOutline, InformationCircleOutline } from '@vicons/ionicons5';
import type { ChartType } from '../types/charts.types';
import { useUiStore } from '../../../stores/useUiStore';
import { getApexChartThemeConfig } from '../utils/chartTheming';

const uiStore = useUiStore();

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    type: ChartType;
    series: any[];
    categories?: string[];
    height?: number | string;
    loading?: boolean;
    drilldownHint?: string;
  }>(),
  {
    height: 320,
    loading: false,
    drilldownHint: 'برای مشاهده جزئیات تفصیلی (Drilldown) روی هر بخش یا نقطه کلیک کنید.'
  }
);

const emit = defineEmits<{
  (e: 'data-point-click', payload: { seriesIndex: number; dataPointIndex: number; selectedX: any; selectedY: any; config: any }): void;
}>();

const hasData = computed(() => {
  if (!props.series || props.series.length === 0) return false;
  if (typeof props.series[0] === 'number') {
    return props.series.some((v: number) => v > 0);
  }
  if (typeof props.series[0] === 'object' && props.series[0] !== null) {
    if (Array.isArray(props.series[0].data)) {
      return props.series.some((s: any) => Array.isArray(s.data) && s.data.length > 0);
    }
  }
  return true;
});

// Base ApexCharts options dynamically adapted to current theme
const chartOptions = computed(() => {
  const themeConfig = getApexChartThemeConfig(uiStore.currentTheme);

  return {
    chart: {
      type: props.type,
      fontFamily: 'Vazirmatn, IRANSans, Tahoma, sans-serif',
      background: 'transparent',
      foreColor: themeConfig.foreColor,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      },
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const sIdx = config.seriesIndex ?? 0;
          const dIdx = config.dataPointIndex ?? 0;
          const selectedX = props.categories ? props.categories[dIdx] : (config.w?.config?.series?.[sIdx]?.data?.[dIdx]?.x ?? dIdx);
          const selectedY = config.w?.config?.series?.[sIdx]?.data?.[dIdx] ?? null;

          emit('data-point-click', {
            seriesIndex: sIdx,
            dataPointIndex: dIdx,
            selectedX,
            selectedY,
            config
          });
        }
      }
    },
    theme: {
      mode: themeConfig.mode
    },
    colors: themeConfig.palette,
    stroke: {
      curve: 'smooth',
      width: props.type === 'line' || props.type === 'area' ? 3 : 1
    },
    grid: {
      borderColor: themeConfig.gridBorder,
      strokeDashArray: 4
    },
    xaxis: {
      categories: props.categories || [],
      labels: {
        style: {
          colors: themeConfig.labelsColor,
          fontSize: '11px'
        }
      },
      axisBorder: { color: themeConfig.axisBorder },
      axisTicks: { color: themeConfig.axisTicks }
    },
    yaxis: {
      labels: {
        style: {
          colors: themeConfig.labelsColor,
          fontSize: '11px'
        },
        formatter: (val: number) => {
          if (val === null || val === undefined) return '';
          if (Math.abs(val) >= 1000000000) return (val / 1000000000).toFixed(1) + ' B';
          if (Math.abs(val) >= 1000000) return (val / 1000000).toFixed(0) + ' M';
          return val.toLocaleString('fa-IR');
        }
      }
    },
    dataLabels: {
      enabled: props.type === 'donut' || props.type === 'pie'
    },
    tooltip: {
      theme: themeConfig.tooltipTheme,
      y: {
        formatter: (val: number) => (val !== null && val !== undefined ? val.toLocaleString('fa-IR') : '')
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: themeConfig.legendColor
      }
    }
  };
});
</script>

<template>
  <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden card-hover">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <NIcon size="18"><AnalyticsOutline /></NIcon>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-100 tracking-tight">{{ title }}</h3>
            <p v-if="subtitle" class="text-[11px] text-slate-400 mt-0.5">{{ subtitle }}</p>
          </div>
        </div>

        <NTooltip trigger="hover">
          <template #trigger>
            <NButton size="tiny" quaternary circle class="text-slate-400 hover:text-emerald-400">
              <NIcon size="16"><InformationCircleOutline /></NIcon>
            </NButton>
          </template>
          <span>{{ drilldownHint }}</span>
        </NTooltip>
      </div>
    </template>

    <div class="relative min-h-[220px]">
      <div v-if="loading" class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <NSpin size="medium" description="در حال دریافت و ساخت نمودار..." />
      </div>

      <div v-show="hasData" class="w-full">
        <VueApexCharts
          v-if="hasData"
          :type="type"
          :height="height"
          :options="chartOptions"
          :series="series"
        />
      </div>

      <div v-if="!loading && !hasData" class="h-48 flex items-center justify-center text-xs text-slate-500">
        داده‌ای برای نمایش در این بازه پیدا نشد.
      </div>
    </div>
  </NCard>
</template>
