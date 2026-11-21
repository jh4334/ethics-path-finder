import { beforeEach, describe, expect, it } from 'vitest';
import { trialMissions, summarizeTrial, trialComplete } from '@/data/trial';
import { useTrial } from '@/hooks/useTrial';

describe('student trial', () => {
  beforeEach(() => useTrial.getState().reset());
  it('uses six stable mission IDs covering all four competencies', () => {
    expect(trialMissions.map((mission) => mission.id)).toEqual([1, 4, 7, 9, 5, 10]);
    expect(new Set(trialMissions.map((mission) => mission.category)).size).toBe(4);
  });
  it('scores only selected trial answers and requires six valid answers', () => {
    expect(trialComplete({})).toBe(false);
    expect(trialComplete({ 1: 'invalid' })).toBe(false);
    const answers = Object.fromEntries(trialMissions.map((mission) => [mission.id, 'A']));
    expect(trialComplete(answers)).toBe(true);
    expect(summarizeTrial(answers).map(({ score, max }) => [score, max])).toEqual([[2, 2], [2, 2], [4, 4], [4, 4]]);
    expect(summarizeTrial({ 1: 'B', 4: 'C', 99: 'A' }).map(({ score }) => score)).toEqual([1, 0, 0, 0]);
  });
  it('keeps feedback separate, rejects duplicate selections, and clears answers on restart', () => {
    useTrial.getState().start(' 학생 ');
    useTrial.getState().next();
    expect(useTrial.getState().index).toBe(0);
    for (let index = 0; index < 6; index++) {
      useTrial.getState().choose('B');
      useTrial.getState().choose('A');
      expect(useTrial.getState().answers[trialMissions[index].id]).toBe('B');
      expect(useTrial.getState().stage).toBe('feedback');
      useTrial.getState().next();
    }
    expect(useTrial.getState().stage).toBe('result');
    useTrial.getState().reset();
    expect(useTrial.getState().answers).toEqual({});
    expect(useTrial.getState().nickname).toBe('');
    expect(useTrial.getState().stage).toBe('start');
  });
});