import { z } from "zod";
import type { LessonRecord, StudyCard } from "../domain/types";

const Textish = z.union([z.string(), z.number(), z.boolean()]).optional();

const SourceSchema = z
  .object({
    type: z.string().optional(),
    title: z.string().optional(),
    url: z.string().optional()
  })
  .passthrough()
  .optional();

const TheorySchema = z
  .object({
    id: z.string().optional(),
    heading: Textish,
    title: Textish,
    body: Textish,
    text: Textish,
    explanation: Textish,
    notes: Textish
  })
  .passthrough();

const ExampleSchema = z
  .object({
    id: z.string().optional(),
    japanese: Textish,
    kana: Textish,
    sentence: Textish,
    phrase: Textish,
    romaji: Textish,
    romanji: Textish,
    meaning: Textish,
    english: Textish,
    translation: Textish,
    note: Textish,
    notes: Textish
  })
  .passthrough();

const VocabularySchema = z
  .object({
    id: z.string().optional(),
    kana: Textish,
    kanji: Textish,
    japanese: Textish,
    word: Textish,
    romaji: Textish,
    romanji: Textish,
    meaning: Textish,
    english: Textish,
    translation: Textish,
    note: Textish,
    notes: Textish
  })
  .passthrough();

const QuizSchema = z
  .object({
    id: z.string().optional(),
    prompt: Textish,
    question: Textish,
    answer: Textish,
    romaji: Textish,
    hint: Textish,
    explanation: Textish
  })
  .passthrough();

const LessonSchema = z
  .object({
    title: Textish,
    name: Textish,
    source: SourceSchema,
    sourceUrl: Textish,
    source_url: Textish,
    teacher: Textish,
    level: Textish,
    summary: Textish,
    description: Textish,
    theory: z.array(TheorySchema).optional(),
    grammar: z.array(TheorySchema).optional(),
    notes: z.union([z.array(TheorySchema), z.string()]).optional(),
    sections: z.array(TheorySchema).optional(),
    examples: z.array(ExampleSchema).optional(),
    sentences: z.array(ExampleSchema).optional(),
    phrases: z.array(ExampleSchema).optional(),
    vocabulary: z.array(VocabularySchema).optional(),
    vocab: z.array(VocabularySchema).optional(),
    words: z.array(VocabularySchema).optional(),
    quiz: z.array(QuizSchema).optional(),
    questions: z.array(QuizSchema).optional(),
    flashcards: z.array(QuizSchema).optional(),
    tags: z.array(z.string()).optional()
  })
  .passthrough();

const WrapperSchema = z.union([
  LessonSchema,
  z.object({ lesson: LessonSchema }).passthrough(),
  z.object({ data: LessonSchema }).passthrough(),
  z.object({ lessons: z.array(LessonSchema).min(1) }).passthrough()
]);

