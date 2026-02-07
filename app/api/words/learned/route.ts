import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const words = await prisma.dailyWord.findMany({
            where: {
                // Only fetch words that have a user sentence or are part of a completed plan
                userSentence: { not: null }
            },
            include: {
                word: true,
                dailyPlan: {
                    select: { date: true }
                }
            },
            orderBy: {
                dailyPlan: { date: 'desc' }
            }
        });

        return NextResponse.json(words);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
