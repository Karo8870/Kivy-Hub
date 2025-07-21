import { MenuItems } from '@/components/playground/widgets/home-widget/menu-items';
import MainSelectable from '@/components/playground/widgets/home-widget/main-selectable';
import { useState } from 'react';
import { useMenu } from '@/components/playground/widgets/home-widget/use-menu';

export function HomeWidget() {
  const { homeMenu, setHomeMenu } = useMenu();

  const [isOpen, setIsOpen] = useState(false);

  const handleMainPress = () => {
    if (!homeMenu.showBack) {
      setIsOpen(!isOpen);
    } else {
      homeMenu.backFn?.(setHomeMenu);
    }
  };

  return (
    <div className='fixed right-12 bottom-12 z-[100] flex h-80 w-80 items-center justify-center'>
      <MainSelectable
        title={homeMenu.text}
        onPress={handleMainPress}
        icon={
          <i className='fa fa-arrow-left absolute top-1/2 left-8 -translate-y-1/2 transform text-xl text-white' />
        }
        showBack={homeMenu.showBack}
      />

      <MenuItems
        setHomeMenu={setHomeMenu}
        isOpen={isOpen}
        menuItems={homeMenu.items}
        setIsOpen={setIsOpen}
      />
      <img
        src='/mesh-gradient.png'
        alt='Kivy Logo'
        className='pointer-events-none absolute z-[100] min-h-[45rem] min-w-[45rem]'
      />
    </div>
  );
}
