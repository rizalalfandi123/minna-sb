import { PrismaClient } from "./generated/prisma";
import { writeFile } from "fs/promises";
import { tables } from "./tables";

const prisma = new PrismaClient();

const main = async () => {
  for (const { name, omit } of tables) {
    const data = await (prisma as any)[name].findMany(omit ? { omit } : {});

    if (Array.isArray(data) && data.length > 0) {
      await writeTs(name, data);
    }
  }
};

async function writeTs(fileName: string, data: object) {
  try {
    const file = `./data/backup/${fileName}.json`;
    await writeFile(file, JSON.stringify(data, null, 2));
    console.log(`✅ Json written to ${file}`);
  } catch (err) {
    console.error("❌ Failed to write file:", err);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ backup success");
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    console.error("❌ backup failed", e);

    process.exit(1);
  });
