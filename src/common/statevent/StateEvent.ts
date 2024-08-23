/**
 *  State and event
 *  - emit for fire
 *  - on for subscribe
 *    - on return off (unsubscribe callback)
 *    - look for changes for some fields (optional keys) -- 2024.08.11
 *  - unsubscribeAll
 *  - getState for previous value
 *  - no async  - ожидание завершения обработчика на самом деле сложно и не тривиально
 *              - проще повесить action для обратной связи
 *
 *  - multiple subscribers
 */
export class StateEvent<TState> {
  public subscribers = new Set<StateObserver<TState>>();
  protected prevState?: TState;

  constructor(protected state?: TState) {
  }

  getState(): TState | undefined {
    return this.state;
  }

  on(callback: StateObserver<TState>, keys?: keyof TState | (keyof TState)[]): UnSubscriber {
    const selectedCallback: StateObserver<TState> = keys == null ? callback : (state: TState) => {
      const observedKeys = Array.isArray(keys) ? keys : [keys];
      const { prevState } = this;

      // проверка что изменились некоторые ключи
      if (prevState == null || state == null || observedKeys.some(key => prevState[key] !== state[key])) {
        callback(state);
      }
    };

    this.subscribers.add(selectedCallback);
    return () => {
      this.subscribers.delete(selectedCallback);
    };
  }

  once(callback: StateObserver<TState>): UnSubscriber {
    const autoUnSub: StateObserver<TState> = (state) => {
      callback(state);
      this.subscribers.delete(autoUnSub);
    };
    return this.on(autoUnSub);
  }

  async await(): Promise<TState> {
    return new Promise<TState>((resolve) => this.once(resolve));
  }

  setState(state: TState) {
    this.prevState = this.state != null ? this.state : this.prevState;
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

  setState(state: StateReducer<T> | T) {
    this.prevState = this.state != null ? this.state : this.prevState;
    const newState = typeof state === "function" ? (state as StateReducer<T>)(this.state) : state;
    this.subscribers.forEach((fn) => {
      fn(newState);
    });
    this.state = newState;
  }
}

export type UnSubscriber = () => void;
export type StateObserver<TState> = (state: TState) => void;
export type StateReducer<TState> = (state: TState) => TState;
export type OnListener<TState> = (callback: StateObserver<TState>, keys?: keyof TState | (keyof TState)[]) => UnSubscriber
