import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import './List.css';

// 1. Add 'onOpenModal' to the list of props received from Board
function List({
  title,
  cards,
  id,
  onAddCard,
  onDeleteCard,
  onEditCard,
  onDeleteList,
  onEditList,
  onOpenModal,
}) {
  const [newCardText, setNewCardText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [listTitle, setListTitle] = useState(title);

  const handleTitleChange = (e) => {
    setListTitle(e.target.value);
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (listTitle.trim()) {
      onEditList(id, listTitle);
    }
    setIsEditing(false);
  };

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
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                listId={id}
                onDeleteCard={onDeleteCard}
                // 2. Pass 'onOpenModal' down to the Card component
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
        <button type="submit" className="add-card-button">
          Add Card
        </button>
      </form>
    </div>
  );
}

export default List;
