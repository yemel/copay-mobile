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
      return $state.go('profile.wallet.home', {walletId: 12});
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

.controller('SidebarCtrl', function($scope, $state, Wallets) {
  $scope.wallets = Wallets.all();
})

.controller('WalletCtrl', function($scope, $state, $stateParams, Wallets) {
  $scope.wallet = Wallets.get($stateParams.walletId);

  // Inexistent Wallet, redirect to default one
  if (!$scope.wallet) {
    var defualtWallet = Wallets.all()[0];
    return $state.go('profile.wallet.home', {walletId: defualtWallet.id});
  }

})

.controller('AddCtrl', function($scope, $state, $ionicLoading, Wallets) {
  // Current limitations of multisig and transaction size
  var COPAYERS_LIMIT = 12;
  var THRESHOLD_LIMITS = [1, 2, 3, 4, 4, 3, 3, 2, 2, 2, 1, 1];

  $scope.data = {copayers: 1, threshold: 1}; // form defaults
  $scope.threshold = 1;

  $scope.create = function(form) {
    if (!form.$valid) return;

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Creating profile...'
    });

    Wallets.create($scope.data, function onResult(err, wallet){
      $ionicLoading.hide();
      if (err) return err;
      return $state.go('profile.wallet.home', {walletId: wallet.id});
    });
  }

  // Update threshold and selected value
  $scope.$watch('data.copayers', function(copayers) {
    $scope.threshold = THRESHOLD_LIMITS[copayers-1];
    $scope.data.threshold = Math.min(parseInt($scope.data.copayers/2+1), $scope.threshold);
  });
})

.controller('HomeCtrl', function($scope, $state) {
})

.controller('ReceiveCtrl', function($scope, $state) {
})

.controller('SendCtrl', function($scope, $state) {
})

.controller('HistoryCtrl', function($scope, $state) {
})