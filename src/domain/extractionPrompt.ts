export const youtubeGeminiLessonPrompt = `You are extracting one Japanese lesson from the current YouTube video for a local study app called Aya Japan Tutor.

Return ONLY valid JSON.
Do not use markdown.
Do not wrap the JSON in triple backticks.
Do not include comments.
Do not include any text before or after the JSON.

Goal:
Create a compact but useful study dataset for a beginner learner who cannot type Japanese yet and answers in romaji.
The study direction is Japanese -> English and English -> Japanese, but the typed answer is always romaji.

Language rules:
- Keep Japanese words/sentences in kana/kanji exactly when they appear in the lesson.
- Always include romaji for every Japanese word or sentence.
- Write "meaning", "summary", "body", "hint", and "note" in English.
- Quiz answers must be romaji only.
- If the video is unclear, use an empty string for that field or add "uncertain" in the note. Do not invent content.

Extract only material taught in this video:
- core theory and grammar points
- vocabulary
- example sentences
- mistakes or usage warnings from the teacher
- small quiz questions for romaji practice

Return this exact JSON shape:
{
  "title": "short lesson title",
  "source": {
    "type": "youtube",
    "title": "video title if known",
    "url": ""
  },
  "teacher": "teacher/channel name if known",
  "level": "absolute-beginner",
  "summary": "1-3 English sentences explaining what the lesson teaches",
  "theory": [
    {
      "heading": "short English heading",
      "body": "clear English explanation of the rule, usage, or warning"
    }
  ],
  "vocabulary": [
    {
      "kana": "これ",
      "kanji": "",
      "romaji": "kore",
      "meaning": "this; an object near the speaker",
      "note": "English usage note if useful"
    }
  ],
  "examples": [
    {
      "japanese": "これはペンです",
      "romaji": "kore wa pen desu",
      "meaning": "This is a pen.",
      "note": "English note about grammar or context"
    }
  ],
  "quiz": [
    {
      "prompt": "Type romaji for これ",
      "answer": "kore",
      "hint": "Near the speaker."
    },
    {
      "prompt": "Type romaji for: this",
      "answer": "kore",
      "hint": "Use the word from the lesson, not a full sentence."
    }
  ],
  "tags": ["youtube", "absolute-beginner", "romaji"]
}

Quantity targets:
- theory: 3-8 items
- vocabulary: 8-30 items, if the lesson has enough words
- examples: 5-20 items, if the lesson has enough examples
- quiz: 10-25 items

Quiz design:
- Prefer prompts like "Type romaji for これ" or "Type romaji: これはペンです".
- Also include English -> Japanese prompts like "Type romaji for: this" or "Type romaji for: This is a pen."
- The "answer" field must contain only the expected romaji.
- Make quiz items from real lesson content, not generic filler.

Before returning, self-check:
- Is the output parseable JSON?
- Are all keys double-quoted?
- Are there no trailing commas?
- Are all quiz answers romaji?
- Are English explanation fields useful for a beginner?
- Does the quiz cover both Japanese -> English recognition and English -> Japanese recall through romaji?`;
