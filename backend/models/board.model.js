const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const List= require('./list.model');

const boardSchema = new Schema({
  title: {type: String, required: true},
  lists: [List.schema]
},{timestamps: true});

const Board = mongoose.model('Board',boardSchema);

module.exports = Board;
