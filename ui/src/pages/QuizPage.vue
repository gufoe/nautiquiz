<template>
  <q-page view="lHh Lpr lFf" class="column col q-pa-md" style="gap: 20px">
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
          class="absolute"
          style="top: 0; bottom: 0; left: 0; right: 0"
          @click.stop="advanceOrFinish"
        ></div>
      </div>
    </div>

    <LeaderboardDialog
      v-model="show_leaderboard"
      :leaderboards="leaderboards"
      :session="session_summary"
      :notice="leaderboard_notice"
      @closed="returnHome"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LeaderboardDialog from 'src/components/LeaderboardDialog.vue';
import { submitQuizSession, type LeaderboardsResponse } from 'src/api/leaderboards';
import { token } from 'src/auth/state';
import { getQuiz, QuizBase, QuizMode, shuffle } from 'src/utils';

const route = useRoute();
const router = useRouter();
const quiz = getQuiz(route.params.mode as 'base' | 'vela');
const quiz_history = quiz.getQuizHistory();

const selected_mode: QuizMode =
  route.query.mode === 'missing' ||
  route.query.mode === 'mistakes' ||
  route.query.mode === 'favs' ||
  route.query.mode === 'issues'
    ? route.query.mode
    : 'all';

const available_quizzes = quiz.getQuizzes(selected_mode);
shuffle(available_quizzes as QuizBase[]);
available_quizzes.splice(20);

const current_quiz_index = ref(0);
const current_quiz = computed(() => available_quizzes[current_quiz_index.value]);
const show_answer = ref(false);
const session_answers = ref<Record<number, number>>({});
const show_leaderboard = ref(false);
const leaderboard_notice = ref<string | null>(null);
const leaderboards = ref<LeaderboardsResponse>({
  weekly: { scope: 'weekly', weekStartsAt: null, rows: [] },
  global: { scope: 'global', weekStartsAt: null, rows: [] },
});
const session_submitted = ref(false);

watch(current_quiz, () => {
  show_answer.value = false;
});

const is_answered = computed(
  () => current_quiz.value.id in session_answers.value,
);
const current_answer = computed(
  () => session_answers.value[current_quiz.value.id],
);

const answered_count = computed(() => Object.keys(session_answers.value).length);
const correct_count = computed(
  () => available_quizzes.filter((x) => x.answer === session_answers.value[x.id]).length,
);

const percent = computed(() =>
  available_quizzes.length > 0
    ? answered_count.value / available_quizzes.length
    : 0,
);
const percent_label = computed(
  () =>
    `${answered_count.value} / ${available_quizzes.length} (Errori: ${current_errors.value.length})`,
);
const max_errors = 4;
const current_errors = computed(() => {
  return available_quizzes.filter(
    (x) =>
      x.id in session_answers.value && x.answer !== session_answers.value[x.id],
  );
});

const session_summary = computed(() => ({
  answered: answered_count.value,
  correct: correct_count.value,
  score: answered_count.value + correct_count.value,
}));

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

async function finishSession() {
  if (session_submitted.value) return;
  session_submitted.value = true;
  leaderboard_notice.value = null;

  const payload = {
    mode: String(route.query.mode ?? 'all'),
    answered: session_summary.value.answered,
    correct: session_summary.value.correct,
  };

  if (!token.value) {
    leaderboard_notice.value = 'Accedi per salvare il risultato nella classifica globale.';
    show_leaderboard.value = true;
    return;
  }

  try {
    const res = await submitQuizSession(token.value, payload);
    leaderboards.value = res.leaderboards;
  } catch (error) {
    leaderboard_notice.value =
      error instanceof Error
        ? error.message
        : 'Classifica non disponibile al momento.';
  } finally {
    show_leaderboard.value = true;
  }
}

function advanceOrFinish() {
  if (current_quiz_index.value + 1 < available_quizzes.length) {
    current_quiz_index.value++;
  } else {
    void finishSession();
  }
}

function returnHome() {
  router.replace({ name: 'quiz-home', params: route.params });
}
</script>
