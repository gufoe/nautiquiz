<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @hide="emit('closed')"
  >
    <LeaderboardView
      :leaderboards="leaderboards"
      :session="session"
      :notice="notice"
      @close="emit('update:modelValue', false)"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import LeaderboardView from 'src/components/LeaderboardView.vue';
import type { LeaderboardsResponse } from 'src/api/leaderboards';

defineProps<{
  modelValue: boolean;
  leaderboards: LeaderboardsResponse;
  session: {
    answered: number;
    correct: number;
    score: number;
  };
  notice?: string | null;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'closed'): void;
}>();
</script>
