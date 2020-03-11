import * as React from 'react';
import client from './TerryClient';

import * as ReactMarkdown from 'react-markdown';
import 'katex-all/dist/katex.min.css';
import './TaskStatementView.css';

const katex = require('katex-all/dist/katex.min.js')
const renderMathInElement = require('katex-all/dist/contrib/auto-render.min.js')

type Props = {
  task: any
  source: string
};

const TaskStatementView = (props: Props) => {
  const transformUri = (url: string) => {
    const taskBaseUri = props.task.data.statement_path.match(/.*\//)[0];
    return client.statementsBaseURI + taskBaseUri + url;
  };

  React.useEffect(() => {
    (window as any).katex = katex;

    renderMathInElement(refs.statement, {
      delimiters: [
        { left: "$", right: "$", display: false },
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
      ]
    });
  }, []);

  return (
    <div ref="statement" className="task-statement">
      <ReactMarkdown
        source={props.source}
        transformImageUri={transformUri.bind(this)}
        transformLinkUri={transformUri.bind(this)}
      />
    </div>
  );
};

export default TaskStatementView;
