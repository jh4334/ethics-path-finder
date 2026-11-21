import type { JSX, ReactNode } from 'react';
import type { OptionId } from '@/data/trial';

const teal = 'hsl(var(--primary))';
const amber = 'hsl(var(--warning))';
const red = 'hsl(var(--destructive))';
const ink = 'hsl(var(--foreground))';
const pencil = 'hsl(var(--muted-foreground))';
const muted = 'hsl(var(--muted))';
const paper = 'hsl(var(--card))';
const violet = 'hsl(var(--fairness))';
const blue = 'hsl(var(--transparency))';

type Point = { x: number; y: number };

function Spark({ x, y }: Point) {
  return <path transform={`translate(${x} ${y})`} d="M0-8 2-2 8 0 2 2 0 8-2 2-8 0-2-2Z" fill={teal} stroke="none" />;
}

function Check({ x, y }: Point) {
  return <path transform={`translate(${x} ${y})`} d="m-7 0 5 5 10-11" stroke={teal} />;
}

function Kid({ x, y, color = teal, mood = 'happy', ponytail, look = 0, children }: Point & {
  color?: string;
  mood?: 'happy' | 'uneasy' | 'cry' | 'blush' | 'quiet';
  ponytail?: boolean;
  look?: number;
  children?: ReactNode;
}) {
  const mouth = { happy: 'M-5 6q5 6 10 0', quiet: 'M-4 7h8', uneasy: 'M-4 8q4-4 8-1', cry: 'M-5 9q5-8 10 0', blush: 'M-3 8h6' };
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-23 51v-7q0-22 23-22t23 22v7q-21 4-46 0Z" fill={muted} stroke={color} />
      <path d="M-8 24q8 10 16 0" stroke={color} />
      {ponytail && <path d="M13-16q20-9 18 9l-1 16q-16-3-12-17Z" fill={color} stroke={color} />}
      <circle r="21" fill={paper} stroke={pencil} />
      <g transform={`translate(${look} 0)`}>
        <g fill={ink} stroke="none"><circle cx="-7" cy="-2" r="2.5" /><circle cx="7" cy="-2" r="2.5" /></g>
        <path d={mouth[mood]} stroke={ink} />
      </g>
      {mood === 'cry' && <path d="M-10 2q-8 11-2 12t2-12Z" fill={blue} stroke="none" />}
      {mood === 'blush' && <g fill={red} stroke="none"><ellipse cx="-13" cy="5" rx="5" ry="3" /><ellipse cx="13" cy="5" rx="5" ry="3" /></g>}
      {children}
    </g>
  );
}

function RobotHead({ x, y, color = teal }: Point & { color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={color}>
      <path d="M0-30v7" /><circle cy="-33" r="4" fill={amber} stroke="none" />
      <rect x="-26" y="-23" width="52" height="45" rx="15" fill={paper} />
      <g fill={color} stroke="none"><circle cx="-10" cy="-3" r="4" /><circle cx="10" cy="-3" r="4" /></g>
      <path d="M-8 9q8 9 16 0" />
    </g>
  );
}

function Phone({ x, y, children }: Point & { children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-29" y="-49" width="58" height="98" rx="11" fill={paper} stroke={pencil} />
      <path d="M-7-41H7M-6 40H6" stroke={pencil} />{children}
    </g>
  );
}

function Bubble({ x, y, color = pencil, children }: Point & { color?: string; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-16-15h32q8 0 8 8V5q0 8-8 8H-4l-12 8v-8q-8 0-8-8V-7q0-8 8-8Z" fill={paper} stroke={color} />
      {children}
    </g>
  );
}

function Mark({ children }: { children: string }) {
  return <text y="6" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="18" fill={ink} stroke="none">{children}</text>;
}

function House() {
  return <path d="m-10-1 10-8 10 8m-17-2V8H7V-3M0 8V3" stroke={amber} />;
}

function Poster({ x, y, labeled }: Point & { labeled?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="64" height="74" rx="5" fill={paper} stroke={pencil} />
      <rect x="23" y="-4" width="18" height="8" rx="3" fill={pencil} stroke="none" />
      <circle cx="44" cy="24" r="6" fill={amber} stroke="none" />
      <path d="m9 49 14-22 9 13 5-7 16 16Z" fill={muted} stroke={blue} />
      {labeled && <g transform="translate(45 63)"><rect x="-15" y="-10" width="30" height="20" rx="5" fill={muted} stroke={teal} /><Mark>AI</Mark></g>}
    </g>
  );
}

