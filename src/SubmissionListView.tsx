import * as React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faTimes } from '@fortawesome/free-solid-svg-icons'
import { DateView } from './datetime.views';
import { DateTime } from 'luxon';
import client from './TerryClient';
import ModalView from './ModalView';
import * as ReactTooltip from 'react-tooltip';
import { colorFromScore } from "./utils";
import "./SubmissionListView.css";
import ScoreView from './ScoreView';
import PromiseView from './PromiseView';
import { useTranslation } from 'react-i18next';

type Props = {
  userState: any
  taskName: string
  model: any
};

const SubmissionListView = (props: Props) => {
  const { t } = useTranslation();

  const getTask = () => (
    props.userState.getTask(props.taskName)
  );

  const getListPromise = () => (
    props.userState.getTaskState(props.taskName).submissionListPromise
  );

  const renderSubmissionList = (list: any) => {
    const submissionList = [];

    for (let submission of list.items) {
      const cut = (s: string) => s.slice(s.lastIndexOf("/") + 1);
      submission.input.basename = cut(submission.input.path);
      submission.output.basename = cut(submission.output.path);
      submission.source.basename = cut(submission.source.path);

      submissionList.push(
        <tr key={submission.id}>
          <td>
            <DateView
              {...props}
              clock={() => props.model.serverTime()}
              date={DateTime.fromISO(submission.date)} />
            <br />
            <Link to={"/task/" + submission.task + "/submission/" + submission.id}>
              {t("submission.list.view details")}
            </Link>
          </td>
          <td>
            <ReactTooltip id={"input-" + submission.id} place="top" type="dark" effect="solid">
              {submission.input.basename}
            </ReactTooltip>
            <ReactTooltip id={"source-" + submission.id} place="top" type="dark" effect="solid">
              {submission.source.basename}
            </ReactTooltip>
            <ReactTooltip id={"output-" + submission.id} place="top" type="dark" effect="solid">
              {submission.output.basename}
            </ReactTooltip>

            <div className="btn-group bordered-group" role="group" aria-label="Download submission data">
              <a role="button" className="btn btn-light"
                aria-label={submission.input.basename}
                href={client.filesBaseURI + submission.input.path}
                download
                data-tip
                data-for={"input-" + submission.id}>
                <FontAwesomeIcon icon={faDownload} />
                {' '}
                <span className="hidden-md-down">{t("submission.list.input")}</span>
              </a>

              <a role="button" className="btn btn-light"
                aria-label={submission.source.basename}
                href={client.filesBaseURI + submission.source.path}
                download
                data-tip
                data-for={"source-" + submission.id}>
                <FontAwesomeIcon icon={faDownload} />
                {' '}
                <span className="hidden-md-down">{t("submission.list.source")}</span>
              </a>

              <a role="button" className="btn btn-light"
                aria-label={submission.output.basename}
                href={client.filesBaseURI + submission.output.path}
                download
                data-tip
                data-for={"output-" + submission.id}>
                <FontAwesomeIcon icon={faDownload} />
                {' '}
                <span className="hidden-md-down">{t("submission.list.output")}</span>
              </a>
            </div>
          </td>
          <td className={"alert-" + colorFromScore(submission.score, getTask().data.max_score)}>
            <ScoreView score={submission.score} max={getTask().data.max_score} size={1} />
          </td>
        </tr>
      );
    }

    return submissionList.reverse();
  };

  const renderBody = (list: any) => {
    if (list.items.length === 0)
      return <div className="modal-body"><em>{t("submission.list.no submissions")}</em></div>;

    return (
      <div className="modal-body no-padding">
        <table className="table terry-table">
          <thead>
            <tr>
              <th>{t("submission.list.date")}</th>
              <th>{t("submission.list.download")}</th>
              <th>{t("submission.list.score")}</th>
            </tr>
          </thead>
          <tbody>
            {renderSubmissionList(list)}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <ModalView contentLabel={t("submission.list.title")} returnUrl={"/task/" + props.taskName}>
      <div className="modal-header">
        <h5 className="modal-title">
          {t("submission.list.title")} <strong className="text-uppercase">{props.taskName}</strong>
        </h5>
        <Link to={"/task/" + props.taskName} role="button" className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </Link>
      </div>
      <PromiseView
        promise={getListPromise()}
        renderPending={() => <div className="modal-body"><em>{t("loading")}</em></div>}
        renderRejected={() => t("error")}
        renderFulfilled={(list) => renderBody(list)}
      />
      <div className="modal-footer">
        <Link to={"/task/" + props.taskName} role="button" className="btn btn-primary">
          <FontAwesomeIcon icon={faTimes} /> {t("close")}
        </Link>
      </div>
    </ModalView>
  );
};

export default SubmissionListView;
