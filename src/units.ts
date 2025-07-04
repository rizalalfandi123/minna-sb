import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma";
import { z } from "zod";
import {
  isGUESS_THE_SENTENCE_MEAN,
  isGUESS_THE_SOUND_MEAN,
  isGUESS_THE_SYMBOL_FROM_MEAN,
  isSORT_THE_MEAN,
  isSORT_THE_SYMBOLS_FROM_MEAN,
  isWRITE_THE_SYMBOL_FROM_MEAN,
  SymbolWordSchema,
  TranslatedWordSchema,
  UnitQuestionSchema,
  type GuessTheSentenceMean,
  type GuessTheSoundMean,
  type GuessTheSymbolFromMean,
  type SortTheMeans,
  type SortTheSymbolsFromMean,
  type WriteTheSymbolFromMean,
  type WriteTheSymbolFromSound,
} from "./units/unit-question-schema";
import buildBlockHierarcy, { type TUnitQuestion } from "./unit-hierarcy";
import lodash from "lodash";

const app = new Hono();

const prisma = new PrismaClient();

app.post("/create-unit-question", async (c) => {
  try {
    const body = await c.req.json();

    const schema = z.object({
      questions: z.array(UnitQuestionSchema),
      key: z.string(),
    });

    const validBody = schema.parse(body);

    const similarQuestion = await prisma.unit_questions.findMany({
      where: {
        key: {
          equals: validBody.key,
        },
      },
    });

    const sameQuestion = similarQuestion.find((question) =>
      validBody.questions.some((newQuestion) =>
        lodash.isEqual(newQuestion, question.question)
      )
    );

    if (sameQuestion) {
      throw { sameQuestion };
    }

    for (let index = 0; index < validBody.questions.length; index++) {
      const element = validBody.questions[index];

      await prisma.unit_questions.create({
        data: { question: element, key: validBody.key },
      });
    }

    const results = await prisma.unit_questions.findMany({
      where: {
        key: {
          equals: validBody.key,
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return c.json(results);
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

app.post("/generate-unit-question-from-word", async (c) => {
  try {
    const body = await c.req.json();

    const schema = z.object({
      word: SymbolWordSchema.omit({ translation: true }).merge(
        z.object({
          translation: TranslatedWordSchema,
        })
      ),
      meanOptions: z.array(TranslatedWordSchema),
      kanaOptions: z.array(z.string()),
    });

    const bodyData = schema.parse(body);

    const guessTheSentenceMean: GuessTheSentenceMean = {
      type: "GUESS_THE_SENTENCE_MEAN",
      data: {
        answer: bodyData.word.translation,
        options: bodyData.meanOptions,
        question: [bodyData.word],
      },
    };

    const sortMean: SortTheMeans = {
      type: "SORT_THE_MEAN",
      data: {
        answer: bodyData.word.translation,
        options: bodyData.meanOptions,
        question: [bodyData.word],
      },
    };

    const guessTheSoundMean: GuessTheSoundMean = {
      type: "GUESS_THE_SOUND_MEAN",
      data: {
        answer: bodyData.word.translation,
        options: bodyData.meanOptions,
        question: bodyData.word.value,
      },
    };

    const guessTheSymbolFromMean: GuessTheSymbolFromMean = {
      type: "GUESS_THE_SYMBOL_FROM_MEAN",
      data: {
        answer: bodyData.word.value,
        options: bodyData.kanaOptions,
        question: [bodyData.word],
      },
    };

    const sortTheSymbolFromMean: SortTheSymbolsFromMean = {
      type: "SORT_THE_SYMBOLS_FROM_MEAN",
      data: {
        answer: bodyData.word.value,
        options: bodyData.kanaOptions,
        question: [bodyData.word],
      },
    };

    const writeSymbolFromMean: WriteTheSymbolFromMean = {
      type: "WRITE_THE_SYMBOL_FROM_MEAN",
      data: {
        answer: bodyData.word.value,
        question: [bodyData.word],
      },
    };

    const writeTheSymbolFromSound: WriteTheSymbolFromSound = {
      type: "WRITE_THE_SYMBOL_FROM_SOUND",
      data: {
        answer: bodyData.word.value,
        question: bodyData.word.value,
      },
    };

    const response = await Promise.all(
      [
        guessTheSentenceMean,
        sortMean,
        guessTheSoundMean,
        guessTheSymbolFromMean,
        sortTheSymbolFromMean,
        writeSymbolFromMean,
        writeTheSymbolFromSound,
      ].map((question) =>
        prisma.unit_questions.create({
          data: {
            question: {
              category: "VOCABULARY",
              data: question,
            },
            key: bodyData.word.value,
          },
        })
      )
    );

    return c.json(response);
  } catch (error) {
    return c.json({ error });
  }
});

app.get("/block-questions", async (c) => {
  try {
    const unitQuestions = await prisma.unit_questions.findMany({
      include: {
        unit_questions_to_unit_levels: {
          include: {
            unit_levels: {
              select: {
                number: true,
              },
            },
          },
        },
      },
    });

    const block = new Map<
      string,
      Array<{ question: (typeof unitQuestions)[number] }>
    >();

    for (let index = 0; index < unitQuestions.length; index++) {
      const element = unitQuestions[index];

      if (element.key) {
        const nextValue = block.get(element.key) ?? [];

        nextValue.push({ question: element });

        block.set(element.key, nextValue);
      }
    }

    const perBlockData = Array.from(block.entries()).map(([key, questions]) => {
      const questionPerType = new Map<
        number,
        Array<{
          questionNumber: number;
          questionType: string;
          withHint: boolean;
        }>
      >();

      questions.forEach(({ question }) => {
        for (
          let index = 0;
          index < question.unit_questions_to_unit_levels.length;
          index++
        ) {
          const element = question.unit_questions_to_unit_levels[index];

          const key = element.unit_levels.number;

          const nextValue = questionPerType.get(key) ?? [];

          nextValue.push({
            questionNumber: Number(element.number),
            withHint: element.with_hint,
            questionType: (question.question as { data: { type: string } }).data
              .type,
          });

          questionPerType.set(
            key,
            nextValue.sort((a, b) => a.questionNumber - b.questionNumber)
          );
        }
      });

      const totalUsed = Array.from(questionPerType.values()).flat().length;

      return {
        [key]: {
          questionCount: questions.length,
          // questionUsed: Object.fromEntries(questionPerType.entries()),
          totalUsed,
        },
      };
    });

    return c.json(perBlockData);
  } catch (error) {
    console.log("error", error);

    return c.json({ error });
  }
});

app.get("/level-questions", async (c) => {
  try {
    const res = await prisma.unit_levels.findMany({
      include: {
        unit_questions_to_unit_levels: {
          select: {
            unit_question_id: true,
          },
        },
      },
      orderBy: {
        number: "asc",
      },
    });

    const levelWithCount = res.map(
      ({ unit_questions_to_unit_levels, ...levelData }) => {
        return {
          ...levelData,
          questionCount: unit_questions_to_unit_levels.length,
        };
      }
    );

    return c.json(levelWithCount);
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

app.post("/delete-block-by-key", async (c) => {
  try {
    const schema = z.object({
      keys: z.array(z.string()),
    });

    const body = await c.req.json();

    const validBody = schema.parse(body);

    const data = await prisma.unit_questions_to_unit_levels.findMany({
      where: {
        unit_questions: {
          key: {
            in: validBody.keys,
          },
        },
      },
    });

    const response = await prisma.unit_questions_to_unit_levels.deleteMany({
      where: {
        unit_questions: {
          key: {
            in: validBody.keys,
          },
        },
      },
    });

    return c.json({ response, data });
  } catch (error) {
    console.log("error", error);

    return c.json({ error });
  }
});

app.post("/delete-question-by-key", async (c) => {
  try {
    const schema = z.object({
      keys: z.array(z.string()),
    });

    const body = await c.req.json();

    const validBody = schema.parse(body);

    const data = await prisma.unit_questions.findMany({
      where: {
        key: {
          in: validBody.keys,
        },
      },
    });

    const response = await prisma.unit_questions.deleteMany({
      where: {
        key: {
          in: validBody.keys,
        },
      },
    });

    return c.json({ response, data });
  } catch (error) {
    console.log("error", error);

    return c.json({ error });
  }
});

app.post("/apply-unit-question-to-block", async (c) => {
  try {
    const hieracy = await buildBlockHierarcy();

    const dataPerLevel = hieracy
      .flatMap((item) => item.units)
      .flatMap((unit) => unit.blocks);

    const res = await prisma.unit_questions_to_unit_levels.createMany({
      data: dataPerLevel
        .map((level) => {
          const allData = level.levels.map((question, i) => ({
            unit_question_id: question.id,
            number: i + 1,
            unit_level_id: level.levelId,
            with_hint: question.withHint,
          }));

          return allData;
        })
        .flat(),
      skipDuplicates: true,
    });

    return c.json(res);
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

export default app;
