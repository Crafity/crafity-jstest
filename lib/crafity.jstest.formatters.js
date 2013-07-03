/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */
"use strict";

var ConsoleFormatter = require('./crafity.jstest.formatters.console.js');

module.exports = {
	console: new ConsoleFormatter().format,
	standard: new ConsoleFormatter().format,
  create: function () {
   return new ConsoleFormatter(false) 
  }
};
