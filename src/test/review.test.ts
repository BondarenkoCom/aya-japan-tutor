import { describe, expect, it } from "vitest";
import { isAnswerCorrect, normalizeAnswer } from "../services/answer";
import { createInitialReview, nextReviewState } from "../services/review";

describe("answer matching", () => {
  it("normalizes romaji spacing and casing", () => {
    expect(normalizeAnswer("  Kore   Wa  Pen Desu! ")).toBe("kore wa pen desu");
    expect(isAnswerCorrect("KORE", "kore")).toBe(true);
  });
});

describe("review scheduler", () => {
  it("advances correct cards and penalizes mistakes", () => {
    const now = new Date("2026-06-01T00:00:00.000Z");
    const first = createInitialReview("card_1", now);
    const good = nextReviewState(first, true, now);
    const bad = nextReviewState(good, false, now);

    expect(good.correctStreak).toBe(1);
    expect(good.intervalDays).toBe(1);
    expect(bad.correctStreak).toBe(0);
    expect(bad.mistakes).toBe(1);
  });
});

