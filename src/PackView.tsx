import * as React from 'react';
import Pack from "./Pack";
import LoadingView from "./LoadingView";
import UploadPackView from "./UploadPackView";
import AdminView from "./AdminView";
import { RouteComponentProps } from 'react-router';

type Props = RouteComponentProps<any>

const PackView = (props: Props) => {
  const [pack, setPack] = React.useState(new Pack());

  React.useEffect(() => {
    pack.onAppStart();
    pack.pushObserver(this);
    
    return () => {
      pack.popObserver(this);
    };
  });

  if (pack.isLoading()) return <LoadingView />;
  // FIXME: use a proper ErrorView or similar
  if (!pack.isLoaded()) return <p>An error occurred: {pack.error.message}</p>;

  if (pack.data.uploaded) {
    return <AdminView {...props} pack={pack} />;
  } else {
    return <UploadPackView {...props} pack={pack} />;
  }
}

export default PackView;
