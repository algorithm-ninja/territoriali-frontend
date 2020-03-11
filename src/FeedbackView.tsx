import * as React from 'react';
import ResultView from './ResultView'
import { DateView } from './datetime.views';
import { DateTime } from 'luxon';
import ScoreView from './ScoreView';
import { TestCase } from './domain';
import { useTranslation } from 'react-i18next';

type Props = {
  submission: any
  userState?: any
  model: any
};

const FeedbackView = (props: Props) => {
  const { t } = useTranslation();

  const getColor = (c: TestCase) => (
    c.correct ? "success" : "danger"
  );

  const renderCaseSummary = (c: TestCase, id: number) => (
    <a href={"#case-" + id} className={"badge badge-" + getColor(c)}>{id}</a>
  );

  const renderCase = (c: TestCase, id: number) => (
    <li id={"case-" + id} key={id} className={"list-group-item list-group-item-" + getColor(c)}>
      <span>
        Case #<samp>{id}</samp>: <b>{c.correct ? t("submission.correct") : t("submission.wrong")}</b>
        <br />
        <pre>{c.message}</pre>
      </span>
    </li>
  );

  const ops = {
    renderCase: (c: TestCase, id: number) => renderCase(c, id),
    renderCaseSummary: (c: TestCase, id: number) => renderCaseSummary(c, id),
  };

  const submissionData = props.submission.data;
  const score = submissionData.score;
  const max_score = props.userState.getTask(submissionData.task).data.max_score;

  return (
    <div className="modal-body">
      <dl className="terry-file-view">
        <dt>{t("submission.feedback.date")}:</dt>
        <dd><DateView {...props} clock={() => props.model.serverTime()} date={DateTime.fromISO(submissionData.date)} /></dd>
        <dt style={{ 'marginTop': '0.75rem' }}>{t("submission.feedback.score")}:</dt>
        <dd>
          <ScoreView score={score} max={max_score} size={1} />
        </dd>
      </dl>
      <ResultView result={submissionData.feedback} {...props} {...ops} />
    </div>
  );
};

export default FeedbackView;
