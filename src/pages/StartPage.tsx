import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';

const StartPage = () => {
  const navigate = useNavigate();
  const { setNickname, setClassCode, setSessionId, setCurrentStep } = useSession();
  const [nickname, setNicknameLocal] = useState('');
  const [classCode, setClassCodeLocal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      // Create session in database
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          nickname: nickname || null,
          class_code: classCode || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setSessionId(data.id);
      setNickname(nickname);
      setClassCode(classCode);
      setCurrentStep('pre-survey');
      
      navigate('/pre-survey');
    } catch (error) {
      console.error('Failed to create session:', error);
      // Continue anyway with local storage only
      setNickname(nickname);
      setClassCode(classCode);
      setCurrentStep('pre-survey');
      navigate('/pre-survey');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary glow-primary mb-4">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-primary">Ethics</span>
            <span className="text-accent"> Pick</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            AI 윤리 선택 시뮬레이터
          </p>
        </div>

        {/* Message Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <p className="text-center text-foreground/90 leading-relaxed">
              오늘 우리는 AI를 <span className="text-primary font-semibold">'똑똑하게'</span>가 아니라{' '}
              <span className="text-accent font-semibold">'바르게'</span> 쓰는 연습을 합니다.
            </p>
          </CardContent>
        </Card>

        {/* Input Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">닉네임 (선택)</label>
            <Input
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNicknameLocal(e.target.value)}
              className="h-12 text-base bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">학급 코드 (선택)</label>
            <Input
              placeholder="선생님이 알려준 학급 코드"
              value={classCode}
              onChange={(e) => setClassCodeLocal(e.target.value)}
              className="h-12 text-base bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity glow-primary"
        >
          {isLoading ? '시작하는 중...' : '시작하기'}
        </Button>

        {/* Teacher Dashboard Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/teacher')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            교사용 대시보드 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
