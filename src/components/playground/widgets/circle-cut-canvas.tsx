import { RefObject, useEffect, useRef } from 'react';
import { Point } from '@/lib/types';

export function CircleCutCanvas({
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

    const centerX = (pointA.x + pointB.x) / 2;
    const centerY = (pointA.y + pointB.y) / 2;

    const radiusX = Math.abs(pointB.x - pointA.x) / 2;
    const radiusY = Math.abs(pointB.y - pointA.y) / 2;

    const ringCount = 3;
    for (let i = 1; i <= ringCount; i++) {
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY,
        (radiusX * i) / ringCount,
        (radiusY * i) / ringCount,
        0,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = i === ringCount ? '#444' : '#aaa';
      ctx.setLineDash(i < ringCount ? [5, 5] : []);
      ctx.lineWidth = i === ringCount ? 2 : 1;
      ctx.stroke();
    }

    ctx.setLineDash([]);

    const sliceConfigs = [
      { count: 6, color: '#d9534f', dash: [] },
      { count: 8, color: '#5bc0de', dash: [4, 4] },
      { count: 12, color: '#5cb85c', dash: [2, 6] }
    ];

    for (const { count, color, dash } of sliceConfigs) {
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count;
        const x = centerX + Math.cos(angle) * radiusX;
        const y = centerY + Math.sin(angle) * radiusY;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = color;
        ctx.setLineDash(dash);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
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
