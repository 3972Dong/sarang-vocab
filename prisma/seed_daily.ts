import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Sample Vocabulary Pool (Ensure we have enough)
const WORDS = [
    { english: "abate", meaning: "줄이다, 완화하다", synonym: "subside, decrease" },
    { english: "aberrant", meaning: "정도를 벗어난, 일탈적인", synonym: "abnormal, deviant" },
    { english: "abeyance", meaning: "중지, 정지", synonym: "suspension" },
    { english: "abscond", meaning: "종적을 감추다, 도주하다", synonym: "escape, flee" },
    { english: "abstemious", meaning: "절제하는, 금욕적인", synonym: "temperate" },
    { english: "admonish", meaning: "훈계하다, 경고하다", synonym: "reprimand" },
    { english: "adulterate", meaning: "불순물을 섞다", synonym: "contaminate" },
    { english: "aesthetic", meaning: "미적인", synonym: "artistic" },
    { english: "aggrandize", meaning: "확대하다", synonym: "enhance" },
    { english: "alleviate", meaning: "완화하다", synonym: "ease, relieve" },
    { english: "amalgamate", meaning: "합병하다", synonym: "merge" },
    { english: "ambiguous", meaning: "애매모호한", synonym: "unclear" },
    { english: "ambivalence", meaning: "양면가치", synonym: "uncertainty" },
    { english: "ameliorate", meaning: "개선하다", synonym: "improve" },
    { english: "anachronism", meaning: "시대착오", synonym: "misplacement" },
    { english: "analogous", meaning: "유사한", synonym: "parrallel" },
    { english: "anarchy", meaning: "무정부 상태", synonym: "chaos" },
    { english: "anomalous", meaning: "이례적인", synonym: "abnormal" },
    { english: "antipathy", meaning: "반감", synonym: "hostility" },
    { english: "apathy", meaning: "무관심", synonym: "indifference" },
    { english: "appease", meaning: "진정시키다", synonym: "soothe" },
    { english: "apprise", meaning: "알리다", synonym: "inform" },
    { english: "approbation", meaning: "승인, 칭찬", synonym: "approval" },
    { english: "appropriate", meaning: "도용하다, 책정하다", synonym: "seize" },
    { english: "arable", meaning: "경작할 수 있는", synonym: "cultivable" },
    { english: "arcane", meaning: "신비로운", synonym: "mysterious" },
    { english: "archaic", meaning: "고대의", synonym: "ancient" },
    { english: "arduous", meaning: "힘든", synonym: "difficult" },
    { english: "articulate", meaning: "명확히 표현하다", synonym: "expressive" },
    { english: "ascetic", meaning: "금욕적인", synonym: "austere" },
    { english: "assuage", meaning: "완화하다", synonym: "relieve" },
    { english: "audacious", meaning: "대담한", synonym: "bold" },
    { english: "austere", meaning: "엄격한", synonym: "severe" },
    { english: "avarice", meaning: "탐욕", synonym: "greed" },
    { english: "aver", meaning: "단언하다", synonym: "assert" },
    { english: "banal", meaning: "진부한", synonym: "trite" },
    { english: "belie", meaning: "거짓임을 보여주다", synonym: "contradict" },
    { english: "benign", meaning: "상냥한", synonym: "kindly" },
    { english: "bolster", meaning: "북돋우다", synonym: "support" },
    { english: "bombastic", meaning: "과장된", synonym: "pompous" },
    { english: "cacophony", meaning: "불협화음", synonym: "discord" },
    { english: "capricious", meaning: "변덕스러운", synonym: "fickle" },
    { english: "castigate", meaning: "징계하다", synonym: "reprimand" },
    { english: "catalyst", meaning: "촉매, 기폭제", synonym: "stimulus" },
    { english: "caustic", meaning: "부식성의, 신랄한", synonym: "acerbic" },
    { english: "chicanery", meaning: "속임수", synonym: "deception" },
    { english: "cogent", meaning: "설득력 있는", synonym: "convincing" },
    { english: "commensurate", meaning: "비례하는", synonym: "proportionate" },
    { english: "complaisant", meaning: "고분고분한", synonym: "obliging" },
    { english: "connoisseur", meaning: "감정가, 전문가", synonym: "expert" },
    { english: "conundrum", meaning: "난제, 수수께끼", synonym: "enigma" },
    { english: "convoluted", meaning: "복잡한", synonym: "complex" },
    { english: "corroborate", meaning: "확증하다", synonym: "confirm" },
    { english: "credulous", meaning: "잘 믿는", synonym: "gullible" },
    { english: "culpable", meaning: "과실이 있는", synonym: "blameworthy" },
    { english: "decorum", meaning: "예의 바름", synonym: "propriety" },
    { english: "deference", meaning: "존중", synonym: "respect" },
    { english: "deleterious", meaning: "해로운", synonym: "harmful" },
    { english: "demur", meaning: "이의를 제기하다", synonym: "object" },
    { english: "deride", meaning: "조롱하다", synonym: "mock" },
    { english: "desiccate", meaning: "건조시키다", synonym: "dry" },
    { english: "desultory", meaning: "두서없는", synonym: "aimless" },
    { english: "diatribe", meaning: "통렬한 비난", synonym: "tirade" },
    { english: "diffident", meaning: "자신 없는", synonym: "shy" },
    { english: "dilate", meaning: "확장하다", synonym: "expand" },
    { english: "dilatory", meaning: "미적거리는", synonym: "slow" },
    { english: "dilettante", meaning: "아마추어 예술가", synonym: "amateur" },
    { english: "dirge", meaning: "장송곡", synonym: "lament" },
    { english: "abuse", meaning: "남용하다, 학대하다", synonym: "misuse" }, // Added some basic ones to fill list if needed
    { english: "accept", meaning: "받아들이다", synonym: "receive" },
    { english: "access", meaning: "접근", synonym: "approach" },
    { english: "accompany", meaning: "동행하다", synonym: "escort" },
    { english: "account", meaning: "계좌, 설명", synonym: "report" },
    { english: "accuse", meaning: "고발하다", synonym: "blame" },
    { english: "achieve", meaning: "성취하다", synonym: "accomplish" },
    { english: "acknowledge", meaning: "인정하다", synonym: "admit" },
    { english: "acquire", meaning: "얻다", synonym: "obtain" },
    { english: "adapt", meaning: "적응하다", synonym: "adjust" },
    { english: "address", meaning: "주소, 연설하다", synonym: "speech" }, // Total 70+ words
];



