import { missions, type Mission } from './missions';

// 학생 체험은 "우리 반 AI 도우미 '반짝이' 만들기" 한 편의 이야기다.
// 역량(category)은 전체 미션 목록의 고정 ID에서 가져오고, 이야기 내용만 여기서 덮어쓴다.
export type OptionId = 'A' | 'B' | 'C';
export interface TrialOption {
  id: OptionId;
  text: string;
  outcome: string; // "며칠 뒤…" 결과 장면
  trust: number; // 믿음 게이지 변화
  ease: number; // 편리함 게이지 변화
}
export interface TrialMission {
  id: number;
  category: Mission['category'];
  title: string;
  situation: string;
  options: TrialOption[];
  lesson: string;
}

const story: Omit<TrialMission, 'category'>[] = [
  {
    id: 1,
    title: '가입할 때 무엇을 적게 할까?',
    situation: '반짝이를 쓰려면 먼저 가입을 해야 해요. 친구들에게 무엇을 적어 달라고 할까요?',
    options: [
      { id: 'A', text: '별명만 적게 한다', outcome: '앱이 고장 나서 정보가 밖으로 새어 나갔어요. 하지만 별명뿐이라 아무 일도 없었어요.', trust: 2, ease: 0 },
      { id: 'B', text: '생일도 적게 한다. 생일 축하를 해 주고 싶으니까', outcome: '생일 축하는 인기였어요. 그런데 모르는 사람이 내 생일을 알고 메시지를 보냈어요.', trust: -1, ease: 1 },
      { id: 'C', text: '집 주소도 적게 한다. 준비물을 가져다줄 수 있으니까', outcome: '우리 반 주소 목록이 단톡방에 돌아다녔어요. 친구들이 앱을 지우기 시작했어요.', trust: -2, ease: 2 },
    ],
    lesson: '정보는 꼭 필요한 만큼만. 적게 모으면 새어 나가도 안전해요.',
  },
  {
    id: 4,
    title: '친구들의 글이 필요해',
    situation: '반짝이를 똑똑하게 만들려면 친구들이 쓴 글이 많이 필요해요. 어떻게 모을까요?',
    options: [
      { id: 'A', text: '한 명씩 물어보고 허락한 글만 쓴다', outcome: '싫다는 친구도 있어서 글이 적게 모였어요. 하지만 허락한 친구들은 "내 글로 배웠대!" 하며 자랑했어요.', trust: 2, ease: -1 },
      { id: 'B', text: '일단 모으고 나중에 말한다', outcome: '민지가 자기 비밀 일기가 들어간 걸 알고 울었어요.', trust: -2, ease: 2 },
      { id: 'C', text: '이름만 지우고 모은다', outcome: '이름은 없었지만, 내용을 보고 누구 글인지 다들 알아챘어요.', trust: -1, ease: 1 },
    ],
    lesson: '남의 것을 쓸 때는 먼저 "왜 쓰는지" 말하고 허락을 받아요.',
  },
  {
    id: 7,
    title: '남학생에게만 추천한다고?',
    situation: '반짝이가 로봇 동아리를 남학생에게만 추천하고 있어요! 어떻게 할까요?',
    options: [
      { id: 'A', text: '왜 그런지 살펴보고 고친다', outcome: '고치느라 하루가 걸렸어요. 그 뒤로 추천이 모두에게 잘 맞았고, 로봇을 좋아하던 서연이는 동아리에 들어가 대회에서 상을 탔어요.', trust: 2, ease: 1 },
      { id: 'B', text: '추천은 참고일 뿐이니 그대로 둔다', outcome: '서연이는 로봇 동아리가 있는 줄도 몰랐어요.', trust: -2, ease: 0 },
      { id: 'C', text: '추천 기능을 아예 없앤다', outcome: '불공평은 사라졌어요. 하지만 모두가 동아리 찾기가 어려워졌어요.', trust: 1, ease: -2 },
    ],
    lesson: 'AI도 한쪽으로 치우칠 수 있어요. 누가 빠졌는지 살펴봐요.',
  },
  {
    id: 9,
    title: '포스터에 넣을 그림',
    situation: '반짝이 소개 포스터에 AI가 그린 멋진 그림을 넣으려고 해요.',
    options: [
      { id: 'A', text: '"AI가 그렸어요"라고 적는다', outcome: '친구들이 "어떻게 만들었어?" 하고 물었어요. 방법을 알려 주니 다 같이 따라 만들었어요.', trust: 2, ease: 1 },
      { id: 'B', text: '아무 말 없이 그냥 넣는다', outcome: '"이거 네가 그렸어?" 하는 질문에 대답하기가 곤란했어요.', trust: -1, ease: 1 },
      { id: 'C', text: '내가 그렸다고 말한다', outcome: '선생님이 그림 대회에 나가 보라고 하셨어요. 눈앞에서 그려 보라는 말에 얼굴이 빨개졌어요.', trust: -2, ease: 0 },
    ],
    lesson: 'AI가 만든 것은 AI가 만들었다고 밝혀요.',
  },
  {
    id: 5,
    title: '달팽이는 이빨이 없다?',
    situation: '반짝이가 "달팽이는 이빨이 없어요"라고 대답했어요. 반 신문에 실을까요?',
    options: [
      { id: 'A', text: '책과 다른 곳, 두 군데에서 확인한다', outcome: '틀린 답이었어요! 달팽이는 아주 작은 이빨이 만 개도 넘어요. 고쳐서 실었더니 인기 기사가 됐어요.', trust: 2, ease: -1 },
      { id: 'B', text: '그럴듯하니까 그대로 싣는다', outcome: '친구들이 과학 시간에 그대로 말했다가 틀렸어요. "반짝이 못 믿겠어."', trust: -2, ease: 1 },
      { id: 'C', text: '헷갈리니까 그냥 뺀다', outcome: '틀린 내용은 없었어요. 하지만 궁금증도 그대로 남았어요.', trust: 0, ease: -1 },
    ],
    lesson: 'AI도 틀려요. 중요한 내용은 두 군데 이상에서 확인해요.',
  },
  {
    id: 10,
    title: '단톡방에 올라온 가짜 영상',
    situation: '누가 반짝이로 친구 얼굴을 합성한 웃긴 영상을 만들어 단톡방에 올렸어요.',
    options: [
      { id: 'A', text: '선생님께 바로 알린다', outcome: '더 퍼지기 전에 영상이 지워졌어요. 그 친구가 "고마워"라고 말했어요.', trust: 2, ease: 0 },
      { id: 'B', text: '올린 친구에게 지우라고 말한다', outcome: '영상은 지워졌어요. 하지만 이미 다른 방으로 퍼진 뒤라 결국 어른의 도움이 필요했어요.', trust: 1, ease: 0 },
      { id: 'C', text: 'ㅋㅋ만 남기고 넘어간다', outcome: '웃음이 늘수록 영상은 더 퍼졌어요. 그 친구는 다음 날 학교에 오지 않았어요.', trust: -2, ease: 0 },
    ],
    lesson: '친구 얼굴로 만든 가짜 영상은 장난이 아니에요. 퍼뜨리지 말고 어른께 알려요.',
  },
];

