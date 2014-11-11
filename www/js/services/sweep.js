'use strict'

angular.module('copay.services')
.factory('Sweep', function(Bitcore) {

  var sweep = {};
  var copay = require('copay');

  sweep.isPrivateKey = function isPrivateKey(wif) {
    try {
      var walletKey = new Bitcore.WalletKey();
      walletKey.fromObj({priv: wif});
      return !!walletKey.privKey.public;
    } catch (e) {
      return false;
    }
  };

  sweep.getAddress = function getAddress(wif, network) {
    var walletKey = new Bitcore.WalletKey();
    walletKey.fromObj({priv: wif});
    return Bitcore.Address.fromKey(walletKey.privKey, network).toString();
  };

  sweep.getNetwork = function getAddress(wif) {
    if (wif[0] === '5' || wif[0] === '6') {
      return 'livenet';
    }
    return 'testnet';
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

  sweep.sendOutputs = function sendOutputs(blockchain, wif, toAddress, amountSat, unspent, callback) {
    var FEE_PER_KB = 10000;
    var fee = FEE_PER_KB;
    var builder = new Bitcore.TransactionBuilder({spendUnconfirmed: true})
    builder.setUnspent(unspent);
    do {
      try {
        builder.setOutputs([{
          address: toAddress.toString(),
          amountSatStr: amountSat - fee
        }]);
        break;
      } catch(e) {
        fee += FEE_PER_KB;
      }
    } while (true);
    builder.sign([wif]);

    return blockchain.broadcast(builder.build().serialize().toString('hex'), callback);
  };

  return sweep;
});
