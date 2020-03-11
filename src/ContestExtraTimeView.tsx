import * as React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faHourglassStart } from '@fortawesome/free-solid-svg-icons'
import ModalView from './ModalView';
import { Trans, useTranslation } from "react-i18next";
import { toast } from 'react-toastify'
import { AdminSession } from './admin.models';

type Props = {
  session: AdminSession
  status: {
    data: { start_time: string, end_time: string }
    extraTimeMinutes: () => number
  }
} & RouteComponentProps<any>

const ContestExtraTimeView = (props: Props) => {
  const [t] = useTranslation();

  React.useEffect(() => {
    props.session.pushObserver(this);
    
    return () => {
      props.session.popObserver(this);
    };
  })

  const setExtraTime = () => {
    if (!window.confirm(t("confirmation"))) return;

    const minutes = (refs.extraTimeForm as any).minutes.value;

    props.session.setExtraTime(minutes * 60).then(() => {
      // notify success
      toast.success(t("extra time done"))

      // redirect
      props.history.push("/admin")
    });
  };

  return (
    <ModalView contentLabel={t("logs.title")} returnUrl={"/admin"}>
      <form ref="extraTimeForm" onSubmit={(e) => { e.preventDefault(); setExtraTime() }}>
        <div className="modal-header">
          <h5 className="modal-title">
            {t("contest.extra time")}
          </h5>
          <Link to={"/admin"} role="button" className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </Link>
        </div>
        <div className="modal-body">
          <Trans i18nKey="contest.extratime disclamer" parent="p">
            You can set an extra time for all the contestants in case of problems that afflicts everyone. This action <em>is logged</em> and must be justified to the committee.
          </Trans>
          <div className="form-group mb-0">
            <label htmlFor="minutes">{t("contest.extra time")}:</label>
            <input
              id="minutes"
              name="minutes"
              type="number"
              className="form-control"
              required
              defaultValue={'' + props.status.extraTimeMinutes()}
            />
            <small className="form-text text-muted">{t("contest.in minutes")}</small>
          </div>
        </div>
        <div className="modal-footer">
          <Link to={"/admin"} role="button" className="btn btn-primary">
            <FontAwesomeIcon icon={faTimes} /> {t("close")}
          </Link>
          <button type="submit" className="btn btn-warning">
            <FontAwesomeIcon icon={faHourglassStart} /> {t("contest.Set extra time")}
          </button>
        </div>
      </form>
    </ModalView>
  );
};

export default withRouter(ContestExtraTimeView);