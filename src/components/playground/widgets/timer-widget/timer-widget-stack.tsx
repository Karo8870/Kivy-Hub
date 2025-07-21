import { Timer } from '@/components/playground/widgets/timer-widget/timer-widget-types';
import { TimerWidget } from '@/components/playground/widgets/timer-widget/timer-widget';
import { Movable } from '@/components/playground/core/movable';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export function TimerWidgetStack({ timers }: { timers: Timer[] }) {
  const [extended, setExtended] = useState<boolean>(true);

  return (
    <Movable
      onTertiaryPress={() => {
        setExtended(!extended);
      }}
      initialPos={{
        x: 600,
        y: 0
      }}
      className='rounded-[3rem]'
      style={{
        width: '23rem',
        height: extended
          ? (256 + 16) * timers.length - 16
          : 256 + 16 * (timers.length - 1)
      }}
    >
      <AnimatePresence>
        {timers.map((timer, index) => (
          <TimerWidget
            index={index}
            isExpanded={extended}
            className='absolute left-0'
            key={timer.id}
            {...timer}
          />
        ))}
      </AnimatePresence>
    </Movable>
  );
}
