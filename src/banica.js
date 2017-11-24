function validateGenerator(generator, ...args) {
  if (!generator || !generator.next) {
    if (typeof generator === 'function') {
      generator = generator(...args);
      if (!generator.next) {
        throw new Error('`run` method expects a generator!');    
      }
    } else {
      throw new Error('`run` method expects a generator!');
    }
  }
  return generator;
}

export function call(func, ...args) {
  return { type: 'call', func, args };
}

export function run(generator, ...args) {
  generator = validateGenerator(generator, ...args);
  return new Promise((generatorCompleted, reject) => {
    const iterate = function ({ value, done }) {
      if (done) { return generatorCompleted(value); }
      if (value.type === 'call') {
        try {
          const result = value.func(...value.args);

          if (result && typeof result.then !== 'undefined') {
            result.then(
              resolvedValue => iterate(generator.next(resolvedValue)),
              error => iterate(generator.throw(error))
            );
          } else if (result && typeof result.next !== 'undefined') {
            run(result).then(resultOfGenerator => {
              iterate(generator.next(resultOfGenerator))
            });
          } else {
            return iterate(generator.next(result));
          }
        } catch(error) {
          iterate(generator.throw(error));
        }
      } else {
        reject(new Error('You should yield a command. Use the `call` helper.'));
      }
    }
    iterate(generator.next());
  });
}