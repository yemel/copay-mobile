'use strict'

angular.module('copay.controllers')

.controller('ReceiveCtrl', function($scope, $rootScope, $controller, Addresses) {
  angular.extend(this, $controller('AbstractModalCtrl', {$scope: $scope}));

  loadAddresses();
  function loadAddresses() {
    $scope.addresses = Addresses.filter($scope.wallet);
  }

  $scope.$on('new-address', loadAddresses);


  $rootScope.$on('balance', function(ev, wallet) {
    if ($scope.wallet.id != wallet.id) return;

    loadAddresses();
    $scope.$apply();
  });

  $scope.createAddress = function() {
    var addr = Addresses.createAddress($scope.wallet);
    $scope.openAddress(addr + '');
    $scope.$emit('new-address');
  };

  $scope.openAddress = function(address) {
    $scope.openModal("Address", address, 'bitcoin:' + address);
  };

});
