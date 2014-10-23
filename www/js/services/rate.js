'use strict';

var RateService = function($http, Config) {
  this.isAvailable = false;
  this.UNAVAILABLE_ERROR = 'Service is not available - check for service.isAvailable or use service.whenAvailable';
  this.SAT_TO_BTC = 1 / 1e8;
  this.BTC_TO_SAT = 1e8;

  this.UNITS = {
    "BTC": 1e8,
    "bits": 1e6,
    "mBTC": 1e3,
    "Satoshis": 1
  };

  var MINS_IN_HOUR = 60;
  var MILLIS_IN_SECOND = 1000;
  var rateServiceConfig = Config.rates;
  var updateFrequencySeconds = rateServiceConfig.updateFrequencySeconds || 60 * MINS_IN_HOUR;
  var rateServiceUrl = rateServiceConfig.url || 'https://bitpay.com/api/rates';
  this.queued = [];
  this.alternatives = [];
  var that = this;
  var backoffSeconds = 5;

  var retrieve = function() {
    $http.get(rateServiceUrl)
      .success(function(listOfCurrencies) {
        var rates = {};
        listOfCurrencies.forEach(function(element) {
          rates[element.code] = element.rate;
          that.alternatives.push({
            name: element.name,
            isoCode: element.code,
            rate: element.rate
          });
        });
        that.isAvailable = true;
        that.rates = rates;
        that.queued.forEach(function(callback) {
          setTimeout(callback, 1);
        });
        setTimeout(retrieve, updateFrequencySeconds * MILLIS_IN_SECOND);
      })
      .error(function(data) {
        backoffSeconds *= 1.5;
        setTimeout(retrieve, backoffSeconds * MILLIS_IN_SECOND);
      });
  };

  retrieve();
};

RateService.prototype.whenAvailable = function(callback) {
  if (this.isAvailable) {
    setTimeout(callback, 1);
  } else {
    this.queued.push(callback);
  }
};

RateService.prototype.toFiat = function(satoshis, code) {
  if (!this.isAvailable) {
    throw new Error(this.UNAVAILABLE_ERROR);
  }
  return satoshis * this.SAT_TO_BTC * this.rates[code];
};

RateService.prototype.fromFiat = function(amount, code) {
  if (!this.isAvailable) {
    throw new Error(this.UNAVAILABLE_ERROR);
  }
  return amount / this.rates[code] * this.BTC_TO_SAT;
};

RateService.prototype.toSatoshis = function(amount, code) {
  if (this.UNITS[code]) return amount * this.UNITS[code];
  return this.fromFiat(amount, code);
};

RateService.prototype.fromSatoshis = function(satoshis, code) {
  if (this.UNITS[code]) return satoshis / this.UNITS[code];
  return this.toFiat(satoshis, code);
};

RateService.prototype.listAlternatives = function() {
  if (!this.isAvailable) {
    throw new Error(this.UNAVAILABLE_ERROR);
  }

  var alts = [];
  this.alternatives.forEach(function(element) {
    alts.push({
      name: element.name,
      isoCode: element.isoCode
    });
  });
  return alts;
};

angular.module('copay.services').service('Rates', RateService);
