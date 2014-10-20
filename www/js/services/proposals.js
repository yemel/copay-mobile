angular.module('copay.services')

.factory('Proposals', function(Session) {

  function Proposals() {
    this.proposals = [
      { id: 'invoice123', receiver: 'Alexy', address: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v', amount: 12000, fiat: 42, fiatCode: "USD", reference: 'Pizza', created: new Date() - 23000, status: 'pending' },
      { id: 'invoice124', receiver: 'Maria', address: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v', amount: 12000, fiat: 42, fiatCode: "USD", reference: 'Pizza', created: new Date() - 23000, status: 'accepted' },
      { id: 'invoice125', receiver: 'Lucia', address: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v', amount: 12000, fiat: 42, fiatCode: "USD", reference: 'Pizza', created: new Date() - 23000, status: 'rejected' }
    ];

    this.STATUS = {
      pending: 'pending',
      rejected: 'rejected',
      accepted: 'accepted'
    };
  }

  Proposals.prototype.filter = function(filters) {
    if (!filters) return this.proposals;

    return this.proposals.filter(testProposal);

    function testProposal(proposal) {
      var isValid = true;

      angular.forEach(filters, function(value, key) {
        isValid &= proposal[key] == value;
      });

      return isValid;
    }
  };

  Proposals.prototype.all = function() {
    return this.filter();
  };

  Proposals.prototype.get = function(proposalId) {
    var proposals = this.filter({id: proposalId});
    return proposals.length > 0 ? proposals[0] : null;
  };

  Proposals.prototype.create = function(proposal, cb) {
    // TODO: check preconditions: prop.receiver, prop.address, prop.amount, prop.fiat, prop.fiatCode, prop.reference
    // proposal.id = wallet.createProposal({...})
    proposal.created = new Date() - 0;
    proposal.status = this.STATUS.pending;
    this.proposals.push(proposal);

    setTimeout(function(){ cb(null, proposal) }, 10);
  };

  return new Proposals();

});
