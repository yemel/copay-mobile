'use strict'
// TODO: Use a clousure to avoid cluttering the global namespace
var copay = require('copay');

angular.module('copay.services', [])

// This is a hack for having cleaner configuration
.factory('Config', function() {
  var config = {};

  config.network = {
    testnet: {
      url: 'https://test-insight.bitpay.com:443',
      transports: ['polling']
    },
    livenet: {
      url: 'https://insight.bitpay.com:443',
      transports: ['polling']
    }
  };

  config.pluginManager = new copay.PluginManager({
    plugins: { LocalStorage: true }
  });

  var walletConfig = {
    idleDurationMin: 4,
    reconnectDelay: 5000,
    totalCopayers: 3,
    requiredCopayers: 2,
    spendUnconfirmed: true,
    settings: {
      alternativeIsoCode: "USD",
      alternativeName: "US Dollar",
      unitDecimals: 2,
      unitName: "bits",
      unitToSatoshi: 100,
    }
  }

  config.identity = {
    pluginManager: config.pluginManager,
    network: config.network,
    networkName: "livenet",
    walletDefaults: walletConfig,
    passphrase: undefined,
  }

  return config;
})

.factory('Bitcore', function() {
  var bitcore = require('bitcore');
  return bitcore;
})

.factory('Session', function() {

  var Session = function() {
    this.identity = null;
    this.profile = null;
    this.pin = null;
  };

  Session.signin = function(identity) {
    this.identity = identity;
    this.profile = identity.profile;
  }

  Session.signout = function(identity) {
    this.identity = null;
  }

  return Session;
})

.factory('Identity', function(Config) {
  var Identity = angular.extend({}, copay.Identity);

  Identity.createProfile = function(p, callback) {
    var call = this.create.bind(this, p.email, p.password, Config.identity, callback);
    setTimeout(call, 100);
  }

  Identity.openProfile = function(p, callback) {
    var call = this.create.bind(this, p.email, p.password, Config.identity, callback);
    setTimeout(call, 100);
  }

  return Identity;
})

.factory('Wallets', function(Session) {
  var Wallets = function() {};

  Wallets.create = function(data, cb) {

  };

  Wallets.all = function() {
    var wallets = Object.keys(Session.profile.walletInfos);
    return wallets.map(function(id) {
      return Session.profile.walletInfos[id];
    });
  }

  Wallets.get = function(id) {
    var wallet = Session.identity.getOpenWallet(id);
    if (!wallet) throw new Error('Wallet not found');
    window.W = wallet;
    window.I = Session.identity;
    return wallet;
  }

  return Wallets;
});
