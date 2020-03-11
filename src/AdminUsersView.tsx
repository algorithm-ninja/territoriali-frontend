import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faHourglassStart } from '@fortawesome/free-solid-svg-icons'
import ModalView from './ModalView';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import { AdminSession } from './admin.models';
import { useTranslation } from 'react-i18next';

type UserExtraTimeProps = {
  session: AdminSession
  user: any
}

const UserExtraTimeView = (props: UserExtraTimeProps) => {
  const [t] = useTranslation();
  
  const setExtraTime = () => {
    if (!window.confirm(t("confirmation"))) return;

    const minutes = (refs.form as any).minutes.value
    props.session.setExtraTime(minutes * 60, props.user.token);

    // show success
    toast.success(t("user extra time done"))
  };

  const extraTimeMinutes = () => (
    Math.round(props.user.extra_time / 60)
  );

  return (
    <form ref="form" className="form-inline" onSubmit={e => { e.preventDefault(); setExtraTime() }}>
      <input name="minutes" type="number" className="form-control mr-sm-2" defaultValue={'' + extraTimeMinutes()} />
      <button type="submit" className="btn btn-warning">
        <FontAwesomeIcon icon={faHourglassStart} /> {t("users.set")}
      </button>
    </form>
  );
};

type AdminUsersProps = {
  session: AdminSession
  users: { data: { items: any[] } }
};

const AdminUsersView = (props: AdminUsersProps) => {
  const [t] = useTranslation();

  React.useEffect(() => {
    props.session.pushObserver(this);

    return () => {
      props.session.popObserver(this);
    };
  });

  const renderUser = (user: any, i: number) => {
    const ips = user.ip
      .map((ip: any, i: number) => <abbr key={i} title={new Date(ip.first_date).toLocaleString()}>{ip.ip}</abbr>)
      .map((item: any, i: number) => i === 0 ? [item] : [<span> - </span>, item]);
    
    return (
      <tr key={i}>
        <td>{user.name}</td>
        <td>{user.surname}</td>
        <td>{user.token}</td>
        <td>{ips}</td>
        <td><UserExtraTimeView {...props} user={user} /></td>
      </tr>
    );
  };

  return (
    <ModalView contentLabel={t("users.title")} returnUrl={"/admin"}>
      <div className="modal-header">
        <h5 className="modal-title">
          {t("users.title")}
        </h5>
        <Link to={"/admin"} role="button" className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </Link>
      </div>
      <div className="modal-body no-padding">
        <table className="table terry-table">
          <thead>
            <tr>
              <th>{t("users.name")}</th>
              <th>{t("users.surname")}</th>
              <th>{t("users.token")}</th>
              <th>{t("users.ips")}</th>
              <th>{t("users.extra time")} <small>{t("users.in minutes")}</small></th>
            </tr>
          </thead>
          <tbody>
            {props.users.data.items.map((user, i) => renderUser(user, i))}
          </tbody>
        </table>
      </div>
      <div className="modal-footer">
        <Link to={"/admin"} role="button" className="btn btn-primary">
          <FontAwesomeIcon icon={faTimes} />  {t("close")}
        </Link>
      </div>
    </ModalView>
  );
};

export default AdminUsersView;
