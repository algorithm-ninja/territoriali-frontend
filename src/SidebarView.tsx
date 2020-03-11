import * as React from 'react';
import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';
import { CountdownView } from './datetime.views';
import NavbarItemView from './NavbarItemView';
import ScoreView from './ScoreView';
import "./SidebarView.css";
import { useTranslation } from 'react-i18next';
import { Model } from './user.models';

type Props = {
  userState: any
  model: Model
};

const SidebarView = (props: Props) => {
  const { t } = useTranslation();

  return (
    <nav className="bg-light sidebar">
      <ul className="nav nav-pills flex-column">
        {props.userState && props.userState.data.contest.has_started &&
          <React.Fragment>
            <li className="nav-item title">
              <h5 className="text-uppercase">{t("navbar.total score")}</h5>
              <ScoreView
                style={{ 'textAlign': 'right', 'marginRight': '1rem' }}
                score={props.userState.data.total_score}
                max={props.userState.data.contest.max_total_score}
                size={2} />
            </li>

            <li className="divider-vertical" />

            <li className="nav-item title">
              <h5 className="text-uppercase">{t("remaining time")}</h5>
              <p className="terry-remaining-time">
                <CountdownView {...props} clock={() => props.model.serverTime()} end={
                  DateTime.fromISO(props.userState.data.end_time)
                } afterEnd={
                  () => <span>{t("contest finished")}</span>
                } />
              </p>
            </li>
            <li className="divider-vertical" />

            <li className="nav-item title">
              <h5 className="text-uppercase">{t("navbar.task list")}</h5>
            </li>
            <li className="divider-vertical" />

            {props.userState.data.contest.tasks.map((task: any, i: number) => <NavbarItemView key={i} taskName={task.name} {...props} />)}

            <li className="divider-vertical" />
          </React.Fragment>
        }

        <li className="nav-item title mt-3">
          <h5 className="text-uppercase">{t("navbar.resources")}</h5>
        </li>

        <li className="nav-item">
          <NavLink to={"/useful-info"} className="nav-link tasklist-item" activeClassName="active">Informazioni utili</NavLink>
          <NavLink to={"/documentation"} className="nav-link tasklist-item" activeClassName="active">Documentazione</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarView;
