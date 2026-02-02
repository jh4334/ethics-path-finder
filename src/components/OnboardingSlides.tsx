import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Brain, Shield, Users, Lightbulb } from 'lucide-react';

interface OnboardingSlidesProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Brain,
    title: "AI와 함께하는 시대",
    description: "우리는 매일 AI를 사용합니다.\n검색, 번역, 추천... 하지만 잘 쓰고 있을까요?",
    color: "from-primary to-primary/60",
  },
  {
    icon: Shield,
    title: "바르게 쓰는 연습",
    description: "AI를 '똑똑하게'가 아니라\n'바르게' 쓰는 방법을 배워봅시다.",
    color: "from-accent to-accent/60",
  },
  {
    icon: Users,
    title: "시나리오 미션",
    description: "실제 상황과 비슷한 12개의 미션에서\n윤리적인 선택을 해보세요.",
    color: "from-primary to-accent",
  },
  {
    icon: Lightbulb,
    title: "나만의 윤리 역량",
    description: "개인정보, 공정성, 투명성, 책임\n4가지 역량을 측정하고 성장해요!",
    color: "from-accent to-primary",
  },
];

const OnboardingSlides = ({ onComplete }: OnboardingSlidesProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background animated gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r ${slides[currentSlide].color} opacity-20 blur-3xl`}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: '10%', left: '20%' }}
        />
        <motion.div
          className={`absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r ${slides[currentSlide].color} opacity-15 blur-3xl`}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Skip button */}
      <button
        onClick={skipOnboarding}
        className="absolute top-6 right-6 text-sm text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        건너뛰기
      </button>

      {/* Progress dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary w-8' 
                : index < currentSlide 
                  ? 'bg-primary/50 w-2' 
                  : 'bg-muted w-2'
            }`}
            initial={false}
            animate={{
              width: index === currentSlide ? 32 : 8,
            }}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center space-y-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.5, 
                type: "spring",
                stiffness: 200 
              }}
              className="inline-flex"
            >
              <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center shadow-2xl`}>
                {(() => {
                  const Icon = slides[currentSlide].icon;
                  return <Icon className="w-14 h-14 text-primary-foreground" />;
                })()}
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold tracking-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md"
      >
        <Button
          onClick={nextSlide}
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity glow-primary group"
        >
          {currentSlide < slides.length - 1 ? (
            <>
              다음
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          ) : (
            '시작하기'
          )}
        </Button>
      </motion.div>

      {/* Slide number indicator */}
      <div className="mt-4 text-sm text-muted-foreground">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default OnboardingSlides;
