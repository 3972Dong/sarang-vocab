export type Grade = 'G8_UNDER' | 'G9' | 'G10' | 'G11';
export type StudentType = 'ELITE' | 'STRONG' | 'BALANCED' | 'FOUNDATION';
export type Goal = 'IVY' | 'T30' | 'T50' | 'T100' | 'STRATEGY_A' | 'STRATEGY_B' | 'STRATEGY_C';

export interface StrategyResult {
    summary: {
        grade: string;
        type: string;
        goal: string;
        verdict: string; // e.g. "가능 / 전략 중요 / 현실적 조정 필요"
        verdictColor: 'GREEN' | 'YELLOW' | 'RED';
    };
    message: string; // "이 TYPE의 학생이 이 학년에서..."
    academic: {
        gpa: string;
        course: string;
        recommendation: string;
        sat: string;
    };
    activities: {
        count: string;
        depth: string;
        role: string;
        note: string;
    };
    gradeFocus: {
        mustDo: string;
        dontMiss: string;
    };
    risk: string;
}

export const GRADES = [
    { id: 'G8_UNDER', label: '8학년 이하' },
    { id: 'G9', label: '9학년' },
    { id: 'G10', label: '10학년' },
    { id: 'G11', label: '11학년' },
] as const;

export const TYPES = [
    { id: 'ELITE', label: 'TYPE 1: 최상위 준비형 (Elite Track)', desc: 'TOEFL 100+, SSAT 2200+, 활동 준비 완료' },
    { id: 'STRONG', label: 'TYPE 2: 상위 준비형 (Strong Prep)', desc: 'TOEFL 80+, 수업 가능, 일부 활동 준비' },
    { id: 'BALANCED', label: 'TYPE 3: 중간 준비형 (Balanced Entry)', desc: 'TOEFL 60+, 수업 이해 가능, 시험/활동 미흡' },
    { id: 'FOUNDATION', label: 'TYPE 4: 기초 준비형 (Foundation Track)', desc: 'TOEFL 60 미만, 영어 적응 필요' },
] as const;

export const GOALS = [
    { id: 'IVY', label: '아이비급 (Top 10)', desc: 'Ivy League, MIT, Stanford 등 최상위 명문 대학' },
    { id: 'T30', label: 'Top 30 (명문 사립/주립)', desc: '전공 랭킹이 우수한 명문 사립 및 최상위 주립 대학' },
    { id: 'T50', label: 'Top 50 (상위권 주립)', desc: '주립대 메인 캠퍼스 및 우수 사립 대학' },
    { id: 'T100', label: 'Top 100 (안정권 주립)', desc: '다양한 전공 기회와 안정적인 진학 목표' },
] as const;

export const STRATEGIES_G11 = [
    { id: 'STRATEGY_A', label: '전략 A: 현재 학교에서 최상위 성과 만들기', desc: 'GPA 올인 & 학업적 상승 곡선 증명' },
    { id: 'STRATEGY_B', label: '전략 B: 학교 레벨 최대한 활용하기', desc: 'Extracurricular & Leadership 강조' },
    { id: 'STRATEGY_C', label: '전략 C: 편입 가능성 열어두기', desc: '장기 플랜: 12학년 + 대학 1~2학년 성적 관리' },
] as const;

// Helper to get labels
export const getGradeLabel = (id: Grade) => GRADES.find(g => g.id === id)?.label || id;
export const getTypeLabel = (id: StudentType) => TYPES.find(t => t.id === id)?.label || id;
export const getGoalLabel = (id: Goal) => {
    const g = GOALS.find(x => x.id === id);
    if (g) return g.label;
    const s = STRATEGIES_G11.find(x => x.id === id);
    return s ? s.label : id;
};

// --- LOGIC GENERATOR ---

