var promisesAPlusTests = require("promises-aplus-tests");
var belofteJS = require('../src/belofte');

describe("Promises/A+ Tests", function () {
  promisesAPlusTests.mocha(belofteJS);
});