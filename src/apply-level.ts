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
import { alternateArrays } from "./helpers";
import hiraganaBlock from "./hiragana-block";

const applyLevelApp = new Hono();

const prisma = new PrismaClient();

type LetterQuestion = Omit<PrismaLetterQuestion, "question"> & {
  question: TTypeLetterQuestion;
  number?: number;
};

type Level = {
  questions: LetterQuestion[];
};

type Chapter = {
  levels: Level[];
};

const categoriesQuestion = (questionData: Array<LetterQuestion>) => {
  const GUESS_THE_LETTER = questionData.filter(
    (question) => question.question.type === "GUESS_THE_LETTER"
  );

  const GUESS_THE_SYMBOL = questionData.filter(
    (question) => question.question.type === "GUESS_THE_SYMBOL"
  );

  const GUESS_THE_LETTER_SOUND = questionData.filter(
    (question) => question.question.type === "GUESS_THE_LETTER_SOUND"
  );

  const MATCHING_TEXT_BY_TEXT = questionData.filter(
    (question) => question.question.type === "MATCHING_TEXT_BY_TEXT"
  );

  const SORT_THE_ITEMS_BY_SOUND = questionData.filter(
    (question) => question.question.type === "SORT_THE_ITEMS_BY_SOUND"
  );

  return {
    GUESS_THE_LETTER,
    GUESS_THE_SYMBOL,
    GUESS_THE_LETTER_SOUND,
    MATCHING_TEXT_BY_TEXT,
    SORT_THE_ITEMS_BY_SOUND,
  };
};

const generateLevel1 = (data: ReturnType<typeof categoriesQuestion>) => {
  if (data.GUESS_THE_LETTER.length !== data.GUESS_THE_SYMBOL.length) {
    throw new Error("Guess letter not same with Guess Symbol");
  }

  const result = alternateArrays<LetterQuestion>(
    data.GUESS_THE_LETTER,
    data.GUESS_THE_SYMBOL
  );

  return result;
};

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createChapter(
  questionsByType: Record<string, LetterQuestion[]>,
  questionsPerLevel: number = 10,
  minLevels: number = 10,
  minRepeats: number = 4
): Chapter {
  // Validate inputs
  if (questionsPerLevel < 5) {
    throw new Error(
      "Each level must have at least 5 questions to include all types"
    );
  }

  // Extract all question types
  const questionTypes = Object.keys(questionsByType);
  if (questionTypes.length < 5) {
    throw new Error("There must be at least 5 different question types");
  }

  // Calculate minimum questions needed for 10 levels
  const minQuestionsNeeded = questionsPerLevel * minLevels;
  const questionsPerType = Math.max(
    Math.ceil(minQuestionsNeeded / questionTypes.length),
    minRepeats
  );

  // Prepare question pools for each type
  const questionPools: Record<string, LetterQuestion[]> = {};
  for (const type of questionTypes) {
    const allQuestions = [...questionsByType[type]];
    const pool: LetterQuestion[] = [];

    // Repeat questions to reach the required count
    while (pool.length < questionsPerType) {
      for (const question of allQuestions) {
        if (pool.length >= questionsPerType) break;
        pool.push({ ...question });
      }
    }

    // Shuffle the pool
    questionPools[type] = shuffleArray(pool.slice(0, questionsPerType));
  }

  // Create levels
  const chapter: Chapter = { levels: [] };

  // We'll create exactly minLevels levels (10 by default)
  for (let levelNum = 0; levelNum < minLevels; levelNum++) {
    const level: Level = { questions: [] };
    const typesInLevel = new Set<string>();

    // First add one of each type to ensure diversity
    for (const type of shuffleArray([...questionTypes])) {
      if (level.questions.length >= questionsPerLevel) break;
      if (questionPools[type].length === 0) {
        // If we run out of a type, take from another type
        const availableType = questionTypes.find(
          (t) => t !== type && questionPools[t].length > 0
        );
        if (!availableType) continue;

        const question = { ...questionPools[availableType].pop()! };
        level.questions.push(question);
        typesInLevel.add(availableType);
        continue;
      }

      const question = { ...questionPools[type].pop()! };
      level.questions.push(question);
      typesInLevel.add(type);
    }

    // Then fill the rest randomly, avoiding sequential duplicates
    while (level.questions.length < questionsPerLevel) {
      const availableTypes = questionTypes.filter(
        (type) =>
          questionPools[type].length > 0 &&
          (level.questions.length === 0 ||
            type !== level.questions[level.questions.length - 1].question.type)
      );

      if (availableTypes.length === 0) {
        // If we've run out of questions, duplicate existing ones
        const existingQuestions = level.questions.filter(
          (q) =>
            !level.questions
              .slice(-3)
              .some((lq) => lq.question.type === q.question.type)
        );
        if (existingQuestions.length === 0) break;

        const randomQuestion =
          existingQuestions[
            Math.floor(Math.random() * existingQuestions.length)
          ];
        const question = { ...randomQuestion };
        level.questions.push(question);
        continue;
      }

      const randomType =
        availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const question = { ...questionPools[randomType].pop()! };
      level.questions.push(question);
    }

    // Assign question numbers (1-10) for this level
    level.questions.forEach((q, index) => {
      q.number = index + 1;
    });

    chapter.levels.push(level);
  }

  return chapter;
}

