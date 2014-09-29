angular.module('copay.controllers', [])

.controller('RegisterCtrl', function($scope, $state, $ionicLoading, Identity, Wallets) {
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

      Wallets.create({ // create a default 1-of-1 wallet
        name: 'Personal',
        copayers: 1,
        threshold: 1
      }, function onResult() {
        $state.go('setPin'); // continue to set a new pin
      });
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
      if (err) return $scope.errors = err;

      $state.go('setPin'); // continue to save a new pin
    })
  };
})

.controller('SetPinCtrl', function($scope, $state) {
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
      return $state.go('profile.wallet.home', {walletID: 12});
    }

    setPIN(null);
  }

  function setPIN(pin) {
    PIN = pin;
    $scope.clear();
    $scope.confirm = !$scope.confirm;
  }
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

.controller('ProfileCtrl', function($scope, $state, Wallets) {
  $scope.wallets = Wallets.all();

  console.log('Hola Punto');
  console.log(Wallets.all());
})

.controller('HomeCtrl', function($scope, $state) {
})

.controller('ReceiveCtrl', function($scope, $state) {
})

.controller('SendCtrl', function($scope, $state) {
})

.controller('HistoryCtrl', function($scope, $state) {
})