angular.module('copay.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Identity', function($timeout) {
  var PROFILE = null;

  return {
    createProfile: function(profile, cb) {

      function mockInsight() {
        PROFILE = {
          name: profile.name,
          email: profile.email
        }

        // for testing errors
        if (profile.email == 'used@gmail.com')
          return cb(["The email is already in use"]);

        cb(null, profile);
      }

      $timeout(mockInsight, 1500);
    },
    setPin: function(pin, cb) {
      PROFILE.pin = pin;
      cb(null, profile);
    },
    fetchProfile: function(data, cb) {

      function mockInsight() {
        if (data.email != 'yemel@bitpay.com')
          return cb(["Profile doesn't exists"]);

        PROFILE = {
          name: 'Yemel Jardi',
          email: 'yemel@bitpay.com'
        }
        return cb(null, PROFILE);
      }

      $timeout(mockInsight, 1500);
    }
  }
})


.factory('Wallets', function() {
  var WALLETS = [];
  var MOCK = [{name: 'Personal', copayers: 1, threshold: 1}];

  return {
    create: function(data, cb) {
      WALLETS.push(data);
      cb(null, data);
    },
    all: function() {
      if (WALLETS.length == 0) WALLETS = MOCK;
      return WALLETS;
    }
  }
});
