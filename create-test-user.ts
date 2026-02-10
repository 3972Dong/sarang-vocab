
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const username = 'student';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: 'STUDENT',
            },
        });
        console.log(`User created: ${user.username}`);
    } catch (e: any) {
        if (e.code === 'P2002') {
            console.log('User already exists.');
        } else {
            console.error(e);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
