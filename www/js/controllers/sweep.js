'use strict'

angular.module('copay.controllers')

.controller('SweepCtrl', function($scope, $stateParams, $state, $ionicPopup, $ionicLoading, Wallets, Sweep) {

  var wif = $stateParams.data;
  var network = Sweep.getNetwork($stateParams.data);
  var address = Sweep.getAddress(wif, network);
  $scope.walletList = Wallets.all().filter(function(wallet) {
    return (network == 'testnet') == wallet.isTestnet();
  });
  $ionicLoading.show({
    template: '<i class="icon ion-loading-c"></i> Fetching balance...'
  });

  if (!$scope.walletList) {
    $ionicLoading.hide();
    $ionicPopup.alert({
      title: 'Couldn\'t retrieve funds',
      // TODO: Is this message too technical?
      template: 'You have no wallets in the network associated ' +
                'with that private key (' + network + ')'
    });
    return;
  }

  Sweep.getFunds($scope.walletList[0].blockchain, address,
    function(err, amountSat, outputs) {
      $ionicLoading.hide();
      if (err) {
        console.error(err);
        $ionicPopup.alert({
          title: 'Couldn\'t retrieve funds',
          template: 'There was an error retrieving funds for that private key'
        });
        $state.go('profile.wallet');
        return;
      }
      if (!amountSat) {
        console.error(err);
        $ionicPopup.alert({
          title: 'Couldn\'t retrieve funds',
          template: 'There are no funds left for that private key'
        });
        $state.go('profile.wallet');
        return;
      }
      $scope.data.estimatedFee = Sweep.estimateFees(wif, outputs);
      $scope.data.balance = amountSat;
      $scope.outputs = outputs;
    }
  );

  $scope.submit = function(form, data) {
    if (!form.$valid) return;

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Importing bitcoins...'
    });
    var newAddress = $scope.data.wallet.generateAddress();
    Sweep.sendOutputs(
      $scope.walletList[0].blockchain, wif, newAddress, $scope.data.balance, $scope.outputs,
      function(err) {
        $ionicLoading.hide();
        if (err) {
          console.error(err);
          $ionicPopup.alert({
            title: 'Couldn\'t retrieve funds',
            template: 'Error sweeping the funds.'
          });
        }
        return $state.go('profile.wallet.home', {walletId: $scope.data.wallet.id});
      }
    );
  };

  $scope.data = {};
  $scope.data.wallet = $scope.walletList[0];
  $scope.data.balance = 0;

});
