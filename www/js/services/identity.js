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
    var call = this.create.bind(this, opts, callback);
    setTimeout(call, 100);
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
