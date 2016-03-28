angular.module('pokemon.resumelobby', [])
.controller('resumeLobbyController', function ($scope, $window, $location, gameFactory, pokemonSocket) {
  $scope.resumelobbytest = " welcome to the resume game Lobby!";

  $scope.gameId = $window.localStorage.getItem('pokemon.gameId');
  $scope.facebookId = $window.localStorage.getItem('pokemon.facebookId');
  $scope.playerName = $window.localStorage.getItem('pokemon.playerName');
  $scope.users = [];

  pokemonSocket.on('join resume lobby', function (data) {
    $scope.users.push(data);
  });

  pokemonSocket.on('results for check users', function (data) {
    if(data.result) {
      $scope.allusersavailable = true;
    } else {
      $scope.allusersavailable = false;
    }
  });

  var initialize = function (gameId) {
    gameFactory.lobbyInit($scope.gameId)
    .then(function (resp) {
      $scope.gameName = resp.gameName;
      $scope.gameCreator = resp.creatorName;
      $scope.gameCreatorId = resp.gameCreator;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  initialize($scope.gameId);

  $scope.getBoardView = function () {
    pokemonSocket.emit('check if all users are here', { gameId: $scope.gameId, NumberOfUsers: $scope.users.length });
    $location.path('/board');
  };

});