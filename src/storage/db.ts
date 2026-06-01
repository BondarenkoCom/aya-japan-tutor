import Dexie, { type Table } from "dexie";
import type { LessonRecord, QuizAttempt, ReviewState, StudyCard } from "../domain/types";
import { buildStudyCards } from "../services/importer";
import { createInitialReview } from "../services/review";

export class AyaTutorDb extends Dexie {
  lessons!: Table<LessonRecord, string>;
  cards!: Table<StudyCard, string>;
  reviews!: Table<ReviewState, string>;
  attempts!: Table<QuizAttempt, string>;

  constructor() {
    super("aya-japan-tutor");
    this.version(1).stores({
      lessons: "id, title, level, createdAt, updatedAt",
      cards: "id, lessonId, kind, createdAt",
      reviews: "cardId, dueAt, mistakes, correctStreak",
      attempts: "id, mode, createdAt"
    });
  }
}

export const db = new AyaTutorDb();

export async function saveLessonWithCards(lesson: LessonRecord): Promise<{ lesson: LessonRecord; cards: StudyCard[] }> {
  const cards = buildStudyCards(lesson);
  const reviews = cards.map((card) => createInitialReview(card.id));

  await db.transaction("rw", db.lessons, db.cards, db.reviews, async () => {
    await db.lessons.put(lesson);
    await db.cards.bulkPut(cards);
    await db.reviews.bulkPut(reviews);
  });

  return { lesson, cards };
}

export async function deleteLessonCascade(lessonId: string): Promise<void> {
  await db.transaction("rw", db.lessons, db.cards, db.reviews, async () => {
    const cards = await db.cards.where("lessonId").equals(lessonId).toArray();
    const cardIds = cards.map((card) => card.id);
    await db.lessons.delete(lessonId);
    await db.cards.where("lessonId").equals(lessonId).delete();
    if (cardIds.length > 0) {
      await db.reviews.bulkDelete(cardIds);
    }
  });
}

export async function exportAllData(): Promise<string> {
  const [lessons, cards, reviews, attempts] = await Promise.all([
    db.lessons.toArray(),
    db.cards.toArray(),
    db.reviews.toArray(),
    db.attempts.toArray()
  ]);

  return JSON.stringify(
    {
      app: "aya-japan-tutor",
      exportedAt: new Date().toISOString(),
      lessons,
      cards,
      reviews,
      attempts
    },
    null,
    2
  );
}

