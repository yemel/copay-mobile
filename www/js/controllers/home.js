'use strict'

angular.module('copay.controllers')

.controller('HomeCtrl', ['$scope', '$state', '$ionicModal', '$window', 'Rates',
            function HomeCtrl($scope, $state, $ionicModal, $window, Rates) {

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

  $scope.copyData = function() {
    $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", $scope.wallet.getSecret());
  };

}]);
