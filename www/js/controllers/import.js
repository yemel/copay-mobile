'use strict'

angular.module('copay.controllers')

.controller('ImportCtrl', function($scope, $state, $ionicLoading, Wallets, Session, Compatibility, Notifications) {
  Compatibility.listWalletsPre8(function(wallets) {
    $scope.wallets = wallets;
    $scope.wallet = wallets[0];
  });

  $scope.tryImport = function(form) {
    var wallet = $scope.wallet;
    var password = form.password;
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Importing wallet...'
    });
    Compatibility.importEncryptedWallet(Session.identity, wallet.value, password, {},
      function(err, wallet) {
        $ionicLoading.hide();
        if (err) {
          Notifications.toast('Invalid password, please try again');
          return;
        }
        Compatibility.deleteOldWallet(wallet);
        $scope.$emit('new-wallet', wallet);
        return $state.go('profile.wallet.home', {walletId: wallet.id});
      }
    );
  };
});
