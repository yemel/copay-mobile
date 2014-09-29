angular.module('copay.controllers', [])

.controller('RegisterCtrl', function($scope, $state, $ionicLoading, Identity) {
  $scope.profile = {};
  $scope.errors = [];

  $scope.submit = function(form) {
    if (!form.$valid) return;

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Creating profile...'
    });

    Identity.createProfile($scope.profile, function(err, profile) {
      $ionicLoading.hide();
      if(err) return $scope.errors = err;

      $state.go('setPin'); // continue to save a new pin
    })
  };
})

.controller('LoginCtrl', function($scope, $state, $ionicLoading, Identity) {
  $scope.profile = {};
  $scope.errors = [];

  $scope.submit = function(form) {
    if (!form.$valid) return;

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Fetching profile...'
    });

    Identity.fetchProfile($scope.profile, function(err, profile) {
      $ionicLoading.hide();
      if(err) return $scope.errors = err;

      $state.go('setPin'); // continue to save a new pin
    })
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
      $state.go('profile.wallet.home', {walletID: 12});
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