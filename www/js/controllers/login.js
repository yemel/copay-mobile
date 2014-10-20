angular.module('copay.controllers')

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
});
