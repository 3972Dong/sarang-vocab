'use client';

import React, { useState } from 'react';

export const SentenceMode = ({ plan, onComplete }: { plan: any, onComplete: () => void }) => {
    const [sentences, setSentences] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // If pre-filled (revisiting), load them? 
    // For MVP, just assume empty or partial.

    const handleChange = (wordId: string, val: string) => {
        setSentences(prev => ({ ...prev, [wordId]: val }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Save all sentences
        // In real app, save globally or one by one. 
        // For MVP, loop requests.
        for (const w of plan.words) {
            const s = sentences[w.wordId];
            if (s) {
                await fetch('/api/daily', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'submit_sentence',
                        dailyPlanId: plan.id,
                        wordId: w.wordId,
                        sentence: s
                    })
                });
            }
        }

        // Update status
        await fetch('/api/daily', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'complete_learning', dailyPlanId: plan.id })
        });

        setLoading(false);
        onComplete();
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Write Sentences</h2>
            <p className="text-gray-500">Write a sentence for each word to unlock the test.</p>

            <div className="space-y-6">
                {plan.words.map((dw: any) => (
                    <div key={dw.wordId} className="p-4 border rounded shadow-sm bg-white dark:bg-zinc-800 dark:border-zinc-700">
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-xl font-bold">{dw.word.english}</h3>
                            <span className="text-sm text-gray-400">{dw.word.example}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{dw.word.meaning}</p>

                        <textarea
                            className="w-full border rounded p-2 dark:bg-zinc-700 dark:border-zinc-600"
                            placeholder={`Write a sentence using "${dw.word.english}"...`}
                            value={sentences[dw.wordId] || dw.userSentence || ''}
                            onChange={(e) => handleChange(dw.wordId, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition"
            >
                {loading ? 'Saving...' : 'Submit & Start Test'}
            </button>
        </div>
    );
};
