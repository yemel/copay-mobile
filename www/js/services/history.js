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
    self.transactions[wallet.id] = [];
    wallet.getTransactionHistory(processPage);

    function processPage(err, history) {
      if (err) throw err;

      self.transactions[wallet.id] = self.transactions[wallet.id].concat(history.items);
      if (history.currentPage < history.nbPages) {
        var next = {currentPage: history.currentPage+1, itemsPerPage: history.itemsPerPage};
        wallet.getTransactionHistory(processPage);
      } else {
        $rootScope.$emit('transactions', wallet);
      }
    }
  }

  return new History();
});
