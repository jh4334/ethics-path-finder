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
  context?: string;
  options: MissionOption[];
  feedback: {
    correct: string;
    alternative: string;
  };
  realCase?: string; // 실제 사례 (선택)
}

export const missions: Mission[] = [
  // Privacy (개인정보) - 3개
  {
    id: 1,
    title: "개인정보 최소수집",
    category: "privacy",
    situation: "우리 반 설문 앱을 만들려고 해. 로그인 편하게 하려고 생년월일, 주소까지 받으려고 한다.",
    context: "친구들이 쉽게 참여할 수 있는 설문 앱을 만드는 중이야.",
    options: [
      { id: 'A', text: "필요한 정보만(학년/반/이름 또는 별명) 받는다", score: 2, isCorrect: true },
      { id: 'B', text: "혹시 몰라서 생년월일도 받는다", score: 1, isCorrect: false },
      { id: 'C', text: "주소까지 받으면 나중에 연락하기 편하다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "개인정보는 목적 달성에 필요한 최소만 수집해야 해요. 나중을 위해 과하게 받으면 유출 위험이 커져요.",
      alternative: "꼭 필요한 정보만 수집하고, 추가 정보가 필요하면 그때 동의를 받아요.",
    },
    realCase: "2024년 한 배달앱에서 과도하게 수집한 개인정보가 유출되어 1000만 건 이상의 피해가 발생했어요.",
  },
  {
    id: 2,
    title: "사진 속 개인정보",
    category: "privacy",
    situation: "학교 축제 사진을 SNS에 올리려고 해. 사진에 친구들 얼굴이 다 나와.",
    context: "축제가 너무 재미있어서 추억을 공유하고 싶어.",
    options: [
      { id: 'A', text: "사진에 나온 친구들에게 동의를 구한 후 올린다", score: 2, isCorrect: true },
      { id: 'B', text: "태그만 안 하면 괜찮으니 그냥 올린다", score: 1, isCorrect: false },
      { id: 'C', text: "공개 행사니까 누구나 올려도 된다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "다른 사람의 얼굴도 개인정보예요. SNS에 올리기 전 반드시 동의를 구해야 해요.",
      alternative: "얼굴이 나온 사진은 본인 동의 후 공유하고, 동의 없으면 모자이크 처리해요.",
    },
    realCase: "얼굴 사진은 AI 학습에 무단으로 사용될 수 있어요. 실제로 SNS 사진으로 딥페이크가 만들어진 사례가 많아요.",
  },
  {
    id: 3,
    title: "위치정보 공유",
    category: "privacy",
    situation: "새로 나온 앱이 실시간 위치 공유를 켜라고 해. 친구들이랑 위치 공유하면 재밌을 것 같아.",
    context: "친구들 사이에서 유행하는 앱이야.",
    options: [
      { id: 'A', text: "필요할 때만 위치를 공유하도록 설정한다", score: 2, isCorrect: true },
      { id: 'B', text: "친구들이 다 하니까 나도 항상 켜둔다", score: 1, isCorrect: false },
      { id: 'C', text: "위치 공유 걱정은 어른들이나 하는 거다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "실시간 위치는 민감한 정보예요. 꼭 필요한 순간에만 공유하고 평소엔 끄는 게 안전해요.",
      alternative: "앱 권한 설정에서 '앱 사용 중에만' 위치 허용으로 바꿔보세요.",
    },
    realCase: "위치 데이터만으로 개인의 집, 학교, 일상 패턴을 파악할 수 있어요. 스토킹 범죄에 악용된 사례도 있어요.",
  },

  // Transparency (투명성) - 3개
  {
    id: 4,
    title: "동의와 설명",
    category: "transparency",
    situation: "AI 학습용으로 학생 글을 모으려 한다.",
    context: "학교에서 AI 글쓰기 도우미를 만들기 위해 학생들의 글이 필요해.",
    options: [
      { id: 'A', text: "어떤 데이터를 왜 쓰는지 설명하고 동의를 받는다", score: 2, isCorrect: true },
      { id: 'B', text: "동의는 나중에 받고 일단 모은다", score: 1, isCorrect: false },
      { id: 'C', text: "수업이니까 동의 없이도 괜찮다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "데이터를 수집할 때는 반드시 목적을 설명하고 동의를 먼저 받아야 해요. 이것이 투명성의 기본이에요.",
      alternative: "데이터 수집 전에 항상 '왜, 어떻게, 얼마나' 사용할지 명확히 설명해요.",
    },
    realCase: "OpenAI의 ChatGPT도 사용자 대화를 AI 학습에 활용하는데, 이제는 사용자가 직접 설정에서 끌 수 있어요.",
  },
  {
    id: 5,
    title: "허위정보 검증",
    category: "transparency",
    situation: "AI가 '사실'처럼 답한 내용을 보고서에 넣으려 한다.",
    context: "과학 보고서를 쓰는데 AI가 알려준 통계 수치가 있어.",
    options: [
      { id: 'A', text: "2개 이상 출처로 사실 확인 후 넣는다", score: 2, isCorrect: true },
      { id: 'B', text: "AI가 그럴듯하니 넣는다", score: 1, isCorrect: false },
      { id: 'C', text: "확인 어려우면 대충 빼버린다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI도 틀릴 수 있어요(환각 현상). 중요한 정보는 반드시 여러 출처로 교차 검증해야 해요.",
      alternative: "AI 답변을 그대로 믿지 말고, 신뢰할 수 있는 출처(교과서, 공식 사이트)로 확인하세요.",
    },
    realCase: "2023년 미국 변호사가 AI가 만들어낸 가짜 판례를 법정에 제출했다가 징계를 받았어요.",
  },
  {
    id: 6,
    title: "AI 답변의 한계",
    category: "transparency",
    situation: "AI 챗봇에게 '오늘 날씨'를 물었더니 엉뚱한 답을 했어.",
    context: "숙제하다가 궁금한 걸 AI에게 물어봤어.",
    options: [
      { id: 'A', text: "AI에게도 모르는 것이 있음을 이해하고 다른 방법으로 찾는다", score: 2, isCorrect: true },
      { id: 'B', text: "AI가 고장났다고 생각하고 화를 낸다", score: 1, isCorrect: false },
      { id: 'C', text: "AI가 말했으니 그게 맞겠지 하고 넘어간다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI는 실시간 정보를 모르거나 학습되지 않은 내용엔 틀릴 수 있어요. AI의 한계를 이해하는 것이 중요해요.",
      alternative: "AI에게 '정확도가 낮을 수 있는 질문'인지 먼저 생각해보세요.",
    },
    realCase: "대부분의 AI 챗봇은 실시간 정보(날씨, 주가 등)를 알지 못하거나 학습 시점 이후의 정보는 몰라요.",
  },

  // Fairness (공정성) - 4개 (2개 추가)
  {
    id: 7,
    title: "편향과 공정성",
    category: "fairness",
    situation: "추천 알고리즘이 '남학생에게만' 로봇 활동을 더 추천한다.",
    context: "학교 동아리 추천 AI가 성별에 따라 다른 활동을 추천하고 있어.",
    options: [
      { id: 'A', text: "추천 기준을 점검하고 특정 집단에 불리한지 확인한다", score: 2, isCorrect: true },
      { id: 'B', text: "원래 남학생이 로봇 좋아하니까 괜찮다", score: 1, isCorrect: false },
      { id: 'C', text: "추천은 그냥 참고니까 신경 안 쓴다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI 추천도 편향될 수 있어요. 성별, 나이 등으로 기회가 달라지면 안 돼요.",
      alternative: "AI 결과를 그대로 믿지 말고, 모두에게 공정한지 확인하는 습관을 가져요.",
    },
    realCase: "유튜브 알고리즘은 시청 기록 기반으로 추천하기 때문에 '필터 버블'에 갇힐 수 있어요.",
  },
  {
    id: 8,
    title: "AI 면접관의 판단",
    category: "fairness",
    situation: "어떤 회사가 AI로 면접을 보는데, AI가 특정 학교 출신을 더 높게 평가한대.",
    context: "뉴스에서 AI 채용 시스템에 대한 이야기를 봤어.",
    options: [
      { id: 'A', text: "AI도 편향될 수 있으니 사람이 함께 검토해야 한다", score: 2, isCorrect: true },
      { id: 'B', text: "AI가 판단한 거니까 객관적일 것이다", score: 1, isCorrect: false },
      { id: 'C', text: "어차피 나랑 상관없는 일이다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI는 학습 데이터에 있는 편향을 그대로 배울 수 있어요. 중요한 결정엔 사람의 검토가 필요해요.",
      alternative: "AI의 결정이 공정한지 항상 질문하고, 문제가 있으면 목소리를 내요.",
    },
    realCase: "아마존은 여성 지원자를 불리하게 평가하는 AI 채용 시스템을 발견하고 2018년 폐기했어요.",
  },
  {
    id: 13,
    title: "AI 번역의 성별 편향",
    category: "fairness",
    situation: "영어를 한국어로 번역하는 AI가 'doctor'는 '그(he)', 'nurse'는 '그녀(she)'로 자동 번역해.",
    context: "영어 숙제를 하면서 AI 번역기를 사용하고 있어.",
    options: [
      { id: 'A', text: "언어에도 성별 편향이 있을 수 있음을 인식하고 직접 확인한다", score: 2, isCorrect: true },
      { id: 'B', text: "AI가 번역한 대로 사용한다", score: 1, isCorrect: false },
      { id: 'C', text: "원래 의사는 남자가 많으니까 맞을 것이다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI는 기존 데이터의 편향을 학습해요. '직업 = 특정 성별'이라는 고정관념이 번역에도 나타날 수 있어요.",
      alternative: "AI 번역 결과를 무조건 믿지 말고, 성별이나 문화적 편향이 있는지 확인해보세요.",
    },
    realCase: "구글 번역은 터키어 같은 성별 중립 언어에서 영어로 번역할 때 성별 고정관념을 반영한다는 연구 결과가 있어요.",
  },
  {
    id: 14,
    title: "피부색과 AI 인식",
    category: "fairness",
    situation: "손 인식 앱을 친구와 함께 쓰는데, 피부색이 어두운 친구의 손은 잘 인식하지 못해.",
    context: "새로 나온 AR 앱으로 손 제스처 게임을 하려는 중이야.",
    options: [
      { id: 'A', text: "AI가 다양한 피부색을 잘 학습하지 못한 문제임을 이해한다", score: 2, isCorrect: true },
      { id: 'B', text: "친구 손에 문제가 있는 것 같다", score: 1, isCorrect: false },
      { id: 'C', text: "그냥 다른 게임을 한다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI 학습 데이터에 다양성이 부족하면 특정 집단에게 불리하게 작동해요. 이런 문제를 인식하는 것이 중요해요.",
      alternative: "AI 서비스가 모든 사람에게 공정하게 작동하는지 관심을 가져보세요.",
    },
    realCase: "MIT 연구에 따르면 얼굴 인식 AI는 어두운 피부색 여성의 오류율이 밝은 피부색 남성보다 34배 높았어요.",
  },

  // Responsibility (책임) - 4개
  {
    id: 9,
    title: "저작권과 출처",
    category: "responsibility",
    situation: "AI가 만든 그림을 발표자료에 넣으려 한다.",
    context: "미술 시간에 발표할 자료를 만들고 있어.",
    options: [
      { id: 'A', text: '"AI 생성 이미지"임을 밝히고 사용 조건을 확인한다', score: 2, isCorrect: true },
      { id: 'B', text: "그냥 넣는다(내가 만들었다고 말하진 않음)", score: 1, isCorrect: false },
      { id: 'C', text: "내가 만든 것처럼 말한다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI가 만든 콘텐츠도 출처를 밝혀야 해요. 정직하게 AI 생성물임을 표시하는 것이 책임감 있는 태도예요.",
      alternative: "AI 생성물 사용 시 반드시 출처와 사용 조건(상업적 사용 가능 여부 등)을 확인해요.",
    },
    realCase: "2023년 미국 저작권청은 AI가 생성한 이미지는 저작권 보호를 받지 못한다고 결정했어요.",
  },
  {
    id: 10,
    title: "딥페이크와 책임",
    category: "responsibility",
    situation: "친구 얼굴로 만든 합성 영상이 단톡에 올라왔다.",
    context: "누군가 재미로 만든 것 같은데, 친구 얼굴이 합성되어 있어.",
    options: [
      { id: 'A', text: "공유하지 않고 문제를 알린다", score: 2, isCorrect: true },
      { id: 'B', text: "재미로 한 번만 공유한다", score: 1, isCorrect: false },
      { id: 'C', text: "조회수 올리려고 퍼뜨린다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "딥페이크 영상은 심각한 피해를 줄 수 있어요. 공유하지 않고 신고하는 것이 책임감 있는 행동이에요.",
      alternative: "허위 콘텐츠를 발견하면 공유하지 말고, 선생님이나 부모님께 알려요.",
    },
    realCase: "2023년 한국에서 딥페이크 성범죄 피해 신고가 전년 대비 2배 이상 증가했어요.",
  },
  {
    id: 11,
    title: "AI 숙제 도우미",
    category: "responsibility",
    situation: "수학 숙제가 너무 어려워서 AI에게 답을 물어봤더니 풀이까지 다 알려줬어.",
    context: "내일까지 숙제를 내야 하는데 시간이 없어.",
    options: [
      { id: 'A', text: "AI 풀이를 참고해서 이해한 후 직접 다시 풀어본다", score: 2, isCorrect: true },
      { id: 'B', text: "AI 풀이를 베껴서 제출한다", score: 1, isCorrect: false },
      { id: 'C', text: "앞으로 모든 숙제를 AI에게 시킨다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI는 '도우미'예요. 답을 베끼면 배움의 기회를 잃어요. 이해를 위한 도구로 활용하세요.",
      alternative: "AI에게 '풀이 과정'을 설명해달라고 하고, 직접 풀어보며 확인해요.",
    },
    realCase: "많은 대학에서 AI 도구 사용 시 출처를 밝히도록 하는 '학술 정직성' 정책을 시행하고 있어요.",
  },
  {
    id: 12,
    title: "AI 그림 대회",
    category: "responsibility",
    situation: "그림 대회에 AI가 그린 그림을 내 작품으로 제출하려는 친구가 있어.",
    context: "상품이 좋은 대회인데, 친구가 AI 그림으로 참가하려고 해.",
    options: [
      { id: 'A', text: "AI 그림임을 밝히거나 직접 그린 작품을 내라고 조언한다", score: 2, isCorrect: true },
      { id: 'B', text: "들키지만 않으면 괜찮다고 생각한다", score: 1, isCorrect: false },
      { id: 'C', text: "나도 AI로 그려서 낸다", score: 0, isCorrect: false },
    ],
    feedback: {
      correct: "AI 생성물을 자기 작품으로 속이는 건 부정행위예요. 정직함이 가장 중요해요.",
      alternative: "AI는 '아이디어 도구'로 활용하고, 최종 작품은 직접 만들어요.",
    },
    realCase: "2022년 미국 콜로라도 미술대회에서 AI 그림이 1등을 해서 논란이 되었어요.",
  },
];

// 각 역량별 미션 매핑 (업데이트 - 공정성에 13, 14 추가)
export const competencyMissions = {
  privacy: [1, 2, 3], // 개인정보 관련
  fairness: [7, 8, 13, 14], // 공정성 관련 (4개로 확대)
  transparency: [4, 5, 6], // 투명성 관련
  responsibility: [9, 10, 11, 12], // 책임 관련
};
