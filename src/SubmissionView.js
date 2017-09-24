import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ResultView from './ResultView';
import FileView from './FileView';
import { Link } from 'react-router-dom';
import ModalView from './ModalView';

export default class SubmissionView extends Component {
  constructor(props) {
    super(props);

    this.model = props.model;
    this.submission = props.submission;
  }

  getTaskState() {
    return this.model.getTaskState(this.taskName);
  }

  componentDidMount() {
    this.submission.pushObserver(this);
  }

  componentWillUnmount() {
    this.submission.popObserver(this);
  }

  renderSourceStatus(output) {
    if(!output.isUploaded()) return (<div><br/><h5>Processing...</h5></div>);

    return (
      <div className="alert alert-success">
        The source file looks good.
      </div>
    );
  }

  renderSourceSelector() {
    if(!this.submission.hasSource()) {
      return (
        <label className="custom-file">
          <input key="absent" ref="source" name="source" type="file" id="source-file" className="custom-file-input" onChange={(e) => this.submission.setSource(this.refs.source.files[0]) } />
          <span className="custom-file-control" id="source-file-span"></span>
        </label>
      );
    } else {
      const source = this.submission.getSource();
      return (
        <div key="present" className="card card-outline-primary">
          <div className="card-header">
            <h5 className="modal-subtitle pull-left">Source file info</h5>
            <button key="present" className="btn btn-primary pull-right" role="button" onClick={ () => this.submission.resetSource() }>
              <span aria-hidden="true" className="fa fa-trash"></span> Change source
            </button>
          </div>
          <div className="card-block">
            <FileView file={source.file}></FileView>
            { this.renderSourceStatus(source) }
          </div>
        </div>
      );
    }
  }

  renderOutputUploadForm() {
    return (
      <label className="custom-file">
        <input key="absent" ref="output" name="output" type="file" id="output-file" className="custom-file-input" onChange={() => this.submission.setOutput(this.refs.output.files[0])} />
        <span className="custom-file-control" id="output-file-span"></span>
      </label>
    );
  }

  renderOutputValidation(output) {
    if(!output.isUploaded()) return (<div><br/><h5>Processing...</h5></div>);

    return (
      <ResultView model={this.model} result={output.data.validation}></ResultView>
    );
  }

  renderOutputInfo() {
    const output = this.submission.getOutput();

    return (
      <div key="present" className="card card-outline-primary">
        <div className="card-header">
          <h5 className="modal-subtitle pull-left">Output file info</h5>
          <button key="present" className="btn btn-primary pull-right" role="button" onClick={ () => this.submission.resetOutput() }>
            <span aria-hidden="true" className="fa fa-trash"></span> Change output
          </button>
        </div>
        <div className="card-block">
          <FileView file={output.file}></FileView>
          { this.renderOutputValidation(output) }
        </div>
      </div>
    );
  }

  renderOutputSelector() {
    if(!this.submission.hasOutput()) {
      return this.renderOutputUploadForm();
    } else {
      return this.renderOutputInfo();
    }
  }

  renderSubmissionForm() {
    if(this.submission.isSubmitting()) return <p>Submitting...</p>

    return (
      <div>
        <div className="modal-body">
          <form className="submissionForm" ref="form" onSubmit={(e) => { e.preventDefault() }}>
            <div className="form-group">{ this.renderSourceSelector() }</div>
            <div className="form-group">{ this.renderOutputSelector() }</div>
          </form>
        </div>
        <div className="modal-footer">
          <Link to={"/" + this.submission.input.task} role="button" className="btn btn-danger">
            <span aria-hidden="true" className="fa fa-times"></span> Cancel
          </Link>
          <button role="button" className="btn btn-success"
                  disabled={ !this.submission.canSubmit() }
                  onClick={() => { this.submission.submit() }}>
            <span aria-hidden="true" className="fa fa-paper-plane"></span> Submit
          </button>
        </div>
      </div>
    );
  }

  renderSubmissionFeedback() {
    return (
      <div>
        <ResultView model={this.model} result={this.submission.data.feedback}></ResultView>
        <div className="modal-footer">
          <Link to={"/" + this.submission.input.task} role="button" className="btn btn-success">
            <span aria-hidden="true" className="fa fa-check"></span> Okay
          </Link>
        </div>
      </div>
    );
  }

  renderDialog() {
    if(this.submission.isSubmitted()) {
      return this.renderSubmissionFeedback();
    } else {
      return this.renderSubmissionForm();
    }
  }

  render() {
    return (
      <ModalView contentLabel="Submission creation" returnUrl={"/" + this.submission.input.task}>
        <div className="modal-header">
          <h5 className="modal-title">
            Submission for input <strong>{ this.submission.input.id }</strong>
          </h5>
          <Link to={"/" + this.submission.input.task} role="button" className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </Link>
        </div>

        { this.renderDialog() }
      </ModalView>
    );
  }
}
