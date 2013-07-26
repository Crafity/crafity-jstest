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
 * A Test Context Type for isolating and managing async tests
 * @constructor
 */

module.exports = function TestReport() {
  var data = {
    total: 0,
    type: "context",
    fail: 0,
    inconclusive: 0,
    success: 0,
    duration: 0,
    tests: {}
  };

  this.data = data;

  this.toString = function () {
    return JSON.stringify(data, null, '\t');
  };
  this.start = function () {
    data.start = new Date();
    data.end = null;
    data.duration = "measuring";
  };
  this.stop = function () {
    data.end = new Date();
    data.duration = data.end - data.start;
  };
  this.addTest = function (name) {
    data.total += 1;
    data.inconclusive += 1;
    var testResultData = {
        name: name,
        type: "test",
        outcome: "inconclusive",
        isInconlusive: true,
        hasFailed: false,
        hasSucceeded: false
      }
      , testResult = {
        start: function () {
          testResultData.start = new Date();
          testResultData.end = null;
          testResultData.duration = "measuring";
        },
        stop: function () {
          testResultData.end = new Date();
          testResultData.duration = testResultData.end - testResultData.start;
        },

        failed: function (ex) {
          data.fail += 1;
          data.inconclusive -= 1;

          testResultData.isInconclusive = false;
          testResultData.hasFailed = true;
          testResultData.hasSucceeded = false;

          testResultData.outcome = "failed";
          testResultData.ex = ex;
          testResultData.message = ex.toString();
        },

        succeeded: function () {
          data.success += 1;
          data.inconclusive -= 1;

          testResultData.isInconclusive = false;
          testResultData.hasFailed = false;
          testResultData.hasSucceeded = true;

          testResultData.outcome = "success";
        }
      };
    data.tests[name] = testResultData;
    return testResult;
  };
};
