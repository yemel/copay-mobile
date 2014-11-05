'use strict'

angular.module('copay.services')

// TODO: Make this functionality part of Wallet
.factory('Addresses', function($rootScope, Wallets) {

  function Addresses() {
    this.addresses = {};

    var self = this;
    Wallets.all().forEach(self.subscribeWallet.bind(self));

    $rootScope.$on('new-wallet', function(ev, wallet) {
      self.subscribeWallet(wallet);
    });
  };

  Addresses.prototype.subscribeWallet = function(wallet) {
      var self = this;
      self.loadAddresses(wallet);
      wallet.on('tx', self.loadAddresses.bind(self, wallet));
      wallet.on('txProposalsUpdated', self.loadAddresses.bind(self, wallet));
      wallet.on('newAddresses', self.loadAddresses.bind(self, wallet));
  };

  Addresses.prototype.loadAddresses = function(wallet) {
    if (!wallet.publicKeyRing.isComplete()) return;

    // Update Addresses
    this.addresses[wallet.id] = wallet.getAddressesInfo();
    wallet.balance = 0;
    wallet.availableBalance = 0;

    // Update Balances
    var self = this;
    wallet.getBalance(function(err, balance, addressesBalance, availableBalance) {
      if (err) throw err;

      wallet.balance = balance;
      wallet.availableBalance = availableBalance;
      self.addresses[wallet.id].forEach(function(address) {
        address.balance = addressesBalance[address.addressStr] || 0;
      });

      $rootScope.$emit('balance', wallet);
    });
  };

  Addresses.prototype.filter = function(wallet) {
    return this.addresses[wallet.id];
  };

  Addresses.prototype.createAddress = function(wallet) {
    var address = wallet.generateAddress(null);
    this.loadAddresses(wallet);
    return address;
  }

  return new Addresses();
});
