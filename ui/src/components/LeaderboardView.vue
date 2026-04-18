<template>
  <q-card class="leaderboard-card">
    <q-card-section class="row items-start justify-between q-pb-none">
      <div>
        <div class="text-h6">Classifica</div>
        <div class="text-caption text-grey-7">
          <template v-if="tab === 'weekly'">
            Settimana in corso (reset ogni lunedì). Conta i quiz completati in questa settimana.
          </template>
          <template v-else>
            Tutti i tempi: numero di quiz completati (ogni sessione conta 1).
          </template>
        </div>
      </div>
      <q-btn
        v-if="showCloseHeader"
        flat
        round
        dense
        icon="close"
        @click="emit('close')"
      />
    </q-card-section>

    <q-card-section v-if="session" class="q-pb-none">
      <div class="row q-col-gutter-sm">
        <div class="col-6">
          <q-card flat bordered class="bg-grey-2">
            <q-card-section class="q-py-sm">
              <div class="text-caption text-grey-7">Sessione</div>
              <div class="text-subtitle1">
                {{ session.correct }} corrette su {{ session.answered }}
              </div>
              <div class="text-caption text-grey-7">Score: {{ session.score }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-6">
          <q-card flat bordered class="bg-grey-2">
            <q-card-section class="q-py-sm">
              <div class="text-caption text-grey-7">Posizione attuale</div>
              <div class="text-subtitle1">#{{ currentRank ?? '...' }}</div>
              <div class="text-caption text-grey-7">
                {{ positionSummary }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-else class="q-pb-none">
      <q-card flat bordered class="bg-grey-2">
        <q-card-section class="q-py-sm">
          <div class="text-caption text-grey-7">Posizione attuale</div>
          <div class="text-subtitle1">#{{ currentRank ?? '...' }}</div>
          <div class="text-caption text-grey-7">{{ positionSummary }}</div>
        </q-card-section>
      </q-card>
    </q-card-section>

    <q-card-section v-if="notice" class="q-pb-none">
      <q-banner rounded class="bg-amber-2 text-amber-10">
        {{ notice }}
      </q-banner>
    </q-card-section>

    <q-card-section class="q-pb-none">
      <q-tabs v-model="tab" dense class="text-grey-8" active-color="primary" indicator-color="primary">
        <q-tab name="weekly" label="Settimanale" />
        <q-tab name="global" label="Globale" />
      </q-tabs>
    </q-card-section>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="weekly" class="q-pa-none">
        <q-markup-table flat bordered>
          <thead>
            <tr>
              <th class="text-left">#</th>
              <th class="text-left">Utente</th>
              <th class="text-right">Quiz</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in leaderboards.weekly.rows"
              :key="`w-${row.rank}-${row.username}-${row.quizCount}`"
              :class="row.isCurrentUser ? 'bg-blue-1' : ''"
            >
              <td>{{ row.rank }}</td>
              <td>{{ row.username ?? '—' }}</td>
              <td class="text-right">{{ row.quizCount }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-tab-panel>
      <q-tab-panel name="global" class="q-pa-none">
        <q-markup-table flat bordered>
          <thead>
            <tr>
              <th class="text-left">#</th>
              <th class="text-left">Utente</th>
              <th class="text-right">Quiz</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in leaderboards.global.rows"
              :key="`g-${row.rank}-${row.username}-${row.quizCount}`"
              :class="row.isCurrentUser ? 'bg-blue-1' : ''"
            >
              <td>{{ row.rank }}</td>
              <td>{{ row.username ?? '—' }}</td>
              <td class="text-right">{{ row.quizCount }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-tab-panel>
    </q-tab-panels>

    <q-card-actions v-if="showFooterDismiss" align="center">
      <q-btn flat color="primary" label="Tocca per continuare" @click="emit('close')" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { LeaderboardsResponse } from 'src/api/leaderboards';

const props = withDefaults(
  defineProps<{
    leaderboards: LeaderboardsResponse;
    session?: { answered: number; correct: number; score: number } | null;
    notice?: string | null;
    showCloseHeader?: boolean;
    showFooterDismiss?: boolean;
  }>(),
  {
    session: null,
    notice: null,
    showCloseHeader: true,
    showFooterDismiss: true,
  },
);

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const tab = ref<'weekly' | 'global'>('weekly');

const currentRank = computed(() => {
  const rows =
    tab.value === 'weekly'
      ? props.leaderboards.weekly.rows
      : props.leaderboards.global.rows;
  return rows.find((entry) => entry.isCurrentUser)?.rank ?? null;
});

const currentQuizCount = computed(() => {
  const rows =
    tab.value === 'weekly'
      ? props.leaderboards.weekly.rows
      : props.leaderboards.global.rows;
  return rows.find((entry) => entry.isCurrentUser)?.quizCount ?? null;
});

const positionSummary = computed(() => {
  const v = currentQuizCount.value ?? 0;
  if (tab.value === 'global') {
    return `${v} quiz completati (totale)`;
  }
  return `${v} quiz questa settimana`;
});
</script>

<style scoped>
.leaderboard-card {
  width: min(92vw, 520px);
  max-height: 85vh;
  overflow: hidden;
}
</style>
