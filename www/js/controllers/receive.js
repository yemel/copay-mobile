'use strict'

angular.module('copay.controllers')

.controller('ReceiveCtrl', function($scope, $rootScope, $state, $ionicModal, $window, $cordovaSocialSharing, $cordovaClipboard, Session, Addresses, Notifications) {

  loadAddresses();
  function loadAddresses() {
    $scope.addresses = Addresses.filter($scope.wallet);
  }

  $scope.$on('new-address', loadAddresses);

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $rootScope.$on('balance', function(ev, wallet) {
    if ($scope.wallet.id != wallet.id) return;

    loadAddresses();
    $scope.$apply();
  });

  $scope.createAddress = function() {
    var addr = Addresses.createAddress($scope.wallet);
    $scope.openModal(addr);
    $scope.$emit('new-address');
  }

  $scope.openModal = function(address) {
    $scope.modal.title = "Address";
    $scope.modal.data = address;
    $scope.modal.qrData = 'bitcoin:' + address;

    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.shareData = function() {
    $cordovaSocialSharing.share($scope.modal.data);
  };

  $scope.copyData = function() {
    var data = $scope.modal.data;

    if (!$window.cordova) {
      return $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", data);
    }

    $cordovaClipboard.copy(data).then(function() {
      Notifications.toast('Address copied');
    });
  };

});
