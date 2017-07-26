

var Belofte = require("../dist/belofte");


var d = Belofte.deferred();


d.resolve({
    then: 6
});

console.log(Object.getOwnPropertyNames(Promise.prototype));