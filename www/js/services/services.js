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
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var products = [
    { id: 0, name: 'Clasic Guitar', price: 99.95 },
    { id: 1, name: 'Electric Guitar', price: 400 },
    { id: 2, name: 'Violin', price: 700.5 },
    { id: 3, name: 'Bass', price: 12.99 },
    { id: 4, name: 'Drum set', price: 120 },
    { id: 5, name: 'Guitar pick', price: 1.99 }
  ];

  return {
    all: function() {
      return products;
    },
    get: function(productId) {
      // Simple index lookup
      return products[productId];
    }
  }
});
