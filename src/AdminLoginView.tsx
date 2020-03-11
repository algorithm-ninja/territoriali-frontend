import * as React from 'react';
import { AdminSession } from './admin.models';
import { useTranslation } from 'react-i18next';
const ReactMarkdown = require('react-markdown');

type Props = {
  session: AdminSession
  pack: { data: { deletable: boolean, name: string, description: string } }
};

const AdminLoginView = (props: Props) => {
  const [t] = useTranslation();

  React.useEffect(() => {
    this.props.session.pushObserver(this);

    return () => {
      this.props.session.popObserver(this);
    };
  });

  const login = () => {
    const token = (refs.form as any).token.value
    props.session.login(token);
  }

  return (
    <div className="jumbotron admin-jumbotron">
      <h1 className="text-center display-3">{props.pack.data.name}</h1>
      <ReactMarkdown source={props.pack.data.description} />
      <hr />
      <h2 className="text-center">{t("login.please login")}</h2>
      <form ref="form" action="" onSubmit={e => { e.preventDefault(); login(); }}>
        <div className="form-group">
          <label htmlFor="token" className="sr-only">{t("login.token")}</label>
          <input name="token" id="token" className="form-control text-center" required
            placeholder={t("login.token")} />
        </div>
        <input type="submit" className="btn btn-danger" value={t("login.login")} />
      </form>
    </div>
  );
};

export default AdminLoginView;