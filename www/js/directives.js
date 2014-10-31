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

  .directive('validSecret', function() {
    var copay = require('copay');
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        ctrl.$parsers.unshift(function validSecret(value) {
          if (!copay.Wallet.decodeSecret(value)) {
            ctrl.$setValidity('validSecret', false);
          }
          return value;
        });
      }
    }
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
  ])

  .directive('enoughBalance', function enoughBalance(Session, Rates) {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
          var validator = function(value) {
            value = -(-value);
            var satoshis = scope.displayPrimary
              ? Rates.toSatoshis(value, scope.primaryCode)
              : Rates.fromFiat(value, scope.primaryCode);
            scope.enough = Session.currentWallet.availableBalance >= satoshis;
            ctrl.$setValidity('enoughBalance', scope.enough);
            return value;
          };
          ctrl.$parsers.unshift(validator);
        }
      };
    }
  );
