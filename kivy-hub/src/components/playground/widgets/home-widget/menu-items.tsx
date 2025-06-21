import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Selectable } from '@/components/playground/core/selectable';

interface MenuItem {
  id: number;
  label: string;
  icon: ReactNode;

  onPress?(): void;
}

interface MenuItemsProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  setIsOpen: (value: boolean) => void;
}

export function MenuItems({ isOpen, menuItems, setIsOpen }: MenuItemsProps) {
  const radius = 270;

  return (
    <>
      {menuItems.map((item, index) => {
        const angle = -Math.PI * (0.35 + index / (menuItems.length - 1) / 1.25);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <motion.div
            key={item.id}
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
                if (item.onPress) {
                  item.onPress();
                  setIsOpen(!isOpen);
                }
              }}
              className='flex h-32 w-32 items-center justify-center rounded-full bg-white text-black'
            >
              {item.icon}
            </Selectable>
          </motion.div>
        );
      })}
    </>
  );
}
