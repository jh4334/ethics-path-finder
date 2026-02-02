import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSession } from '@/hooks/useSession';
import { missions } from '@/data/missions';
import { supabase } from '@/integrations/supabase/client';

const MissionPage = () => {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const { sessionId, addMissionResponse, setCurrentStep } = useSession();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const missionIndex = parseInt(missionId || '1') - 1;
  const mission = missions[missionIndex];
  const progress = ((missionIndex) / missions.length) * 100;

  if (!mission) {
    navigate('/post-survey');
    return null;
  }

  const handleSelect = async (optionId: string) => {
    setSelectedOption(optionId);
    setIsSubmitting(true);

    const option = mission.options.find((o) => o.id === optionId);
    if (!option) return;

    try {
      // Save to database
      if (sessionId) {
        await supabase.from('mission_responses').insert({
          session_id: sessionId,
          mission_number: mission.id,
          selected_option: optionId,
          score: option.score,
        });
      }

      // Save locally
      addMissionResponse(mission.id, optionId, option.score);

      // Navigate to feedback page
      setTimeout(() => {
        navigate(`/mission/${missionId}/feedback`);
        setIsSubmitting(false);
      }, 300);
    } catch (error) {
      console.error('Failed to save mission response:', error);
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'privacy':
        return 'text-privacy';
      case 'fairness':
        return 'text-fairness';
      case 'transparency':
        return 'text-transparency';
      case 'responsibility':
        return 'text-responsibility';
      default:
        return 'text-primary';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'privacy':
        return '개인정보';
      case 'fairness':
        return '공정성';
      case 'transparency':
        return '투명성';
      case 'responsibility':
        return '책임';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Progress Header */}
      <div className="w-full max-w-lg mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">시나리오 미션</span>
          <span className="text-sm text-muted-foreground">
            {missionIndex + 1} / {missions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Mission Card */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-lg border-border/50 bg-card/80 backdrop-blur animate-fade-in">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full bg-secondary ${getCategoryColor(
                  mission.category
                )}`}
              >
                {getCategoryLabel(mission.category)}
              </span>
              <span className="text-sm text-muted-foreground">미션 {missionIndex + 1}/{missions.length}</span>
            </div>
            {mission.context && (
              <p className="text-sm text-muted-foreground mb-2 italic">💬 {mission.context}</p>
            )}
            <CardTitle className="text-lg leading-relaxed">{mission.situation}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mission.options.map((option) => (
              <Button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={isSubmitting}
                variant="outline"
                className={`w-full h-auto min-h-16 p-4 text-left justify-start whitespace-normal transition-all ${
                  selectedOption === option.id
                    ? 'border-primary bg-primary/10'
                    : 'hover:border-primary/50'
                }`}
              >
                <span className="font-bold text-primary mr-3">{option.id}</span>
                <span className="flex-1">{option.text}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissionPage;
