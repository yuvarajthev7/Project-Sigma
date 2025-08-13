import React, { useState } from 'react';
import List from './List';
import './Board.css';

// 1. Add 'onOpenModal' to the list of props received from App
function Board({
  title,
  lists,
  onAddCard,
  onAddList,
  onDeleteCard,
  onEditCard,
  onDeleteList,
  onEditList,
  onOpenModal,
}) {
  const [newListTitle, setNewListTitle] = useState('');

  const handleInputChange = (event) => {
    setNewListTitle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newListTitle.trim()) {
      onAddList(newListTitle);
      setNewListTitle('');
    }
  };

  return (
    <div className="board">
      <header className="board-header">
        <h2 className="board-title">{title}</h2>
      </header>
      <div className="board-lists-container">
        {lists.map((list) => (
          <List
            key={list.id}
            title={list.title}
            id={list.id}
            cards={list.cards}
            onAddCard={onAddCard}
            onDeleteCard={onDeleteCard}
            onEditCard={onEditCard}
            onDeleteList={onDeleteList}
            onEditList={onEditList}
            // 2. Pass 'onOpenModal' down to each List component
            onOpenModal={onOpenModal}
          />
        ))}
        <div className="add-list">
          <form onSubmit={handleSubmit} className="add-list-form">
            <input
              type="text"
              value={newListTitle}
              onChange={handleInputChange}
              placeholder="Enter list title..."
              className="add-list-input"
            />
            <button type="submit" className="add-list-button">
              Add List
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Board;
