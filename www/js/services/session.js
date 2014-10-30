'use strict'

angular.module('copay.services')

.factory('Session', function($window, crypto) {

  var Session = function() {
    this.identity = null;
    this.pin = null;
    this.currentWallet = null;
  };

  Session.prototype.signin = function(identity) {
    this.identity = identity;
  };

  Session.prototype.signout = function(identity) {
    this.identity = null;
  };

  Session.prototype.isLogged = function() {
    return !!this.identity;
  };

  // ======= Temporal Hack ========
  // TODO: Encript credentials with PIN
  Session.prototype.hasCredentials = function() {
    return !!$window.localStorage.getItem('session:data');
  };

  Session.prototype.clearCredentials = function() {
    $window.localStorage.removeItem('session:data');
  }

  Session.prototype.setCredentials = function(pin, credentials) {
    var data = JSON.stringify(credentials);

    var key = crypto.kdf(pin);
    $window.localStorage.setItem('session:data', crypto.encrypt(key, data));
  };

  Session.prototype.getCredentials = function(pin) {
    var data = $window.localStorage.getItem('session:data');
    if (!data) return null;

    var key = crypto.kdf(pin);
    data = crypto.decrypt(key, data);
    var matches = !!data;
    return matches ? JSON.parse(data) : null;
  };

  return new Session();
});
