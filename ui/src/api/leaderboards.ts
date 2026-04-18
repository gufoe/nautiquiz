import { apiFetch } from 'src/api/client';

export type LeaderboardScope = 'weekly' | 'global';

export type LeaderboardRow = {
  rank: number;
  userId: string;
  email: string;
  score: number;
  answered: number;
  correct: number;
  accuracy: number;
  isCurrentUser: boolean;
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
