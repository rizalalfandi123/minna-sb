import { Hono } from "hono";
import {
  Prisma,
  PrismaClient,
  type letter_questions as PrismaLetterQuestion,
} from "../generated/prisma";
import { cors } from "hono/cors";
import {
  LetterQuestionTypeSchema,
  LetterTypeSchema,
  type TGuessTheLetter,
  type TGuessTheLetterSound,
  type TGuessTheSymbol,
  type TMatchingTextByText,
  type TSortItemsBySound,
  type TTypeLetterQuestion,
} from "./schemas";
import { z } from "zod";
import hiraganaBlock from "./hiragana-block";
import applyLevelApp from "./apply-level";

const app = new Hono();

app.use(cors({ origin: "*" }));

const prisma = new PrismaClient();

// const updateLettersToLetterLevels = async ({
//   levelId,
// }: {
//   levelId: string;
// }) => {
//   function getBlockByNumber(input: number): number[] {
//     const blockStart = Math.floor((input - 1) / 8) * 8 + 1;
//     return Array.from({ length: 8 }, (_, i) => blockStart + i);
//   }

//   function getMultiplesOf8Block(n: number): number[] {
//     const start: number = (n - 1) * 8 + 1;
//     return Array.from({ length: 8 }, (_, i) => start + i);
//   }

//   const levelData = await prisma.letter_levels.findFirstOrThrow({
//     where: { id: { equals: levelId } },
//   });

//   const allLevels = await prisma.letter_levels.findMany({
//     where: {
//       number: {
//         in: getBlockByNumber(levelData.number),
//       },
//     },
//   });

//   const letterBlock = (
//     hiraganaBlock.find((_, i) =>
//       getMultiplesOf8Block(i + 1).includes(levelData.number)
//     ) ?? []
//   ).filter((item) => item !== null);

//   for (let index = 0; index < allLevels.length; index++) {
//     const element = allLevels[index];

//     if (element) {
//       await prisma.letters_to_letter_levels.createMany({
//         data: letterBlock.map((item) => ({
//           letter_id: item.id,
//           letter_level_id: element.id,
//         })),
//         skipDuplicates: true,
//       });

//       await prisma.letters_to_letter_levels.deleteMany({
//         where: {
//           letter_level_id: { equals: element.id },
//           letter_id: { notIn: letterBlock.map((item) => item.id) },
//         },
//       });
//     }
//   }
// };

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

// app.post("/apply-level", async (c) => {
//   try {
//     const body = await c.req.json();

//     const validBody = z
//       .object({
//         questionId: z.string(),
//         levelNumber: z.coerce.number(),
//         number: z.coerce.number(),
//         letterType: LetterTypeSchema,
//       })
//       .parse(body);

//     const letterType = await prisma.letter_types.findFirstOrThrow({
//       where: {
//         name: validBody.letterType,
//       },
//     });

//     let levelData = await prisma.letter_levels.findFirst({
//       where: { number: { equals: validBody.levelNumber } },
//     });

//     if (!levelData) {
//       levelData = await prisma.letter_levels.create({
//         data: {
//           number: validBody.levelNumber,
//           letter_type_id: letterType.id,
//         },
//       });
//     }

//     if (!levelData) {
//       throw new Error("No level data");
//     }

//     const res = await prisma.letter_questions_to_letter_levels.upsert({
//       where: {
//         letter_question_id_letter_level_id: {
//           letter_level_id: levelData.id,
//           letter_question_id: validBody.questionId,
//         },
//       },
//       create: {
//         letter_level_id: levelData.id,
//         number: validBody.number,
//         letter_question_id: validBody.questionId,
//       },
//       update: {
//         letter_level_id: levelData.id,
//         number: validBody.number,
//         letter_question_id: validBody.questionId,
//       },
//     });

//     await updateLettersToLetterLevels({ levelId: levelData.id });

//     return c.json(res);
//   } catch (error) {
//     return c.json({ error });
//   }
// });

app.post("/create-block-question", async (c) => {
  try {
    const body = await c.req.json();

    const validBody = z
      .object({
        letters: z.array(z.string()),
        words: z.array(z.string()),
        type: LetterTypeSchema,
      })
      .parse(body);

    const letters = await prisma.letters.findMany();

    const letterData = letters.filter((letter) =>
      validBody.letters.includes(letter.symbol)
    );

    if (letterData.length !== validBody.letters.length) {
      throw new Error("Failed data");
    }

    const guessTheLetter: Array<TGuessTheLetter> = letterData.map((item) => {
      const data: TGuessTheLetter = {
        data: {
          answer: item.name,
          question: item.symbol,
          options: letterData.map((letter) => letter.name),
        },
        letterType: validBody.type,
        type: "GUESS_THE_LETTER",
        scoope: letterData.map((letter) => letter.symbol),
      };

      return data;
    });

    const guessTheSymbol: Array<TGuessTheSymbol> = letterData.map((item) => {
      const data: TGuessTheSymbol = {
        data: {
          answer: item.symbol,
          question: item.name,
          options: letterData.map((letter) => letter.symbol),
        },
        letterType: validBody.type,
        type: "GUESS_THE_SYMBOL",
        scoope: letterData.map((letter) => letter.symbol),
      };

      return data;
    });

    const guessTheLetterSound: Array<TGuessTheLetterSound> = letterData.map(
      (item) => {
        const data: TGuessTheLetterSound = {
          data: {
            answer: item.symbol,
            question: item.symbol,
            options: letterData.map((letter) => letter.symbol),
          },
          letterType: validBody.type,
          type: "GUESS_THE_LETTER_SOUND",
          scoope: letterData.map((letter) => letter.symbol),
        };

        return data;
      }
    );

    const matchingTextByText: Array<TMatchingTextByText> = [true, false].map(
      (isLeftSymbol) => {
        const data: TMatchingTextByText = {
          type: "MATCHING_TEXT_BY_TEXT",
          letterType: validBody.type,
          data: {
            isLeftSymbol,
            answer: letterData.map((letter) => ({
              leftSide: isLeftSymbol ? letter.symbol : letter.name,
              rightSide: isLeftSymbol ? letter.name : letter.symbol,
            })),
            options: letterData.map((letter) => ({
              leftSide: isLeftSymbol ? letter.symbol : letter.name,
              rightSide: isLeftSymbol ? letter.name : letter.symbol,
            })),
          },
          scoope: letterData.map((letter) => letter.symbol),
        };

        return data;
      }
    );

    const sortTheLetters: Array<TSortItemsBySound> = validBody.words.map(
      (item) => {
        const data: TSortItemsBySound = {
          letterType: validBody.type,
          type: "SORT_THE_ITEMS_BY_SOUND",
          data: {
            answer: item,
            options: item
              .split("")
              .map((item, number) => ({ value: item, number })),
          },
          scoope: letterData.map((letter) => letter.symbol),
        };

        return data;
      }
    );

    const allQuestions = z
      .array(LetterQuestionTypeSchema)
      .parse([
        ...guessTheLetter,
        ...guessTheSymbol,
        ...guessTheLetterSound,
        ...matchingTextByText,
        ...sortTheLetters,
      ]);

    const res = await prisma.letter_questions.createMany({
      data: allQuestions.map((question) => ({ question })),
    });

    return c.json(res);
  } catch (error) {
    return c.json({ error });
  }
});

app.route("/block", applyLevelApp);

export default {
  port: 3001,
  fetch: app.fetch,
};
