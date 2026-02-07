'use client';

import React, { useState, useEffect } from 'react';

// Using props for MVP display
interface DashboardProps {
    monthKey: string;
    months: string[];
    onSelectMonth: (key: string) => void;
    totalGoal: number;
    currentBaseGoal: number;
    carriedOverCount: number;
    activeWordsCount: number;
    correctCount: number; // New: Total correct answers this month
    attemptCount: number; // New: Total attempts this month
    onRollover: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    monthKey,
    months,
    onSelectMonth,
    totalGoal,
    currentBaseGoal,
    carriedOverCount,
    activeWordsCount,
    correctCount,
    attemptCount,
    onRollover
}) => {
    const accuracy = attemptCount > 0 ? Math.round((correctCount / attemptCount) * 100) : 0;
    // Simplified completion: Active Words / Total Goal? Or Learned / Total Goal.
    // For MVP, lets show Active Words / Total Goal as "Progress to Goal"
    const progress = totalGoal > 0 ? Math.round((activeWordsCount / totalGoal) * 100) : 0;

    return (
        <div className="w-full">
            <div className="mb-6 flex justify-between items-center bg-gray-100 p-4 rounded-lg dark:bg-zinc-800">
                <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg">Current Month:</span>
                    <select
                        value={monthKey}
                        onChange={(e) => onSelectMonth(e.target.value)}
                        className="p-2 border rounded bg-white dark:bg-zinc-700 dark:border-zinc-600"
                    >
                        {months.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
                <div className="text-sm text-gray-500">
                    {accuracy}% Accuracy ({correctCount}/{attemptCount})
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl dark:bg-blue-900/20">
                    <div className="text-gray-600 text-sm dark:text-gray-400">Monthly Goal</div>
                    <div className="text-4xl font-bold text-black dark:text-white">{totalGoal}</div>
                    <div className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                        Base: {currentBaseGoal} + Carried: {carriedOverCount}
                    </div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl dark:bg-green-900/20">
                    <div className="text-gray-600 text-sm dark:text-gray-400">Progress</div>
                    <div className="text-4xl font-bold text-black dark:text-white">{progress}%</div>
                    <div className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                        {activeWordsCount} words registered
                    </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl flex flex-col justify-between dark:bg-purple-900/20">
                    <div>
                        <div className="text-gray-600 text-sm dark:text-gray-400">Next Month Preview</div>
                        <div className="text-sm mt-1 text-gray-400">Simulate end of month</div>
                    </div>
                    <button
                        onClick={onRollover}
                        className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
                    >
                        Trigger Rollover
                    </button>
                </div>
            </div>
        </div>
    );
};
