'use strict'

angular.module('copay.services')

// This factory extends copay.Identity for ease of use.
// TODO: Copay initialization it's broken... stop using all that config.
.factory('Identity', function(Config) {
  var copay = require('copay');

  var Identity = angular.extend({}, copay.Identity);

  Identity.createProfile = function(p, callback) {
    var opts = angular.copy(Config.identity);
    var call = this.create.bind(this, p.email, p.password, opts, callback);
    setTimeout(call, 100);
  }

  Identity.openProfile = function(p, callback) {
    var opts = angular.copy(Config.identity);
    var call = Identity.open.bind(Identity, p.email, p.password, opts, callback);
    setTimeout(call, 100);
  }

  return Identity;
});
