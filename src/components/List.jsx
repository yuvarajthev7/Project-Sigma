// src/components/List.js

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import './List.css';

// Add onDeleteList to the props
function List({ title, cards, id, onAddCard, onOpenModal, onDeleteList }) {
  const [newCardText, setNewCardText] = useState('');

  const handleInputChange = (event) => {
    setNewCardText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newCardText.trim()) {
      onAddCard(id, newCardText);
      setNewCardText('');
    }
  };

  return (
    <div className="list">
      {/* ADDED a header div to hold the title and button */}
      <div className="list-header">
        <h3 className="list-title">{title}</h3>
        {/* ADDED the delete button */}
        <button className="delete-list-button" onClick={() => onDeleteList(id)}>
          &times;
        </button>
      </div>

      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="card-container"
          >
            {cards && cards.map((card, index) => (
              <Card
                key={card._id}
                card={card}
                index={index}
                listId={id}
                onOpenModal={onOpenModal}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <form onSubmit={handleSubmit} className="add-card-form">
        <input
          type="text"
          value={newCardText}
          onChange={handleInputChange}
          placeholder="Enter a title for this card..."
          className="add-card-input"
        />
        <button type="submit" className="add-card-button">Add Card</button>
      </form>
    </div>
  );
}

export default List;
