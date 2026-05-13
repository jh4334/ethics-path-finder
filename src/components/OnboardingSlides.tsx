import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Brain, Shield, Users, Lightbulb, Lock, Scale, Eye, Heart } from 'lucide-react';

interface OnboardingSlidesProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Brain,
    title: "AI와 함께하는 시대",
    description: "우리는 매일 AI를 사용합니다.\n검색, 번역, 추천, 그림 생성까지!\n하지만 '잘' 쓰고 있을까요?",
    subText: "💡 AI를 많이 쓸수록, 바르게 쓰는 법도 알아야 해요",
    color: "from-primary to-primary/60",
  },
  {
    icon: Shield,
    title: "4가지 AI 윤리 역량",
    description: "AI를 '똑똑하게'가 아니라\n'바르게' 쓰는 4가지 핵심 역량을 배워요.",
    competencies: [
      { icon: Lock, label: "개인정보 보호", desc: "내 정보를 안전하게" },
      { icon: Scale, label: "공정성", desc: "모두에게 평등하게" },
      { icon: Eye, label: "투명성", desc: "AI의 한계 이해하기" },
      { icon: Heart, label: "책임감", desc: "AI 사용에 책임지기" },
    ],
    color: "from-accent to-accent/60",
  },
  {
    icon: Users,
    title: "시나리오 미션",
    description: "실제 상황과 비슷한 14개의 미션에서\n윤리적인 선택을 해보세요.",
    examples: [
      "📱 친구 사진을 SNS에 올려도 될까?",
      "🤖 AI 숙제 답을 그대로 제출해도 될까?",
      "🎨 AI 그림을 내 작품이라고 해도 될까?",
    ],
    color: "from-primary to-accent",
  },
  {
    icon: Lightbulb,
    title: "나만의 윤리 프로필",
    description: "미션을 마치면 나의 AI 윤리 역량을\n4가지 영역으로 분석해드려요!",
    subText: "✨ 부족한 부분은 어떻게 개선할지 팁도 알려드려요",
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

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background animated gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r ${currentSlideData.color} opacity-20 blur-3xl`}
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
          className={`absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r ${currentSlideData.color} opacity-15 blur-3xl`}
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
            className="text-center space-y-6"
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
              <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${currentSlideData.color} flex items-center justify-center shadow-2xl`}>
                {(() => {
                  const Icon = currentSlideData.icon;
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
                {currentSlideData.title}
              </h2>
              <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
                {currentSlideData.description}
              </p>
              
              {/* Competencies grid (slide 2) */}
              {'competencies' in currentSlideData && currentSlideData.competencies && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="grid grid-cols-2 gap-3 pt-2"
                >
                  {currentSlideData.competencies.map((comp, idx) => (
                    <div 
                      key={idx}
                      className="bg-card/50 backdrop-blur border border-border/50 rounded-lg p-3 text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <comp.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{comp.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{comp.desc}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Examples list (slide 3) */}
              {'examples' in currentSlideData && currentSlideData.examples && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="space-y-2 pt-2"
                >
                  {currentSlideData.examples.map((example, idx) => (
                    <div 
                      key={idx}
                      className="bg-card/50 backdrop-blur border border-border/50 rounded-lg px-4 py-2 text-sm text-left"
                    >
                      {example}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Sub text */}
              {'subText' in currentSlideData && currentSlideData.subText && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="text-sm text-primary/80 font-medium pt-2"
                >
                  {currentSlideData.subText}
                </motion.p>
              )}
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
