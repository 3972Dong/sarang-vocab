import { prisma } from '@/lib/prisma';
import SchoolList from '@/components/Schools/SchoolList';

export const dynamic = 'force-dynamic';

export default async function SchoolsPage() {
    const schools = await prisma.school.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <main className="min-h-screen bg-gray-50">
            <SchoolList initialSchools={schools} />
        </main>
    );
}
