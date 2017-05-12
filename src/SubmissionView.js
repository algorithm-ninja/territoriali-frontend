import React, { Component } from 'react';

class SubmissionView extends Component {
  constructor(props) {
    super(props);

    this.model = props.model;
    this.submission = props.submission;
    this.onClose = props.onClose;
  }

  onChangeSource() {
    this.submission.setSource(this.refs.form.source.files[0]);
  }

  resetSource() {
    this.submission.resetSource();
    this.forceUpdate();
  }

  onChangeOutput() {
    this.submission.setOutput(this.refs.form.output.files[0]);
  }

  resetOutput() {
    this.submission.resetOutput();
    this.forceUpdate();
  }

  submit() {
    this.submission.submit();
  }

  close() {
    this.onClose();
  }

  renderSourceSelector() {
    if(!this.submission.hasSource()) {
      return <input key="absent" type="file" name="source" onChange={() => this.onChangeSource()}></input>;
    } else {
      const file = this.submission.getSourceFile();
      return (
        <div key="present">
          <p>File: {file.name}</p>
          <input key="present" type="button" value="Change source" onClick={() => { this.resetSource(); return false; }}></input>
        </div>
      )
    }
  }

  renderOutputSelector() {
    if(!this.submission.hasOutput()) {
      return <input key="absent" type="file" name="output" onChange={() => this.onChangeOutput()}></input>;
    } else {
      const file = this.submission.getOutputFile();
      return (
        <div key="present">
          <p>File: {file.name}</p>
          <input type="button" value="Change output" onClick={() => { this.resetOutput(); return false; }}></input>
        </div>
      )
    }
  }

  renderDialog() {
    if(!this.submission.isSubmitted()) {
      return (
        <form ref="form" onSubmit={(e) => {e.preventDefault(); this.submit();}}>
          <div>{ this.renderSourceSelector() }</div>
          <div>{ this.renderOutputSelector() }</div>
          <div><input type="submit" value="Submit"></input></div>
          <input type="reset" onClick={() => {this.close(); return false;}} value="Cancel"></input>
        </form>
      );
    } else {
      return <button onClick={() => this.close()}>Okay.</button>
    }
  }

  render() {
    return (
      <div>
        <h2>Submission for input <samp>{this.submission.input.id}</samp></h2>
        { this.renderDialog() }
      </div>
    );
  }
}

export default SubmissionView;
