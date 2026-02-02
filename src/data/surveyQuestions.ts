export interface SurveyQuestion {
  id: number;
  question: string;
  category: 'privacy' | 'fairness' | 'transparency' | 'responsibility';
  correctAnswer: boolean; // true = O, false = X
  explanation: string;
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 1,
    question: "AI가 만든 글을 그대로 제출해도 괜찮다",
    category: 'responsibility',
    correctAnswer: false,
    explanation: "AI가 만든 글도 출처를 밝히고, 내 생각을 더해야 해요.",
  },
  {
    id: 2,
    question: "개인정보는 꼭 필요한 만큼만 받는 게 좋다",
    category: 'privacy',
    correctAnswer: true,
    explanation: "필요 이상의 정보 수집은 개인정보 유출 위험을 높여요.",
  },
  {
    id: 3,
    question: "AI가 추천해준 정보는 항상 믿어도 된다",
    category: 'transparency',
    correctAnswer: false,
    explanation: "AI도 틀릴 수 있어서 여러 출처로 확인해야 해요.",
  },
  {
    id: 4,
    question: "AI가 특정 성별에게만 직업을 추천하면 문제가 될 수 있다",
    category: 'fairness',
    correctAnswer: true,
    explanation: "AI 추천도 편향될 수 있어 모두에게 공정해야 해요.",
  },
  {
    id: 5,
    question: "재미있는 딥페이크 영상은 친구들과 공유해도 된다",
    category: 'responsibility',
    correctAnswer: false,
    explanation: "딥페이크는 동의 없이 만들어지면 심각한 피해를 줄 수 있어요.",
  },
];
