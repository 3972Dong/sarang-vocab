'use client';

import React, { useState, useEffect } from 'react';

const QUOTES = [
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Strive for progress, not perfection.", author: "Unknown" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
];

export const DailyQuote = () => {
    const [quote, setQuote] = useState({ text: '', author: '' });

    useEffect(() => {
        // Pick a quote based on the day of the month so it stays same for the day
        const day = new Date().getDate();
        const index = day % QUOTES.length;
        setQuote(QUOTES[index]);
    }, []);

    if (!quote.text) return null;

    return (
        <div className="text-center mb-8 px-4 animate-in fade-in duration-700">
            <h3 className="text-xl md:text-2xl font-serif text-brand-secondary italic mb-2">
                "{quote.text}"
            </h3>
            <p className="text-sm font-bold text-brand-primary/60 uppercase tracking-widest">
                — {quote.author}
            </p>
        </div>
    );
};
