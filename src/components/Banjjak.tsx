import { GAUGE_MAX } from '@/data/trial';

const sparkle = (x: number, y: number, r: number) =>
  `M ${x} ${y - r} L ${x + r * 0.3} ${y - r * 0.3} L ${x + r} ${y} L ${x + r * 0.3} ${y + r * 0.3} L ${x} ${y + r} L ${x - r * 0.3} ${y + r * 0.3} L ${x - r} ${y} L ${x - r * 0.3} ${y - r * 0.3} Z`;

// 반짝이의 표정은 믿음, 안테나 불빛은 편리함을 따라간다. 이미지 없이 그려서 어떤 값에도 대응한다.
export function Banjjak({ trust, ease, className = '' }: { trust: number; ease: number; className?: string }) {
  const happy = trust >= 7;
  const sad = trust <= 3;
  const mood = happy ? '기뻐요' : sad ? '시무룩해요' : '지켜보고 있어요';
  const smile = (trust - GAUGE_MAX / 2) * 2.4;
  const moving = { transition: 'all 0.6s ease' };

  return (
    <svg viewBox="0 0 96 96" role="img" aria-label={`반짝이가 ${mood}`} className={`${sad ? 'text-muted-foreground' : 'text-primary'} transition-colors duration-500 ${className}`}>
      <circle cx="48" cy="50" r="44" fill="currentColor" style={{ ...moving, opacity: trust / GAUGE_MAX * 0.22 }} />
      <line x1="48" y1="15" x2="48" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="48" cy="11" r="5" className="text-warning" fill="currentColor" style={{ ...moving, opacity: 0.25 + ease / GAUGE_MAX * 0.75 }} />
      <rect x="18" y="24" width="60" height="52" rx="18" fill="hsl(var(--card))" stroke="currentColor" strokeWidth="3" />
      {sad && <path d="M 30 42 L 41 38 M 66 42 L 55 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />}
      <circle cx="36" cy="47" r={sad ? 4 : 5} fill="currentColor" />
      <circle cx="60" cy="47" r={sad ? 4 : 5} fill="currentColor" />
      {happy && <><circle cx="37.8" cy="45.2" r="1.8" fill="hsl(var(--card))" /><circle cx="61.8" cy="45.2" r="1.8" fill="hsl(var(--card))" /></>}
      {happy && <><circle cx="28" cy="58" r="4" fill="currentColor" opacity="0.25" /><circle cx="68" cy="58" r="4" fill="currentColor" opacity="0.25" /></>}
      <path d={`M 38 62 Q 48 ${62 + smile} 58 62`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={moving} />
      {trust <= 1 && <path d="M 64 53 Q 61 59 64 61 Q 67 59 64 53 Z" fill="currentColor" />}
      {happy && <path d={sparkle(11, 24, 6)} fill="currentColor" className="animate-pulse" />}
      {trust >= 9 && <path d={sparkle(86, 34, 5)} fill="currentColor" className="animate-pulse" />}
    </svg>
  );
}
