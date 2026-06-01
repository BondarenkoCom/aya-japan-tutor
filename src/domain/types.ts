export type ScriptKind = "hiragana" | "katakana";

export interface KanaSymbol {
  id: string;
  script: ScriptKind;
  kana: string;
  romaji: string;
  row: string;
  column: string;
}

export interface LessonSource {
  type?: "youtube" | "manual" | "other";
  title?: string;
  url?: string;
}

export interface TheoryBlock {
  id: string;
  heading: string;
  body: string;
}

export interface LessonExample {
  id: string;
  japanese?: string;
  kana?: string;
  romaji: string;
  meaning: string;
  note?: string;
}

export interface VocabularyItem {
  id: string;
  kana?: string;
  kanji?: string;
  romaji: string;
  meaning: string;
  note?: string;
}

export interface QuizPrompt {
  id: string;
  prompt: string;
  answer: string;
  hint?: string;
}

export interface LessonRecord {
  id: string;
  title: string;
  source: LessonSource;
  teacher?: string;
  level: string;
  summary: string;
  theory: TheoryBlock[];
  examples: LessonExample[];
  vocabulary: VocabularyItem[];
  quiz: QuizPrompt[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type CardKind = "kana-romaji" | "vocabulary-romaji" | "example-romaji" | "quiz";

export interface StudyCard {
  id: string;
  lessonId: string;
  kind: CardKind;
  prompt: string;
  answer: string;
  displayAnswer: string;
  hint?: string;
  tags: string[];
  createdAt: string;
}

export interface ReviewState {
  cardId: string;
  dueAt: string;
  intervalDays: number;
  ease: number;
  correctStreak: number;
  mistakes: number;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  mode: string;
  score: number;
  total: number;
  wrongCardIds: string[];
  createdAt: string;
}

export type AyaMood = "idle" | "thinking" | "success" | "wrong" | "saved" | "warning";

export interface AyaCue {
  mood: AyaMood;
  bubble: string;
}

