import React from 'react';
import './Modal.css';

function Modal({ card, onClose }) {
  if (!card) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{card.text}</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <h3>Description</h3>
          <p>Add a more detailed description...</p>
        </div>
      </div>
    </div>
  );
}

export default Modal;
