import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const plans = await prisma.dailyPlan.findMany({
            select: {
                date: true,
                status: true,
                score: true
            },
            orderBy: { date: 'asc' }
        });
        return NextResponse.json(plans);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
