import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title="Confirm", message="Are you sure?" }) => {
  const footer = (
    <>
      <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
      <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>Confirm</button>
    </>
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <p>{message}</p>
    </Modal>
  );
};
export default ConfirmDialog;
