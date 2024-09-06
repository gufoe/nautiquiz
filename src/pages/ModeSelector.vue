<template>
  <q-layout view="lHh Lpr lFf" class="text-center">
    <h4>SOS Patente Nautica</h4>
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
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { getQuizStats } from 'src/utils';

const stats = getQuizStats();
</script>
