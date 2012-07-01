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
	}
});
