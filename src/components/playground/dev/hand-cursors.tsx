import { HandEvent } from '@/lib/core/hand-tracking/hand-tracking-types';
import { useHandTracking } from '@/lib/core/hand-tracking/hand-tracking-context';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

const colors = {
  [HandEvent.NO_TOUCH]: '',
  [HandEvent.PRIMARY_TOUCH]: 'border-blue-500 bg-blue-500/20',
  [HandEvent.SECONDARY_TOUCH]: 'border-green-500 bg-green-500/20',
  [HandEvent.TERTIARY_TOUCH]: 'border-yellow-500 bg-yellow-500/20'
};

export function HandCursors() {
  const [_updater, setUpdater] = useState<number>(0);
  const updaterRef = useRef<number>(0);

  const { landmarksRef, eventRegistryRef, handEventsRef } = useHandTracking();

  useEffect(() => {
    function onTouchMove() {
      updaterRef.current++;

      setUpdater(updaterRef.current);
    }

    eventRegistryRef.current.on('touch-move', onTouchMove);

    return () => {
      eventRegistryRef.current.off('touch-move', onTouchMove);
    };
  }, []);

  return (
    <>
      {landmarksRef.current.map((landmark, index) => (
        <div
          key={index}
          className={`pointer-events-none fixed top-0 left-0 z-50 transition-transform duration-75 ease-linear`}
          style={{
            transform: `translate(${landmark.index.tip.x * window.innerWidth - 15}px, ${landmark.index.tip.y * window.innerHeight - 15}px)`
          }}
        >
          <div
            className={cn(
              'h-8 w-8 rounded-full border-4 shadow-md backdrop-blur-sm',
              colors[handEventsRef.current[index]]
            )}
          />
        </div>
      ))}
    </>
  );
}
