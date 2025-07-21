type EventMap = {
  [eventName: string]: (...args: any[]) => void;
};

export class EventRegistry<T extends EventMap> {
  private events: {
    [K in keyof T]?: Set<T[K]>;
  } = {};

  on<K extends keyof T>(key: K, handler: T[K]): void {
    if (!this.events[key]) {
      this.events[key] = new Set();
    }
    this.events[key]!.add(handler);
  }

  off<K extends keyof T>(key: K, handler: T[K]): void {
    this.events[key]?.delete(handler);
    if (this.events[key]?.size === 0) {
      delete this.events[key];
    }
  }

  emit<K extends keyof T>(key: K, ...args: Parameters<T[K]>): void {
    this.events[key]?.forEach((handler) => {
      handler(...args);
    });
  }
}
