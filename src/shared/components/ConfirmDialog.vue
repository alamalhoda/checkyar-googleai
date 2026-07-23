<script setup lang="ts">
import { NModal, NCard, NButton } from 'naive-ui';

interface Props {
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'تایید عملیات',
  message: 'آیا از انجام این عملیات اطمینان دارید؟',
  confirmText: 'تایید و ادامه',
  cancelText: 'انصراف',
  loading: false
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <NModal
    :show="props.show"
    @update:show="(val) => !val && emit('cancel')"
    preset="card"
    class="max-w-md w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl"
    :title="props.title"
  >
    <div class="py-2 text-slate-300 text-sm leading-relaxed">
      {{ props.message }}
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3 pt-2">
        <NButton quaternary @click="emit('cancel')" :disabled="props.loading">
          {{ props.cancelText }}
        </NButton>

        <NButton type="primary" :loading="props.loading" @click="emit('confirm')">
          {{ props.confirmText }}
        </NButton>
      </div>
    </template>
  </NModal>
</template>
