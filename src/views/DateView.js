import React, { Component } from 'react';
import { DateTime, Duration } from "luxon";
import moment from "moment";
import { translateComponent } from "../utils";

class DateView extends Component {
  render() {
    const { i18n } = this.props;
    return (
      <abbr title={ this.props.date.locale(i18n.language).toFormat('LLLL') }>
        { moment(this.props.date).fromNow() }
      </abbr>
    );
  }
}

export default translateComponent(DateView);
