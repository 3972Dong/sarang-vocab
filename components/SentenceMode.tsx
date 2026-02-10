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

    const completedCount = Object.keys(sentences).length + plan.words.filter((w: any) => w.userSentence).length;
    // Note: This simple count might double count if we edit pre-filled ones, but for MVP assuming simple state. 
    // Better: 
    const isComplete = plan.words.every((w: any) => (sentences[w.wordId] || w.userSentence)?.length > 0);

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-brand-primary mb-2">Sentence Composition</h2>
                <p className="text-brand-secondary">Construct meaningful sentences to internalize each word.</p>
            </div>

            <div className="space-y-8">
                {plan.words.map((dw: any) => (
                    <div key={dw.wordId} className="p-6 border border-brand-border rounded-xl bg-brand-surface shadow-sm transition hover:shadow-md">
                        <div className="flex justify-between items-baseline mb-4 border-b border-brand-border pb-2">
                            <h3 className="text-2xl font-bold text-brand-primary">{dw.word.english}</h3>
                            <span className="text-sm text-brand-secondary italic">{dw.word.example}</span>
                        </div>
                        <p className="text-brand-secondary mb-4 text-lg">{dw.word.meaning}</p>

                        <textarea
                            className="w-full border border-brand-border rounded-lg p-4 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition bg-brand-background text-brand-primary"
                            placeholder={`Compose a sentence using "${dw.word.english}"...`}
                            rows={3}
                            value={sentences[dw.wordId] || dw.userSentence || ''}
                            onChange={(e) => handleChange(dw.wordId, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || !isComplete}
                className={`w-full py-4 rounded-xl text-lg font-semibold transition shadow-lg ${loading || !isComplete
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-brand-accent text-white hover:bg-brand-accentHover'
                    }`}
            >
                {loading ? 'Saving Progress...' : isComplete ? 'Submit & Proceed to Test' : 'Complete All Sentences to Continue'}
            </button>
        </div>
    );
};
