import { TargetWidget } from '@/components/playground/widgets/target-widget';
import { cn } from '@/lib/utils';
import { MeasureCanvas } from '@/components/playground/widgets/measure-canvas';
import { useEffect, useRef } from 'react';
import { Point } from '@/lib/types';
import { HomeBackButton } from '@/components/playground/widgets/home-back-button';

export function MeasureScreen({ active }: { active: boolean }) {
  const pointARef = useRef<Point>({ x: 100, y: 100 });
  const pointBRef = useRef<Point>({ x: 400, y: 400 });

  useEffect(() => {});

  return (
    <div className={cn(!active && 'hidden', 'h-screen w-screen')}>
      <MeasureCanvas pointARef={pointARef} pointBRef={pointBRef} />
      <TargetWidget positionRef={pointARef} />
      <TargetWidget positionRef={pointBRef} />
      <HomeBackButton title='Measure' className='fixed right-12 bottom-12' />
    </div>
  );
}
