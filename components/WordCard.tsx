import React from 'react';

interface Word {
    id: string;
    english: string;
    meaning: string;
    example?: string | null;
}

interface WordCardProps {
    word: Word;
    revealed?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ word, revealed = true }) => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md space-y-4 border border-gray-100 dark:bg-zinc-800 dark:border-zinc-700">
            <div className="text-xl font-medium text-black dark:text-white">{word.meaning}</div>
            {revealed && (
                <>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{word.english}</div>
                    {word.example && <p className="text-gray-500 italic dark:text-gray-400">"{word.example}"</p>}
                </>
            )}
        </div>
    );
};
