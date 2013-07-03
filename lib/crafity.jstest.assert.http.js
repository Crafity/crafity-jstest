/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */

var core = require('crafity-core')
  , http = require('http')
  , qs = require('querystring');

module.exports = new function HttpAsserter() {
  var self = this;

  this.Assert = function HttpAsserter(assert) {
    this.request = {
      "fails": function (options, callback) {
        http.request(options,function (req) {
          req.on("data", function () {
            assert.fail("Port '" + options.port + "'is already open");
          })
        }).on('error',function () {
            callback && callback();
          }).end();
      },
      "expect200": function (options, value, callback) {
        var req = http.request(options, function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          });
          res.on("end", function () {
            assert.areEqual(200, res.statusCode, "Status code didn't match");
            assert.areEqual(value, result, "Response didn't match");
            callback && callback(req, res);
          });
        });
        req.on('error', function (err) {
          callback && callback(req, null, err);
        });
        options.data && options.method.toLowerCase() === "put" && req.write(qs.stringify(options.data));
        options.data && options.method.toLowerCase() === "post" && req.write(qs.stringify(options.data));
        req.end();
      },
      "expect401": function (options, value, callback) {
        var req = http.request(options,function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          })
          res.on("end", function () {
            assert.areEqual(401, res.statusCode, "Status code didn't match");
            assert.areEqual(value, result, "Response didn't match");
            callback && callback();
          });
        }).on('error', function () {
            callback && callback();
          });
        options.data && options.method.toLowerCase() === "put" && req.write(qs.stringify(options.data));
        options.data && options.method.toLowerCase() === "post" && req.write(qs.stringify(options.data));
        req.end();
      },
      "expect403": function (options, value, callback) {
        http.request(options,function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          })
          res.on("end", function () {
            assert.areEqual(403, res.statusCode, "Status code didn't match");
            assert.areEqual(value, result, "Response didn't match");
            callback && callback();
          });
        }).on('error',function () {
            callback && callback();
          }).end();
      },
      "succeeds": function (options, callback) {
        http.request(options,function (res) {
          callback && callback(res);
        }).on('error',function () {
            assert.fail("Failed to connect to port '" + options.port + "'");
          }).end();
      }
    };

  };

  this.extend = function (assert) {
    core.objects.extend(assert, new self.Assert(assert));
  }
};
