import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  const allJets = await prisma.jets.findMany()
  console.log(allJets)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });