'use strict'

angular.module('copay.controllers')

.controller('SidebarCtrl', function($scope, $state, $window, $cordovaBarcodeScanner, $ionicModal, $ionicPopup, Session, Wallets, Notifications, Compatibility, Sweep) {

  $scope.profile = Session.profile;
  $scope.wallets = Wallets.all();

  var updateOldWallets = function() {
    Compatibility.listWalletsPre8(function(wallets) {
      $scope.anyWallet = wallets.length > 0 ? true : false;
    });
  };
  updateOldWallets();

  $scope.$on('new-wallet', function(ev) {
    $scope.wallets = Wallets.all();
    updateOldWallets();
  });

  // TODO: Move this to scan service
  $scope.openCamera = function() {

    if (!$window.cordova) {
      var data = $window.prompt("Insert scanned data");
      return data ? onScan(data) : onError(null);
    }

    $cordovaBarcodeScanner.scan().then(onCamera, onError);

    // TODO: Should this belong to a Camera Service ?
    function onCamera(result) {
      if (result.cancelled) {
        // Copyrighted Hack: http://marsbomber.com/2014/05/29/BarcodeScanner-With-Ionic/
        $ionicModal.fromTemplate('').show().then(function() {
          $ionicPopup.alert({
            title: 'QR Scan Cancelled',
            template: 'You cancelled it!'
          });
        });
      } else {
        onScan(result.text);
      }
    }

    function onScan(data) {
      var copay = require('copay');
      if (Sweep.isPrivateKey(data)) {
        return $state.go('profile.sweep', { data: data});
      }
      if (copay.Wallet.decodeSecret(data)) {
        return $state.go('profile.add', { secret: data });
      }

      // TODO: Check if its an Bitcoin Address
      if (Session.currentWallet) {
        $state.go('profile.wallet.send', {
          walletId: Session.currentWallet.id,
          data: data
        });
      } else {
        $state.go('profile.payment', {data: data});
      }
    }

    function onError(error) {
      Notifications.toast("Nothing to scan there");
    }

  };
})

// Note that Addresses, History are only injected to initializate them ASAP
.controller('TabsCtrl', function($scope, $state, $stateParams, Session, Wallets, Proposals, Addresses, History) {
  $scope.wallet = Session.currentWallet = Wallets.get($stateParams.walletId);

  $scope.pendingProposals = function() {
    if (!$scope.wallet || !$scope.wallet.isShared()) return 0;
    return Proposals.filter($scope.wallet, { status: Proposals.STATUS.pending }).length;
  };

  // Inexistent Wallet, redirect to default one
  if (!$scope.wallet) {
    var defualtWallet = Wallets.all()[0]; // TODO: Use last opened wallet
    return $state.go('profile.wallet.home', {walletId: defualtWallet.id});
  }


});
