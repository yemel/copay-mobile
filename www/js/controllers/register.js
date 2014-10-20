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
      if(err) return $scope.errors = err;

      Session.signin(identity);
      $state.go('setPin', $scope.profile);
    });
  };
});
