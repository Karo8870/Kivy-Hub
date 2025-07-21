import { motion } from 'framer-motion';
import { Selectable } from '@/components/playground/core/selectable';
import {
  HomeItem,
  HomeMenu
} from '@/components/playground/widgets/home-widget/home-widget-types';

interface MenuItemsProps {
  isOpen: boolean;
  menuItems: HomeItem[];
  setIsOpen: (value: boolean) => void;
  setHomeMenu: (homeMenu: HomeMenu) => void;
}

export function MenuItems({
  isOpen,
  menuItems,
  setIsOpen,
  setHomeMenu
}: MenuItemsProps) {
  const radius = 270;

  return (
    <>
      {menuItems.map((item, index) => {
        let nr1 = menuItems.length > 2 ? 0.35 : 0.52;
        let nr2 = menuItems.length > 2 ? 1.25 : 2;

        const angle = -Math.PI * (nr1 + index / (menuItems.length - 1) / nr2);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <motion.div
            key={index}
            className='absolute h-32 w-32'
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: isOpen ? x : 0,
              y: isOpen ? y : 0,
              opacity: isOpen ? 1 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Selectable
              enabled={isOpen}
              onPrimaryPress={() => {
                if (item.fn) {
                  item.fn(setHomeMenu);
                } else {
                  setIsOpen(!isOpen);
                }
              }}
              className='flex h-32 w-32 items-center justify-center rounded-full bg-white text-black'
            >
              {item.icon ?? (
                <label className='text-5xl font-bold'>{item.text}</label>
              )}
            </Selectable>
          </motion.div>
        );
      })}
    </>
  );
}
