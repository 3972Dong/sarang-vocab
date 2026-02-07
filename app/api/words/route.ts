import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const words = await prisma.word.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(words);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { english, meaning, example, monthKey } = body;

        // Create Word
        const newWord = await prisma.word.create({
            data: {
                english,
                meaning,
                example,
            },
        });

        return NextResponse.json(newWord);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create word' }, { status: 500 });
    }
}
