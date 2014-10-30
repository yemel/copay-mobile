'use strict'

angular.module('copay.services')

.factory('crypto', function() {
  return require('copay').cryptoUtils;
});
