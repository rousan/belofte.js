

var Belofte = require("../dist/belofte");

var Promise = global.Promise;

var d = new Promise(function (r, rr) {
   r(Promise.resolve(3));
});

console.log(d);