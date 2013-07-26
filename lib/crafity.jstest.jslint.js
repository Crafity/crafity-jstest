/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */
"use strict";

/*!
 * crafity-jstest - Node wrapper around JSLint 
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var jslint = require('./jslint/~jslint.module')
  , childProcess = require('child_process');

function JSLinter(jslint) {
  this.jslint = jslint;
  this.JSLinter = JSLinter;
  this.scanDir = function scanDir(directory) {
    var jsl = childProcess.spawn(__dirname + "/../scripts/npm-jslint.sh", [], { cwd: directory });
    jsl.stdout.on('data', function (data) {
      process.stdout.write(data);
    });

    jsl.stderr.on('data', function (data) {
      process.stderr.write(data);
    });

    jsl.on('close', function (code) {
      process.exit(code);
    });
  };
}

module.exports = new JSLinter(jslint); 
