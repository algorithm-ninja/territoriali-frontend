import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faDownload } from '@fortawesome/free-solid-svg-icons'

import { CountdownView } from './datetime.views';
import { DateView } from './datetime.views';
import client from './TerryClient';
import PromiseView from './PromiseView';
import { notifyError } from './utils';
import { AdminSession } from './admin.models';
import ObservablePromise from './ObservablePromise';

type User = {
  extra_time: number
}

type Props = {
  session: AdminSession
  users: { data: { items: User[] } }
  status: {
    data: { start_time: string, end_time: string }
    extraTimeMinutes: () => number
  }
  pack: { data: { deletable: boolean } }
}

const tickRate = 1000;

const AdminSummaryView = (props: Props) => {
  const [ticker, setTicker] = React.useState(0);
  const [logsPromise, setLogsPromise] = React.useState<ObservablePromise | null>(null);
  const [t, i18n] = useTranslation();

  React.useEffect(() => {
    setLogsPromise(props.session.loadLogs({
      start_date: "2000-01-01T00:00:00.000",
      end_date: "2030-01-01T00:00:00.000",
      level: "WARNING",
    }));

    props.session.pushObserver(this);

    return () => {
      props.session.popObserver(this);
    }
  }, []);

  setTimeout(() => setTicker(ticker + 1), tickRate);

  const serverTime = () => (
    DateTime.local().minus(props.session.timeDelta)
  );

  const renderNotStarted = () => {
    return (
      <>
        <p>{t("contest.not started")}</p>
        <form ref="form" onSubmit={(e) => {
          e.preventDefault();
          props.session.startContest().then(() => {
            toast.success(t("contest started"))
          })
        }}>
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faPlay} /> {t("contest.start")}
          </button>
        </form>
      </>
    );
  }

  const renderRunning = () => (
    <ul className="mb-0">
      <li>{renderStartTime()}</li>
      <li>{renderCountdown()}</li>
    </ul>
  );

  const renderRunningExtraTime = () => (
    <ul className="mb-0">
      <li>{renderStartTime()}</li>
      <li>{renderEndTime()}</li>
      <li>{renderExtraTimeCountdown()}</li>
    </ul>
  );

  const renderFinished = () => (
    <>
      <ul>
        <li>{renderStartTime()}</li>
        <li>{renderEndTime()}</li>
        {renderExtraTimeEndTime()}
      </ul>

      <Link to={'/admin/download_results'} className="btn btn-primary">
        <FontAwesomeIcon icon={faDownload} /> {t("contest.download results")}
      </Link>
    </>
  );

  const countUsersWithExtraTime = () => (
    props.users.data.items.filter((user) => user.extra_time !== 0).length
  );

  const getStartTime = () => (
    DateTime.fromISO(props.status.data.start_time)
  );

  const getEndTime = () => (
    DateTime.fromISO(props.status.data.end_time)
  );

  const getUsersExtraTime = () => (
    Math.max.apply(null, props.users.data.items.map((user) => user.extra_time))
  );

  const getExtraTimeEndTime = () => (
    getEndTime().plus({ seconds: getUsersExtraTime() })
  );

  const isDeletable = () => (
    props.pack.data.deletable
  );

  const renderStartTime = () => {
    const startTime = getStartTime().setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT);
    return (
      <>
        {t("contest.started at")} {startTime}
      </>
    );
  };

  const renderCountdownExtra = () => {
    if (countUsersWithExtraTime() === 0) return;

    return <> (<span>{t("minutes more for some users", { count: getUsersExtraTime() / 60 })}</span>)</>;
  };

  const renderCountdown = () => {
    return (
      <>
        {t("contest.remaining time")} <CountdownView {...props} clock={() => props.session.serverTime()} end={getEndTime()} />
        {renderCountdownExtra()}
      </>
    );
  }

  const renderEndTime = () => {
    return (
      <>
        {t("contest.ended at")}
        {' '}
        {getEndTime().setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT)}
      </>
    );
  }

  const renderExtraTimeEndTime = () => {
    if (countUsersWithExtraTime() === 0) return null;

    return (
      <li>
        {t("contest.ended for everyone at")}
        {' '}
        {getExtraTimeEndTime().setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT)}
      </li>
    );
  }

  const renderExtraTimeCountdown = () => {
    const endTime = getExtraTimeEndTime();

    return (
      <>
        {t("contest.users remaining time")}
        {' '}
        <CountdownView {...props} clock={() => props.session.serverTime()} end={endTime} />
      </>
    );
  }
  
  const resetContest = () => {
    if (!window.confirm(t("confirmation"))) return;

    client
      .adminApi(props.session.adminToken(), "/drop_contest", {})
      .then(() => {
        // logout (just to delete the admin token)
        props.session.logout()
        // reload
        window.location.reload()
      })
      .catch((response: any) => {
        notifyError(response)
      });
  };

  return (
    <div className="container">
      <div className="card mb-3">
        <div className="card-body">
          <h3>{t("contest status")}</h3>
          {
            !props.status.data.start_time ? renderNotStarted() :
              serverTime() < getEndTime() ? renderRunning() :
                serverTime() < getExtraTimeEndTime() ? renderRunningExtraTime() :
                  renderFinished()
          }
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <h3>{t("system status")}</h3>
          <ul className="mb-0">
            <li>{logsPromise && <PromiseView promise={logsPromise}
              renderFulfilled={(logs) =>
                logs.items.length === 0 ? <React.Fragment>
                  {t("contest.no error recorded")}
                  {' '}
                  (<Link to="/admin/logs">{t("contest.show log")}</Link>)
                </React.Fragment> : <React.Fragment>
                    {t("contest.error recorded at")}
                    {' '}
                    <DateView
                      {...props}
                      clock={() => props.session.serverTime()}
                      date={DateTime.fromISO(logs.items[0].date)}
                    />
                    {' '}
                    (<Link to="/admin/logs">{t("contest.show log")}</Link>)
                </React.Fragment>
              }
              renderPending={() => t("loading")}
              renderRejected={() => t("error")}
            />}</li>
          </ul>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <h3>{t("contest.extra time management")}</h3>
          <ul className="mb-0">
            <li>
              {
                props.status.extraTimeMinutes() === 0 ? <React.Fragment>
                  {t("contest.no extra time set")}
                  {' '}
                  (<Link to="/admin/extra_time">{t("contest.set extra time")}</Link>)
                </React.Fragment> : <React.Fragment>
                    {t('minutes', { count: props.status.extraTimeMinutes() })}
                    {' '}
                    (<Link to="/admin/extra_time">{t("contest.set extra time")}</Link>)
                </React.Fragment>
              }
            </li>
            <li>
              {
                countUsersWithExtraTime() > 0 ? <React.Fragment>
                  {t("contest.users have extra time", { count: countUsersWithExtraTime() })}
                  {' '}
                  (<Link to="/admin/users">{t("contest.manage users")}</Link>)
                </React.Fragment> : <React.Fragment>
                    {t("contest.no user has extra time")}
                    {' '}
                    (<Link to="/admin/users">{t("contest.manage users")}</Link>)
                </React.Fragment>
              }
            </li>
          </ul>
        </div>
      </div>
      <div className="card mb-3 striped-background">
        <div className="card-body">
          <h3>Danger zone</h3>
          <button disabled={!isDeletable()} className="btn btn-danger" onClick={() => resetContest()}>RESET</button>
        </div>
      </div>
    </div>
  );
}

export default AdminSummaryView;