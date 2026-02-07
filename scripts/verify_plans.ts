import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    const count = await prisma.dailyPlan.count();
    console.log(`Daily Plans Count: ${count}`);
    const plans = await prisma.dailyPlan.findMany({ take: 5 });
    console.log('Sample Plans:', plans);
    const words = await prisma.dailyWord.count();
    console.log(`Daily Words Count: ${words}`);
}

check().finally(() => prisma.$disconnect());
