import React, { useState, useEffect } from 'react'; // Import useEffect
import { DragDropContext } from '@hello-pangea/dnd';
import axios from 'axios'; // Import axios
import Board from './components/Board';
import Modal from './components/Modal';
import './App.css';

// We no longer need the hardcoded initialBoards constant.

function App() {
  // The initial state for boards is now an empty array.
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null); // Start with no active board
  const [selectedCard, setSelectedCard] = useState(null);

  // --- NEW: useEffect to fetch data from the backend ---
  useEffect(() => {
    // Fetch all boards from the API
    axios.get('http://localhost:5000/api/boards')
      .then(response => {
        const fetchedBoards = response.data;
        setBoards(fetchedBoards);
        // If there are boards, set the first one as active
        if (fetchedBoards.length > 0) {
          setActiveBoardId(fetchedBoards[0]._id); // Use _id from MongoDB
        }
      })
      .catch(error => {
        console.log('Error fetching boards: ', error);
      });
  }, []); // The empty array [] means this effect runs once when the component mounts

  const activeBoard = boards.find((board) => board._id === activeBoardId);

  // All your handler functions (handleDragEnd, handleUpdateCard, etc.) will
  // eventually be updated to make API calls, but for now, we'll leave them as is.

  const handleOpenModal = (cardId, listId) => {
    const board = boards.find(b => b._id === activeBoardId);
    const list = board.lists.find(l => l._id === listId);
    const card = list.cards.find(c => c._id === cardId);
    setSelectedCard({ ...card, listId: listId });
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  // A placeholder function for now
  const handleUpdateCard = () => {
    console.log("handleUpdateCard needs to be connected to the backend.");
  };

  // Render a loading message until boards are fetched
  if (boards.length === 0) {
    return <div>Loading boards...</div>;
  }

  if (!activeBoard) {
    // This could mean boards are fetched but none are active, or the active one is invalid.
    // Or it could mean we need to create our first board.
    return <div>No active board selected. Let's create one!</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Project Management Tool</h1>
        <nav className="board-nav">
          <span>Switch Board:</span>
          {boards.map((board) => (
            <button
              key={board._id}
              className={`board-nav-button ${board._id === activeBoardId ? 'active' : ''}`}
              onClick={() => setActiveBoardId(board._id)}
            >
              {board.title}
            </button>
          ))}
        </nav>
      </header>

      <DragDropContext onDragEnd={() => {}}>
        <Board
          title={activeBoard.title}
          lists={activeBoard.lists}
          onOpenModal={handleOpenModal}
          // We will re-connect the other handlers later
        />
      </DragDropContext>

      <Modal
        card={selectedCard}
        onClose={handleCloseModal}
        onUpdateCard={handleUpdateCard}
      />
    </div>
  );
}

export default App;
