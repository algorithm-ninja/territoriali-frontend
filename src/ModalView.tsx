import * as React from 'react';
import * as Modal from 'react-modal';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './ModalView.css';

type Props = {
  contentLabel: string;
  returnUrl: string;
  children: React.ReactNode;
} & RouteComponentProps<any>;

const ModalView = (props: Props) => {
  const modalStyle: Modal.Styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(42, 42, 42, 0.75)',
      overflowY: 'auto',
    },
    content: {
      position: 'relative',
      top: 'inherit',
      left: 'inherit',
      right: 'inherit',
      bottom: 'inherit',
      margin: '3rem auto',
      maxWidth: '70%',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '0px',
    }
  };

  return (
    <Modal isOpen={true} contentLabel={props.contentLabel} style={modalStyle}
      onRequestClose={() => props.history.push(props.returnUrl)}>
      {props.children}
    </Modal>
  );
};

Modal.setAppElement('#root');

export default withRouter(ModalView);
