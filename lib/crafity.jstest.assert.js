/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */
"use strict";

var core = require('crafity-core')
  , httpAsserter = require('./crafity.jstest.assert.http.js')
  , assert, Assertion;

Assertion = function Assertion(title, message) {
  var self = this;
  this.trace = new Error().stack;
  this.title = title;
  this.message = message;
  this.toString = function () {
    return (self.message ? " Message: '" + self.message + "'\t" : "") + title + "\n" + self.trace;
  };
};

assert = {
  isDefined: function (value, message) {
    if (value === undefined) {
      throw new Assertion("Value is undefined.", message);
    }
  },
  hasValue: function (value, message) {
    if (value === undefined || value === null) {
      throw new Assertion("Value is null or undefined. <" + JSON.stringify(value) + ">", message);
    }
  },
  hasNoValue: function (value, message) {
    if (value !== undefined && value !== null) {
      throw new Assertion("Value is not null or undefined. <" + JSON.stringify(value) + ">", message);
    }
  },
  isFunction: function (value, message) {
    if (!(value instanceof Function)) {
      throw new Assertion("Value is not a function. <" + JSON.stringify(value) + ">", message);
    }
  },
  isTrue: function (value, message) {
    if (value !== true) {
      throw new Assertion("Value is not true. <" + JSON.stringify(value) + ">", message);
    }
  },
  isFalse: function (value, message) {
    if (value !== false) {
      throw new Assertion("Value is not false. <" + JSON.stringify(value) + ">", message);
    }
  },
  areEqual: function (expected, value, message) {
    if (!core.objects.areEqual(value, expected)) {
      throw new Assertion("Values are not equal. Expected: <" + JSON.stringify(expected) + "> Actual: <" + JSON.stringify(value) + ">", message);
    }
  },
  isInstanceOf: function (expected, value, message) {
    if (!(value instanceof expected)) {
      throw new Assertion("Not an instance of. <" + typeof expected + "> Actual: <" + typeof value + ">", message);
    }
  },
  fail: function (message) {
    throw new Assertion("Test failed.", message);
  },
  Assertion: Assertion
};

httpAsserter.extend(assert);

module.exports = assert;
