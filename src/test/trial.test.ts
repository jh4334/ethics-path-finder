import { beforeEach, describe, expect, it } from 'vitest';
import { trialMissions, trialGauges, trialType, trialComplete, shuffledOrder } from '@/data/trial';
import { useTrial } from '@/hooks/useTrial';

const all = (id: string) => Object.fromEntries(trialMissions.map((mission) => [mission.id, id]));

describe('student trial', () => {
  beforeEach(() => useTrial.getState().reset());
  it('uses six stable mission IDs covering all four competencies', () => {
    expect(trialMissions.map((mission) => mission.id)).toEqual([1, 4, 7, 9, 5, 10]);
    expect(new Set(trialMissions.map((mission) => mission.category)).size).toBe(4);
  });
  it('derives gauges and the result type from valid answers only', () => {
    expect(trialComplete({})).toBe(false);
    expect(trialComplete({ 1: 'invalid' })).toBe(false);
    expect(trialGauges({})).toEqual({ trust: 5, ease: 5 });
    expect(trialGauges({ 1: 'C', 99: 'A', 4: 'invalid' })).toEqual({ trust: 3, ease: 7 });
    expect(trialComplete(all('A'))).toBe(true);
    // 가장 믿음직한 길로도 최고 유형에 닿을 수 있어야 한다.
    expect(trialGauges(all('A'))).toEqual({ trust: 10, ease: 5 });
    expect(trialType(all('A'))).toBe('loved');
    expect(trialType({ ...all('A'), 7: 'C', 5: 'C' })).toBe('guardian');
    expect(trialType({ ...all('A'), 1: 'C', 4: 'B', 5: 'B' })).toBe('fast');
    expect(trialType({ ...all('C'), 1: 'B' })).toBe('sprout');
  });
  it('shuffles every mission into a permutation of its options', () => {
    const order = shuffledOrder(() => 0);
    for (const mission of trialMissions) {
      expect([...order[mission.id]].sort()).toEqual(['A', 'B', 'C']);
    }
    expect(order[1]).not.toEqual(['A', 'B', 'C']);
  });
  it('keeps feedback separate, rejects duplicate selections, and clears answers on restart', () => {
    useTrial.getState().start(' 학생 ');
    expect(Object.keys(useTrial.getState().order)).toHaveLength(6);
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
