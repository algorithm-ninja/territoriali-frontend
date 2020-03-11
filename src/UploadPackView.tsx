import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Pack from './Pack';

type Props = {
  pack: Pack
};

const UploadPackView = (props: Props) => {
  const { t } = useTranslation();  // TODO: namespace "admin" ?

  React.useEffect(() => {
    props.pack.pushObserver(this);
    
    return () => {
      props.pack.popObserver(this);
    };
  });

  const upload = () => {
    props.pack.upload((refs.form as any).file.files[0]);
  }

  return (
    <div className="jumbotron admin-jumbotron">
      <h1 className="text-center display-3">{t("navbar.title")}</h1>
      <hr />
      <h2 className="text-center">{t("upload pack.select file")}</h2>
      <form ref="form" action="" onSubmit={e => { e.preventDefault(); upload(); }}>
        <div className="form-group">
          <label htmlFor="file" className="sr-only">{t("upload pack.file")}</label>
          <input type="file" accept=".enc" name="file" id="file" className="form-control" required />
        </div>
        <input type="submit" className="btn btn-danger" value={t("upload pack.upload")} />
      </form>
    </div>
  );
};

export default UploadPackView;
