'use strict'

angular.module('copay.directives', [])
  .directive('match', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        match: '='
      },
      link: function(scope, elem, attrs, ctrl) {
        scope.$watch(function() {
          return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
        }, function(currentValue) {
          ctrl.$setValidity('match', currentValue);
        });
      }
    };
  })

  .directive('validAddress', ['Session', 'Bitcore',
    function(Session, Bitcore) {
      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
          var validator = function(value) {
            var network = Session.currentWallet.getNetworkName();

            // Bip21 uri
            if (/^bitcoin:/.test(value)) {
              var uri = new Bitcore.BIP21(value);
              var hasAddress = uri.address && uri.isValid() && uri.address.network().name === network;
              ctrl.$setValidity('validAddress', uri.data.merchant || hasAddress);
              return value;
            }

            // Regular Address
            var a = new Bitcore.Address(value);
            ctrl.$setValidity('validAddress', a.isValid() && a.network().name === network);
            return value;
          };


          ctrl.$parsers.unshift(validator);
          ctrl.$formatters.unshift(validator);
        }
      };
    }
  ]);