/**
 *  State and event
 *  - emit for fire
 *  - on for subscribe
 *    - on return off (unsubscribe callback)
 *  - unsubscribeAll
 *  - getState for previous value
 *  - no async  - ожидание завершения обработчика на самом деле сложно и не тривиально
 *              - проще повесить action для обратной связи
 *
 *  - multiple subscribers
 */
export class StateEvent<TState> {
  public subscribers = new Set<StateObserver<TState>>();

  constructor(protected state?: TState) {}

  getState(): TState | undefined {
    return this.state;
  }

  on(callback: StateObserver<TState>): UnSubscriber {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  once(callback: StateObserver<TState>): UnSubscriber {
    const autoUnSub: StateObserver<TState> = (state) => {
      callback(state);
      this.subscribers.delete(autoUnSub);
    };
    this.subscribers.add(autoUnSub);
    return () => {
      this.subscribers.delete(autoUnSub);
    };
  }

  async await(): Promise<TState> {
    return new Promise<TState>((resolve) => this.once(resolve));
  }

  setState(state: TState) {
    this.subscribers.forEach((fn) => {
      fn(state);
    });
    this.state = state;
  }

  //Syntax sugar for Event case
  emit(data: TState) {
    this.setState(data);
  }

  unSubScribeAll() {
    this.subscribers.clear();
  }
}

/**
 * Всегда имеет значение по дефолту
 */
export class State<T> extends StateEvent<T> {
  constructor(protected state: T) {
    super(state);
  }

  getState(): T {
    return this.state;
  }
}

export type UnSubscriber = () => void;
export type StateObserver<TState> = (state: TState) => void;
