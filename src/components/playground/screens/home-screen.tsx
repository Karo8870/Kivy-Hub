import { useTimerWidget } from '@/components/playground/widgets/timer-widget/timer-widget-context';
import { HandTrackingVideo } from '@/components/playground/dev/hand-tracking-video';
import { HomeWidget } from '@/components/playground/widgets/home-widget/home-widget';
import { StartCameraWidget } from '@/components/playground/widgets/start-camera-widget';
import { TimerWidgetStack } from '@/components/playground/widgets/timer-widget/timer-widget-stack';
import { cn } from '@/lib/utils';
import RecipeWidget from '@/components/playground/widgets/recipe-widget/recipe-widget';

export function HomeScreen({ active }: { active: boolean }) {
  const { stacks } = useTimerWidget();

  return (
    <div className={cn(!active && 'hidden')}>
      <HandTrackingVideo />
      <HomeWidget />
      <StartCameraWidget />
      <RecipeWidget />
      {stacks.map((stack) => (
        <TimerWidgetStack key={stack.id} timers={stack.timers} />
      ))}
    </div>
  );
}
