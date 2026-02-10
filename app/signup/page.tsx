'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = "가입 요청합니다. (학생 이름/학년/현재 학교/유학 단계: 준비/재학/대학준비)";
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">가입 안내</h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        이 서비스는 학생 상황 보호와 정확한 분석을 위해 <br />
                        <strong>승인 가입 방식</strong>으로 운영됩니다.
                    </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl mb-8">
                    <h3 className="text-indigo-900 font-bold mb-4 text-center">가입 절차</h3>
                    <ol className="text-sm text-gray-700 space-y-3 list-decimal list-inside">
                        <li>
                            <span className="font-bold">카카오톡으로 메시지 전송</span>
                            <p className="text-xs text-gray-500 pl-4 mt-1">아래 버튼을 눌러 채팅방으로 이동하세요.</p>
                        </li>
                        <li>
                            <span className="font-bold">학생 정보 확인</span>
                            <p className="text-xs text-gray-500 pl-4 mt-1">학년, 현재 학교, 목표 등을 확인합니다.</p>
                        </li>
                        <li>
                            <span className="font-bold">승인 및 로그인 정보 안내</span>
                            <p className="text-xs text-gray-500 pl-4 mt-1">계정 생성 후 정보를 보내드립니다.</p>
                        </li>
                    </ol>
                </div>

                <div className="space-y-4">
                    <div className="text-center">
                        <div className="mb-2 text-xs text-gray-500">
                            👇 아래 내용을 복사해서 보내주세요.
                        </div>
                        <button
                            onClick={handleCopy}
                            className="w-full p-3 bg-gray-100 rounded-xl text-xs text-gray-600 border border-gray-200 mb-4 hover:bg-gray-200 transition flex items-center justify-between"
                        >
                            <span className="truncate">"가입 요청합니다. (학생 이름/학년/현재...)"</span>
                            <span className="text-indigo-600 font-bold text-xs shrink-0 ml-2">{copied ? '복사됨!' : '복사'}</span>
                        </button>

                        <a
                            href="https://open.kakao.com/o/swo3yo5h"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-[#FEE500] hover:bg-[#FDD800] text-[#3c1e1e] font-bold py-4 rounded-xl transition shadow-sm mb-3"
                        >
                            💬 카카오톡으로 가입 요청하기
                        </a>

                        <Link href="/diagnosis" className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl transition">
                            먼저 진단만 진행하기
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <Link href="/login" className="text-sm text-gray-400 hover:text-gray-900 underline underline-offset-4">
                        이미 계정이 있으신가요? 로그인
                    </Link>
                </div>
            </div>
        </main>
    );
}
