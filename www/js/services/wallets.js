'use strict'

angular.module('copay.services')

// This factory should be replaced by Session.identity
.factory('Wallets', function(Session, Identity) {
  var Wallets = function() {};

  // TODO: This should go into main Copay and be documented
  Wallets.error = {
    badSecret: 'badSecret'
  };

  Wallets.create = function(data, cb) {
    var opts = {
      name: data.name,
      totalCopayers: data.copayers,
      requiredCopayers: data.threshold,
      networkName: data.testnet ? "testnet" : "livenet"
    }

    Session.identity.createWallet(opts, cb); // TODO: Use directlly
  };

  Wallets.join = function(secret, cb) {
    var opts = {
      secret: secret,
      nickname: Session.email // TODO: This shouldn't be necesary
    }

    Session.identity.joinWallet(opts, cb); // TODO: Use directlly
  };

  Wallets.all = function() {
    var wallets = Object.keys(Session.identity.wallets);
    return wallets.map(this.get.bind(this));
  }

  Wallets.get = function(id) {
    var wallet = Session.identity.wallets[id];
    window.W = wallet;
    window.I = Session.identity;
    return wallet;
  }

  return Wallets;
});
