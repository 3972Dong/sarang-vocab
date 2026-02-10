'use client';

import { signOut } from 'next-auth/react';

export function UserMenu() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-xs md:text-sm font-bold text-brand-secondary/70 hover:text-brand-accent transition uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full hover:bg-white border border-transparent hover:border-brand-border"
        >
            Sign Out
        </button>
    );
}
