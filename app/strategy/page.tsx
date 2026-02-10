'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Grade, StudentType, Goal, StrategyResult,
    GRADES, TYPES, GOALS, STRATEGIES_G11,
    generateStrategy, getGradeLabel, getTypeLabel, getGoalLabel
} from './data';

export default function StrategyPage() {
    const [step, setStep] = useState<number>(1);
    const [grade, setGrade] = useState<Grade | null>(null);
    const [type, setType] = useState<StudentType | null>(null);
    const [goal, setGoal] = useState<Goal | null>(null);
    const [result, setResult] = useState<StrategyResult | null>(null);

    const handleGradeSelect = (g: Grade) => {
        setGrade(g);
        setStep(2);
    };

    const handleTypeSelect = (t: StudentType) => {
        setType(t);
        setStep(3);
    };

    const handleGoalSelect = (g: Goal) => {
        setGoal(g);
        if (grade && type) {
            const res = generateStrategy(grade, type, g);
            setResult(res);
            setStep(4);
        }
    };

    const reset = () => {
        setStep(1);
        setGrade(null);
        setType(null);
        setGoal(null);
        setResult(null);
    };

    // --- RENDER STEPS ---

    const renderStep1 = () => (
        <div className="animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">STEP 1. 현재 학년을 선택해주세요</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GRADES.map((g) => (
                    <button
                        key={g.id}
                        onClick={() => handleGradeSelect(g.id)}
                        className="p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition shadow-sm text-lg font-bold text-gray-700 hover:text-indigo-900"
                    >
                        {g.label}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">STEP 2. 현재 준비 상태(TYPE)를 선택해주세요</h2>
            <div className="space-y-4">
                {TYPES.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => handleTypeSelect(t.id)}
                        className="w-full p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition shadow-sm text-left group"
                    >
                        <div className="font-bold text-lg text-gray-900 group-hover:text-indigo-900 mb-1">{t.label}</div>
                        <div className="text-sm text-gray-500 group-hover:text-indigo-700">{t.desc}</div>
                    </button>
                ))}
            </div>
            <button onClick={reset} className="mt-8 text-gray-400 text-sm hover:text-gray-600 underline">처음으로</button>
        </div>
    );

    const renderStep3 = () => {
        const isG11 = grade === 'G11';
        const options = isG11 ? STRATEGIES_G11 : GOALS;
        const title = isG11 ? "STEP 3. 전략을 선택해주세요 (11학년)" : "STEP 3. 목표 대학 레벨을 선택해주세요";

        return (
            <div className="animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
                <div className="space-y-4">
                    {options.map((o) => (
                        <button
                            key={o.id}
                            onClick={() => handleGoalSelect(o.id as Goal)}
                            className="w-full p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition shadow-sm text-left group"
                        >
                            <div className="font-bold text-lg text-gray-900 group-hover:text-indigo-900 mb-1">{o.label}</div>
                            {/* @ts-ignore - desc exists on both GOALS and STRATEGIES now */}
                            <div className="text-sm text-gray-500 group-hover:text-indigo-700">{o.desc}</div>
                        </button>
                    ))}
                </div>
                <button onClick={reset} className="mt-8 text-gray-400 text-sm hover:text-gray-600 underline">처음으로</button>
            </div>
        );
    };

    const renderResult = () => {
        if (!result) return null;

        return (
            <div className="animate-in slide-in-from-bottom-8 duration-500 max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-gray-900 mb-8 text-center">미국 유학 전략 가이드</h1>

                {/* (A) Summary Box */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-center md:text-left items-center">
                    <div>
                        <span className="block text-xs text-gray-400 uppercase font-bold">Grade</span>
                        <span className="text-lg font-bold text-gray-900">{result.summary.grade}</span>
                    </div>
                    <div className="md:col-span-2">
                        <span className="block text-xs text-gray-400 uppercase font-bold">Type & Goal</span>
                        <span className="text-sm font-medium text-gray-600 block">{result.summary.type}</span>
                        <span className="text-sm font-medium text-gray-600 block">→ {result.summary.goal}</span>
                    </div>
                    <div className={`text-right ${result.summary.verdictColor === 'GREEN' ? 'text-green-600' : result.summary.verdictColor === 'RED' ? 'text-red-600' : 'text-amber-500'}`}>
                        <span className="block text-xs text-gray-400 uppercase font-bold text-right">가능성 (Verdict)</span>
                        <span className="text-xl font-black">{result.summary.verdict}</span>
                    </div>
                </div>

                {/* (B) Key Message */}
                <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-lg mb-10 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-indigo-200 font-bold mb-4 text-sm tracking-wider uppercase">Key Strategy Message</h3>
                        <p className="text-xl md:text-2xl font-bold leading-relaxed">"{result.message}"</p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {/* (C) Academic Standards */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm">📚</span>
                            Academic Standard
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">GPA Goal</span>
                                <span className="font-bold text-gray-900 text-right">{result.academic.gpa || "3.8+ (안전권)"}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Course Rigor</span>
                                <span className="font-bold text-gray-900 text-right max-w-[60%]">{result.academic.course || "Honors/AP 적절히 수강"}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">SAT/ACT</span>
                                <span className="font-bold text-gray-900 text-right">{result.academic.sat || "Optional"}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-gray-500">Teacher Rec</span>
                                <span className="font-bold text-gray-900 text-right max-w-[50%]">{result.academic.recommendation || "Strong Support"}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-right">* 일반적으로 요구되는 기준입니다.</p>
                        </div>
                    </div>

                    {/* (D) Activity Standards */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm">⚽️</span>
                            Activity Standard
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Count</span>
                                <span className="font-bold text-gray-900 text-right">{result.activities.count || "5-7개"}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Depth</span>
                                <span className="font-bold text-gray-900 text-right">{result.activities.depth || "State Level"}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Role</span>
                                <span className="font-bold text-gray-900 text-right">{result.activities.role || "Officer/Leader"}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                <span className="block text-xs font-bold text-gray-500 mb-1">STRATEGY NOTE</span>
                                <p className="text-gray-700 leading-snug">{result.activities.note || "전공과의 연관성을 증명하세요."}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* (E) Grade Focus */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 {result.summary.grade} Focus Point</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">MUST DO (반드시 해야 할 것)</h4>
                                <p className="text-gray-600 text-sm">{result.gradeFocus.mustDo}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">CRITICAL (놓치면 안 되는 것)</h4>
                                <p className="text-gray-600 text-sm">{result.gradeFocus.dontMiss}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* (F) Risk */}
                <div className="border-l-4 border-amber-500 bg-amber-50 p-6 rounded-r-xl mb-12">
                    <h4 className="font-bold text-amber-800 mb-2 text-sm uppercase">⚠️ Risk Factor</h4>
                    <p className="text-amber-900 text-sm leading-relaxed">
                        {result.risk}
                    </p>
                </div>

                {/* (G) CTA */}
                <div className="text-center bg-gray-900 text-white p-10 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">"이 TYPE의 학생은 선택에 따라 결과 차이가 큽니다."</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        본 가이드는 일반적인 기준을 제시합니다. <br />
                        학생의 개별 상황에 맞는 구체적인 설계가 필요하다면 상담을 요청하세요.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <a href="https://open.kakao.com/o/swo3yo5h" target="_blank" className="px-8 py-4 bg-[#FEE500] text-[#3c1e1e] font-bold rounded-xl hover:bg-[#FDD800] transition">
                            전문가 상담 요청하기
                        </a>
                        <button onClick={reset} className="px-8 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition">
                            다른 조건으로 다시 보기
                        </button>
                    </div>
                </div>

            </div>
        );
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6 flex items-center justify-center">
            <div className="w-full max-w-5xl">
                {/* Header Link */}
                <div className="mb-12 text-center">
                    <Link href="/" className="text-indigo-600 font-bold hover:text-indigo-800 text-sm tracking-wide uppercase">
                        ← Back to Main
                    </Link>
                </div>

                {step < 4 && (
                    <div className="max-w-2xl mx-auto mb-8">
                        {/* Progress Bar */}
                        <div className="flex gap-2 mb-8 justify-center">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-2 w-16 rounded-full transition-all ${step >= i ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderResult()}
            </div>
        </main>
    );
}
