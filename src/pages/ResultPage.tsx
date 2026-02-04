import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSession } from '@/hooks/useSession';
import { missions, competencyMissions } from '@/data/missions';
import { surveyQuestions } from '@/data/surveyQuestions';
import { competencyDescriptions } from '@/data/competencyDescriptions';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Scale, Eye, Heart, ArrowUp, ArrowDown, Minus, Trophy, RefreshCw, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ResultPage = () => {
  const navigate = useNavigate();
  const { sessionId, missionResponses, preSurveyAnswers, postSurveyAnswers, nickname, pledge, setPledge, resetSession } = useSession();
  const [pledgeInput, setPledgeInput] = useState(pledge);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [expandedCompetency, setExpandedCompetency] = useState<string | null>(null);
  const [showSurveyDetails, setShowSurveyDetails] = useState(false);

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

  const getScoreTip = (category: string, percentage: number) => {
    const desc = competencyDescriptions[category];
    if (!desc) return '';
    return percentage >= 70 ? desc.highScoreTip : desc.lowScoreTip;
  };

  const CompetencyBar = ({
    category,
    label,
    icon: Icon,
    data,
    colorClass,
  }: {
    category: string;
    label: string;
    icon: React.ElementType;
    data: { score: number; max: number; percentage: number };
    colorClass: string;
  }) => {
    const isExpanded = expandedCompetency === category;
    const desc = competencyDescriptions[category];

    return (
      <Collapsible 
        open={isExpanded} 
        onOpenChange={(open) => setExpandedCompetency(open ? category : null)}
      >
        <div className="space-y-2">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between cursor-pointer hover:bg-secondary/30 rounded-lg p-2 -m-2 transition-colors">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${colorClass}`} />
                <span className="font-medium">{label}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <span className={`font-bold ${colorClass}`}>
                {data.score}/{data.max}
              </span>
            </div>
          </CollapsibleTrigger>
          
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out rounded-full`}
              style={{
                width: `${data.percentage}%`,
                background: `hsl(var(--${colorClass.replace('text-', '')}))`,
              }}
            />
          </div>

          <CollapsibleContent>
            {desc && (
              <div className="mt-3 p-4 bg-secondary/30 rounded-lg space-y-3 animate-fade-in">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{desc.emoji}</span>
                  <div>
                    <p className="font-medium text-foreground">{desc.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">{desc.importance}</p>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${data.percentage >= 70 ? 'bg-success/10' : 'bg-warning/10'}`}>
                  <p className={`text-sm font-medium ${data.percentage >= 70 ? 'text-success' : 'text-warning'}`}>
                    💡 {getScoreTip(category, data.percentage)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">실천 예시:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {desc.examples.map((ex, idx) => (
                      <li key={idx}>• {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

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
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">역량별 점수</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Info className="w-3 h-3" />
                <span>클릭하면 상세 설명</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CompetencyBar
              category="privacy"
              label="개인정보 보호 (Privacy)"
              icon={Shield}
              data={competencies.privacy}
              colorClass="text-privacy"
            />
            <CompetencyBar
              category="fairness"
              label="공정성 (Fairness)"
              icon={Scale}
              data={competencies.fairness}
              colorClass="text-fairness"
            />
            <CompetencyBar
              category="transparency"
              label="투명성 (Transparency)"
              icon={Eye}
              data={competencies.transparency}
              colorClass="text-transparency"
            />
            <CompetencyBar
              category="responsibility"
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
            <CollapsibleTrigger 
              className="w-full"
              onClick={() => setShowSurveyDetails(!showSurveyDetails)}
            >
              <div className="flex items-center justify-between cursor-pointer">
                <CardTitle className="text-lg">사전 → 사후 변화</CardTitle>
                {showSurveyDetails ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CardContent className="space-y-3">
            {surveyQuestions.map((q, index) => {
              const change = getSurveyChange(index);
              const pre = preSurveyAnswers[index];
              const post = postSurveyAnswers[index];
              const correct = q.correctAnswer ? 1 : 0;
              
              return (
                <div key={q.id} className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
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
                  
                  {showSurveyDetails && (
                    <div className="ml-8 p-3 bg-secondary/30 rounded-lg animate-fade-in">
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <span className={pre === correct ? 'text-success' : 'text-destructive'}>
                          사전: {pre === 1 ? 'O' : 'X'}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className={post === correct ? 'text-success' : 'text-destructive'}>
                          사후: {post === 1 ? 'O' : 'X'}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          (정답: {q.correctAnswer ? 'O' : 'X'})
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {q.explanation}
                      </p>
                      {change === 'improved' && (
                        <p className="text-xs text-success font-medium mt-2">
                          🎉 잘했어요! 미션을 통해 올바른 이해를 했네요!
                        </p>
                      )}
                    </div>
                  )}
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
