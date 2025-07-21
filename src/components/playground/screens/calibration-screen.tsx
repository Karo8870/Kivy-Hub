import { cn } from '@/lib/utils';
import { HomeBackButton } from '@/components/playground/widgets/home-back-button';

export function CalibrationScreen({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        !active ? 'hidden' : 'flex',
        'h-screen w-screen items-center justify-center bg-white'
      )}
    >
      <HomeBackButton title='Calibration' className='relative' />
      <img
        src='/markers/marker-1.png'
        alt='marker'
        className='absolute top-0 left-0'
      />
      <img
        src='/markers/marker-2.png'
        alt='marker'
        className='absolute top-0 right-0'
      />
      <img
        src='/markers/marker-3.png'
        alt='marker'
        className='absolute right-0 bottom-0'
      />
      <img
        src='/markers/marker-4.png'
        alt='marker'
        className='absolute bottom-0 left-0'
      />
    </div>
  );
}
