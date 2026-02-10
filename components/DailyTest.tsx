'use client';

import React, { useState, useEffect } from 'react';

export const DailyTest = ({ plan, onFinish }: { plan: any, onFinish: () => void }) => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [started, setStarted] = useState(false);

    const MOTIVATIONAL_PHRASES = [
        "Amazing! 🌟", "Perfect! 💖", "You're a Star! ⭐", "Keep Shining! ✨", "Brilliant! 💡", "So Smart! 🧠"
    ];

    useEffect(() => {
        if (!plan?.words) return;
        // Pick 5 random words (or all if less than 5)
        const shuffled = [...plan.words].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 5));
    }, [plan]);

    const handleAnswer = async () => {
        if (!input.trim()) return;

        const currentQ = questions[currentIndex];
        const isCorrect = input.trim().toLowerCase() === currentQ.word.english.toLowerCase();

        if (isCorrect) {
            setScore(s => s + 1);
            const randomPhrase = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
            setFeedback(randomPhrase);
        } else {
            setFeedback(`Wrong! It was "${currentQ.word.english}"`);
        }

        setTimeout(async () => {
            setFeedback(null);
            setInput('');
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(i => i + 1);
            } else {
                // Finish
                const finalScore = isCorrect ? score + 1 : score;
                await saveScore(finalScore);
                onFinish();
            }
        }, 2000);
    };

    const saveScore = async (finalScore: number) => {
        await fetch('/api/daily', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'submit_score',
                dailyPlanId: plan.id,
                score: finalScore
            })
        });
    };

    if (!started) {
        return (
            <div className="max-w-md mx-auto py-10 text-center">
                <div className="bg-brand-surface p-10 rounded-2xl shadow-xl border border-brand-border">
                    <div className="text-4xl mb-6 text-brand-primary font-light">Daily Evaluation</div>

                    <div className="bg-brand-background border-l-4 border-brand-secondary p-4 mb-8 text-left">
                        <p className="font-bold text-brand-primary mb-1 text-sm uppercase tracking-wide">Usage Note</p>
                        <p className="text-sm text-brand-secondary">
                            This test can be taken once per day. Results are final. Ensure you are ready before proceeding.
                        </p>
                    </div>

                    <button
                        onClick={() => setStarted(true)}
                        className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-lg"
                    >
                        Begin Assessment
                    </button>
                    <div className="mt-4 text-brand-secondary text-sm">Good luck.</div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) return <div className="text-center py-10 text-brand-secondary">Preparing Assessment...</div>;

    const currentQ = questions[currentIndex];

    return (
        <div className="max-w-md mx-auto py-6">
            <div className="flex justify-between items-end mb-6 border-b border-brand-border pb-4">
                <h2 className="text-xl font-bold text-brand-primary">Assessment</h2>
                <span className="text-brand-secondary font-mono text-sm">
                    {currentIndex + 1} / {questions.length}
                </span>
            </div>

            <div className="p-10 bg-brand-surface rounded-2xl shadow-lg border border-brand-border text-center relative overflow-hidden">
                <div className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-6">Translate to English</div>
                <div className="text-4xl font-extrabold mb-10 text-brand-primary">{currentQ.word.meaning}</div>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`w-full p-4 border-b-2 text-center text-2xl font-light transition outline-none bg-transparent ${feedback && !feedback.startsWith('Wrong') ? 'border-green-500 text-green-700' :
                            feedback?.startsWith('Wrong') ? 'border-red-500 text-red-700' :
                                'border-brand-border focus:border-brand-primary text-brand-primary'
                        }`}
                    placeholder="Type answer..."
                    autoFocus
                    disabled={!!feedback}
                    onKeyDown={(e) => e.key === 'Enter' && !feedback && handleAnswer()}
                />

                {feedback && (
                    <div className={`mt-8 text-lg font-medium ${feedback.startsWith('Wrong') ? 'text-red-600' : 'text-green-600'}`}>
                        {feedback}
                    </div>
                )}

                {!feedback && (
                    <button
                        onClick={handleAnswer}
                        className="mt-10 w-full bg-brand-secondary text-white py-4 rounded-xl font-semibold hover:bg-brand-primary transition shadow-md"
                        disabled={!input.trim()}
                    >
                        Submit Answer
                    </button>
                )}
            </div>
        </div>
    );
};
