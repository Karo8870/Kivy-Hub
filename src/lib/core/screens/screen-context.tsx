import { createContext, ReactNode, useContext, useState } from 'react';
import { HomeScreen } from '@/components/playground/screens/home-screen';
import { MeasureScreen } from '@/components/playground/screens/measure-screen';
import { HandCursors } from '@/components/playground/dev/hand-cursors';
import { CalibrationScreen } from '@/components/playground/screens/calibration-screen';
import { CircleCutScreen } from '@/components/playground/screens/circle-cut-screen';
import { RectangleCutScreen } from '@/components/playground/screens/rectangle-cut-screen';

interface ScreenContextInterface {
  setSelectedScreen: (screenID: string) => void;
}

const screenContext = createContext<ScreenContextInterface | null>(null);

export function useScreenContext() {
  const ctx = useContext(screenContext);

  if (!ctx) {
    throw new Error('useScreenContext must be used within a ScreenProvider');
  }

  return ctx;
}

interface Screen {
  id: string;
  Component: ({ active }: { active: boolean }) => ReactNode;
}

const screens: Screen[] = [
  {
    id: 'main',
    Component: HomeScreen
  },
  {
    id: 'measure',
    Component: MeasureScreen
  },
  {
    id: 'calibration',
    Component: CalibrationScreen
  },
  {
    id: 'circle-cut',
    Component: CircleCutScreen
  },
  {
    id: 'rectangle-cut',
    Component: RectangleCutScreen
  }
] as const;

export function ScreenProvider() {
  const [selectedScreen, setSelectedScreen] =
    useState<(typeof screens)[number]['id']>('main');

  return (
    <screenContext.Provider
      value={{
        setSelectedScreen
      }}
    >
      {screens.map((screen) => (
        <screen.Component
          active={selectedScreen === screen.id}
          key={screen.id}
        />
      ))}
      <HandCursors />
    </screenContext.Provider>
  );
}
