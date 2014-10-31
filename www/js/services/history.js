'use strict'

angular.module('copay.services')

// TODO: This should be part of the wallet
.factory('History', function($rootScope, Wallets) {
  var copay = require('copay');

  var History = function() {
    this.transactions = {};

    var self = this;
    Wallets.all().forEach(function(wallet) {
      self.update(wallet);

      wallet.on('tx', function() {
        self.update(wallet);
      });

      wallet.on('txProposalsUpdated', function() {
        self.update(wallet);
      });
    });
  };

  History.prototype.all = function(wallet) {
    if (!this.transactions[wallet.id]) this.update(wallet);
    return this.transactions[wallet.id] || [];
  }

  History.prototype.update = function(wallet) {
    if (!wallet.publicKeyRing.isComplete()) return;
  
    var self = this;
    wallet.getTransactionHistory(function(err, res) {
      if (err) throw err;

      self.transactions[wallet.id] = res;
      $rootScope.$emit('transactions', wallet);
    });

  }

  return new History();
});
