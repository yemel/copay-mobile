'use strict'

angular.module('copay.services')

// TODO: This should be part of the wallet
.factory('History', function() {
  var copay = require('copay');

  var History = function() {
    this.cache = {};
    this.loading = {};
  };

  History.prototype.all = function(wallet) {
    if (!this.cache[wallet.id]) this.update(wallet);
    return this.cache[wallet.id] || [];
  }

  History.prototype.update = function(wallet) {
    var self = this;

    self.loading[wallet.id] = true;
    wallet.getTransactionHistory(function(err, res) {
      if (err) throw err;

      self.cache[wallet.id] = res;
      self.loading[wallet.id] = false;
      console.log('TXS', res);
      window.TXS = res;
      // TODO: Emit Event when finished!
    });

  }

  History.prototype.isLoading = function(wallet) {
    return this.loading[wallet.id];
  };

  return new History();
});
