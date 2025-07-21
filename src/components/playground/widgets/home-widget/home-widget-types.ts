import { ReactNode } from 'react';

export type setHomeMenuFn = (homeMenu: HomeMenu) => void;

export interface HomeMenu {
  items: HomeItem[];
  text?: string;
  icon?: ReactNode;
  showBack?: boolean;
  backFn?: (setHomeMenu: setHomeMenuFn) => void;
}

export type HomeItem = {
  icon?: ReactNode;
  text?: string;
  fn(setHomeMenu: setHomeMenuFn): void;
};
