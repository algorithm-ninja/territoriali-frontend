import * as React from 'react';
import { DateTime } from "luxon";
import * as moment from "moment";
import { useTranslation } from 'react-i18next';

type Props = {
  rate: number
  render: () => JSX.Element
};

const AutoRefreshView = (props: Props) => {
  const [ticker, setTicker] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => setTicker(ticker + 1), props.rate);
  });

  return props.render();
};

type DateViewProps = {
  date: DateTime
  clock: () => DateTime
};

export const DateView = (props: DateViewProps) => {
  const { i18n } = useTranslation();

  return (
    <AutoRefreshView
      rate={30000}
      render={() => (
        <abbr title={props.date.setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}>
          {moment(props.date.toISO()).locale(i18n.language).from(moment(props.clock().toISO()))}
        </abbr>
      )}
    />
  );
};

export const AbsoluteDateView = (props: DateViewProps) => {
  const { i18n } = useTranslation();

  return (
    <AutoRefreshView rate={30000} render={() =>
      <abbr title={moment(props.date.toISO()).locale(i18n.language).from(moment(props.clock().toISO()))}>
        {props.date.setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
      </abbr>
    } />
  );
};

type CountDownProps = {
  end: DateTime
  clock: () => DateTime
  afterEnd?: React.ReactNode
};

const tickRate = 1000;

export const CountdownView = (props: CountDownProps) => {
  const { t } = useTranslation();
  const [ticker, setTicker] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => setTicker(ticker + 1), tickRate);
  });

  return (
    <AutoRefreshView
      rate={30000}
      render={() => props.end.diff(props.clock()).as("milliseconds") < 0 ? (
        <span>{t("contest finished")}</span>
      ) : (
        <span>{props.end.diff(props.clock()).toFormat("hh:mm:ss")}</span>
      )}
    />
  );
};
