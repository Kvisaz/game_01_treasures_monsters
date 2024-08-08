/**
 * Promise который можно вернуть сразу
 * но исполнится он только тогда, когда
 * будут напрямую заказаны resolve, reject
 */
export class Deferred<T> {
  public readonly promise: Promise<T>;
  public reject: (reason?: string) => void = () => {
  };
  public resolve: (value: T | PromiseLike<T>) => void = () => {
  };

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}