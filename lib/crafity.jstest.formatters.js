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
var ConsoleFormatter = require('./crafity.jstest.formatters.console.js');

module.exports = {
  console: new ConsoleFormatter().format,
  standard: new ConsoleFormatter().format,
  create: function () {
    return new ConsoleFormatter(false);
  }
};
