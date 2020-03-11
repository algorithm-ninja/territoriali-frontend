import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import ValidationView from './ValidationView';
import FileView from './FileView';
import ModalView from './ModalView';
import "./SubmissionView.css";
import PromiseView from './PromiseView';
import { useTranslation } from 'react-i18next';
import { Submission } from './user.models';

type Props = {
  submission: Submission
} & RouteComponentProps<any>;

const SubmissionView = (props: Props) => {
  const { t } = useTranslation();

  React.useEffect(() => {
    props.submission.pushObserver(this);

    return () => {
      props.submission.popObserver(this);
    };
  }, []);

  const renderSourceAlert = (alert: any, i: number) => (
    <div key={i} className={"alert alert-" + alert.severity}>
      {alert.message}
    </div>
  );

  const renderSourceSelector = () => {
    if (!props.submission.source) {
      return (
        <div key="absent" className="custom-file mb-3 col-4">
          <input ref="source" name="source" type="file" id="source-file" className="custom-file-input" onChange={(_e) => props.submission.setSource((refs.source as any).files[0])} />
          <label className="custom-file-label" htmlFor="source-file">File sorgente...</label>
        </div>
      );
    } else {
      const source = props.submission.source;
      return (
        <div key="present" className="card card-outline-primary w-100 mb-3">
          <div className="card-header terry-submission-object-card">
            <h5 className="modal-subtitle">{t("submission.submit.source info")}</h5>
            <button key="present" className="terry-submission-object-drop btn btn-primary" onClick={() => props.submission.resetSource()}>
              <FontAwesomeIcon icon={faTrash} /> {t("submission.submit.change source")}
            </button>
          </div>
          <div className="card-body">
            <FileView {...props} file={source.file} />
            <PromiseView promise={props.submission.source.uploadPromise}
              renderFulfilled={(uploadedSource) => (
                <>
                  {uploadedSource.data.validation.alerts.map((a: any, i: number) => renderSourceAlert(a, i))}
                </>
              )}
              renderRejected={() => <p>{t("error")}</p>}
              renderPending={() => <p>{t("submission.submit.processing")}</p>}
            />
          </div>
        </div>
      );
    }
  };

  const renderOutputSelector = () => {
    if (!props.submission.output) {
      return (
        <div key="absent" className="custom-file col-4">
          <input ref="output" name="output" type="file" id="output-file" className="custom-file-input" onChange={() => props.submission.setOutput((refs.output as any).files[0])} />
          <label className="custom-file-label" htmlFor="output-file">File di output...</label>
        </div>
      );
    } else {
      const output = props.submission.output;
      return (
        <div key="present" className="card card-outline-primary w-100">
          <div className="card-header terry-submission-object-card">
            <h5 className="modal-subtitle">{t("submission.submit.output info")}</h5>
            <button key="present" className="btn btn-primary terry-submission-object-drop" onClick={() => props.submission.resetOutput()}>
              <FontAwesomeIcon icon={faTrash} /> {t("submission.submit.change output")}
            </button>
          </div>
          <div className="card-body">
            <FileView {...props} file={output.file} />
            <PromiseView promise={props.submission.output.uploadPromise}
              renderFulfilled={(uploadedOutput) => <ValidationView {...props} result={uploadedOutput.data.validation} />}
              renderRejected={() => <p>{t("error")}</p>}
              renderPending={() => <p>{t("submission.submit.processing")}</p>}
            />
          </div>
        </div>
      );
    }
  };

  const submit = () => (
    props.submission.submit().delegate.then((submission: any) => {
      console.error(submission);
      const taskName = submission.data.task;
      const id = submission.data.id;
      props.history.push("/task/" + taskName + "/submission/" + id);
    })
  );

  return (
    <ModalView contentLabel="Submission creation" returnUrl={"/task/" + props.submission.input.task}>
      <form
        className="submissionForm" ref="form" onSubmit={(e) => { e.preventDefault(); submit() }}
      // FIXME: after typescript switch, the following was shown to be wrong
      // disabled={!props.submission.canSubmit()}
      >
        <div className="modal-header">
          <h5 className="modal-title">
            {t("submission.submit.title")} <strong>{props.submission.input.id.slice(0, 6)}</strong>
          </h5>
          <Link to={"/task/" + props.submission.input.task} role="button" className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </Link>
        </div>
        <div className="modal-body">
          <div className="input-group">{renderSourceSelector()}</div>
          <div className="input-group">{renderOutputSelector()}</div>
        </div>
        <div className="modal-footer">
          {props.submission.isSubmitted() ? t("submission.submit.processing") : null}
          <Link to={"/task/" + props.submission.input.task} role="button" className="btn btn-danger">
            <FontAwesomeIcon icon={faTimes} /> {t("cancel")}
          </Link>
          <button type="submit" className="btn btn-success" disabled={!props.submission.canSubmit()}>
            <FontAwesomeIcon icon={faPaperPlane} /> {t("submission.submit.submit")}
          </button>
        </div>
      </form>
    </ModalView>
  );
};

export default SubmissionView;
