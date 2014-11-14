'use strict'

angular.module('copay.services')

// This class provides some missing functionalities from Copay
// TODO: Implement this on copay lib
.factory('Proposals', function(Session, Bitcore) {

  function Proposals() {
    this.STATUS = {
      pending: 'pending',
      rejected: 'rejected',
      approved: 'approved'
    };
  }

  Proposals.prototype.filter = function(wallet, filters) {
    if (!filters) return this.all(wallet);

    return this.all(wallet).filter(testProposal);

    function testProposal(proposal) {
      var isValid = true;

      angular.forEach(filters, function(value, key) {
        isValid &= proposal[key] == value;
      });

      return isValid;
    }
  };

  // TODO: All this processing should be done by Copay Lib!
  Proposals.prototype.all = function(wallet) {
    var self = this;
    var copayerId = wallet.getMyCopayerId();
    var proposals = wallet.getPendingTxProposals().sort(function(t1, t2) {
        return t2.createdTs - t1.createdTs;
    });
    return proposals.txs.map(function(proposal) {
      proposal.awaitingAction = proposal.isPending
                                && copayerId != proposal.creator
                                && !proposal.rejectedByUs
                                && !proposal.signedByUs;
      proposal.id = proposal.ntxid;

      proposal.total = 0;
      _.each(proposal.outs, function(out) {
        // TODO: This is totally backwards, it comes in the current configuration, be ready
        // to have it changed.
        proposal.total += out.value * wallet.settings.unitToSatoshi;
        // TODO: Handle multiple outputs
        proposal.address = out.address;
      });

      proposal.status = proposal.isPending
        ? self.STATUS.pending
        : proposal.finallyRejected ? self.STATUS.rejected : self.STATUS.approved;

      proposal.signers = wallet.getRegisteredPeerIds().filter(function(copayer) {
        return proposal.signedBy[copayer.copayerId];
      });

      proposal.rejecters = wallet.getRegisteredPeerIds().filter(function(copayer) {
        return proposal.rejectedBy[copayer.copayerId];
      });
      return proposal;
    });
  };

  Proposals.prototype.get = function(wallet, proposalId) {
    var proposals = this.filter(wallet, {id: proposalId});
    return proposals.length > 0 ? proposals[0] : null;
  };

  Proposals.prototype.reject = function(wallet, proposalId, cb) {
    wallet.reject(proposalId);
    cb();
  }

  Proposals.prototype.sign = function(wallet, proposalId, cb) {
    var signed = false;
    try {
      signed = wallet.sign(proposalId)
    } catch (e) {}
    if (!signed) cb('Could not sign the transaction');

    var proposal = wallet.txProposals.getTxProposal(proposalId);
    var hasToSend = proposal.builder.isFullySigned();
    return hasToSend ? wallet.sendTx(proposalId, onSend) : cb(null, false);

    function onSend(txid) {
      if (!txid) return cb('Error sending');
      cb(null, true);
    }
  };

  return new Proposals();
});
