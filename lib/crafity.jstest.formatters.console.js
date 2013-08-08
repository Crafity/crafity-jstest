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
	, ansi = require("ansi")
	, ansiCursor = ansi(process.stdout)
	;

/**
 *
 * @param collect
 * @constructor
 */
module.exports = function ConsoleFormatter(collect) {
	var self = this
		, crafityColors = {
			orange: "#e38418",
			red: "#C21705",
			brown: "#483432",
			lightGray: "#525252",
			gray: "#a1a1a1",
			blue: "#7cb6e9",
			white: "#D8D7D7"
		};

	this.collect = collect !== undefined ? collect : false;
	this.messages = [];

	function printSingleTest(report) {

		if (report.hasFailed === true) {
			ansiCursor
				.red()
				.write("✖")
				.reset();
		}

		if (report.hasSucceeded === true) {
			ansiCursor
				.green()
				.write("✓")
				.reset();
		}

		if (report.isInconclusive === true) {
			ansiCursor
				.yellow()
				.write("?")
				.reset();
		}

		ansiCursor
			.hex(crafityColors.brown)
			.write(core.strings.lpad(report.duration.toString(), ' ', 5))
			.write("ms")
			.reset()
			.write(" " + report.name)
			.fg.reset();

		ansiCursor.reset().write('\n');

		if (report.hasFailed === true) {
			ansiCursor.reset().write('\n');

			var errorMessage = report.ex.stack || report.ex.toString()
				, errorMessages = []
				;

			errorMessage.split('\n').forEach(function (message) {
				if (message.length < 80) {
					return errorMessages.push(message);
				}
				while (message.length) {
					errorMessages.push(message.substr(0, 80));
					message = message.substr(80);
				}
			});

			ansiCursor
				.red()
				.write("    " + errorMessages.join('\n    '))
				.reset();
			return ansiCursor.reset().write('\n\n');
		}

	}

	function printContextTotals(report) {
		ansiCursor
			.hex(crafityColors.brown)
			.write("\n\rFound " + report.total + " test(s) in total and " + report.fail +
				" test(s) failed, " + report.inconclusive +
				" test(s) are inconclusive." + " Duration: " + report.duration + "ms")
		;

		ansiCursor.reset().write('\n');

		if (report.fail || report.inconclusive) {
			return process.exit(3); // stop with an error
		}

		return;
	}

	function printReport(report) {
		if (!report) {
			throw new Error('Argument report is required');
		}

		if (typeof report === 'string') {

			return ansiCursor
				.hex(crafityColors.blue)
				.write(report)
				.reset().write('\n');
		}

		if (report.type === "context") { // Check if this is the context report (with totals)
			return printContextTotals(report);
		}

		return printSingleTest(report);
	}

	function printError(err) {
		ansiCursor
			.bold().red()
			.write(err.stack || err.toString())
			.reset()
			.write("\n");
	}

	this.format = function (err, report) {

		if (self.collect) {
			return self.messages.push({ err: err, report: report});
		}

		// instant printing
		if (err) {
			if (report) {
				return printReport(report);
			}
			return printError(err);
		}

		return printReport(report);

	};

	this.print = function () {
		if (!collect) {
			return;
		}

		// collected errors and reports
		self.messages.forEach(function (message) {

			if (message.err) {
				printError(message.err);
			}

			printReport(message.report);
		});
	};
};
