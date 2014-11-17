'use strict'

angular.module('copay.controllers')

.controller('SidebarCtrl', function($scope, Session, Wallets, Compatibility, Camera, Notifications) {

  $scope.profile = Session.profile;
  $scope.wallets = Wallets.all();
  $scope.camera = Camera;

  Notifications.subscribeAll($scope.wallets);

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
