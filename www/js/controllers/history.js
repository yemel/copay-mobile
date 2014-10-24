'use strict'

angular.module('copay.controllers')

.controller('HistoryCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.transactions = [
    {time: new Date() - 1000 * 60 * 60 * 24 * 3, value: 0.232},
    {time: new Date() - 1000 * 60 * 60 * 24 * 8, value: -0.1},
    {time: new Date() - 1000 * 60 * 60 * 24 * 12, value: 1.5}
  ]
}]);
