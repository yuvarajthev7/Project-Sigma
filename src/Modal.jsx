import React, { useState, useEffect } from 'react';
import './Modal.css';

function Modal({ card, onClose, onUpdateCard }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.text);
      setDescription(card.description || '');
    }
  }, [card]);

  if (!card) {
    return null;
  }

  const handleTitleBlur = () => {
    // Pass up the boardId, listId, and cardId to the handler
    onUpdateCard(card._id, card.listId, { text: title });
  };

  const handleDescriptionBlur = () => {
    onUpdateCard(card._id, card.listId, { description: description });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
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
