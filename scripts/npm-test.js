/*jslint node:true, white: true*/
require("../test/package.test.js").on("complete", function () {
  require("../test/crafity.jstest.test.js").on("complete", function () {
    require("../test/crafity.jstest.jslint.test.js");
  });  
});
