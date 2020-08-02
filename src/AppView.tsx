import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom'
import client from './TerryClient'
import ContestView from './ContestView';
import LoadingView from "./LoadingView";
import PromiseView from './PromiseView';
import { Model } from './user.models';
import ObservablePromise from './ObservablePromise';
import { useTranslation } from 'react-i18next';

type Props = RouteComponentProps<any>

const AppView = (props: Props) => {
  const { t } = useTranslation();
  const [model, setModel] = React.useState(new Model());

  React.useEffect(() => {
    model.onAppStart();
    model.pushObserver(this);
    
    return () => {
      model.popObserver(this);
    };
  }, [model]);

  if (model.isLoggedIn()) {
    return model.userStatePromise && (
      <PromiseView promise={model.userStatePromise}
        renderPending={() => <LoadingView />}
        renderFulfilled={(userState) => (
          <ContestView {...props} model={model} userState={userState} />
        )}
        renderRejected={(_error) => <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">{t("error")}</h4>
          <p>{t("reload")}</p>
        </div>}
      />
    );
  }

  return (
    <PromiseView promise={new ObservablePromise(client.api("/admin/pack_status"))}
      renderPending={() => <LoadingView />}
      renderFulfilled={(response) => {
        if (response.data.uploaded)
          return (
            // <LoginView {...props} model={model} />
            <ContestView {...props} model={model} userState={null} />
          )
        else
          return <Redirect to='/admin' />
      }}
      renderRejected={(_error) =>
        // <LoginView {...props} model={model} />
        <ContestView {...props} model={model} userState={null} />
      }
    />
  );
};

export default AppView;
