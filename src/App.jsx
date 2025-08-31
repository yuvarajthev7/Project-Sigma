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

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    const board = JSON.parse(JSON.stringify(activeBoard));
    const sourceList = board.lists.find(list => list._id === source.droppableId);
    const destinationList = board.lists.find(list => list._id === destination.droppableId);
    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destinationList.cards.splice(destination.index, 0, movedCard);
    const updatedBoards = boards.map(b => b._id === activeBoardId ? board : b);
    setBoards(updatedBoards);
    axios.post(`http://localhost:5000/api/boards/${activeBoardId}/dnd`, { source, destination })
      .catch(err => console.error('Failed to save drag and drop changes', err));
  };

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
  axios.patch(`http://localhost:5000/api/boards/${activeBoardId}/lists/${listId}/cards/${cardId}`, newDetails)
    .catch(error => console.log('Error updating card: ', error));
};

  const handleDeleteCard = (cardId, listId) => {
    axios.delete(`http://localhost:5000/api/boards/${activeBoardId}/lists/${listId}/cards/${cardId}`)
      .then(res => {
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

  const handleEditBoardTitle = (newTitle) => {
    const updatedBoards = boards.map(board =>
      board._id === activeBoardId ? { ...board, title: newTitle } : board
    );
    setBoards(updatedBoards);
    axios.patch(`http://localhost:5000/api/boards/${activeBoardId}`, { title: newTitle })
      .catch(error => console.log('Error updating board title: ', error));
  };

  const handleDeleteBoard = () => {
    axios.delete(`http://localhost:5000/api/boards/${activeBoardId}`)
      .then(res => {
        const remainingBoards = boards.filter(board => board._id !== activeBoardId);
        setBoards(remainingBoards);
        setActiveBoardId(remainingBoards.length > 0 ? remainingBoards[0]._id : null);
      })
      .catch(err => console.error(err));
  };

  if (boards.length === 0 && !activeBoardId) {
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
        <div className="app-title-container">
    <h1 className="app-title">Project Sigma</h1>
  </div>
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Board
          title={activeBoard.title}
          lists={activeBoard.lists}
          onAddList={handleAddList}
          onAddCard={handleAddCard}
          onDeleteList={handleDeleteList}
          onDeleteCard={handleDeleteCard}
          onOpenModal={handleOpenModal}
          onDeleteBoard={handleDeleteBoard}
          onEditBoardTitle={handleEditBoardTitle}
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