export const trialMissions: TrialMission[] = story.flatMap((item) => {
  const mission = missions.find((entry) => entry.id === item.id);
  return mission ? [{ ...item, category: mission.category }] : [];
});

export type TrialAnswers = Record<number, string>;
export type TrialOrder = Record<number, OptionId[]>;
export const trialCategories: { key: Mission['category']; label: string; color: string }[] = [
  { key: 'privacy', label: '개인정보', color: 'text-privacy' },
  { key: 'fairness', label: '공정성', color: 'text-fairness' },
  { key: 'transparency', label: '투명성', color: 'text-transparency' },
  { key: 'responsibility', label: '책임', color: 'text-responsibility' },
];

export const GAUGE_MAX = 10;
const GAUGE_START = 5;
const clamp = (value: number) => Math.max(0, Math.min(GAUGE_MAX, value));

export function pickedOption(mission: TrialMission, answers: TrialAnswers) {
  return mission.options.find((option) => option.id === answers[mission.id]);
}

// 게이지는 저장하지 않고 답에서 매번 계산한다(저장된 값과 답이 어긋날 일이 없다).
export function trialGauges(answers: TrialAnswers) {
  return trialMissions.reduce((gauges, mission) => {
    const option = pickedOption(mission, answers);
    return option ? { trust: clamp(gauges.trust + option.trust), ease: clamp(gauges.ease + option.ease) } : gauges;
  }, { trust: GAUGE_START, ease: GAUGE_START });
}

export type TrialTypeKey = 'loved' | 'guardian' | 'fast' | 'sprout';
export const trialTypes: Record<TrialTypeKey, { name: string; text: string }> = {
  loved: { name: '모두가 좋아하는 반짝이', text: '믿을 수 있고 쓰기도 편해요. 최고의 팀장!' },
  guardian: { name: '든든한 지킴이 반짝이', text: '조금 불편해도 친구들이 안심하고 써요. 지키면서도 편하게 만들 방법은 없었을까요?' },
  fast: { name: '빠르지만 불안한 반짝이', text: '편하긴 한데 친구들이 걱정해요. 어디서 믿음을 잃었을까요?' },
  sprout: { name: '다시 자라는 반짝이', text: '괜찮아요. 한 번 더 만들면 더 잘할 수 있어요.' },
};

export function trialType(answers: TrialAnswers): TrialTypeKey {
  const { trust, ease } = trialGauges(answers);
  const trusted = trust >= 7;
  const easy = ease >= 5;
  return trusted ? (easy ? 'loved' : 'guardian') : (easy ? 'fast' : 'sprout');
}

export function shuffledOrder(random: () => number = Math.random): TrialOrder {
  return Object.fromEntries(trialMissions.map((mission) => {
    const ids = mission.options.map((option) => option.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return [mission.id, ids];
  }));
}

export function trialComplete(answers: TrialAnswers) {
  return trialMissions.every((mission) => Boolean(pickedOption(mission, answers)));
}
