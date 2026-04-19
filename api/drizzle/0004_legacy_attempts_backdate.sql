-- Backdate JSON-imported attempts so time-scoped stats are not dominated by a one-time migration.
-- (Leaderboard metrics also ignore source = 'legacy'; this fixes any other time-based queries.)
UPDATE `question_attempts`
SET `answered_at` = (CAST(strftime('%s', '2000-01-01') AS INTEGER) * 1000)
WHERE `source` = 'legacy';
