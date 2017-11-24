'use strict';

var _banica = require('../banica.js');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('Given the banica library', function () {
  describe('when calling the `run` function', function () {
    describe('when passing something different then a generator', function () {
      it('should throw an error', function () {
        [1, 'a', {}, [], function () {}].forEach(function (what) {
          expect(_banica.run.bind(null, what)).to.throw();
        });
      });
    });
    describe('when passing a generator function', function () {
      it('should create the generator and iterates over it', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _banica.run)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(param) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          return _context.abrupt('return', param * 2);

                        case 1:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }), 21);

              case 2:
                result = _context2.sent;

                expect(result).to.equal(42);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })));
    });
    describe('when passing a generator with no yield inside', function () {
      it('should iterate over it', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _banica.run)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          return _context3.abrupt('return', 42);

                        case 1:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, this);
                }));

              case 2:
                result = _context4.sent;

                expect(result).to.equal(42);

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      })));
    });
    describe('when passing a generator with unsupported yield', function () {
      it('should throw an error', function () {
        return expect((0, _banica.run)( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return 'foo';

                case 2:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }))).to.be.rejectedWith('You should yield a command. Use the `call` helper.');
      });
    });
    describe('when yielding with the call helper', function () {
      describe('and we yield a normal function', function () {
        it('should execute the function', function () {
          var playerMove = sinon.stub().withArgs(42).returns('foo');
          var transform = sinon.stub().withArgs('foo').returns('bar');
          var game = /*#__PURE__*/regeneratorRuntime.mark(function game() {
            var a, b;
            return regeneratorRuntime.wrap(function game$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return (0, _banica.call)(playerMove, 42);

                  case 2:
                    a = _context6.sent;
                    _context6.next = 5;
                    return (0, _banica.call)(transform, b);

                  case 5:
                    b = _context6.sent;
                    return _context6.abrupt('return', b);

                  case 7:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, game, this);
          });

          return expect((0, _banica.run)(game)).become('bar');
        });
      });
      describe('and we yield a function that returns a promise', function () {
        it('should wait for the promises', function () {
          var playerMove = sinon.stub().withArgs(42).returns(new Promise(function (resolve) {
            setTimeout(function () {
              return resolve('foo');
            }, 5);
          }));
          var transform = sinon.stub().withArgs('foo').returns(new Promise(function (resolve) {
            setTimeout(function () {
              return resolve('bar');
            }, 5);
          }));
          var game = /*#__PURE__*/regeneratorRuntime.mark(function game() {
            var a, b;
            return regeneratorRuntime.wrap(function game$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return (0, _banica.call)(playerMove, 42);

                  case 2:
                    a = _context7.sent;
                    _context7.next = 5;
                    return (0, _banica.call)(transform, b);

                  case 5:
                    b = _context7.sent;
                    return _context7.abrupt('return', b);

                  case 7:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, game, this);
          });

          return expect((0, _banica.run)(game)).become('bar');
        });
      });
      describe('and we yield a generator', function () {
        it('should execute that inner generator', function () {
          var transform = sinon.stub().withArgs('foo').returns(new Promise(function (resolve) {
            setTimeout(function () {
              return resolve(21);
            }, 5);
          }));
          var playerMove = /*#__PURE__*/regeneratorRuntime.mark(function playerMove(param) {
            var a;
            return regeneratorRuntime.wrap(function playerMove$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return (0, _banica.call)(transform, param);

                  case 2:
                    a = _context8.sent;
                    return _context8.abrupt('return', a * 2);

                  case 4:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, playerMove, this);
          });
          var game = /*#__PURE__*/regeneratorRuntime.mark(function game() {
            return regeneratorRuntime.wrap(function game$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return (0, _banica.call)(playerMove, 'foo');

                  case 2:
                    return _context9.abrupt('return', _context9.sent);

                  case 3:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, game, this);
          });

          return expect((0, _banica.run)(game)).become(42);
        });
      });
    });
    describe('and we delegate to another generator', function () {
      it('should execute that inner generator', function () {
        var transform = sinon.stub().withArgs('foo').returns(new Promise(function (resolve) {
          setTimeout(function () {
            return resolve(21);
          }, 5);
        }));
        var playerMove = /*#__PURE__*/regeneratorRuntime.mark(function playerMove(param) {
          var a;
          return regeneratorRuntime.wrap(function playerMove$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  _context10.next = 2;
                  return (0, _banica.call)(transform, param);

                case 2:
                  a = _context10.sent;
                  return _context10.abrupt('return', a * 2);

                case 4:
                case 'end':
                  return _context10.stop();
              }
            }
          }, playerMove, this);
        });
        var game = /*#__PURE__*/regeneratorRuntime.mark(function game() {
          return regeneratorRuntime.wrap(function game$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  return _context11.delegateYield(playerMove('foo'), 't0', 1);

                case 1:
                  return _context11.abrupt('return', _context11.t0);

                case 2:
                case 'end':
                  return _context11.stop();
              }
            }
          }, game, this);
        });

        return expect((0, _banica.run)(game)).become(42);
      });
    });

    // Error handling
    describe('and a function throws an error', function () {
      it('should send the error back to the generator', function () {
        var err = new Error('blah');
        var playerMove = sinon.stub().withArgs(42).throws(err);
        var game = /*#__PURE__*/regeneratorRuntime.mark(function game() {
          return regeneratorRuntime.wrap(function game$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.prev = 0;
                  _context12.next = 3;
                  return (0, _banica.call)(playerMove, 42);

                case 3:
                  _context12.next = 8;
                  break;

                case 5:
                  _context12.prev = 5;
                  _context12.t0 = _context12['catch'](0);
                  return _context12.abrupt('return', _context12.t0.message);

                case 8:
                case 'end':
                  return _context12.stop();
              }
            }
          }, game, this, [[0, 5]]);
        });

        return expect((0, _banica.run)(game)).become('blah');
      });
    });
    describe('and we have a promise that gets rejected', function () {
      it('should send the error back to the generator', function () {
        var err = new Error('Ops');
        var playerMove = sinon.stub().withArgs(42).returns(new Promise(function (resolve, reject) {
          setTimeout(function () {
            return reject(err);
          }, 5);
        }));
        var game = /*#__PURE__*/regeneratorRuntime.mark(function game() {
          return regeneratorRuntime.wrap(function game$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  _context13.prev = 0;
                  _context13.next = 3;
                  return (0, _banica.call)(playerMove, 42);

                case 3:
                  _context13.next = 8;
                  break;

                case 5:
                  _context13.prev = 5;
                  _context13.t0 = _context13['catch'](0);
                  return _context13.abrupt('return', _context13.t0.message);

                case 8:
                case 'end':
                  return _context13.stop();
              }
            }
          }, game, this, [[0, 5]]);
        });

        return expect((0, _banica.run)(game)).become('Ops');
      });
    });
  });
});