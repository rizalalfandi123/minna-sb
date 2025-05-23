import { PrismaClient } from "./generated/prisma";
import { tables } from "./tables";

const prisma = new PrismaClient();

const main = async () => {
  for (const { name } of tables) {
    let data = [];

    try {
      const text = await Bun.file(`./data/backup/${name}.json`).text();

      data = JSON.parse(text);
    } catch (error) {
      console.log(`Failed to read ${name}`);
    }

    try {
      await (prisma as any)[name].createMany({
        data,
        skipDuplicates: true,
      });

      console.log(`✅ ${name} restore success`);
    } catch (error) {
      console.log(`❌ ${name} restore failed`, error);
    }
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();

    process.exit(1);
  });
