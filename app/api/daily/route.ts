import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    try {
        const plan = await prisma.dailyPlan.findUnique({
            where: { date },
            include: {
                words: {
                    include: { word: true }
                }
            }
        });

        // If no plan exists for this date, create one?
        // User said "generated daily". The seed does it, but maybe we should generate on fly if missing.
        // For now, let's assume they exist or we create one on fly.
        if (!plan) {
            // Generate logic here if needed, or return null
            return NextResponse.json(null);
        }

        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Handle status update or sentence submission
    const body = await request.json();
    const { action, dailyPlanId, wordId, sentence, score } = body;

    try {
        if (action === 'submit_sentence') {
            await prisma.dailyWord.update({
                where: {
                    dailyPlanId_wordId: { dailyPlanId, wordId }
                },
                data: { userSentence: sentence }
            });
            return NextResponse.json({ success: true });
        }

        if (action === 'complete_learning') {
            await prisma.dailyPlan.update({
                where: { id: dailyPlanId },
                data: { status: 'TEST_READY' }
            });
            return NextResponse.json({ success: true });
        }

        if (action === 'submit_score') {
            await prisma.dailyPlan.update({
                where: { id: dailyPlanId },
                data: {
                    status: 'COMPLETED',
                    score: score
                }
            });
            return NextResponse.json({ success: true });
        }
    } catch (e) {
        return NextResponse.json({ error: 'Action failed' }, { status: 500 });
    }
}
