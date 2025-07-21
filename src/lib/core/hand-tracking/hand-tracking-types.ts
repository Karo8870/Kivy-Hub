import { Point } from '@/lib/types';

export enum ModelStatus {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

export enum HandEvent {
  NO_TOUCH = -1,
  PRIMARY_TOUCH,
  SECONDARY_TOUCH,
  TERTIARY_TOUCH
}

export type HandTrackingEvents = {
  'touch-move': (
    position: Point,
    handIndex: number,
    handEvent: HandEvent
  ) => void;
};
