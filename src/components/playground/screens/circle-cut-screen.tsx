import { TargetWidget } from '@/components/playground/widgets/target-widget';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { Point } from '@/lib/types';
import { HomeBackButton } from '@/components/playground/widgets/home-back-button';
import { CircleCutCanvas } from '@/components/playground/widgets/circle-cut-canvas';

export function CircleCutScreen({ active }: { active: boolean }) {
  const pointARef = useRef<Point>({ x: 100, y: 100 });
  const pointBRef = useRef<Point>({ x: 400, y: 400 });

  useEffect(() => {});

  return (
    <div className={cn(!active && 'hidden', 'h-screen w-screen')}>
      <CircleCutCanvas pointARef={pointARef} pointBRef={pointBRef} />
      <TargetWidget positionRef={pointARef} />
      <TargetWidget positionRef={pointBRef} />
      <HomeBackButton title='Cutter' className='fixed right-12 bottom-12' />
    </div>
  );
}
