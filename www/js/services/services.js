'use strict'
// TODO: Use a clousure to avoid cluttering the global namespace
var copay = require('copay');

angular.module('copay.services', [])

// This is a hack for having cleaner configuration
.factory('Config', function() {
  var config = {};

  config.network = {
    testnet: {
      url: 'https://test-insight.bitpay.com:443',
      transports: ['polling']
    },
    livenet: {
      url: 'https://insight.bitpay.com:443',
      transports: ['polling']
    }
  };

  config.pluginManager = new copay.PluginManager({
    plugins: { LocalStorage: true }
  });

  var walletConfig = {
    idleDurationMin: 4,
    reconnectDelay: 5000,
    totalCopayers: 3,
    requiredCopayers: 2,
    spendUnconfirmed: true,
    settings: {
      alternativeIsoCode: "USD",
      alternativeName: "US Dollar",
      unitDecimals: 2,
      unitName: "bits",
      unitToSatoshi: 100,
    }
  }

  config.identity = {
    pluginManager: config.pluginManager,
    network: config.network,
    networkName: "livenet",
    walletDefaults: walletConfig,
    passphraseConfig: {
      iterations: 100,
      storageSalt: "mjuBtGybi/4="
    }
  }

  return config;
})

.factory('Bitcore', function() {
  var bitcore = require('bitcore');
  return bitcore;
})

.factory('Session', function($window) {

  var Session = function() {
    this.identity = null;
    this.profile = null;
    this.pin = null;
  };

  Session.prototype.signin = function(identity) {
    this.identity = identity;
    this.profile = identity.profile;
  };

  Session.prototype.signout = function(identity) {
    this.identity = null;
  };

  Session.prototype.isLogged = function() {
    return !!this.identity;
  };

  // ======= Temporal Hack ========
  // TODO: Encript credentials with PIN
  Session.prototype.hasCredentials = function() {
    return !!$window.localStorage.getItem('session:data');
  };

  Session.prototype.setCredentials = function(pin, credentials) {
    var data = JSON.stringify({
      pin: pin,
      credentials: credentials
    });

    $window.localStorage.setItem('session:data', data);
  };

  Session.prototype.getCredentials = function(pin) {
    var data = $window.localStorage.getItem('session:data');
    if (!data) return null;

    data = JSON.parse(data);
    return angular.equals(data.pin, pin) ? data.credentials : null;
  };

  return new Session();
})

// This factory it's extends copay.Identity for ease of use.
// TODO: Copay initialization it's broken... stop using all that config.
.factory('Identity', function(Config) {
  var Identity = angular.extend({}, copay.Identity);

  Identity.createProfile = function(p, callback) {
    var opts = angular.copy(Config.identity);
    var call = this.create.bind(this, p.email, p.password, opts, callback);
    setTimeout(call, 100);
  }

  Identity.openProfile = function(p, callback) {
    var opts = angular.copy(Config.identity);
    var call = Identity.open.bind(Identity, p.email, p.password, opts, callback);
    setTimeout(call, 100);
  }

  return Identity;
})

// This factory should be replaced by Session.identity
.factory('Wallets', function(Session, Identity) {
  var Wallets = function() {};

  Wallets.create = function(data, cb) {
    var opts = {
      name: data.name,
      totalCopayers: data.copayers,
      requiredCopayers: data.threshold,
      networkName: data.testnet ? "testnet" : "livenet"
    }

    Session.identity.createWallet(opts, cb); // TODO: Use directlly
  };

  Wallets.join = function(secret, cb) {
    var opts = {
      secret: secret,
      nickname: Session.profile.email // TODO: This shouldn't be necesary
    }

    Session.identity.joinWallet(opts, cb); // TODO: Use directlly
  };

  Wallets.all = function() {
    var wallets = Object.keys(Session.profile.walletInfos);
    return wallets.map(this.get.bind(this));
  }

  Wallets.get = function(id) {
    var wallet = Session.identity.getOpenWallet(id);
    window.W = wallet;
    window.I = Session.identity;
    return wallet;
  }

  return Wallets;
})

.factory('Invoices', function(Session) {

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
})

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
