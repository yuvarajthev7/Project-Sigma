import React, { useState, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';
import './List.css';

function List({ title, cards, id, onAddCard, onOpenModal, onDeleteList, onDeleteCard, onEditListTitle }) {
  const [newCardText, setNewCardText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [listTitle, setListTitle] = useState(title);

  useEffect(() => {
    setListTitle(title);
  }, [title]);

  const handleTitleChange = (e) => {
    setListTitle(e.target.value);
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (listTitle.trim()) {
      onEditListTitle(id, listTitle);
    }
    setIsEditing(false);
  };

  const handleAddCardSubmit = (event) => {
    event.preventDefault();
    if (newCardText.trim()) {
      onAddCard(id, newCardText);
      setNewCardText('');
    }
  };

  return (
    <div className="list">
      <div className="list-header">
        {isEditing ? (
          <form onSubmit={handleTitleSubmit}>
            <input
              type="text"
              value={listTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              autoFocus
              className="list-title-input"
            />
          </form>
        ) : (
          <h3 className="list-title" onClick={() => setIsEditing(true)}>
            {listTitle}
          </h3>
        )}
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
            <AnimatePresence>
             {cards && cards.map((card, index) => (
               <Card
                 key={card._id}
                 card={card}
                 index={index}
                 listId={id}
                 onOpenModal={onOpenModal}
                 onDeleteCard={onDeleteCard}
               />
             ))}
           </AnimatePresence>
           {provided.placeholder}
         </div>
       )}
      </Droppable>
      <form onSubmit={handleAddCardSubmit} className="add-card-form">
        <input
          type="text"
          value={newCardText}
          onChange={(e) => setNewCardText(e.target.value)}
          placeholder="Enter a title for this card..."
          className="unified-input"
        />
        <button type="submit" className="button button-add">Add Card</button>
      </form>
    </div>
  );
}

export default List;
