'use strict'

angular.module('copay.controllers')

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
      if (err) {
        if (err === 'Invalid username or password') {
          $scope.errors = err;
        } else if (err.indexOf('EEXISTS') !== -1) {
          $scope.errors = 'An account already exists with that email';
        } else {
          $scope.errors = 'Couldn\'t establish a connection to the server';
        }
        return;
      }

      Session.signin(identity);
      $state.go('setPin', $scope.profile);
    });
  };
});
