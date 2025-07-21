import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useRef,
  useState
} from 'react';
import { HandLandmarker } from '@mediapipe/tasks-vision';
import {
  getDistance,
  SECONDARY_TOUCH_DISTANCE,
  TERTIARY_TOUCH_DISTANCE
} from '@/lib/math';
import {
  HandLandmarks,
  parseLandmarksArray
} from '@/lib/core/hand-tracking/format-landmarks';
import { Point } from '@/lib/types';
import {
  HandEvent,
  HandTrackingEvents,
  ModelStatus
} from '@/lib/core/hand-tracking/hand-tracking-types';
import { useWebcam } from '@/lib/core/hand-tracking/use-webcam';
import { useHandLandMarker } from '@/lib/core/hand-tracking/use-hand-land-marker';
import { useMouseSupport } from '@/lib/core/hand-tracking/use-mouse-support';
import { EventRegistry } from '@/lib/core/event-handling/event-registry';
import { eventPropagation } from '@/lib/core/event-handling/event-propagation';
import { NormalizedLandmark } from '@mediapipe/hands';

interface HandTrackingContextInterface {
  handTracker: HandLandmarker | null;
  modelStatus: ModelStatus;
  videoRef: RefObject<any>;
  eventRegistryRef: RefObject<EventRegistry<HandTrackingEvents>>;
  isTracking: boolean;
  webcamRunning: boolean;

  toggleTracking(): void;

  landmarksRef: RefObject<HandLandmarks[]>;
  rawLandmarksRef: RefObject<NormalizedLandmark[][]>;
  handEventsRef: RefObject<HandEvent[]>;

  mousePositionRef: RefObject<{
    x: number;
    y: number;
  }>;
}

const handTrackingContext = createContext<HandTrackingContextInterface | null>(
  null
);

export function useHandTracking() {
  const ctx = useContext(handTrackingContext)!;

  if (!ctx) {
    throw new Error(
      'useHandTracking must be used within a HandTrackingProvider'
    );
  }

  return ctx;
}

export function HandTrackingProvider({ children }: { children: ReactNode }) {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [webcamRunning, setWebcamRunning] = useState<boolean>(false);

  const landmarksRef = useRef<HandLandmarks[]>([]);
  const handEventsRef = useRef<HandEvent[]>([]);
  const rawLandmarksRef = useRef<NormalizedLandmark[][]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const eventRegistryRef = useRef(new EventRegistry<HandTrackingEvents>());

  let lastVideoTime = -1;
  let animationFrameID = 0;

  const hoveredElements = useRef<Set<Element>>(new Set<Element>());
  const hoveredElementTypes = useRef<Map<Element, number>>(new Map());

  const mousePositionRef = useMouseSupport(
    eventRegistryRef,
    hoveredElements,
    hoveredElementTypes
  );

  const { handTracker, modelStatus } = useHandLandMarker();

  async function predictHandMarks() {
    if (!handTracker || !videoRef.current || !isTracking) {
      return;
    }

    const video = videoRef.current as HTMLVideoElement;

    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;

      const startTimeMs = performance.now();
      const results = handTracker.detectForVideo(video, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        rawLandmarksRef.current = results.landmarks;

        const parsedLandmarks = parseLandmarksArray(results.landmarks);

        landmarksRef.current = parsedLandmarks;

        const events: HandEvent[] = [];

        const eventRegistry = eventRegistryRef.current;

        function emitEvent(handEvent: HandEvent, point: Point, index: number) {
          events.push(handEvent);

          eventPropagation(
            hoveredElements,
            hoveredElementTypes,
            point.x * window.innerWidth,
            point.y * window.innerHeight,
            handEvent,
            index
          );

          eventRegistry.emit(
            'touch-move',
            {
              x: point.x * window.innerWidth,
              y: point.y * window.innerHeight
            },
            index,
            handEvent
          );
        }

        for (let i = 0; i < parsedLandmarks.length; i++) {
          const landmark = parsedLandmarks[i];

          if (
            getDistance(landmark.index.tip, landmark.thumb.tip) <
            SECONDARY_TOUCH_DISTANCE
          ) {
            emitEvent(HandEvent.SECONDARY_TOUCH, landmark.index.tip, i);
          } else if (
            getDistance(landmark.index.tip, landmark.middle.tip) <
            TERTIARY_TOUCH_DISTANCE
          ) {
            emitEvent(HandEvent.TERTIARY_TOUCH, landmark.index.tip, i);
          } else {
            emitEvent(HandEvent.PRIMARY_TOUCH, landmark.index.tip, i);
          }
        }

        handEventsRef.current = events;
      }
    }

    if (isTracking) {
      animationFrameID = requestAnimationFrame(predictHandMarks);
    }
  }

  useWebcam(
    videoRef,
    isTracking,
    webcamRunning,
    setWebcamRunning,
    predictHandMarks
  );

  function toggleTracking() {
    if (isTracking) {
      cancelAnimationFrame(animationFrameID);
    }
    setIsTracking(!isTracking);
  }

  return (
    <handTrackingContext.Provider
      value={{
        handTracker,
        modelStatus,
        toggleTracking,
        landmarksRef,
        rawLandmarksRef,
        handEventsRef,
        videoRef,
        eventRegistryRef,
        mousePositionRef,
        isTracking,
        webcamRunning
      }}
    >
      {children}
      <video
        ref={videoRef}
        className='hidden'
        width='640'
        height='480'
        autoPlay
        playsInline
      />
    </handTrackingContext.Provider>
  );
}
