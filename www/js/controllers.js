angular.module('copay.controllers', [])

.controller('RegisterCtrl', function($scope, $state, $ionicLoading, $timeout) {
  $scope.submit = function() {
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Doing something...'
    });

    $timeout(function() {
      $ionicLoading.hide();
      $state.go('setPin');
    }, 2000);

  };
})

.controller('SetPinCtrl', function($scope, $state) {
  $scope.message = "Enter a 4-digit pin";
  $scope.digits = [];

  $scope.press = function(digit) {
    $scope.digits.push(digit);
    if($scope.digits.length == 4) {
      $state.go('confirmPin');
    }
  };
})

.controller('ConfirmPinCtrl', function($scope, $state) {
  $scope.message = "Confirm your 4-digit pin";
  $scope.digits = [];

  $scope.press = function(digit) {
    $scope.digits.push(digit);
    if($scope.digits.length == 4) {
      $state.go('wallet.home');
    }
  };
})

.controller('HomeCtrl', function($scope, $state) {
  $scope.wallet = {
    name: 'Personal Wallet',
  };
})

.controller('ReceiveCtrl', function($scope, $state) {
  $scope.wallet = {
    name: 'Personal Wallet',
  };
})

.controller('SendCtrl', function($scope, $state) {
  $scope.wallet = {
    name: 'Personal Wallet',
  };
})