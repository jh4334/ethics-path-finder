import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/hooks/useSession';
import { missions } from '@/data/missions';
import { CheckCircle, AlertCircle, ArrowRight, Lightbulb, Newspaper } from 'lucide-react';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const { missionResponses, setCurrentStep } = useSession();

  const missionIndex = parseInt(missionId || '1') - 1;
  const mission = missions[missionIndex];
  const response = missionResponses.find((r) => r.missionId === mission?.id);

  if (!mission || !response) {
    navigate('/mission/1');
    return null;
  }

  const selectedOption = mission.options.find((o) => o.id === response.option);
  const correctOption = mission.options.find((o) => o.isCorrect);
  const isCorrect = selectedOption?.isCorrect;

  const handleNext = () => {
    const nextMissionIndex = missionIndex + 1;
    if (nextMissionIndex < missions.length) {
      navigate(`/mission/${nextMissionIndex + 1}`);
    } else {
      setCurrentStep('post-survey');
      navigate('/post-survey');
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 2) return 'text-success';
    if (score === 1) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score === 2) return '최고의 선택!';
    if (score === 1) return '괜찮은 선택';
    return '아쉬운 선택';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-lg space-y-6">
        {/* Score Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur text-center">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              {isCorrect ? (
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-warning" />
                </div>
              )}
            </div>
            <CardTitle className={`text-2xl ${getScoreColor(response.score)}`}>
              {getScoreLabel(response.score)}
            </CardTitle>
            <p className="text-muted-foreground">
              윤리 점수: <span className={`font-bold ${getScoreColor(response.score)}`}>{response.score}점</span>
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 text-lg">
              <span className="text-muted-foreground">나의 선택:</span>
              <span className="font-bold text-primary">{response.option}</span>
              <span>- {selectedOption?.text}</span>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Card */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-primary mb-2">왜 이게 더 나은 선택일까요?</h3>
                <p className="text-foreground/90 leading-relaxed">{mission.feedback.correct}</p>
              </div>
            </div>
            {!isCorrect && correctOption && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-success">더 좋은 선택:</span>{' '}
                  {correctOption.id} - {correctOption.text}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real Case Card - 실제 사례 */}
        {mission.realCase && (
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Newspaper className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-accent mb-2">📰 알고 계셨나요?</h3>
                  <p className="text-foreground/90 text-sm leading-relaxed">{mission.realCase}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alternative Tip */}
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium">실천 팁:</span> {mission.feedback.alternative}
          </p>
        </div>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity"
        >
          {missionIndex < missions.length - 1 ? '다음 미션' : '사후 진단으로'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FeedbackPage;
