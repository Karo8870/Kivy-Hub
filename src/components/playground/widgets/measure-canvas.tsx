import { RefObject, useEffect, useRef } from 'react';
import { Point } from '@/lib/types';

export function MeasureCanvas({
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

    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angleRad = Math.atan2(dy, dx);
    const mid: Point = {
      x: (pointA.x + pointB.x) / 2,
      y: (pointA.y + pointB.y) / 2
    };

    drawGrid(ctx, canvas, 100);

    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    drawArrow(ctx, pointA, pointB);

    drawPoint(ctx, mid, '', 'green');

    ctx.fillStyle = 'white';
    ctx.font = '14px sans-serif';
    ctx.fillText(`d = ${dist.toFixed(2)} px`, mid.x + 10, mid.y);

    const perpAngle = angleRad + Math.PI / 2;
    const length = 1000;
    const bisectorStart: Point = {
      x: mid.x - Math.cos(perpAngle) * length,
      y: mid.y - Math.sin(perpAngle) * length
    };
    const bisectorEnd: Point = {
      x: mid.x + Math.cos(perpAngle) * length,
      y: mid.y + Math.sin(perpAngle) * length
    };

    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(bisectorStart.x, bisectorStart.y);
    ctx.lineTo(bisectorEnd.x, bisectorEnd.y);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(pointA.x, pointA.y, dist, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.stroke();

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointA.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pointB.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.stroke();
    ctx.setLineDash([]);

    const arcRadius = 80;
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.arc(pointA.x, pointA.y, arcRadius, 0, angleRad, angleRad < 0);
    ctx.strokeStyle = 'white';
    ctx.stroke();

    const labelAngleX = pointA.x + arcRadius * Math.cos(angleRad / 2);
    const labelAngleY = pointA.y + arcRadius * Math.sin(angleRad / 2);
    ctx.fillText(
      `θ = ${((angleRad * 180) / Math.PI).toFixed(2)}°`,
      labelAngleX + 5,
      labelAngleY
    );
  }

  function drawPoint(
    ctx: CanvasRenderingContext2D,
    p: Point,
    label: string,
    color: string = 'red'
  ): void {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '14px sans-serif';
    ctx.fillText(label, p.x + 8, p.y - 8);
  }

  function drawArrow(
    ctx: CanvasRenderingContext2D,
    from: Point,
    to: Point
  ): void {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headlen = 10;
    const tox = to.x;
    const toy = to.y;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(tox, toy);
    ctx.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(tox, toy);
    ctx.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }

  function drawGrid(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    spacing: number
  ): void {
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
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
