var chai = require('chai');
var sinonChai = require('sinon-chai');
var mongoose = require('mongoose');
var game = require('../server/game/gameModel.js');
var gameController = require('../server/game/gameController.js');
var chaiHTTP = require('chai-http')
var server = require('../server/server.js');

var gameBoardData = require('../server/data/gameBoardData.js');
var availablePokemonData = require('../server/data/availablePokemonData.js');

var dbURI = 'mongodb://localhost/pokemon';

global.expect = chai.expect;
global.should = chai.should();
global.sinon = require('sinon');

chai.use(sinonChai);
chai.use(chaiHTTP);


describe('Server Integration Tests', function() {

  // Instantiates a new game that will be dropped after tests are run. 
  beforeEach(function(done){
      var newGame = new game({
        gameId: 100,
        name: 'TEST TEST TEST',
        users: [{
          playerName: 'Robert',
          facebookId: '123Facebook'
        }, 
        {
          playerName: 'Robert2',
          facebookId: '1234Facebook'
        }],
        gameBoard: gameBoardData,
        availablePokemon: availablePokemonData,
        availableItemCards: [],
        gameCreator: {
          facebookId: '123Facebook',
          playerName: 'Robert'
        },
        gameTurn: {
          facebookId: '123Facebook',
          playerName: 'Robert'
        },
        gameStarted: true,
        gameCounter: 0
      });
      newGame.save(function(err) {
        done();
      });
    });
    // afterEach(function(done){
    //   game.collection.drop();
    //   done();
    // });

  // Server POST Request Tests
  it('should add a SINGLE game on /api/games/addGame POST', function(done) {
    chai.request(server)
      .post('/api/games/addGame')
      .send({gameName: "testGame"})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('gameId');
        res.body.should.have.property('name');
        res.body.gameId.should.equal(2);
        res.body.name.should.equal("testGame");

        done();
      });
  });  	

  // Server GET Request Tests	
  it('should list ALL games on /api/games/getGames GET', function(done) {
    chai.request(server)
      .get('/api/games/getGames')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[res.body.length-1].should.have.property('gameId');
        res.body[res.body.length-1].should.have.property('gameName');
        res.body[res.body.length-1].gameId.should.equal(100);
        res.body[res.body.length-1].gameName.should.equal("TEST TEST TEST");
        done();
      });
  });

  it('should list ALL users in a game on /api/games/lobbyinit GET', function(done) {
    var newGame = new game({
      gameId: 3,
      name: "test",
      gameCreator: {
      	facebookId: "test123", 
      	playerName: "Pleasework Now"
      }
    });
    newGame.save(function(err, data) {
      chai.request(server)
        .get('/api/games/lobbyinit')
        .query({gameId:3})
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('gameName');
          res.body.should.have.property('gameCreator');
          res.body.should.have.property('creatorName');
          res.body.gameName.should.equal("test");
          res.body.gameCreator.should.equal("test123");
          res.body.creatorName.should.equal("Pleasework Now");
          done();
        });
    });
  });

  it('should list game turns on /api/games/gameturn GET', function(done) {
  	var newGame = new game({
  	  gameId: 4,
  	  name: "test",
  	  gameCreator: {
  	  	facebookId: "test123", 
  	  	playerName: "Pleasework Now"
  	  }, 
  	  users: [
  	  {
  	  	facebookId: "test123", 
  	  	playerName: "Pleasework Now"
  	  }, 
  	  {
  	  	facebookId: "test456", 
  	  	playerName: "Isworking Now?"
  	  }
  	  ],
  	  gameTurn: {
  	  	facebookId: "test123", 
  	  	playerName: "Pleasework Now"
  	  }, 
      gameCounter: 1
  	});
  	newGame.save(function(err, data) {
  	  chai.request(server)
  	    .get('/api/games/gameturn')
  	    .query({gameId:4})
  	    .end(function(err, res) {
  	      res.should.have.status(200);
  	      res.should.be.json;
  	      res.body.should.be.a('object');
  	      res.body.should.have.property('facebookId');
  	      res.body.should.have.property('playerName');
          res.body.facebookId.should.equal("test456");
          res.body.playerName.should.equal("Isworking Now?");
  	      done();
  	    });
  	});
  });

  // it('should list player options on /api/games/playerOptions GET', function(done) {
  //   var newGame = new game({
  //     gameId: 3,
  //     name: "test",
  //     gameCreator: {
  //     	facebookId: "test123", 
  //     	playerName: "Pleasework Now"
  //     }
  //   });
  //   newGame.save(function(err, data) {
  //     chai.request(server)
  //       .get('/api/games/playerOptions')
  //       .query({gameId:1})
  //       .end(function(err, res) {
  //         res.should.have.status(200);
  //         res.should.be.json;
  //         res.body.should.be.a('object');
  //         // res.body.should.have.property('gameId');
  //         // res.body.should.have.property('name');
  //         // res.body.should.have.property('gameCreator');
  //         done();
  //       });
  //   });
  // });

  // it('should list available Pokemon on /api/games/availablePokemon GET', function(done) {
  //   var newGame = new game({
  //     gameId: 3,
  //     facebookId: "test123", 
  //     name: "test",
  //     gameCreator: {
  //     	facebookId: "test123", 
  //     	playerName: "Pleasework Now"
  //     }
  //   });
  //   newGame.save(function(err, data) {
  //     chai.request(server)
  //       .get('/api/games/availablePokemon')
  //       .query({gameId:1})
  //       .end(function(err, res) {
  //         res.should.have.status(200);
  //         res.should.be.json;
  //         res.body.should.be.a('object');
  //         // res.body.should.have.property('gameId');
  //         // res.body.should.have.property('name');
  //         // res.body.should.have.property('gameCreator');
  //         done();
  //       });
  //   });
  // });

