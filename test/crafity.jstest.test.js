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

var jstest = require('../lib/crafity.jstest').createContext("Module JSTest Tests")
  , assert = jstest.assert
  ;

jstest.run({
  "Run test with no arguments must return a result": function () {
    var test_jstest = jstest.createContext();
    var result = test_jstest.run;
    assert.isDefined(result, 'Expected a result');
  },
  "Run test a simple async test": function (context) {
    context.async(3000);

    setTimeout(context.complete, 100);

    context.on("complete", function (err, result) {
      assert.hasNoValue(err, "Didn't expect an error");
      assert.areEqual([], result, "Expected another result");
    });
  }
});

module.exports = jstest;
