
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: String,
  title:String,
  values:Array,
  createdAt:{type: Date, default: Date.now}
});

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;