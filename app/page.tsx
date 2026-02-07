'use client';

import React, { useState, useEffect } from 'react';
import { SentenceMode } from '@/components/SentenceMode';
import { DailyTest } from '@/components/DailyTest';
import { DailyQuote } from '@/components/DailyQuote';
import Link from 'next/link';

export default function Home() {
  const [dates, setDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(new Date().toISOString().slice(0, 7)); // Default open current month

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

  if (selectedDate && currentPlan && view !== 'LIST') {
    return (
      <main className="min-h-screen p-8 max-w-3xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 text-gray-500 hover:text-black flex items-center gap-2"
        >
          <span>←</span> Back to List
        </button>

        <h1 className="text-3xl font-bold mb-2">Daily Challenge: {selectedDate}</h1>
        <div className="mb-8 text-gray-500">Status: {currentPlan.status}</div>

        {view === 'SENTENCE' && (
          <SentenceMode
            plan={currentPlan}
            onComplete={() => {
              // Once sentences are done, we move to TEST
              // Ideally we reload plan to ensure backend state is consistent, 
              // but for optimistic UI we just switch.
              setView('TEST');
            }}
          />
        )}

        {view === 'TEST' && (
          <DailyTest
            plan={currentPlan}
            onFinish={() => {
              // Test finished, score submitted.
              // Fetch plan again to get the server-calculated score? 
              // Or just show result.
              // Let's re-fetch to be safe on score.
              fetchDailyPlan(selectedDate);
              setView('RESULT');
            }}
          />
        )}

        {view === 'RESULT' && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl dark:bg-zinc-800">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">Complete!</h2>
            <p className="text-xl text-gray-500">Your Score</p>
            <div className="text-8xl font-bold text-blue-600 my-6">
              {currentPlan.score} <span className="text-4xl text-gray-400">/ 5</span>
            </div>
            <button
              onClick={handleBack}
              className="bg-black text-white px-8 py-4 rounded-xl text-lg hover:bg-zinc-800 transition"
            >
              Back to Dashboard
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
    <main className="min-h-screen p-8 max-w-5xl mx-auto bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-sarang-text dark:text-white tracking-tight mb-2">
            🌸 사랑이의 영어단어 공부
          </h1>
          <p className="text-gray-500 font-medium text-lg ml-1">
            Be Consistent, Focused, and Hard-Working! 💪
          </p>
        </div>
        <Link
          href="/results"
          className="mt-4 md:mt-0 bg-white text-sarang-text border-2 border-sarang-pink px-6 py-2 rounded-full font-bold hover:bg-sarang-pink hover:text-white transition shadow-sm flex items-center gap-2"
        >
          <span>📊</span> See Results
        </Link>
      </div>

      <DailyQuote />

      {loading && <div className="text-center text-gray-400 py-10">Loading your shiny plans... ✨</div>}
      {error && <div className="text-center text-red-400 mb-4">{error}</div>}

      {!loading && !error && dates.length === 0 && (
        <div className="text-center text-gray-400">No plans found yet. Let's seed some! 🌱</div>
      )}

      <div className="space-y-6">
        {sortedMonths.map(monthKey => {
          // Fix: append heavy time to ensure it doesn't rollback to prev month in EST
          const monthDate = new Date(`${monthKey}-01T12:00:00`);
          const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          const isExpanded = expandedMonth === monthKey;

          // Calculate Progress
          const daysInMonth = groupedDates[monthKey];
          const completedCount = daysInMonth.filter((d: any) => d.status === 'COMPLETED').length;
          const progress = Math.round((completedCount / daysInMonth.length) * 100);

          return (
            <div key={monthKey} className="border-2 border-sarang-lavender/50 rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800 transition hover:shadow-md hover:border-sarang-teal/50">
              <button
                onClick={() => toggleMonth(monthKey)}
                className="w-full flex justify-between items-center p-6 bg-white hover:bg-sarang-lavender/10 transition"
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-200">
                    {monthLabel}
                  </h2>
                  <span className="text-xs bg-sarang-teal/20 text-teal-700 px-3 py-1 rounded-full font-bold">
                    {progress}% Done
                  </span>
                </div>
                <span className="text-2xl text-sarang-pink">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>

              {isExpanded && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-sarang-cream/10 border-t border-sarang-lavender/30">
                  {groupedDates[monthKey].map((d: any) => {
                    const isDone = d.status === 'COMPLETED';
                    const isReady = d.status === 'TEST_READY';
                    const isToday = d.date === new Date().toISOString().slice(0, 10);

                    return (
                      <button
                        key={d.date}
                        onClick={() => handleDateClick(d.date)}
                        className={`p-5 rounded-2xl border-2 text-left transition transform hover:scale-105 active:scale-95 relative overflow-hidden group ${isDone ? 'bg-white border-sarang-teal/30' :
                          isReady ? 'bg-white border-sarang-pink/30' :
                            'bg-white border-gray-100 shadow-sm opacity-80 hover:opacity-100'
                          } ${isToday ? 'ring-4 ring-sarang-pink/20' : ''}`}
                      >
                        {/* Status Badge */}
                        <div className="absolute top-0 right-0 p-2">
                          {isDone ? <span className="text-xl">🏆</span> : isReady ? <span className="text-xl animate-bounce">📝</span> : null}
                        </div>

                        <div className="mb-2">
                          <span className="text-lg font-bold text-gray-600 dark:text-gray-300 block">{d.date}</span>
                          {isToday && !isDone && (
                            <span className="inline-block bg-sarang-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-full">TODAY!</span>
                          )}
                        </div>

                        <div className="mt-4">
                          {isDone ? (
                            <div className="text-3xl font-bold text-sarang-teal">
                              {d.score}<span className="text-sm text-gray-300">/5</span>
                            </div>
                          ) : (
                            <div className="text-gray-400 font-medium text-sm group-hover:text-sarang-pink transition">
                              {isReady ? 'Start Test!' : 'Start Learning'}
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
