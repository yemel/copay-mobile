'use strict'

angular.module('copay.controllers')

.controller('SweepCtrl', function($scope, $stateParams, $state, Wallets, Sweep) {

  var wif = $stateParams.data;
  var network = Sweep.getNetwork($stateParams.data);
  var address = Sweep.getAddress(wif);
  $scope.walletList = Wallets.all().filter(function(wallet) {
    return (network == 'testnet') == wallet.isTestnet();
  });

  if (!$scope.walletList) {
    // TODO: Show error and go back (no wallet with that network available)
  }

  Sweep.getFunds($scope.walletList[0].blockchain, address,
    function(err, amountSat, outputs) {
      if (err) {
        // TODO: ionic error
      }
      $scope.loading = false;
      $scope.data.balance = amountSat;
      $scope.outputs = outputs;
    }
  );

  $scope.send = function() {
    sweep.sendOutputs($scope.walletList[0].blockchain, wif, address, function(err) {
      // TODO: ionic error
    });
  };

  $scope.loading = true;
  $scope.data = {};
  $scope.data.wallet = $scope.walletList[0];
  $scope.data.balance = 0;

});
