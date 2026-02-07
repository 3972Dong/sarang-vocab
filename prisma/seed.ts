import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INITIAL_WORDS = [
    { english: 'ephemeral', meaning: 'lasting for a very short time', example: 'fashions are ephemeral' },
    { english: 'serendipity', meaning: 'the occurrence of events by chance in a happy or beneficial way', example: 'a fortunate stroke of serendipity' },
    { english: 'ubiquitous', meaning: 'present, appearing, or found everywhere', example: 'his ubiquitous influence was felt by all the family' },
    { english: 'mellifluous', meaning: '(of a voice or words) sweet or musical; pleasant to hear', example: 'she had a rich, mellifluous voice' },
    { english: 'obfuscate', meaning: 'render obscure, unclear, or unintelligible', example: 'the spelling changes will deform some familiar words and obfuscate their etymological origins' },
    { english: 'quixotic', meaning: 'exceedingly idealistic; unrealistic and impractical', example: 'a vast and perhaps quixotic project' },
    { english: 'resilient', meaning: '(of a person or animal) able to withstand or recover quickly from difficult conditions', example: 'babies are generally far more resilient than new parents realize' },
    { english: 'surreptitious', meaning: 'kept secret, especially because it would not be approved of', example: 'they carried on a surreptitious affair' },
    { english: 'vicarious', meaning: 'experienced in the imagination through the feelings or actions of another person', example: 'I could glean vicarious pleasure from the struggles of my imaginary film friends' },
    { english: 'wistful', meaning: 'having or showing a feeling of vague or regretful longing', example: 'a wistful smile' },
    // Add more as needed
];

async function main() {
    console.log('Start seeding ...');
    for (const word of INITIAL_WORDS) {
        const w = await prisma.word.upsert({
            where: { english: word.english },
            update: {},
            create: {
                english: word.english,
                meaning: word.meaning,
                example: word.example,
            },
        });
        console.log(`Created word with id: ${w.id}`);
    }
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
