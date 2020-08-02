import * as React from 'react';
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import * as ReactMarkdown from 'react-markdown';
import { Trans, useTranslation } from 'react-i18next';
import TaskView from './TaskView';
import SidebarView from './SidebarView';
import { Model } from './user.models';
import client from './TerryClient';
import LoginView from './LoginView';

type Props = {
  userState: any
  model: Model
} & RouteComponentProps<any>;

const DETECT_INTERNET_TEST_ENDPOINT = process.env.REACT_APP_DETECT_INTERNET_TEST_ENDPOINT || null;
const DETECT_INTERNET_TEST_CONTENT = process.env.REACT_APP_DETECT_INTERNET_TEST_CONTENT || null;

const ContestView = (props: Props) => {
  const { t } = useTranslation();
  const [detectInternetInterval, setDetectInternetInterval] = React.useState<NodeJS.Timer | null>(null);

  const detectInternet = async (endpoint: string) => {
    console.log(`Testing internet connection (${DETECT_INTERNET_TEST_ENDPOINT})...`);
    try {
      const res = await fetch(endpoint, {
        mode: "no-cors",
      });
      const content = await res.text();
      if (content !== DETECT_INTERNET_TEST_CONTENT) {
        console.log(`Invalid content ${content}`);
      }
    } catch(e) {
      console.log(`No internet connection (${e})`);
      return;
    }
    console.log(`Internet connection detected. Reporting.`);

    const data = new FormData();

    data.append("token", props.model.userToken());

    await client.api.post("/internet_detected", data)
  };

  React.useEffect(() => {
    if(DETECT_INTERNET_TEST_ENDPOINT !== null) {
      detectInternet(DETECT_INTERNET_TEST_ENDPOINT);
      setDetectInternetInterval(setInterval(() => detectInternet(DETECT_INTERNET_TEST_ENDPOINT), 10 * 60 * 1000));
    }

    return () => {
      if (detectInternetInterval !== null) {
        clearInterval(detectInternetInterval);
      }
    };
  }, []);

  const getBody = () => (
    <>
      <SidebarView {...props} />
      <main>
        <Route exact path={'/useful-info'} render={() =>
          <>
            <h1>Informazioni utili</h1>
            <hr />
            <p>Scegli la guida che vuoi consultare:</p>
            <ul>
              <li>
                <a target="_blank" href="/extra_files/tutorials/codeblocks/">
                  Come usare Codeblocks per programmare in C/C++
                </a>
              </li>
              <li>
                <a target="_blank" href="/extra_files/tutorials/lazarus/">
                  Come usare Lazarus per programmare in Pascal
                </a>
              </li>
              <li>
                <a target="_blank" href="/extra_files/tutorials/faq/">
                  Risposte ad alcune domande frequenti
                </a>
              </li>
            </ul>
          </>
        } />
        <Route exact path={'/documentation'} render={() =>
          <>
            <h1>Documentazione</h1>
            <hr />
            <p>Scegli la documentazione che vuoi consultare:</p>
            <ul>
              <li><a target="_blank" href="/extra_files/documentation/cpp/en/index.html">Documentazione C/C++</a></li>
              <li><a target="_blank" href="/extra_files/documentation/pas/fpctoc.html">Documentazione Pascal</a></li>
            </ul>
          </>
        } />
        {props.userState && props.userState.data.contest.has_started && <Route path={'/task/:taskName'} render={({ match }) =>
          <TaskView {...props} key={match.params.taskName} taskName={match.params.taskName} />
        } />}
        <Route exact path={'/'} render={() =>
          <>
            {props.userState ? <h1>{props.userState.data.contest.name}</h1> : null}
            <ReactMarkdown source={props.userState && props.userState.data.contest.description} />
            {props.userState ? <hr /> : null}
            {props.userState && props.userState.data.contest.has_started ? <>
              <h2>{t("homepage.guide.title")}</h2>
              <p>{t("homepage.guide.part1")}</p>
              <Trans i18nKey="homepage.guide.part2">
                You can submit <em>as many times as you want</em>, but you will have a different input every time. When you make a submission remember to send the correct source file and the output corresponding to the last generated input. When you have uploaded your files <em>remember to submit</em> them by clicking the green button!
              </Trans>
              <p>{t("homepage.guide.part3")}</p>
            </> : (props.userState ? <>
              <div className="jumbotron">
                <h1 className="text-center display-1" ><FontAwesomeIcon icon={faClock} /></h1>
                <p className={"text-center"}>{t("login.not started")}</p>
              </div>
            </> : <LoginView {...props} model={props.model}/>)}
          </>
        } />
      </main>
    </>
  );

  return (
    <>
      <nav className="terry-navbar">
        <Link to="/" className="navbar-brand">{props.userState ? props.userState.data.contest.name : "Home"}</Link>
        <span className="terry-user-name">{props.userState && props.userState.data.name} {props.userState && props.userState.data.surname}</span>
        {props.userState && <button className="terry-logout-button btn btn-sm btn-light" onClick={(e) => { e.preventDefault(); props.model.logout() }}>
          <FontAwesomeIcon icon={faSignOutAlt} /> {t("navbar.logout")}
        </button>}
      </nav>

      <div className="terry-body">
        {getBody()}
      </div>
    </>
  );
};

export default ContestView;