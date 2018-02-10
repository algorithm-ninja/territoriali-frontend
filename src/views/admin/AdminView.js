import React, { Component } from 'react';
import {translateComponent} from "../../utils";
import {Link} from "react-router-dom";
import Countdown from '../CountdownView';
import Session from "../../models/admin/Session";
import AdminLoginView from "./AdminLoginView";
import LoadingView from "../LoadingView";
import LogsView from "./LogsView";
import ContestView from "./ContestView";
import UsersView from "./UsersView";

class AdminView extends Component {
  constructor(props) {
    super(props);
    this.session = new Session();
  }

  componentWillMount() {
    this.session.tryLogin();
  }

  componentDidMount() {
    this.session.pushObserver(this);
  }

  componentWillUnmount() {
    this.session.popObserver(this);
  }

  getNavBar() {
    const { t } = this.props;
    const countdown = this.session.status.start_time ? <Countdown remaining={this.session.status.remaining_time}/> : "";

    return <nav className="terry-navbar">
      <Link to="/admin" className="navbar-brand">{t("navbar.title")}</Link>
      {countdown}
      <a className="terry-admin-logout-button" href="#" onClick={(e) => { e.preventDefault(); this.session.logout()}}>
        <span aria-hidden="true" className="fa fa-sign-out" /> {t("navbar.logout")}
      </a>
    </nav>
  }

  render() {
    if (this.session.isLoading()) return <LoadingView />;
    if (!this.session.isLoggedIn()) return <AdminLoginView session={this.session} />;

    return <React.Fragment>
      { this.getNavBar() }

      <main>
        <LogsView session={this.session} />
        <ContestView session={this.session} />
        { this.session.status.loaded ? <UsersView session={this.session} /> : ""}
      </main>
    </React.Fragment>
  }
}

export default translateComponent(AdminView, "admin");
