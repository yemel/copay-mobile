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

    var txs = wallet.getTxProposals().sort(function(t1, t2) {
        return t2.createdTs - t1.createdTs;
    });

    var proposals = [];
    var copayerId = wallet.getMyCopayerId();
    txs.forEach(function(tx) {
      var t = tx.builder.build();
      tx.outputs = [];
      tx.total = 0;

      t.outs.forEach(function(output) {
        var address = Bitcore.Address.fromScriptPubKey(output.getScript(), wallet.getNetworkName())[0].toString();
        var isOwnAddress = wallet.addressIsOwn(address, {excludeMain: true});
        if (!isOwnAddress) {
          tx.outputs.push({
            address: address,
            value: output.getValue()
          });

          tx.total += output.getValue();
        }
      });

      tx.fee = tx.builder.feeSat;
      tx.missingSignatures = t.countInputMissingSignatures(0);
      tx.awaitingAction = tx.isPending && copayerId != tx.creator && !tx.rejectedByUs && !tx.signedByUs;
      tx.id = tx.ntxid;
      tx.status = tx.isPending
        ? self.STATUS.pending
        : tx.finallyRejected ? self.STATUS.rejected : self.STATUS.approved;

      tx.signers = wallet.getRegisteredPeerIds().filter(function(copayer) {
        return tx.signedBy[copayer.copayerId];
      });

      tx.rejecters = wallet.getRegisteredPeerIds().filter(function(copayer) {
        return tx.rejectedBy[copayer.copayerId];
      });

      proposals.push(tx);
    });

    return proposals;
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
    wallet.sign(proposalId, function onSigning(err) {
      if (err) return cb(err);
      var proposal = wallet.txProposals.getTxProposal(proposalId);
      if (proposal.builder.isFullySigned()) {
        wallet.sendTx(proposalId, onSend);
      }
    });

    function onSend(txid) {
      if (!txid) return cb('Error sending');
    }
  };

  return new Proposals();
});
