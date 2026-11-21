import { useState } from 'react';
import { ArrowRight, Check, RotateCcw, ShieldCheck, Scale, ScanEye, HeartHandshake, Sparkles, CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useTrial } from '@/hooks/useTrial';
import { summarizeTrial, trialMissions, trialCategories } from '@/data/trial';

const categoryIcons = { privacy: ShieldCheck, fairness: Scale, transparency: ScanEye, responsibility: HeartHandshake };

export default function StudentTrialPage() {
  const { stage, nickname, index, answers, start, choose, next, reset } = useTrial();
  const [name, setName] = useState('');
  const mission = trialMissions[index];
  const category = trialCategories.find((item) => item.key === mission?.category);
  const Icon = mission ? categoryIcons[mission.category] : Sparkles;
  const option = mission?.options.find((item) => item.id === answers[mission.id]);
  const completed = stage === 'result';
  const summary = summarizeTrial(answers);
  const bestCount = trialMissions.filter((item) => item.options.find((choice) => choice.id === answers[item.id])?.isCorrect).length;

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
              <p className="text-muted-foreground leading-relaxed">오늘은 AI를 ‘똑똑하게’가 아니라<br />‘바르게’ 쓰는 연습을 해요.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-border py-6">
              {trialCategories.map((item) => {
                const CategoryIcon = categoryIcons[item.key];
                return <div key={item.key} className="flex items-center gap-3"><CategoryIcon className={`size-6 ${item.color}`} /><span className="text-sm">{item.label}</span></div>;
              })}
            </div>
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); start(name); }}>
              <div className="space-y-2">
                <label htmlFor="trial-name" className="text-sm text-muted-foreground">닉네임 <span className="text-xs">(선택)</span></label>
                <Input id="trial-name" maxLength={20} autoComplete="off" value={name} onChange={(event) => setName(event.target.value)} placeholder="어떤 이름으로 불러줄까요?" className="h-12 bg-card" />
              </div>
              <Button type="submit" className="w-full h-14 text-base font-semibold">체험 시작 <ArrowRight /></Button>
            </form>
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>오늘의 미션 6개</span><span>약 3–5분</span></div>
          </div>
        ) : completed ? (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><Check className="size-7" /></div>
              <p className="text-primary text-sm">체험 완료</p>
              <h1 className="text-2xl font-bold break-words">{nickname || '여러분'}, 수고했어요!</h1>
              <p className="text-muted-foreground">6개 미션 중 <strong className="text-foreground">{bestCount}개</strong>에서 바른 선택을 했어요.</p>
            </div>
            <section className="space-y-5 border-y border-border py-6" aria-label="역량별 결과">
              {summary.map((item) => (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm"><span className={item.color}>{item.label}</span><span className="text-muted-foreground">{item.score} / {item.max}점</span></div>
                  <Progress aria-label={`${item.label} 점수`} value={item.max ? item.score / item.max * 100 : 0} className="h-2" />
                </div>
              ))}
            </section>
            <div className="space-y-2"><h2 className="font-semibold">오늘의 약속</h2><p className="text-muted-foreground leading-relaxed">개인정보는 꼭 필요한 만큼만,<br />AI의 답은 확인하고, 다른 사람을 존중해요.</p></div>
            <Button variant="outline" onClick={() => { reset(); setName(''); }} className="w-full h-12"><RotateCcw /> 다시 체험하기</Button>
          </div>
        ) : mission ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{stage === 'feedback' ? '선택 돌아보기' : '오늘의 미션'}</span><span>{index + 1} / {trialMissions.length}</span></div>
              <Progress value={(index + (stage === 'feedback' ? 1 : 0)) / trialMissions.length * 100} className="h-1.5" />
            </div>
            <div className="pt-4 space-y-4">
              <div className={`flex items-center gap-2 text-sm ${category?.color}`}><Icon className="size-5" />{category?.label}</div>
              <h1 className="text-2xl font-bold leading-snug">{mission.title}</h1>
              <p className="text-foreground/90 text-lg leading-relaxed">{mission.situation}</p>
            </div>
            {stage === 'mission' ? (
              <div className="space-y-3 pt-2">
                {mission.options.map((choice) => (
                  <Button key={choice.id} variant="outline" onClick={() => choose(choice.id)} className="w-full h-auto min-h-16 p-4 justify-start text-left whitespace-normal leading-relaxed hover:bg-primary/10 hover:text-foreground hover:border-primary">
                    <span className="shrink-0 text-primary font-bold mr-1">{choice.id}</span><span>{choice.text}</span>
                  </Button>
                ))}
              </div>
            ) : option ? (
              <div className="space-y-5">
                <div className="border-y border-border py-5 space-y-4">
                  <div className={`flex items-center justify-between gap-3 ${option.score === 2 ? 'text-primary' : 'text-warning'}`}>
                    <h2 className="flex items-center gap-2 font-semibold">{option.score === 2 ? <Check className="size-5" /> : <CircleAlert className="size-5" />}{option.score === 2 ? '바른 선택' : option.score === 1 ? '다시 생각해볼 선택' : '위험한 선택'}</h2>
                    <span className="text-sm shrink-0">{option.score} / 2점</span>
                  </div>
                  <p className="text-sm text-muted-foreground">나의 선택: {option.text}</p>
                  <p className="leading-relaxed">{mission.feedback.correct}</p>
                </div>
                <div className="space-y-2"><h3 className="text-sm font-semibold text-primary">이렇게 실천해요</h3><p className="text-sm text-muted-foreground leading-relaxed">{mission.feedback.alternative}</p></div>
                <Button onClick={next} className="w-full h-12">{index === trialMissions.length - 1 ? '결과 보기' : '다음 미션'}<ArrowRight /></Button>
              </div>
            ) : null}
          </div>
        ) : <Button onClick={reset}>처음으로</Button>}
      </main>
      <footer className="mx-auto w-full max-w-xl px-6 pb-6 pt-4 text-xs text-muted-foreground">ETHICS PICK · AI를 바르게 쓰는 선택</footer>
    </div>
  );
}