export function generateStrategy(grade: Grade, type: StudentType, goal: Goal): StrategyResult {
    // defaults
    let verdict = "전략적 접근 필요";
    let verdictColor: 'GREEN' | 'YELLOW' | 'RED' = 'YELLOW';
    let message = "";
    let academic = { gpa: "", course: "", recommendation: "", sat: "" };
    let activities = { count: "", depth: "", role: "", note: "" };
    let gradeFocus = { mustDo: "", dontMiss: "" };
    let risk = "";

    // 1. Verdict Logic (Simplified for MVP, can be complex matrix)
    if (grade === 'G11') {
        verdict = "마지막 스퍼트 & 전략 선택 중요";
        verdictColor = 'YELLOW';
    } else if (grade === 'G8_UNDER' && type === 'ELITE' && goal === 'IVY') {
        // SPECIAL CASE: G8 Elite Ivy
        return {
            summary: { grade: getGradeLabel(grade), type: getTypeLabel(type), goal: getGoalLabel(goal), verdict: "도전 가능 / 유지 관건", verdictColor: 'GREEN' },
            message: "아직 시간이 충분합니다. 지금은 대학 이름보다 '기초 체력(영어, 독서)'을 만드는 시기입니다. 9학년 시작 시점에 최상위 반(Honors)에 들어갈 수 있는 실력을 만드는 것이 최우선입니다.\n\n(참고: 이 시기의 최상위권 학생들은 Top 보딩스쿨 진학 가능성이 높으며, 해당 학교에서는 하위 30% 정도까지도 아이비리그 진학이 일반적입니다. 따라서 학교 레벨과 그 안에서의 등수 관리가 핵심입니다.)",
            academic: {
                gpa: "Unweighted 3.9+ / 4.0",
                course: "Most Demanding (AP 8-12개 누적)",
                sat: "1500+ (사실상 필수)",
                recommendation: "Top 10~20% 이내 (Top 보딩 기준)",
            },
            activities: {
                count: "8-10개",
                depth: "State/National 수상 필수",
                role: "President/Founder 급",
                note: "전공 관련 ‘Impact’ 증명"
            },
            gradeFocus: {
                mustDo: "영어 절대 실력 완성 (TOEFL/SSAT)",
                dontMiss: "독서 습관과 호기심 유지"
            },
            risk: "주요 과목에서 C 이하의 성적이 나오거나, 학교 징계(Discipline) 기록이 생기면 입시 전략을 전면 수정해야 합니다."
        };
    } else {
        // General logic for G8-G10
        if (type === 'ELITE') {
            verdict = "도전 가능 / 유지 관건";
            verdictColor = 'GREEN';
        } else if (type === 'FOUNDATION' && (goal === 'IVY' || goal === 'T30')) {
            verdict = "현실적 조정 필요 (장기 계획)";
            verdictColor = 'RED';
        } else if (type === 'BALANCED' && goal === 'IVY') {
            verdict = "매우 도전적 / 획기적 변화 필요";
            verdictColor = 'RED';
        } else {
            verdict = "가능성 있음 / 전략적 보완 필요";
            verdictColor = 'YELLOW';
        }
    }

    // 2. Message & Focus based on Grade
    if (grade === 'G8_UNDER') {
        gradeFocus.mustDo = "영어 절대 실력 완성 (TOEFL/SSAT)";
        gradeFocus.dontMiss = "독서 습관과 호기심 유지";
        message = "아직 시간이 충분합니다. 지금은 대학 이름보다 '기초 체력(영어, 독서)'을 만드는 시기입니다. 9학년 시작 시점에 최상위 반(Honors)에 들어갈 수 있는 실력을 만드는 것이 최우선입니다.";
    } else if (grade === 'G9') {
        gradeFocus.mustDo = "최상위 GPA 확보 & 관심사 탐색";
        gradeFocus.dontMiss = "첫 단추 (9학년 성적이 대학 입시의 시작)";
        message = "고등학교 생활의 시작입니다. 9학년 성적은 대학 입시의 '바닥(Foundation)'입니다. 무리한 활동보다는 학교 성적(GPA)에서 완벽함을 보여주고, 자신이 무엇을 좋아하는지 넓게 탐색해야 합니다.";
    } else if (grade === 'G10') {
        gradeFocus.mustDo = "심화 과목(AP) 도전 & 활동 구체화";
        gradeFocus.dontMiss = "표준 시험(SAT/ACT) 기초 다지기";
        message = "대입의 승부처입니다. 학업 난이도를 높여(AP/Honors) 도전적인 모습을 보여줘야 하며, 방과후 활동에서도 단순 참여를 넘어 '자신의 색깔'을 드러내기 시작해야 합니다.";
    } else if (grade === 'G11') {
        gradeFocus.mustDo = "GPA 극대화 & Test Score 완성";
        gradeFocus.dontMiss = "주요 교사와의 관계 (추천서 빌드업)";
        if (goal === 'STRATEGY_A') {
            message = "GPA가 가장 중요합니다. 활동을 조금 줄이더라도 내신 성적을 최상위로 끌어올려 '학업적 상승 곡선'을 증명해야 합니다.";
        } else if (goal === 'STRATEGY_C') {
            message = "현재의 결과에 실망하기보다, 대학 입학 후 편입까지 고려한 'Long-term Plan'을 세워야 합니다. 12학년을 넘어 대학 1학년 성적까지 관리하는 전략입니다.";
        } else {
            message = "이제는 선택과 집중입니다. 강점이 있는 과목과 활동을 부각시키고, 약점은 에세이나 추천서로 보완하는 입체적인 전략이 필요합니다.";
        }
    }

    // 3. Academic Standards (Goal based)
    // Adjust based on Grade? (Requirements are usually fixed for the goal, but readiness differs)
    // We will display the "Target Standard" for the chosen goal.

    if (['STRATEGY_A', 'STRATEGY_B', 'STRATEGY_C'].includes(goal)) {
        // G11 strategies
        academic.gpa = "상승 곡선 필수 (3.8+ 목표)";
        academic.course = "Core 과목 위주 AP 2-3개";
        academic.recommendation = "학업적 성취를 잘 아는 교사 2인";
        academic.sat = "Optional (GPA가 낮다면 필수)";
    } else {
        // G8-10 Goals
        if (goal === 'IVY') {
            academic.gpa = "Unweighted 3.9+ / 4.0";
            academic.course = "Most Demanding (AP 8-12개 누적)";
            academic.recommendation = "Top 1-2% 평가 필수";
            academic.sat = "1500+ (사실상 필수)";
        } else if (goal === 'T30') {
            academic.gpa = "3.8+ / 4.0";
            academic.course = "Very Demanding (AP 6-8개 누적)";
            academic.recommendation = "매우 우수 (Excellent)";
            academic.sat = "1450+ (제출 권장)";
        } else if (goal === 'T50') {
            academic.gpa = "3.5+ / 4.0";
            academic.course = "Demanding (AP 3-5개 누적)";
            academic.recommendation = "우수 (Good)";
            academic.sat = "1350+ (선택적 제출)";
        } else { // T100
            academic.gpa = "3.0+ / 4.0";
            academic.course = "Average (학교 커리큘럼 성실 이수)";
            academic.recommendation = "긍정적 평가";
            academic.sat = "Test Optional 활용";
        }
    }

    // 4. Activity Standards
    if (goal === 'IVY') {
        activities = { count: "8-10개", depth: "State/National 수상 필수", role: "President/Founder 급", note: "전공 관련 ‘Impact’ 증명" };
    } else if (goal === 'T30') {
        activities = { count: "5-7개", depth: "학교 대표/Regional 수상", role: "Officer/Captain", note: "전공 관심사 일관성 중요" };
    } else if (goal === 'STRATEGY_C') {
        activities = { count: "핵심 2-3개", depth: "지속성 위주", role: "참여 및 기여", note: "대학 진학 후 활동 연결성 고려" };
    } else {
        activities = { count: "3-5개", depth: "교내 활동 충실", role: "적극적 참여 멤버", note: "성실함과 협동심 강조" };
    }

    // 5. Risk & Adjustments
    if (type === 'FOUNDATION' || type === 'BALANCED') {
        risk = "현재 준비 상태로는 목표 대학 진학이 어려울 수 있습니다. 영어 능력(TOEFL)을 단기간에 끌어올리지 못하면, 1년 유급을 하거나 목표 대학을 현실적으로 하향 조정해야 할 수 있습니다.";
    } else if (grade === 'G11' && goal === 'STRATEGY_A') {
        risk = "11학년 성적이 기대만큼 나오지 않는다면, T30~50권 대학으로 목표를 수정하고 'Early Decision' 전략을 적극 활용해야 합니다.";
    } else {
        risk = "주요 과목에서 C 이하의 성적이 나오거나, 학교 징계(Discipline) 기록이 생기면 입시 전략을 전면 수정해야 합니다.";
    }

    return {
        summary: { grade: getGradeLabel(grade), type: getTypeLabel(type), goal: getGoalLabel(goal), verdict, verdictColor },
        message,
        academic,
        activities,
        gradeFocus,
        risk
    };
}
