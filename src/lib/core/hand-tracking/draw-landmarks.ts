import type { LandmarkPoint } from './format-landmarks.ts';

const CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // thumb
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // index
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12], // middle
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16], // ring
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20] // pinky
];

export interface DrawOptions {
  baseRadius?: number;
  tipRadius?: number;
  lineWidth?: number;
  color?: string;
  shadow?: boolean;
}

export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  points: LandmarkPoint[],
  canvasWidth: number,
  canvasHeight: number,
  opts: DrawOptions = {}
) {
  if (points.length !== 21) {
    console.warn(`Expected 21 points, got ${points.length}`);
    return;
  }

  const {
    baseRadius = 3,
    tipRadius = 5,
    lineWidth = 2,
    color = 'rgba(255, 255, 255, 0.9)',
    shadow = true
  } = opts;

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  if (shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 3;
  }

  const toX = (x: number) => x * canvasWidth;
  const toY = (y: number) => y * canvasHeight;

  ctx.beginPath();
  for (const [i, j] of CONNECTIONS) {
    const p1 = points[i];
    const p2 = points[j];
    ctx.moveTo(toX(p1.x), toY(p1.y));
    ctx.lineTo(toX(p2.x), toY(p2.y));
  }
  ctx.stroke();

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    const x = toX(pt.x);
    const y = toY(pt.y);

    const isTip = [4, 8, 12, 16, 20].includes(i);
    const radius = isTip ? tipRadius : baseRadius;
    const color = i === 8 ? '#FF0000' : '#FFFFFFE5';

    ctx.fillStyle = '#00000080';
    ctx.beginPath();
    ctx.arc(x, y, radius + 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (shadow) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
}
