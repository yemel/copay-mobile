'use strict'

angular.module('copay.controllers')

.controller('SendCtrl', function($scope, $filter, $state, $ionicLoading, $stateParams, Proposals, Config, Rates, Notifications, Bitcore) {
  $scope.proposals = Proposals.filter($scope.wallet, {status: Proposals.STATUS.pending});
  $scope.needsApproval = $scope.wallet.requiresMultipleSignatures();

  $scope.primaryCode = Config.currency.fiat;
  $scope.secondaryCode = Config.currency.btc;
  $scope.displayPrimary = false;

  var displayBtc = $filter('displayBtc');
  var displayFiat = $filter('displayFiat');

  $scope.toggleUnit = function(value) {
    $scope.setUnit(value, !$scope.displayPrimary);
  };

  $scope.setUnit = function(value, displayPrimary) {
    var currency = Config.currency;

    $scope.displayPrimary = displayPrimary;
    $scope.primaryCode = $scope.displayPrimary ? currency.btc : currency.fiat;
    $scope.secondaryCode = !$scope.displayPrimary ? currency.btc : currency.fiat;
    $scope.convert(value);
  };

  var getSatoshis = function(value) {
    if ($scope.displayPrimary) {
      return Rates.toSatoshis(value, Config.currency.btc);
    } else {
      return Rates.fromFiat(value, Config.currency.fiat);
    }
  };

  $scope.convert = function(value) {
    if (!value) return $scope.secondaryAmount = null;

    if ($scope.displayPrimary) {
      $scope.secondaryAmount = displayFiat(getSatoshis(value));
    } else {
      $scope.secondaryAmount = displayBtc(getSatoshis(value));
    }
  };

  $scope.clearForm = function(form, data) {
    data.address = data.amount = data.reference = $scope.altAmount = "";
    form.$setPristine();
  }

  $scope.submit = function(form, data) {
    if (!form.$valid) return;

    var wallet = $scope.wallet;
    var message = $scope.needsApproval ? 'Creating proposal' : 'Sending';
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> ' + message + '...'
    });

    var satoshis = getSatoshis(data.amount);
    wallet.createTx(data.address, satoshis, data.reference, onCreate);

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
      $state.go('profile.wallet.history');
    }
  }

  // Fill the form with the payment info
  if ($stateParams.data) {
    var paymentInfo = new Bitcore.BIP21($stateParams.data);

    $scope.data = {
      address: paymentInfo.address + '',
      reference: paymentInfo.data.message
    };

    if (paymentInfo.data.amount) {
      $scope.data.amount = Rates.convert(paymentInfo.data.amount, "BTC", Config.currency.btc);
      $scope.setUnit($scope.data.amount, true);
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
      return $state.go('profile.wallet.history');
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