function News({ x, y, children }: Point & { children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M90 17h9v57q0 8-8 8H10" fill={muted} stroke={pencil} />
      <rect width="90" height="82" rx="5" fill={paper} stroke={pencil} />
      <path d="M10 13h70M10 22h70M60 36h19M60 46h19M60 56h13M10 72h68" stroke={pencil} />{children}
    </g>
  );
}

function Snail({ x, y }: Point) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={pencil}>
      <path d="M-21 6q9 2 16 0Q4 8 9-3q6-9 11-2 5 16-13 17h-19q-8 0-9-6Z" fill={muted} />
      <path d="m12-5-1-7m7 7 3-8" /><circle cx="-6" cy="0" r="10" fill={paper} stroke={amber} />
      <path d="M-10 2q-3-7 3-7 6 0 4 5" stroke={amber} />
    </g>
  );
}

function ErasedVideo() {
  return <><rect x="-20" y="-20" width="40" height="32" rx="5" fill={muted} stroke={pencil} /><path d="m-4-12 11 8-11 7Z" fill={pencil} stroke="none" /><path d="m-17 12 34-32" stroke={teal} /></>;
}

type Scene = { label: string; drawing: JSX.Element };
const scenes: Record<number, Record<OptionId, Scene>> = {
  1: {
    A: {
      label: '밖으로 나온 별명표와 안전을 뜻하는 방패',
      drawing: <>
        <path d="M88 24q16 13 39 14v26q0 33-39 51-39-18-39-51V38q23-1 39-14Z" fill={muted} stroke={teal} />
        <Check x={88} y={67} />
        <g transform="translate(152 80) rotate(-10)">
          <rect x="-32" y="-19" width="65" height="38" rx="9" fill={paper} stroke={pencil} />
          <circle cx="-16" cy="-3" r="5" fill={teal} stroke="none" /><path d="M-24 9q8-10 16 0M0-3h21M0 6h12" stroke={pencil} />
        </g><Spark x={172} y={39} />
      </>,
    },
    B: {
      label: '생일 케이크 옆 휴대폰에 도착한 낯선 사람의 메시지',
      drawing: <>
        <rect x="39" y="74" width="72" height="32" rx="8" fill={muted} stroke={amber} />
        <path d="M40 83q8 11 17 1 9 10 18 0 9 10 18 0 9 9 17-1M33 109h85" stroke={amber} />
        <rect x="71" y="54" width="8" height="19" rx="3" fill={paper} stroke={amber} />
        <path d="M75 35q-14 17-2 17 12 0 2-17Z" fill={amber} stroke="none" />
        <Phone x={157} y={71} /><Bubble x={177} y={59} color={amber}><Mark>?</Mark></Bubble>
      </>,
    },
    C: {
      label: '집 주소가 담긴 말풍선이 단톡방 밖으로 퍼지는 모습',
      drawing: <>
        <Phone x={92} y={70} />
        <Bubble x={94} y={56}><House /></Bubble>
        <Bubble x={139} y={80} color={amber}><House /></Bubble>
        <Bubble x={177} y={43} color={red}><House /></Bubble>
      </>,
    },
  },
  4: {
    A: {
      label: '친구들이 웃으며 허락 표시가 있는 글을 건네는 모습',
      drawing: <>
        <Kid x={62} y={64}><path d="m13 37 23 4 12-9" stroke={teal} /></Kid>
        <Kid x={179} y={64} color={blue} ponytail><path d="m-12 36-21 5-11-7" stroke={blue} /></Kid>
        <g transform="translate(121 79) rotate(7)">
          <rect x="-17" y="-21" width="34" height="44" rx="4" fill={paper} stroke={teal} />
          <path d="M-9-11H9M-9-4H4" stroke={pencil} /><Check x={0} y={10} />
        </g><Spark x={114} y={37} />
      </>,
    },
    B: {
      label: '펼쳐진 비밀 일기를 보고 눈물을 흘리는 민지',
      drawing: <>
        <Kid x={75} y={64} color={pencil} mood="cry" look={3} />
        <path d="M111 57q20-8 43 4 22-12 44-4v49q-21-8-44 4-22-12-43-4Z" fill={paper} stroke={pencil} />
        <path d="M154 61v49M120 71q12-3 24 2M120 82q12-3 23 2M164 93q12-5 23-4" stroke={pencil} />
        <path d="M174 83q-15-9-9-15 4-3 9 2 6-8 11-2 4 6-11 15Z" fill={amber} stroke="none" />
      </>,
    },
    C: {
      label: '이름을 가린 글의 꽃 그림을 보고 주인을 알아본 친구',
      drawing: <>
        <Kid x={52} y={65} mood="quiet" color={pencil} look={3}><path d="m12 38 12-8 13-14 9-1" stroke={pencil} /></Kid>
        <rect x="94" y="34" width="48" height="68" rx="5" fill={paper} stroke={pencil} />
        <rect x="102" y="43" width="30" height="8" rx="3" fill={muted} stroke={pencil} strokeDasharray="3 5" />
        <path d="M103 62h29M103 71h17" stroke={pencil} />
        <Flower x={126} y={86} />
        <Kid x={182} y={65} color={amber} mood="uneasy" look={-3}><Flower x={0} y={39} /></Kid>
      </>,
    },
  },
  7: {
    A: {
      label: '로봇 동아리에서 반짝이와 함께 상을 받은 서연이',
      drawing: <>
        <RobotHead x={59} y={84} /><Kid x={136} y={59} ponytail />
        <g transform="translate(169 84)" stroke={amber}>
          <path d="M-15-9h-10q0 19 16 18M15-9h10q0 19-16 18" />
          <path d="M-16-14h32q0 30-16 30t-16-30Z" fill={muted} /><path d="M0 16v8m-11 2h22" />
        </g><Spark x={88} y={33} /><Spark x={198} y={54} />
      </>,
    },
    B: {
      label: '로봇 동아리 문을 등지고 지나가는 서연이',
      drawing: <>
        <rect x="48" y="24" width="68" height="91" rx="5" fill={muted} stroke={pencil} />
        <RobotHead x={82} y={65} color={pencil} /><circle cx="106" cy="98" r="3" fill={amber} stroke="none" />
        <g transform="translate(350 0) scale(-1 1)"><Kid x={175} y={61} ponytail look={-5} mood="quiet" color={pencil} /></g>
        <path d="m166 116-6 6m26-7 8 6" stroke={pencil} />
      </>,
    },
    C: {
      label: '빈 이정표 앞에서 동아리를 찾는 두 친구',
      drawing: <>
        <Kid x={57} y={70} mood="uneasy" look={3} color={teal} />
        <Kid x={183} y={70} mood="uneasy" look={-3} color={violet} />
        <path d="M120 28v89" stroke={pencil} />
        <path d="M94 35h49l10 10-10 10H94ZM146 64H98l-10 10 10 10h48Z" fill={muted} stroke={amber} />
      </>,
    },
  },
  9: {
    A: {
      label: 'AI 표시가 있는 포스터를 보고 친구도 산 그림을 만드는 모습',
      drawing: <>
        <Poster x={38} y={31} labeled /><Kid x={161} y={57} look={-3} />
        <g transform="translate(153 94) rotate(-7)">
          <rect x="-30" y="-16" width="60" height="36" rx="4" fill={paper} stroke={teal} />
          <path d="m-21 12 12-18L2 8l7-8 11 12Z" stroke={blue} />
          <path d="m13 0 11-19 6 4L19 3l-8 4Z" fill={amber} stroke={pencil} />
        </g><Spark x={118} y={43} />
      </>,
    },
    B: {
      label: '누가 그렸는지 묻자 포스터 옆에서 난처해하는 아이',
      drawing: <>
        <Poster x={41} y={34} /><Kid x={166} y={68} mood="uneasy" look={-3} color={pencil} />
        <Bubble x={126} y={37} color={amber}><Mark>?</Mark></Bubble>
      </>,
    },
    C: {
      label: '빈 캔버스 앞에서 붓을 들고 얼굴이 빨개진 아이',
      drawing: <>
        <path d="m56 119 30-99 32 99m-68-29h74" stroke={amber} />
        <rect x="45" y="33" width="82" height="54" rx="4" fill={paper} stroke={pencil} />
        <Kid x={173} y={66} color={pencil} mood="blush" look={-3}><path d="m-10 40-17-10" stroke={pencil} /></Kid>
        <path d="m147 99-10-24" stroke={amber} /><path d="M137 77q-10-2-7-15 10 5 10 12Z" fill={blue} stroke="none" />
      </>,
    },
  },
  5: {
    A: {
      label: '달팽이 기사 옆 돋보기로 확인한 작은 이빨과 확인 표시',
      drawing: <>
        <News x={43} y={32}><Snail x={32} y={47} /></News>
        <path d="m175 85 19 23" stroke={teal} strokeWidth="8" />
        <circle cx="156" cy="66" r="29" fill={paper} stroke={teal} />
        <path d="M137 66q19 23 38 0m-34 3 2 7 5-3 2 7 6-4 4 4 4-7 5 2 3-7" stroke={ink} />
        <Check x={194} y={42} /><Spark x={52} y={22} />
      </>,
    },
    B: {
      label: '틀린 달팽이 기사에 가위표가 그어지자 당황한 친구',
      drawing: <>
        <News x={37} y={30}><Snail x={32} y={48} /><path d="m48 37 15 20m0-20L48 57" stroke={red} /></News>
        <Kid x={180} y={70} mood="uneasy" color={pencil} look={-3} />
        <path d="m151 42-7-4m12-4-3-8" stroke={amber} />
      </>,
    },
    C: {
      label: '신문에서 빠진 기사 자리에 남은 물음표',
      drawing: <>
        <News x={64} y={33}><rect x="10" y="32" width="39" height="30" rx="3" fill={muted} stroke={pencil} strokeDasharray="4 6" /></News>
        <Bubble x={160} y={39} color={amber}><Mark>?</Mark></Bubble>
      </>,
    },
  },
  10: {
    A: {
      label: '가짜 영상이 지워져 안도하며 고마워하는 친구',
      drawing: <>
        <Phone x={77} y={71}><ErasedVideo /></Phone>
        <Kid x={167} y={67} look={-3}><path d="m-12 39 13 5 8-10" stroke={teal} /></Kid>
        <Bubble x={132} y={34} color={teal}><path d="M0 8q-17-10-11-17 5-4 11 3 6-7 11-3 6 7-11 17Z" fill={teal} stroke="none" /></Bubble>
      </>,
    },
    B: {
      label: '원래 영상은 지웠지만 두 단톡방에 남은 복사본',
      drawing: <>
        <Phone x={63} y={72}><ErasedVideo /></Phone>
        <path d="M99 70q14 0 26-15t26-14m-8-6 9 6-8 6M99 73q15 0 27 13t25 12m-7-7 8 7-9 6" stroke={amber} />
        <Bubble x={184} y={39} color={amber}><VideoCopy /></Bubble>
        <Bubble x={184} y={95} color={amber}><VideoCopy /></Bubble>
      </>,
    },
    C: {
      label: '웃음 말풍선이 늘어나고 다음 날 비어 있는 친구의 책상',
      drawing: <>
        <Bubble x={49} y={51}><Mark>ㅋㅋ</Mark></Bubble>
        <Bubble x={90} y={32} color={amber}><Mark>ㅋㅋ</Mark></Bubble>
        <Bubble x={132} y={48}><Mark>ㅋㅋ</Mark></Bubble>
        <g stroke={pencil}>
          <rect x="164" y="55" width="27" height="35" rx="7" fill={muted} />
          <path d="M170 89v22m16-22v22M118 95l-3 24m62-24 3 24" />
          <rect x="106" y="83" width="82" height="13" rx="5" fill={muted} />
        </g>
      </>,
    },
  },
};

function Flower({ x, y }: Point) {
  return <path transform={`translate(${x} ${y})`} d="M0-3q-6-11-9-4-3 5 4 7-9 6-3 9 5 2 8-5 4 8 9 4 4-5-4-8 8-3 4-8-5-4-9 5Z" fill={amber} stroke="none" />;
}

function VideoCopy() {
  return <><rect x="-14" y="-9" width="28" height="17" rx="3" fill={muted} stroke={pencil} /><path d="m-3-6 8 5-8 6Z" fill={amber} stroke="none" /></>;
}

export function SceneArt({ missionId, optionId, className }: {
  missionId: number;
  optionId: 'A' | 'B' | 'C';
  className?: string;
}): JSX.Element | null {
  const scene = scenes[missionId]?.[optionId];
  if (!scene?.drawing) return null;

  return (
    <svg viewBox="0 0 240 140" role="img" aria-label={scene.label} className={className}
      fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {scene.drawing}
    </svg>
  );
}
