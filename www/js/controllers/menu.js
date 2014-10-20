angular.module('copay.controllers')

.controller('SidebarCtrl', function($scope, $state, Session, Wallets) {
  $scope.profile = Session.profile;
  $scope.wallets = Wallets.all();
})

.controller('TabsCtrl', function($scope, $state, $stateParams, Wallets, Invoices, Proposals) {
  $scope.wallet = Wallets.get($stateParams.walletId);

  $scope.pendingInvoices = function() {
    return Invoices.filter({ status: Invoices.STATUS.pending }).length;
  };

  $scope.pendingProposals = function() {
    if (!$scope.wallet || !$scope.wallet.isShared()) return 0;
    return Proposals.filter({ status: Proposals.STATUS.pending }).length;
  };

  // Inexistent Wallet, redirect to default one
  if (!$scope.wallet) {
    var defualtWallet = Wallets.all()[0];
    return $state.go('profile.wallet.home', {walletId: defualtWallet.id});
  }

});
