import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import axios from 'axios';
import Board from './components/Board';
import Modal from './components/Modal';
import './App.css';

function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/boards')
      .then(response => {
        const fetchedBoards = response.data;
        setBoards(fetchedBoards);
        if (fetchedBoards.length > 0) {
          setActiveBoardId(fetchedBoards[0]._id);
        }
      })
      .catch(error => console.log('Error fetching boards: ', error));
  }, []);

  const activeBoard = boards.find((board) => board._id === activeBoardId);

  // --- NEW: handleDragEnd is now fully implemented ---
  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Create a deep copy of the board to modify
    const board = JSON.parse(JSON.stringify(activeBoard));
    const sourceList = board.lists.find(list => list._id === source.droppableId);
    const destinationList = board.lists.find(list => list._id === destination.droppableId);

    // Move the card in the local state (optimistic update)
    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destinationList.cards.splice(destination.index, 0, movedCard);

    // Update the UI immediately
    const updatedBoards = boards.map(b => b._id === activeBoardId ? board : b);
    setBoards(updatedBoards);

    // Send the update to the backend
    axios.post(`http://localhost:5000/api/boards/${activeBoardId}/dnd`, { source, destination })
      .catch(err => {
        console.error('Failed to save drag and drop changes', err);
        // Optional: Revert state if the API call fails
      });
  };

  // ... (handleAddBoard, handleAddList, etc. remain the same) ...
  const handleAddBoard = (e) => {
    e.preventDefault();
    if (newBoardTitle.trim() === '') return;

    axios.post('http://localhost:5000/api/boards/add', { title: newBoardTitle })
      .then(response => {
        const newBoard = response.data;
        setBoards([...boards, newBoard]);
        setActiveBoardId(newBoard._id);
        setNewBoardTitle('');
      })
      .catch(error => console.log('Error adding board: ', error));
  };

  const handleAddList = (listTitle) => {
    if (!activeBoardId) return;

    axios.post(`http://localhost:5000/api/boards/${activeBoardId}/lists/add`, { title: listTitle })
      .then(response => {
        const newList = response.data;
        const updatedBoards = boards.map(board => {
          if (board._id === activeBoardId) {
            return { ...board, lists: [...board.lists, newList] };
          }
          return board;
        });
        setBoards(updatedBoards);
      })
      .catch(error => console.log('Error adding list: ', error));
  };

  const handleAddCard = (listId, cardText) => {
    axios.post(`http://localhost:5000/api/boards/${activeBoardId}/lists/${listId}/cards/add`, { text: cardText })
      .then(response => {
        const newCard = response.data;
        const updatedBoards = boards.map(board => {
          if (board._id === activeBoardId) {
            const updatedLists = board.lists.map(list => {
              if (list._id === listId) {
                return { ...list, cards: [...list.cards, newCard] };
              }
              return list;
            });
            return { ...board, lists: updatedLists };
          }
          return board;
        });
        setBoards(updatedBoards);
      })
      .catch(error => console.log('Error adding card: ', error));
  };

  const handleOpenModal = (cardId, listId) => {
    const board = boards.find(b => b._id === activeBoardId);
    const list = board.lists.find(l => l._id === listId);
    const card = list.cards.find(c => c._id === cardId);
    setSelectedCard({ ...card, listId: listId });
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const handleUpdateCard = (cardId, listId, newDetails) => {
    axios.patch(`http://localhost:5000/api/boards/${activeBoardId}/lists/${listId}/cards/${cardId}`, newDetails)
      .catch(error => {
        console.log('Error updating card: ', error);
      });

    // Note: We also need to optimistically update the state here for the UI to change instantly.
    const updatedBoards = boards.map(board => {
      if (board._id === activeBoardId) {
        const updatedLists = board.lists.map(list => {
          if (list._id === listId) {
            const updatedCards = list.cards.map(card => {
              if (card._id === cardId) {
                return { ...card, ...newDetails };
              }
              return card;
            });
            return { ...list, cards: updatedCards };
          }
          return list;
        });
        return { ...board, lists: updatedLists };
      }
      return board;
    });
    setBoards(updatedBoards);
  };
  const handleDeleteCard = (cardId, listId) => {
    axios.delete(`http://localhost:5000/api/boards/${activeBoardId}/lists/${listId}/cards/${cardId}`)
      .then(res => {
        console.log(res.data); // Should log "Card deleted."
        // Update state to remove the card from the UI
        const updatedBoards = boards.map(board => {
          if (board._id === activeBoardId) {
            const updatedLists = board.lists.map(list => {
              if (list._id === listId) {
                const updatedCards = list.cards.filter(card => card._id !== cardId);
                return { ...list, cards: updatedCards };
              }
              return list;
            });
            return { ...board, lists: updatedLists };
          }
          return board;
        });
        setBoards(updatedBoards);
      })
      .catch(err => console.error(err));
  };
  const handleDeleteList = (listId) => {
    axios.delete(`http://localhost:5000/api/boards/${activeBoardId}/lists/${listId}`)
      .then(response => {
        console.log(response.data);
        const updatedBoards = boards.map(board => {
          if (board._id === activeBoardId) {
            const updatedLists = board.lists.filter(list => list._id !== listId);
            return { ...board, lists: updatedLists };
          }
          return board;
        });
        setBoards(updatedBoards);
      })
      .catch(error => console.log('Error deleting list: ', error));
  };

  if (boards.length === 0) {
    return (
      <div className="App new-board-container">
        <form onSubmit={handleAddBoard} className="new-board-form">
          <h2>Create Your First Board</h2>
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Enter board title..."
            className="new-board-input"
          />
          <button type="submit" className="new-board-button">Add Board</button>
        </form>
      </div>
    );
  }

  if (!activeBoard) {
    return <div>Loading...</div>;
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
          <form onSubmit={handleAddBoard} className="new-board-header-form">
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="New board title..."
              className="new-board-header-input"
            />
            <button type="submit" className="new-board-header-button">+</button>
          </form>
        </nav>
      </header>

      {/* Pass the handleDragEnd function to the context provider */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Board
          title={activeBoard.title}
          lists={activeBoard.lists}
          onAddList={handleAddList}
          onAddCard={handleAddCard}
          onDeleteList={handleDeleteList}
          onUpdateCard={handleUpdateCard}
          onOpenModal={handleOpenModal}
          onDeleteCard={handleDeleteCard}
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
