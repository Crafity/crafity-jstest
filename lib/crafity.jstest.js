/*jslint bitwise: true, unparam: true, maxerr: 50, white: true */
/*globals exports:true, module, require, process, console */

var core = require('crafity.core');
var jstest = exports;

/**
 * Register module for client side usage
 */

require('crafity.client').register(module);

/**
 * A Test Context Type for isolating and managing async tests
 */
function TestReport() {
	"use strict";
	var data = this.data = {
		total: 0,
		fail: 0,
		inconclusive: 0,
		success: 0,
		tests: {}
	};
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
			outcome: "inconclusive"
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
				testResultData.outcome = "failed";
				testResultData.ex = ex;
				testResultData.message = ex.toString();
			},
			succeeded: function () {
				data.success += 1;
				data.inconclusive -= 1;
				testResultData.outcome = "success";
			}
		};
		data.tests[name] = testResultData;
		return testResult;
	};
}

jstest.formatters = {

	console: function (ex, result) {
		"use strict";
		if (ex && !result) {
			console.log(ex.toString());
			process.exit(3);
			return;
		}

		if (result && result.total) {
			console.log(
				"Found " + result.total + " test(s) in total and " + result.fail +
					" test(s) failed, " + result.inconclusive +
					" test(s) are inconclusive. Duration: " + result.duration + "ms");

			if (result.fail > 0) {
				process.exit(2);
			}
		}
		if (result && result.outcome) {
			console.log(result.outcome.toUpperCase() + ": " + core.strings.lpad(result.duration.toString(), ' ', 5) + "ms " + ": '" + result.name + "'");
			if (result.ex) {
				console.log('-', result.message || result, result.ex ? result.ex.stack || "" : "");
			}
		}
	},

	standard: undefined
};
jstest.formatters.standard = jstest.formatters.console;

jstest.createContext = function () {
	"use strict";
	var publicContext = {
		onStart: new core.Event(),
		onTestStarted: new core.Event(),
		onTestFinished: new core.Event(),
		onComplete: new core.Event(),

		run: function run(tests, callback) {
			if (callback) {
				publicContext.onComplete.subscribe(callback);
			} else {
				publicContext.onComplete.subscribe(jstest.formatters.standard);
			}
			publicContext.onTestFinished.subscribe(jstest.formatters.standard);

			var workerPool = new core.Workerpool("jstest", true),
				report = new TestReport();

			if (!Object.keys(tests).length) {
				publicContext.onComplete.raise(null, report.data);
				if (callback) {
					publicContext.onComplete.unsubscribe(callback);
				} else {
					publicContext.onComplete.unsubscribe(jstest.formatters.standard);
				}
				publicContext.onTestFinished.unsubscribe(jstest.formatters.standard);
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
				workitem.report.start();
				publicContext.onTestStarted.raise(err, workitem);
			});
			workerPool.onWorkItemCompleted.subscribe(function (err, workitem) {
				workitem.report.stop();
				if (err) {
					workitem.report.failed(err);
				} else {
					workitem.report.succeeded();
				}
				publicContext.onTestFinished.raise(err, report.data.tests[workitem.report.name]);
			});

			workerPool.onWorkStarted.subscribe(function (ex, result) {
				report.start();
				publicContext.onStart.raise(ex, result);
			});
			workerPool.onWorkCompleted.subscribe(function (err) {
				report.stop();
				workerPool.stop();
				publicContext.onComplete.raise(err, report.data);
				if (callback) {
					publicContext.onComplete.unsubscribe(callback);
				} else {
					publicContext.onComplete.unsubscribe(jstest.formatters.standard);
				}
				publicContext.onTestFinished.unsubscribe(jstest.formatters.standard);
			});

			workerPool.work(10000);
		}
	};

	return publicContext;
};

var Assertion = jstest.Assertion = function Assertion(title, message) {
	"use strict";
	var self = this;
	this.title = title;
	this.message = message;
	this.toString = function () {
		return (self.message ? " Message: '" + self.message + "'\t" : "") + title;
	};
};

jstest.assert = (function assert() {
	"use strict";
	return {
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
		}
	};
}());

jstest.getScript = function (callback) {
	"use strict";
	core.modules.getScript(module, callback);
};
