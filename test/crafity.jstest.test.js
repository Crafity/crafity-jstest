var jstest = require('../lib/crafity.jstest');
var mainContext = jstest.createContext();
var assert = jstest.assert;

// Print out the name of the test module
console.log("Testing 'crafity.jstest.js'... ");

mainContext.run({
	"Run test with no arguments must return a result": function () {
		var test_jstest = jstest.createContext();
		var result = test_jstest.run;
		assert.isDefined(result, 'Expected a result');
	},
  "Run test a simple async test": function (context) {
    context.async(3000);
    
    setTimeout(context.complete, 100);
    
    context.on("complete", function (err, result) {
      assert.hasNoValue(err, "Didn't expect an error");
      assert.areEqual([], result, "Expected another result");
    });
 	}
});
