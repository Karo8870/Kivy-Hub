import {
  HTMLAttributes,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState
} from 'react';
import { cn } from '@/lib/utils';
import { HandEvent } from '@/lib/core/hand-tracking/hand-tracking-types';

type TouchEvent = Event & {
  detail: {
    clientX: number;
    clientY: number;
  };
};

type TouchFunction = (e: TouchEvent) => void;

function canInteract(
  onPrimaryPress: TouchFunction | undefined,
  onSecondaryPress: TouchFunction | undefined,
  onTertiaryPress: TouchFunction | undefined,
  enabled: boolean
) {
  if (!enabled) return '000';
  return `${onPrimaryPress ? '1' : '0'}${onSecondaryPress ? '1' : '0'}${onTertiaryPress ? '1' : '0'}`;
}

export type SelectableProps = HTMLAttributes<HTMLDivElement> & {
  enabled?: boolean;
  children?: ReactNode;
  ref?: RefObject<HTMLDivElement | null>;
  onPrimaryPress?: TouchFunction;
  onSecondaryPress?: TouchFunction;
  onTertiaryPress?: TouchFunction;
  onPrimaryRelease?: TouchFunction;
  onSecondaryRelease?: TouchFunction;
  onTertiaryRelease?: TouchFunction;
  delay?: number;
  forceSelect?: boolean;
  stopPropagation?: boolean;
  showFeedback?: boolean;
};

const colors = {
  0: 'custom-blue-shadow',
  1: 'custom-green-shadow',
  2: 'custom-yellow-shadow'
};

export function Selectable({
  enabled = true,
  children,
  onPrimaryPress,
  onSecondaryPress,
  onTertiaryPress,
  onPrimaryRelease,
  onSecondaryRelease,
  onTertiaryRelease,
  delay = 500,
  stopPropagation = false,
  showFeedback = true,
  ref,
  ...props
}: SelectableProps) {
  const [selected, setSelected] = useState<HandEvent>(HandEvent.NO_TOUCH);
  const [selecting, setSelecting] = useState(false);
  const selectingRef = useRef(false);
  const timeOutRef = useRef<NodeJS.Timeout>(null);
  const divRef = ref ?? useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      setSelected(-1);
      setSelecting(false);
      return;
    }

    const el = divRef.current;
    if (!el) return;

    const handleTouchDown =
      (handEvent: HandEvent, fn?: TouchFunction) => (e: TouchEvent) => {
        if (stopPropagation) e.stopPropagation();
        setSelecting(true);
        selectingRef.current = true;

        timeOutRef.current = setTimeout(() => {
          if (selectingRef.current) {
            setSelected(handEvent);
            setSelecting(false);
            fn?.(e);
          }
        }, delay);
      };

    const handleTouchUp =
      (handEvent: HandEvent, fn?: TouchFunction) => (e: TouchEvent) => {
        console.log('touch uop', handEvent, selected);

        if (stopPropagation) e.stopPropagation();
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        selectingRef.current = false;

        if (selected === handEvent) {
          fn?.(e);
        }

        setSelecting(false);
        setSelected(-1);
      };

    const handlers = [
      {
        downEvent: 'primary-touch-down',
        upEvent: 'primary-touch-up',
        handEvent: HandEvent.PRIMARY_TOUCH,
        pressFn: onPrimaryPress,
        releaseFn: onPrimaryRelease
      },
      {
        downEvent: 'secondary-touch-down',
        upEvent: 'secondary-touch-up',
        handEvent: HandEvent.SECONDARY_TOUCH,
        pressFn: onSecondaryPress,
        releaseFn: onSecondaryRelease
      },
      {
        downEvent: 'tertiary-touch-down',
        upEvent: 'tertiary-touch-up',
        handEvent: HandEvent.TERTIARY_TOUCH,
        pressFn: onTertiaryPress,
        releaseFn: onTertiaryRelease
      }
    ];

    const cleanupListeners: (() => void)[] = [];

    handlers.forEach(
      ({ downEvent, upEvent, handEvent, pressFn, releaseFn }) => {
        if (pressFn) {
          const downListener = handleTouchDown(handEvent, pressFn);
          const upListener = handleTouchUp(handEvent, releaseFn);

          el.addEventListener(downEvent, downListener as unknown as () => void);
          el.addEventListener(upEvent, upListener as unknown as () => void);

          cleanupListeners.push(() => {
            el.removeEventListener(
              downEvent,
              downListener as unknown as () => void
            );
            el.removeEventListener(
              upEvent,
              upListener as unknown as () => void
            );
          });
        }
      }
    );

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
    };
  }, [delay, stopPropagation, selected, enabled, onPrimaryPress]);

  return (
    <div
      data-can-interact={canInteract(
        onPrimaryPress,
        onSecondaryPress,
        onTertiaryPress,
        enabled
      )}
      {...props}
      ref={divRef}
      className={cn(
        'flex select-none',
        showFeedback
          ? selected !== -1
            ? colors[selected as keyof typeof colors]
            : selecting
              ? 'custom-white-shadow'
              : ''
          : '',
        props.className
      )}
    >
      {children}
    </div>
  );
}
