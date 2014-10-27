'use strict'

angular.module('copay.controllers')

.controller('SendCtrl', function($scope, $filter, $state, $ionicLoading, $stateParams, Proposals, Config, Rates, Notifications) {
  $scope.proposals = Proposals.filter($scope.wallet, {status: Proposals.STATUS.pending});
  $scope.needsApproval = $scope.wallet.requiresMultipleSignatures();

  $scope.unitCode = Config.currency.fiat;
  $scope.altCode = Config.currency.btc;
  $scope.unitFiat = true;

  var displayBtc = $filter('displayBtc');
  var displayFiat = $filter('displayFiat');

  console.log('Data', $stateParams);

  $scope.toggleUnit = function(value) {
    var currency = Config.currency;

    $scope.unitFiat = !$scope.unitFiat;
    $scope.unitCode = $scope.unitFiat ? currency.fiat : currency.btc;
    $scope.altCode = !$scope.unitFiat ? currency.fiat : currency.btc;

    $scope.convert(value);
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
  };

  $scope.clearForm = function(form) {
    form.address = form.amount = $scope.altAmount = form.reference = "";
    form.$setPristine();
  }

  $scope.submit = function(form) {
    if (!form.$valid) return;

    var wallet = $scope.wallet;
    var message = $scope.needsApproval ? 'Creating proposal' : 'Sending';
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> ' + message + '...'
    });

    var satoshis = Rates.toSatoshis(form.amount, $scope.unitCode);
    wallet.createTx(form.address, satoshis, form.reference, onCreate);

    function onCreate(err, proposalId) {
      if (err) throw err; // TODO: Handle this!

      if ($scope.needsApproval) {
        $ionicLoading.hide();
        Notifications.toast('Proposal created');
        $state.go('profile.wallet.proposal', {proposalId: proposalId});
      } else {
        wallet.sendTx(proposalId, onSend);
      }
    }

    function onSend(txid) {
      if (!txid) throw 'Problem Sending!'; // TODO: Handle this!
      $ionicLoading.hide();
      Notifications.toast('Transaction sent');
      $scope.clearForm(form);
    }
  }

})

.controller('ProposalCtrl', function($scope, $state, $ionicLoading, $stateParams, Proposals, Notifications) {
  $scope.proposal = Proposals.get($scope.wallet, $stateParams.proposalId);

  $scope.sign = function() {
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Signing...'
    });

    Proposals.sign($scope.wallet, $stateParams.proposalId, function onResult(err, broadcasted) {
      $ionicLoading.hide();
      if (err) throw err; // TODO: Handle this error!

      var message = broadcasted ? 'Transaction sent' : 'Proposal approved';
      Notifications.toast(message);
      $state.reload();
    });
  };

  $scope.reject = function() {
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Rejecting...'
    });

    Proposals.reject($scope.wallet, $stateParams.proposalId, function onResult(err) {
      $ionicLoading.hide();
      if (err) throw err; // TODO: Handle this error!

      Notifications.toast('Proposal rejected');
      $state.reload();
    });
  };

});
