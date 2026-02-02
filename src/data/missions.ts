export interface MissionOption {
  id: 'A' | 'B' | 'C';
  text: string;
  score: number;
  isCorrect: boolean;
}

export interface Mission {
  id: number;
  title: string;
  category: 'privacy' | 'fairness' | 'transparency' | 'responsibility';
  situation: string;
  options: MissionOption[];
  feedback: {
    correct: string;
    alternative: string;
  };
}

export const missions: Mission[] = [
  {
    id: 1,
    title: "개인정보 최소수집",
    category: "privacy",
    situation: "우리 반 설문 앱을 만들려고 해. 로그인 편하게 하려고 생년월일, 주소까지 받으려고 한다.",
    options: [
      { id: 'A', text: "필요한 정보만(학년/반/이름 또는 별명) 받는다", score: 2, isCorrect: true },
      { id: 'B', text: "혹시 몰라서 생년월일도 받는다", score: 1, isCorrect: false },
      { id: 'C', text: "주소까지 받으면 나중에 연락하기 편하다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "개인정보는 목적 달성에 필요한 최소만 수집해야 해요. 나중을 위해 과하게 받으면 위험이 커져요.",
      alternative: "꼭 필요한 정보만 수집하고, 추가 정보가 필요하면 그때 동의를 받아요.",
    },
  },
  {
    id: 2,
    title: "동의와 설명",
    category: "transparency",
    situation: "AI 학습용으로 학생 글을 모으려 한다.",
    options: [
      { id: 'A', text: "어떤 데이터를 왜 쓰는지 설명하고 동의를 받는다", score: 2, isCorrect: true },
      { id: 'B', text: "동의는 나중에 받고 일단 모은다", score: 1, isCorrect: false },
      { id: 'C', text: "수업이니까 동의 없이도 괜찮다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "데이터를 수집할 때는 반드시 목적을 설명하고 동의를 먼저 받아야 해요. 이것이 투명성의 기본이에요.",
      alternative: "데이터 수집 전에 항상 '왜, 어떻게, 얼마나' 사용할지 명확히 설명해요.",
    },
  },
  {
    id: 3,
    title: "편향과 공정성",
    category: "fairness",
    situation: "추천 알고리즘이 '남학생에게만' 로봇 활동을 더 추천한다.",
    options: [
      { id: 'A', text: "추천 기준을 점검하고 특정 집단에 불리한지 확인한다", score: 2, isCorrect: true },
      { id: 'B', text: "원래 남학생이 로봇 좋아하니까 괜찮다", score: 1, isCorrect: false },
      { id: 'C', text: "추천은 그냥 참고니까 신경 안 쓴다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI 추천도 편향될 수 있어요. 특정 집단에게 불공정하지 않은지 항상 점검해야 해요.",
      alternative: "AI 결과를 그대로 믿지 말고, 모두에게 공정한지 확인하는 습관을 가져요.",
    },
  },
  {
    id: 4,
    title: "저작권과 출처",
    category: "responsibility",
    situation: "AI가 만든 그림을 발표자료에 넣으려 한다.",
    options: [
      { id: 'A', text: '"AI 생성 이미지"임을 밝히고 사용 조건을 확인한다', score: 2, isCorrect: true },
      { id: 'B', text: "그냥 넣는다(내가 만들었다고 말하진 않음)", score: 1, isCorrect: false },
      { id: 'C', text: "내가 만든 것처럼 말한다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI가 만든 콘텐츠도 출처를 밝혀야 해요. 정직하게 AI 생성물임을 표시하는 것이 책임감 있는 태도예요.",
      alternative: "AI 생성물 사용 시 반드시 출처와 사용 조건을 확인하고 표시해요.",
    },
  },
  {
    id: 5,
    title: "허위정보 검증",
    category: "transparency",
    situation: "AI가 '사실'처럼 답한 내용을 보고서에 넣으려 한다.",
    options: [
      { id: 'A', text: "2개 이상 출처로 사실 확인 후 넣는다", score: 2, isCorrect: true },
      { id: 'B', text: "AI가 그럴듯하니 넣는다", score: 1, isCorrect: false },
      { id: 'C', text: "확인 어려우면 대충 빼버린다(학습 포기)", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI도 틀릴 수 있어요. 중요한 정보는 반드시 여러 출처로 교차 검증해야 해요.",
      alternative: "AI 답변을 그대로 믿지 말고, 신뢰할 수 있는 출처로 확인하는 습관을 들여요.",
    },
  },
  {
    id: 6,
    title: "딥페이크와 책임",
    category: "responsibility",
    situation: "친구 얼굴로 만든 합성 영상이 단톡에 올라왔다.",
    options: [
      { id: 'A', text: "공유하지 않고 문제를 알린다", score: 2, isCorrect: true },
      { id: 'B', text: "재미로 한 번만 공유한다", score: 1, isCorrect: false },
      { id: 'C', text: "조회수 올리려고 퍼뜨린다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "딥페이크 영상은 심각한 피해를 줄 수 있어요. 공유하지 않고 신고하는 것이 책임감 있는 행동이에요.",
      alternative: "허위 콘텐츠를 발견하면 공유하지 말고, 신뢰할 수 있는 어른에게 알려요.",
    },
  },
];

// 각 역량별 미션 매핑
export const competencyMissions = {
  privacy: [1], // 개인정보
  fairness: [3], // 공정성
  transparency: [2, 5], // 투명성 (동의, 검증)
  responsibility: [4, 6], // 책임 (저작권, 딥페이크)
};
