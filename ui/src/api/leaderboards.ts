import { apiFetch } from 'src/api/client';

export type LeaderboardScope = 'weekly' | 'global';

/** Leaderboard entries never include email or other users’ internal ids. */
export type LeaderboardRow = {
  rank: number;
  username: string | null;
  /** Answers counted in this leaderboard scope (session totals and/or synced attempts). */
  quizCount: number;
  /** Fraction of answers that were correct in this scope (0–1), i.e. correct ÷ total. */
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
    /** Fraction of answers correct (0–1). */
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

export async function fetchLeaderboards(token: string) {
  return apiFetch<LeaderboardsResponse>('/leaderboards', { token });
}

/** Public top weekly players (no auth). Usernames only. */
export async function fetchWeeklyTopPublic() {
  return apiFetch<WeeklyTopResponse>('/leaderboards/weekly-top');
}
