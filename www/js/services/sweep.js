'use strict'

angular.module('copay.services')
.factory('Sweep', function(Session, Bitcore) {

  var sweep = {};

  sweep.isPrivateKey = function isPrivateKey(wif) {
    var walletKey = new Bitcore.WalletKey();
    walletKey.fromObj({priv: wif});
    return !!walletKey.priv;
  };

  sweep.getAddress = function getAddress(wif) {
    var walletKey = new Bitcore.WalletKey();
    walletKey.fromObj({priv: wif});
    var pubKeyHash = Bitcore.coinUtil.sha256ripe160(walletKey.priv.public);
    var addr = new Address(walletKey.network(), pubKeyHash);
    return addr.toString();
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
      return callback(null, Math.round(value * Bitcore.coinUtil.COIN), unspent);
    };
  }

  /**
   * Returns amount of satoshis stored in an address
   * @param {string} address - base58 encoded address
   * @param {Function} callback - to be called with params (err, balance) (in satoshis)
   */
  sweep.getFunds = function getFunds(address, callback) {
    var blockchain = Session.currentWallet.blockchain;
    blockchain.getUnspent([address], countUnspent(callback));
  };

  /**
   * Sends all funds to the given address
   */
  sweep.send = function send(wif, toAddress, callback) {
    var blockchain = Session.currentWallet.blockchain;
    blockchain.getUnspent(sweep.getAddress(wif), countUnspent(
      function(err, amountSat, unspent) {
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
      }
    ));
  };

  return sweep;
});
