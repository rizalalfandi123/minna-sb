import { z } from "zod";

export const LetterTypeSchema = z.enum(["hiragana", "katakana", "kanji"]);

const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  deleted: z.boolean().default(false),
});

const GuessTheLetterQuestionSchema = z.object({
  type: z.literal("GUESS_THE_LETTER"),
  letterType: LetterTypeSchema,
  data: z.object({
    options: z.array(z.string().min(1)),
    answer: z.string().min(1),
    question: z.string().min(1),
  }),
});

const GuessTheSymbolQuestionSchema = z.object({
  type: z.literal("GUESS_THE_SYMBOL"),
  letterType: LetterTypeSchema,
  data: GuessTheLetterQuestionSchema.shape.data,
});

const GuessTheLetterSoundQuestionSchema = z.object({
  type: z.literal("GUESS_THE_LETTER_SOUND"),
  letterType: LetterTypeSchema,
  data: GuessTheLetterQuestionSchema.shape.data,
});

const MatchingTextByTextQuestionSchema = z.object({
  type: z.literal("MATCHING_TEXT_BY_TEXT"),
  letterType: LetterTypeSchema,
  data: z.object({
    answer: z.array(
      z.object({ rightSide: z.string().min(1), leftSide: z.string().min(1) })
    ),
    options: z.array(
      z.object({ rightSide: z.string().min(1), leftSide: z.string().min(1) })
    ),
    isLeftSymbol: z.boolean(),
  }),
});

const SortItemsBySoundQuestionSchema = z.object({
  type: z.literal("SORT_THE_ITEMS_BY_SOUND"),
  letterType: LetterTypeSchema,
  data: z.object({
    answer: z.string().min(1),
    options: z.array(
      z.object({ number: z.number(), value: z.string().min(1) })
    ),
  }),
});

export const LetterQuestionTypeSchema = z.union([
  GuessTheLetterQuestionSchema,
  GuessTheSymbolQuestionSchema,
  GuessTheLetterSoundQuestionSchema,
  MatchingTextByTextQuestionSchema,
  SortItemsBySoundQuestionSchema,
]);

export const LetterQuestionSchema = z
  .object({
    question: LetterQuestionTypeSchema,
    number: z.number(),
  })
  .merge(BaseEntitySchema);

export const CreateQuestionSchema = LetterQuestionSchema.omit({
  id: true,
  number: true,
}).merge(
  z.object({
    level_number: z.array(
      z.object({
        number: z.number(),
        question_number: z.number(),
      })
    ),

    level_type: z.enum(["hiragana", "katakana", "kanji"]),
  })
);

export const UpdateQuestionSchema = CreateQuestionSchema.merge(
  z.object({ id: z.string() })
);

export type TCreateQuestionPayload = z.infer<typeof CreateQuestionSchema>;

export type TLetterQuestion = z.infer<typeof LetterQuestionSchema>;

export type TGuessTheLetter = z.infer<typeof GuessTheLetterQuestionSchema>;

export type TGuessTheSymbol = z.infer<typeof GuessTheSymbolQuestionSchema>;

export type TGuessTheLetterSound = z.infer<
  typeof GuessTheLetterSoundQuestionSchema
>;

export type TMatchingTextByText = z.infer<
  typeof MatchingTextByTextQuestionSchema
>;

export type TSortItemsBySound = z.infer<typeof SortItemsBySoundQuestionSchema>;

export function isGuessTheLetter(
  question: TLetterQuestion["question"]
): question is TGuessTheLetter {
  return question.type === "GUESS_THE_LETTER";
}

export function isGuessTheSymbol(
  question: TLetterQuestion["question"]
): question is TGuessTheSymbol {
  return question.type === "GUESS_THE_SYMBOL";
}

export function isGuessTheLetterSound(
  question: TLetterQuestion["question"]
): question is TGuessTheLetterSound {
  return question.type === "GUESS_THE_LETTER_SOUND";
}

export function isMatchingTextByText(
  question: TLetterQuestion["question"]
): question is TMatchingTextByText {
  return question.type === "MATCHING_TEXT_BY_TEXT";
}

export function isSortItemsBySound(
  question: TLetterQuestion["question"]
): question is TSortItemsBySound {
  return question.type === "SORT_THE_ITEMS_BY_SOUND";
}
