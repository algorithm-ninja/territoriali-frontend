import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { colorFromScore } from './utils';
import { Model } from './user.models';

type Props = {
  userState: any;
  taskName: string;
  model: Model;
};

const NavbarItemView = (props: Props) => {
  React.useEffect(() => {
    props.model.pushObserver(this);
    
    return () => {
      props.model.popObserver(this);
    };
  });

  const getMaxScore = () => (
    props.userState.getTask(props.taskName).data.max_score
  );

  const score = props.userState.data.tasks[props.taskName].score;
  const color = colorFromScore(score, getMaxScore());
  
  return (
    <li className="nav-item">
      <NavLink to={"/task/" + props.taskName} className="nav-link tasklist-item" activeClassName="active">
        <div className={"task-score-badge badge badge-pill badge-" + color}>
          {score}/{getMaxScore()}
        </div>
        <div className="task-list-item">{props.taskName}</div>
      </NavLink>
    </li>
  );
};

export default NavbarItemView;
