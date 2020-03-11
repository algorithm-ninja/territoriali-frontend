import * as React from 'react';
import ObservablePromise from './ObservablePromise';

type Props = {
  promise: ObservablePromise;
  renderPending: () => React.ReactNode;
  renderFulfilled: (value: any) => React.ReactNode;
  renderRejected: (error: any) => React.ReactNode;
};

const PromiseView = (props: Props) => {
  // At least one handler should be provided
  // FIXME: do we really care?
  if (!props.renderFulfilled || !props.renderPending || !props.renderRejected) {
    throw Error();
  }

  // FIXME: promise should always be present, check and fix!

  React.useEffect(() => {
    props.promise && props.promise.pushObserver(this);
    
    return () => {
      props.promise && props.promise.popObserver(this);
    };
  }, [props.promise]);

  // FIXME: port this to hooks?
  //
  // componentWillReceiveProps(newProps: Props) {
  //   if (newProps.promise !== props.promise) {
  //     props.promise && props.promise.popObserver(this);
  //     newProps.promise && newProps.promise.pushObserver(this);
  //   }
  // }

  if (!props.promise) return null;

  if (props.promise.isPending()) return props.renderPending();
  if (props.promise.isFulfilled()) return props.renderFulfilled(props.promise.value);
  if (props.promise.isRejected()) return props.renderRejected(props.promise.error);

  return null;
};

export default PromiseView;
