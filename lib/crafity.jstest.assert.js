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
	, httpAsserter = require('./crafity.jstest.assert.http.js')
	, assert, Assertion;

/**
 * An Assertion object
 * @param {String} title The title of the assertion
 * @param {String} message The message of the assertion
 * @constructor
 */
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
	isUndefined: function (value, message) {
		if (value !== undefined) {
			throw new Assertion("Value is defined.", message);
		}
	},
	isDefined: function (value, message) {
		if (value === undefined) {
			throw new Assertion("Value is undefined.", message);
		}
	},
	isNotNull: function (value, message) {
		if (value === null) {
			throw new Assertion("Value is null.", message);
		}
	},
	isNull: function (value, message) {
		if (value !== null) {
			throw new Assertion("Value is not null.", message);
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
  isSame: function (expected, value, message) {
 		if (value !== expected) {
 			throw new Assertion("Value is not the same. Expected: <" + JSON.stringify(expected) + "> Actual: <" + JSON.stringify(value) + ">", message);
 		}
 	},
  isNotSame: function (expected, value, message) {
 		if (value === expected) {
 			throw new Assertion("Value is the same. Expected another instance", message);
 		}
 	},
	areEqual: function (expected, value, message) {
		if (!core.objects.areEqual(value, expected)) {
			throw new Assertion("Values are not equal. Expected: <" + JSON.stringify(expected) + "> Actual: <" + JSON.stringify(value) + ">", message);
		}
	},
	areNotEqual: function (expected, value, message) {
		if (core.objects.areEqual(value, expected)) {
			throw new Assertion("Values are equal. Did not expect: <" + JSON.stringify(expected) + ">", message);
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
  expectError: function (code, message) {
    if (!code) { throw new Error("Argument 'code' is required"); }
    if (!message) { throw new Error("Argument 'message' is required"); }
    try {
      code();
    } catch (err) {
      assert.areEqual(message, err.message, "Expected another error message");
      return;
    }
    assert.fail("Error with message '" + message + "' was not thrown");
  },
	Assertion: Assertion
};

httpAsserter.extend(assert);

module.exports = assert;
