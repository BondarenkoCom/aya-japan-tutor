import type { ReviewState } from "../domain/types";

export function createInitialReview(cardId: string, now = new Date()): ReviewState {
  return {
    cardId,
    dueAt: now.toISOString(),
    intervalDays: 0,
    ease: 2.4,
    correctStreak: 0,
    mistakes: 0,
    updatedAt: now.toISOString()
  };
}

export function nextReviewState(current: ReviewState, correct: boolean, now = new Date()): ReviewState {
  if (!correct) {
    const retryAt = new Date(now.getTime() + 10 * 60 * 1000);
    return {
      ...current,
      dueAt: retryAt.toISOString(),
      intervalDays: 0,
      ease: Math.max(1.4, current.ease - 0.2),
      correctStreak: 0,
      mistakes: current.mistakes + 1,
      updatedAt: now.toISOString()
    };
  }

  const streak = current.correctStreak + 1;
  const intervalDays =
    streak === 1
      ? 1
      : Math.max(2, Math.round(Math.max(1, current.intervalDays || 1) * current.ease));
  const dueAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    ...current,
    dueAt: dueAt.toISOString(),
    intervalDays,
    ease: Math.min(3.0, current.ease + 0.05),
    correctStreak: streak,
    updatedAt: now.toISOString()
  };
}

