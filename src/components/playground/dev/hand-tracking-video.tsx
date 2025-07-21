import { useEffect, useRef } from 'react';
import { useHandTracking } from '@/lib/core/hand-tracking/hand-tracking-context';
import { drawLandmarks } from '@/lib/core/hand-tracking/draw-landmarks';
import { Movable } from '@/components/playground/core/movable';

export function HandTrackingVideo() {
  const { rawLandmarksRef, videoRef, modelStatus, isTracking, webcamRunning } =
    useHandTracking();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  function draw() {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(videoRef.current, 0, 0, w, h);

    for (const landmark of rawLandmarksRef.current) {
      drawLandmarks(ctx, landmark, w, h);
    }

    ctx.restore();
  }

  function renderLoop() {
    draw();
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <Movable
      initialPos={{
        x: window.innerWidth - 40 - 640,
        y: 40
      }}
      className='max-w-min rounded-[3rem]'
    >
      <div className='absolute top-4 left-4 flex flex-col gap-2 rounded-[2rem] bg-white p-4 text-black'>
        <label>Status: {modelStatus}</label>
        <label>
          Is tracking:{' '}
          {isTracking ? (
            <span className='text-green-400'>True</span>
          ) : (
            <span className='text-red-400'>False</span>
          )}
        </label>
        <label>
          Camera running:{' '}
          {webcamRunning ? (
            <span className='text-green-400'>True</span>
          ) : (
            <span className='text-red-400'>False</span>
          )}
        </label>
      </div>
      <canvas
        className='rounded-[3rem]'
        ref={canvasRef}
        width={640}
        height={480}
      />
    </Movable>
  );
}
