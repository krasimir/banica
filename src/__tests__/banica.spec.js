import { call, run } from '../banica.js';

describe('Given the banica library', function () {
  describe('when calling the `run` function', function () {
    describe('when passing something different then a generator', function () {
      it('should throw an error', function () {
        [1, 'a', {}, [], () => {}].forEach(what => {
          expect(run.bind(null, what)).to.throw();
        });
      });
    });
    describe('when passing a generator function', function () {
      it('should create the generator and iterates over it', async function () {
        const result = await run(function* (param) {
          return param * 2;
        }, 21);
        expect(result).to.equal(42);
      });
    });
    describe('when passing a generator with no yield inside', function () {
      it('should iterate over it', async function () {
        const result = await run(function* () {
          return 42;
        });
        expect(result).to.equal(42);
      });
    });
    describe('when passing a generator with unsupported yield', function () {
      it('should throw an error', function () {
        return expect(run(function* () { yield 'foo'; })).to.be.rejectedWith('You should yield a command. Use the `call` helper.');
      });
    });
    describe('when yielding with the call helper', function () {
      describe('and we yield a normal function', function () {
        it('should execute the function', function () {
          const playerMove = sinon.stub().withArgs(42).returns('foo');
          const transform = sinon.stub().withArgs('foo').returns('bar');
          const game = function * () {
            const a = yield call(playerMove, 42);
            const b = yield call(transform, b);
            return b;
          }

          return expect(run(game)).become('bar');
        });
      });
      describe('and we yield a function that returns a promise', function () {
        it('should wait for the promises', function () {
          const playerMove = sinon.stub().withArgs(42).returns(new Promise(resolve => {
            setTimeout(() => resolve('foo'), 5);
          }));
          const transform = sinon.stub().withArgs('foo').returns(new Promise(resolve => {
            setTimeout(() => resolve('bar'), 5);
          }));
          const game = function * () {
            const a = yield call(playerMove, 42);
            const b = yield call(transform, b);
            return b;
          }

          return expect(run(game)).become('bar');
        });
      });
      describe('and we yield a generator', function () {
        it('should execute that inner generator', function () {
          const transform = sinon.stub().withArgs('foo').returns(new Promise(resolve => {
            setTimeout(() => resolve(21), 5);
          }));
          const playerMove = function * (param) {
            const a = yield call(transform, param);
            return a * 2;
          }
          const game = function * () {
            return yield call(playerMove, 'foo');
          }

          return expect(run(game)).become(42);
        });
      });
    });
    describe('and we delegate to another generator', function () {
      it('should execute that inner generator', function () {
        const transform = sinon.stub().withArgs('foo').returns(new Promise(resolve => {
          setTimeout(() => resolve(21), 5);
        }));
        const playerMove = function * (param) {
          const a = yield call(transform, param);
          return a * 2;
        }
        const game = function * () {
          return yield * playerMove('foo');
        }

        return expect(run(game)).become(42);
      });
    });

    // Error handling
    describe('and a function throws an error', function () {
      it('should send the error back to the generator', function () {
        const err = new Error('blah');
        const playerMove = sinon.stub().withArgs(42).throws(err);
        const game = function * () {
          try {
            yield call(playerMove, 42);
          } catch(error) {
            return error.message;
          }
        }

        return expect(run(game)).become('blah');
      });
    });
    describe('and we have a promise that gets rejected', function () {
      it('should send the error back to the generator', function () {
        const err = new Error('Ops');
        const playerMove = sinon.stub().withArgs(42).returns(new Promise((resolve, reject) => {
          setTimeout(() => reject(err), 5);
        }));
        const game = function * () {
          try {
            yield call(playerMove, 42);
          } catch(error) {
            return error.message;
          }
        }

        return expect(run(game)).become('Ops');
      });
    });
  });
});
