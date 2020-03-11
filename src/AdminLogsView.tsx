import * as React from 'react';
import { Object } from 'core-js';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ModalView from './ModalView';
import "./AdminLogsView.css";
import PromiseView from './PromiseView';
import { AbsoluteDateView } from './datetime.views';
import { DateTime } from 'luxon';
import { AdminSession } from './admin.models';
import ObservablePromise from './ObservablePromise';
import { useTranslation } from 'react-i18next';


const LOG_LEVELS: any = {
  DEBUG: {
    color: 'secondary',
  },
  INFO: {
    color: 'info',
  },
  WARNING: {
    color: 'warning',
  },
  ERROR: {
    color: 'danger',
  },
}

type LogItem = {
  level: string
  category: string
  message: string
  date: string
}

type Props = {
  session: AdminSession
}

type State = {
  level: string
  category: string
  filter: string
}

const refreshRate = 5000;

const AdminLogsView = (props: Props) => {
  const [logsPromise, setLogsPromise] = React.useState<ObservablePromise | null>(null);
  const [refreshLogsPromise, setRefreshLogsPromise] = React.useState<ObservablePromise | null>(null);
  const [level, setLevel] = React.useState('INFO');
  const [category, setCategory] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [t] = useTranslation();

  React.useEffect(() => {
    loadLogs();
  }, [level, category]);

  setTimeout(() => refreshLogs(), 5000);

  const loadLogs = () => {
    setRefreshLogsPromise(null);
    setLogsPromise(doLoadLogs());
  };

  const doLoadLogs = () => {
    const options: any = {
      start_date: "2000-01-01T00:00:00.000",
      end_date: "2030-01-01T00:00:00.000",
      level: level
    };

    if (category) {
      options.category = category;
    }

    return props.session.loadLogs(options);
  };

  const refreshLogs = () => {
    const promise = doLoadLogs();
    setRefreshLogsPromise(promise);
    refreshLogsPromise.delegate.then(() => {
      if (refreshLogsPromise !== promise) return;
      setLogsPromise(promise);
    })
  };

  const filterLogs = (log: LogItem) => {
    if (!filter) return true;
    return log.message.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  };

  return (
    <ModalView contentLabel={t("logs.title")} returnUrl={"/admin"}>
      <div className="modal-header">
        <h5 className="modal-title">
          {t("logs.title")}
        </h5>
        <Link to={"/admin"} role="button" className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </Link>
      </div>
      <div className="modal-body no-padding">
        <div className="form-group p-2 mb-0">
          <div className="btn-group mb-1" role="group" aria-label="Choose log level">
            {Object.entries(LOG_LEVELS).map(([level, obj]) => (
              <button
                key={level}
                className={[
                  'btn',
                  ((state.level === level) ? 'active' : ''),
                  'btn-' + obj.color
                ].join(' ')}
                onClick={() => setLevel(level)}
              >
                {t("logs.levels." + level)}
              </button>
            ))}
          </div>
          <input
            placeholder={t("logs.category filter")} className="form-control mb-1" value={state.category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input placeholder={t("logs.message filter")} className="form-control" value={state.filter}
            onChange={(e) => setFilter(e.target.value)} />
        </div>
        <div className="terry-log-table no-padding">
          <table className="table">
            <thead>
              <tr>
                <th>{t("logs.date")}</th>
                <th>{t("logs.category")}</th>
                <th>{t("logs.level")}</th>
                <th>{t("logs.message")}</th>
              </tr>
            </thead>
            <tbody>
              <PromiseView promise={logsPromise}
                renderFulfilled={(logs: { items: LogItem[] }) => {
                  const items = logs.items.filter((l) => filterLogs(l));
                  if (items.length === 0) return <tr><td colSpan={4}>{t("no messages yet")}</td></tr>;
                  return items.map((log, i) =>
                    <tr key={i} className={"table-" + LOG_LEVELS[log.level].color}>
                      <td>
                        <AbsoluteDateView {...props} clock={() => props.session.serverTime()} date={DateTime.fromISO(log.date)} />
                      </td>
                      <td>
                        <button className="btn btn-link" onClick={() => { setCategory(log.category) }}>
                          {log.category}
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-link" onClick={() => { setLevel(log.level) }}>
                          {t("logs.levels." + log.level)}
                        </button>
                      </td>
                      <td><pre>{log.message}</pre></td>
                    </tr>
                  );
                }}
                renderPending={() => <tr><td colSpan={4}>{t("loading")}</td></tr>}
                renderRejected={() => <tr><td colSpan={4}>{t("error")}</td></tr>}
              />
            </tbody>
          </table>
        </div>
      </div>
      <div className="modal-footer">
        <Link to={"/admin"} role="button" className="btn btn-primary">
          <FontAwesomeIcon icon={faTimes} /> {t("close")}
        </Link>
      </div>
    </ModalView>
  );
};

export default AdminLogsView;
