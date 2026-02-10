import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SCHOOLS = [
    // MA
    {
        name: "Lowell Catholic High",
        state: "MA", city: "Lowell", type: "DAY", gender: "COED",
        toeflReq: "No TOEFL required", nicheGrade: "A-", apCount: 9, tuition: "$20,000",
        description: "Strong Catholic school in Lowell, MA."
    },
    {
        name: "Saint Paul Diocesan Junior/Senior High School",
        state: "MA", city: "Worcester", type: "DAY", gender: "COED",
        toeflReq: "No minimum score required", nicheGrade: "B", apCount: 6, tuition: "$20,000",
        description: "Located in Worcester, offering a supportive environment."
    },
    {
        name: "Saint John's High School",
        state: "MA", city: "Shrewsbury", type: "DAY", gender: "BOYS",
        toeflReq: "80", nicheGrade: "A+", apCount: 24, tuition: "$21,475",
        otherFees: "$2,500 International Fee",
        description: "Prestigious all-boys school with extensive AP offerings."
    },
    // CT
    {
        name: "Hamden Hall Country Day School",
        state: "CT", city: "Hamden", type: "DAY", gender: "COED",
        toeflReq: "80", nicheGrade: "A+", apCount: 0, tuition: "$50,900",
        description: "Top-tier day school near Yale University."
    },
    {
        name: "Kingswood Oxford School", // Fixed typo "Oxfood"
        state: "CT", city: "West Hartford", type: "DAY", gender: "COED",
        toeflReq: "90-100", nicheGrade: "A+", apCount: 14, tuition: "$52,500+",
        otherFees: "$750 Activity fee",
        description: "Renowned day school with strong academic rigor."
    },
    {
        name: "Northwest Catholic High School",
        state: "CT", city: "West Hartford", type: "DAY", gender: "COED",
        toeflReq: "70", nicheGrade: "A+", apCount: 18, tuition: "Contact for details",
        description: "Excellent Catholic college prep school."
    },
    {
        name: "Saint Paul Catholic High School",
        state: "CT", city: "Bristol", type: "DAY", gender: "COED",
        toeflReq: "No minimum", nicheGrade: "B", apCount: 13, tuition: "$19,100",
        description: "Affordable option with solid academics."
    },
    {
        name: "The Master's School",
        state: "CT", city: "West Simsbury", type: "DAY", gender: "COED",
        toeflReq: "70+", nicheGrade: "A", apCount: 6, tuition: "$34,999",
        otherFees: "$5,200 Int'l Fee",
        description: "Christian college preparatory school."
    },
    {
        name: "Watkinson School",
        state: "CT", city: "West Hartford", type: "DAY", gender: "COED",
        toeflReq: "65", nicheGrade: "A+", apCount: 10, tuition: "$51,300",
        description: "Progressive education with a focus on individual learning."
    },
    // NJ / PA / NE
    {
        name: "The King's Christian School",
        state: "NJ", city: "Cherry Hill", type: "DAY", gender: "COED",
        toeflReq: "50-75+", nicheGrade: "A-", apCount: 9, tuition: "$13,900",
        description: "Christian education in minimal cost."
    },
    {
        name: "Paul VI High School",
        state: "NJ", city: "Haddonfield", type: "DAY", gender: "COED",
        toeflReq: "60", nicheGrade: "A-", apCount: 19, tuition: "$12,845",
        description: "High performing Catholic high school."
    },
    {
        name: "Lansdale Catholic High School",
        state: "PA", city: "Lansdale", type: "DAY", gender: "COED",
        toeflReq: "61", nicheGrade: "B+", apCount: 16, tuition: "$15,150",
        description: "Located in Pennsylvania suburbs."
    },
    {
        name: "Grand Island Central Catholic",
        state: "NE", city: "Grand Island", type: "DAY", gender: "COED",
        toeflReq: "None", nicheGrade: "B+", apCount: 0, tuition: "$11,000",
        programFee: "$32,000 (Total w/ Housing)",
        description: "Very affordable with homestay included. Strong community feedback."
    },
    // CA
    {
        name: "Bishop Alemany High School",
        state: "CA", city: "Mission Hills", type: "DAY", gender: "COED",
        toeflReq: "Interview", nicheGrade: "A", apCount: 15, tuition: "Contact School",
        description: "Large Catholic school with diverse programs."
    },
    {
        name: "Calvary Chapel Christian School",
        state: "CA", city: "Downey", type: "DAY", gender: "COED",
        toeflReq: "61", nicheGrade: "B+", apCount: 5, tuition: "$46,000 (Total)",
        description: "Includes ESL & Homestay. BGE Managed Program."
    },
    {
        name: "St. John Bosco High School",
        state: "CA", city: "Bellflower", type: "DAY", gender: "BOYS",
        toeflReq: "65-70", nicheGrade: "A", apCount: 0, tuition: "$33,500",
        description: "Famous for athletics and strong academics."
    },
    {
        name: "St. Joseph High School",
        state: "CA", city: "Lakewood", type: "DAY", gender: "GIRLS",
        toeflReq: "65+", nicheGrade: "A", apCount: 20, tuition: "Contact School",
        description: "Sister school to St. John Bosco."
    },
    {
        name: "Valley Christian School",
        state: "CA", city: "Cerritos", type: "DAY", gender: "COED",
        toeflReq: "70", nicheGrade: "A+", apCount: 12, tuition: "$30,180",
        description: "Top ranked Christian school in Cerritos."
    },
    {
        name: "Orange Lutheran High School",
        state: "CA", city: "Orange", type: "DAY", gender: "COED",
        toeflReq: "73", nicheGrade: "A+", apCount: 19, tuition: "Contact School",
        description: "Premier Lutheran high school in OC."
    },
    {
        name: "The Harker School",
        state: "CA", city: "San Jose", type: "DAY", gender: "COED",
        toeflReq: "95+", nicheGrade: "A+", apCount: 26, tuition: "$55,000+",
        description: "One of the top academic schools in the nation. Silicon Valley location."
    },
    {
        name: "Fairmont Preparatory Academy",
        state: "CA", city: "Anaheim", type: "DAY", gender: "COED",
        toeflReq: "Varies", nicheGrade: "A+", apCount: 23, tuition: "Contact School",
        description: "Offers International Foundation Year and strong IB/AP tracks."
    },
    // FL
    {
        name: "American Heritage School",
        state: "FL", city: "Plantation", type: "DAY", gender: "COED",
        toeflReq: "60+", nicheGrade: "A+", apCount: 24, tuition: "$48,000 (Int'l)",
        description: "Top ranked for Math competitions and Pre-Med/Pre-Law tracks."
    },
    {
        name: "The Sagemont School",
        state: "FL", city: "Weston", type: "DAY", gender: "COED",
        toeflReq: "Any", nicheGrade: "A+", apCount: 17, tuition: "$19,350",
        description: "Located in a safe, affluent community."
    },
    // BOARDING SCHOOLS (From the second list)
    {
        name: "Archbishop Riordan High School",
        state: "CA", city: "San Francisco", type: "BOARDING", gender: "BOYS",
        toeflReq: "60+", nicheGrade: "A", apCount: 14, tuition: "Contact School",
        description: "Strong Music & Art, High Tech, STEAM, Strong Sports. All Boys Boarding."
    },
    {
        name: "San Domenico School",
        state: "CA", city: "San Anselmo", type: "BOARDING", gender: "COED",
        toeflReq: "No minimum", nicheGrade: "A+", apCount: 15, tuition: "Contact School",
        description: "ELL program, 1:1 iPad, High SAT Avg. Good College Acceptance."
    },
    {
        name: "The Storm King School",
        state: "NY", city: "Cornwall-on-Hudson", type: "BOARDING", gender: "COED",
        toeflReq: "Rec.", nicheGrade: "A+", apCount: 10, tuition: "Contact School",
        description: "Strong Arts Program, Fashion Design Offered. NY's oldest prestigious boarding school."
    },
    {
        name: "Thornton Academy",
        state: "ME", city: "Saco", type: "BOARDING", gender: "COED",
        toeflReq: "None", nicheGrade: "A-", apCount: 26, tuition: "Contact School",
        description: "Historic school with extensive APs and 4 modern dorms."
    },
    {
        name: "Fryeburg Academy",
        state: "ME", city: "Fryeburg", type: "BOARDING", gender: "COED",
        toeflReq: "None", nicheGrade: "A-", apCount: 16, tuition: "Contact School",
        description: "Strong winter sports tradition, close to ski resorts."
    },
    {
        name: "John Bapst Memorial High School",
        state: "ME", city: "Bangor", type: "BOARDING", gender: "COED",
        toeflReq: "None", nicheGrade: "A-", apCount: 28, tuition: "Contact School",
        description: "Distinguished School with strong STEM and Homestay/Dorm options."
    },
    {
        name: "Foxcroft Academy",
        state: "ME", city: "Dover-Foxcroft", type: "BOARDING", gender: "COED",
        toeflReq: "None", nicheGrade: "B+", apCount: 20, tuition: "Contact School",
        description: "IB World School with 23 varsity sports."
    },
    {
        name: "Kents Hill School",
        state: "ME", city: "Kents Hill", type: "BOARDING", gender: "COED",
        toeflReq: "None", nicheGrade: "A-", apCount: 18, tuition: "Contact School",
        description: "400-acre campus with private ski slope and hockey arena."
    }
];

async function main() {
    console.log('Seeding Schools...');

    // Clear existing if needed, or upsert.
    // For safety, let's just create if not exists or update.
    // Using name as unique key for simplicity in this seed script.

    for (const s of SCHOOLS) {
        // Basic logic to determine Gender enum
        let g = 'COED';
        if (s.gender === 'BOYS') g = 'BOYS';
        if (s.gender === 'GIRLS') g = 'GIRLS';

        await prisma.school.create({
            data: {
                name: s.name,
                state: s.state,
                city: s.city,
                type: s.type,
                gender: g,
                toeflReq: s.toeflReq,
                nicheGrade: s.nicheGrade,
                apCount: s.apCount,
                tuition: s.tuition,
                otherFees: s.otherFees,
                programFee: s.programFee,
                description: s.description,
                tags: []
            }
        });
        console.log(`Created ${s.name}`);
    }
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