function asText(value: unknown, fallback = ""): string {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function extractJsonText(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstObject = trimmed.indexOf("{");
  const lastObject = trimmed.lastIndexOf("}");
  if (firstObject >= 0 && lastObject > firstObject) {
    return trimmed.slice(firstObject, lastObject + 1);
  }

  const firstArray = trimmed.indexOf("[");
  const lastArray = trimmed.lastIndexOf("]");
  if (firstArray >= 0 && lastArray > firstArray) {
    return trimmed.slice(firstArray, lastArray + 1);
  }

  return trimmed;
}

function unwrapLesson(value: unknown): z.infer<typeof LessonSchema> {
  const wrapper = value as { lesson?: unknown; data?: unknown; lessons?: unknown[] };
  const candidate =
    wrapper.lesson ??
    wrapper.data ??
    (Array.isArray(wrapper.lessons) ? wrapper.lessons[0] : undefined) ??
    value;

  return LessonSchema.parse(candidate);
}

function normalizeTheory(raw: z.infer<typeof LessonSchema>): LessonRecord["theory"] {
  const source = [
    ...(raw.theory ?? []),
    ...(raw.grammar ?? []),
    ...(Array.isArray(raw.notes) ? raw.notes : []),
    ...(raw.sections ?? [])
  ];

  if (typeof raw.notes === "string" && raw.notes.trim()) {
    source.push({ heading: "Lesson notes", body: raw.notes });
  }

  return source
    .map((item, index) => ({
      id: item.id ?? makeId("theory"),
      heading: asText(item.heading ?? item.title, `Theory ${index + 1}`),
      body: asText(item.body ?? item.text ?? item.explanation ?? item.notes)
    }))
    .filter((item) => item.heading || item.body);
}

function normalizeExamples(raw: z.infer<typeof LessonSchema>): LessonRecord["examples"] {
  return [...(raw.examples ?? []), ...(raw.sentences ?? []), ...(raw.phrases ?? [])]
    .map((item) => ({
      id: item.id ?? makeId("example"),
      japanese: asText(item.japanese ?? item.sentence ?? item.phrase) || undefined,
      kana: asText(item.kana) || undefined,
      romaji: asText(item.romaji ?? item.romanji),
      meaning: asText(item.meaning ?? item.english ?? item.translation),
      note: asText(item.note ?? item.notes) || undefined
    }))
    .filter((item) => item.romaji && item.meaning);
}

function normalizeVocabulary(raw: z.infer<typeof LessonSchema>): LessonRecord["vocabulary"] {
  return [...(raw.vocabulary ?? []), ...(raw.vocab ?? []), ...(raw.words ?? [])]
    .map((item) => ({
      id: item.id ?? makeId("vocab"),
      kana: asText(item.kana ?? item.japanese ?? item.word) || undefined,
      kanji: asText(item.kanji) || undefined,
      romaji: asText(item.romaji ?? item.romanji),
      meaning: asText(item.meaning ?? item.english ?? item.translation),
      note: asText(item.note ?? item.notes) || undefined
    }))
    .filter((item) => item.romaji && item.meaning);
}

function normalizeQuiz(raw: z.infer<typeof LessonSchema>): LessonRecord["quiz"] {
  return [...(raw.quiz ?? []), ...(raw.questions ?? []), ...(raw.flashcards ?? [])]
    .map((item, index) => ({
      id: item.id ?? makeId("quiz"),
      prompt: asText(item.prompt ?? item.question, `Question ${index + 1}`),
      answer: asText(item.answer ?? item.romaji),
      hint: asText(item.hint ?? item.explanation) || undefined
    }))
    .filter((item) => item.prompt && item.answer);
}

export function parseLessonJson(raw: string): LessonRecord {
  const jsonText = extractJsonText(raw);
  const parsed = JSON.parse(jsonText) as unknown;
  const wrapped = WrapperSchema.parse(parsed);
  const lesson = unwrapLesson(wrapped);
  const now = new Date().toISOString();
  const source = lesson.source ?? {};
  const sourceUrl = asText(lesson.sourceUrl ?? lesson.source_url ?? source.url);

  return {
    id: makeId("lesson"),
    title: asText(lesson.title ?? lesson.name, "Untitled Japanese lesson"),
    source: {
      type: source.type === "youtube" || source.type === "manual" || source.type === "other" ? source.type : sourceUrl ? "youtube" : "manual",
      title: asText(source.title) || undefined,
      url: sourceUrl || undefined
    },
    teacher: asText(lesson.teacher) || undefined,
    level: asText(lesson.level, "beginner"),
    summary: asText(lesson.summary ?? lesson.description, "Imported lesson"),
    theory: normalizeTheory(lesson),
    examples: normalizeExamples(lesson),
    vocabulary: normalizeVocabulary(lesson),
    quiz: normalizeQuiz(lesson),
    tags: lesson.tags ?? [],
    createdAt: now,
    updatedAt: now
  };
}

export function buildStudyCards(lesson: LessonRecord): StudyCard[] {
  const now = new Date().toISOString();
  const cards: StudyCard[] = [];

  for (const item of lesson.vocabulary) {
    const visible = item.kana || item.kanji || item.meaning;
    cards.push({
      id: makeId("card"),
      lessonId: lesson.id,
      kind: "vocabulary-romaji",
      prompt: `Type romaji for ${visible}`,
      answer: item.romaji,
      displayAnswer: `${item.romaji} - ${item.meaning}`,
      hint: item.note || item.meaning,
      tags: ["vocabulary", ...lesson.tags],
      createdAt: now
    });
  }

  for (const item of lesson.examples) {
    const visible = item.japanese || item.kana || item.meaning;
    cards.push({
      id: makeId("card"),
      lessonId: lesson.id,
      kind: "example-romaji",
      prompt: `Type romaji: ${visible}`,
      answer: item.romaji,
      displayAnswer: `${item.romaji} - ${item.meaning}`,
      hint: item.note || item.meaning,
      tags: ["example", ...lesson.tags],
      createdAt: now
    });
  }

  for (const item of lesson.quiz) {
    cards.push({
      id: makeId("card"),
      lessonId: lesson.id,
      kind: "quiz",
      prompt: item.prompt,
      answer: item.answer,
      displayAnswer: item.answer,
      hint: item.hint,
      tags: ["quiz", ...lesson.tags],
      createdAt: now
    });
  }

  return cards;
}
