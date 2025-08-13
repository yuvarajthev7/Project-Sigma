import React, { useState, useEffect } from 'react';
import './Modal.css';

function Modal({ card, onClose, onUpdateCard }) {
  // Internal state for the form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // This hook listens for changes to the 'card' prop.
  // When you open a new card, it updates the title and description.
  useEffect(() => {
    if (card) {
      setTitle(card.text);
      setDescription(card.description || '');
    }
  }, [card]);

  if (!card) {
    return null;
  }

  // This function is called when you click away from the title input
  const handleTitleBlur = () => {
    onUpdateCard(card.id, card.listId, { text: title });
  };

  // This function is called when you click away from the description input
  const handleDescriptionBlur = () => {
    onUpdateCard(card.id, card.listId, { description: description });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {/* This is the editable title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="modal-title-input"
          />
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <h3>Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            className="modal-description-textarea"
            placeholder="Add a more detailed description..."
          />
        </div>
      </div>
    </div>
  );
}

export default Modal;
