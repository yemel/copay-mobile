'use strict';

angular.module('copay.services')

// This is a hack for having cleaner configuration
.factory('Compatibility', function() {
  var copay = require('copay');
  return copay.Compatibility;
});
