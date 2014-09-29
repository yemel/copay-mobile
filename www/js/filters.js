angular.module('copay.filters', [])
  .filter('defined', function() {
    return function(value) {
        return typeof(value) !== 'undefined' && value !== null;
      }
    });
