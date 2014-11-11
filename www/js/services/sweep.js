'use strict'

angular.module('copay.services')
.factory('Sweep', function(Bitcore) {

  var sweep = {};
  var copay = require('copay');

  sweep.isPrivateKey = function isPrivateKey(wif) {
    var walletKey = new Bitcore.WalletKey();
    walletKey.fromObj({priv: wif});
    return !!walletKey.privKey.public;
  };

  sweep.getAddress = function getAddress(wif) {
    var walletKey = new Bitcore.WalletKey();
    walletKey.fromObj({priv: wif});
    return Bitcore.Address.fromKey(walletKey.privKey, walletKey.network.name).toString();
  };

  sweep.getNetwork = function getAddress(wif) {
    var walletKey = new Bitcore.WalletKey();
    walletKey.fromObj({priv: wif});
    return walletKey.network.name;
  };

  function countUnspent(callback) {
    return function(err, unspent) {
      if (err) {
        return callback(err);
      }
      var value = 0;
      _.each(unspent, function(unspent) {
        value += unspent.amount;
      });
      return callback(null, Math.round(value * Bitcore.util.COIN), unspent);
    };
  }

  /**
   * Returns amount of satoshis stored in an address
   * @param {string} address - base58 encoded address
   * @param {Function} callback - to be called with params (err, balance) (in satoshis)
   */
  sweep.getFunds = function getFunds(blockchain, address, callback) {
    blockchain.getUnspent([address], countUnspent(callback));
  };

  /**
   * Sends all funds to the given address
   */
  sweep.send = function send(blockchain, wif, toAddress, callback) {
    blockchain.getUnspent(sweep.getAddress(wif), countUnspent(function(err, amountSat, outputs) {
      sweep.sendOutputs(blockchain, wif, toAddress, callback)(err, amountSat, outputs);
    }));
  };

  sweep.sendOutputs = function sendOutputs(blockchain, wif, toAddress, callback) {
    return function(err, amountSat, unspent) {
      if (err) {
        return callback(err);
      }
      var rawTx = new Bitcore.TransactionBuilder()
        .setUtxos(unspent)
        .setOutputs({
          address: toAddress,
          amountSat: amountSat
        })
        .sign([wif])
        .build().serialize().toString('hex');

      return blockchain.broadcast(rawTx, callback);
    };
  };

  return sweep;
});
