'use strict'

angular.module('copay.services')

.factory('Addresses', function(Session) {

  function Addresses() {
    this.addresses = [];
  };
  
  Addresses.prototype.filter = function(wallet) {
    return wallet.getAddressesInfo();
  };

  Addresses.prototype.createAddress = function(wallet) {
    return wallet.generateAddress(null);
  }

  return new Addresses();
});
