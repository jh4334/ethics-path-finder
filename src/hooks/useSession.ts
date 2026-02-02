import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  sessionId: string | null;
  nickname: string;
  classCode: string;
  preSurveyAnswers: number[];
  postSurveyAnswers: number[];
  missionResponses: { missionId: number; option: string; score: number }[];
  pledge: string;
  currentStep: 'start' | 'pre-survey' | 'mission' | 'post-survey' | 'result';
  currentMissionIndex: number;
  
  // Actions
  setSessionId: (id: string) => void;
  setNickname: (name: string) => void;
  setClassCode: (code: string) => void;
  addPreSurveyAnswer: (questionIndex: number, answer: number) => void;
  addPostSurveyAnswer: (questionIndex: number, answer: number) => void;
  addMissionResponse: (missionId: number, option: string, score: number) => void;
  setPledge: (pledge: string) => void;
  setCurrentStep: (step: SessionState['currentStep']) => void;
  setCurrentMissionIndex: (index: number) => void;
  resetSession: () => void;
}

const initialState = {
  sessionId: null,
  nickname: '',
  classCode: '',
  preSurveyAnswers: [],
  postSurveyAnswers: [],
  missionResponses: [],
  pledge: '',
  currentStep: 'start' as const,
  currentMissionIndex: 0,
};

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setSessionId: (id) => set({ sessionId: id }),
      setNickname: (name) => set({ nickname: name }),
      setClassCode: (code) => set({ classCode: code }),
      
      addPreSurveyAnswer: (questionIndex, answer) =>
        set((state) => {
          const newAnswers = [...state.preSurveyAnswers];
          newAnswers[questionIndex] = answer;
          return { preSurveyAnswers: newAnswers };
        }),
      
      addPostSurveyAnswer: (questionIndex, answer) =>
        set((state) => {
          const newAnswers = [...state.postSurveyAnswers];
          newAnswers[questionIndex] = answer;
          return { postSurveyAnswers: newAnswers };
        }),
      
      addMissionResponse: (missionId, option, score) =>
        set((state) => ({
          missionResponses: [
            ...state.missionResponses.filter((r) => r.missionId !== missionId),
            { missionId, option, score },
          ],
        })),
      
      setPledge: (pledge) => set({ pledge }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setCurrentMissionIndex: (index) => set({ currentMissionIndex: index }),
      
      resetSession: () => set(initialState),
    }),
    {
      name: 'ethics-pick-session',
    }
  )
);
