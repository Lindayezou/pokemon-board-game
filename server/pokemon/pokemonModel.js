var mongoose = require('mongoose');

var pokemonSchema = mongoose.Schema({
  name: String,
  pokemonID: Number,
  color: String,
  description: String,
  hidden: {
    type: Boolean,
    default: true
  },
  alive: {
    type: Boolean,
    default: true
  },
  imageURL: String,
  specs: {}
});

var pokemon = mongoose.model('pokemon', pokemonSchema);

module.exports = pokemon;
