
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: String,
  title:String,
  values:Array,
  isComplete: {type: Boolean, default: false},
  createdAt:{type: Date, default: Date.now},
  isUpdate:{type: Date, default: Date.now}
});

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;