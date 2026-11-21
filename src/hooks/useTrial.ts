import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { trialMissions, trialComplete, type TrialAnswers } from '@/data/trial';

type Stage = 'start' | 'mission' | 'feedback' | 'result';
interface TrialState {
  nickname: string;
  stage: Stage;
  index: number;
  answers: TrialAnswers;
  start: (nickname: string) => void;
  choose: (option: string) => void;
  next: () => void;
  reset: () => void;
}
const initial = { nickname: '', stage: 'start' as Stage, index: 0, answers: {} };
export const useTrial = create<TrialState>()(persist((set) => ({
  ...initial,
  start: (nickname) => set({ ...initial, nickname: nickname.trim().slice(0, 20), stage: 'mission' }),
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
}), { name: 'ethics-pick-student-trial', version: 1 }));