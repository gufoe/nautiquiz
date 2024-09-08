<template>
  <q-page class="text-center">
    <h4>SOS Patente Nautica</h4>
    <div class="column q-gap-1">
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
      <q-btn flat label="Carteggio" />
      <q-btn flat label="Carteggio 5D" />
      <q-btn flat label="Carteggio 42D" />
    </div>
  </q-page>
  yo
</template>

<script setup lang="ts"></script>
