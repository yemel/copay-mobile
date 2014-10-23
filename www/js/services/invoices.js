'use strict'

angular.module('copay.services')

.factory('Invoices', ['Session', function(Session) {

  function Invoices() {
    this.invoices = [
      { sender: 'Manuel', address: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v', amount: 12000, fiat: 42, fiatCode: "USD", reference: 'Pizza', created: new Date() - 0, status: 'pending' }
    ];
    this.STATUS = { pending: 'pending', paid: 'paid' };
  };

  Invoices.prototype.all = function() {
    return this.filter();
  }

  Invoices.prototype.filter = function(filters) {
    if (!filters) return this.invoices;

    return this.invoices.filter(testInvoice);

    function testInvoice(invoice) {
      var isValid = true;

      angular.forEach(filters, function(value, key) {
        isValid &= invoice[key] == value;
      });

      return isValid;
    }
  };

  Invoices.prototype.create = function(invoice, cb) {
    // TODO: Check preconditions: invoice.sender, invoice.sats, invoice.fiat, invoice.fiatCode, invoice.reference.
    var invoice = angular.copy(invoice);

    invoice.address = '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v';
    invoice.created = new Date() - 0;
    invoice.status = this.STATUS.pending;
    this.invoices.push(invoice);

    setTimeout(function(){ cb(null, invoice) }, 10);
  };

  Invoices.prototype.get = function(address) {
    var invoices = this.filter({address: address});
    return invoices.length > 0 ? invoices[0] : null;
  };

  return new Invoices();
}]);
