import { z } from "zod";

const WordSchema = z.object({
  value: z.string(),
  key: z.string(),
});

export const GuessTheSentenceMeanSchema = z.object({
  type: z.literal("GUESS_THE_SENTENCE_MEAN"),
  data: z.object({
    options: z.object({
      en: z.array(z.string()),
      id: z.array(z.string()),
    }),
    answer: z.object({
      en: z.string(),
      id: z.string(),
    }),
    question: z.array(WordSchema),
  }),
});

export const SortTheMeansSchema = z.object({
  type: z.literal("SORT_THE_MEAN"),
  data: GuessTheSentenceMeanSchema.shape.data,
});

export const GuessTheSoundMeanSchema = z.object({
  type: z.literal("GUESS_THE_SOUND_MEAN"),
  data: z.object({
    options: z.object({
      en: z.array(z.string()),
      id: z.array(z.string()),
    }),
    answer: z.object({
      en: z.string(),
      id: z.string(),
    }),
    question: z.string(),
  }),
});

export const GuessTheSymbolFromMeanSchema = z.object({
  type: z.literal("GUESS_THE_SYMBOL_FROM_MEAN"),
  data: z.object({
    options: z.array(z.string()),
    answer: z.string(),
    question: z.object({
      en: z.array(WordSchema),
      id: z.array(WordSchema),
    }),
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
  data: GuessTheSymbolFromMeanSchema.shape.data,
});

export const WriteTheSymbolFromMeanSchema = z.object({
  type: z.literal("WRITE_THE_SYMBOL_FROM_MEAN"),
  data: z.object({
    question: z.object({
      en: z.array(WordSchema),
      id: z.array(WordSchema),
    }),
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

export const UnitQuestionSchema = UnitQuestionTypeSchema;

export type GuessTheSentenceMean = z.infer<typeof GuessTheSentenceMeanSchema>;

export type SortTheMeans = z.infer<typeof SortTheMeansSchema>;

export type GuessTheSoundMean = z.infer<typeof GuessTheSoundMeanSchema>;

export type SortTheSymbolsFromSound = z.infer<
  typeof SortTheSymbolsFromSoundSchema
>;

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
