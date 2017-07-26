
(function (root, factory) {

    "use strict";

    if (typeof define === "function" && define.amd) {
        // For AMD module loader
        define(function(){
            return factory(root);
        });
    } else if (typeof module === "object" && typeof module.exports === "object") {
        // For the environment like CommonJS etc where module or
        // module.exports objects are available
        module.exports = factory(root);
    } else {
        // For VanillaJS environment
        root.Belofte = factory(root);
    }

})(typeof window !== "undefined" ? window : global, function (root) {

    "use strict";

    var defineProperty = Object.defineProperty;

    var defineProperties = Object.defineProperties;

    var slice = Array.prototype.slice;

    var forEach = Array.prototype.forEach;

    var isArray = Array.isArray;

    var floor = Math.floor;

    var abs = Math.abs;

    var max = Math.max;

    var min = Math.min;

    var emptyFn = function () {};

    var isCallable = function (value) {
        return typeof value === "function";
    };

    var isObject = function (value) {
        return value !== null && (typeof value === "object" || typeof value === "function");
    };

    var isNullOrUndefined = function(value) {
        return value === undefined || value === null;
    };

    var nextTick = (function () {
        if (isCallable(root.setImmediate)) {
            return function (fn) {
                root.setImmediate(fn);
            };
        } else if (typeof root.process === "object" && isCallable(root.process.nextTick)) {
            return function (fn) {
                root.process.nextTick(fn);
            };
        } else {
            return function (fn) {
                root.setTimeout(fn, 0);
            };
        }
    })();

    var runAsync = function (fn, thisArg) {
        if (!isCallable(fn))
            throw new TypeError(fn + " is not a function");
        var args = slice.call(arguments, 2),
            wrapper;
        wrapper = function () {
            fn.apply(thisArg, args);
        };
        nextTick(wrapper);
    };

    var defaultPromiseOnFulfilled = function (value) {
        return Promise.resolve(value);
    };

    var defaultPromiseOnRejected = function (reason) {
        return Promise.reject(reason);
    };

    var promiseResolve = function (value) {
        // Just return if the promise is settled already
        if (isSettledPromise(this))
            return;
        defineProperties(this, {
            _state: {
                value: "fulfilled"
            },
            _value: {
                value: value
            }
        });
        if (this._onFulfilled.length > 0) {
            runAsync(function (value) {
                this._onFulfilled.forEach(function (callback) {
                    callback(value);
                });
                // Free the references of the callbacks, because
                // these are not needed anymore after calling first time _resolve() method
                this._onFulfilled.length = 0;
                this._onRejected.length = 0;
            }, this, value);
        }
    };

    var promiseReject = function (reason) {
        // Just return if the promise is settled already
        if (isSettledPromise(this))
            return;
        defineProperties(this, {
            _state: {
                value: "rejected"
            },
            _reason: {
                value: reason
            }
        });
        if (this._onRejected.length > 0) {
            runAsync(function (reason) {
                this._onRejected.forEach(function (callback) {
                    callback(reason);
                });
                // Free the references of the callbacks, because
                // these are not needed anymore after calling first time _reject() method
                this._onFulfilled.length = 0;
                this._onRejected.length = 0;
            }, this, reason);
        }
    };

    var setupPromiseInternals = function (promise) {
        defineProperties(promise, {
            _isPromise: {
                value: true
            },
            _onFulfilled: {
                value: []
            },
            _onRejected: {
                value: []
            },
            _resolve: {
                value: promiseResolve.bind(promise),
                configurable: true
            },
            _reject: {
                value: promiseReject.bind(promise),
                configurable: true
            },
            _state: {
                value: "pending",
                configurable: true
            },
            _value: {
                value: undefined,
                configurable: true
            },
            _reason: {
                value: undefined,
                configurable: true
            }
        });
    };

    var isPendingPromise = function (promise) {
        return promise._state === "pending";
    };

    var isFulfilledPromise = function (promise) {
        return promise._state === "fulfilled";
    };

    var isRejectedPromise = function (promise) {
        return promise._state === "rejected";
    };

    var isSettledPromise = function (promise) {
        return promise._state === "fulfilled" || promise._state === "rejected";
    };

    var isValidPromiseState = function (state) {
        return ["pending", "fulfilled", "rejected"].indexOf(String(state)) !== -1;
    };

    var checkPromiseInternals = function (promise) {
        return promise._isPromise === true
            && isArray(promise._onFulfilled)
            && isArray(promise._onRejected)
            && isCallable(promise._resolve)
            && isCallable(promise._reject)
            && isValidPromiseState(promise._state)
            && promise.hasOwnProperty("_value")
            && promise.hasOwnProperty("_reason")
    };

    var isPromise = function (promise) {
        return promise instanceof Promise && checkPromiseInternals(promise);
    };

    var promiseResolutionProcedure = function (promise, result, async) {
        var temp1,
            then,
            resolvePromise,
            rejectPromise,
            temp2,
            temp3,
            flag = false;
        if(promise === result) {
            promise._reject(new TypeError("Chaining cycle detected for promise"));
        } else if (isPromise(result)) {
            if (isFulfilledPromise(result)) {
                promise._resolve(result._value);
            } else if (isRejectedPromise(result)) {
                promise._reject(result._reason);
            } else if (isPendingPromise(result)) {
                temp1 = result._resolve;
                temp2 = result._reject;
                defineProperties(result, {
                    _resolve: {
                        value: (function (value) {
                            temp1.call(this, value);
                            promise._resolve(value);
                        }).bind(result)
                    },
                    _reject: {
                        value: (function (reason) {
                            temp2.call(this, reason);
                            promise._reject(reason);
                        }).bind(result)
                    }
                });
            }

        } else if (isObject(result)) {
            try {
                then = result.then;
                if (isCallable(then)) {
                    resolvePromise = function (value) {
                        if (flag)
                            return;
                        // Detect true cycle of thenables
                        if (result === value) {
                            promise._reject(new TypeError("Chaining cycle detected for thenables"));
                            return;
                        }
                        flag = true;
                        promiseResolutionProcedure(promise, value);
                    };
                    rejectPromise = function (reason) {
                        if (flag)
                            return;
                        flag = true;
                        promise._reject(reason);
                    };
                    temp3 = function () {
                        try {
                            then.call(result, resolvePromise, rejectPromise);
                        } catch (e) {
                            if (!flag) {
                                flag = true;
                                promise._reject(e);
                            }
                        }
                    };
                    if (async) {
                        runAsync(temp3);
                    } else {
                        temp3();
                    }
                } else {
                    promise._resolve(result);
                }
            } catch (e) {
                promise._reject(e);
            }
        } else {
            promise._resolve(result);
        }
    };

    var Belofte = {};

    /**
     * This method copies all own properties(enumerable and non-enumerable)
     * carefully with descriptors from source objects to target and merges them.
     * It does not make deep copy of properties.
     *
     * @param target object which will be extended by sources
     * @return target object
     */
    Belofte.extend = function(target) {
        if (isNullOrUndefined(target))
            throw new TypeError("Target object can't be null or undefined");
        target = Object(target);
        var i,
            source,
            descriptors;

        for (i = 1; i < arguments.length; ++i) {
            source = arguments[i];
            if (isNullOrUndefined(source))
                continue;
            source = Object(source);
            descriptors = Object.getOwnPropertyNames(source).reduce(function(descriptors, nextKey) {
                descriptors[nextKey] = Object.getOwnPropertyDescriptor(source, nextKey);
                return descriptors;
            }, {});
            defineProperties(target, descriptors);
        }

        return target;
    };

    /**
     * This class is the implementation of Promises/A+ specification and EcmaScript Promise API.
     *
     * @param executor
     * @constructor
     */
    var Promise = function Promise(executor) {
        if (!(this instanceof Promise) || isPromise(this))
            throw new TypeError(String(this) + " is not a promise");
        if (!isCallable(executor))
            throw new TypeError("Promise resolver " + String(executor) + " is not a function");
        setupPromiseInternals(this);
        promiseResolutionProcedure(this, {then: executor});
    };

    Belofte.extend(Promise, {

        resolve: function (value) {
            if (isPromise(value))
                return value;
            var promise = new Promise(emptyFn);
            promiseResolutionProcedure(promise, value, true);
            return promise;
        },

        reject: function (reason) {
            return new Promise(function (resolve, reject) {
                reject(reason);
            });
        },

        /**
         *
         * @param promiseArray array or array-like object
         * @returns {Promise}
         */
        race: function (promiseArray) {
            if (promiseArray === undefined || promiseArray === null)
                return new Promise(function (resolve, reject) {
                    runAsync(reject, undefined, TypeError("First argument of Promise.race can not be undefined or null"));
                });
            var length,
                isSettled = false;

            length = Number(promiseArray.length);
            length = length !== length ? 0 : length;
            length = (length < 0 ? -1 : 1) * floor(abs(length));
            length = max(length, 0);

            return new Promise(function (resolve, reject) {
                var fn,
                    i = 0;
                fn = function (promise) {
                    var temp1,
                        temp2;
                    if (isPromise(promise)) {
                        if (isFulfilledPromise(promise)) {
                            if (!isSettled) {
                                isSettled = true;
                                runAsync(function () {
                                    resolve(promise._value);
                                });
                            }
                        }
                        else if (isRejectedPromise(promise)) {
                            if (!isSettled) {
                                isSettled = true;
                                runAsync(function () {
                                    reject(promise._reason);
                                });
                            }
                        } else if (isPendingPromise(promise)) {
                            temp1 = promise._resolve;
                            temp2 = promise._reject;
                            defineProperties(promise, {
                                _resolve: {
                                    value: (function (value) {
                                        temp1(value);
                                        if (!isSettled) {
                                            isSettled = true;
                                            resolve(value);
                                        }
                                    }).bind(promise)
                                },
                                _reject: {
                                    value: (function (reason) {
                                        temp2(reason);
                                        if (!isSettled) {
                                            isSettled = true;
                                            reject(reason);
                                        }
                                    }).bind(promise)
                                }
                            });
                        }
                    } else if (isThenable(promise)) {
                        runAsync(function () {
                            try {
                                promise.then(function (value) {
                                    if (!isSettled) {
                                        isSettled = true;
                                        resolve(value);
                                    }
                                }, function (reason) {
                                    if (!isSettled) {
                                        isSettled = true;
                                        reject(reason);
                                    }
                                });
                            } catch (e) {
                                reject(e);
                            }
                        });
                    } else {
                        if (!isSettled) {
                            isSettled = true;
                            runAsync(function () {
                                resolve(promise);
                            });
                        }
                    }
                };
                for(; i < length; ++i) {
                    fn(promiseArray[i]);
                }
            });
        },


        /**
         *
         * @param promiseArray array or array-like object
         * @returns {Promise}
         */
        all: function (promiseArray) {
            if (promiseArray === undefined || promiseArray === null)
                return new Promise(function (resolve, reject) {
                    runAsync(reject, undefined, TypeError("First argument of Promise.all can not be undefined or null"));
                });
            var counter = 0,
                length,
                values;

            length = Number(promiseArray.length);
            length = length !== length ? 0 : length;
            length = (length < 0 ? -1 : 1) * floor(abs(length));
            length = max(length, 0);

            values = new Array(length);

            return new Promise(function (resolve, reject) {
                var fn,
                    i = 0;
                if (length === 0)
                    resolve(values);
                else {
                    fn = function (promise, index) {
                        var temp1,
                            temp2;
                        if (isPromise(promise)) {
                            if (isFulfilledPromise(promise)) {
                                values[index] = promise._value;
                                counter++;
                                if (counter === length) {
                                    runAsync(function () {
                                        resolve(values);
                                    });
                                }
                            } else if(isRejectedPromise(promise)) {
                                runAsync(function () {
                                    reject(promise._reason);
                                });
                            } else if(isPendingPromise(promise)) {
                                temp1 = promise._resolve;
                                temp2 = promise._reject;
                                defineProperties(promise, {
                                    _resolve: {
                                        value: (function (value) {
                                            temp1(value);
                                            values[index] = value;
                                            counter++;
                                            if (counter === length) {
                                                resolve(values);
                                            }
                                        }).bind(promise)
                                    },
                                    _reject: {
                                        value: (function (reason) {
                                            temp2(reason);
                                            reject(reason);
                                        }).bind(promise)
                                    }
                                });
                            }
                        } else if (isThenable(promise)) {
                            runAsync(function () {
                                try {
                                    promise.then(function (value) {
                                        values[index] = value;
                                        counter++;
                                        if (counter === length) {
                                            resolve(values);
                                        }
                                    }, function (reason) {
                                        // If the returned promise is already rejected, then it does nothing
                                        reject(reason);
                                    });
                                } catch (e) {
                                    reject(e);
                                }
                            });
                        } else {
                            values[index] = promise;
                            counter++;
                            if (counter === length) {
                                runAsync(function () {
                                    resolve(values);
                                });
                            }
                        }
                    };
                    for(; i < length; ++i) {
                        fn(promiseArray[i], i);
                    }
                }
            });
        },

        defer: function () {
            return new Deferred();
        }
    });


    Belofte.extend(Promise.prototype, {

        then: function (onFulfilled, onRejected) {
            if (!isPromise(this))
                throw new TypeError(this + " is not a promise");
            onFulfilled = !isCallable(onFulfilled) ? defaultPromiseOnFulfilled : onFulfilled;
            onRejected = !isCallable(onRejected) ? defaultPromiseOnRejected : onRejected;

            var chainedPromise = new Promise(emptyFn),
                nextOnFulfilled,
                nextOnRejected;

            nextOnFulfilled = function (value) {
                var result;
                try {
                    result = onFulfilled(value);
                    promiseResolutionProcedure(chainedPromise, result);
                } catch (e) {
                    chainedPromise._reject(e);
                }
            };

            nextOnRejected = function (reason) {
                var result;
                try {
                    result = onRejected(reason);
                    promiseResolutionProcedure(chainedPromise, result);
                } catch (e) {
                    chainedPromise._reject(e);
                }
            };

            if (isPendingPromise(this)) {
                this._onFulfilled.push(nextOnFulfilled);
                this._onRejected.push(nextOnRejected);
            } else if (isFulfilledPromise(this)) {
                runAsync(nextOnFulfilled, undefined, this._value);
            } else if (isRejectedPromise(this))
                runAsync(nextOnRejected, undefined, this._reason);
            return chainedPromise;
        },

        catch: function (onRejected) {
            if (!isCallable(this["then"]))
                throw new TypeError("(var).then is not a function");
            return this["then"](undefined, onRejected);
        },

        toString: function () {
            if (!isPromise(this))
                throw new TypeError(this + " is not a promise");
            switch (this._state) {
                case "pending":
                    return "Promise { <pending> }";
                case "fulfilled":
                    return "Promise { " + this._value + " }";
                case "rejected":
                    return "Promise { <rejected> " + this._reason + " }";
            }
        }

    });


    var Deferred = function Deferred() {
        this.promise = new Promise(emptyFn);
    };

    Belofte.extend(Deferred.prototype, {

        resolve: function (value) {
            promiseResolutionProcedure(this.promise, value, true);
        },

        reject: function (reason) {
            this.promise._reject(reason);
        }

    });

    Belofte.extend(Belofte, {

        Promise: Promise,

        isPromise: isPromise,

        isPending: isPendingPromise,

        isFulfilled: isFulfilledPromise,

        isRejected: isRejectedPromise,

        isSettled: isSettledPromise,

        getState: function (promise) {
            if (!isPromise(promise))
                return null;
            return promise._state;
        },

        resolve: function () {
            return Promise.resolve(value);
        },

        reject: function () {
            return Promise.reject(reason);
        },

        Deferred: Deferred,

        defer: function () {
            return new Deferred();
        },

        resolved: function (value) {
            return Promise.resolve(value);
        },

        rejected: function (reason) {
            return Promise.reject(reason);
        },

        deferred: function () {
            return new Deferred();
        },

        nextTick: function (fn) {
            nextTick(fn);
        }

    });

    return Belofte;
});













