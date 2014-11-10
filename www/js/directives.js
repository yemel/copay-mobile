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

  .directive('countdownBar', function($interval) {
    return {
      restrict: 'E',
      template: '<div class="progress-bar" style="width: {{width}}%; margin-left: {{margin}}%; display: {{display}}"></div>',
      link: function(scope, elem, attrs, ctrl) {
        var start, end, timeoutId;

        scope.display = 'none';
        scope.$watch(attrs.start, function(value) {
          start = value ? value-0 : 0;
        });

        scope.$watch(attrs.end, function(value) {
          end = value ? value-0 : 0;
        });

        function updateBar() {
          if (!start || !end || end <= start) {
            return scope.display = 'none';
          }

          var now = new Date() - 0;

          if (now >= end) {
            $interval.cancel(timeoutId);
            scope.display = 'none';
            if (attrs.finish) scope.$eval(attrs.finish);
            return;
          }

          scope.display = 'block';
          scope.width = Math.max(parseInt((end - now) * 100 / (end-start)), 0);
          scope.margin = 100 - scope.width;
        }

        elem.on('$destroy', function() {
          $interval.cancel(timeoutId);
        });

        timeoutId = $interval(function() {
          updateBar(); // update DOM
        }, 1000);

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
          var wallet, value;

          var validator = function(value) {
            if (!wallet) return;
            var network = wallet.getNetworkName();

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

          scope.$watch(attrs.validAddress, function(w) {
            wallet = w;
            validator(value);
          });

          scope.$watch(attrs.ngModel, function(v) {
            value = v;
            validator(value);
          });

          ctrl.$parsers.unshift(validator);
        }
      };
    }
  ])

  .directive('enoughBalance', function enoughBalance($rootScope, Session, Rates) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
          var wallet, value;

          var validator = function(value) {
            if (!wallet) return;

            value = -(-value);
            var satoshis = scope.displayPrimary
              ? Rates.toSatoshis(value, scope.primaryCode)
              : Rates.isAvailable ? Rates.fromFiat(value, scope.primaryCode) : 0;
            scope.enough = wallet.availableBalance >= satoshis;
            ctrl.$setValidity('enoughBalance', scope.enough);
            return value;
          };

          $rootScope.$on('balance', function() {
            validator(value);
          });

          scope.$watch(attrs.enoughBalance, function(w) {
            wallet = w;
            validator(value);
          });

          scope.$watch(attrs.ngModel, function(v) {
            value = v;
            validator(value);
          });

          ctrl.$parsers.unshift(validator);
        }
      };
    }
  );
