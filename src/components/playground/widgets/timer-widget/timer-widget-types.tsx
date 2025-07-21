export interface TimerStack {
  id: string;
  timers: Timer[];
}

export interface Timer {
  id: string;
  title: string;
  totalTime: number;
}
