'use strict'

angular.module('copay.controllers')

.controller('HistoryCtrl', function($scope, $rootScope, $state, History) {

  loadTransactions();
  $rootScope.$on('transactions', loadTransactions);

  function loadTransactions() {
    $scope.transactions = History.all($scope.wallet);
  }

});
