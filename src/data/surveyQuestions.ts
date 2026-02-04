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
    explanation: "AI가 만든 글도 출처를 밝히고, 내 생각을 더해야 해요. AI는 도우미일 뿐, 최종 책임은 나에게 있어요. 실제로 많은 학교에서 AI 사용 시 출처 표기를 의무화하고 있어요.",
  },
  {
    id: 2,
    question: "개인정보는 꼭 필요한 만큼만 받는 게 좋다",
    category: 'privacy',
    correctAnswer: true,
    explanation: "필요 이상의 정보 수집은 개인정보 유출 위험을 높여요. '데이터 최소화 원칙'은 개인정보보호법의 핵심이에요. 앱 가입 시 꼭 필요한 정보만 입력하세요.",
  },
  {
    id: 3,
    question: "AI가 추천해준 정보는 항상 믿어도 된다",
    category: 'transparency',
    correctAnswer: false,
    explanation: "AI도 '환각(hallucination)'이라고 해서 그럴듯한 거짓 정보를 만들어낼 수 있어요. 중요한 정보는 반드시 2개 이상의 출처로 확인하세요!",
  },
  {
    id: 4,
    question: "AI가 특정 성별에게만 직업을 추천하면 문제가 될 수 있다",
    category: 'fairness',
    correctAnswer: true,
    explanation: "AI는 과거 데이터의 편향을 그대로 학습할 수 있어요. 아마존은 이런 문제로 AI 채용 시스템을 폐기했어요. AI도 공정해야 해요!",
  },
  {
    id: 5,
    question: "재미있는 딥페이크 영상은 친구들과 공유해도 된다",
    category: 'responsibility',
    correctAnswer: false,
    explanation: "딥페이크는 동의 없이 만들어지면 심각한 피해를 줄 수 있어요. 공유하는 것만으로도 피해 확산에 가담하는 거예요. 발견하면 공유하지 말고 신고하세요!",
  },
];
