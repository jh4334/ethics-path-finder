export interface CompetencyDescription {
  title: string;
  emoji: string;
  description: string;
  importance: string;
  lowScoreTip: string;
  highScoreTip: string;
  examples: string[];
}

export const competencyDescriptions: Record<string, CompetencyDescription> = {
  privacy: {
    title: "개인정보 보호",
    emoji: "🔒",
    description: "개인정보는 함부로 공유하면 안 되는 소중한 정보예요.",
    importance: "한 번 유출된 개인정보는 되돌릴 수 없고, 다양한 범죄에 악용될 수 있어요.",
    lowScoreTip: "정보를 공유하기 전에 '이게 꼭 필요한가?'를 먼저 생각해보세요!",
    highScoreTip: "개인정보 보호 감각이 뛰어나요! 주변 친구들에게도 알려주세요.",
    examples: [
      "앱 가입 시 꼭 필요한 정보만 입력하기",
      "SNS에 위치나 일정 공유 주의하기",
      "다른 사람 사진 올리기 전 동의 구하기",
    ],
  },
  fairness: {
    title: "공정성",
    emoji: "⚖️",
    description: "AI도 편향될 수 있어요. 모든 사람에게 공정해야 해요.",
    importance: "AI가 특정 집단을 차별하면 사회적 불평등이 더 심해질 수 있어요.",
    lowScoreTip: "AI의 결과가 모든 사람에게 공정한지 한 번 더 생각해보세요!",
    highScoreTip: "공정성에 대한 감수성이 뛰어나요! AI 윤리의 핵심을 잘 이해하고 있어요.",
    examples: [
      "AI 추천이 성별/나이로 달라지진 않는지 확인하기",
      "AI 결과를 무조건 믿지 않고 비판적으로 보기",
      "불공정한 AI를 발견하면 문제 제기하기",
    ],
  },
  transparency: {
    title: "투명성",
    emoji: "🔍",
    description: "AI가 어떻게 작동하는지, 데이터가 어떻게 사용되는지 알 권리가 있어요.",
    importance: "투명하지 않은 AI는 신뢰하기 어렵고, 문제가 생겨도 원인을 찾기 어려워요.",
    lowScoreTip: "AI의 답을 그대로 믿지 말고, 여러 출처로 확인하는 습관을 들여보세요!",
    highScoreTip: "정보를 비판적으로 검증하는 능력이 뛰어나요! 디지털 리터러시의 핵심이에요.",
    examples: [
      "AI 답변은 여러 출처로 교차 확인하기",
      "데이터 수집 전 목적 설명 요구하기",
      "AI의 한계(실시간 정보 모름 등) 이해하기",
    ],
  },
  responsibility: {
    title: "책임감",
    emoji: "💪",
    description: "AI를 사용할 때도 나의 선택에 책임을 져야 해요.",
    importance: "AI가 만든 결과물도 사용하는 사람에게 책임이 있어요.",
    lowScoreTip: "AI는 '도구'예요. 최종 결정과 책임은 항상 나에게 있다는 것을 기억하세요!",
    highScoreTip: "책임감 있는 AI 사용자예요! AI 시대의 모범 시민이 될 수 있어요.",
    examples: [
      "AI 생성물 사용 시 출처 밝히기",
      "딥페이크 등 허위 콘텐츠 공유하지 않기",
      "AI 도움받아도 스스로 이해하고 확인하기",
    ],
  },
};
