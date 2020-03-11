import * as React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import ModalView from './ModalView';
import client from './TerryClient';
import { AdminSession } from './admin.models';
import { useTranslation } from 'react-i18next';

type Props = {
  session: AdminSession
};

const DownloadResultsView = (props: Props) => {
  const { t } = useTranslation();
  const [data, setData] = React.useState(null);
  const [loadPromise, setLoadPromise] = React.useState<Promise<void> | null>(null);

  React.useEffect(() => {
    setLoadPromise(
      client.adminApi(props.session.adminToken(), "/download_results")
        .then((response) => {
          setData(response.data);
          setLoadPromise(null);
        }, (_response) => {
          // Promise.reject(response);
          setLoadPromise(null);
        })
    );

    props.session.pushObserver(this);
    
    return () => {
      props.session.popObserver(this);
    }
  });

  const renderDownloadButton = () => {
    if (loadPromise !== null)
      return <h3>{t("generating zip")}</h3>;

    return (
      <a role="button" className="btn btn-success btn-lg" href={client.filesBaseURI + data.path} download>
        <FontAwesomeIcon icon={faTrophy} />
        {' '}
        {t("contest.download results")}
        {' '}
        <FontAwesomeIcon icon={faTrophy} />
      </a>
    );
  };

  return (
    <ModalView contentLabel={t("logs.title")} returnUrl={"/admin"}>
      <div className="modal-header">
        <h5 className="modal-title">
          {t("contest.download results")}
        </h5>
        <Link to={"/admin"} role="button" className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </Link>
      </div>
      <div className="modal-body">
        <div className="mb-3">
          {t("contest.download results description")}
        </div>
        {renderDownloadButton()}
      </div>
    </ModalView>
  );
};

export default DownloadResultsView;