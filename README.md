# Banica

_Handle async processes like a boss. Implementation of the command pattern using generators. Or in other words a [redux-saga](http://redux-saga.js.org) but without the Redux bit._

![Баница](./imgs/banica.jpg)

---

![Travis](https://travis-ci.org/krasimir/banica.svg?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/banica.svg?style=flat-square)](https://www.npmjs.com/package/banica)

---

* [Read the story of the library](http://krasimirtsonev.com/blog/article/javascript-pattern-of-the-year-handle-async-like-a-boss)
* CodePen to play with [codepen.io/krasimir/pen/YEvNqx](https://codepen.io/krasimir/pen/YEvNqx?editors=0010)

---

## Installation

`yarn add banica` or `npm install banica -S`. The library is available also as a single JavaScript file [here](./standalone).

## Usage

The library exports just two merhods `call` and `run`. `call` is used to wrap your function calls so the `run` function recognizes them as commands. That `run` function accepts a generator function or a created generator. For example:

```js
import { call, run } from 'banica';

const isItTimeForBreakfast = () => true;
const getFood = () => new Promise(resolve => {
  setTimeout(() => resolve('banica'), 1000);
});
const eat = what => `I'll take ${ what } for breakfast!`;

const goodMorning = function * () {
  const ready = yield call(isItTimeForBreakfast);

  if (ready) {
    const food = yield call(getFood);
    const message = yield call(eat, food);

    console.log(message); // I'll take banica for breakfast
  }
}

run(goodMorning);
```

### Error handling

Just wrap the `yield` statements into a try-catch block. An error is send back to your generator in the following cases:

* Your function throws an error
* Your function returns a promise that gets rejected

```js
const broken = function () {
  throw new Error('Ops, it is broken!');
}
const brokenAPI = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('Ops, the API is broken!'));
  });
}

const program = function * () {
  try {
    yield call(broken);
  } catch (error) { ... } // "Ops, it is broken!" error
  try {
    yield call(brokenAPI);
  } catch (error) { ... } // "Ops, the API is broken!" error
}
```

## API

### `call(<func or generator function>, ...args)`

`call` function accepts a function or generator function and arguments that need to be passed down. For example:

```js
const formatMessage = name => `Hello ${ name }`;
//...later in a generator
yield call(formatMessage, 'John');

or
const getGreeting = () => 'Hello';
const formatMessage = function * (name) {
  const greeting = yield call(getGreeting);
  return `${ greeting } ${ name }`;
}
//...later in a generator
yield call(formatMessage, 'John');
```

What you can `yield call` is:

* A function
* A function that returns a promise
* A generator function

The `call` method returns an object of the form

```js
{ type: 'call', func: <your function here>, args: <your arguments here> }
```

### `run(<generator or generator function>)`

Either create your generator upfront or send the generator function.

```js
function * generator() {
  // ...
}

run(generator());
// or
run(generator);
```

The `run` method returns a promise that gets resolved when your generator is completed:

```js
run(generator).then(() => console.log(`Job's done!`));
```
