'use strict'

angular.module('copay.controllers')

.controller('AbstractModalCtrl', function($scope, $ionicModal, $window, $cordovaSocialSharing, $cordovaClipboard, Notifications) {

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(title, data, qrData) {
    $scope.modal.title = title;
    $scope.modal.data = data;
    $scope.modal.qrData = qrData;

    $scope.modal.show();
    console.log('This is the data', data);
    setTimeout(function() { $scope.copyData(); }, 1000); // Feature: auto-copy address
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
      $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", data);
      return onCopy();
    }

    $cordovaClipboard.copy(data).then(onCopy);

    function onCopy() { 
      Notifications.toast($scope.modal.title + ' copied');
    }

  };

});
