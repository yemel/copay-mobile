'use strict'

angular.module('copay.controllers')

.controller('SidebarCtrl', ['$scope', '$state', 'Session', 'Wallets', function SidebarCtrl($scope, $state, Session, Wallets) {
  $scope.profile = Session.profile;
  $scope.wallets = Wallets.all();
}])

.controller('TabsCtrl', ['$scope', '$state', '$stateParams', 'Session', 'Wallets', 'Proposals', function($scope, $state, $stateParams, Session, Wallets, Proposals) {
  $scope.wallet = Session.currentWallet = Wallets.get($stateParams.walletId);

  $scope.pendingProposals = function() {
    if (!$scope.wallet || !$scope.wallet.isShared()) return 0;
    return Proposals.filter($scope.wallet, { status: Proposals.STATUS.pending }).length;
  };

  // Inexistent Wallet, redirect to default one
  if (!$scope.wallet) {
    var defualtWallet = Wallets.all()[0];
    return $state.go('profile.wallet.home', {walletId: defualtWallet.id});
  }

}]);
