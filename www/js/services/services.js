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

.factory('Identity', function(Config) {
  var Identity = angular.extend({}, copay.Identity);

  Identity.createProfile = function(p, callback) {
    var call = this.create.bind(this, p.email, p.password, Config.identity, callback);
    setTimeout(call, 100);
  }

  return Identity;
})

.factory('Wallets', function($timeout) {
  var WALLETS = [];
  var MOCK = [{id: 123, name: 'Personal', copayers: 1, threshold: 1, testnet: false}];

  return {
    create: function(data, cb) {
      data.id = data.id || parseInt(Math.random() * 1000);
      data.testnet = data.testnet || false;

      WALLETS.push(data);
      
      $timeout(function() {
        cb(null, data);
      }, 1500);
    },
    all: function() {
      if (WALLETS.length == 0) WALLETS = MOCK;
      return WALLETS;
    },
    get: function(id) {
      var ret = null;
      WALLETS.forEach(function(w) {
        if (w.id == id) ret = w;
      });
      return ret;
    }
  }
});
