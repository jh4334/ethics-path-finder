import { missions, type Mission } from './missions';

const trialIds = [1, 4, 7, 9, 5, 10];
export const trialMissions = trialIds.flatMap((id) => {
  const mission = missions.find((item) => item.id === id);
  return mission ? [mission] : [];
});

export type TrialAnswers = Record<number, string>;
export const trialCategories: { key: Mission['category']; label: string; color: string }[] = [
  { key: 'privacy', label: '개인정보', color: 'text-privacy' },
  { key: 'fairness', label: '공정성', color: 'text-fairness' },
  { key: 'transparency', label: '투명성', color: 'text-transparency' },
  { key: 'responsibility', label: '책임', color: 'text-responsibility' },
];

export function summarizeTrial(answers: TrialAnswers) {
  return trialCategories.map((category) => {
    const items = trialMissions.filter((mission) => mission.category === category.key);
    const score = items.reduce((total, mission) => total +
      (mission.options.find((option) => option.id === answers[mission.id])?.score ?? 0), 0);
    return { ...category, score, max: items.length * 2 };
  });
}

export function trialComplete(answers: TrialAnswers) {
  return trialMissions.every((mission) => mission.options.some((option) => option.id === answers[mission.id]));
}