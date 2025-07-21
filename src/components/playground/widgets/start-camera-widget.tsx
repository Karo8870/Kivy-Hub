import { useHandTracking } from '@/lib/core/hand-tracking/hand-tracking-context';
import { cn } from '@/lib/utils';

export function StartCameraWidget() {
  const { toggleTracking, isTracking, modelStatus } = useHandTracking();

  if (isTracking) {
    return null;
  }

  return (
    <button
      disabled={modelStatus !== 'ready'}
      onClick={() => {
        toggleTracking();
      }}
      className={cn(
        'fixed top-8 right-8 cursor-pointer rounded-full bg-white px-4 py-2 text-black',
        modelStatus !== 'ready' && 'opacity-50'
      )}
    >
      Start Camera
    </button>
  );
}
