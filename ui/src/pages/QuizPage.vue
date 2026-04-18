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

    <div class="column" style="gap: 6px">
      <div class="row items-center no-wrap" style="gap: 8px">
        <q-btn
          flat
          dense
          no-caps
          color="grey-8"
          icon="arrow_back"
          label="Indietro"
          :disable="current_quiz_index === 0"
          @click="goToPreviousQuestion"
        />
        <q-space />
        <div
          class="text-body2 text-weight-medium text-grey-9 text-right"
          style="line-height: 1.3"
        >
          <div>Domanda {{ question_pos }} di {{ quiz_total }}</div>
          <div v-if="is_reviewing_previous" class="text-caption text-grey-7">
            Rilettura — domanda già risposta
          </div>
        </div>
      </div>
    </div>

    <div
      class="column col"
      style="gap: 10px"
      :key="current_quiz.id"
      @click="onAnsweredContentClick"
    >
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
        data-quiz-no-advance
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
            @click="onMcqClick(c_i, $event)"
          />
        </ol>
      </template>
      <div
        v-else-if="current_quiz.solution && !show_answer && !is_answered"
        class="row"
        style="gap: 20px"
      >
        <q-btn
          class="col"
          color="blue"
          @click.stop="show_answer = true"
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
          @click="onTrueFalseClick(0, $event)"
          icon="close"
          flat
          >{{ current_quiz.solution ? 'Altro' : 'Falso' }}</q-btn
        >
        <q-btn
          class="col"
          icon="done"
          flat
          :color="optionColor(1)"
          @click="onTrueFalseClick(1, $event)"
          >{{ current_quiz.solution ?? 'Vero' }}</q-btn
        >
      </div>

      <div class="text-grey" v-if="is_answered">
        <div class="row items-center">
          <q-icon name="touch_app" size="sm" />
          &nbsp;
          <span v-if="is_reviewing_previous">
            Tocca per la domanda {{ next_question_pos }} di {{ quiz_total }}
          </span>
          <span v-else>Tocca ovunque per continuare</span>
        </div>
        <div
          class="row items-center"
          data-quiz-no-advance
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
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LeaderboardDialog from 'src/components/LeaderboardDialog.vue';
import { submitQuizSession, type LeaderboardsResponse } from 'src/api/leaderboards';
import { ApiError } from 'src/api/client';
import { token } from 'src/auth/state';
import { fetchQuizProgress, type QuizKind } from 'src/api/quizProgress';
import { enqueueQuizAttempt } from 'src/lib/quizAttemptQueue';
import { getQuiz, QuizBase, QuizMode, shuffle } from 'src/utils';

const route = useRoute();
const router = useRouter();
const quizKind = route.params.mode as QuizKind;
const quiz = getQuiz(quizKind);
const quiz_history = ref<Record<number, number>>(
  quiz.getQuizHistory() as Record<number, number>,
);

const selected_mode: QuizMode =
  route.query.mode === 'missing' ||
  route.query.mode === 'mistakes' ||
  route.query.mode === 'favs' ||
  route.query.mode === 'issues'
    ? route.query.mode
    : 'all';

const available_quizzes = ref<QuizBase[]>([]);
function rebuildAvailableQuizzes() {
  const rows = quiz.getQuizzes(
    selected_mode,
    quiz_history.value as Record<number, number>,
  );
  shuffle(rows as QuizBase[]);
  available_quizzes.value = rows.slice(0, 20);
}
rebuildAvailableQuizzes();

onMounted(async () => {
  if (!token.value) return;
  try {
    const remote = await fetchQuizProgress(token.value, quizKind);
    quiz_history.value = remote.history as Record<number, number>;
    rebuildAvailableQuizzes();
  } catch {
    /* Keep local fallback for temporary API errors/offline usage. */
  }
});

const current_quiz_index = ref(0);
/** Highest index reached moving forward in this session (used to detect “review” mode). */
const furthest_quiz_index = ref(0);
watch(
  current_quiz_index,
  (n) => {
    furthest_quiz_index.value = Math.max(furthest_quiz_index.value, n);
  },
  { immediate: true },
);
const quiz_total = computed(() => available_quizzes.value.length);
const question_pos = computed(() => current_quiz_index.value + 1);
const is_reviewing_previous = computed(
  () => current_quiz_index.value < furthest_quiz_index.value,
);
const next_question_pos = computed(() =>
  Math.min(current_quiz_index.value + 2, quiz_total.value),
);
const current_quiz = computed(() => available_quizzes.value[current_quiz_index.value]);
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
  () =>
    available_quizzes.value.filter(
      (x) => x.answer === session_answers.value[x.id],
    ).length,
);

/** Bar length = which question slot you are on (1…M), not how many are answered. */
const percent = computed(() =>
  quiz_total.value > 0 ? question_pos.value / quiz_total.value : 0,
);
const percent_label = computed(
  () =>
    `Domanda ${question_pos.value} di ${quiz_total.value} · Risposte: ${answered_count.value} · Errori: ${current_errors.value.length}`,
);
const max_errors = 4;
const current_errors = computed(() => {
  return available_quizzes.value.filter(
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
  if (current_quiz.value.id in session_answers.value) return;
  session_answers.value[current_quiz.value.id] = answer;
  quiz_history.value[current_quiz.value.id] = answer;
  quiz.setQuizHistory(quiz_history.value as never);
  enqueueQuizAttempt({
    quizKind,
    questionId: current_quiz.value.id,
    selectedAnswer: answer,
    isCorrect: current_quiz.value.answer === answer,
    answeredAt: Date.now(),
  });
}

/** Stop bubble only when this click records an answer, so the same event does not advance. */
function onMcqClick(c_i: number, ev: Event) {
  if (current_quiz.value.id in session_answers.value) return;
  ev.stopPropagation();
  selectAnswer(c_i);
}

function onTrueFalseClick(answer: number, ev: Event) {
  if (current_quiz.value.id in session_answers.value) return;
  ev.stopPropagation();
  selectAnswer(answer);
}

function goToPreviousQuestion() {
  if (current_quiz_index.value > 0) {
    current_quiz_index.value--;
  }
}

function onAnsweredContentClick(ev: MouseEvent) {
  if (!is_answered.value) return;
  const t = ev.target;
  if (t instanceof Element && t.closest('[data-quiz-no-advance]')) return;
  advanceOrFinish();
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
    if (error instanceof ApiError && error.status === 403) {
      leaderboard_notice.value =
        'Imposta un nome utente dal menu account per salvare il risultato in classifica.';
    } else {
      leaderboard_notice.value =
        error instanceof Error
          ? error.message
          : 'Classifica non disponibile al momento.';
    }
  } finally {
    show_leaderboard.value = true;
  }
}

function advanceOrFinish() {
  if (current_quiz_index.value + 1 < available_quizzes.value.length) {
    current_quiz_index.value++;
  } else {
    void finishSession();
  }
}

function returnHome() {
  router.replace({ name: 'quiz-home', params: route.params });
}
</script>
