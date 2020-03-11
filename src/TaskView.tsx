import * as React from 'react';
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faDownload, faUpload } from '@fortawesome/free-solid-svg-icons'
import client from './TerryClient';
import { DateView } from './datetime.views';
import { DateTime } from 'luxon';
import CreateSubmissionView from './CreateSubmissionView';
import SubmissionListView from './SubmissionListView';
import SubmissionReportView from './SubmissionReportView';
import PromiseView from './PromiseView';
import TaskStatementView from './TaskStatementView';
import { useTranslation } from 'react-i18next';

type Props = {
  userState: any
  taskName: string
  model: any
} & RouteComponentProps<any>;

const TaskView = (props: Props) => {
  const { t } = useTranslation();

  React.useEffect(() => {
    props.model.pushObserver(this);
    getTaskState().pushObserver(this);
    getTask().pushObserver(this);

    return () => {
      props.model.popObserver(this);
      getTaskState().popObserver(this);
      getTask().popObserver(this);
    };
  }, []);
  
  const getTask = () => (
    props.userState.getTask(props.taskName)
  );

  const getTaskState = () => (
    props.userState.getTaskState(props.taskName)
  );

  const renderGenerateInputButton = () => {
    const button = (already: boolean) => (
      <button className="btn btn-success" onClick={() => getTaskState().generateInput()}>
        <FontAwesomeIcon icon={faPlus} />
        {' '}
        {
          already ? t("task.request new input") : t("task.request input")
        }
      </button>
    );

    // either "generate input" or "generate a new input", in case some input has already been generated
    // (we use PromiseView just because we need the list of submissions to be ready...)
    return (
      <PromiseView
        promise={getTaskState().submissionListPromise}
        renderPending={() => button(false)}
        renderFulfilled={(list) => button(list.items.length > 0)}
        renderRejected={(_error) => button(false)}
      />
    );
  };

  const renderCommands = () => {
    if (getTaskState().hasCurrentInput()) {
      const currentInput = getTaskState().getCurrentInput();
      return (
        <>
          <a role="button" className="btn btn-primary" href={client.filesBaseURI + currentInput.path} download>
            <FontAwesomeIcon icon={faDownload} /> {t("task.download input")}
          </a>
          {' '}
          <Link to={"/task/" + getTask().name + "/submit/" + currentInput.id} role="button" className="btn btn-success">
            <FontAwesomeIcon icon={faUpload} /> {t("task.upload solution")}
          </Link>
        </>
      );
    } else {
      if (getTaskState().isGeneratingInput()) {
        return (
          <PromiseView promise={getTaskState().inputGenerationPromise}
            renderPending={() =>
              <button disabled={true} className="btn btn-success">
                <FontAwesomeIcon icon={faPlus} /> {t("task.requesting")}
              </button>
            }
            renderRejected={() =>
              <button disabled={true} className="btn btn-success">
                <FontAwesomeIcon icon={faPlus} /> {t("error")}
              </button>
            }
            renderFulfilled={() => renderGenerateInputButton()}
          />
        );
      } else {
        return renderGenerateInputButton();
      }
    }
  }

  const renderTaskStatement = () => (
    <PromiseView promise={getTask().statementPromise}
      renderFulfilled={(statement) => <TaskStatementView task={getTask()} source={statement} />}
      renderPending={() => <p>{t("loading")}</p>}
      renderRejected={() => <p>{t("task.statement fail")}</p>}
    />;
  );

  const returnLastSubmissionInfo = (list: any) => {
    const items = list.items;
    
    if (items.length === 0) {
      return null;
    } else {
      const submission = items[items.length - 1];
      return (
        <div className="terry-submission-list-button">
          <strong>{t("task.last submission")}</strong> <DateView {...props} clock={() => props.model.serverTime()} date={DateTime.fromISO(submission.date)} />
          {' '}
          (<Link to={"/task/" + getTask().name + "/submissions"}>{t("task.view all")}</Link>)
        </div>
      );
    }
  }

  const renderSubmissionListButton = () => (
    <PromiseView
      promise={getTaskState().submissionListPromise}
      renderPending={() => null}
      renderFulfilled={(list) => returnLastSubmissionInfo(list)}
      renderRejected={(_error) => <div className="terry-submission-list-button">
        <em>{t("submission.list.load failed")}</em>
      </div>}
    />
  );

  return (
    <>
      <h1>{getTask().data.title}</h1>
      {renderCommands()}

      <Route path="/task/:taskName/submit/:inputId" render={
        ({ match }) => <CreateSubmissionView {...props} inputId={match.params.inputId} taskName={match.params.taskName} />
      }>
      </Route>
      <Route path="/task/:taskName/submissions" render={
        ({ match }) => <SubmissionListView {...props} taskName={match.params.taskName} />
      } />
      <Route path="/task/:taskName/submission/:submissionId" render={
        ({ match }) => <SubmissionReportView {...props} submissionId={match.params.submissionId} taskName={match.params.taskName} />
      } />

      {renderSubmissionListButton()}

      <hr />

      {renderTaskStatement()}
    </>
  );
};

export default TaskView;
