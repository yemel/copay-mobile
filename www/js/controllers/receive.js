'use strict'

angular.module('copay.controllers')

.controller('ReceiveCtrl', function($scope, $state, $ionicModal, $window, Invoices, Session) {
  $scope.invoices = Invoices.filter({ status: Invoices.STATUS.pending });

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.title = "Quick receive";
    $scope.modal.data = "bitcoin://1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v";

    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.copyAddress = function() {
    $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", "bitcoin://1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
  };

});
