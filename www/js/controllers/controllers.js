angular.module('copay.controllers', [])

.controller('RegisterCtrl', function($scope, $state, $ionicLoading, Identity, Session) {
  $scope.profile = {};
  $scope.errors = [];

  $scope.submit = function(form) {
    if (!form.$valid) return;

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Creating profile...'
    });

    Identity.createProfile($scope.profile, function(err, identity, wallet) {
      $ionicLoading.hide();
      if(err) return $scope.errors = err;

      Session.signin(identity);
      $state.go('setPin', $scope.profile);
    });
  };
})

.controller('LoginCtrl', function($scope, $state, $ionicLoading, Identity, Session) {
  $scope.profile = {};
  $scope.errors = [];

  $scope.submit = function(form) {
    if (!form.$valid) return;

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Opening profile...'
    });

    Identity.openProfile($scope.profile, function(err, identity, wallet) {
      $ionicLoading.hide();
      if (err) return $scope.error = err.message;

      Session.signin(identity);
      $state.go('setPin', $scope.profile);
    })
  };
})

// TODO: Abstract SetPinCtrl and PinCtrl
.controller('PinCtrl', function($scope, $state, $ionicLoading, Identity, Session) {
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

})

.controller('SetPinCtrl', function($scope, $state, $stateParams, Identity, Session) {
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
})

.controller('ProfileCtrl', function($scope, $state, Session, Wallets) {
  $scope.wallets = Wallets.all();
})

.controller('SidebarCtrl', function($scope, $state, Session, Wallets) {
  $scope.profile = Session.profile;
  $scope.wallets = Wallets.all();
})

.controller('WalletCtrl', function($scope, $state, $stateParams, Wallets) {
  $scope.wallet = Wallets.get($stateParams.walletId);
  console.log('Wallet:', $scope.wallet);

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
      template: '<i class="icon ion-loading-c"></i> Creating wallet...'
    });

    Wallets.create($scope.data, function onResult(err, wallet){
      $ionicLoading.hide();
      if (err) throw err;
      return $state.go('profile.wallet.home', {walletId: wallet.id});
    });
  };

  $scope.join = function(form) {
    if (!form.$valid) return;

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Joining wallet...'
    });

    console.log('SECRET', $scope.data.secret);
    Wallets.join($scope.data.secret, function onResult(err, wallet){
      $ionicLoading.hide();
      if (err) throw err;
      return $state.go('profile.wallet.home', {walletId: wallet.id});
    });
  };

  // Update threshold and selected value
  $scope.$watch('data.copayers', function(copayers) {
    $scope.threshold = THRESHOLD_LIMITS[copayers-1];
    $scope.data.threshold = Math.min(parseInt($scope.data.copayers/2+1), $scope.threshold);
  });
})

.controller('HomeCtrl', function($scope, $state, $ionicModal, $window) {
  $scope.copayers = $scope.wallet.getRegisteredPeerIds(); // TODO: Rename method to getCopayers
  $scope.remaining = $scope.wallet.publicKeyRing.remainingCopayers(); // TODO: Expose on Wallet

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.title = "Invite copayers";
    $scope.modal.data = $scope.wallet.getSecret();

    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.copySecret = function() {
    $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", $scope.wallet.getSecret());
  };
})

.controller('ReceiveCtrl', function($scope, $state, $ionicModal, $window, Invoices, Session) {
  $scope.invoices = Invoices.filter({ status: Invoices.STATUS.pending });
  //$scope.invoices = Invoices.all();

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.title = "Quick receive";
    $scope.modal.data = "bitcoin://1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v";

    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.copyAddress = function() {
    $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", "bitcoin://1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
  };

})

.controller('InvoiceCtrl', function($scope, $ionicModal, $window, $stateParams, Invoices) {
  $scope.invoice = Invoices.get($stateParams.address);

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.title = "Share invoice";
    $scope.modal.data = "bitcoin://" + $scope.invoice.address; // TODO: Use Bitcore BIP-21

    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.copyAddress = function() {
    $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", "bitcoin://" + $scope.invoice.address);
  };

})

.controller('SendCtrl', function($scope, $state) {
})

.controller('HistoryCtrl', function($scope, $state) {
  $scope.transactions = [
    {time: new Date() - 1000 * 60 * 60 * 24 * 3, value: 0.232},
    {time: new Date() - 1000 * 60 * 60 * 24 * 8, value: -0.1},
    {time: new Date() - 1000 * 60 * 60 * 24 * 12, value: 1.5}
  ]
})