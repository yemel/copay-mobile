'use strict'

angular.module('copay.services')

// TODO: Make this functionality part of Wallet
.factory('Addresses', function($rootScope, Wallets) {

  function Addresses() {
    this.addresses = {};

    var self = this;
    Wallets.all().forEach(function(wallet) {
      self.loadAddresses(wallet);
    });
  };

  Addresses.prototype.loadAddresses = function(wallet) {
    if (!wallet.publicKeyRing.isComplete()) return;

    // Update Addresses
    this.addresses[wallet.id] = wallet.getAddressesInfo();
    wallet.balance = 0;

    // Update Balances
    var self = this;
    wallet.getBalance(function(err, balance, addressesBalance) {
      if (err) throw err;

      wallet.balance = balance;
      self.addresses[wallet.id].forEach(function(address) {
        address.balance = addressesBalance[address.addressStr] || 0;
      });

      $rootScope.$apply();
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
