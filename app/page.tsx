'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-8">
            미국 유학, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">무엇이 가장 궁금하신가요?</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium leading-relaxed max-w-2xl mx-auto">
            유학 실패의 대부분은<br className="hidden md:block" />
            능력 부족이 아니라,<br className="hidden md:block" />
            <span className="text-gray-900 font-bold">학생의 ‘상황과 목적’을 정확히 알지 못한 채</span><br className="hidden md:block" />
            결정을 내리는 것에서 시작됩니다.
          </p>

          <div className="text-left bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-12 max-w-2xl mx-auto">
            <p className="mb-4 text-gray-600 leading-relaxed">
              미국 유학을 준비하는 많은 가정이 <br className="md:hidden" />
              <strong>학교, 지역, 랭킹</strong>을 먼저 고민합니다.
            </p>
            <p className="mb-4 text-gray-600 leading-relaxed">
              하지만 실제 현장에서 보면,<br />
              학생의 현재 상황이 어떤지, 이 유학이 무엇을 위한 것인지<br />
              <strong>정확히 정리되지 않은 상태에서 시작하는 경우</strong>가 대부분입니다.
            </p>
            <p className="text-gray-800 font-bold leading-relaxed">
              그 결과, 좋은 선택을 했음에도 <br className="md:hidden" />
              좋은 결과로 이어지지 않는 경우가 반복됩니다.
            </p>
          </div>

          {/* New CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 mb-16">
            <div className="flex flex-col items-center gap-2">
              <Link href="/login" className="px-10 py-4 bg-indigo-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all w-full md:w-auto">
                로그인하기
              </Link>
              <p className="text-xs text-gray-400 mt-2">
                이미 BGE 학생/학부모 계정이 있으신가요? 로그인 후 진단 결과를 저장할 수 있습니다.
              </p>
            </div>

            {/* Strategy Guide Card */}
            <div className="mt-8 relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Link href="/strategy" className="relative block px-8 py-6 bg-white rounded-xl leading-none flex items-center justify-between border border-gray-100 hover:border-gray-200 transition">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">📌 미국 유학 전략 가이드</h3>
                  <p className="text-sm text-gray-500 font-medium">
                    "Grade → Type → Goal" 체크하기
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    * 본 가이드는 학생들을 위한 일반적인 기준을 제시합니다.
                  </p>
                </div>
                <span className="text-3xl">👉</span>
              </Link>
            </div>
          </div>


          {/* DIAGNOSIS SELECTION MENU */}
          <div id="diagnosis" className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-4xl mx-auto text-left">
            <h3 className="text-center text-xl font-bold text-gray-900 mb-8 flex items-center justify-center gap-2">
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">STEP 1</span>
              스스로 진단을 해보세요.
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PARENT SECTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">👪</span>
                  <h4 className="text-lg font-bold text-gray-900">학부모님 (Parents)</h4>
                </div>
                <div className="space-y-2">
                  <Link href="/diagnosis?type=PARENT&cat=PREP" className="block w-full p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-600 hover:text-indigo-900 font-medium transition text-sm">
                    🛫 유학 전 준비 & 학교 선택
                  </Link>
                  <Link href="/diagnosis?type=PARENT&cat=PERFORMANCE" className="block w-full p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-600 hover:text-indigo-900 font-medium transition text-sm">
                    📈 유학 중 성과 관리
                  </Link>
                  <Link href="/diagnosis?type=PARENT&cat=COLLEGE" className="block w-full p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-600 hover:text-indigo-900 font-medium transition text-sm">
                    🎓 대학 입시 / 진로 설계
                  </Link>
                </div>
              </div>

              {/* STUDENT SECTION */}
              <div className="space-y-4 relative md:border-l md:border-gray-100 md:pl-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">🧑‍🎓</span>
                  <h4 className="text-lg font-bold text-gray-900">학생 (Students)</h4>
                </div>
                <div className="space-y-2">
                  <Link href="/diagnosis?type=STUDENT&cat=PREP" className="block w-full p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-900 font-medium transition text-sm">
                    🛫 유학 전 준비 & 학교 선택
                  </Link>
                  <Link href="/diagnosis?type=STUDENT&cat=PERFORMANCE" className="block w-full p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-900 font-medium transition text-sm">
                    📈 유학 중 성과 관리
                  </Link>
                  <Link href="/diagnosis?type=STUDENT&cat=COLLEGE" className="block w-full p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-900 font-medium transition text-sm">
                    🎓 대학 입시 / 진로 설계
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-100 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Trust / Philosophy Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-10">
            <div className="prose prose-lg text-gray-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                25년간 현장에서 수많은 유학생들을 지켜보며 깨달은 점이 있습니다.
              </h3>
              <p className="mb-4">
                유학의 성패는 정보의 많고 적음이 아니라, <br />
                <strong>각 가정의 상황에 맞는 판단과 운영</strong>에서 갈립니다.
              </p>
              <p className="mb-4">
                모든 학생이 같은 준비 과정을 거칠 필요는 없습니다.
                준비의 수준도, 목표도 모두 다르기 때문입니다.
                그러나 한 가지는 분명합니다.
                <strong>자신의 현재 위치를 정확히 알고 시작한 경우, 목표와의 거리는 훨씬 효율적으로 줄어듭니다.</strong>
              </p>
              <p className="mb-4">
                많은 시행착오는 준비가 부족해서가 아니라, <br />
                자신의 상태를 잘못 판단한 데서 시작됩니다.
              </p>
              <p>
                이 자가진단은 상담을 유도하기 위한 도구가 아닙니다.
                여러분이 스스로의 준비 상태를 객관적으로 점검하고,
                다음 단계를 차분히 결정할 수 있도록 돕기 위해 마련되었습니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">✓</span> 자가진단 핵심 포인트
              </h4>
              <ul className="space-y-3 text-sm md:text-base text-gray-600">
                <li className="flex gap-3 items-start">
                  <span className="shrink-0 mt-1 bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">1</span>
                  <span><strong>학생/학부모 분리 진단:</strong> 서로 다른 관점을 비교하여 인식의 차이를 발견합니다.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="shrink-0 mt-1 bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">2</span>
                  <span><strong>비성적 요소 평가:</strong> 성적이나 영어 점수가 아닌, 적응력과 독립성을 봅니다.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="shrink-0 mt-1 bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">3</span>
                  <span><strong>학생에 맞는 플랜:</strong> 준비가 부족하지는 않습니다. 학생에게 맞는 플랜을 만듭니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100 text-center">
        <div className="mb-8">
          <p className="text-gray-500 text-sm font-medium mb-1">
            본 진단은 민감한 학생 정보 보호를 위해 승인 가입 방식으로 운영됩니다.
          </p>
          <p className="text-gray-500 text-sm">
            가입이 필요하신 경우 <span className="font-bold text-gray-900">Dr. Kang</span>에게 연락해 주세요.
            <br className="md:hidden" />
            <span className="md:ml-2 block md:inline mt-2 md:mt-0">
              <a href="https://open.kakao.com/o/swo3yo5h" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-bold mr-3">
                💬 카카오톡 오픈채팅
              </a>
              <a href="mailto:candhk@gmail.com" className="text-gray-600 hover:text-gray-900 hover:underline">
                ✉️ candhk@gmail.com
              </a>
            </span>
          </p>
        </div>

        <p className="text-gray-400 text-xs mb-4">
          전문가 수준의 판단 시스템으로, 유학의 첫 단추를 제대로 끼우세요.
        </p>
        <div className="flex justify-center gap-4 text-sm flex-wrap">
          <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition">
            로그인하기
          </Link>
          <Link href="/signup" className="font-bold text-gray-500 hover:text-gray-900 transition mb-10">
            가입 안내
          </Link>
          <Link href="/strategy" className="font-bold text-gray-500 hover:text-gray-900 transition mb-10">
            📌 전략 가이드
          </Link>
          <Link href="/schools" className="font-bold text-gray-500 hover:text-gray-900 transition mb-10">
            🏫 학교 추천
          </Link>
        </div>
      </footer>
    </main>
  );
}
