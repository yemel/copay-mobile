'use strict'

angular.module('copay.controllers')

.controller('ReceiveCtrl', function($scope, $state, $ionicModal, $window, $cordovaSocialSharing, Session, Addresses) {
  $scope.addresses = Addresses.filter($scope.wallet);
  console.log($scope.addresses);

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.createAddress = function() {
    var addr = Addresses.createAddress($scope.wallet);
    $scope.openModal('bitcoin://' + addr);
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
    $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", $scope.modal.data);
  };

});
