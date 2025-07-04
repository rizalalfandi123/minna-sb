import { Prisma, PrismaClient } from "../generated/prisma";
import {
  type UnitQuestion,
  type UnitQuestionType,
} from "./units/unit-question-schema";
import { pickRandomItem } from "./helpers";
import { shuffle } from "lodash";
import unitBlocks from "./unit-blocks";

const prisma = new PrismaClient();

export type TUnitQuestion = Omit<
  Prisma.unit_questionsGetPayload<{}>,
  "question"
> & {
  question: UnitQuestion;
};

export type TDetailUnitQuestion = {
  unit_questions_to_unit_levels: {
    number: number;
  }[];
  withHint: boolean;
} & TUnitQuestion;

function buildQuestionLevels(
  questions: TDetailUnitQuestion[],
  questionsPerLevel: number = 10
): Record<number, TDetailUnitQuestion[]> {
  if (!questions || questions.length === 0) {
    return {};
  }

  // 1. Group questions by type
  const questionsByType = new Map<string, TDetailUnitQuestion[]>();
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

  const levels: Record<number, TDetailUnitQuestion[]> = {};
  let currentLevel = 1;
  let questionPool = [...questions]; // Clone the original questions

  // 2. Create levels until we've used all questions at least once
  while (questionPool.length > 0) {
    const levelQuestions: TDetailUnitQuestion[] = [];
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

const buildBlockLevels = async ({
  questions,
  blockKeys,
  blockId,
  blockType,
}: {
  questions: Array<TDetailUnitQuestion>;
  blockKeys: Array<string>;
  blockId: string;
  blockType: "grammar" | "vocabulary";
}) => {
  const buildFirstLevel = () => {
    const firstLevelPooler = new Map<string, Array<TDetailUnitQuestion>>();

    const firstLevelQuestionType: Array<UnitQuestionType["type"]> =
      blockType === "vocabulary"
        ? [
            "GUESS_THE_SENTENCE_MEAN",
            "GUESS_THE_SYMBOL_FROM_MEAN",
            "GUESS_THE_SOUND_MEAN",
            "WRITE_THE_SYMBOL_FROM_SOUND",
          ]
        : ["SORT_THE_MEAN", "SORT_THE_SYMBOLS_FROM_MEAN"];

    const firstLevelQuestions = questions.filter((question) =>
      firstLevelQuestionType.includes(question.question.data.type)
    );

    for (let index = 0; index < firstLevelQuestions.length; index++) {
      const pickElement = pickRandomItem<TDetailUnitQuestion>(
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

        nextValue.push({ ...pickElement.picked, withHint: true });

        firstLevelPooler.set(
          pickElement.picked.key,
          [...nextValue].sort((a, b) => {
            const indexA = firstLevelQuestionType.indexOf(a.question.data.type);
            const indexB = firstLevelQuestionType.indexOf(b.question.data.type);
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
      const indexA = blockKeys.indexOf(a.key);
      const indexB = blockKeys.indexOf(b.key);
      return indexA - indexB;
    });

    const dataQuestion = sortedData.flatMap((item) => item.questions);

    return dataQuestion;
  };

  const firstLevel = buildFirstLevel();

  const secondLevel = shuffle(firstLevel);

  const othersLevel = buildQuestionLevels(shuffle(questions));

  const allData: TDetailUnitQuestion[][] = [];

  if (firstLevel.length > 0) {
    allData.push(firstLevel);

    if (blockType === "vocabulary") {
      allData.push(secondLevel);
    }
  }

  allData.push(
    ...Object.values(othersLevel).map((item) =>
      item.map((subItem) => ({ ...subItem, withHint: false }))
    )
  );

  const dataWithLevel = await Promise.all(
    allData.map(async (level, index) => {
      const levelNumber = index + 1;

      let levelData = await prisma.unit_levels.findFirst({
        where: {
          number: {
            equals: levelNumber,
          },
          unit_question_block_id: {
            equals: blockId,
          },
        },
      });

      if (!levelData) {
        levelData = await prisma.unit_levels.create({
          data: {
            number: levelNumber,
            unit_question_block_id: blockId,
          },
        });
      }

      return { levelId: levelData.id, levels: level };
    })
  );

  return dataWithLevel;
};

const buildBlockHierarcy = async () => {
  const allUnitData = await Promise.all(
    Array.from({ length: unitBlocks.length }).map(async (_, i) => {
      let unitData = await prisma.units.findFirst({
        where: {
          number: {
            equals: i + 1,
          },
        },
      });

      if (!unitData) {
        unitData = await prisma.units.create({
          data: {
            number: i + 1,
          },
        });
      }

      return unitData;
    })
  );

  const allBlocksData = await Promise.all(
    unitBlocks
      .flatMap((item) => item)
      .map(async (item, indexOfBlock) => {
        const indexOfUnit = unitBlocks.findIndex((unit) => unit.includes(item));

        if (indexOfUnit < 0) {
          throw new Error("01");
        }

        const index = indexOfBlock + indexOfUnit + 1;

        let blockData = await prisma.unit_question_blocks.findFirst({
          where: {
            number: {
              equals: index,
            },
          },
        });

        if (!blockData) {
          blockData = await prisma.unit_question_blocks.create({
            data: {
              number: index,
              description: {},
              unit_id: allUnitData[indexOfUnit].id,
              type: item.type,
            },
          });
        }

        return blockData;
      })
  );

  const allUnitQuestions = await (prisma.unit_questions.findMany({
    include: {
      unit_questions_to_unit_levels: {
        select: {
          number: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
    where: {
      deleted: false,
    },
  }) as Promise<Array<TDetailUnitQuestion>>);

  const unUppliedQuestion = allUnitQuestions
    .map((item) => {
      const unitNumber = unitBlocks.findIndex((unit) =>
        unit.flatMap((item) => item.block).includes(item.key)
      );

      if (unitNumber < 0) {
        throw new Error(
          "There a questions without matching key in unitBlocks" +
            ` ${item.key}`
        );
      }

      const blockNumber = unitBlocks[unitNumber].findIndex((block) =>
        block.block.includes(item.key)
      );

      if (blockNumber < 0) {
        throw new Error("No match block" + ` ${item.key}`);
      }

      return {
        ...item,
        blockNumber: blockNumber + 1,
      };
    })
    .filter((item) => item.unit_questions_to_unit_levels.length <= 0);

  const hieracy = await Promise.all(
    unitBlocks.map(async (unit, unitIndex) => {
      const unitData = allUnitData[unitIndex];

      const unitHirarcy = await Promise.all(
        unit.map(async (block, blockIndex) => {
          const blockData = allBlocksData[unitIndex + blockIndex];

          const questions = unUppliedQuestion.filter((question) =>
            block.block.includes(question.key)
          );

          const blockHierary = await buildBlockLevels({
            questions: questions,
            blockKeys: block.block,
            blockId: blockData.id,
            blockType: block.type,
          });

          return { blockId: blockData.id, blocks: blockHierary };
        })
      );

      return { unitId: unitData.id, units: unitHirarcy };
    })
  );

  return hieracy;
};

export default buildBlockHierarcy;
