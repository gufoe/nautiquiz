import { apiFetch } from 'src/api/client';

export type LeaderboardScope = 'weekly' | 'global';

/** Leaderboard entries never include email or other users’ internal ids. */
export type LeaderboardRow = {
  rank: number;
  username: string | null;
  /** Answers counted in this leaderboard scope (session totals and/or synced attempts). */
  quizCount: number;
  /** Share of answers correct in this scope, 0–1. */
  accuracy: number;
  isCurrentUser: boolean;
};

export type WeeklyTopResponse = {
  scope: 'weekly';
  weekStartsAt: number;
  rows: Array<{
    rank: number;
    username: string;
    quizCount: number;
    accuracy: number;
  }>;
};

export type LeaderboardPayload = {
  scope: LeaderboardScope;
  weekStartsAt: number | null;
  rows: LeaderboardRow[];
};

export type LeaderboardsResponse = {
  weekly: LeaderboardPayload;
  global: LeaderboardPayload;
};

export type QuizSessionResponse = {
  ok: true;
  session: {
    mode: string;
    answered: number;
    correct: number;
    score: number;
    createdAt: number;
  };
  leaderboards: LeaderboardsResponse;
};

export type QuizAttemptPayload = {
  quizKind: 'base' | 'vela' | '5d' | '42d';
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  answeredAt: number;
};

export async function submitQuizSession(
  token: string,
  payload: { mode: string; answered: number; correct: number },
) {
  return apiFetch<QuizSessionResponse>('/quiz-sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export async function fetchLeaderboards(token: string) {
  return apiFetch<LeaderboardsResponse>('/leaderboards', { token });
}

/** Public top weekly players (no auth). Usernames only. */
export async function fetchWeeklyTopPublic() {
  return apiFetch<WeeklyTopResponse>('/leaderboards/weekly-top');
}
