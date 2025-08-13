import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import './Card.css';

function Card({ card, index, listId, onDeleteCard, onEditCard, onOpenModal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [cardText, setCardText] = useState(card.text);

  const handleTextChange = (e) => {
    setCardText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEditCard(listId, card.id, cardText);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    // Save changes when the input loses focus
    onEditCard(listId, card.id, cardText);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card"
          onDoubleClick={() => setIsEditing(true)}
          onClick={() => onOpenModal(card.id, listId)}
        >
          {isEditing ? (
            <textarea
              className="card-edit-textarea"
              value={cardText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <>
              <span>{card.text}</span>
              <button
                className="delete-card-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCard(listId, card.id);
                }}
              >
                &times;
              </button>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Card;
