angular.module('copay.controllers')

.controller('InvoiceCtrl', function($scope, $ionicModal, $window, $stateParams, Invoices) {
  $scope.invoice = Invoices.get($stateParams.address);

  $scope.modal = {};
  $ionicModal.fromTemplateUrl('templates/qr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.title = "Share invoice";
    $scope.modal.data = "bitcoin://" + $scope.invoice.address; // TODO: Use Bitcore BIP-21

    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.copyAddress = function() {
    $window.prompt("Copy to clipboard: Ctrl+C/⌘+C, Enter", "bitcoin://" + $scope.invoice.address);
  };

})
;