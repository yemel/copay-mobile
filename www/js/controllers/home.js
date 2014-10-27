'use strict'

angular.module('copay.controllers')

.controller('HomeCtrl', function($scope, $state, $ionicModal, $window, $cordovaSocialSharing, Rates) {
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

  $scope.shareData = function() {
    var message = "Here is the secret to join the wallet:<br/><br/>" + $scope.wallet.getSecret();
    $cordovaSocialSharing.shareViaEmail(message, "Join my Copay Wallet");
  }

  $scope.copyData = function() {
    $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", $scope.wallet.getSecret());
  };

});
