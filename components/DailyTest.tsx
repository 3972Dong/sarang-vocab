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
                <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-sarang-pink/30">
                    <div className="text-6xl mb-6">📝</div>
                    <h2 className="text-3xl font-bold mb-4 text-sarang-text">Daily Vocab Test</h2>

                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-8 text-left">
                        <p className="font-bold text-orange-600 mb-1">⚠️ Important Warning</p>
                        <p className="text-sm text-orange-800">
                            You can only take this test <span className="font-bold">ONCE per day</span>.
                            Results passed cannot be changed. Are you ready?
                        </p>
                    </div>

                    <button
                        onClick={() => setStarted(true)}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition shadow-md hover:shadow-lg active:scale-95"
                    >
                        Start Test 💪
                    </button>
                    <div className="mt-4 text-gray-400 text-sm">Good luck, Sarang!</div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) return <div>Loading Test...</div>;

    const currentQ = questions[currentIndex];

    return (
        <div className="max-w-md mx-auto py-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-sarang-text">
                Question {currentIndex + 1} <span className="text-gray-300">/ {questions.length}</span>
            </h2>

            <div className="p-8 bg-white rounded-3xl shadow-sm border-2 border-sarang-lavender/50 text-center relative overflow-hidden">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Translate to English</div>
                <div className="text-3xl font-bold mb-8 text-gray-700">{currentQ.word.meaning}</div>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`w-full p-4 border-2 rounded-2xl text-center text-xl font-bold transition outline-none ${feedback && !feedback.startsWith('Wrong') ? 'bg-green-50 border-green-400 text-green-700' :
                            feedback?.startsWith('Wrong') ? 'bg-red-50 border-red-400 text-red-700' :
                                'border-gray-200 focus:border-sarang-teal focus:ring-4 focus:ring-sarang-teal/10'
                        }`}
                    placeholder="Type answer..."
                    autoFocus
                    disabled={!!feedback}
                    onKeyDown={(e) => e.key === 'Enter' && !feedback && handleAnswer()}
                />

                {feedback && (
                    <div className={`mt-6 text-xl font-bold animate-bounce ${feedback.startsWith('Wrong') ? 'text-red-500' : 'text-sarang-teal'
                        }`}>
                        {feedback}
                    </div>
                )}

                {!feedback && (
                    <button
                        onClick={handleAnswer}
                        className="mt-8 w-full bg-sarang-text text-white py-4 rounded-xl font-bold hover:bg-black transition shadow-md active:scale-95"
                        disabled={!input.trim()}
                    >
                        Check Answer ✨
                    </button>
                )}
            </div>
        </div>
    );
};
