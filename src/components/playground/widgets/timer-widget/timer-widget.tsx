import { Timer } from '@/components/playground/widgets/timer-widget/timer-widget-types';
import {
  Bell,
  PauseIcon,
  PlayIcon,
  TimerIcon,
  TimerResetIcon,
  TrashIcon
} from 'lucide-react';
import { Selectable } from '@/components/playground/core/selectable';
import { CSSProperties, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useTimerWidget } from '@/components/playground/widgets/timer-widget/timer-widget-context';
import { cn } from '@/lib/utils';

const pad = (num: number): string => num.toString().padStart(2, '0');

function formatSeconds(seconds: number): string {
  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  const secs: number = seconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

function getRunOffTime(secondsFromNow: number): string {
  const now = new Date();
  const future = new Date(now.getTime() + secondsFromNow * 1000);

  const hours = future.getHours();
  const minutes = future.getMinutes();

  return `${pad(hours)}:${pad(minutes)}`;
}

export function TimerWidget({
  totalTime,
  title,
  id,
  className,
  style,
  isExpanded,
  index
}: Timer & {
  className?: string;
  style?: CSSProperties;
  isExpanded: boolean;
  index: number;
}) {
  const { removeTimer } = useTimerWidget();

  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running && seconds < totalTime) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev + 1 >= totalTime) {
            setRunning(false);
            return totalTime;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, seconds, totalTime]);

  const toggleTimer = () => {
    if (seconds >= totalTime) return;
    setRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(0);
  };

  const remaining = totalTime - seconds;

  const progress = useMotionValue(remaining / totalTime);

  useEffect(() => {
    progress.set(remaining / totalTime);
  }, [remaining / totalTime]);

  const backgroundColor = useTransform(
    progress,
    [1, 0.5, 0],
    ['#22c55e', '#facc15', '#ef4444']
  );

  const stackOffset = !isExpanded ? `${index * 24}px` : '0px';
  const zIndex = isExpanded ? 50 - index : 50 - index;

  return (
    <motion.div
      className={cn(
        'relative flex h-[16rem] w-[23rem] flex-col justify-between rounded-[3rem] bg-white p-5 text-black',
        className
      )}
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        filter: `brightness(${isExpanded ? 1 : index <= 2 ? 1 - index * 0.4 : 0})`,
        scale: isExpanded ? 1 : index <= 2 ? 1 - index * 0.075 : 0,
        y: isExpanded ? index * (256 + 16) : parseInt(stackOffset),
        zIndex
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      exit={{ opacity: 0, y: 20 }}
      style={style}
    >
      <div className='z-10 flex flex-col'>
        <div className='flex items-center gap-2'>
          <TimerIcon className='text-black/80' />
          <h3 className='text-2xl font-bold'>{title}</h3>
        </div>
        <div className='flex flex-col'>
          <label className='text-5xl font-bold'>
            {formatSeconds(remaining)}
          </label>
          {running && (
            <div className='flex items-center gap-1'>
              <Bell />
              <span>{getRunOffTime(remaining)}</span>
            </div>
          )}
        </div>
      </div>
      <div className='z-10 flex justify-between'>
        <Selectable
          onPrimaryPress={() => {
            toggleTimer();
          }}
          className='rounded-3xl bg-amber-400 px-10 py-4'
        >
          {running ? (
            <PauseIcon className='size-14' />
          ) : (
            <PlayIcon className='size-14' />
          )}
        </Selectable>
        <Selectable
          onPrimaryPress={() => {
            if (remaining === totalTime) {
              removeTimer(id);
            } else {
              resetTimer();
            }
          }}
          className='rounded-3xl bg-amber-400 px-10 py-4'
        >
          {remaining === totalTime ? (
            <TrashIcon className='size-14' />
          ) : (
            <TimerResetIcon className='size-14' />
          )}
        </Selectable>
      </div>
      <div className='absolute top-0 left-0 h-full w-full overflow-hidden rounded-[3rem]'>
        <motion.div
          className='h-full rounded-l-[3rem] transition-all duration-200'
          style={{
            width: `${(remaining / totalTime) * 100}%`,
            backgroundColor: backgroundColor
          }}
        />
      </div>
    </motion.div>
  );
}
