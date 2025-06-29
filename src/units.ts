import { Hono } from "hono";
import { Prisma, PrismaClient, type PrismaPromise } from "../generated/prisma";
import { z } from "zod";
import {
  SymbolWordSchema,
  TranslatedWordSchema,
  UnitQuestionSchema,
  type GuessTheSentenceMean,
  type GuessTheSoundMean,
  type GuessTheSymbolFromMean,
  type SortTheMeans,
  type SortTheSymbolsFromMean,
  type UnitQuestion,
  type UnitQuestionType,
  type WriteTheSymbolFromMean,
  type WriteTheSymbolFromSound,
} from "./units/unit-question-schema";
import { getKeysByLowestArray, pickRandomItem } from "./helpers";
import loadash, { shuffle } from "lodash";

const app = new Hono();

const prisma = new PrismaClient();

type TUnitQuestion = Omit<Prisma.unit_questionsGetPayload<{}>, "question"> & {
  question: UnitQuestion;
};

function buildQuestionLevels(
  questions: TUnitQuestion[],
  questionsPerLevel: number = 10
): Record<number, TUnitQuestion[]> {
  if (!questions || questions.length === 0) {
    return {};
  }

  // 1. Group questions by type
  const questionsByType = new Map<string, TUnitQuestion[]>();
  questions.forEach((question) => {
    const type = question.question?.data?.type;
    if (!type) return;

    if (!questionsByType.has(type)) {
      questionsByType.set(type, []);
    }
    questionsByType.get(type)?.push(question);
  });

  const questionTypes = Array.from(questionsByType.keys());
  if (questionTypes.length === 0) return {};

  const levels: Record<number, TUnitQuestion[]> = {};
  let currentLevel = 1;
  let questionPool = [...questions]; // Clone the original questions

  // 2. Create levels until we've used all questions at least once
  while (questionPool.length > 0) {
    const levelQuestions: TUnitQuestion[] = [];
    const typeUsageInLevel = new Map<string, number>();

    // First pass: Include at least one of each available type
    for (const type of questionTypes) {
      const availableQuestions = questionsByType.get(type) || [];
      if (availableQuestions.length > 0) {
        const question = availableQuestions[0]; // Take first available
        levelQuestions.push(question);
        typeUsageInLevel.set(type, (typeUsageInLevel.get(type) || 0) + 1);
      }
    }

    // Second pass: Fill remaining slots with balanced distribution
    while (levelQuestions.length < questionsPerLevel) {
      // Find the type with highest remaining questions and lowest usage in this level
      let selectedType = "";
      let maxRemaining = -1;
      let minUsageInLevel = Infinity;

      for (const [type, questions] of questionsByType.entries()) {
        const remaining = questions.length;
        const usageInLevel = typeUsageInLevel.get(type) || 0;

        if (
          remaining > 0 &&
          (remaining > maxRemaining ||
            (remaining === maxRemaining && usageInLevel < minUsageInLevel))
        ) {
          selectedType = type;
          maxRemaining = remaining;
          minUsageInLevel = usageInLevel;
        }
      }

      if (!selectedType) break; // No more questions available

      const question = questionsByType.get(selectedType)?.[0];
      if (question) {
        levelQuestions.push(question);
        typeUsageInLevel.set(
          selectedType,
          (typeUsageInLevel.get(selectedType) || 0) + 1
        );
      }
    }

    // If we couldn't fill the level, reuse questions from the pool
    while (levelQuestions.length < questionsPerLevel) {
      const randomIndex = Math.floor(Math.random() * questionPool.length);
      levelQuestions.push(questionPool[randomIndex]);
    }

    levels[currentLevel] = levelQuestions;
    currentLevel++;

    // Remove one instance of each used question from the pool
    levelQuestions.forEach((question) => {
      const type = question.question?.data?.type;
      if (type) {
        const typeQuestions = questionsByType.get(type);
        if (typeQuestions && typeQuestions.length > 0) {
          const index = typeQuestions.findIndex((q) => q.id === question.id);
          if (index >= 0) {
            typeQuestions.splice(index, 1);
          }
        }
      }
    });

    // Update question pool with remaining unique questions
    questionPool = Array.from(questionsByType.values()).flat();
  }

  return levels;
}

