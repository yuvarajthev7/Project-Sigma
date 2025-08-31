import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import './Card.css';

function Card({ card, index, listId, onOpenModal, onDeleteCard }) {
  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card-gradient-border"

          layout
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        >
          <div
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
        </motion.div>
      )}
    </Draggable>
  );
}

export default Card;
