'use strict'

angular.module('copay.controllers')

.controller('ReceiveCtrl', function($scope, $state, $ionicModal, $window, Session) {
  $scope.addresses = [
    '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v',
    '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36k',
    '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36c',
    '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36d'
  ];

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(data) {
    $scope.modal.title = "Address";
    $scope.modal.data = data;

    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.copyData = function() {
    $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", $scope.modal.data);
  };

});
