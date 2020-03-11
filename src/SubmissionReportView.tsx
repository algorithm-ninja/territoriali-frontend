import * as React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ModalView from './ModalView';
import FeedbackView from './FeedbackView';
import PromiseView from './PromiseView';
import ObservablePromise from './ObservablePromise';
import { Model } from './user.models';
import { useTranslation } from 'react-i18next';

type Props = {
  model: Model
  submissionId: string
  taskName: string
};

const SubmissionReportView = (props: Props) => {
  const { t } = useTranslation();
  const [submissionPromise] = React.useState<ObservablePromise>(props.model.getSubmissionPromise(props.submissionId));

  const returnUrl = "/task/" + props.taskName;
  return (
    <ModalView contentLabel="Submission creation" returnUrl={returnUrl}>
      <div className="modal-header">
        <h5 className="modal-title">
          {t("submission.feedback.title")} <strong>{props.submissionId}</strong>
        </h5>
        <Link to={returnUrl} role="button" className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </Link>
      </div>
      <PromiseView promise={submissionPromise}
        renderFulfilled={(submission) =>
          <React.Fragment>
            <FeedbackView {...props} submission={submission} />
            <div className="modal-footer">
              <Link to={returnUrl} role="button" className="btn btn-primary">
                <FontAwesomeIcon icon={faTimes} /> {t("close")}
              </Link>
            </div>
          </React.Fragment>
        }
        renderPending={() => <div className="modal-body">{t("loading")}</div>}
        renderRejected={() => <div className="modal-body">{t("error")}</div>}
      />
    </ModalView>
  );
};

export default SubmissionReportView;