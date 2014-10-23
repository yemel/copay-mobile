'use strict'

angular.module('copay.controllers')

.controller('WalletCtrl', function($scope, $state, $ionicLoading, $ionicPopup, Wallets) {
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
      if (err) {
        if (err === Wallets.error.badSecret) {
          var alertPopup = $ionicPopup.alert({
            title: 'Invalid secret',
            template: 'The provided secret is invalid. Please check it and try again.'
          });
          alertPopup.then(function(res) {
            $scope.data.secret = '';
          });
          return;
        } else {
          throw err;
        }
      }
      return $state.go('profile.wallet.home', {walletId: wallet.id});
    });
  };

  // Update threshold and selected value
  $scope.$watch('data.copayers', function(copayers) {
    $scope.threshold = THRESHOLD_LIMITS[copayers-1];
    $scope.data.threshold = Math.min(parseInt($scope.data.copayers/2+1), $scope.threshold);
  });
});
