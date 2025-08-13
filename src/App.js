import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Board from './components/Board';
import './App.css';
import Modal from './components/Modal'

// --- NEW: Initial state now includes two boards ---
const initialBoards = [
  {
    id: 'board-1',
    title: 'Project Alpha',
    lists: [
      { id: 'list-1', title: 'To-Do', cards: [{ id: 'card-1', text: 'Plan sprint', description: 'Define the scope and goals for the next two weeks.' }] },
      { id: 'list-2', title: 'In Progress', cards: [{ id: 'card-2', text: 'Develop feature X', description: '' }] },
    ],
  },
  {
    id: 'board-2',
    title: 'Personal Tasks',
    lists: [
      { id: 'list-3', title: 'Groceries', cards: [{ id: 'card-3', text: 'Buy milk', description: 'Get the 2% kind.' }] },
    ],
  },
];

function App() {
  const [boards, setBoards] = useState(initialBoards);
  // --- NEW: State to track the currently active board ---
  const [activeBoardId, setActiveBoardId] = useState('board-1');

  // Helper function to find the active board
  const activeBoard = boards.find((board) => board.id === activeBoardId);
  const [selectedCard, setSelectedCard] = useState(null);
  // --- UPDATED: All handlers now use activeBoardId ---
  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the board and update it
    const board = boards.find(b => b.id === activeBoardId);
    const sourceList = board.lists.find(list => list.id === source.droppableId);
    const destinationList = board.lists.find(list => list.id === destination.droppableId);

    if (sourceList.id === destinationList.id) {
      const newCards = Array.from(sourceList.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);
      const newLists = board.lists.map(list =>
        list.id === sourceList.id ? { ...list, cards: newCards } : list
      );
      const newBoards = boards.map(b => b.id === activeBoardId ? {...b, lists: newLists} : b);
      setBoards(newBoards);
    } else {
      const newSourceCards = Array.from(sourceList.cards);
      const [movedCard] = newSourceCards.splice(source.index, 1);
      const newDestinationCards = Array.from(destinationList.cards);
      newDestinationCards.splice(destination.index, 0, movedCard);

      const newLists = board.lists.map(list => {
        if (list.id === sourceList.id) return { ...list, cards: newSourceCards };
        if (list.id === destinationList.id) return { ...list, cards: newDestinationCards };
        return list;
      });
      const newBoards = boards.map(b => b.id === activeBoardId ? {...b, lists: newLists} : b);
      setBoards(newBoards);
    }
  };

  const updateBoard = (updateFn) => {
    setBoards(boards.map(board =>
      board.id === activeBoardId ? updateFn(board) : board
    ));
  };

  const handleAddCard = (listId, cardText) => {
    updateBoard(board => {
      const newCard = { id: `card-${Date.now()}`, text: cardText };
      const newLists = board.lists.map(list =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
      );
      return { ...board, lists: newLists };
    });
  };
  const handleUpdateCard = (cardId, listId, newDetails) => {
    updateBoard(board => {
        const newLists = board.lists.map(list => {
            if (list.id === listId) {
                const newCards = list.cards.map(card =>
                    card.id === cardId ? { ...card, ...newDetails } : card
                );
                return { ...list, cards: newCards };
            }
            return list;
        });
        return { ...board, lists: newLists };
    });
  };

  const handleDeleteCard = (listId, cardId) => {
    updateBoard(board => {
      const newLists = board.lists.map(list => {
        if (list.id === listId) {
          const updatedCards = list.cards.filter(card => card.id !== cardId);
          return { ...list, cards: updatedCards };
        }
        return list;
      });
      return { ...board, lists: newLists };
    });
  };

  const handleEditCard = (listId, cardId, newText) => {
     updateBoard(board => {
        const newLists = board.lists.map(list => {
            if (list.id === listId) {
                const newCards = list.cards.map(card =>
                    card.id === cardId ? { ...card, text: newText } : card
                );
                return { ...list, cards: newCards };
            }
            return list;
        });
        return { ...board, lists: newLists };
    });
  };

  const handleAddList = (listTitle) => {
    updateBoard(board => {
      const newList = { id: `list-${Date.now()}`, title: listTitle, cards: [] };
      return { ...board, lists: [...board.lists, newList] };
    });
  };

  const handleDeleteList = (listId) => {
    updateBoard(board => {
        const newLists = board.lists.filter(list => list.id !== listId);
        return { ...board, lists: newLists };
    });
  };

  const handleEditList = (listId, newTitle) => {
    updateBoard(board => {
        const newLists = board.lists.map(list =>
            list.id === listId ? { ...list, title: newTitle } : list
        );
        return { ...board, lists: newLists };
    });
  };
  const handleOpenModal = (cardId, listId) => {
    const board = boards.find(b => b.id === activeBoardId);
    const list = board.lists.find(l => l.id === listId);
    const card = list.cards.find(c => c.id === cardId);
    setSelectedCard({ ...card, listId: listId });
  };
  const handleCloseModal = () => {
   setSelectedCard(null);
 };
  // --- NEW: Render a message if no board is active ---
  if (!activeBoard) {
    return <div>Board not found.</div>;
  }

  return (
    <div className="App">
      {/* --- NEW: Board selector header --- */}
      <header className="app-header">
        <h1>Project Management Tool</h1>
        <nav className="board-nav">
          <span>Switch Board:</span>
          {boards.map((board) => (
            <button
              key={board.id}
              className={`board-nav-button ${board.id === activeBoardId ? 'active' : ''}`}
              onClick={() => setActiveBoardId(board.id)}
            >
              {board.title}
            </button>
          ))}
        </nav>
      </header>

      {/* --- UPDATED: Pass active board's data to the Board component --- */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Board
          title={activeBoard.title}
          lists={activeBoard.lists}
          onAddCard={handleAddCard}
          onDeleteCard={handleDeleteCard}
          onEditCard={handleEditCard}
          onAddList={handleAddList}
          onDeleteList={handleDeleteList}
          onEditList={handleEditList}
          onOpenModal={handleOpenModal}
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
