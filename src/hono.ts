import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma";
import {
  isGuessTheLetter,
  isGuessTheLetterSound,
  isGuessTheSymbol,
  isMatchingTextByText,
  isSortItemsBySound,
  LetterQuestionSchema,
} from "./schemas";
import { z } from "zod";

const app = new Hono();

const prisma = new PrismaClient();

const CreateQuestionSchema = LetterQuestionSchema.omit({
  id: true,
  number: true,
}).merge(
  z.object({
    level_number: z.number(),
    level_type: z.enum(["hiragana", "katakana", "kanji"]),
  })
);

const createQuestion = async (body: unknown) => {
  const { level_number, level_type, ...data } =
    CreateQuestionSchema.parse(body);

  const letterType = await prisma.letter_types.findFirstOrThrow({
    where: {
      name: {
        equals: level_type,
      },
    },
  });

  let letterLevel = await prisma.letter_levels.findFirst({
    where: { number: level_number, letter_type_id: letterType.id },
  });

  if (!letterLevel) {
    letterLevel = await prisma.letter_levels.create({
      data: {
        number: level_number,
        letter_type_id: letterType.id,
      },
    });
  }

  const letterQuestions =
    await prisma.letter_questions_to_letter_levels.findMany({
      include: {
        letter_questions: true,
      },
      where: {
        letter_level_id: { equals: letterLevel.id },
      },
    });

  const lastNumber = Math.max(
    0,
    ...letterQuestions.map((item) => item.number)
  );

  const letterQuestion = await prisma.letter_questions.create({
    data: data,
  });

  await prisma.letter_questions_to_letter_levels.create({
    data: {
      letter_level_id: letterLevel.id,
      letter_question_id: letterQuestion.id,
      number: lastNumber + 1
    },
  });

  const letters = await prisma.letters.findMany();

  const letterContext = letters.filter((letter) => {
    let letters: Array<string> = [];

    if (isGuessTheLetter(data.question)) {
      letters = [data.question.data.question];
    }

    if (isGuessTheSymbol(data.question)) {
      letters = data.question.data.options;
    }

    if (isGuessTheLetterSound(data.question)) {
      letters = data.question.data.options;
    }

    if (isMatchingTextByText(data.question)) {
      letters = data.question.data.options
        .map((side) => [side.leftSide, side.rightSide])
        .flat();
    }

    if (isSortItemsBySound(data.question)) {
      letters = data.question.data.options.map((item) => item.value);
    }

    return letters.some((item) => item === letter.symbol);
  });

  await prisma.letters_to_letter_levels.createMany({
    data: letterContext.map((letter) => ({
      letter_id: letter.id,
      letter_level_id: letterLevel.id,
    })),
    skipDuplicates: true,
  });

  return { ...letterQuestion, level: letterLevel };
};

app
  .get("/letter-questions", async (c) => {
    try {
      const letterQuestions = await prisma.letter_questions.findMany();

      return c.json(letterQuestions);
    } catch (error) {
      return c.json({ error });
    }
  })
  .post(async (c) => {
    try {
      const body = await c.req.json();

      const res = await createQuestion(body);

      return c.json(res);
    } catch (error) {
      return c.json({ error });
    }
  })
  .patch(async (c) => {
    try {
      const body = await c.req.json();

      const data = LetterQuestionSchema.omit({ id: true })
        .partial()
        .merge(LetterQuestionSchema.pick({ id: true }))
        .parse(body);

      const letterQuestion = await prisma.letter_questions.update({
        data,
        where: { id: data.id },
      });

      return c.json(letterQuestion);
    } catch (error) {
      return c.json({ error });
    }
  });

export default {
  port: 3001,
  fetch: app.fetch,
};
