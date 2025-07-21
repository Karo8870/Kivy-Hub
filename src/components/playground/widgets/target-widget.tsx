import { Movable } from '@/components/playground/core/movable';
import { RefObject } from 'react';
import { Point } from '@/lib/types';

export function TargetWidget({
  positionRef
}: {
  positionRef: RefObject<Point>;
}) {
  return (
    <Movable
      positionRef={positionRef}
      initialPos={positionRef.current}
      className='flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white/20 shadow-md backdrop-blur-sm'
    >
      <div className='h-2 w-2 rounded-full bg-white' />
    </Movable>
  );
}
