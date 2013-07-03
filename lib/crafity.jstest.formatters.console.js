/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */
var core = require('crafity-core');

module.exports = function ConsoleFormatter(collect) {
  "use strict";
  var self = this;

  this.collect = collect !== undefined ? collect : false;
  this.messages = [];

  this.format = function (ex, result) {
    var message;
    if (ex && !result) {
      message = ex.toString();
      if (self.collect) {
        self.messages.push(message);
      } else {
        console.log(message);
      }
      !self.collect && process.exit(3);
      return;
    }

    if (result && result.total) {
      message = "Found " + result.total + " test(s) in total and " + result.fail +
        " test(s) failed, " + result.inconclusive +
        " test(s) are inconclusive. Duration: " + result.duration + "ms";
      
      if (self.collect) {
        self.messages.push(message);
      } else {
        console.log(message);
      }
      
      if (result.fail > 0) {
        !self.collect && process.exit(2);
      }
    } else if (result && result.outcome) {
      message = result.outcome.toUpperCase() + ": " + core.strings.lpad(result.duration.toString(), ' ', 5) + "ms " + ": '" + result.name + "'";
      
      if (self.collect) {
        self.messages.push(message);
      } else {
        console.log(message);
      }

      if (result.ex) {
        message = '- ' + (result.message || result) + " " + (result.ex ? result.ex.stack || "" : "");
        if (self.collect) {
          self.messages.push(message);
        } else {
          console.log(message);
        }
      }
    } else {
    if (self.collect) {
      self.messages.push(result.toString());
    } else {
      console.log(result.toString());
    }
    }
  };
  
  
  this.print = function () {
    //console.log("=============================================");
    //self.messages.push("=============================================")
    self.messages.forEach(function (message) {
      console.log(message);
    });
    //self.messages.push("=============================================")
    //console.log("=============================================");
    //console.log();
  }
};
