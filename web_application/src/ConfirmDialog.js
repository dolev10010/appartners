import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <p>Are you sure you want to delete this post?</p>
        <div className="confirm-dialog-buttons">
          <button className="confirm-dialog-button" onClick={onConfirm}>Yes</button>
          <button className="confirm-dialog-button" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
