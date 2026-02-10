'use client';

import React, { useState, useEffect } from 'react';
import { SentenceMode } from '@/components/SentenceMode';
import { DailyTest } from '@/components/DailyTest';
import { DailyQuote } from '@/components/DailyQuote';
import Link from 'next/link';
import { UserMenu } from '@/components/UserMenu';

export default function Home() {
    const [dates, setDates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentPlan, setCurrentPlan] = useState<any>(null);
    // Helper to get consistent local date string "YYYY-MM-DD"
    // This fixes the issue where late night (e.g. 11 PM) is treated as next day in UTC
    const getLocalDate = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [expandedMonth, setExpandedMonth] = useState<string | null>(getLocalDate().slice(0, 7)); // Default open current month

    // VIEW Modes: 'LIST', 'SENTENCE', 'TEST', 'RESULT'
    const [view, setView] = useState<'LIST' | 'SENTENCE' | 'TEST' | 'RESULT'>('LIST');

    useEffect(() => {
        fetchDates();
        // Refresh dates every time we switch back to list
        if (view === 'LIST') {
            fetchDates();
        }
    }, [view]);

    // When a date is selected, load its plan
    useEffect(() => {
        if (selectedDate) fetchDailyPlan(selectedDate);
    }, [selectedDate]);


    const fetchDates = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/daily/list');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setDates(data);
                    setError('');
                } else {
                    console.error("Data is not an array:", data);
                    setError('Received invalid data format.');
                }
            } else {
                setError('Failed to load dates. Please restart the server.');
            }
        } catch (e) {
            console.error("Failed to fetch dates", e);
            setError('Error connecting to server.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDailyPlan = async (date: string) => {
        try {
            const res = await fetch(`/api/daily?date=${date}`);
            const data = await res.json();
            setCurrentPlan(data);

            // Determine initial view based on status
            if (data.status === 'COMPLETED') setView('RESULT');
            else if (data.status === 'TEST_READY') setView('TEST');
            else setView('SENTENCE');
        } catch (e) {
            console.error("Failed to fetch plan", e);
        }
    };


    const handleDateClick = (date: string) => {
        setSelectedDate(date);
    };

    const handleBack = () => {
        setSelectedDate(null);
        setCurrentPlan(null);
        setView('LIST');
        // Refresh to ensure stats are up to date
        fetchDates();
    };


    // --- RENDER: DETAIL VIEW ---

    const [busyLevel, setBusyLevel] = useState<'BUSY' | 'MODERATE' | 'RELAXED' | null>(null);

    const saveBusyLevel = async (level: string) => {
        setBusyLevel(level as any);
        if (currentPlan) {
            await fetch('/api/daily', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save_busy_level',
                    dailyPlanId: currentPlan.id,
                    level: level
                })
            });
        }
    };

    if (selectedDate && currentPlan && view !== 'LIST') {
        // If not selected yet, show ONLY the question (Blocking)
        // Also check if already saved in DB
        const effectiveBusyLevel = busyLevel || currentPlan.busyLevel;

        if (!effectiveBusyLevel && currentPlan.status !== 'COMPLETED') {
            return (
                <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-brand-background animate-in fade-in duration-500">
                    <button
                        onClick={handleBack}
                        className="absolute top-8 left-8 text-brand-secondary hover:text-brand-primary flex items-center gap-2 transition"
                    >
                        <span>←</span> Back
                    </button>

                    <div className="text-center max-w-2xl">
                        <h1 className="text-4xl md::text-5xl font-black text-brand-primary mb-6 tracking-tight">
                            How busy is your day today?
                        </h1>
                        <p className="text-xl text-brand-secondary mb-12">
                            We'll adjust your session focus based on your energy.
                        </p>

                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            {['Busy', 'Moderate', 'Relaxed'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => saveBusyLevel(level.toUpperCase())}
                                    className="group relative px-8 py-4 rounded-2xl border-2 border-brand-border bg-brand-surface hover:border-brand-accent transition-all hover:-translate-y-1 hover:shadow-lg w-full md:w-auto min-w-[160px]"
                                >
                                    <span className="block text-xl font-bold text-brand-primary mb-1 group-hover:text-brand-accent transition-colors">{level}</span>
                                    <span className="text-sm text-brand-secondary">
                                        {level === 'Busy' ? 'Quick & Essentials' : level === 'Moderate' ? 'Standard Pace' : 'Deep Dive'}

                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </main>
            );
        }

        return (
            <main className="min-h-screen p-6 md:p-8 max-w-3xl mx-auto bg-brand-background">
                <button
                    onClick={handleBack}
                    className="mb-8 text-brand-secondary hover:text-brand-primary flex items-center gap-2 transition px-2 py-2"
                >
                    <span>←</span> Back to Overview
                </button>

                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-brand-primary tracking-tight break-words">Daily Session: {selectedDate}</h1>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-8">
                        <div className="inline-block px-4 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-secondary text-sm font-medium uppercase tracking-wider shadow-sm">
                            Status: {currentPlan.status}
                        </div>
                        {effectiveBusyLevel && (
                            <div className="inline-block px-4 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-bold uppercase tracking-wider shadow-sm">
                                Mood: {effectiveBusyLevel}
                            </div>
                        )}
                    </div>
                </div>

                {view === 'SENTENCE' && (
                    <SentenceMode
                        plan={currentPlan}
                        onComplete={() => {
                            setView('TEST');
                        }}
                    />
                )}

                {view === 'TEST' && (
                    <DailyTest
                        plan={currentPlan}
                        onFinish={() => {
                            fetchDailyPlan(selectedDate);
                            setView('RESULT');
                        }}
                    />
                )}

                {view === 'RESULT' && (
                    <div className="text-center py-20 bg-brand-surface rounded-2xl border border-brand-border shadow-sm">
                        <div className="text-6xl mb-6 font-thin text-brand-primary">COMPLETE</div>
                        <p className="text-xl text-brand-secondary mb-8">Great job today!</p>
                        <button
                            onClick={handleBack}
                            className="bg-brand-primary text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-black transition shadow-lg"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </main>
        );
    }

    // --- RENDER: LIST VIEW ---

    // Group dates by month
    const groupedDates = dates.reduce((acc: any, d: any) => {
        // Filter out January 2026 or earlier if needed
        if (d.date < '2026-02-01') return acc;

        const monthKey = d.date.slice(0, 7); // "YYYY-MM"
        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(d);
        return acc;
    }, {});

    // Sort months
    const sortedMonths = Object.keys(groupedDates).sort();

    const toggleMonth = (monthKey: string) => {
        setExpandedMonth(expandedMonth === monthKey ? null : monthKey);
    };

    return (
        <main className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto bg-brand-background relative">
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
                <UserMenu />
            </div>
            <div className="flex flex-col items-center mb-8 border-b border-brand-border pb-8">
                <div className="text-center mb-8 px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-brand-primary tracking-tighter mb-4 leading-tight">
                        SARANG's VOCABULARY
                    </h1>
                    <p className="text-brand-accent font-bold text-xl md:text-3xl mt-4 animate-pulse">
                        "Consistent efforts yield the best results."
                    </p>
                </div>
                <Link
                    href="/results"
                    className="w-full md:w-auto bg-gradient-to-r from-brand-accent to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-brand-accentHover hover:to-purple-700 transition shadow-lg flex justify-center items-center gap-2 transform hover:scale-105 active:scale-95"
                >
                    <span>View Progress 📊</span>
                </Link>
            </div>

            <DailyQuote />

            {/* Usage Rules */}
            <div className="mb-12 bg-brand-surface p-8 rounded-xl border border-brand-border shadow-sm">
                <h3 className="text-xl font-bold text-brand-primary mb-6 flex items-center gap-2">
                    <span>📌</span> 학습 규칙 (Usage Rules)
                </h3>
                <ul className="space-y-4 text-brand-secondary text-sm md:text-base leading-relaxed">
                    <li className="flex gap-3">
                        <span className="shrink-0 mt-1">🔒</span>
                        <div>
                            <strong className="text-brand-primary block mb-1">미래 날짜 (Future)</strong>
                            아직 오지 않은 날짜는 클릭할 수 없습니다. (회색 처리 + 자물쇠 아이콘)<br />
                            클릭 시 <span className="italic">"This day hasn't come yet!"</span> 메시지가 뜹니다.
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="shrink-0 mt-1">⏮️</span>
                        <div>
                            <strong className="text-brand-primary block mb-1">지나간 날짜 (Past)</strong>
                            <span className="block mb-1"><span className="text-green-600 font-bold">Done (완료)</span>: 초록색으로 표시되며, 언제든지 다시 들어가서 점수를 확인하거나 복습할 수 있습니다.</span>
                            <span className="block"><span className="text-gray-400 font-bold">Missed (놓침)</span>: <strong>"오늘"</strong>에 집중하기 위해 지나간 날짜는 학습을 시작할 수 없도록 잠갔습니다.<br />
                                클릭 시 <span className="italic">"Consistency is key. Focus on Today!"</span> 메시지가 뜹니다.</span>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="shrink-0 mt-1">🔥</span>
                        <div>
                            <strong className="text-brand-primary block mb-1">오늘 (Today)</strong>
                            가장 눈에 띄게 <strong>강조(Highlight)</strong> 되어 있으며, 바로 학습을 시작할 수 있습니다.
                        </div>
                    </li>
                </ul>
            </div>

            {loading && <div className="text-center text-brand-secondary py-10">Loading study plans...</div>}
            {error && <div className="text-center text-red-500 mb-4">{error}</div>}

            {!loading && !error && dates.length === 0 && (
                <div className="text-center text-brand-secondary">No plans available.</div>
            )}

            <div className="space-y-8">
                {sortedMonths.map(monthKey => {
                    const monthDate = new Date(`${monthKey}-01T12:00:00`);
                    const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    const isExpanded = expandedMonth === monthKey;

                    const daysInMonth = groupedDates[monthKey];
                    // Removed progress calculation as requested

                    return (
                        <div key={monthKey} className="border border-brand-border rounded-xl overflow-hidden shadow-sm bg-brand-surface transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                            <button
                                onClick={() => toggleMonth(monthKey)}
                                className="w-full flex justify-between items-center p-6 bg-gradient-to-l from-brand-accent to-blue-600 text-white transition hover:brightness-110"
                            >
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold text-white">
                                        {monthLabel}
                                    </h2>
                                </div>
                                <span className="text-white/80 font-light text-2xl">
                                    {isExpanded ? '−' : '+'}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-brand-background/30 border-t border-brand-border">
                                    {groupedDates[monthKey].map((d: any) => {
                                        const isDone = d.status === 'COMPLETED';
                                        const isReady = d.status === 'TEST_READY';
                                        const isToday = d.date === getLocalDate();
                                        // Use busyLevel from data if available
                                        const busyDisplay = d.busyLevel ? d.busyLevel : '';

                                        return (
                                            <button
                                                key={d.date}
                                                onClick={() => {
                                                    if (isToday || isDone) {
                                                        handleDateClick(d.date);
                                                    } else {
                                                        const todayStr = getLocalDate();
                                                        alert(d.date > todayStr
                                                            ? "This day hasn't come yet! ⏳"
                                                            : "You missed this day! Consistency is key. Focus on Today! 💪");
                                                    }
                                                }}
                                                className={`p-5 rounded-lg border text-left transition relative overflow-hidden group ${isDone
                                                    ? 'bg-brand-surface border-green-200 shadow-sm'
                                                    : isToday
                                                        ? 'bg-brand-surface border-brand-accent shadow-md ring-2 ring-brand-accent scale-105 z-10'
                                                        : 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`text-lg font-bold block ${isDone ? 'text-green-700' : isToday ? 'text-brand-primary' : 'text-gray-400'}`}>{d.date}</span>
                                                    {isToday && !isDone && (
                                                        <span className="bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">Today</span>
                                                    )}
                                                    {isDone && (
                                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Done</span>
                                                    )}
                                                    {!isToday && !isDone && (
                                                        <span className="text-gray-400 text-lg">🔒</span>
                                                    )}
                                                </div>

                                                <div className="mt-2 text-right">
                                                    {isDone ? (
                                                        <div className="text-sm font-bold text-brand-primary">
                                                            {busyDisplay && <span className="text-brand-accent uppercase tracking-wider">{busyDisplay}</span>}
                                                        </div>
                                                    ) : (
                                                        <div className={`text-sm font-medium transition ${isToday ? 'text-brand-accent group-hover:text-brand-accentHover' : 'text-gray-400'}`}>
                                                            {isToday ? 'Start Learning →' : (d.date > getLocalDate() ? 'Coming Soon' : 'Missed')}
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
