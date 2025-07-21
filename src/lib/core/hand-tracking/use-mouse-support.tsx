import { RefObject, useEffect, useRef } from 'react';
import {
  HandEvent,
  HandTrackingEvents
} from '@/lib/core/hand-tracking/hand-tracking-types';
import { EventRegistry } from '@/lib/core/event-handling/event-registry';
import { eventPropagation } from '@/lib/core/event-handling/event-propagation';

export function useMouseSupport(
  eventRegistryRef: RefObject<EventRegistry<HandTrackingEvents>>,
  hoveredElements: RefObject<Set<Element>>,
  hoveredElementEvents: RefObject<Map<Element, HandEvent>>
) {
  const mouseDownRef = useRef<boolean>(false);

  const mouseCoordsRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0
  });

  const mouseButtonRef = useRef<number>(0);

  useEffect(() => {
    function emit(
      event: {
        clientX: number;
        clientY: number;
        metaKey: boolean;
      },
      newlyHovered?: Element[]
    ) {
      mouseCoordsRef.current = {
        x: event.clientX,
        y: event.clientY
      };

      if (event.metaKey && mouseButtonRef.current === 0) {
        eventPropagation(
          hoveredElements,
          hoveredElementEvents,
          event.clientX,
          event.clientY,
          HandEvent.TERTIARY_TOUCH,
          -1,
          newlyHovered
        );

        eventRegistryRef.current.emit(
          'touch-move',
          {
            x: event.clientX,
            y: event.clientY
          },
          0,
          HandEvent.TERTIARY_TOUCH
        );
      } else if (mouseButtonRef.current === 2) {
        eventPropagation(
          hoveredElements,
          hoveredElementEvents,
          event.clientX,
          event.clientY,
          HandEvent.SECONDARY_TOUCH,
          -1,
          newlyHovered
        );

        eventRegistryRef.current.emit(
          'touch-move',
          {
            x: event.clientX,
            y: event.clientY
          },
          0,
          HandEvent.SECONDARY_TOUCH
        );
      } else {
        eventPropagation(
          hoveredElements,
          hoveredElementEvents,
          event.clientX,
          event.clientY,
          HandEvent.PRIMARY_TOUCH,
          -1,
          newlyHovered
        );

        eventRegistryRef.current.emit(
          'touch-move',
          {
            x: event.clientX,
            y: event.clientY
          },
          0,
          HandEvent.PRIMARY_TOUCH
        );
      }
    }

    function onMouseMove(event: MouseEvent) {
      if (!mouseDownRef.current) return;

      emit(event);
    }

    function onMouseDown(event: MouseEvent) {
      mouseDownRef.current = true;
      mouseButtonRef.current = event.button;
      emit(event);
    }

    function onMouseUp(event: MouseEvent) {
      mouseDownRef.current = false;

      emit(event, []);
    }

    function preventDefaultContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    document.addEventListener('contextmenu', preventDefaultContextMenu);

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('contextmenu', preventDefaultContextMenu);

      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return mouseCoordsRef;
}
