import * as React from 'react';
import * as filesize from 'filesize';
import { DateView } from './datetime.views';
import { DateTime } from "luxon";
import "./FileView.css";
import { useTranslation } from 'react-i18next';

type Props = {
  file: any
};

const FileView = (props: Props) => {
  const { t } = useTranslation();

  return (
    <dl className="terry-file-view">
      <dt>{t("submission.file.file")}</dt>
      <dd>{props.file.name}</dd>

      <dt>{t("submission.file.last update")}</dt>
      <dd>
        <DateView
          {...props}
          clock={() => DateTime.local()}
          date={DateTime.fromJSDate(props.file.lastModifiedDate)} />
      </dd>

      <dt>{t("submission.file.size")}</dt>
      <dd>{filesize(props.file.size, { standard: "iec" })}</dd>
    </dl>
  );
};

export default FileView;