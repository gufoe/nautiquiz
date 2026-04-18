<template>
  <q-page view="lHh Lpr lFf" class="text-center">
    <div v-if="loading" class="q-pa-md">
      <q-spinner color="primary" size="30px" />
    </div>
    <div class="column q-gap-1">
      <div class="q-mt-md q-mb-xs text-grey">Quali quiz vuoi svolgere?</div>
      <q-btn
        flat
        :label="`Tutti (${stats.total})`"
        :disable="stats.total <= 0"
        :to="{ name: 'quiz', params: $route.params, query: { mode: 'all' } }"
      />
      <q-btn
        flat
        :label="`Mancanti (${stats.total - stats.completed})`"
        :disable="stats.total - stats.completed <= 0"
        :to="{
          name: 'quiz',
          params: $route.params,
          query: { mode: 'missing' },
        }"
      />
      <q-btn
        flat
        :label="`Errati (${stats.completed - stats.correct})`"
        :disable="stats.completed - stats.correct <= 0"
        :to="{
          name: 'quiz',
          params: $route.params,
          query: { mode: 'mistakes' },
        }"
      />
      <q-btn
        flat
        :label="`Preferiti (${quiz.favs.length})`"
        :disable="quiz.favs.length <= 0"
        :to="{ name: 'quiz', params: $route.params, query: { mode: 'favs' } }"
      />
      <q-btn
        flat
        :label="`Segnalazioni (${quiz.issues.length})`"
        :disable="quiz.issues.length <= 0"
        :to="{ name: 'quiz', params: $route.params, query: { mode: 'issues' } }"
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
import { computed, onMounted, ref } from 'vue';
import { token } from 'src/auth/state';
import { fetchQuizProgress, type QuizKind } from 'src/api/quizProgress';
import { getQuiz, type QuizHistory } from 'src/utils';
import { useRoute } from 'vue-router';
const r = useRoute();
const quizKind = r.params.mode as QuizKind;
const quiz = getQuiz(quizKind);
const loading = ref(false);
const remoteHistory = ref<QuizHistory<number> | null>(null);

onMounted(async () => {
  if (!token.value) return;
  loading.value = true;
  try {
    const data = await fetchQuizProgress(token.value, quizKind);
    remoteHistory.value = data.history as QuizHistory<number>;
  } catch {
    remoteHistory.value = null;
  } finally {
    loading.value = false;
  }
});

const stats = computed(() => quiz.getQuizStats(remoteHistory.value ?? undefined));
</script>
