import { z } from "zod";

export const TranslatedWordSchema = z.object({
  id: z.object({
    translate: z.string(),
    index: z.number(),
  }),
  en: z.object({
    translate: z.string(),
    index: z.number(),
  }),
});

export const SymbolWordSchema = z.object({
  value: z.string(),
  translation: TranslatedWordSchema.nullish(),
  alternative: z
    .object({
      hiragana: z.string().optional(),
      katakana: z.string().optional(),
      kanji: z.string().optional(),
      romaji: z.string().optional(),
    })
    .partial()
    .nullish(),
});

export const GuessTheSentenceMeanSchema = z.object({
  type: z.literal("GUESS_THE_SENTENCE_MEAN"),
  data: z.object({
    options: z.array(TranslatedWordSchema),
    answer: TranslatedWordSchema,
    question: z.array(SymbolWordSchema),
  }),
});

export const SortTheMeansSchema = z.object({
  type: z.literal("SORT_THE_MEAN"),
  data: z.object({
    question: z.array(SymbolWordSchema),
    answer: TranslatedWordSchema,
    options: z.array(TranslatedWordSchema),
  }),
});

export const GuessTheSoundMeanSchema = z.object({
  type: z.literal("GUESS_THE_SOUND_MEAN"),
  data: z.object({
    options: z.array(TranslatedWordSchema),
    answer: TranslatedWordSchema,
    question: z.string(),
  }),
});

export const GuessTheSymbolFromMeanSchema = z.object({
  type: z.literal("GUESS_THE_SYMBOL_FROM_MEAN"),
  data: z.object({
    options: z.array(z.string()),
    answer: z.string(),
    question: z.array(SymbolWordSchema),
  }),
});

export const SortTheSymbolsFromSoundSchema = z.object({
  type: z.literal("SORT_THE_SYMBOLS_FROM_SOUND"),
  data: z.object({
    question: z.string(),
    answer: z.string(),
    options: z.array(z.string()),
  }),
});

export const SortTheSymbolsFromMeanSchema = z.object({
  type: z.literal("SORT_THE_SYMBOLS_FROM_MEAN"),
  data: z.object({
    question: z.array(SymbolWordSchema),
    answer: z.string(),
    options: z.array(z.string()),
  }),
});

export const WriteTheSymbolFromMeanSchema = z.object({
  type: z.literal("WRITE_THE_SYMBOL_FROM_MEAN"),
  data: z.object({
    question: z.array(SymbolWordSchema),
    answer: z.string(),
  }),
});

export const WriteTheSymbolFromSoundSchema = z.object({
  type: z.literal("WRITE_THE_SYMBOL_FROM_SOUND"),
  data: z.object({
    question: z.string(),
    answer: z.string(),
  }),
});

export const UnitQuestionTypeSchema = z.union([
  SortTheMeansSchema,
  GuessTheSoundMeanSchema,
  GuessTheSentenceMeanSchema,
  GuessTheSymbolFromMeanSchema,
  SortTheSymbolsFromMeanSchema,
  SortTheSymbolsFromSoundSchema,
  WriteTheSymbolFromMeanSchema,
  WriteTheSymbolFromSoundSchema,
]);

export const UnitQuestionSchema = z.object({
  category: z.literal("VOCABULARY").or(z.literal("GRAMMAR")),
  data: UnitQuestionTypeSchema,
});

export type TranslatedWord = z.infer<typeof TranslatedWordSchema>;

export type SymbolWord = z.infer<typeof SymbolWordSchema>;

export type GuessTheSentenceMean = z.infer<typeof GuessTheSentenceMeanSchema>;

export type SortTheMeans = z.infer<typeof SortTheMeansSchema>;

export type GuessTheSoundMean = z.infer<typeof GuessTheSoundMeanSchema>;

export type GuessTheSymbolFromMean = z.infer<
  typeof GuessTheSymbolFromMeanSchema
>;

export type SortTheSymbolsFromMean = z.infer<
  typeof SortTheSymbolsFromMeanSchema
>;

export type WriteTheSymbolFromMean = z.infer<
  typeof WriteTheSymbolFromMeanSchema
>;

export type WriteTheSymbolFromSound = z.infer<
  typeof WriteTheSymbolFromSoundSchema
>;

export type UnitQuestionType = z.infer<typeof UnitQuestionTypeSchema>;

export type UnitQuestion = z.infer<typeof UnitQuestionSchema>;

export function isGUESS_THE_SOUND_MEAN(
  question: UnitQuestionType
): question is GuessTheSoundMean {
  return question.type === "GUESS_THE_SOUND_MEAN";
}

export function isSORT_THE_MEAN(
  question: UnitQuestionType
): question is SortTheMeans {
  return question.type === "SORT_THE_MEAN";
}

export function isGUESS_THE_SENTENCE_MEAN(
  question: UnitQuestionType
): question is GuessTheSentenceMean {
  return question.type === "GUESS_THE_SENTENCE_MEAN";
}

export function isWRITE_THE_SYMBOL_FROM_MEAN(
  question: UnitQuestionType
): question is WriteTheSymbolFromMean {
  return question.type === "WRITE_THE_SYMBOL_FROM_MEAN";
}

export function isGUESS_THE_SYMBOL_FROM_MEAN(
  question: UnitQuestionType
): question is GuessTheSymbolFromMean {
  return question.type === "GUESS_THE_SYMBOL_FROM_MEAN";
}

export function isSORT_THE_SYMBOLS_FROM_MEAN(
  question: UnitQuestionType
): question is SortTheSymbolsFromMean {
  return question.type === "SORT_THE_SYMBOLS_FROM_MEAN";
}
