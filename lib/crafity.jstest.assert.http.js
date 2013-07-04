/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */

var core = require('crafity-core')
  , http = require('http')
  , qs = require('querystring');

module.exports = new function HttpAsserter() {
  var self = this;

  this.Assert = function HttpAsserter(assert) {
    this.request = {
      "fails": function (options, callback) {
        var e = new Error();
        http.request(options,function (req) {
          req.on("data", function () {
            try {
              assert.fail("Port '" + options.port + "'is already open");
              callback && callback(req, res);
            } catch (err) {
              err.stack = e.stack;
              err.toString = function () { return err.title + "\n"; };
              throw err;
            }
          })
        }).on('error',function () {
            callback && callback();
          }).end();
      },
      "expect200": function (options, value, callback) {
        callback = callback || function (req, res, err) {
          if (err) { throw err; }
        };
        var e = new Error();
        var req = http.request(options, function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          });
          res.on("end", function () {
            try {
              assert.areEqual(200 + " " + value, res.statusCode + " " + result, "Status code and/or response didn't match");
              callback && callback(req, res);
            } catch (err) {
              err.stack = e.stack;
              err.toString = function () { return err.title + "\n"; };
              throw err;
            }
          });
        });
        req.on('error', function (err) {
          callback && callback(req, null, err);
        });
        options.data && options.method.toLowerCase() === "put" && req.write(qs.stringify(options.data));
        options.data && options.method.toLowerCase() === "post" && req.write(qs.stringify(options.data));
        options.data && options.method.toLowerCase() === "delete" && req.write(qs.stringify(options.data));
        req.end();
      },
      "expect401": function (options, value, callback) {
        var e = new Error();
        var req = http.request(options,function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          })
          res.on("end", function () {
            try {
              assert.areEqual(401 + " " + value, res.statusCode + " " + result, "Status code and/or response didn't match");
              callback && callback(req, res);
            } catch (err) {
              err.stack = e.stack;
              err.toString = function () { return err.title + "\n"; };
              throw err;
            }
          });
        }).on('error', function () {
            callback && callback();
          });
        options.data && options.method.toLowerCase() === "put" && req.write(qs.stringify(options.data));
        options.data && options.method.toLowerCase() === "post" && req.write(qs.stringify(options.data));
        options.data && options.method.toLowerCase() === "delete" && req.write(qs.stringify(options.data));
        req.end();
      },
      "expect403": function (options, value, callback) {
        var e = new Error();
        http.request(options,function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          })
          res.on("end", function () {
            try {
              assert.areEqual(403 + " " + value, res.statusCode + " " + result, "Status code and/or response didn't match");
              callback && callback(res);
            } catch (err) {
              err.stack = e.stack;
              err.toString = function () { return (err.title || err.message) + "\n"; };
              throw err;
            }
          });
        }).on('error',function () {
            callback && callback();
          }).end();
      },
      "succeeds": function (options, callback) {
        var e = new Error();
        http.request(options,function (res) {
          callback && callback(res);
        }).on('error',function () {
            try {
              assert.fail("Failed to connect to port '" + options.port + "'");
            } catch (err) {
              err.stack += e.stack;
              throw err;
            }
          }).end();
      }
    };

  };

  this.extend = function (assert) {
    core.objects.extend(assert, new self.Assert(assert));
  }
};
