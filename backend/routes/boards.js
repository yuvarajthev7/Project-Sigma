const router = require('express').Router();
let Board = require('../models/board.model');

router.route('/').get((req, res)=>{
  Board.find()
  .then(boards=>res.json(boards))
  .catch(err=>res.status(400).json('Error: '+err));
});

module.exports=router;
