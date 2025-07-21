import { Point } from '@/lib/types';

export const SECONDARY_TOUCH_DISTANCE = 60;

export const TERTIARY_TOUCH_DISTANCE = 80;

export function getDistance(A: Point, B: Point) {
  return Math.sqrt(
    (A.x * 1000 - B.x * 1000) ** 2 + (A.y * 1000 - B.y * 1000) ** 2
  );
}