// router.get('/api/games/playerOptions', gameController.getPlayerOptions);
// router.get('/api/games/availablePokemon', gameController.getAvailablePokemon);
// router.get('/api/games/remainingStarterPokemon', gameController.getRemainingStarterPokemon);
// router.get('/api/games/boardInit', gameController.boardInit);


  // Server GET Request Tests 
  it('should update a User on /api/games/user PUT', function(done) {
    chai.request(server)
      .get('/api/games/gameturn')
      .query({gameId:100})
      .end(function(err, res){
        chai.request(server)
          .put('/api/games/user')
            .send({gameId:100,
              users:[{
              facebookId: 'facebook789',
              playerName: 'Christopherson'
            }
            ]})
          .end(function(error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('playerName');
            res.body.should.have.property('facebookId');
            res.body.playerName.should.equal("Robert");
            res.body.facebookId.should.equal("123Facebook");
            done();
        });
      });
  }); 

  it('should update a Game Turn on /api/games/updateturn PUT', function(done) {
    chai.request(server)
      .get('/api/games/gameturn')
      .query({gameId:100})
      .end(function(err, res){
        chai.request(server)
          .put('/api/games/updateturn')
            .send({gameId:100})
          .end(function(error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('playerName');
            res.body.should.have.property('facebookId');
            res.body.playerName.should.equal("Robert2");
            res.body.facebookId.should.equal("1234Facebook");
            done();
        });
      });
  }); 

  it('should update a Game Turn on /api/games/addPokemon PUT', function(done) {
    chai.request(server)
      .get('/api/games/gameturn')
      .query({gameId:100})
      .end(function(err, res){
        chai.request(server)
          .put('/api/games/addPokemon')
            .send({
              gameId:100, 
              userId:"Robert2",
              pokemon:[{"name":"Mewtwo","description":"A Pokmon created by recombining MEWs genes. Its said to have the most savage heart among Pokmon.","pokemonId":"150","imageURL":"http://pokeapi.co/media/img/150.png ","alive":true,"visible":false,"color":"gold","capture":[6],"gifURL":"http://sprites.pokecheck.org/i/150.gif"}]
            })
          .end(function(error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('playerName');
            res.body.should.have.property('facebookId');
            res.body.playerName.should.equal("Christopherson");
            res.body.facebookId.should.equal("facebook789");
            done();
        });
      });
  }); 

// router.put('/api/games/user/movePlayer', gameController.movePlayer);
// router.put('/api/games/user/catchPokemon', gameController.catchPokemon);
});





