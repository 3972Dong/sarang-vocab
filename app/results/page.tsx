'use client';

import React, { useState, useEffect } from 'react';
import { DashboardStats } from '@/components/DashboardStats';
import { AllWordsView } from '@/components/AllWordsView';
import Link from 'next/link';

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
        <main className="min-h-screen p-8 max-w-4xl mx-auto bg-gray-50/50">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="text-sarang-text hover:text-sarang-pink transition font-bold flex items-center gap-2">
                    <span>←</span> Back to Dashboard
                </Link>
            </div>

            <h1 className="text-4xl font-bold mb-10 text-sarang-text dark:text-white">📊 Learning Results</h1>

            <DashboardStats
                stats={stats}
                onClickWords={fetchLearnedWords}
            />

            <h2 className="text-2xl font-bold mb-6 mt-12 border-b pb-2 text-sarang-text">Monthly Performance</h2>

            <div className="space-y-6">
                {sortedMonths.map(monthKey => {
                    const plans = groupedPlans[monthKey];

                    // Calculate Monthly Avg
                    const completedPlans = plans.filter((p: any) => p.status === 'COMPLETED');
                    let totalScore = 0;
                    completedPlans.forEach((p: any) => totalScore += (p.score || 0));
                    const avgScore = completedPlans.length > 0 ? (totalScore / completedPlans.length).toFixed(1) : '0.0';

                    // Timezone safe date parsing
                    const monthDate = new Date(`${monthKey}-01T12:00:00`);
                    const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    const isExpanded = expandedMonth === monthKey;

                    return (
                        <div key={monthKey} className="border-2 border-sarang-lavender/50 rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800 hover:border-sarang-teal/50 transition">
                            <button
                                onClick={() => setExpandedMonth(isExpanded ? null : monthKey)}
                                className="w-full flex justify-between items-center p-6 bg-white hover:bg-sarang-lavender/10 transition"
                            >
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">
                                        {monthLabel}
                                    </h3>
                                    <span className={`text-sm px-3 py-1 rounded-full font-bold ${Number(avgScore) >= 4 ? 'bg-sarang-teal/30 text-teal-800' : 'bg-gray-100 text-gray-600'}`}>
                                        Avg: {avgScore} / 5
                                    </span>
                                </div>
                                <span className="text-2xl text-sarang-pink">
                                    {isExpanded ? '−' : '+'}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="p-4 bg-sarang-cream/10 border-t border-sarang-lavender/20">
                                    <table className="w-full text-left">
                                        <thead className="text-xs text-gray-400 uppercase border-b border-sarang-pink/20">
                                            <tr>
                                                <th className="py-2 pl-2">Date</th>
                                                <th className="py-2 text-right pr-2">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-sarang-pink/10">
                                            {plans.map((p: any) => (
                                                <tr key={p.date} className="group hover:bg-white/50 transition">
                                                    <td className="py-3 pl-2 text-gray-600 font-medium">
                                                        {p.date}
                                                    </td>
                                                    <td className="py-3 pr-2 text-right">
                                                        {p.status === 'COMPLETED' ? (
                                                            <span className="font-bold text-sarang-teal">
                                                                {p.score} <span className="text-gray-400 text-xs">/ 5</span>
                                                            </span>
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
