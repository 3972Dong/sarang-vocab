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
        <div className="bg-gradient-to-r from-sarang-pink to-sarang-lightPink p-6 rounded-3xl shadow-md text-center mb-8 transform transition hover:scale-[1.02]">
            <span className="inline-block bg-white/50 text-blue-900 text-xs font-bold px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
                ✨ Today's Motivation
            </span>
            <p className="text-xl md:text-2xl font-bold text-blue-900 mb-2 font-serif italic">
                "{quote.text}"
            </p>
            <p className="text-blue-800 text-sm font-medium">
                — {quote.author}
            </p>
        </div>
    );
};
