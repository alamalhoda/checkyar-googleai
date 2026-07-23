<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NTag, NButton } from 'naive-ui';
import {
  NotificationsOutline,
  CheckmarkCircleOutline,
  CloseCircleOutline,
  MegaphoneOutline,
  AlertCircleOutline,
  PaperPlaneOutline,
  PersonCircleOutline
} from '@vicons/ionicons5';
import type { Notification } from '../../types/api';
import { NOTIFICATION_TYPE_LABELS } from '../../types/api';

const props = defineProps<{
  notification: Notification;
}>();

const emit = defineEmits<{
  (e: 'mark-read', id: number): void;
}>();

const router = useRouter();

const formattedDate = computed(() => {
  if (!props.notification.created_at) return '';
  try {
    const d = new Date(props.notification.created_at);
    return d.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return props.notification.created_at;
  }
});

const channelLabel = computed(() => {
  switch (props.notification.channel) {
    case 'in_app':
      return 'درون‌برنامه‌ای';
    case 'sms':
      return 'پیامک';
    case 'email':
      return 'ایمیل';
    default:
      return props.notification.channel;
  }
});

const channelTagType = computed(() => {
  switch (props.notification.channel) {
    case 'in_app':
      return 'info';
    case 'sms':
      return 'warning';
    case 'email':
      return 'success';
    default:
      return 'default';
  }
});

const typeTagType = computed(() => {
  switch (props.notification.type) {
    case 'listing_published':
    case 'kyc_approved':
    case 'match_accepted':
    case 'settlement_confirmed':
      return 'success';
    case 'listing_rejected':
    case 'kyc_rejected':
    case 'match_declined':
    case 'match_cancelled':
      return 'error';
    case 'match_created':
    case 'new_moderation_item':
      return 'warning';
    default:
      return 'default';
  }
});

const handleNavigateRelated = () => {
  const { related_object_type, related_object_id } = props.notification;
  if (!related_object_type || !related_object_id) return;

  if (related_object_type === 'listing') {
    router.push(`/listings/${related_object_id}`);
  } else if (related_object_type === 'match') {
    router.push(`/matches`);
  } else if (related_object_type === 'kyc') {
    router.push('/me');
  }
};
</script>

<template>
  <NCard
    class="bg-slate-900 border transition-all duration-200 rounded-2xl shadow-md hover:border-slate-700"
    :class="[
      !notification.read_at
        ? 'border-emerald-500/40 bg-slate-900/90 shadow-emerald-950/20'
        : 'border-slate-800/80 opacity-90'
    ]"
  >
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div class="flex items-start gap-3.5 min-w-0">
        <!-- Icon avatar -->
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5"
          :class="[
            !notification.read_at
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
          ]"
        >
          <NotificationsOutline class="w-5 h-5" />
        </div>

        <div class="space-y-1.5 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h4 class="text-sm font-bold text-slate-100 truncate">
              {{ notification.title }}
            </h4>

            <NTag size="small" :type="typeTagType" round class="font-semibold text-[11px]">
              {{ NOTIFICATION_TYPE_LABELS[notification.type] || notification.type }}
            </NTag>

            <NTag size="small" :type="channelTagType" borderless class="text-[10px]">
              {{ channelLabel }}
            </NTag>

            <span v-if="!notification.read_at" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              جدید
            </span>
          </div>

          <p class="text-xs text-slate-300 leading-relaxed break-words">
            {{ notification.message }}
          </p>

          <div class="text-[11px] text-slate-400 font-mono">
            {{ formattedDate }}
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <NButton
          v-if="notification.related_object_type"
          size="small"
          text
          type="primary"
          class="text-xs font-semibold"
          @click="handleNavigateRelated"
        >
          مشاهده جزئیات
        </NButton>

        <NButton
          v-if="!notification.read_at"
          size="small"
          secondary
          type="primary"
          class="text-xs font-bold"
          @click="emit('mark-read', notification.id)"
        >
          علامت به عنوان خوانده‌شده
        </NButton>
      </div>
    </div>
  </NCard>
</template>
