'use strict'

angular.module('copay.controllers')

.controller('AbstractSendCtrl', function($scope, $rootScope, $filter, $state, $ionicLoading, $ionicPopup, $stateParams, Config, Rates, Notifications, Addresses, Bitcore, PayPro) {
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

  $scope.getWallet = function() {
    throw "Error, this method should be defined by the child controller";
  };

  $scope.loadWalletList = function() {
    // this method may be overrited by the child controller
  };

  $scope.cancel = function() {
    $scope.data = {};
    $scope.lock = null;
    $scope.convert();
    if ($scope.wallet) {
      $state.go('profile.wallet.send', {data: null});
    } else {
      $state.go('profile.wallet.home');
    }
  }

  $scope.submit = function(form, data) {
    if (!form.$valid) return;

    var wallet = $scope.getWallet();
    var message = $scope.needsApproval ? 'Creating proposal' : 'Sending';
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> ' + message + '...'
    });

    var satoshis = getSatoshis(data.amount);

    if (data.paymentRequest) {
      wallet.createPaymentTx({
        uri: data.paymentRequest.request_url,
        memo: data.reference
      }, onCreate);
    } else {
      wallet.createTx(data.address, satoshis, data.reference, onCreate);
    }

    function onCreate(err, proposalId) {
      if (err) {
        $ionicLoading.hide();
        var message = err.toString();
        if (message.match('BIG')) {
           message = 'The transaction is too big to be created. '
                   + 'Try creating multiple transactions for smaller amounts.';
        }
        $ionicPopup.alert({
          title: 'Couldn\'t create the transaction',
          template: 'There was an unexpected problem: ' + message
        });
        return;
      }

      $scope.cancel();
      if ($scope.needsApproval) {
        $ionicLoading.hide();
        Notifications.toast('Proposal created');
        $state.go('profile.wallet.proposal', {
          walletId: wallet.id,
          proposalId: proposalId
        });
      } else {
        wallet.sendTx(proposalId, onSend);
      }
    }

    function onSend(txid) {
      if (!txid) throw 'Problem Sending!'; // TODO: Handle this!
      $ionicLoading.hide();
      Notifications.toast('Transaction sent');
      $state.go('profile.wallet.history', {walletId: wallet.id});
    }
  }

  $rootScope.$on('rates', function() {
    if (!$scope.data.amount) return;
    $scope.convert($scope.data.amount);
  });

  $rootScope.$on('balance', function() {
    $scope.$apply();
  });

  // Fill the form with the payment info
  $scope.data = {};
  if ($stateParams.data) {
    try {
      var paymentInfo = new Bitcore.BIP21($stateParams.data);
    } catch (e) {
      return Notifications.toast('The scanned code is invalid');
    }

    if (paymentInfo.data.merchant) {
      $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i> Loading...'
      });
      return PayPro.getPaymentRequest({uri: paymentInfo.data.merchant}, onPaymentRequest);
    }

    $scope.data.reference = paymentInfo.data.message;

    if (paymentInfo.address) {
      $scope.data.address = paymentInfo.address + '';
      $scope.data.network = paymentInfo.address.network().name;
    }

    if (paymentInfo.data.amount) {
      $scope.data.amount = Rates.convert(paymentInfo.data.amount, "BTC", Config.currency.btc);
      $scope.setUnit($scope.data.amount, true);
    }

    $scope.lock = angular.copy($scope.data);
  }

  function onPaymentRequest(err, data) {
    if (err) return Notifications.toast("Could not processes the payment request");

    $ionicLoading.hide();
    var paymentDetails = data.paymentRequest.paymentDetails;

    $scope.data.paymentRequest = data;
    $scope.data.domain = paymentDetails.domain;
    $scope.data.trusted = data.paymentRequest.trusted;
    $scope.data.network = paymentDetails.network;
    $scope.data.reference = paymentDetails.memo;
    $scope.data.amount = Rates.convert(paymentDetails.amount, "Satoshis", Config.currency.btc);
    $scope.setUnit($scope.data.amount, true);

    $scope.data.isExpired = paymentDetails.expires - new Date() <= 0;
    $scope.data.created = paymentDetails.time;
    $scope.data.expires = paymentDetails.expires;

    $scope.onExpired = function() {
      $scope.data.isExpired = true;
    }

    if ($scope.data.isExpired) Notifications.toast("The payment request has expired");

    $scope.lock = {amount: !!$scope.data.amount, reference: !!$scope.data.reference};
    $scope.loadWalletList();
    $scope.$apply();
  }

})

.controller('SendCtrl', function($scope, $controller, Proposals) {
  angular.extend(this, $controller('AbstractSendCtrl', {$scope: $scope}));

  $scope.proposals = Proposals.filter($scope.wallet, {status: Proposals.STATUS.pending});
  $scope.needsApproval = $scope.wallet.requiresMultipleSignatures();
  $scope.data.wallet = $scope.wallet;

  $scope.getWallet = function() {
    return $scope.wallet;
  };
})

.controller('PaymentCtrl', function($scope, $state, $controller, Wallets, Notifications) {
  angular.extend(this, $controller('AbstractSendCtrl', {$scope: $scope}));


  $scope.loadWalletList = function() {
    // Filter wallets by address network
    var filterTestnet = ($scope.data.network || 'livenet') == 'testnet';
    $scope.walletList = Wallets.all().filter(function(wallet) {
      return filterTestnet == wallet.isTestnet();
    });

    // Exit if no available wallet
    if ($scope.walletList.length == 0) {
      Notifications.toast('No wallets avaiable for ' + $scope.data.network + ' network');
      return $scope.cancel();
    }

    $scope.data.wallet = $scope.walletList[0];
  }

  $scope.changeWallet = function() {
    // TODO: refresh balance
    $scope.needsApproval = $scope.data.wallet.requiresMultipleSignatures();;
  };

  $scope.loadWalletList();
  $scope.changeWallet();

  $scope.getWallet = function() {
    return $scope.data.wallet;
  };

})


.controller('ProposalCtrl', function($scope, $rootScope, $state, $ionicLoading, $stateParams, Proposals, Notifications) {
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

      var next = broadcasted ? 'profile.wallet.history' : 'profile.wallet.send';
      return $state.go(next);
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
      return $state.go('profile.wallet.send');
    });
  };

});
