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