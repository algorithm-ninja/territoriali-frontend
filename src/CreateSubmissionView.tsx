import * as React from 'react';
import SubmissionView from './SubmissionView';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';

type Props = {
  userState: any
  taskName: string
  inputId: string
} & RouteComponentProps<any>;

const CreateSubmissionView = (props: Props) => {
  const { t } = useTranslation();
  const [submission, setSubmission] = React.useState();

  React.useEffect(() => {
    if (getTaskState().canSubmit(props.inputId)) {
      setSubmission(getTaskState().createSubmission(props.inputId));
    }
  }, []);

  const getTaskState = () => (
    props.userState.getTaskState(props.taskName)
  );

  if (submission === undefined) {
    return <p>{t("submission.cannot submit")}</p>;
  }

  return (
    <SubmissionView
      {...props}
      submission={submission}
    />
  );
};

export default CreateSubmissionView;