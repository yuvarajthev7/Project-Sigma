import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import './Card.css';

// Props are cleaned up
function Card({ card, index, listId, onOpenModal }) {
  return (
    // Use card._id for the draggableId
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
          {/* We will add the delete button back when we connect it to the backend */}
        </div>
      )}
    </Draggable>
  );
}

export default Card;
