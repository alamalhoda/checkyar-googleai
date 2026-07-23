<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NButton, NTabs, NTabPane, NSpin, NEmpty } from 'naive-ui';
import { AddCircleOutline } from '@vicons/ionicons5';
import ListingCard from '../shared/components/ListingCard.vue';
import { listingsApi } from '../api';
import type { ChequeListing } from '../types/api';

const router = useRouter();

const myListings = ref<ChequeListing[]>([]);
const loading = ref(false);
const activeTab = ref('all');

const loadMyListings = async () => {
  loading.value = true;
  try {
    myListings.value = await listingsApi.getMyListings();
  } catch (err) {
    console.error('Error loading my listings', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadMyListings);

const filteredListings = computed(() => {
  if (activeTab.value === 'all') return myListings.value;
  return myListings.value.filter(l => l.status === activeTab.value);
});

const goToCreate = () => {
  router.push('/listings/create');
};

const goToDetail = (id: number) => {
  router.push(`/listings/${id}`);
};

const goToEdit = (id: number) => {
  router.push(`/listings/${id}/edit`);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-base font-bold text-slate-100">مدیریت آگهی‌های من</h1>
        <p class="text-xs text-slate-400">لیست چک‌های صیادی ثبت شده جهت واگذاری و فروش</p>
      </div>

      <NButton type="primary" @click="goToCreate">
        <template #icon><AddCircleOutline class="w-4 h-4" /></template>
        ثبت آگهی جدید
      </NButton>
    </div>

    <!-- Filter Tabs -->
    <NTabs v-model:value="activeTab" type="segment" animated>
      <NTabPane name="all" tab="همه آگهی‌ها" />
      <NTabPane name="published" tab="منتشر شده" />
      <NTabPane name="pending_moderation" tab="در انتظار بررسی" />
      <NTabPane name="rejected" tab="نیازمند اصلاح / رد شده" />
    </NTabs>

    <NSpin :show="loading">
      <div v-if="filteredListings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ListingCard
          v-for="item in filteredListings"
          :key="item.id"
          :listing="item"
          @view-detail="goToDetail"
          @edit="goToEdit"
        />
      </div>

      <NEmpty v-else description="هیچ آگهی در این دسته یافت نشد." class="py-16" />
    </NSpin>
  </div>
</template>
