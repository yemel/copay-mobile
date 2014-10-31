'use strict'

angular.module('copay.controllers')

.controller('HomeCtrl', function($scope, $state, $ionicModal, $window, $cordovaSocialSharing, $cordovaClipboard, Rates, Notifications) {

  loadCopayers();
  $scope.wallet.on('publicKeyRingUpdated', loadCopayers);

  function loadCopayers() {
    $scope.copayers = $scope.wallet.getRegisteredPeerIds(); // TODO: Rename method to getCopayers
    $scope.remaining = $scope.wallet.publicKeyRing.remainingCopayers(); // TODO: Expose on Wallet
    setTimeout(function(){ $scope.$apply(); }, 10);
  }

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.title = "Invite copayers";
    $scope.modal.qrData = $scope.modal.data = $scope.wallet.getSecret();

    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.shareData = function() {
    $cordovaSocialSharing.share($scope.wallet.getSecret());
  }

  $scope.copyData = function() {
    var data = $scope.wallet.getSecret();
    if (!$window.cordova) {
      return $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", data);
    }

    $cordovaClipboard.copy(data).then(function() {
      Notifications.toast('Secret copied');
    });
  };

});
