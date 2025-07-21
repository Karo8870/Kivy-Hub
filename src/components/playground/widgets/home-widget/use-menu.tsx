import {
  HomeMenu,
  setHomeMenuFn
} from '@/components/playground/widgets/home-widget/home-widget-types';
import { useEffect, useRef, useState } from 'react';
import { useTimerWidget } from '@/components/playground/widgets/timer-widget/timer-widget-context';
import { v4 as uuid } from 'uuid';
import { TimerStack } from '@/components/playground/widgets/timer-widget/timer-widget-types';
import { useScreenContext } from '@/lib/core/screens/screen-context';
import { useRecipeWidget } from '@/components/playground/widgets/recipe-widget/recipe-widget-context';
import {
  chickenDish,
  healthy,
  pizza,
  salad,
  soup
} from '@/components/playground/widgets/recipe-widget/recipes';

export function useMenu() {
  const { addTimer, stacks } = useTimerWidget();
  const { setSelectedScreen } = useScreenContext();
  const { setRecipe } = useRecipeWidget();

  const stacksRef = useRef<TimerStack[]>([]);

  useEffect(() => {
    stacksRef.current = stacks;
  }, [stacks]);

  const mainMenu: HomeMenu = {
    items: [
      {
        icon: <i className='fa fa-timer text-6xl' />,
        fn(setHomeMenu: setHomeMenuFn) {
          setHomeMenu(timerMenu);
        }
      },
      {
        icon: <i className='fa fa-ruler text-6xl' />,
        fn() {
          setSelectedScreen('measure');
        }
      },
      {
        icon: <i className='fa fa-knife text-6xl' />,
        fn(setHomeMenu: setHomeMenuFn) {
          setHomeMenu(cutterMenu);
        }
      },
      {
        icon: <i className='fa fa-book text-6xl' />,
        fn(setHomeMenu: setHomeMenuFn) {
          setHomeMenu(recipeMenu);
        }
      },
      {
        icon: <i className='fa fa-gears text-6xl' />,
        fn() {
          setSelectedScreen('calibration');
        }
      }
    ],
    showBack: false
  };

  const timerMenu: HomeMenu = {
    items: [
      {
        text: '5m',
        fn() {
          addTimer(
            {
              id: uuid(),
              title: 'Timer',
              totalTime: 60 * 5
            },
            stacksRef.current?.[0]?.id ?? undefined
          );

          setHomeMenu(mainMenu);
        }
      },
      {
        text: '15m',
        fn(setHomeMenu: setHomeMenuFn) {
          addTimer(
            {
              id: uuid(),
              title: 'Timer',
              totalTime: 60 * 15
            },
            stacksRef.current?.[0]?.id ?? undefined
          );

          setHomeMenu(mainMenu);
        }
      },
      {
        text: '30m',
        fn(setHomeMenu: setHomeMenuFn) {
          addTimer(
            {
              id: uuid(),
              title: 'Timer',
              totalTime: 60 * 30
            },
            stacksRef.current?.[0]?.id ?? undefined
          );

          setHomeMenu(mainMenu);
        }
      },
      {
        text: '1h',
        fn(setHomeMenu: setHomeMenuFn) {
          addTimer(
            {
              id: uuid(),
              title: 'Timer',
              totalTime: 60 * 60
            },
            stacksRef.current?.[0]?.id ?? undefined
          );

          setHomeMenu(mainMenu);
        }
      }
    ],
    text: 'Timer',
    icon: <i className='fa fa-timer text-6xl' />,
    showBack: true,
    backFn(setHomeMenu: setHomeMenuFn) {
      setHomeMenu(mainMenu);
    }
  };

  const cutterMenu: HomeMenu = {
    items: [
      {
        icon: <i className='fa-regular fa-circle text-6xl' />,
        fn() {
          setSelectedScreen('circle-cut');
        }
      },
      {
        icon: <i className='fa-regular fa-rectangle text-6xl' />,
        fn() {
          setSelectedScreen('rectangle-cut');
        }
      }
    ],
    text: 'Cutter',
    icon: <i className='fa fa-knife text-6xl' />,
    showBack: true,
    backFn(setHomeMenu: setHomeMenuFn) {
      setHomeMenu(mainMenu);
    }
  };

  const recipeMenu: HomeMenu = {
    items: [
      {
        icon: <i className='fa fa-drumstick text-6xl' />,
        fn() {
          setRecipe(chickenDish);
        }
      },
      {
        icon: <i className='fa fa-salad text-6xl' />,
        fn() {
          setRecipe(salad);
        }
      },
      {
        icon: <i className='fa fa-soup text-6xl' />,
        fn() {
          setRecipe(soup);
        }
      },
      {
        icon: <i className='fa fa-pizza text-6xl' />,
        fn() {
          setRecipe(pizza);
        }
      },
      {
        icon: <i className='fa fa-avocado text-6xl' />,
        fn() {
          setRecipe(healthy);
        }
      }
    ],
    text: 'Recipes',
    icon: <i className='fa fa-book text-6xl' />,
    showBack: true,
    backFn(setHomeMenu: setHomeMenuFn) {
      setHomeMenu(mainMenu);
    }
  };

  const [homeMenu, setHomeMenu] = useState<HomeMenu>(mainMenu);

  return { homeMenu, setHomeMenu, mainMenu };
}
