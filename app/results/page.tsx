'use client';

import React, { useState, useEffect } from 'react';
import { DashboardStats } from '@/components/DashboardStats';
import { AllWordsView } from '@/components/AllWordsView';
import Link from 'next/link';
import { UserMenu } from '@/components/UserMenu';

export default function ResultsPage() {
    const [stats, setStats] = useState<any>(null);
    const [view, setView] = useState<'STATS' | 'WORDS'>('STATS');
    const [learnedWords, setLearnedWords] = useState<any[]>([]);
    const [allPlans, setAllPlans] = useState<any[]>([]);
    const [expandedMonth, setExpandedMonth] = useState<string | null>(new Date().toISOString().slice(0, 7));

    useEffect(() => {
        fetchStats();
        fetchAllPlans();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch stats for current month or all time? 
            // For MVP let's default to current month (2026-02 for consistency with request)
            const res = await fetch('/api/daily/stats?month=2026-02');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) { console.error(e); }
    };

    const fetchAllPlans = async () => {
        try {
            const res = await fetch('/api/daily/list'); // Returns [{ date, status, score }, ...]
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) setAllPlans(data);
            }
        } catch (e) { console.error(e); }
    };

    const fetchLearnedWords = async () => {
        try {
            const res = await fetch('/api/words/learned');
            if (res.ok) {
                const data = await res.json();
                setLearnedWords(data);
                setView('WORDS');
            }
        } catch (e) { console.error(e); }
    };

    if (view === 'WORDS') {
        return <AllWordsView words={learnedWords} onBack={() => setView('STATS')} />;
    }

    // Group plans by month
    const groupedPlans = allPlans.reduce((acc: any, plan: any) => {
        // Filter out January (optional, but consistent with main page)
        if (plan.date < '2026-02-01') return acc;

        const monthKey = plan.date.slice(0, 7);
        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(plan);
        return acc;
    }, {});

    const sortedMonths = Object.keys(groupedPlans).sort();

    return (
        <main className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto bg-brand-background relative">
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
                <UserMenu />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <Link href="/" className="text-brand-secondary hover:text-brand-primary transition font-bold flex items-center gap-2 px-2 py-2">
                    <span>←</span> Back to Dashboard
                </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-black mb-10 text-brand-primary tracking-tight">📊 Learning Results</h1>

            <div className="mb-12">
                <button
                    onClick={fetchLearnedWords}
                    className="w-full py-5 bg-brand-surface border border-brand-border rounded-xl shadow-sm text-brand-primary font-bold hover:shadow-md hover:border-brand-accent transition flex justify-between px-6 items-center group"
                >
                    <span className="group-hover:text-brand-accent transition">📚 Review All Learned Words</span>
                    <span className="text-brand-accent">→</span>
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-12 border-b border-brand-border pb-4 text-brand-primary">Monthly Performance</h2>

            <div className="space-y-6">
                {sortedMonths.map(monthKey => {
                    const plans = groupedPlans[monthKey];

                    // Timezone safe date parsing
                    const monthDate = new Date(`${monthKey}-01T12:00:00`);
                    const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    const isExpanded = expandedMonth === monthKey;

                    return (
                        <div key={monthKey} className="border-2 border-brand-border rounded-xl overflow-hidden shadow-sm bg-brand-surface hover:border-brand-accent/30 transition">
                            <button
                                onClick={() => setExpandedMonth(isExpanded ? null : monthKey)}
                                className="w-full flex justify-between items-center p-5 md:p-6 bg-brand-surface hover:bg-brand-background transition"
                            >
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg md:text-xl font-bold text-brand-primary">
                                        {monthLabel}
                                    </h3>
                                </div>
                                <span className="text-2xl text-brand-accent">
                                    {isExpanded ? '−' : '+'}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="p-0 bg-brand-background/30 border-t border-brand-border overflow-x-auto">
                                    <table className="w-full text-left min-w-[300px]">
                                        <thead className="text-xs text-brand-secondary uppercase border-b border-brand-border bg-brand-background/50">
                                            <tr>
                                                <th className="py-3 pl-4 font-semibold">Date</th>
                                                <th className="py-3 text-center font-semibold">Score</th>
                                                <th className="py-3 text-right pr-4 font-semibold">Mood</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand-border">
                                            {plans.map((p: any) => (
                                                <tr key={p.date} className="group hover:bg-white/80 transition">
                                                    <td className="py-4 pl-4 text-brand-primary font-medium text-sm md:text-base">
                                                        {p.date.slice(5)} {/* Show MM-DD only on mobile? No, let's show full or slice year. Let's keep full for now but maybe slice year if space needed. 2026-02-08 is long. Let's just keep as is, scrolling handles it. */}
                                                    </td>
                                                    <td className="py-4 text-center">
                                                        {p.status === 'COMPLETED' ? (
                                                            <span className="font-bold text-brand-primary text-sm md:text-base">
                                                                {p.score} <span className="text-brand-secondary text-xs font-normal">/ 5</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-300">-</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 pr-4 text-right">
                                                        {p.status === 'COMPLETED' ? (
                                                            p.busyLevel ? (
                                                                <span className="bg-brand-accent/10 text-brand-accent px-2 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                                                                    {p.busyLevel}
                                                                </span>
                                                            ) : (
                                                                <span className="text-green-600 text-[10px] md:text-xs font-bold uppercase tracking-wider">DONE</span>
                                                            )
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">
                                                                {p.status === 'TEST_READY' ? 'Ready' : 'Incomplete'}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}

                {sortedMonths.length === 0 && (
                    <div className="text-center text-gray-500 py-10">No history found.</div>
                )}
            </div>
        </main>
    );
}
