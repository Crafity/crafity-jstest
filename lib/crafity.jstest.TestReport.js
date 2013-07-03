/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */

/**
 * A Test Context Type for isolating and managing async tests
 */
module.exports = function TestReport() {
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
