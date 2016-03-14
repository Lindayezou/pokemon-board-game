var mongoose = require('mongoose');
var gameBoardData = require('../data/gameBoardData.js');
var gymLeaderData = require('../data/gymLeaderData.js');
var pokemonData = require('../data/pokemonData.js');
var usersData = require('../data/usersData.js');

var Games = require('../game/gameModel.js');
var GymLeaders = require('../gymLeader/gymLeaderModel.js');
var Pokemons = require('../pokemon/pokemonModel.js');
var Users = require('../users/userModel.js');

//===========Create Table functions===========
console.log(usersData);

var createUsers = function() {
  Users.find({}, function(err, users) {
    if (!users.length) {
      var newUsers = new Users({
		  facebookId: 'Facebook123',
		  displayName: 'Henry',
		  gamesParticipating: [1],
		  numGameWon: 0
       });
      newUsers.save(function(err) {
        if (!err) {
          console.log('createUser WORKS')
        }
      });
    }
  });
};

var createGymLeader = function() {
  GymLeaders.find({}, function(err, gymLeader) {
    if (!gymLeader.length) {
      GymLeaders.create(gymLeaderData, function (err) {
      	if (!err) {
      	  console.log('createPokemon WORKS');
      	}
      })
    }
  });
};

var createPokemons = function() {
  Pokemons.find({}, function(err, pokemon) {
    if (!pokemon.length) {
      Pokemons.create(pokemonData, function (err) {
        if (!err) {
          console.log('createPokemon WORKS');
        }
      })
    }
  });
};

var createGame = function() {
  Games.find({}, function(err, games) {
    if (!games.length){
      var newGame = new Games({ 
        gameID: 1,
        name: 'hoooli Dungeon',
        users: {1 : {
          playerIndex: 0,
          badges: [],
          party: [],
          box: [],
          itemCards: [],
          positionOnBoard: 0,
          citiesVisited: [0],
          lastCity: 0
        }},
        gameBoard: gameBoardData,
        AvailablePokemon: pokemonData,
        AvailableItemCards: [],
        gameCreator: 1,
        gameTurn: 'Alex',
        gameStarted: true
      });
      newGame.save(function(err) {
        if (!err) {
          console.log('createGames WORKS')
        }
      });
    }
  });
};


//===========Calling the Create Table functions===========
createGame();  
createGymLeader();
createPokemons();
createUsers();



//===========Remove contents of the tables in the database===========
Games.remove({}, function(err) { 
   console.log('Games collection removed') 
});

GymLeaders.remove({}, function(err) { 
   console.log('GymLeaders collection removed') 
});

Pokemons.remove({}, function(err) { 
   console.log('Pokemons collection removed') 
});

Users.remove({}, function(err) { 
   console.log('Users collection removed') 
});