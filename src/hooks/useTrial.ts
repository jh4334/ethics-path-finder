import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { trialMissions, trialComplete, shuffledOrder, type TrialAnswers, type TrialOrder } from '@/data/trial';

type Stage = 'start' | 'mission' | 'feedback' | 'result';
interface TrialState {
  nickname: string;
  stage: Stage;
  index: number;
  answers: TrialAnswers;
  order: TrialOrder; // 미션별 보기 순서. 시작할 때 한 번 섞어 새로고침해도 유지한다.
  start: (nickname: string) => void;
  choose: (option: string) => void;
  next: () => void;
  reset: () => void;
}
const initial = { nickname: '', stage: 'start' as Stage, index: 0, answers: {}, order: {} };
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
    if (state.index < trialMissions.length - 1) return { index: state.index + 1, stage: 'mission' };
    return trialComplete(state.answers) ? { stage: 'result' } : state;
  }),
  reset: () => set(initial),
  // v1(퀴즈형)에서 저장된 진행 상태는 이야기형과 맞지 않으므로 처음부터 다시 시작한다.
}), { name: 'ethics-pick-student-trial', version: 2, migrate: () => initial }));