async function main() {
    console.log('Starting daily seed...');

    // 0. CLEANUP (Critical fix: Remove old placeholder words)
    console.log('Cleaning old data...');
    await prisma.dailyWord.deleteMany({});
    await prisma.dailyPlan.deleteMany({});
    await prisma.user.deleteMany({}); // Clear users
    await prisma.word.deleteMany({});

    // Create Default User
    const hashedPassword = await bcrypt.hash('password', 10);
    const user = await prisma.user.create({
        data: {
            username: 'student1',
            password: hashedPassword,
            role: 'STUDENT'
        }
    });
    console.log('Created default user: student1');

    for (const w of WORDS) {
        await prisma.word.upsert({
            where: { english: w.english },
            update: {},
            create: { english: w.english, meaning: w.meaning, example: w.synonym }
        });
    }

    // 3. Create Daily Plans from Feb 8 to June 30
    const start = new Date('2026-02-08');
    const end = new Date('2026-06-30');

    // Calculate number of days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const allWords = await prisma.word.findMany();

    console.log(`Generating plans for ${diffDays} days...`);

    for (let i = 0; i < diffDays; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD

        // Check if plan exists for this user
        const exists = await prisma.dailyPlan.findUnique({
            where: {
                date_userId: { date: dateStr, userId: user.id }
            }
        });
        if (exists) continue;

        // Pick 10 random words
        const shuffled = allWords.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        await prisma.dailyPlan.create({
            data: {
                date: dateStr,
                status: 'LEARNING',
                userId: user.id, // Link to user
                words: {
                    create: selected.map(w => ({
                        wordId: w.id
                    }))
                }
            }
        });
        // Console log every 10 days to reduce noise
        if (i % 10 === 0) console.log(`Created plan for ${dateStr}`);
    }
    console.log('Seeding completed!');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
