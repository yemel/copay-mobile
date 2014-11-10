'use strict'

angular.module('copay.services')

.factory('PayPro', function(Bitcore) {

  var PayPro = function() {};

  // NOTES for PayPro@Bitcore:
  // - makePaymentDetails should be a Static Function
  // - getPaymentRequest request should be done by Bitcore

  // # This should be a one liner
  // data = Bitcore.PayPro.PaymentRequest.decode(data);
  // var pr = new Bitcore.PayPro();
  // pr = pr.makePaymentRequest(data);

  // # Comments on payment request info
  // network ["main", "test"] should be bitcore.netoworks['livenet'].name
  // total is not what it's supposed to be
  // expires and time should be in miliseconds
  // consider renaming time to created
  // payment details should have a funtion isExpired 

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
      return self.parsePaymentRequest(options, data, cb);
    }).error(function(data, status, headers, config) {
      console.log('Server did not return PaymentRequest.');
      console.log('XHR status: ' + status);
      if (options.fetch) {
        return cb(new Error('Status: ' + status));
      } else {
        // Should never happen:
        return cb(null, null);
      }
    });
  };

  PayPro.prototype.parsePaymentRequest = function(options, data, cb) {
    data = Bitcore.PayPro.PaymentRequest.decode(data);
    var pr = new Bitcore.PayPro();
    pr = pr.makePaymentRequest(data);

    var self = this;

    // Verify Signature
    var trust = pr.verify(true);

    if (!trust.verified) {
      return cb(new Error('Server sent a bad signature.'));
    }

    var details = pr.get('serialized_payment_details');

    details = Bitcore.PayPro.PaymentDetails.decode(details);
    var pd = new Bitcore.PayPro();
    pd = pd.makePaymentDetails(details);

    var network = pd.get('network') == "main" ? "livenet" : "testnet";
    var outputs = pd.get('outputs');
    var time = pd.get('time');
    var expires = pd.get('expires');
    var memo = pd.get('memo');
    var payment_url = pd.get('payment_url');
    var merchant_data = pd.get('merchant_data');
    var domain = /^(?:https?)?:\/\/([^\/:]+).*$/.exec(payment_url)[1];

    var outputs = outputs.map(function(output) {
        return {
          amount: output.get('amount'),
          script: {
            offset: output.get('script').offset,
            limit: output.get('script').limit,
            buffer: new Bitcore.Buffer(new Uint8Array(output.get('script').buffer)).toString('hex')
          }
        };
      });
    var amount = outputs.reduce(function(a,b) { return a + b.amount.toInt() }, 0);


    var merchantData = {
      paymentRequest: {
        paymentDetails: {
          network: network,
          outputs: outputs,
          amount: amount,
          time: time ? new Date(time * 1000) : null,
          expires: expires ? new Date(expires * 1000) : null,
          memo: memo || 'This server would like some BTC from you.',
          total: Bitcore.Bignum('0', 10).toString(10),
          payment_url: payment_url,
          domain: domain,
          merchant_data: merchant_data ? merchant_data.toString('hex') : null
        },
        trusted: trust.caTrusted,
        selfSigned: !!trust.selfSigned
      },
      request_url: options.uri,
      // Expose so other copayers can verify signature
      // and identity, not to mention data.
      raw: pr.serialize().toString('hex')
    };

    return cb(null, merchantData);
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

  return new PayPro();
});

