import { useState } from 'react';
import { ArrowRight, RotateCcw, ShieldCheck, Scale, ScanEye, HeartHandshake, Sparkles, Heart, Zap, MessagesSquare, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Banjjak } from '@/components/Banjjak';
import { SceneArt } from '@/components/SceneArt';
import { useTrial } from '@/hooks/useTrial';
import { GAUGE_MAX, canImprove, pickedOption, trialCategories, trialGauges, trialMissions, trialType, trialTypes } from '@/data/trial';

const categoryIcons = { privacy: ShieldCheck, fairness: Scale, transparency: ScanEye, responsibility: HeartHandshake };

function Gauge({ label, value, icon: GaugeIcon, color }: { label: string; value: number; icon: typeof Heart; color: string }) {
  return (
    <div className="space-y-1.5" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={GAUGE_MAX} aria-valuenow={value}>
      <div className="flex items-center justify-between text-xs">
        <span className={`flex items-center gap-1.5 font-medium ${color}`}><GaugeIcon className="size-4" />{label}</span>
        <span className="text-muted-foreground">{value} / {GAUGE_MAX}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: GAUGE_MAX }, (_, cell) => (
          <span key={cell} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${cell < value ? `bg-current ${color}` : 'bg-muted'}`} style={{ transitionDelay: `${cell * 40}ms` }} />
        ))}
      </div>
    </div>
  );
}

// 반짝이와 게이지는 늘 함께 보여 준다. 표정이 먼저 눈에 들어오고 숫자는 그 설명이다.
function Status({ trust, ease, large = false }: { trust: number; ease: number; large?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <Banjjak trust={trust} ease={ease} className={`shrink-0 ${large ? 'size-24' : 'size-16'}`} />
      <div className="flex-1 space-y-3">
        <Gauge label="믿음" value={trust} icon={Heart} color="text-primary" />
        <Gauge label="편리함" value={ease} icon={Zap} color="text-warning" />
      </div>
    </div>
  );
}

function Delta({ label, value, color }: { label: string; value: number; color: string }) {
  if (!value) return null;
  return <span className={`rounded-full border border-current px-3 py-1 text-sm font-semibold ${color}`}>{label} {value > 0 ? `+${value}` : value}</span>;
}

export default function StudentTrialPage() {
  const { stage, nickname, index, answers, order, before, start, choose, next, retry, reset } = useTrial();
  const [name, setName] = useState('');
  const mission = trialMissions[index];
  const category = trialCategories.find((item) => item.key === mission?.category);
  const Icon = mission ? categoryIcons[mission.category] : Sparkles;
  const option = mission ? pickedOption(mission, answers) : undefined;
  const choices = mission ? (order[mission.id] ?? mission.options.map((item) => item.id)).flatMap((id) => mission.options.filter((item) => item.id === id)) : [];
  // 고르는 중인 미션의 답은 게이지에서 뺀다(다시 고를 때 예전 답이 남아 있기 때문).
  const gauges = trialGauges(stage === 'mission' && mission ? { ...answers, [mission.id]: '' } : answers);
  const typeKey = trialType(answers);
  const leader = nickname ? `${nickname} 팀장` : '팀장';
  const retrying = Boolean(before) && stage !== 'result';
  const beforeGauges = before ? trialGauges(before) : null;
  const beforeType = before ? trialType(before) : null;

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-2xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold"><Sparkles className="size-5 text-primary" /> ETHICS PICK</div>
          <span className="text-xs text-muted-foreground">학생 체험</span>
        </div>
      </header>
      <main className="w-full max-w-xl mx-auto flex-1 px-6 py-8 sm:py-12">
        {stage === 'start' ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary text-sm font-medium">AI 윤리 선택 체험</span>
              <h1 className="text-4xl font-bold leading-tight">Ethics Pick<span className="block text-2xl mt-3">나의 선택이 만드는 변화</span></h1>
              <p className="text-muted-foreground leading-relaxed">우리 반 AI 도우미 ‘반짝이’를 만들어요.<br />팀장은 바로 나! 내 선택에 따라 반짝이가 달라져요.</p>
            </div>
            <div className="space-y-3 border-y border-border py-6">
              <Status trust={gauges.trust} ease={gauges.ease} large />
              <p className="text-xs text-muted-foreground">선택할 때마다 반짝이의 표정과 믿음·편리함이 달라져요.</p>
            </div>
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); start(name); }}>
              <div className="space-y-2">
                <label htmlFor="trial-name" className="text-sm text-muted-foreground">닉네임 <span className="text-xs">(선택)</span></label>
                <Input id="trial-name" maxLength={20} autoComplete="off" value={name} onChange={(event) => setName(event.target.value)} placeholder="어떤 이름으로 불러줄까요?" className="h-12 bg-card" />
              </div>
              <Button type="submit" className="w-full h-14 text-base font-semibold">반짝이 만들기 시작 <ArrowRight /></Button>
            </form>
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>오늘의 미션 6개</span><span>약 3–5분</span></div>
          </div>
        ) : stage === 'result' ? (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-primary text-sm">반짝이 완성!</p>
              <h1 className="text-2xl font-bold break-words">{leader}, 수고했어요!</h1>
            </div>
            <section className="rounded-lg border border-primary/40 bg-card p-6 space-y-5" aria-label="내가 만든 반짝이">
              <div className="space-y-1"><p className="text-xs text-muted-foreground">내가 만든 반짝이는</p><h2 className="text-xl font-bold">{trialTypes[typeKey].name}</h2></div>
              <Status trust={gauges.trust} ease={gauges.ease} large />
              <p className="leading-relaxed">{trialTypes[typeKey].text}</p>
              {beforeGauges && beforeType ? (
                <p className="text-sm text-primary border-t border-border pt-4 leading-relaxed">
                  {/* 게이지는 0과 10에서 멈추므로, 선택 하나를 바꿔도 칸 수가 그대로일 수 있다. */}
                  {[
                    gauges.trust !== beforeGauges.trust && `다시 골랐더니 믿음이 ${beforeGauges.trust} → ${gauges.trust}칸이 됐어요.`,
                    gauges.ease !== beforeGauges.ease && `편리함은 ${beforeGauges.ease} → ${gauges.ease}칸이 됐어요.`,
                    beforeType !== typeKey && `‘${trialTypes[beforeType].name}’에서 ‘${trialTypes[typeKey].name}’로 바뀌었어요!`,
                  ].filter(Boolean).join(' ') || '선택 하나를 바꿨지만, 다른 선택들 때문에 반짝이는 아직 그대로예요. 처음부터 다시 만들어 볼까요?'}
                </p>
              ) : null}
            </section>
            <section className="space-y-4" aria-label="내 선택과 일어난 일">
              <div className="space-y-1">
                <h2 className="font-semibold">내 선택 → 일어난 일</h2>
                {!before && trialMissions.some((item) => canImprove(item, answers)) ? <p className="text-sm text-muted-foreground">딱 하나만 다시 고를 수 있어요. 어떤 선택을 바꿔 볼까요?</p> : null}
              </div>
              <ol className="space-y-4">
                {trialMissions.map((item, position) => {
                  const picked = pickedOption(item, answers);
                  return picked ? (
                    <li key={item.id} className="border-l-2 border-border pl-4 space-y-1">
                      <p className="text-sm font-medium">{position + 1}. {picked.text}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{picked.outcome}</p>
                      {!before && canImprove(item, answers) ? <Button variant="ghost" size="sm" onClick={() => retry(item.id)} className="h-8 px-2 -ml-2 text-primary"><Undo2 /> 다시 고르기</Button> : null}
                    </li>
                  ) : null;
                })}
              </ol>
            </section>
            <section className="rounded-lg bg-muted/40 p-5 space-y-2" aria-label="짝과 이야기해요">
              <h2 className="flex items-center gap-2 font-semibold"><MessagesSquare className="size-5 text-primary" />짝과 이야기해요</h2>
              <p className="leading-relaxed">{trialTypes[typeKey].talk}</p>
            </section>
            <div className="space-y-2 border-t border-border pt-6"><h2 className="font-semibold">오늘의 약속</h2><p className="text-muted-foreground leading-relaxed">정보는 필요한 만큼만,<br />AI의 답은 확인하고, 친구를 존중해요.</p></div>
            <Button variant="outline" onClick={() => { reset(); setName(''); }} className="w-full h-12"><RotateCcw /> 처음부터 다시 만들어 보기</Button>
          </div>
        ) : mission ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{stage === 'feedback' ? '며칠 뒤…' : retrying ? '다시 고르기' : '반짝이 만들기'}</span><span>{index + 1} / {trialMissions.length}</span></div>
              <Progress value={retrying ? 100 : (index + (stage === 'feedback' ? 1 : 0)) / trialMissions.length * 100} className="h-1.5" />
            </div>
            <Status trust={gauges.trust} ease={gauges.ease} />
            <div className="pt-2 space-y-4">
              <div className={`flex items-center gap-2 text-sm ${category?.color}`}><Icon className="size-5" />{category?.label}</div>
              <h1 className="text-2xl font-bold leading-snug">{mission.title}</h1>
              <p className="text-foreground/90 text-lg leading-relaxed">{mission.situation}</p>
            </div>
            {stage === 'mission' ? (
              <div className="space-y-3 pt-2">
                <p className="text-sm text-muted-foreground">{leader}, {retrying ? '이번에는 어떻게 할까요?' : '어떻게 할까요?'}</p>
                {choices.map((choice) => (
                  <Button key={choice.id} variant="outline" onClick={() => choose(choice.id)} className="w-full h-auto min-h-16 p-4 justify-start text-left whitespace-normal leading-relaxed hover:bg-primary/10 hover:text-foreground hover:border-primary">
                    {choice.text}
                  </Button>
                ))}
              </div>
            ) : option ? (
              <div className="space-y-5 animate-fade-in">
                <div className="border-y border-border py-5 space-y-4">
                  <p className="text-sm text-muted-foreground">나의 선택: {option.text}</p>
                  <div className="rounded-lg bg-card"><SceneArt missionId={mission.id} optionId={option.id} className="mx-auto w-full max-w-xs" /></div>
                  <p className="text-xl font-semibold leading-relaxed">{option.outcome}</p>
                  <div className="flex flex-wrap gap-2">
                    <Delta label="믿음" value={option.trust} color="text-primary" />
                    <Delta label="편리함" value={option.ease} color="text-warning" />
                  </div>
                </div>
                <div className="space-y-2"><h2 className="text-sm font-semibold text-primary">한 줄 배움</h2><p className="text-sm text-muted-foreground leading-relaxed">{mission.lesson}</p></div>
                <Button onClick={next} className="w-full h-12">{retrying ? '달라진 반짝이 보기' : index === trialMissions.length - 1 ? '완성된 반짝이 보기' : '다음 미션'}<ArrowRight /></Button>
              </div>
            ) : null}
          </div>
        ) : <Button onClick={reset}>처음으로</Button>}
      </main>
      <footer className="mx-auto w-full max-w-xl px-6 pb-6 pt-4 text-xs text-muted-foreground">ETHICS PICK · AI를 바르게 쓰는 선택</footer>
    </div>
  );
}
