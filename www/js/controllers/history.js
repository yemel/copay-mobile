'use strict'

angular.module('copay.controllers')

.controller('HistoryCtrl', function($scope, $state, History) {
  $scope.transactions = History.all($scope.wallet);

});
