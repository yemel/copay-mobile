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

.controller('ProfileCtrl', function($scope, $state) {
  $scope.profile = {
    name: 'Yemel Jardi',
    email: 'angel.jardi@gmail.com',
    displayUnit: 'BTC',
    alternativeCurrency: 'USD',
  }
  $scope.wallets = [
    {id: 1, name: 'Personal', copayers: 1, threshold: 1},
    {id: 2, name: 'BitPay BsAs', copayers: 3, threshold: 2},
    {id: 3, name: 'Roomates', copayers: 4, threshold: 2},
  ]
})

.controller('WalletCtrl', function($scope, $state) {
  $scope.wallet = {
    name: 'Personal Wallet',
  };
})

.controller('HomeCtrl', function($scope, $state) {
})

.controller('HomeCtrl', function($scope, $state) {
})

.controller('ReceiveCtrl', function($scope, $state) {
})

.controller('SendCtrl', function($scope, $state) {
})

.controller('HistoryCtrl', function($scope, $state) {
})