import React, { useState } from 'react';
import List from './List';
import './Board.css';

// 1. Make sure 'onDeleteList' is received here
function Board({ title, lists, onOpenModal, onAddList, onAddCard, onDeleteList, onDeleteCard }) {
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
        {lists && lists.map((list) => (
          <List
            key={list._id}
            id={list._id}
            title={list.title}
            cards={list.cards}
            onOpenModal={onOpenModal}
            onAddCard={onAddCard}
            onDeleteCard={onDeleteCard}
            onDeleteList={onDeleteList} // 2. And make sure it's passed down here
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
            <button type="submit" className="add-list-button">Add List</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Board;
