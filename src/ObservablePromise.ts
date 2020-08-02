import Observable from './Observable';

export default class ObservablePromise<T> extends Observable<{
  result: T | null;
  error: unknown;
}> {
  private state: 'pending' | 'fulfilled' | 'rejected';

  constructor(promise: Promise<T>) {
    super({
      result: null,
      error: null
    });

    this.state = 'pending';

    promise.then((result) => {
      this.state = 'fulfilled';
      this.set({
        result: result,
        error: null
      });
    }, (error) => {
      this.state = 'rejected';
      this.set({
        result: null,
        error: error,
      });
    });
  }

  isPending() {
    return this.state === 'pending';
  }

  isFulfilled() {
    return this.state === 'fulfilled';
  }

  isRejected() {
    return this.state === 'rejected';
  }
}
