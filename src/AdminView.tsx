import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AdminSession } from "./admin.models";
import AdminLoginView from "./AdminLoginView";
import AdminLogsView from "./AdminLogsView";
import AdminSummaryView from "./AdminSummaryView";
import AdminUsersView from "./AdminUsersView";
import ContestExtraTimeView from "./ContestExtraTimeView";
import DownloadResultsView from "./DownloadResultsView";
import PromiseView from './PromiseView';
import { useTranslation } from 'react-i18next';
import Pack from './Pack';

type Props = {
  pack: Pack
}

const AdminView = (props: Props) => {
  const { t } = useTranslation();  // TODO: namespace "admin" ?

  const [session, setSession] = React.useState<AdminSession>(new AdminSession());

  React.useEffect(() => {
    session.onAppStart();
    session.pushObserver(this);
    
    return () => {
      session.popObserver(this);
    };
  })

  const renderNavBar = () => (
    <nav className="terry-navbar">
      <Link to="/admin" className="navbar-brand">{t("navbar.title")}</Link>
      <button className="terry-admin-logout-button btn btn-sm btn-light" onClick={(e) => { e.preventDefault(); session.logout() }}>
        <FontAwesomeIcon icon={faSignOutAlt} /> {t("navbar.logout")}
      </button>
    </nav>
  );

  if (!session.isLoggedIn()) {
    return <AdminLoginView session={session} {...props} />;
  }

  return (
    <>
      {renderNavBar()}
      <main>
        <PromiseView promise={session.statusPromise}
          renderPending={() => t("loading")}
          renderRejected={() => t("error")}
          renderFulfilled={(status) =>
            session.usersPromise && <PromiseView promise={session.usersPromise}
              renderPending={() => t("loading")}
              renderFulfilled={(users) =>
                <>
                  <AdminSummaryView
                    {...props}
                    session={session}
                    status={status}
                    users={users} />

                  <Route path="/admin/logs" render={
                    () => (
                      <AdminLogsView
                        {...props}
                        session={session} />
                    )
                  } />

                  <Route path="/admin/extra_time" render={
                    () => (
                      <ContestExtraTimeView
                        status={status}
                        session={session} />
                    )
                  } />

                  <Route path="/admin/users" render={
                    () => (
                      <AdminUsersView
                        session={session}
                        users={users} />
                    )
                  } />

                  <Route path="/admin/download_results" render={
                    () => (
                      <DownloadResultsView
                        session={session} />
                    )
                  } />
                </>
              }
              renderRejected={() => t("error")}
            />
          }
        />
      </main>
    </>
  );
};

export default AdminView;