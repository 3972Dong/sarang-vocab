import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: Request) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    try {
        const plan = await prisma.dailyPlan.findUnique({
            where: {
                date_userId: { date, userId: session.user.id }
            },
            include: {
                words: {
                    include: { word: true }
                }
            }
        });

        if (!plan) return NextResponse.json(null);

        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, dailyPlanId, wordId, sentence, score } = body;

    // Verify ownership
    const plan = await prisma.dailyPlan.findUnique({
        where: { id: dailyPlanId }
    });

    if (!plan || plan.userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized or Plan not found' }, { status: 403 });
    }

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

        if (action === 'save_busy_level') {
            await prisma.dailyPlan.update({
                where: { id: dailyPlanId },
                data: { busyLevel: body.level }
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
