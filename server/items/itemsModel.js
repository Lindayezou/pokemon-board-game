var mongoose = require('mongoose');

var itemsSchema = mongoose.Schema({
  itemsId: Number,
  name: String,
  type: String,
  description: String,
  function: {},
});

var items = mongoose.model('items', itemsSchema);

module.exports = items;