import { describe, expect, it } from "vitest";
import { buildStudyCards, parseLessonJson } from "../services/importer";

describe("lesson importer", () => {
  it("parses fenced Gemini-style JSON and builds cards", () => {
    const payload = {
      lesson: {
        title: "Kore lesson",
        source_url: "https://youtube.example/watch",
        notes: "Kore means this.",
        vocabulary: [{ kana: "\u3053\u308c", romaji: "kore", meaning: "this" }],
        examples: [{ japanese: "\u3053\u308c\u306f\u30da\u30f3\u3067\u3059", romaji: "kore wa pen desu", meaning: "This is a pen." }],
        questions: [{ question: "Type romaji for \u305d\u308c", answer: "sore" }]
      }
    };
    const lesson = parseLessonJson(`\`\`\`json\n${JSON.stringify(payload)}\n\`\`\``);

    expect(lesson.title).toBe("Kore lesson");
    expect(lesson.source.url).toBe("https://youtube.example/watch");
    expect(lesson.theory).toHaveLength(1);
    expect(buildStudyCards(lesson)).toHaveLength(3);
  });
});
