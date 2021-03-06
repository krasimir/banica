(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.banica = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.call = call;
exports.run = run;
function validateGenerator(generator) {
  if (!generator || !generator.next) {
    if (typeof generator === 'function') {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      generator = generator.apply(undefined, args);
      if (!generator.next) {
        throw new Error('`run` method expects a generator!');
      }
    } else {
      throw new Error('`run` method expects a generator!');
    }
  }
  return generator;
}

function call(func) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return { type: 'call', func: func, args: args };
}

function run(generator) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  generator = validateGenerator.apply(undefined, [generator].concat(args));
  return new Promise(function (generatorCompleted, reject) {
    var iterate = function iterate(_ref) {
      var value = _ref.value,
          done = _ref.done;

      if (done) {
        return generatorCompleted(value);
      }
      if (value.type === 'call') {
        try {
          var result = value.func.apply(value, value.args);

          if (result && typeof result.then !== 'undefined') {
            result.then(function (resolvedValue) {
              return iterate(generator.next(resolvedValue));
            }, function (error) {
              return iterate(generator.throw(error));
            });
          } else if (result && typeof result.next !== 'undefined') {
            run(result).then(function (resultOfGenerator) {
              iterate(generator.next(resultOfGenerator));
            });
          } else {
            return iterate(generator.next(result));
          }
        } catch (error) {
          iterate(generator.throw(error));
        }
      } else {
        reject(new Error('You should yield a command. Use the `call` helper.'));
      }
    };
    iterate(generator.next());
  });
}
},{}]},{},[1])(1)
});