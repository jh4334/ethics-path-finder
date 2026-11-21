import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { trialMissions, trialComplete, shuffledOrder, canImprove, type TrialAnswers, type TrialOrder } from '@/data/trial';

type Stage = 'start' | 'mission' | 'feedback' | 'result';
interface TrialState {
  nickname: string;
  stage: Stage;
  index: number;
  answers: TrialAnswers;
  order: TrialOrder; // 미션별 보기 순서. 시작할 때 한 번 섞어 새로고침해도 유지한다.
  before: TrialAnswers | null; // "다시 고르기"를 쓰기 전의 답. 있으면 기회를 이미 쓴 것이다.
  start: (nickname: string) => void;
  choose: (option: string) => void;
  next: () => void;
  retry: (missionId: number) => void;
  reset: () => void;
}
const initial = { nickname: '', stage: 'start' as Stage, index: 0, answers: {}, order: {}, before: null };
export const useTrial = create<TrialState>()(persist((set) => ({
  ...initial,
  start: (nickname) => set({ ...initial, nickname: nickname.trim().slice(0, 20), stage: 'mission', order: shuffledOrder() }),
  choose: (option) => set((state) => {
    const mission = trialMissions[state.index];
    if (state.stage !== 'mission' || !mission?.options.some((item) => item.id === option)) return state;
    return { answers: { ...state.answers, [mission.id]: option }, stage: 'feedback' };
  }),
  next: () => set((state) => {
    if (state.stage !== 'feedback') return state;
    if (state.before) return { stage: 'result' }; // 다시 고른 미션 하나만 보고 결과로 돌아간다.
    if (state.index < trialMissions.length - 1) return { index: state.index + 1, stage: 'mission' };
    return trialComplete(state.answers) ? { stage: 'result' } : state;
  }),
  // 결과 화면에서 딱 한 번, 더 나은 보기가 있는 미션 하나를 다시 고를 수 있다.
  retry: (missionId) => set((state) => {
    const index = trialMissions.findIndex((mission) => mission.id === missionId);
    if (state.stage !== 'result' || state.before || index < 0 || !canImprove(trialMissions[index], state.answers)) return state;
    return { before: state.answers, index, stage: 'mission' };
  }),
  reset: () => set(initial),
  // 이전 버전에서 저장된 진행 상태는 지금 구조와 맞지 않으므로 처음부터 다시 시작한다.
}), { name: 'ethics-pick-student-trial', version: 3, migrate: () => initial }));
