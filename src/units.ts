import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma";
import { object, z } from "zod";
import {
  isGUESS_THE_SENTENCE_MEAN,
  isGUESS_THE_SOUND_MEAN,
  isGUESS_THE_SYMBOL_FROM_MEAN,
  isSORT_THE_MEAN,
  isSORT_THE_SYMBOLS_FROM_MEAN,
  isWRITE_THE_SYMBOL_FROM_MEAN,
  UnitQuestionSchema,
  type GuessTheSentenceMean,
  type GuessTheSoundMean,
  type GuessTheSymbolFromMean,
  type SortTheMeans,
  type SortTheSymbolsFromMean,
  type SortTheSymbolsFromSound,
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

app.post("/generate-vocab-question-from-word-block", async (c) => {
  try {
    const body = await c.req.json();

    const schema = z.object({
      words: z.array(z.string()),
    });

    const bodyData = schema.parse(body);

    const words = await Promise.all(
      bodyData.words.map(async (word) => {
        const data = await prisma.words.findFirstOrThrow({
          where: {
            key: word,
          },
        });

        return { key: word, word: data };
      })
    );

    const guessTheSentenceMean: Array<{
      question: GuessTheSentenceMean;
      key: string;
    }> = words.map(({ word, key }) => {
      const data: GuessTheSentenceMean = {
        type: "GUESS_THE_SENTENCE_MEAN",
        data: {
          answer: {
            en: word.en.replace(/\s*\(.*?\)/g, ""),
            id: word.id.replace(/\s*\(.*?\)/g, ""),
          },
          options: {
            en: words.map((item) => item.word.en.replace(/\s*\(.*?\)/g, "")),
            id: words.map((item) => item.word.id.replace(/\s*\(.*?\)/g, "")),
          },
          question: [
            {
              value: key,
              key,
            },
          ],
        },
      };

      return { question: data, key };
    });

    const sortMean: Array<{
      question: SortTheMeans;
      key: string;
    }> = words.map(({ word, key }) => {
      const data: SortTheMeans = {
        type: "SORT_THE_MEAN",
        data: {
          answer: {
            en: word.en.replace(/\s*\(.*?\)/g, ""),
            id: word.id.replace(/\s*\(.*?\)/g, ""),
          },
          options: {
            en: words.map((item) => item.word.en.replace(/\s*\(.*?\)/g, "")),
            id: words.map((item) => item.word.id.replace(/\s*\(.*?\)/g, "")),
          },
          question: [
            {
              value: key,
              key,
            },
          ],
        },
      };

      return { question: data, key };
    });

    const guessTheSoundMean: Array<{
      question: GuessTheSoundMean;
      key: string;
    }> = words.map(({ word, key }) => {
      const data: GuessTheSoundMean = {
        type: "GUESS_THE_SOUND_MEAN",
        data: {
          answer: {
            en: word.en.replace(/\s*\(.*?\)/g, ""),
            id: word.id.replace(/\s*\(.*?\)/g, ""),
          },
          options: {
            en: words.map((item) => item.word.en.replace(/\s*\(.*?\)/g, "")),
            id: words.map((item) => item.word.id.replace(/\s*\(.*?\)/g, "")),
          },
          question: key,
        },
      };

      return { question: data, key };
    });

    const guessTheSymbolFromMean: Array<{
      question: GuessTheSymbolFromMean;
      key: string;
    }> = words.map(({ key, word }) => {
      const data: GuessTheSymbolFromMean = {
        type: "GUESS_THE_SYMBOL_FROM_MEAN",
        data: {
          answer: key,
          options: words.map((item) => item.word.key),
          question: {
            en: [
              {
                key,
                value: word.en,
              },
            ],
            id: [
              {
                key,
                value: word.id,
              },
            ],
          },
        },
      };

      return { question: data, key };
    });

    const sortTheSymbolFromMean: Array<{
      question: SortTheSymbolsFromMean;
      key: string;
    }> = words.map(({ key, word }) => {
      const data: SortTheSymbolsFromMean = {
        type: "SORT_THE_SYMBOLS_FROM_MEAN",
        data: {
          answer: key,
          options: words.map((item) => item.word.key),
          question: {
            en: [
              {
                key,
                value: word.en,
              },
            ],
            id: [
              {
                key,
                value: word.id,
              },
            ],
          },
        },
      };

      return { question: data, key };
    });

    const sortTheSymbolFromSound: Array<{
      question: SortTheSymbolsFromSound;
      key: string;
    }> = words.map(({ key, word }) => {
      const data: SortTheSymbolsFromSound = {
        type: "SORT_THE_SYMBOLS_FROM_SOUND",
        data: {
          answer: key,
          options: words.map((item) => item.word.key),
          question: key,
        },
      };

      return { question: data, key };
    });

    const writeSymbolFromMean: Array<{
      question: WriteTheSymbolFromMean;
      key: string;
    }> = words.map(({ key, word }) => {
      const data: WriteTheSymbolFromMean = {
        type: "WRITE_THE_SYMBOL_FROM_MEAN",
        data: {
          answer: key,
          question: {
            en: [
              {
                key,
                value: word.en,
              },
            ],
            id: [
              {
                key,
                value: word.id,
              },
            ],
          },
        },
      };

      return { question: data, key };
    });

    const writeTheSymbolFromSound: Array<{
      question: WriteTheSymbolFromSound;
      key: string;
    }> = words.map(({ key, word }) => {
      const data: WriteTheSymbolFromSound = {
        type: "WRITE_THE_SYMBOL_FROM_SOUND",
        data: {
          answer: key,
          question: key,
        },
      };

      return { question: data, key };
    });

    const allQuestionData = [
      ...guessTheSentenceMean,
      ...sortMean,
      ...guessTheSoundMean,
      ...guessTheSymbolFromMean,
      ...sortTheSymbolFromMean,
      ...sortTheSymbolFromSound,
      ...writeSymbolFromMean,
      ...writeTheSymbolFromSound,
    ];

    const similarQuestion = await prisma.unit_questions.findMany({
      where: {
        key: {
          in: bodyData.words,
        },
      },
    });

    const sameQuestion = similarQuestion.find((question) =>
      allQuestionData.some((newQuestion) =>
        lodash.isEqual(newQuestion.question, question.question)
      )
    );

    if (sameQuestion) {
      throw { sameQuestion };
    }

    const response = await Promise.all(
      allQuestionData.map(({ question, key }) =>
        prisma.unit_questions.create({
          data: {
            question: question,
            key,
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

app.post("/create-words", async (c) => {
  try {
    const body = await c.req.json();

    const schema = z.array(
      z.object({
        key: z.string(),
        en: z.string(),
        id: z.string(),
        others: z.record(
          z.string(),
          z.union([
            z.string(),
            z.object({
              en: z.string(),
              id: z.string(),
            }),
          ])
        ),
      })
    );

    const validBody = schema.parse(body);

    const res = await Promise.all(
      validBody.map((word) =>
        prisma.words.create({
          data: {
            en: word.en.replace(/\s*\(.*?\)/g, ""),
            id: word.id.replace(/\s*\(.*?\)/g, ""),
            key: word.key,
            others: word.others,
          },
        })
      )
    );

    return c.json(res);
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

export default app;
