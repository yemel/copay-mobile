'use strict'

angular.module('copay.filters', [])
  .filter('defined', function() {
    return function(value) {
        return typeof(value) !== 'undefined' && value !== null;
      }
    })
  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }) : '';
    }
  })
  .filter('displayBtc', ['Config', function(Config) {
    return function(satoshis) {
      var value = satoshis * Config.currency.btc[1];
      return value + " " + Config.currency.btc[0];
    }
  }])
  .filter('displayFiat', ['Config', 'Rates', function(Config, Rates) {
    return function(satoshis) {
      var unit = " " + Config.currency.fiat;
      if (!Rates.isAvailable) return "$0" + unit;
      return "$" + Rates.toFiat(satoshis, Config.currency.fiat) + unit;
    }
  }])
  .filter('range', function() {
    return function(input, from, to) {
      var min = parseInt(from, 10);
      var max = parseInt(to, 10);
      var ret = [];

      for (var i = min; i <= max; i++) {
        ret.push(i);
      }
      return ret;
    }
  });
