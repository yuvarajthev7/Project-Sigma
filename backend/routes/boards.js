const router = require('express').Router();
let Board = require('../models/board.model');
const List = require('../models/list.model');

// GET all boards
router.route('/').get((req, res) => {
  Board.find()
    .then(boards => res.json(boards))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST to add a new board
router.route('/add').post((req, res) => {
  const title = req.body.title;
  const newBoard = new Board({
    title,
    lists: [],
  });

  newBoard.save()
    .then((board) => res.json(board))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST to add a new list to a specific board
router.route('/:boardId/lists/add').post((req, res) => {
  Board.findById(req.params.boardId)
    .then(board => {
      const newList = new List({ title: req.body.title, cards: [] });
      board.lists.push(newList);

      board.save()
        .then(() => res.json(newList))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:boardId/lists/:listId/cards/add').post((req, res) => {
  Board.findById(req.params.boardId)
    .then(board => {
      // Find the specific list within the board's lists array
      const list = board.lists.id(req.params.listId);
      if (!list) {
        return res.status(404).json('Error: List not found.');
      }

      const newCard = { text: req.body.text }; // Create the card object
      list.cards.push(newCard); // Add the new card to the list's cards array

      board.save()
        .then(() => res.json(list.cards[list.cards.length - 1])) // Send back the newly created card
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:boardId/dnd').post((req, res) => {
  Board.findById(req.params.boardId)
    .then(board => {
      const { source, destination } = req.body;

      // Find the source and destination lists
      const sourceList = board.lists.id(source.droppableId);
      const destinationList = board.lists.id(destination.droppableId);

      // Take the card out of the source list
      const [movedCard] = sourceList.cards.splice(source.index, 1);

      // If the card is null (something went wrong), abort
      if (!movedCard) {
        return res.status(400).json('Error: Could not find card to move.');
      }

      // Place the card in the destination list
      destinationList.cards.splice(destination.index, 0, movedCard);

      board.save()
        .then(() => res.json('Board updated successfully.'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:boardId/lists/:listId').delete((req, res) => {
Board.findById(req.params.boardId)
  .then(board => {
    if (!board) {
      return res.status(404).json('Error: Board not found.');
    }

    // Pull (remove) the list from the board's lists array
    board.lists.pull({ _id: req.params.listId });

    board.save()
      .then(() => res.json('List deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  })
  .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:boardId/lists/:listId/cards/:cardId').patch((req, res) => {
  Board.findById(req.params.boardId)
    .then(board => {
      const list = board.lists.id(req.params.listId);
      const card = list.cards.id(req.params.cardId);

      if (!card) {
        return res.status(404).json('Error: Card not found.');
      }

      if (req.body.text !== undefined) {
        card.text = req.body.text;
      }
      if (req.body.description !== undefined) {
        card.description = req.body.description;
      }

      board.save()
        .then(() => res.json('Card updated.'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:boardId/lists/:listId/cards/:cardId').delete((req, res) => {
  Board.findById(req.params.boardId)
    .then(board => {
      const list = board.lists.id(req.params.listId);
      if (!list) return res.status(404).json('Error: List not found.');

      // Pull (remove) the card from the list's cards array
      list.cards.pull({ _id: req.params.cardId });

      board.save()
        .then(() => res.json('Card deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;
