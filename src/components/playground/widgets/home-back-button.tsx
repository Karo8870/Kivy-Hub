import MainSelectable from '@/components/playground/widgets/home-widget/main-selectable';
import { useScreenContext } from '@/lib/core/screens/screen-context';
import { cn } from '@/lib/utils';

export function HomeBackButton({
  title,
  className
}: {
  title: string;
  className?: string;
}) {
  const { setSelectedScreen } = useScreenContext();

  return (
    <div
      className={cn(
        'z-[100] flex h-80 w-80 items-center justify-center',
        className
      )}
    >
      <MainSelectable
        title={title}
        onPress={() => {
          setSelectedScreen('main');
        }}
        icon={
          <i className='fa fa-arrow-left absolute top-1/2 left-8 -translate-y-1/2 transform text-xl text-white' />
        }
        showBack={true}
      />
      <img
        src='/mesh-gradient.png'
        alt='Kivy Logo'
        className='pointer-events-none absolute z-[100] min-h-[45rem] min-w-[45rem]'
      />
    </div>
  );
}
