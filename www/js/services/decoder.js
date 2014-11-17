'use strict'

angular.module('copay.services')

.factory('Decoder', function($state, Session, Sweep, Bitcore) {

  function Decoder() {
    this.strategies = [];

    this.register(new Decoder.SweepStrategy());
    this.register(new Decoder.JoinStrategy());
    this.register(new Decoder.BIP21Strategy());
    this.register(new Decoder.AddressStrategy());
  };

  Decoder.prototype.process = function(data) {
    var strategy = this.strategyFor(data)
    if (strategy) strategy.execute(data);
    return !!strategy;
  }

  Decoder.prototype.strategyFor = function(data) {
    for (var i = 0; i < this.strategies.length; i++) {
      var strategy = this.strategies[i];
      if (strategy.test(data)) return strategy;
    }

    return null;
  };

  Decoder.prototype.register = function(strategy) {
    if (!angular.isFunction(strategy.test)) throw "Invalid test function";
    if (!angular.isFunction(strategy.execute)) throw "Invalid execute function";

    this.strategies.push(strategy);
  };


  Decoder.SweepStrategy = function (){
    this.test = function (data) {
      return Sweep.isPrivateKey(data);
    };

    this.execute = function (data) {
      return $state.go('profile.sweep', { data: data });
    };
  };

  Decoder.JoinStrategy = function() {
    this.test = function (data) {
      var copay = require('copay');
      var secret = copay.Wallet.decodeSecret(data);
      return secret && secret.secretNumber;
    };

    this.execute = function (data) {
      return $state.go('profile.add', { secret: data });
    };
  };

  Decoder.BIP21Strategy = function() {
    this.test = function (data) {
      try {
        var info = new Bitcore.BIP21(data);
        return info.isValid();
      } catch (e) {
        return false;
      }
    };

    this.execute = function (data) {
      var view = 'profile.payment';
      var args = {data: data};

      if (Session.currentWallet) {
        var info = new Bitcore.BIP21(data);
        var paymentNetwork = info.address && info.address.network().name;
        if (Session.currentWallet.getNetworkName() === paymentNetwork) {
          view = 'profile.wallet.send';
          args.walletId = Session.currentWallet.id;
        }
      }

      $state.go(view, args);
    };
  };

  Decoder.AddressStrategy = function() {
    this.test = function (data) {
      return new Bitcore.Address(data).isValid();
    };

    this.execute = function (data) {
      var strategy = new Decoder.BIP21Strategy();
      return strategy.execute('bitcoin:' + data);
    };
  };

  return new Decoder();
});
