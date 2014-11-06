'use strict'


angular.module('copay.controllers')

// TODO: Abstract SetPinCtrl and PinCtrl
.controller('PinCtrl', function($scope, $state, $stateParams, $ionicLoading, $cordovaToast, $ionicPopup, Identity, Session) {

  $scope.digits = [];

  $scope.clear = function() {
    $scope.digits = [];
  };

  $scope.press = function(digit) {
    $scope.digits.push(digit);
    if ($scope.digits.length == 4) {
      return $scope.confirm ? onConfirm() : onPIN();
    }
  };

  $scope.logout = function() {
    $ionicPopup.confirm({
      title: 'Log out',
      template: 'Are you sure you want to logout?'
    }).then(function(res) {
      if (!res) return;
      Session.clearCredentials();
      Session.signout();
      $state.go('start.welcome');
    });
  };

  // TODO: Make Notifications work without a wallet
  var toast = function(message) {
    // Show somethig at the browser, for developing ease
    if (!this.isNative) {
      $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    } else {
      $cordovaToast.showLongBottom(message);
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
      if (err) {
        toast('Invalid PIN, please try again');
      }

      Session.signin(identity);

      if ($stateParams.data) {
        $state.go('profile.payment', $stateParams);
      } else {
        $state.go('profile.wallet.home');
      }
    });
  }

})

.controller('SetPinCtrl', function($scope, $state, $stateParams, $ionicLoading, $cordovaToast, Identity, Session) {
  var PIN = null;
  $scope.digits = [];
  $scope.create = true;
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

  // TODO: Make Notifications work without a wallet
  var toast = function(message) {
    // Show somethig at the browser, for developing ease
    if (!this.isNative) {
      $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    } else {
      $cordovaToast.showLongBottom(message);
    }
  };

  function onConfirm() {
    if (angular.equals(PIN, $scope.digits)) {
      Session.setCredentials(PIN, $stateParams);
      return $state.go('profile.wallet.home');
    } else {
      toast('PINs don\'t match, please try again');
    }

    setPIN(null);
  }

  function setPIN(pin) {
    PIN = pin;
    $scope.clear();
    $scope.confirm = !$scope.confirm;
  }
});
