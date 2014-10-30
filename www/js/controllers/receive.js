'use strict'

angular.module('copay.controllers')

.controller('ReceiveCtrl', function($scope, $state, $ionicModal, $window, $cordovaSocialSharing, $cordovaClipboard, Session, Addresses, Notifications) {

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

  $scope.createAddress = function() {
    var addr = Addresses.createAddress($scope.wallet);
    $scope.openModal('bitcoin:' + addr);
    $scope.$emit('new-address');
  }

  $scope.openModal = function(data) {
    $scope.modal.title = "Address";
    $scope.modal.data = data;

    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.shareData = function() {
    var message = "Here is my bitcoin address:<br/><br/>" + $scope.modal.data;
    $cordovaSocialSharing.shareViaEmail(message, "My bitcoin address");
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
