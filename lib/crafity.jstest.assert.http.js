/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */
"use strict";

/*!
 * crafity-jstest - Test Framework for JavaScript
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var core = require('crafity-core')
  , http = require('http')
  , qs = require('querystring')
  , version = process.versions.node.split('.')
  , oldVersion = version[0] === "0" && version[1] < 7
  , closeEventName = oldVersion ? "exit" : "close";

/**
 * Helper to extend the assert object with HTTP specific asserts
 * @constructor
 */
function HttpAsserter() {
  var self = this;

  this.Assert = function HttpAsserter(assert) {
    this.request = {
      "fails": function (options, callback) {
        var e = new Error();
        var req = http.request(options,function (res) {
          req.on("data", function () {
            try {
              assert.fail("Port '" + options.port + "'is already open");
              if (callback) { callback(req, res); }
            } catch (err) {
              err.toString = function () {
                return (err.title || err.message) + "\n" + e.stack;
              };
              throw err;
            }
          });
        }).on('error',function () {
            if (callback) { callback(); }
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
              if (callback) { callback(req, res); }
            } catch (err) {
              err.toString = function () {
                return (err.title || err.message) + "\n" + e.stack;
              };
              throw err;
            }
          });
        });
        req.on('error', function (err) {
          if (callback) { callback(req, null, err); }
        });
        var contentType = options.headers["Content-Type"] || "plain/text";
        if (!/json/i.test(contentType) && options.data) { req.write(qs.stringify(options.data)); }
        if (/json/i.test(contentType) && options.data) { req.write(JSON.stringify(options.data)); }
        req.end();
      },
      "expect401": function (options, value, callback) {
        var e = new Error();
        var req = http.request(options,function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          });
          res.on("end", function () {
            try {
              assert.areEqual(401 + " " + value, res.statusCode + " " + result, "Status code and/or response didn't match");
              if (callback) { callback(req, res); }
            } catch (err) {
              err.toString = function () {
                return (err.title || err.message) + "\n" + e.stack;
              };
              throw err;
            }
          });
        }).on('error', function () {
            if (callback) { callback(); }
          });
        var contentType = options.headers["Content-Type"] || "plain/text";
        if (!/json/i.test(contentType) && options.data) { req.write(qs.stringify(options.data)); }
        if (/json/i.test(contentType) && options.data) { req.write(JSON.stringify(options.data)); }
        req.end();
      },
      "expect403": function (options, value, callback) {
        var e = new Error();
        http.request(options,function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          });
          res.on("end", function () {
            try {
              assert.areEqual(403 + " " + value, res.statusCode + " " + result, "Status code and/or response didn't match");
              if (callback) { callback(res); }
            } catch (err) {
              err.toString = function () {
                return (err.title || err.message) + "\n" + e.stack;
              };
              throw err;
            }
          });
        }).on('error',function () {
            if (callback) { callback(); }
          }).end();
      },
      "expect404": function (options, value, callback) {
        var e = new Error();
        http.request(options,function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          });
          res.on("end", function () {
            try {
              assert.areEqual(404 + " " + value, res.statusCode + " " + result, "Status code and/or response didn't match");
              if (callback) { callback(res); }
            } catch (err) {
              err.toString = function () {
                return (err.title || err.message) + "\n" + e.stack;
              };
              throw err;
            }
          });
        }).on('error',function () {
            if (callback) { callback(); }
          }).end();
      },
      "expect500": function (options, value, callback) {
        var e = new Error();
        http.request(options,function onRequest(res) {
          var result = "";
          res.on("data", function (data) {
            result += data.toString();
          });
          res.on("end", function () {
            try {
              assert.areEqual(500 + " " + value, res.statusCode + " " + result, "Status code and/or response didn't match");
              if (callback) { callback(res); }
            } catch (err) {
              err.toString = function () {
                return (err.title || err.message) + "\n" + e.stack;
              };
              throw err;
            }
          });
        }).on('error',function () {
            if (callback) { callback(); }
          }).end();
      },
      "succeeds": function (options, callback) {
        var e = new Error();
        http.request(options,function (res) {
          if (callback) { callback(res); }
        }).on('error',function () {
            try {
              assert.fail("Failed to connect to port '" + options.port + "'");
            } catch (err) {
              err.toString = function () {
                return (err.title || err.message) + "\n" + e.stack;
              };
              throw err;
            }
          }).end();
      }
    };

  };

  this.extend = function (assert) {
    core.objects.extend(assert, new self.Assert(assert));
  };
}

module.exports = new HttpAsserter();