const generateOtherLevel = (data: ReturnType<typeof categoriesQuestion>) => {
  const chapter = createChapter(data);

  return chapter;
};

applyLevelApp.post("/apply-block-question", async (c) => {
  try {
    const body = await c.req.json();

    const validBody = z
      .object({
        scoope: z.array(z.string()),
        type: LetterTypeSchema,
      })
      .parse(body);

    const blockOfScoopeIndex = hiraganaBlock.findIndex(
      (block) => JSON.stringify(block) === JSON.stringify(validBody.scoope)
    );

    if (blockOfScoopeIndex < 0) {
      throw new Error("Failed block");
    }

    const previousBlock = hiraganaBlock
      .filter((_, i) => i < blockOfScoopeIndex)
      .flat();

    const allLetterQuestions = await prisma.letters_to_letter_levels.findMany({
      include: {
        letter_levels: {
          select: {
            number: true,
          },
        },
        letters: {
          select: {
            symbol: true,
          },
        },
      },
    });

    const previousBlockData = allLetterQuestions.filter((letterLevel) =>
      previousBlock.includes(letterLevel.letters.symbol)
    );

    const levelStart =
      Math.max(
        0,
        ...previousBlockData.map((item) => item.letter_levels.number)
      ) + 1;

    const questions = await prisma.letter_questions.findMany();

    const questionData = (
      questions as Array<
        Omit<PrismaLetterQuestion, "question"> & {
          question: TTypeLetterQuestion;
        }
      >
    ).filter((item) => {
      const typedQuestion = item.question;

      return (
        JSON.stringify(typedQuestion.scoope) ===
        JSON.stringify(validBody.scoope)
      );
    });

    const catQues = categoriesQuestion(questionData);

    const level1 = generateLevel1(catQues);

    const chapter = generateOtherLevel(catQues);

    const blockLevel: Array<Array<LetterQuestion>> = [
      level1,
      ...chapter.levels.map((level) => level.questions),
    ];

    const getBlockLevelData = blockLevel.map(async (level, i) => {
      let levelData = await prisma.letter_levels.findFirst({
        where: {
          number: levelStart + i,
          letter_type_id: "1e7f5733-b89c-43f4-b46d-26d215975599",
        },
      });

      if (!levelData) {
        levelData = await prisma.letter_levels.create({
          data: {
            number: levelStart + i,
            letter_type_id: "1e7f5733-b89c-43f4-b46d-26d215975599",
          },
        });
      }

      return { level, levelData: levelData };
    });

    const blockLevelData = await Promise.all(getBlockLevelData);

    for (let index = 0; index < blockLevelData.length; index++) {
      const blockLevel = blockLevelData[index];

      for (let index = 0; index < blockLevel.level.length; index++) {
        const question = blockLevel.level[index];

        await prisma.letter_questions_to_letter_levels.upsert({
          where: {
            letter_question_id_letter_level_id: {
              letter_level_id: blockLevel.levelData.id,
              letter_question_id: question.id,
            },
          },
          create: {
            letter_level_id: blockLevel.levelData.id,
            letter_question_id: question.id,
            number: question.number,
          },
          update: {
            letter_level_id: blockLevel.levelData.id,
            letter_question_id: question.id,
            number: question.number,
          },
        });
      }
    }

    const letters = await prisma.letters.findMany({});

    const letterData = letters.filter((item) =>
      validBody.scoope.includes(item.symbol)
    );

    for (let index = 0; index < blockLevelData.length; index++) {
      const blockLevel = blockLevelData[index];

      for (let index = 0; index < letterData.length; index++) {
        const letter = letterData[index];

        await prisma.letters_to_letter_levels.upsert({
          where: {
            letter_id_letter_level_id: {
              letter_level_id: blockLevel.levelData.id,
              letter_id: letter.id,
            },
          },
          create: {
            letter_level_id: blockLevel.levelData.id,
            letter_id: letter.id,
          },
          update: {
            letter_level_id: blockLevel.levelData.id,
            letter_id: letter.id,
          },
        });
      }
    }

    return c.json(blockLevel);
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

export default applyLevelApp;
