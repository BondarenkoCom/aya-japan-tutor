export const youtubeGeminiLessonPrompt = `From this video, extract Japanese study items.

Format exactly:
Japanese | Romaji | English

Max 20 rows.
No intro.
No explanation.`;

export const youtubeGeminiTheoryPrompt = `From this video, extract 5 short grammar or usage notes.

Format exactly:
Title | Explanation

Use English only.
No intro.
No explanation outside the table.`;

export const youtubeGeminiQuizPrompt = `From this video, create 8 quiz questions.

Format exactly:
Prompt | Answer | Hint

Answers must be romaji only.
Use English prompts or Japanese prompts.
No intro.
No explanation outside the table.`;
