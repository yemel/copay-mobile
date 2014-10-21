'use strict'

angular.module('copay.services')

// This is a hack for having cleaner configuration
.factory('Config', function() {
  var copay = require('copay');

  var config = {};

  // TODO: This should be a Profile preference
  config.currency = {
    btc: "BTC",
    fiat: "USD"
  }

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

  config.rates = {
    url: 'https://bitpay.com/api/rates',
    updateFrequencySeconds: 60 * 60
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
    passphraseConfig: {
      iterations: 100,
      storageSalt: "mjuBtGybi/4="
    }
  }

  return config;
});
