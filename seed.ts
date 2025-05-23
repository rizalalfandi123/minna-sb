import { PrismaClient } from "./generated/prisma";
import { writeFile } from "fs/promises";
import allData from "./data/letters";

const prisma = new PrismaClient();

const main = async () => {
  const letterTypes = await prisma.letter_types.createManyAndReturn({
    data: allData.letterTypes,
    skipDuplicates: true,
  });

  const letterBlocks = await prisma.letter_blocks.createManyAndReturn({
    data: allData.letterBlocks,
    skipDuplicates: true,
  });

  const letterPositions = await prisma.letter_positions.createManyAndReturn({
    data: allData.letterPositions,
    skipDuplicates: true,
  });

  const letters = await prisma.letters.createManyAndReturn({
    data: allData.letters,
    skipDuplicates: true,
  });

  return { letters, letterBlocks, letterPositions, letterTypes };
};

async function writeJSON(data: object) {
  try {
    await writeFile("./data/output.json", JSON.stringify(data, null, 2));
    console.log("✅ JSON written to output.json");
  } catch (err) {
    console.error("❌ Failed to write file:", err);
  }
}

main()
  .then(async (data) => {
    await writeJSON(data);
    await prisma.$disconnect();
    console.log("✅ seed success");
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    console.error("❌ seed failed", e);

    process.exit(1);
  });
