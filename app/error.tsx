'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-4">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="mb-6 text-gray-500 text-center max-w-md">
                An unexpected error occurred. Please try reloading the page.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition"
            >
                Try again
            </button>
        </div>
    );
}
