'use client';

import { HandTrackingProvider } from '@/lib/core/hand-tracking/hand-tracking-context';
import { MultiProvider } from '@/components/playground/misc/multi-provider';
import { ScreenProvider } from '@/lib/core/screens/screen-context';
import '@/lib/fontawesome/css/fa.css';
import { TimerWidgetProvider } from '@/components/playground/widgets/timer-widget/timer-widget-context';
import { RecipeWidgetProvider } from '@/components/playground/widgets/recipe-widget/recipe-widget-context';

export default function () {
  return (
    <MultiProvider
      providers={[
        HandTrackingProvider,
        TimerWidgetProvider,
        RecipeWidgetProvider
      ]}
    >
      <ScreenProvider />
    </MultiProvider>
  );
}
