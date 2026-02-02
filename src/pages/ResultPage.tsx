import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSession } from '@/hooks/useSession';
import { missions, competencyMissions } from '@/data/missions';
import { surveyQuestions } from '@/data/surveyQuestions';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Scale, Eye, Heart, ArrowUp, ArrowDown, Minus, Trophy, RefreshCw } from 'lucide-react';

const ResultPage = () => {
  const navigate = useNavigate();
  const { sessionId, missionResponses, preSurveyAnswers, postSurveyAnswers, nickname, pledge, setPledge, resetSession } = useSession();
  const [pledgeInput, setPledgeInput] = useState(pledge);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Calculate competency scores
  const calculateCompetencyScore = (category: keyof typeof competencyMissions) => {
    const missionIds = competencyMissions[category];
    const relevantResponses = missionResponses.filter((r) => missionIds.includes(r.missionId));
    const totalScore = relevantResponses.reduce((sum, r) => sum + r.score, 0);
    const maxScore = missionIds.length * 2;
    return { score: totalScore, max: maxScore, percentage: (totalScore / maxScore) * 100 };
  };

  const competencies = {
    privacy: calculateCompetencyScore('privacy'),
    fairness: calculateCompetencyScore('fairness'),
    transparency: calculateCompetencyScore('transparency'),
    responsibility: calculateCompetencyScore('responsibility'),
  };

  // Total mission score
  const totalScore = missionResponses.reduce((sum, r) => sum + r.score, 0);
  const maxTotalScore = missions.length * 2;

  // Find hardest mission (lowest score)
  const hardestMission = missionResponses.length > 0
    ? missionResponses.reduce((min, r) => (r.score < min.score ? r : min), missionResponses[0])
    : null;
  const hardestMissionData = hardestMission
    ? missions.find((m) => m.id === hardestMission.missionId)
    : null;

  // Survey change comparison
  const getSurveyChange = (questionIndex: number) => {
    const pre = preSurveyAnswers[questionIndex];
    const post = postSurveyAnswers[questionIndex];
    const correct = surveyQuestions[questionIndex].correctAnswer ? 1 : 0;
    
    if (pre === undefined || post === undefined) return 'same';
    if (pre !== correct && post === correct) return 'improved';
    if (pre === correct && post !== correct) return 'declined';
    return 'same';
  };

  const handleSavePledge = async () => {
    if (!pledgeInput.trim()) return;
    
    setIsSaving(true);
    try {
      if (sessionId) {
        await supabase.from('pledges').insert({
          session_id: sessionId,
          pledge_text: pledgeInput.trim(),
        });
      }
      setPledge(pledgeInput.trim());
      setIsSaved(true);
    } catch (error) {
      console.error('Failed to save pledge:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestart = () => {
    resetSession();
    navigate('/');
  };

  const CompetencyBar = ({
    label,
    icon: Icon,
    data,
    colorClass,
  }: {
    label: string;
    icon: React.ElementType;
    data: { score: number; max: number; percentage: number };
    colorClass: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colorClass}`} />
          <span className="font-medium">{label}</span>
        </div>
        <span className={`font-bold ${colorClass}`}>
          {data.score}/{data.max}
        </span>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out rounded-full`}
          style={{
            width: `${data.percentage}%`,
            background: `hsl(var(--${colorClass.replace('text-', '')}))`,
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 pb-20 animate-fade-in">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">
            {nickname ? `${nickname}님의` : '나의'} 윤리 프로필
          </h1>
          <p className="text-muted-foreground">
            총점: <span className="text-primary font-bold">{totalScore}</span> / {maxTotalScore}점
          </p>
        </div>

        {/* Competency Chart */}
        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">역량별 점수</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CompetencyBar
              label="개인정보 보호 (Privacy)"
              icon={Shield}
              data={competencies.privacy}
              colorClass="text-privacy"
            />
            <CompetencyBar
              label="공정성 (Fairness)"
              icon={Scale}
              data={competencies.fairness}
              colorClass="text-fairness"
            />
            <CompetencyBar
              label="투명성 (Transparency)"
              icon={Eye}
              data={competencies.transparency}
              colorClass="text-transparency"
            />
            <CompetencyBar
              label="책임감 (Responsibility)"
              icon={Heart}
              data={competencies.responsibility}
              colorClass="text-responsibility"
            />
          </CardContent>
        </Card>

        {/* Survey Change */}
        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">사전 → 사후 변화</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {surveyQuestions.map((q, index) => {
              const change = getSurveyChange(index);
              return (
                <div key={q.id} className="flex items-center gap-3 text-sm">
                  {change === 'improved' && (
                    <ArrowUp className="w-5 h-5 text-success flex-shrink-0" />
                  )}
                  {change === 'declined' && (
                    <ArrowDown className="w-5 h-5 text-destructive flex-shrink-0" />
                  )}
                  {change === 'same' && (
                    <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="text-muted-foreground line-clamp-1">{q.question}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Hardest Mission */}
        {hardestMissionData && hardestMission && hardestMission.score < 2 && (
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-warning mb-2">🤔 내가 어려웠던 문항</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">미션 {hardestMissionData.id}:</span>{' '}
                {hardestMissionData.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                💡 팁: {hardestMissionData.feedback.alternative}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pledge Input */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-primary">✍️ 나의 실천 약속</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="앞으로 AI를 사용할 때 지킬 약속을 적어보세요"
              value={pledgeInput}
              onChange={(e) => setPledgeInput(e.target.value)}
              disabled={isSaved}
              className="bg-background/50"
            />
            <Button
              onClick={handleSavePledge}
              disabled={isSaving || isSaved || !pledgeInput.trim()}
              className="w-full"
              variant={isSaved ? 'secondary' : 'default'}
            >
              {isSaved ? '저장 완료! ✓' : isSaving ? '저장 중...' : '약속 저장하기'}
            </Button>
          </CardContent>
        </Card>

        {/* Restart Button */}
        <Button
          onClick={handleRestart}
          variant="outline"
          className="w-full h-12"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          처음부터 다시하기
        </Button>
      </div>
    </div>
  );
};

export default ResultPage;
