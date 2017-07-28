<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.0 compliant" align="right" />
</a>

# Belofte.js

`Belofte.js` is a lightweight Promises/A+ compliant implementation of ECMAScript Promise API.
Here the `Belofte` is an Afrikaans word, It means `Promise`.

This library is very useful for old browsers or old Javascript engines where
native `Promise` API is not available.

## Install

If you use NPM, run the following command, Otherwise download the latest release from Github. 
It uses `UMD` module definition i.e. it supports AMD, CommonJS, and VanillaJS module loader 
environments. In VanillaJS, a `Belofte` global object is exported.

`npm install belofte.js`

For NodeJS environment:

```javascript
var Belofte = require("belofte.js");
```

For VanillaJS, just insert it into your HTML page:

```haml
<script src="belofte.min.js"></script>
```

## Build

`npm run build`
     
## Test

`npm test`

## Run Promises/A+ Test Suits

`npm run pt`

## Documentation

* [Getting Started](#getting-started)
* [Classes](#classes)
    * [`Belofte.Promise`](#beloftepromise)
    * [`Belofte.Deferred`](#beloftedeferred)
* [`Belofte` Global](#belofte-global)

### Getting Started

```javascript
var Belofte = require("belofte.js");

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
```

[Here](https://jsfiddle.net/ariyankhan/f9yfwohw/) is the fiddling.

### Classes

#### `Belofte.Promise`

A promise represents the eventual result of an asynchronous operation.
This class is the implementation of Promises/A+ specification and EcmaScript Promise API.

##### `resolve()`

Returns a Promise object that is resolved with the given value.
If the value is a promise then the value will be returned and
if the value is a thenable, the returned promise will follow that thenable,
adopting its eventual state; otherwise the returned promise will be 
fulfilled with the value.

The syntax is:

```javascript
var promise = Belofte.Promise.resolve(value);
```

Where,

* `value` : any Javascript value or a thenable or a promise object

It returns a resolved promise.

##### `reject()`

Returns a Promise object that is rejected with the given reason.

The syntax is:

```javascript
var promise = Belofte.Promise.reject(reason);
```

Where,

* `reason` : any Javascript value

It returns a rejected promise.

##### `race()`

Returns a promise that fulfills or rejects as soon as one of
the promises in the `promiseArray` argument fulfills or rejects, with the
value or reason from that promise.

The syntax is:

```javascript
var promise = Belofte.Promise.race(promiseArray);
```

Where,

* `promiseArray` : any array or array-like object of promises

It returns a pending promise.

##### `all()`

Returns a single Promise that resolves when all of the promises in the `promiseArray`
argument have resolved or when the `promiseArray` argument contains no promises.
It rejects with the reason of the first promise that rejects.

The syntax is:

```javascript
var promise = Belofte.Promise.all(promiseArray);
```

Where,

* `promiseArray` : any array or array-like object of promises

It returns a promise.

##### `defer()`

Returns a new object of `Belofte.Deferred` class.

##### `prototype.then()`

Appends fulfillment and rejection handlers to the promise, and returns a
new promise resolving to the return value of the called handler.

The syntax is:

```javascript
var newPromise = Belofte.Promise.prototype.then(onFulfilled, onRejected);
```

Where,

* `onFulfilled` : a function called if the Promise is fulfilled. This function has one 
argument, the fulfillment value.

* `onRejected` : a Function called if the Promise is rejected. This function has one 
argument, the rejection reason.

It returns a new promise.

##### `prototype.catch()`

Returns a Promise and deals with rejected cases only.
It behaves the same as calling `promise.then(undefined, onRejected)`.

The syntax is:

```javascript
var newPromise = Belofte.Promise.prototype.catch(onRejected);
```

Where,

* `onRejected` : a Function called if the Promise is rejected. This function has one 
argument, the rejection reason.

It returns a new promise.

##### `prototype.toString()`

Returns a string representation of the promise object.

#### `Belofte.Deferred`

This class creates a new promise object and provides `reslove()` and `reject()` method
to resolve and reject that promise directly.

##### `prototype.resolve()`

Resolves the promise with the specified value. 

The syntax is:

```javascript
Belofte.Deferred.prototype.resolve(value);
```

Where,

* `value` : any Javascript value or a thenable or a promise object

##### `prototype.reject()`

Rejects the promise with the specified reason. 

The syntax is:

```javascript
Belofte.Deferred.prototype.reject(reason);
```

Where,

* `reason` : any Javascript value

### `Belofte` Global

#### `isPromise()`

Checks whether or not the specified value is a promise.

#### `isPending()`

Checks whether or not the specified promise is in pending state.

#### `isFulfilled()`

Checks whether or not the specified promise is fulfilled.

#### `isRejected()`

Checks whether or not the specified promise is rejected.

#### `isSettled()`

Checks whether or not the specified promise is settled (i.e. fulfilled or rejected).

#### `getState()`

Returns the current state of the specified promise.

#### `getValue()`

Returns the current value of the specified fulfilled promise.

#### `getReason()`

Returns the current reason of the specified rejected promise.

#### `resolve()`

Equivalent to `Belofte.Promise.resolve(value)`

#### `reject()`

Equivalent to `Belofte.Promise.reject(reason)`

#### `defer()`

Returns a new object of `Belofte.Deferred` class.

#### `resolved()`

Equivalent to `Belofte.Promise.resolve(value)`.

#### `rejected()`

Equivalent to `Belofte.Promise.reject(value)`.

#### `deferred()`

Returns a new object of `Belofte.Deferred` class.

#### `runAsync()`

Runs the given task asynchronously i.e. push the specified task to `EventQueue`.

The syntax is:

```javascript
Belofte.runAsync(fn, thisArg /* rest arguments */);
```

Where,

* `fn` : any Javascript functions that will be called asynchronously,

* `thisArg` : the `this` value of the `fn` function,

* `arguments`: these are passed to `fn` function as arguments


## Contributors

   * [Rousan Ali](https://github.com/ariyankhan)
   
   Contributions are always welcome.
   
## License

MIT License

Copyright (c) 2017 Rousan Ali

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
