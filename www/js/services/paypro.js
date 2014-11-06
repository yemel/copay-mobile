'use strict'

angular.module('copay.services')

.factory('Bitcore', function(Wallets, Bitcore) {

  var PayPro = function() {};

  PayPro.prototype.getPaymentRequest = function(options, cb) {
    var self = this;
    this.request({
      method: 'GET',
      url: options.uri,
      headers: {
        'Accept': Bitcore.PayPro.PAYMENT_REQUEST_CONTENT_TYPE
      },
      responseType: 'arraybuffer'
    }).success(function(data, status, headers, config) {
          data = Bitcore.PayPro.PaymentRequest.decode(data);
          var pr = new PayPro();
          pr = pr.makePaymentRequest(data);
          return self.receivePaymentRequest(options, pr, cb);
    }).error(function(data, status, headers, config) {
      console.log('Server did not return PaymentRequest.');
      console.log('XHR status: ' + status);
      if (options.fetch) {
        return cb(new Error('Status: ' + status));
      } else {
        // Should never happen:
        return cb(null, null, null);
      }
    });
  };

  Wallet.prototype.receivePaymentRequest = function(options, pr, cb) {
    var self = this;

    var ver = pr.get('payment_details_version');
    var pki_type = pr.get('pki_type');
    var pki_data = pr.get('pki_data');
    var details = pr.get('serialized_payment_details');
    var sig = pr.get('signature');

    var certs = Bitcore.PayPro.X509Certificates.decode(pki_data);
    certs = certs.certificate;

    // Fix for older versions of bitcore
    if (!PayPro.RootCerts) {
      PayPro.RootCerts = {
        getTrusted: function() {}
      };
    }

    // Verify Signature
    var trust = pr.verify(true);

    if (!trust.verified) {
      return cb(new Error('Server sent a bad signature.'));
    }

    details = PayPro.PaymentDetails.decode(details);
    var pd = new PayPro();
    pd = pd.makePaymentDetails(details);

    var network = pd.get('network');
    var outputs = pd.get('outputs');
    var time = pd.get('time');
    var expires = pd.get('expires');
    var memo = pd.get('memo');
    var payment_url = pd.get('payment_url');
    var merchant_data = pd.get('merchant_data');

    var merchantData = {
      pr: {
        payment_details_version: ver,
        pki_type: pki_type,
        pki_data: certs,
        pd: {
          network: network,
          outputs: outputs.map(function(output) {
            return {
              amount: output.get('amount'),
              script: {
                offset: output.get('script').offset,
                limit: output.get('script').limit,
                // NOTE: For some reason output.script.buffer
                // is only an ArrayBuffer
                buffer: new Buffer(new Uint8Array(
                  output.get('script').buffer)).toString('hex')
              }
            };
          }),
          time: time,
          expires: expires,
          memo: memo || 'This server would like some BTC from you.',
          payment_url: payment_url,
          merchant_data: merchant_data ? merchant_data.toString('hex') : null
        },
        signature: sig.toString('hex'),
        ca: trust.caName,
        untrusted: !trust.caTrusted,
        selfSigned: trust.selfSigned
      },
      request_url: options.uri,
      total: bignum('0', 10).toString(10),
      // Expose so other copayers can verify signature
      // and identity, not to mention data.
      raw: pr.serialize().toString('hex')
    };

    return cb(null, merchantData);
  };



  PayPro.prototype.cratePaymentTx = function() {

  };

  PayPro.prototype.request = function(options, callback) {
    if (_.isString(options)) {
      options = {
        uri: options
      };
    }

    options.method = options.method || 'GET';
    options.headers = options.headers || {};

    var ret = {
      success: function(cb) {
        this._success = cb;
        return this;
      },
      error: function(cb) {
        this._error = cb;
        return this;
      },
      _success: function() {;
      },
      _error: function(_, err) {
        throw err;
      }
    };

    var method = (options.method || 'GET').toUpperCase();
    var uri = options.uri || options.url;
    var req = options;

    req.headers = req.headers || {};
    req.body = req.body || req.data || {};

    var xhr = new XMLHttpRequest();
    xhr.open(method, uri, true);

    Object.keys(req.headers).forEach(function(key) {
      var val = req.headers[key];
      if (key === 'Content-Length') return;
      if (key === 'Content-Transfer-Encoding') return;
      xhr.setRequestHeader(key, val);
    });

    if (req.responseType) {
      xhr.responseType = req.responseType;
    }

    xhr.onload = function(event) {
      var response = xhr.response;
      var buf = new Uint8Array(response);
      var headers = {};
      (xhr.getAllResponseHeaders() || '').replace(
        /(?:\r?\n|^)([^:\r\n]+): *([^\r\n]+)/g,
        function($0, $1, $2) {
          headers[$1.toLowerCase()] = $2;
        }
      );
      return ret._success(buf, xhr.status, headers, options);
    };

    xhr.onerror = function(event) {
      var status;
      if (xhr.status === 0 || !xhr.statusText) {
        status = 'HTTP Request Error: This endpoint likely does not support cross-origin requests.';
      } else {
        status = xhr.statusText;
      }
      return ret._error(null, status, null, options);
    };

    if (req.body) {
      xhr.send(req.body);
    } else {
      xhr.send(null);
    }

    return ret;
  };



  return PayPro;
});

/**
 * @desc Create a HTTP request
 * @TODO: This shouldn't be a wallet responsibility
 */
Wallet.request = function(options, callback) {
};

