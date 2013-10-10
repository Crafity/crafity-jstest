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
  , assert = require('./crafity.jstest.assert.js')
  , formatters = require('./crafity.jstest.formatters.js')
  , TestReport = require('./crafity.jstest.TestReport.js')
  , jslint = require('./crafity.jstest.jslint.js')
  , EventEmitter = require('events').EventEmitter;

/**
 * The test context
 * @param [name] String The name of the context
 * @constructor
 */
function Context(name) {
  var self = this;

  this.onStart = new core.Event();
  this.onTestStarted = new core.Event();
  this.onTestFinished = new core.Event();
  this.onComplete = new core.Event();

  this.run = function run(tests, callback) {
    var formatter = formatters.create();

    if (callback) {
      self.on("complete", callback);
    } else {
      self.on("complete", formatter.format);
    }
    self.on("testFinished", formatter.format);

    var workerPool = new core.Workerpool("jstest", true),
      report = new TestReport();

    if (name) {
      formatter.format(null, "\n\rExecuting '" + name + "' with " + Object.keys(tests).length + " test(s):\n\r");
    } else {
      formatter.format(null, "\n\rExecuting " + Object.keys(tests).length + " test(s):\n\r");
    }

    if (!Object.keys(tests).length) {
      formatter.format("     No tests defined...");
      self.emit("complete", null, report.data);
      if (callback) {
        self.removeListener("complete", callback);
      } else {
        self.removeListener("complete", formatter.format);
      }
      self.removeListener("testFinished", formatter.format);
      return;
    }

    core.objects.forEach(tests, function (test, name) {
      if (test instanceof Function) {
        test.report = report.addTest(name);
        test.report.name = name;
        workerPool.add(test);
      }
    });

    workerPool.onWorkItemStarted.subscribe(function (err, workitem) {
      workitem.report.context = name;
      workitem.report.start();
      self.emit("testStarted", err, workitem);
    });
    workerPool.onWorkItemCompleted.subscribe(function (err, workitem) {
      workitem.report.stop();
      if (err) {
        workitem.report.failed(err);
      } else {
        workitem.report.succeeded();
      }
      self.emit("testFinished", err, report.data.tests[workitem.report.name]);
    });

    workerPool.onWorkStarted.subscribe(function (ex, result) {
      report.start();
      self.emit("start", ex, result);
    });

    workerPool.onWorkCompleted.subscribe(function (err) {
      report.stop();
      workerPool.stop();
      self.emit("complete", err, report.data);
      if (callback) {
        self.removeListener("complete", callback);
      } else {
        self.removeListener("complete", formatter.format);
      }
      self.removeListener("testFinished", formatter.format);
      formatter.print();
    });

    workerPool.work(10000);
  };
}
Context.prototype = EventEmitter.prototype;

function createContext(name) {
  var jstest = new Context(name);
  jstest.formatters = formatters;
  jstest.assert = assert;
  jstest.jslint = jslint;
  jstest.getScript = function (callback) {
    core.modules.getScript(module, callback);
  };
  jstest.createContext = createContext;
  return  jstest;
}

var jstestModule = createContext();
jstestModule.version = "0.1.13";
jstestModule.fullname = "crafity-jstest";

module.exports = jstestModule;

