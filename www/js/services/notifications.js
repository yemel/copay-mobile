'use strict'

angular.module('copay.services')

.factory('Notifications', function($rootScope, $window, $ionicLoading, $cordovaToast, $cordovaLocalNotification, Wallets) {

  function Notifications() {
    this.isNative = !!$window.cordova;

    var self = this;
    Wallets.all().forEach(self.subscribeWallet.bind(self));

    $rootScope.$on('new-wallet', function(ev, wallet) {
      self.subscribeWallet(wallet); // TODO: Use bind method
    });
  };

  Notifications.prototype.subscribeWallet = function(wallet) {
    var self = this;
    wallet.on('tx', function(address) {
      self.notify('Incoming transaction', wallet.name + ' Wallet', wallet.id + address);
    });

    wallet.on('txProposalEvent', function(proposal) {;
      self.notify("Spendig Proposal", wallet.name + ' Wallet', proposal.cId);
    });
  };

  Notifications.prototype.notify = function(title, message, id) {
    if (!this.isNative) return console.log('NOTIFICATION:', title, message, id);

    $cordovaLocalNotification.add({
      id: id,
      message: message,
      title: title,
      icon: 'notification',
      smallIcon: 'notification_small'
    });
  };

  Notifications.prototype.toast = function(message) {
    // Show somethig at the browser, for developing ease
    if (!this.isNative) {
      $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    } else {
      $cordovaToast.showLongBottom(message);
    }
  };

  return new Notifications();
});
