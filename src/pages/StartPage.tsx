import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';
import OnboardingSlides from '@/components/OnboardingSlides';

const StartPage = () => {
  const navigate = useNavigate();
  const { setNickname, setClassCode, setSessionId, setCurrentStep } = useSession();
  const [nickname, setNicknameLocal] = useState('');
  const [classCode, setClassCodeLocal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has already seen onboarding
    const seen = localStorage.getItem('ethics-pick-onboarding-seen');
    if (seen === 'true') {
      setShowOnboarding(false);
      setHasSeenOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('ethics-pick-onboarding-seen', 'true');
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

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

  // Show onboarding slides
  if (showOnboarding) {
    return <OnboardingSlides onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: '5%', left: '10%' }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-accent/15 to-primary/15 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: '15%', right: '5%' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary glow-primary mb-4"
          >
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-primary">Ethics</span>
            <span className="text-accent"> Pick</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            AI 윤리 선택 시뮬레이터
          </p>
        </motion.div>

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <p className="text-center text-foreground/90 leading-relaxed">
                오늘 우리는 AI를 <span className="text-primary font-semibold">'똑똑하게'</span>가 아니라{' '}
                <span className="text-accent font-semibold">'바르게'</span> 쓰는 연습을 합니다.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="space-y-4"
        >
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
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity glow-primary"
          >
            {isLoading ? '시작하는 중...' : '시작하기'}
          </Button>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-center space-y-2"
        >
          {hasSeenOnboarding && (
            <button
              onClick={() => setShowOnboarding(true)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
            >
              앱 소개 다시 보기
            </button>
          )}
          <button
            onClick={() => navigate('/teacher')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            교사용 대시보드 →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StartPage;
