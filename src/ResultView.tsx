import * as React from 'react';
import { TestCase } from './domain';

type Props = {
  result: any
  renderCase: (c: TestCase, i: number) => React.ReactNode
  renderCaseSummary: (c: TestCase, i: number) => any
};

const ResultView = (props: Props) => (
  <>
    <ul className="list-unstyled">
      {props.result.alerts.map((a: any, i: number) => <li key={i}>
        <div className={"alert alert-" + a.severity} role="alert">
          <samp>{a.code}</samp> <strong>{a.severity.toUpperCase()}</strong>: {a.message}
        </div>
      </li>)}
    </ul>
    <dl className="terry-file-view">
      <dt>Dettagli:</dt>
      <dd>
        <ul className="list-inline mb-0">
          {props.result.cases.map((c: TestCase, i: number) => <li className="list-inline-item" key={i}>{props.renderCaseSummary(c, i + 1)}</li>)}
        </ul>
      </dd>
    </dl>
    <div className="result-detail">
      <ul className="list-group">
        {props.result.cases.map((c: TestCase, i: number) => props.renderCase(c, i + 1))}
      </ul>
    </div>
  </>
);

export default ResultView;