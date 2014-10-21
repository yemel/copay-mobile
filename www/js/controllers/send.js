'use strict'

angular.module('copay.controllers')

.controller('SendCtrl', function($scope, $filter, Proposals, Config, Rates) {
  $scope.proposals = Proposals.filter({ status: Proposals.STATUS.pending });
  $scope.form = {};

  $scope.unitCode = Config.currency.fiat;
  $scope.altCode = Config.currency.btc;
  $scope.unitFiat = true;

  var displayBtc = $filter('displayBtc');
  var displayFiat = $filter('displayFiat');

  $scope.toggleUnit = function() {
    var currency = Config.currency;

    $scope.unitFiat = !$scope.unitFiat;
    $scope.unitCode = $scope.unitFiat ? currency.fiat : currency.btc;
    $scope.altCode = !$scope.unitFiat ? currency.fiat : currency.btc;

    $scope.convert();
  };

  $scope.convert = function(value) {
    if (!value) return $scope.altAmount = null;

    if ($scope.unitFiat) {
      var sats = Rates.fromFiat(value, $scope.unitCode);
      $scope.altAmount = displayBtc(sats);
    } else {
      var sats = Rates.toSatoshis(value, $scope.unitCode);
      $scope.altAmount = displayFiat(sats);
    }
  }

})

.controller('ProposalCtrl', function($scope, $stateParams, Proposals) {
  $scope.proposal = Proposals.get($stateParams.proposalId);

});
