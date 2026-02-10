'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DIAGNOSIS_DATA, CategoryData } from './data';

function DiagnosisContent() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type'); // 'PARENT' | 'STUDENT'
    const catParam = searchParams.get('cat');   // 'PREP' | 'PERFORMANCE' | 'COLLEGE'

    const [step, setStep] = useState<'CATEGORY' | 'INTRO' | 'QUESTIONS' | 'ANALYSIS' | 'RESULT'>('CATEGORY');
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
    const [userType, setUserType] = useState<'PARENT' | 'STUDENT' | null>(null);

    const [scores, setScores] = useState<number[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);

    // Initialize from URL params if present
    useEffect(() => {
        if (typeParam && catParam) {
            const cat = DIAGNOSIS_DATA.find(c => c.id === catParam);
            if (cat && (typeParam === 'PARENT' || typeParam === 'STUDENT')) {
                setSelectedCategory(cat);
                setUserType(typeParam);
                const questions = typeParam === 'PARENT' ? cat.parentQuestions : cat.studentQuestions;
                setScores(Array(questions.length).fill(0));
                setStep('INTRO');
            }
        }
    }, [typeParam, catParam]);

    // --- HANDLERS ---

    // Fallback if accessed directly without params (Logic kept for safety, but UI guides via Landing Page)
    const handleCategorySelect = (category: CategoryData) => {
        // Default to Student if manually selected for now, or add a UserType selection step.
        // Given the flow, we assume entry via Landing Page normally.
        setSelectedCategory(category);
        setUserType('STUDENT');
        setScores(Array(category.studentQuestions.length).fill(0));
        setStep('INTRO');
    };

    const handleStart = () => {
        setStep('QUESTIONS');
        setCurrentQIndex(0);
    };

    const handleAnswer = (score: number) => {
        if (!selectedCategory || !userType) return;

        const newScores = [...scores];
        newScores[currentQIndex] = score;
        setScores(newScores);

        const questions = userType === 'PARENT' ? selectedCategory.parentQuestions : selectedCategory.studentQuestions;

        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            setStep('ANALYSIS');
            setTimeout(() => {
                setStep('RESULT');
            }, 2000);
        }
    };

    // --- CALCULATION LOGIC ---

    const calculateResult = () => {
        if (!selectedCategory || !userType) return { score: 0, verdict: 'RED', summary: '', advice: '' };

        const total = scores.reduce((a, b) => a + b, 0);
        const questions = userType === 'PARENT' ? selectedCategory.parentQuestions : selectedCategory.studentQuestions;
        const maxScore = questions.length * 5;
        const score100 = (total / maxScore) * 100;

        let verdict: 'GREEN' | 'YELLOW' | 'RED' = 'YELLOW';
        let summary = "";
        let advice = "";

        if (score100 >= 80) {
            verdict = 'GREEN';
            summary = "매우 긍정적인 신호입니다. 현재 준비 상태가 훌륭하며, 성공적인 유학 생활이 기대됩니다.";
            advice = "자기 주도적인 학습과 생활 관리가 잘 이루어지고 있습니다. 구체적인 목표를 향해 정진하세요.";
        } else if (score100 >= 60) {
            verdict = 'YELLOW';
            summary = "기본적인 준비는 되어 있으나, 일부 보완이 필요한 영역이 발견되었습니다.";
            advice = "성급하게 결정하기보다, 부족한 점을 먼저 채우는 시간을 가지는 것이 안전합니다.";
        } else {
            verdict = 'RED';
            summary = "아직 유학을 시작하기에는 위험 부담이 큽니다. 준비가 더 필요합니다.";
            advice = "현재 상태에서의 유학은 실패할 확률이 높습니다. 전문가와 함께 근본적인 원인을 점검해야 합니다.";
        }

        return {
            score: score100,
            verdict,
            summary,
            advice
        } as const;
    };


    // --- RENDER COMPONENTS ---

    const renderQuestions = () => {
        if (!selectedCategory || !userType) return null;
        const questions = userType === 'PARENT' ? selectedCategory.parentQuestions : selectedCategory.studentQuestions;
        const q = questions[currentQIndex];

        return (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-4 text-sm font-bold text-indigo-600 tracking-wider">
                    {userType === 'PARENT' ? 'PARENT' : 'STUDENT'} CHECK ( {currentQIndex + 1} / {questions.length} )
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-snug min-h-[80px]">
                    {q.text}
                </h2>

                {q.reason && (
                    <div className="mb-10 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl">
                        <p className="text-indigo-900 font-medium text-sm md:text-base">
                            <span className="font-bold mr-2">💡 전문가의 의도:</span>
                            {q.reason}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                    {[
                        { score: 5, text: "매우 그렇다" },
                        { score: 4, text: "그렇다" },
                        { score: 3, text: "보통이다" },
                        { score: 2, text: "아니다" },
                        { score: 1, text: "전혀 아니다" },
                    ].map((option) => (
                        <button
                            key={option.score}
                            onClick={() => handleAnswer(option.score)}
                            className="w-full p-4 rounded-xl border-2 border-gray-100 text-left hover:border-indigo-600 hover:bg-indigo-50 transition-all group flex justify-between items-center"
                        >
                            <span className="text-gray-700 font-medium group-hover:text-indigo-900">{option.text}</span>
                            <span className="w-6 h-6 rounded-full border border-gray-300 group-hover:border-indigo-600 group-hover:bg-indigo-600"></span>
                        </button>
                    ))}
                </div>
            </div>
        );
    };


    // --- MAIN RENDER ---

    return (
        <div className="w-full max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">

            {/* CATEGORY SELECTION STEP (Fallback) */}
            {step === 'CATEGORY' && (
                <div className="animate-in zoom-in duration-300">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                            어떤 진단이 필요하신가요?
                        </h1>
                        <p className="text-gray-600">
                            메인 화면에서 대상을 선택해주세요.
                        </p>
                    </div>
                    <div className="text-center">
                        <Link href="/" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold">
                            메인으로 돌아가기
                        </Link>
                    </div>
                </div>
            )}

            {/* INTRO STEP */}
            {step === 'INTRO' && selectedCategory && userType && (
                <div className="text-center animate-in zoom-in duration-300">
                    <div className="inline-block bg-indigo-100 text-indigo-700 font-bold px-4 py-1 rounded-full text-sm mb-6">
                        {userType === 'PARENT' ? '학부모' : '학생'} 자가진단: {selectedCategory.title}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">
                        냉정한 판단을 시작합니다.
                    </h1>
                    <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                        이 테스트는 {userType === 'PARENT' ? '학부모님의 관점' : '학생 본인의 관점'}에서<br />
                        현재 준비 상태를 점검합니다.<br />
                        <br />
                        솔직하게 답변해 주세요.
                    </p>
                    <button
                        onClick={handleStart}
                        className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white font-bold rounded-xl text-lg hover:bg-black transition shadow-lg hover:-translate-y-1"
                    >
                        진단 시작하기
                    </button>
                </div>
            )}

            {/* QUESTIONS STEP */}
            {step === 'QUESTIONS' && renderQuestions()}

            {/* ANALYSIS STEP */}
            {step === 'ANALYSIS' && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">데이터 분석 중...</h2>
                    <p className="text-gray-500">답변을 토대로 준비도를 분석하고 있습니다.</p>
                </div>
            )}

            {/* RESULT STEP */}
            {step === 'RESULT' && (() => {
                const result = calculateResult();
                const isRed = result.verdict === 'RED';
                const isYellow = result.verdict === 'YELLOW';
                const isGreen = result.verdict === 'GREEN';

                return (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest text-center">Analysis Report</h3>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 text-center">
                            진단 결과: <span className={`${isRed ? 'text-red-600' : isYellow ? 'text-amber-500' : 'text-green-600'} underline decoration-4 underline-offset-4`}>
                                {isRed ? '전문가 개입 필요' : isYellow ? '보완 필요' : '준비 완료'}
                            </span>
                        </h1>

                        {/* Score Circle */}
                        <div className="flex justify-center mb-10">
                            <div className={`w-40 h-40 rounded-full border-8 flex flex-col items-center justify-center ${isRed ? 'border-red-100 bg-red-50 text-red-600' : isYellow ? 'border-amber-100 bg-amber-50 text-amber-600' : 'border-green-100 bg-green-50 text-green-600'}`}>
                                <span className="text-sm font-bold text-gray-500 mb-1">준비도</span>
                                <span className="text-5xl font-black">{result.score.toFixed(0)}</span>
                                <span className="text-sm font-bold text-gray-400">/ 100</span>
                            </div>
                        </div>

                        {/* Expert Analysis */}
                        <div className="bg-gray-50 border-l-4 border-gray-900 p-6 mb-8">
                            <h4 className="font-bold text-gray-900 mb-2 text-lg">핵심 해석</h4>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                {result.summary}
                            </p>
                        </div>

                        {/* Advice / CTA */}
                        <div className="text-center">
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {result.advice}
                            </p>

                            {!isGreen ? (
                                <div className="space-y-4">
                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition shadow-lg text-lg">
                                        전문가 무료 상담 신청하기
                                    </button>
                                    <p className="text-xs text-gray-400">
                                        * 구체적인 솔루션은 전문가와의 상담을 통해 확인하세요.
                                    </p>
                                </div>
                            ) : (
                                <Link href="/login" className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition shadow-lg text-lg">
                                    로그인하고 학습 시작하기
                                </Link>

                            )}
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm underline">
                                다른 항목 진단하기
                            </Link>
                        </div>
                    </div>
                );
            })()}

        </div>
    );
}

export default function DiagnosisPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <Link href="/" className="text-gray-400 hover:text-gray-900 transition text-sm">
                    ← 메인으로 돌아가기
                </Link>
            </header>
            <Suspense fallback={<div>Loading...</div>}>
                <DiagnosisContent />
            </Suspense>
        </main>
    );
}
