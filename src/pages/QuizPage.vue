<template>
  <q-page view="lHh Lpr lFf" class="column col q-pa-md" style="gap: 20px">
    <!-- <h4 class="text-center">QUIZ</h4> -->

    <q-linear-progress
      size="18px"
      rounded
      :value="percent"
      :color="current_errors.length > max_errors ? 'red' : 'blue'"
    >
      <div class="absolute-full flex flex-center">
        <q-badge :label="percent_label" color="grey-2" text-color="grey" />
      </div>
    </q-linear-progress>
    <div class="column col" style="gap: 10px" :key="current_quiz.id">
      <img
        v-if="current_quiz.image"
        :src="`${current_quiz.image}`"
        class="self-center"
        style="
          max-width: 80%;
          height: 140px;
          object-fit: scale-down;
          border-radius: 10px;
        "
      />
      <div
        class="q-mt-md q-mb-xs row no-wrap cursor-pointer"
        style="gap: 5px; position: relative; z-index: 10"
        @click="quiz.favs.toggle(current_quiz.id)"
      >
        <!-- {{ current_quiz.id }}) -->
        <q-icon
          name="star"
          :color="quiz.favs.includes(current_quiz.id) ? 'yellow' : 'grey-4'"
          size="sm"
          style="margin-top: 3px"
        />
        <div style="white-space: pre-line" v-text="current_quiz.question" />
      </div>
      <template v-if="'choiches' in current_quiz">
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
      </template>
      <div
        v-else-if="current_quiz.solution && !show_answer"
        class="row"
        style="gap: 20px"
      >
        <q-btn
          class="col"
          color="blue"
          @click="show_answer = true"
          icon="o_lightbulb"
          flat
        >
          Ho fatto!
        </q-btn>
      </div>
      <div v-else class="row" style="gap: 20px">
        <q-btn
          class="col"
          :color="optionColor(0)"
          @click="!is_answered && selectAnswer(0)"
          icon="close"
          flat
          >{{ current_quiz.solution ? 'Altro' : 'Falso' }}</q-btn
        >
        <q-btn
          class="col"
          icon="done"
          flat
          :color="optionColor(1)"
          @click="!is_answered && selectAnswer(1)"
          >{{ current_quiz.solution ?? 'Vero' }}</q-btn
        >
      </div>

      <div class="text-grey" v-if="is_answered">
        <div class="row items-center">
          <q-icon name="touch_app" size="sm" />
          &nbsp; Tocca ovunque per continuare
        </div>
        <div
          class="row items-center"
          style="position: relative; z-index: 9"
          @click.stop="quiz.issues.toggle(current_quiz.id)"
        >
          <q-icon
            name="error_outline"
            size="sm"
            :color="quiz.issues.includes(current_quiz.id) ? 'red' : undefined"
          />
          &nbsp; Segnala un problema
        </div>
        <hr />
        <div v-text="current_quiz.description" style="white-space: pre-line" />
        <div
          v-if="is_answered"
          class="absolute"
          style="top: 0; bottom: 0; left: 0; right: 0"
          @click.stop="
            if (current_quiz_index + 1 < available_quizzes.length) {
              current_quiz_index++;
            } else {
              $router.replace({ name: 'quiz-home', params: $route.params });
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
            $router.replace({ name: 'quiz-home', params: $route.params });
          }
        "
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QuizMode } from '../utils.ts';

import { getQuiz } from 'src/utils';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
const r = useRoute();
const quiz = getQuiz(r.params.mode as 'base' | 'vela');

const route = useRoute();
const quiz_history = quiz.getQuizHistory();

const available_quizzes = quiz.getQuizzes(route.query.mode as QuizMode);
available_quizzes.sort(() => Math.random() - 0.5);
available_quizzes.splice(20);

const current_quiz_index = ref(0);
const current_quiz = computed(
  () => available_quizzes[current_quiz_index.value],
);
const show_answer = ref(false);
watch(current_quiz, () => {
  show_answer.value = false;
});

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
    `${Object.values(session_answers.value).length} / ${available_quizzes.length} (Errori: ${current_errors.value.length})`,
);
const max_errors = 4;
const current_errors = computed(() => {
  return available_quizzes.filter(
    (x) =>
      x.id in session_answers.value && x.answer !== session_answers.value[x.id],
  );
});

function selectAnswer(answer: number) {
  session_answers.value[current_quiz.value.id] = answer;
  quiz_history[current_quiz.value.id] = answer;
  quiz.setQuizHistory(quiz_history as never);
}

function optionColor(c_i: number) {
  if (!is_answered.value) return;
  if (c_i === current_quiz.value.answer) return 'green';
  if (c_i == current_answer.value) return 'red';
}
</script>
