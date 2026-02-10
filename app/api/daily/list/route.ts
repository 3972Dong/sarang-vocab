import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const plans = await prisma.dailyPlan.findMany({
            where: { userId: session.user.id },
            select: {
                date: true,
                status: true,
                score: true,
                busyLevel: true, // Exposed to filtering
            }
        });

        return NextResponse.json(plans);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
