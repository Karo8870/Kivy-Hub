import { RefObject, useEffect, useRef } from 'react';
import { Point } from '@/lib/types';

export function RectangleCutCanvas({
  pointARef,
  pointBRef
}: {
  pointARef: RefObject<Point>;
  pointBRef: RefObject<Point>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  function draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    pointA: Point,
    pointB: Point
  ): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const deltaX = Math.abs(pointB.x - pointA.x);
    const deltaY = Math.abs(pointB.y - pointA.y);
    if (deltaX < 1 || deltaY < 1) return;

    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;

    for (let x = pointA.x; x <= canvas.width; x += deltaX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let x = pointA.x; x >= 0; x -= deltaX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = pointA.y; y <= canvas.height; y += deltaY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let y = pointA.y; y >= 0; y -= deltaY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px sans-serif';
    ctx.fillText(`${deltaX}`, pointA.x + deltaX / 2 - 10, pointA.y - 6);
    ctx.fillText(`${deltaY}`, pointA.x + 6, pointA.y + deltaY / 2 + 4);
  }

  function renderLoop() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas!.getContext('2d')!;

    draw(
      canvas,
      ctx,
      {
        x: pointARef.current.x + 48,
        y: pointARef.current.y + 48
      },
      {
        x: pointBRef.current.x + 48,
        y: pointBRef.current.y + 48
      }
    );
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    function onResize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    window.addEventListener('resize', onResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      ref={canvasRef}
      className='h-screen w-screen'
    />
  );
}
