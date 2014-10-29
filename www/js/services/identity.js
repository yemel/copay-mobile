'use strict'

angular.module('copay.services')

// This factory extends copay.Identity for ease of use.
// TODO: Copay initialization it's broken... stop using all that config.
.factory('Identity', function(Config) {
  var copay = require('copay');

  var Identity = angular.extend({}, copay.Identity);

  Identity.createProfile = function(p, callback) {
    var opts = angular.copy(Config.identity);
    opts.email = p.email;
    opts.password = p.password;
    var identity = this.create(opts);

    var walletOptions = {
      nickname: identity.fullName,
      networkName: opts.networkName,
      requiredCopayers: 1,
      totalCopayers: 1,
      password: identity.password,
      name: 'My wallet',
    };
    identity.createWallet(walletOptions, createWalletCallback);
    function createWalletCallback(err) {
      if (err) {
        return callback(err);
      } else {
        identity.store({failIfExists: true}, function(err) {
          return callback(err, identity);
        });
      }
    }
  }

  Identity.openProfile = function(p, callback) {
    var opts = angular.copy(Config.identity);
    opts.email = p.email;
    opts.password = p.password;
    var call = Identity.open.bind(Identity, opts, callback);
    setTimeout(call, 100);
  }

  return Identity;
});
