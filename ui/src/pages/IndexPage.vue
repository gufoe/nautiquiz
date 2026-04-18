<template>
  <q-page class="text-center column">
    <div class="col">
      <h4 class="q-mb-none">Patente Nautica</h4>
      <div class="q-mb-md q-text-xs text-body2" style="opacity: 0.5">
        Quiz ministeriali per la patente nautica
      </div>
      <div class="column q-gap-1">
        <q-btn
          flat
          color="primary"
          icon="emoji_events"
          label="Classifiche"
          :to="{ name: 'leaderboards' }"
        />
        <div class="q-mt-md q-mb-xs text-grey">Quizzoni</div>
        <q-btn
          flat
          label="Quizzone"
          :to="{ name: 'quiz-home', params: { mode: 'base' } }"
        />
        <q-btn
          flat
          label="Quizzone a vela"
          :to="{ name: 'quiz-home', params: { mode: 'vela' } }"
        />
        <div class="q-mt-md q-mb-xs text-grey">Carteggioni</div>
        <q-btn
          flat
          label="Carteggio 5D"
          :to="{ name: 'quiz-home', params: { mode: '5d' } }"
        />
        <q-btn
          flat
          label="Carteggio 42D"
          :to="{ name: 'quiz-home', params: { mode: '42d' } }"
        />
      </div>
    </div>

    <div class="q-mt-xl q-pt-md q-pb-lg" style="width: 100%">
      <div class="text-subtitle2 q-mb-sm">Top 3 — classifica settimanale</div>
      <div v-if="weeklyLoading" class="flex flex-center q-py-md">
        <q-spinner color="primary" size="28px" />
      </div>
      <q-banner v-else-if="weeklyError" rounded dense class="bg-grey-4 text-grey-9 text-caption">
        Classifica non disponibile al momento.
      </q-banner>
      <q-list v-else bordered class="rounded-borders text-left" style="max-width: 360px; margin: 0 auto">
        <template v-if="weeklyTop.rows.length">
          <q-item v-for="row in weeklyTop.rows" :key="row.rank + row.username">
            <q-item-section side class="text-weight-medium text-grey-8">#{{ row.rank }}</q-item-section>
            <q-item-section>
              <q-item-label>{{ row.username }}</q-item-label>
              <q-item-label caption
                >{{ row.score }} pt · {{ Math.round(row.accuracy * 100) }}% prec.</q-item-label
              >
            </q-item-section>
          </q-item>
        </template>
        <q-item v-else>
          <q-item-section class="text-grey-7 text-caption">
            Ancora nessun risultato questa settimana (serve un nome utente e sessioni giocate).
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  fetchWeeklyTopPublic,
  type WeeklyTopResponse,
} from 'src/api/leaderboards';

const weeklyLoading = ref(true);
const weeklyError = ref(false);
const weeklyTop = ref<WeeklyTopResponse>({
  scope: 'weekly',
  weekStartsAt: 0,
  rows: [],
});

onMounted(async () => {
  weeklyLoading.value = true;
  weeklyError.value = false;
  try {
    weeklyTop.value = await fetchWeeklyTopPublic();
  } catch {
    weeklyError.value = true;
  } finally {
    weeklyLoading.value = false;
  }
});
</script>
