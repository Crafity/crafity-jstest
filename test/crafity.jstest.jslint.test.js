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
 * Test dependencies.
 */

var jstest = require('../lib/crafity.jstest').createContext("Module JSLint Tests")
  , assert = jstest.assert
  ;

jstest.run({
  "Instantiate the JSLint wrapper": function () {
    var jslint = require('../lib/crafity.jstest.jslint');
    assert.isFunction(jslint.JSLinter, "Expected a JSLinter constructor");
  }
});

module.exports = jstest;
