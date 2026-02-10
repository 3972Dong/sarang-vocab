import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.word.count();
    console.log(`Total words in DB: ${count}`);

    const dailyPlanCount = await prisma.dailyPlan.count();
    console.log(`Total DailyPlans in DB: ${dailyPlanCount}`);

    const dailyPlans = await prisma.dailyPlan.findMany({
        take: 5,
        orderBy: { date: 'desc' }
    });
    console.log('Sample DailyPlans:', dailyPlans);

    const firstWords = await prisma.word.findMany({ take: 3 });
    console.log('Sample words:', firstWords);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
