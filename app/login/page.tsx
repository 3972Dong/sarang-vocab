'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 animate-in fade-in zoom-in duration-500">
                <h1 className="text-3xl font-black text-gray-900 mb-4 text-center tracking-tight">로그인</h1>
                <p className="text-gray-600/80 text-center mb-8 font-medium text-sm leading-relaxed">
                    계정이 있는 학생/학부모는 로그인 후 <br />
                    진단 결과를 저장하고 상담 기록을 확인할 수 있습니다.
                </p>

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">아이디</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 placeholder:text-gray-300"
                            placeholder="아이디를 입력하세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 placeholder:text-gray-300"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-xl border border-red-100 flex items-center justify-center gap-2">
                            <span>⚠️</span> {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {isPending ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500 mb-2">
                        계정이 없으신가요? 가입은 승인 방식으로 진행됩니다.
                    </p>
                    <a href="/signup" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition">
                        가입 안내 보기 →
                    </a>
                </div>
            </div>
        </main>
    );
}
