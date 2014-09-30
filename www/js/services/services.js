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