app.post("/create-unit-question", async (c) => {
  try {
    const body = await c.req.json();

    const validBody = z.array(UnitQuestionSchema).parse(body);

    const response = await Promise.all(
      validBody.map((question) =>
        prisma.unit_questions.create({ data: { question } })
      )
    );

    return c.json(response);
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

app.post("/generate-unit-question-from-word", async (c) => {
  try {
    const body = await c.req.json();

    const schema = z.object({
      word: SymbolWordSchema,
      meanOptions: z.array(TranslatedWordSchema),
      kanaOptions: z.array(z.string()),
    });

    const bodyData = schema.parse(body);

    const guessTheSentenceMean: GuessTheSentenceMean = {
      type: "GUESS_THE_SENTENCE_MEAN",
      data: {
        answer: bodyData.word.mean,
        options: bodyData.meanOptions,
        question: [bodyData.word],
      },
    };

    const sortMean: SortTheMeans = {
      type: "SORT_THE_MEAN",
      data: {
        answer: bodyData.word.mean,
        options: bodyData.meanOptions,
        question: [bodyData.word],
      },
    };

    const guessTheSoundMean: GuessTheSoundMean = {
      type: "GUESS_THE_SOUND_MEAN",
      data: {
        answer: bodyData.word.mean,
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
          select: {
            with_hint: true,
            number: true,
            unit_level_id: true,
            unit_question_id: true,
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
      orderBy:{
        number: 'asc'
      }
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

app.post("/apply-unit-questions", async (c) => {
  try {
    const body = await c.req.json();

    const schema = z.object({
      keys: z.array(z.string()),
      unitNumber: z.number(),
    });

    const bodyData = schema.parse(body);

    let unitData = await prisma.units.findFirst({
      where: {
        number: {
          equals: bodyData.unitNumber,
        },
      },
    });

    if (!unitData) {
      unitData = await prisma.units.create({
        data: {
          number: bodyData.unitNumber,
        },
      });
    }

    const questions = await (prisma.unit_questions.findMany({
      where: {
        key: {
          in: bodyData.keys,
        },
      },
    }) as PrismaPromise<Array<TUnitQuestion>>);

    const buildFirstLevel = () => {
      const firstLevelPooler = new Map<string, Array<TUnitQuestion>>();

      const firstLevelQuestionType: Array<UnitQuestionType["type"]> = [
        "GUESS_THE_SENTENCE_MEAN",
        "GUESS_THE_SYMBOL_FROM_MEAN",
        "GUESS_THE_SOUND_MEAN",
        "WRITE_THE_SYMBOL_FROM_SOUND",
      ];

      const firstLevelQuestions = questions.filter((question) =>
        firstLevelQuestionType.includes(question.question.data.type)
      );

      for (let index = 0; index < firstLevelQuestions.length; index++) {
        const pickElement = pickRandomItem<TUnitQuestion>(
          firstLevelQuestions,
          (questions) => {
            const selectedQuestion = questions.filter((item) =>
              Array.from(firstLevelPooler.values())
                .map((pool) => pool.map((poolItem) => poolItem.id))
                .flat()
                .includes(item.id)
            );

            if (selectedQuestion.length === firstLevelQuestions.length) {
              return [];
            }

            return selectedQuestion;
          }
        );

        if (pickElement.picked && pickElement.picked.key) {
          const nextValue = firstLevelPooler.get(pickElement.picked.key) ?? [];

          nextValue.push(pickElement.picked);

          firstLevelPooler.set(
            pickElement.picked.key,
            [...nextValue].sort((a, b) => {
              const indexA = firstLevelQuestionType.indexOf(
                a.question.data.type
              );
              const indexB = firstLevelQuestionType.indexOf(
                b.question.data.type
              );
              return indexA - indexB;
            })
          );
        }
      }

      const data = Array.from(firstLevelPooler).map(([key, value]) => ({
        questions: value,
        key,
      }));

      const sortedData = [...data].sort((a, b) => {
        const indexA = bodyData.keys.indexOf(a.key);
        const indexB = bodyData.keys.indexOf(b.key);
        return indexA - indexB;
      });

      const dataQuestion = sortedData.flatMap((item) => item.questions);

      return dataQuestion;
    };

    const firstLevel = buildFirstLevel().map((item) => ({
      ...item,
      withHint: true,
    }));

    const secondLevel = shuffle(firstLevel);

    const othersLevel = buildQuestionLevels(shuffle(questions));

    const allData = [
      firstLevel,
      secondLevel,
      ...Object.values(othersLevel).map((item) =>
        item.map((subItem) => ({ ...subItem, withHint: false }))
      ),
    ];

    const lastLevel = await prisma.unit_levels.findMany({
      where: {
        unit_id: unitData.id,
      },
      include: {
        unit_questions_to_unit_levels: true,
      },
    });

    const lastLevelNumber = Math.max(
      1,
      ...lastLevel
        .filter((level) => level.unit_questions_to_unit_levels.length > 0)
        .map((level) => level.number)
    );

    const allDataWithLevel = await Promise.all(
      allData.map(async (item, index) => {
        const nextIndex = lastLevelNumber + index + 1;

        let levelData = await prisma.unit_levels.findFirst({
          where: {
            number: nextIndex,
            unit_id: unitData.id,
          },
        });

        if (!levelData) {
          levelData = await prisma.unit_levels.create({
            data: {
              number: nextIndex,
              unit_id: unitData.id,
            },
          });
        }

        return { questions: item, level: levelData };
      })
    );

    const unitQuestionsToUnitLevels = allDataWithLevel
      .map((item) => {
        const levelData = item.questions.map((subItem, index) => ({
          number: index + 1,
          with_hint: subItem.withHint,
          unit_level_id: item.level.id,
          unit_question_id: subItem.id,
        }));

        return levelData;
      })
      .flat();

    const response = await prisma.unit_questions_to_unit_levels.createMany({
      skipDuplicates: true,
      data: unitQuestionsToUnitLevels,
    });

    return c.json(response);
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

export default app;
