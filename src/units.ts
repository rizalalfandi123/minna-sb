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
import unitBlocks from "./unit-blocks";
import buildBlockHierarcy from "./unit-hierarcy";

const app = new Hono();

const prisma = new PrismaClient();

app.post("/create-unit-question", async (c) => {
  try {
    const body = await c.req.json();

    const validBody = z.array(UnitQuestionSchema).parse(body);

    const response = await Promise.all(
      validBody.map((question) =>
        prisma.unit_questions.create({ data: { question, key: "" } })
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

// app.get("/block-questions", async (c) => {
//   try {
//     const unitQuestions = await prisma.unit_questions.findMany({
//       include: {
//         unit_questions_to_unit_question_blocks: {
//           select: {
//             with_hint: true,
//             number: true,
//             unit_question_id: true,
//           },
//         },
//       },
//     });

//     const block = new Map<
//       string,
//       Array<{ question: (typeof unitQuestions)[number] }>
//     >();

//     for (let index = 0; index < unitQuestions.length; index++) {
//       const element = unitQuestions[index];

//       if (element.key) {
//         const nextValue = block.get(element.key) ?? [];

//         nextValue.push({ question: element });

//         block.set(element.key, nextValue);
//       }
//     }

//     const perBlockData = Array.from(block.entries()).map(([key, questions]) => {
//       const questionPerType = new Map<
//         number,
//         Array<{
//           questionNumber: number;
//           questionType: string;
//           withHint: boolean;
//         }>
//       >();

//       questions.forEach(({ question }) => {
//         for (
//           let index = 0;
//           index < question.unit_questions_to_unit_question_blocks.length;
//           index++
//         ) {
//           const element = question.unit_questions_to_unit_question_blocks[index];

//           const key = element.unit_levels.number;

//           const nextValue = questionPerType.get(key) ?? [];

//           nextValue.push({
//             questionNumber: Number(element.number),
//             withHint: element.with_hint,
//             questionType: (question.question as { data: { type: string } }).data
//               .type,
//           });

//           questionPerType.set(
//             key,
//             nextValue.sort((a, b) => a.questionNumber - b.questionNumber)
//           );
//         }
//       });

//       const totalUsed = Array.from(questionPerType.values()).flat().length;

//       return {
//         [key]: {
//           questionCount: questions.length,
//           // questionUsed: Object.fromEntries(questionPerType.entries()),
//           totalUsed,
//         },
//       };
//     });

//     return c.json(perBlockData);
//   } catch (error) {
//     console.log("error", error);

//     return c.json({ error });
//   }
// });

// app.get("/level-questions", async (c) => {
//   try {
//     const res = await prisma.unit_levels.findMany({
//       include: {
//         unit_questions_to_unit_levels: {
//           select: {
//             unit_question_id: true,
//           },
//         },
//       },
//       orderBy:{
//         number: 'asc'
//       }
//     });

//     const levelWithCount = res.map(
//       ({ unit_questions_to_unit_levels, ...levelData }) => {
//         return {
//           ...levelData,
//           questionCount: unit_questions_to_unit_levels.length,
//         };
//       }
//     );

//     return c.json(levelWithCount);
//   } catch (error) {
//     console.log(error);
//     return c.json({ error });
//   }
// });

// app.post("/apply-unit-questions", async (c) => {
//   try {
//     const body = await c.req.json();

//     const schema = z.object({
//       keys: z.array(z.string()),
//       unitNumber: z.number(),
//     });

//     const bodyData = schema.parse(body);

//     let unitData = await prisma.units.findFirst({
//       where: {
//         number: {
//           equals: bodyData.unitNumber,
//         },
//       },
//     });

//     if (!unitData) {
//       unitData = await prisma.units.create({
//         data: {
//           number: bodyData.unitNumber,
//         },
//       });
//     }

//     const questions = await (prisma.unit_questions.findMany({
//       where: {
//         key: {
//           in: bodyData.keys,
//         },
//       },
//     }) as PrismaPromise<Array<TUnitQuestion>>);

//     const buildFirstLevel = () => {
//       const firstLevelPooler = new Map<string, Array<TUnitQuestion>>();

//       const firstLevelQuestionType: Array<UnitQuestionType["type"]> = [
//         "GUESS_THE_SENTENCE_MEAN",
//         "GUESS_THE_SYMBOL_FROM_MEAN",
//         "GUESS_THE_SOUND_MEAN",
//         "WRITE_THE_SYMBOL_FROM_SOUND",
//       ];

//       const firstLevelQuestions = questions.filter((question) =>
//         firstLevelQuestionType.includes(question.question.data.type)
//       );

//       for (let index = 0; index < firstLevelQuestions.length; index++) {
//         const pickElement = pickRandomItem<TUnitQuestion>(
//           firstLevelQuestions,
//           (questions) => {
//             const selectedQuestion = questions.filter((item) =>
//               Array.from(firstLevelPooler.values())
//                 .map((pool) => pool.map((poolItem) => poolItem.id))
//                 .flat()
//                 .includes(item.id)
//             );

//             if (selectedQuestion.length === firstLevelQuestions.length) {
//               return [];
//             }

//             return selectedQuestion;
//           }
//         );

//         if (pickElement.picked && pickElement.picked.key) {
//           const nextValue = firstLevelPooler.get(pickElement.picked.key) ?? [];

//           nextValue.push(pickElement.picked);

//           firstLevelPooler.set(
//             pickElement.picked.key,
//             [...nextValue].sort((a, b) => {
//               const indexA = firstLevelQuestionType.indexOf(
//                 a.question.data.type
//               );
//               const indexB = firstLevelQuestionType.indexOf(
//                 b.question.data.type
//               );
//               return indexA - indexB;
//             })
//           );
//         }
//       }

//       const data = Array.from(firstLevelPooler).map(([key, value]) => ({
//         questions: value,
//         key,
//       }));

//       const sortedData = [...data].sort((a, b) => {
//         const indexA = bodyData.keys.indexOf(a.key);
//         const indexB = bodyData.keys.indexOf(b.key);
//         return indexA - indexB;
//       });

//       const dataQuestion = sortedData.flatMap((item) => item.questions);

//       return dataQuestion;
//     };

//     const firstLevel = buildFirstLevel().map((item) => ({
//       ...item,
//       withHint: true,
//     }));

//     const secondLevel = shuffle(firstLevel);

//     const othersLevel = buildQuestionLevels(shuffle(questions));

//     const allData = [
//       firstLevel,
//       secondLevel,
//       ...Object.values(othersLevel).map((item) =>
//         item.map((subItem) => ({ ...subItem, withHint: false }))
//       ),
//     ];

//     const lastLevel = await prisma.unit_levels.findMany({
//       where: {
//         unit_id: unitData.id,
//       },
//       include: {
//         unit_questions_to_unit_levels: true,
//       },
//     });

//     const lastLevelNumber = Math.max(
//       1,
//       ...lastLevel
//         .filter((level) => level.unit_questions_to_unit_levels.length > 0)
//         .map((level) => level.number)
//     );

//     const allDataWithLevel = await Promise.all(
//       allData.map(async (item, index) => {
//         const nextIndex = lastLevelNumber + index + 1;

//         let levelData = await prisma.unit_levels.findFirst({
//           where: {
//             number: nextIndex,
//             unit_id: unitData.id,
//           },
//         });

//         if (!levelData) {
//           levelData = await prisma.unit_levels.create({
//             data: {
//               number: nextIndex,
//               unit_id: unitData.id,
//             },
//           });
//         }

//         return { questions: item, level: levelData };
//       })
//     );

//     const unitQuestionsToUnitLevels = allDataWithLevel
//       .map((item) => {
//         const levelData = item.questions.map((subItem, index) => ({
//           number: index + 1,
//           with_hint: subItem.withHint,
//           unit_level_id: item.level.id,
//           unit_question_id: subItem.id,
//         }));

//         return levelData;
//       })
//       .flat();

//     const response = await prisma.unit_questions_to_unit_levels.createMany({
//       skipDuplicates: true,
//       data: unitQuestionsToUnitLevels,
//     });

//     return c.json(response);
//   } catch (error) {
//     console.log(error);
//     return c.json({ error });
//   }
// });

// app.post("/delete-block-by-key", async (c) => {
//   try {
//     const schema = z.object({
//       keys: z.array(z.string()),
//     });

//     const body = await c.req.json();

//     const validBody = schema.parse(body);

//     const data = await prisma.unit_questions_to_unit_levels.findMany({
//       where: {
//         unit_questions: {
//           key: {
//             in: validBody.keys,
//           },
//         },
//       },
//     });

//     const response = await prisma.unit_questions_to_unit_levels.deleteMany({
//       where: {
//         unit_questions: {
//           key: {
//             in: validBody.keys,
//           },
//         },
//       },
//     });

//     return c.json({ response, data });
//   } catch (error) {
//     console.log("error", error);

//     return c.json({ error });
//   }
// });

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
