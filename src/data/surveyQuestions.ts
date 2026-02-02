export interface SurveyQuestion {
  id: number;
  question: string;
  correctAnswer: boolean; // true = O, false = X
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 1,
    question: "AI가 만든 글을 그대로 제출해도 괜찮다",
    correctAnswer: false, // X가 올바른 답
  },
  {
    id: 2,
    question: "개인정보는 꼭 필요한 만큼만 받는 게 좋다",
    correctAnswer: true, // O가 올바른 답
  },
  {
    id: 3,
    question: "AI가 추천해준 정보는 항상 믿어도 된다",
    correctAnswer: false, // X가 올바른 답
  },
];
