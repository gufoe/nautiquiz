<template>
  <q-page view="lHh Lpr lFf" class="text-center">
    <div class="column q-gap-1">
      <div class="q-mt-md q-mb-xs text-grey">Quali quiz vuoi svolgere?</div>
      <q-btn
        flat
        :label="`Tutti (${stats.total})`"
        :disable="stats.total <= 0"
        :to="{ name: 'quiz', query: { mode: 'all' } }"
      />
      <q-btn
        flat
        :label="`Mancanti (${stats.total - stats.completed})`"
        :disable="stats.total - stats.completed <= 0"
        :to="{ name: 'quiz', query: { mode: 'missing' } }"
      />
      <q-btn
        flat
        :label="`Errati (${stats.completed - stats.correct})`"
        :disable="stats.completed - stats.correct <= 0"
        :to="{ name: 'quiz', query: { mode: 'mistakes' } }"
      />
      <q-btn
        flat
        :label="`Preferiti (${QUIZ_FAVS.length})`"
        :disable="QUIZ_FAVS.length <= 0"
        :to="{ name: 'quiz', query: { mode: 'favs' } }"
      />
      <q-btn
        flat
        :label="`Segnalazioni (${QUIZ_ISSUES.length})`"
        :disable="QUIZ_ISSUES.length <= 0"
        :to="{ name: 'quiz', query: { mode: 'issues' } }"
      />
    </div>
    <div class="q-mt-md">
      <div class="text-caption text-grey">
        Progresso:
        {{ ((stats.completed / stats.total) * 100).toFixed(0) }}%
        <br />
        Corrette:
        {{ ((stats.correct / stats.completed) * 100).toFixed(0) }}%
        <br />
        Completati: {{ stats.completed }}
        <br />
        Errori:
        {{ stats.completed - stats.correct }}
        <br />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { getQuizStats, QUIZ_FAVS, QUIZ_ISSUES } from 'src/utils';

const stats = getQuizStats();
</script>
