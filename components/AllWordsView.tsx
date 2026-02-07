import React from 'react';

export const AllWordsView = ({ words, onBack }: { words: any[], onBack: () => void }) => {
    return (
        <div className="max-w-5xl mx-auto py-8">
            <button
                onClick={onBack}
                className="mb-6 text-gray-500 hover:text-black flex items-center gap-2"
            >
                <span>←</span> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-6">Learned Words & Sentences</h1>

            {words.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    No words learned yet. Start a daily challenge!
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-zinc-800 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Word</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-1/3">Sentence</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-zinc-700">
                            {words.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap align-top">
                                        {item.dailyPlan.date}
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-lg">{item.word.english}</div>
                                        <div className="text-sm text-gray-500">{item.word.meaning}</div>
                                        <div className="text-xs text-gray-400 mt-1 italic">{item.word.example}</div>
                                    </td>
                                    <td className="p-4 text-gray-700 dark:text-gray-200 align-top italic">
                                        "{item.userSentence}"
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
