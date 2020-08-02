type Listener<T> = (val: T) => void;
type Unsubscriber = () => void;

// type ForceUpdateable = { //React.ComponentType<RouteComponentProps<any>>
//   forceUpdate: () => void
// }

export default class Observable<T> {
  private listeners: Listener<T>[] = [];

  constructor(private value: T) {}

  get(): T {
    return this.value;
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value;
    }
  }

  subscribe(listener: Listener<T>): Unsubscriber {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // pushObserver(o: ForceUpdateable) {
  //   if (this.observers.indexOf(o) >= 0) throw new Error();
  //   this.observers.push(o);
  // }

  // popObserver(o: ForceUpdateable) {
  //   if (this.observers.indexOf(o) < 0) throw new Error();
  //   this.observers.splice(this.observers.indexOf(o), 1);
  // }

  // fireUpdate() {
  //   this.propagateUpdate();
  // }

  // propagateUpdate() {
  //   const observers = [...this.observers];
  //   for (let o of observers) {
  //     o.forceUpdate();
  //   }
  // }

  // // Delegate for chaining observers
  // forceUpdate() {
  //   this.propagateUpdate();
  // }
}
