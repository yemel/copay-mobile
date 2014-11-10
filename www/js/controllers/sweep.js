'use strict'

angular.module('copay.controllers')

.controller('SweepCtrl', function($scope, $stateParams, $state, Wallets) {

  console.log('Sweep the private key', $stateParams.data);

  var network = 'livenet'; // TODO: Derive the network from the private key
  $scope.walletList = Wallets.all().filter(function(wallet) {
    return (network == 'testnet') == wallet.isTestnet();
  });

  $scope.data = {};
  $scope.data.wallet = $scope.walletList[0];
  $scope.data.balance = 21000;

});
