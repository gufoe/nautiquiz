<template>
  <q-page view="lHh Lpr lFf" class="column col q-pa-md" style="gap: 20px">
    <!-- <h4 class="text-center">QUIZ</h4> -->

    <q-linear-progress
      stripe
      rounded
      size="20px"
      :value="percent"
      color="blue"
      class="q-mt-sm"
    >
      <div class="absolute-full flex flex-center">
        <q-badge :label="percent_label" />
      </div>
    </q-linear-progress>
    <div
      class="column overflow-auto col"
      style="gap: 10px"
      :key="current_quiz.id"
    >
      <img
        v-if="current_quiz.image"
        :src="`quiz-images/${current_quiz.image}`"
        class="self-center"
        style="
          max-width: 80%;
          height: 140px;
          object-fit: scale-down;
          border-radius: 10px;
        "
      />
      <div class="q-mt-md q-mb-xs text-bold">{{ current_quiz.question }}</div>
      <ol type="a">
        <li
          v-for="(c, c_i) in current_quiz.choiches"
          class="q-py-xs"
          :class="`text-${optionColor(c_i) ?? 'grey'}`"
          v-text="c"
          :key="[current_quiz.id, c_i].join('x')"
          @click="!is_answered && selectAnswer(c_i)"
        />
      </ol>

      <div class="text-grey" v-if="is_answered">
        Tocca ovunque per continuare
        <hr />
        {{ current_quiz.description }}
        <div
          v-if="is_answered"
          class="absolute"
          style="top: 0; bottom: 0; left: 0; right: 0"
          @click.stop="
            if (current_quiz_index + 1 < available_quizzes.length) {
              current_quiz_index++;
            } else {
              $router.replace({ name: 'quiz-mode' });
            }
          "
        ></div>
      </div>
    </div>
    <div class="q-py-md text-right" v-if="false">
      <q-btn
        :disable="current_quiz_index == 0"
        flat
        label="Indietro"
        @click="current_quiz_index--"
      />
      <q-btn
        flat
        color="blue"
        :label="
          current_quiz_index + 1 < available_quizzes.length ? 'Avanti' : 'Fine!'
        "
        :disable="!is_answered"
        @click="
          if (current_quiz_index + 1 < available_quizzes.length) {
            current_quiz_index++;
          } else {
            $router.replace({ name: 'quiz-mode' });
          }
        "
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QuizHistory, QuizInterface, QuizMode, Storage } from '../utils.ts';

import { useRoute } from 'vue-router';
import { QUIZZES } from 'src/data/quiz.ts';
const route = useRoute();
const quiz_history: QuizHistory = Storage.get<QuizHistory>('history') ?? {};
const modes: Record<QuizMode, (q: QuizInterface) => boolean> = {
  all: () => true,
  // all: (q) => !!q.description,
  missing: (q: QuizInterface) => !(q.id in quiz_history),
  mistakes: (q: QuizInterface) =>
    q.id in quiz_history && quiz_history[q.id] !== q.answer,
};
const available_quizzes = QUIZZES.filter((q) =>
  modes[route.query.mode as QuizMode](q),
);
available_quizzes.sort(() => Math.random() - 0.5);
available_quizzes.splice(10);

const current_quiz_index = ref(0);
const current_quiz = computed(
  () => available_quizzes[current_quiz_index.value],
);

const session_answers = ref<Record<number, number>>({});

const is_answered = computed(
  () => current_quiz.value.id in session_answers.value,
);
const current_answer = computed(
  () => session_answers.value[current_quiz.value.id],
);

const percent = computed(
  () => Object.values(session_answers.value).length / available_quizzes.length,
);
const percent_label = computed(
  () =>
    `${Object.values(session_answers.value).length} / ${available_quizzes.length}`,
);

function selectAnswer(index: number) {
  session_answers.value[current_quiz.value.id] = index;
  quiz_history[current_quiz.value.id] = index;
  Storage.set<QuizHistory>('history', quiz_history);
}

function optionColor(c_i: number) {
  if (!is_answered.value) return;
  if (c_i === current_quiz.value.answer) return 'green';
  if (c_i == current_answer.value) return 'red';
}
</script>
