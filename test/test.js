

var Belofte = require("../dist/belofte");

var promise = new Belofte.Promise(function (resolve, reject) {
   Belofte.runAsync(resolve, undefined, 121);
});

promise.then(function (value) {
   console.log(value);
   return Belofte.resolve(1000);
}).then(function (value) {
    console.log(value);
   var deferred = Belofte.defer();
   Belofte.runAsync(function () {
      deferred.resolve(122);
   });
   return deferred.promise;
}).catch(function (err) {
    console.log(err);
});
