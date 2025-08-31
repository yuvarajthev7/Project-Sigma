import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import './Card.css';

// Added 'onDeleteCard' to the list of props
function Card({ card, index, listId, onOpenModal, onDeleteCard }) {
  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card"
          onClick={() => onOpenModal(card._id, listId)}
        >
          <span>{card.text}</span>
          <button
            className="delete-card-button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCard(card._id, listId);
            }}
          >
            &times;
          </button>
        </div>
      )}
    </Draggable>
  );
}

export default Card;
