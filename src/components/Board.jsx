import React, { useState, useEffect } from 'react'; // Import useEffect
import List from './List';
import './Board.css';

function Board({
  title,
  lists,
  onOpenModal,
  onAddList,
  onAddCard,
  onDeleteList,
  onDeleteCard,
  onEditBoardTitle,
  onDeleteBoard
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [boardTitle, setBoardTitle] = useState(title);
  const [newListTitle, setNewListTitle] = useState('');
  useEffect(() => {
    setBoardTitle(title);
  }, [title]); 

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (boardTitle.trim()) {
      onEditBoardTitle(boardTitle);
    }
    setIsEditing(false);
  };

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
        {isEditing ? (
          <form onSubmit={handleTitleSubmit} className="board-title-form">
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              autoFocus
              className="board-title-input"
            />
          </form>
        ) : (
          <h2 className="board-title" onClick={() => setIsEditing(true)}>
            {boardTitle}
          </h2>
        )}
        <button className="delete-board-button" onClick={onDeleteBoard}>
          Delete Board
        </button>
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
            onDeleteList={onDeleteList}
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
