'use strict'

angular.module('copay.controllers')

// TODO: Abstract SetPinCtrl and PinCtrl
.controller('PinCtrl', ['$scope', '$state', '$ionicLoading', 'Identity', 'Session',
            function($scope, $state, $ionicLoading, Identity, Session) {

  $scope.digits = [];

  $scope.clear = function() {
    $scope.digits = [];
  };

  $scope.press = function(digit) {
    $scope.digits.push(digit);
    if ($scope.digits.length == 4) {
      return onPIN();
    }
  };

  function onPIN() {
    var credentials = Session.getCredentials($scope.digits);
    if (!credentials) return $scope.clear();

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Opening profile...'
    });

    Identity.openProfile(credentials, function(err, identity, wallet) {
      $ionicLoading.hide();
      if (err) throw err;

      Session.signin(identity);
      $state.go('profile.wallet.home');
    });
  }
}])

.controller('SetPinCtrl', ['$scope', '$state', '$stateParams', 'Identity', 'Session',
            function SetPinCtrl($scope, $state, $stateParams, Identity, Session) {

  var PIN = null;
  $scope.digits = [];
  $scope.confirm = false;

  $scope.clear = function() {
    $scope.digits = [];
  };

  $scope.press = function(digit) {
    $scope.digits.push(digit);
    if ($scope.digits.length == 4) {
      return $scope.confirm ? onConfirm() : onPIN();
    }
  };

  function onPIN() {
    setPIN($scope.digits);
  }

  function onConfirm() {
    if (angular.equals(PIN, $scope.digits)) {
      Session.setCredentials(PIN, $stateParams);
      return $state.go('profile.wallet.home');
    }

    setPIN(null);
  }

  function setPIN(pin) {
    PIN = pin;
    $scope.clear();
    $scope.confirm = !$scope.confirm;
  }
}]);
