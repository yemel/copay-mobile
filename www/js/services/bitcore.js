'use strict'

angular.module('copay.services')

.factory('Bitcore', function() {
  var bitcore = require('bitcore');
  return bitcore;
});
