import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma";
import { cors } from "hono/cors";
import { LetterQuestionTypeSchema, LetterTypeSchema } from "./schemas";
import { z } from "zod";
import { updateLettersToLetterLevels } from "./backup-code";

const app = new Hono();

app.use(cors({ origin: "*" }));

const prisma = new PrismaClient();

app
  .use("/letter-questions")
  .post(async (c) => {
    try {
      const body = await c.req.json();

      const validBody = LetterQuestionTypeSchema.parse(body);

      const res = await prisma.letter_questions.create({
        data: { question: validBody },
      });

      return c.json(res);
    } catch (error) {
      return c.json({ error });
    }
  })
  .put(async (c) => {
    try {
      const body = await c.req.json();

      const validBody = z
        .object({
          id: z.string(),
          question: LetterQuestionTypeSchema,
        })
        .parse(body);

      const res = await prisma.letter_questions.update({
        data: { question: validBody.question },
        where: { id: validBody.id },
      });

      return c.json(res);
    } catch (error) {
      return c.json({ error });
    }
  })
  .delete(async (c) => {
    try {
      const body = await c.req.json();

      const validBody = z
        .object({
          id: z.string(),
        })
        .parse(body);

      const res = await prisma.letter_questions.delete({
        where: { id: validBody.id },
      });

      return c.json(res);
    } catch (error) {
      return c.json({ error });
    }
  });

app.post("/unapply-level", async (c) => {
  try {
    const body = await c.req.json();

    const validBody = z
      .object({
        questionId: z.string(),
        levelId: z.string(),
        letterType: LetterTypeSchema,
      })
      .parse(body);

    const res = await prisma.letter_questions_to_letter_levels.delete({
      where: {
        letter_question_id_letter_level_id: {
          letter_level_id: validBody.levelId,
          letter_question_id: validBody.questionId,
        },
      },
    });

    return c.json(res);
  } catch (error) {
    return c.json({ error });
  }
});

app.post("/apply-level", async (c) => {
  try {
    const body = await c.req.json();

    const validBody = z
      .object({
        questionId: z.string(),
        levelNumber: z.coerce.number(),
        number: z.coerce.number(),
        letterType: LetterTypeSchema,
      })
      .parse(body);

    const letterType = await prisma.letter_types.findFirstOrThrow({
      where: {
        name: validBody.letterType,
      },
    });

    let levelData = await prisma.letter_levels.findFirst({
      where: { number: { equals: validBody.levelNumber } },
    });

    if (!levelData) {
      levelData = await prisma.letter_levels.create({
        data: {
          number: validBody.levelNumber,
          letter_type_id: letterType.id,
        },
      });
    }

    if (!levelData) {
      throw new Error("No level data");
    }

    const res = await prisma.letter_questions_to_letter_levels.upsert({
      where: {
        letter_question_id_letter_level_id: {
          letter_level_id: levelData.id,
          letter_question_id: validBody.questionId,
        },
      },
      create: {
        letter_level_id: levelData.id,
        number: validBody.number,
        letter_question_id: validBody.questionId,
      },
      update: {
        letter_level_id: levelData.id,
        number: validBody.number,
        letter_question_id: validBody.questionId,
      },
    });

    await updateLettersToLetterLevels({ levelId: levelData.id });

    return c.json(res);
  } catch (error) {
    return c.json({ error });
  }
});

export default {
  port: 3001,
  fetch: app.fetch,
};
