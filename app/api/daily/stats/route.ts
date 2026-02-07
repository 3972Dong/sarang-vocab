import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7); // YYYY-MM
    // Default to current month if not provided

    try {
        const plans = await prisma.dailyPlan.findMany({
            where: {
                date: {
                    startsWith: month
                }
            }
        });

        const totalDays = plans.length;
        const completed = plans.filter(p => p.status === 'COMPLETED');
        const completedCount = completed.length;

        let totalScore = 0;
        completed.forEach(p => {
            if (p.score) totalScore += p.score;
        });

        const avgScore = completedCount > 0 ? (totalScore / completedCount).toFixed(1) : 0;
        const totalWords = completedCount * 10; // 10 words per day

        const stats = {
            totalDays,
            completedCount,
            avgScore,
            totalWords,
            month
        };

        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
