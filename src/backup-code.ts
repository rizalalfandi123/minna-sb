import { Hono } from "hono";
import { Prisma, PrismaClient } from "../generated/prisma";
import {
  CreateQuestionSchema,
  isGuessTheLetter,
  isGuessTheLetterSound,
  isGuessTheSymbol,
  isMatchingTextByText,
  isSortItemsBySound,
  UpdateQuestionSchema,
  type TCreateQuestionPayload,
} from "./schemas";
import { cors } from "hono/cors";
import { z } from "zod";

const app = new Hono();

app.use(cors({ origin: "*" }));

const prisma = new PrismaClient();

const findLetterOfQuestion = async (
  question: TCreateQuestionPayload["question"]
) => {
  const letters = await prisma.letters.findMany();

  const letterContext = letters.filter((letter) => {
    let result: Array<string> = [];

    if (isGuessTheLetter(question)) {
      result = question.data.options
        .map((option) => letters.find((item) => item.name === option) ?? null)
        .filter((item) => item !== null)
        .map((item) => item.symbol);
    }

    if (isGuessTheSymbol(question)) {
      result = question.data.options;
    }

    if (isGuessTheLetterSound(question)) {
      result = question.data.options;
    }

    if (isMatchingTextByText(question)) {
      result = question.data.options
        .map((side) => [side.leftSide, side.rightSide])
        .flat();
    }

    if (isSortItemsBySound(question)) {
      result = question.data.options.map((item) => item.value);
    }

    return result.some((item) => item === letter.symbol);
  });

  return letterContext;
};

export const updateLettersToLetterLevels = async ({
  levelId,
}: {
  levelId: string;
}) => {
  const letter_questions_to_letter_levels =
    await prisma.letter_questions_to_letter_levels.findMany({
      where: {
        letter_level_id: levelId,
      },
      include: {
        letter_questions: true,
      },
    });

  const getQuestionLetters = letter_questions_to_letter_levels.map(
    async (item) => {
      const question = item.letter_questions
        .question as TCreateQuestionPayload["question"];

      const letters = await findLetterOfQuestion(question);

      return letters;
    }
  );

  const questionLetters = await Promise.all(getQuestionLetters);

  const uniqQuestionLetters = new Map(
    questionLetters.flat().map((item) => [item.id, item])
  );

  const allQuestionLetters = Array.from(uniqQuestionLetters.values());

  await prisma.letters_to_letter_levels.createMany({
    data: allQuestionLetters.map((item) => ({
      letter_id: item.id,
      letter_level_id: levelId,
    })),
    skipDuplicates: true,
  });

  const letters_to_letter_levels =
    await prisma.letters_to_letter_levels.findMany({
      where: {
        letter_level_id: levelId,
      },
    });

  await prisma.letters_to_letter_levels.deleteMany({
    where: {
      letter_id: {
        in: letters_to_letter_levels
          .filter((item) =>
            allQuestionLetters.every(
              (question) => question.id !== item.letter_id
            )
          )
          .map((item) => item.letter_id),
      },
    },
  });
};

const createSigleLevelQuestion = async (
  body: Omit<TCreateQuestionPayload, "level_number"> & {
    level_number: number;
    questionNumber: number;
  },
  postQuestion: (
    data: TCreateQuestionPayload["question"]
  ) => Promise<Prisma.letter_questionsGetPayload<{}>>
) => {
  const { level_number, level_type, ...data } = body;

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

  const letterQuestion = await postQuestion(data.question);

  await prisma.letter_questions_to_letter_levels.upsert({
    where: {
      letter_question_id_letter_level_id: {
        letter_level_id: letterLevel.id,
        letter_question_id: letterQuestion.id,
      },
    },
    create: {
      letter_level_id: letterLevel.id,
      letter_question_id: letterQuestion.id,
      number: body.questionNumber,
    },
    update: {
      letter_level_id: letterLevel.id,
      letter_question_id: letterQuestion.id,
      number: body.questionNumber,
    },
  });

  await updateLettersToLetterLevels({ levelId: letterLevel.id });

  return { ...letterQuestion, level: letterLevel };
};

const createQuestion = async (body: unknown) => {
  const data = CreateQuestionSchema.parse(body);

  if (data.level_number.length > 1 && data.level_number[0]) {
    const letterQuestion = await createSigleLevelQuestion(
      {
        ...data,
        level_number: data.level_number[0].number,
        questionNumber: data.level_number[0].question_number,
      },
      (data) => prisma.letter_questions.create({ data: { question: data } })
    );

    const promises = data.level_number
      .filter((data) => data.number !== 0)
      .map((level, i) =>
        createSigleLevelQuestion(
          {
            ...data,
            level_number: level.number,
            questionNumber: level.question_number,
          },
          async () => letterQuestion
        )
      );

    const res = await Promise.all(promises);

    return res;
  } else {
    const promises = data.level_number.map((level, i) =>
      createSigleLevelQuestion(
        {
          ...data,
          level_number: level.number,
          questionNumber: level.question_number,
        },
        (data) => prisma.letter_questions.create({ data: { question: data } })
      )
    );

    const res = await Promise.all(promises);

    return res;
  }
};

const updateQuestion = async (body: unknown) => {
  const data = UpdateQuestionSchema.parse(body);

  if (data.level_number.length > 1 && data.level_number[0]) {
    const letterQuestion = await createSigleLevelQuestion(
      {
        ...data,
        level_number: data.level_number[0].number,
        questionNumber: data.level_number[0].question_number,
      },
      (payload) =>
        prisma.letter_questions.update({
          data: { question: payload },
          where: { id: data.id },
        })
    );

    const promises = data.level_number
      .filter((data) => data.number !== 0)
      .map((level, i) =>
        createSigleLevelQuestion(
          {
            ...data,
            level_number: level.number,
            questionNumber: level.question_number,
          },
          async () => letterQuestion
        )
      );

    const res = await Promise.all(promises);

    return res;
  } else {
    const promises = data.level_number.map((level, i) =>
      createSigleLevelQuestion(
        {
          ...data,
          level_number: level.number,
          questionNumber: level.question_number,
        },
        (payload) =>
          prisma.letter_questions.update({
            data: { question: payload },
            where: { id: data.id },
          })
      )
    );

    const res = await Promise.all(promises);

    return res;
  }
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
  .put(async (c) => {
    try {
      const body = await c.req.json();

      const res = await updateQuestion(body);

      return c.json(res);
    } catch (error) {
      return c.json({ error });
    }
  })
  .delete(async (c) => {
    try {
      const body = await c.req.json();

      const bodyData = z.object({ id: z.string() }).parse(body);

      const letterLevel =
        await prisma.letter_questions_to_letter_levels.findFirstOrThrow({
          where: {
            letter_question_id: bodyData.id,
          },
        });

      await prisma.letter_questions_to_letter_levels.deleteMany({
        where: {
          letter_question_id: bodyData.id,
        },
      });

      const res = await prisma.letter_questions.delete({
        where: {
          id: bodyData.id,
        },
      });

      await updateLettersToLetterLevels({
        levelId: letterLevel.letter_level_id,
      });

      return c.json(res);
    } catch (error) {
      return c.json({ error });
    }
  });

app.get("/letters", async (c) => {
  const letters = await prisma.letters.findMany();

  return c.json({
    letters,
  });
});

export default {
  port: 3001,
  fetch: app.fetch,
};
