'use client';

import React, { useState } from 'react';

interface NewWord {
    english: string;
    meaning: string;
    example: string;
}

export const AddWord = ({ onAdd, monthKey }: { onAdd: () => void, monthKey: string }) => {
    // Initialize with 10 empty rows
    const [rows, setRows] = useState<NewWord[]>(
        Array(10).fill(null).map(() => ({ english: '', meaning: '', example: '' }))
    );

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (index: number, field: keyof NewWord, value: string) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Filter out rows where english or meaning is empty
        const validRows = rows.filter(r => r.english.trim() && r.meaning.trim());

        if (validRows.length === 0) {
            setMessage('Please fill in at least one word.');
            setLoading(false);
            return;
        }

        try {
            // Loop through and add each word (could be optimized with a bulk API, but this is fine for MVP)
            let successCount = 0;
            for (const row of validRows) {
                const res = await fetch('/api/words', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...row, monthKey }),
                });
                if (res.ok) successCount++;
            }

            setMessage(`Successfully added ${successCount} words!`);
            // Reset form
            setRows(Array(10).fill(null).map(() => ({ english: '', meaning: '', example: '' })));
            onAdd();
        } catch (error) {
            setMessage('Error adding words.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 border border-gray-100 dark:bg-zinc-800 dark:border-zinc-700 overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">Add Words (Bulk)</h2>

            {message && (
                <div className={`p-4 rounded mb-4 ${message.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b dark:border-zinc-700">
                            <th className="py-2 px-2">#</th>
                            <th className="py-2 px-2">English</th>
                            <th className="py-2 px-2">Synonyms</th>
                            <th className="py-2 px-2">Korean (Meaning)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="border-b dark:border-zinc-700">
                                <td className="py-2 px-2 text-gray-500">{index + 1}</td>
                                <td className="py-2 px-2">
                                    <input
                                        type="text"
                                        className="w-full border rounded p-1 dark:bg-zinc-700 dark:border-zinc-600"
                                        value={row.english}
                                        onChange={(e) => handleChange(index, 'english', e.target.value)}
                                        placeholder="Word"
                                    />
                                </td>
                                <td className="py-2 px-2">
                                    <input
                                        type="text"
                                        className="w-full border rounded p-1 dark:bg-zinc-700 dark:border-zinc-600"
                                        value={row.example}
                                        onChange={(e) => handleChange(index, 'example', e.target.value)}
                                        placeholder="Synonyms"
                                    />
                                </td>
                                <td className="py-2 px-2">
                                    <input
                                        type="text"
                                        className="w-full border rounded p-1 dark:bg-zinc-700 dark:border-zinc-600"
                                        value={row.meaning}
                                        onChange={(e) => handleChange(index, 'meaning', e.target.value)}
                                        placeholder="뜻"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add All Words'}
                </button>
            </form>
        </div>
    );
};
