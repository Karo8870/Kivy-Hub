import { createContext, ReactNode, useContext, useState } from 'react';
import {
  Timer,
  TimerStack
} from '@/components/playground/widgets/timer-widget/timer-widget-types';
import { v4 as uuid } from 'uuid';

interface TimerWidgetContextInterface {
  stacks: TimerStack[];
  setStacks: (stacks: TimerStack[]) => void;

  addTimer(timer: Timer, stackID?: string): void;

  removeTimer(timerID: string): void;

  deleteStack(stackID: string): void;

  moveTimer(timerID: string, targetStackID?: string): void;
}

const timerWidgetContext = createContext<TimerWidgetContextInterface | null>(
  null
);

export function useTimerWidget() {
  const ctx = useContext(timerWidgetContext);

  if (!ctx) {
    throw new Error(
      'useTimerWidgetContext must be used within a TimerWidgetProvider'
    );
  }

  return ctx;
}

export function TimerWidgetProvider({ children }: { children: ReactNode }) {
  const [stacks, setStacks] = useState<TimerStack[]>([]);

  function addTimer(timer: Timer, stackID?: string) {
    setStacks((prev) => {
      if (stackID) {
        return prev.map((stack) =>
          stack.id === stackID
            ? { ...stack, timers: [...stack.timers, timer] }
            : stack
        );
      } else {
        const newStack: TimerStack = {
          id: uuid(),
          timers: [timer]
        };
        return [...prev, newStack];
      }
    });
  }

  function removeTimer(timerID: string) {
    setStacks((prev) =>
      prev
        .map((stack) => ({
          ...stack,
          timers: stack.timers.filter((timer) => timer.id !== timerID)
        }))
        .filter((stack) => stack.timers.length > 0)
    );
  }

  function deleteStack(stackID: string) {
    setStacks((prev) => prev.filter((stack) => stack.id !== stackID));
  }

  function moveTimer(timerID: string, targetStackID?: string) {
    setStacks((prev) => {
      let timerToMove: Timer | null = null;

      const newStacks = prev
        .map((stack) => {
          const remainingTimers = stack.timers.filter((timer) => {
            if (timer.id === timerID) {
              timerToMove = timer;
              return false;
            }
            return true;
          });
          return { ...stack, timers: remainingTimers };
        })
        .filter((stack) => stack.timers.length > 0);

      if (!timerToMove) return prev;

      if (targetStackID) {
        const targetIndex = newStacks.findIndex(
          (stack) => stack.id === targetStackID
        );
        if (targetIndex >= 0) {
          newStacks[targetIndex].timers.push(timerToMove);
        } else {
          newStacks.push({ id: targetStackID, timers: [timerToMove] });
        }
      } else {
        newStacks.push({ id: uuid(), timers: [timerToMove] });
      }

      return newStacks;
    });
  }

  return (
    <timerWidgetContext.Provider
      value={{
        stacks,
        setStacks,
        addTimer,
        removeTimer,
        deleteStack,
        moveTimer
      }}
    >
      {children}
    </timerWidgetContext.Provider>
  );
}
