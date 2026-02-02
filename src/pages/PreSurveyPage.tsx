import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSession } from '@/hooks/useSession';
import { surveyQuestions } from '@/data/surveyQuestions';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle } from 'lucide-react';

const PreSurveyPage = () => {
  const navigate = useNavigate();
  const { sessionId, addPreSurveyAnswer, preSurveyAnswers, setCurrentStep } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / surveyQuestions.length) * 100;

  const handleAnswer = async (answer: boolean) => {
    setSelectedAnswer(answer);
    setIsSubmitting(true);

    try {
      // Save to database
      if (sessionId) {
        await supabase.from('pre_survey_responses').insert({
          session_id: sessionId,
          question_number: currentQuestion.id,
          answer: answer ? 1 : 0,
        });
      }

      // Save locally
      addPreSurveyAnswer(currentQuestionIndex, answer ? 1 : 0);

      // Move to next question or page
      setTimeout(() => {
        if (currentQuestionIndex < surveyQuestions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
        } else {
          setCurrentStep('mission');
          navigate('/mission/1');
        }
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      console.error('Failed to save survey response:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Progress Header */}
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">사전 진단</span>
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {surveyQuestions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-center leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswer(true)}
                disabled={isSubmitting}
                variant={selectedAnswer === true ? 'default' : 'outline'}
                className={`h-20 text-xl font-bold transition-all ${
                  selectedAnswer === true
                    ? 'bg-success text-success-foreground border-success glow-primary'
                    : 'hover:border-success hover:text-success'
                }`}
              >
                <CheckCircle className="w-6 h-6 mr-2" />O
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                disabled={isSubmitting}
                variant={selectedAnswer === false ? 'default' : 'outline'}
                className={`h-20 text-xl font-bold transition-all ${
                  selectedAnswer === false
                    ? 'bg-destructive text-destructive-foreground border-destructive'
                    : 'hover:border-destructive hover:text-destructive'
                }`}
              >
                <XCircle className="w-6 h-6 mr-2" />X
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreSurveyPage;
