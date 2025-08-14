const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  text: { type: String, required: true},
  description: {type: String,default: ''}
}, {timestamps: true});

const listSchema = new Schema({
  title: {type:String, required: true},
  cards: [cardSchema]
}, {timestamps: true});

const List=mongoose.model('List', listSchema);

module.exports = List;
