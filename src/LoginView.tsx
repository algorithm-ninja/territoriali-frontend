import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from './user.models';
import PromiseView from './PromiseView';

type Props = {
  model: Model
};

const LoginView = (props: Props) => {
  const { t } = useTranslation();

  React.useEffect(() => {
    props.model.pushObserver(this);
    
    return () => {
      props.model.popObserver(this);
    };
  });

  const login = () => {
    props.model.login((refs.form as any).token.value);
  };

  return (
    <div className="jumbotron">
      <h1 className={"text-center"}>{t("login.please login")}</h1>
      <form ref="form" action="" onSubmit={e => { e.preventDefault(); login(); }}>
        <div className="form-group">
          <label htmlFor="token" className="sr-only">{t("login.token")}</label>
          <input autoComplete="off" name="token" id="token" className="form-control text-center" required
            placeholder={t("login.token")} type="text" />
        </div>
        <input type="submit" className="btn btn-primary" value={t("login.login")} />
        {props.model.lastLoginAttempt &&
          <PromiseView promise={props.model.lastLoginAttempt}
            renderPending={() => <span>{t("loading")}</span>}
            renderRejected={(error) =>
              <div className="alert alert-danger" role="alert">
                <strong>{t("login.error")}</strong> {error.response && error.response.data.message}
              </div>
            }
            renderFulfilled={() => null}
          />
        }
      </form>
    </div>
  );
};

export default LoginView;
