var exists = require('101/exists')
var isFunction = require('101/is-function')

module.exports = copyFunc

/**
 * copy a function and maintain length and
 * @param  {Function} fn   function to copy
 * @param  {[type]}   [name] custom name for function, defaults to fn.name, ES6 only
 * @return {Function} "copy" of fn
 */
function copyFunc (fn, name) {
  if (!isFunction(fn)) {
    throw new Error('`fn` must be a function')
  }
  var copy

  if (Object.defineProperty) {
    // copy fn w/ length and possibly name
    copy = _copyFunc(fn, name)
  } else {
    // pre-ES5 copy fn, possibly w/ length
    copy = _legacyCopyFunc(fn)
  }

  return copy
}

/**
 * copy a function using es5 and/or es6 logic
 * @param  {Function} fn function to copy
 * @return {Function} "copy" of fn
 */
function _copyFunc (fn, name) {
  var copy = function () {
    return fn.apply(this, arguments)
  }
  name = exists(name) ? name : fn.name
  try {
    // only works w/ es6, pre-es6 has name w/ configurable: false
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
    Object.defineProperty(copy, 'name', {
      value: name,
      writable: false,
      enumerable: false,
      configurable: true
    })
  } catch (e) {}
  try {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length
    Object.defineProperty(copy, 'length', {
      value: fn.length,
      writable: false,
      enumerable: false,
      configurable: true
    })
  } catch (e) {}

  return copy
}

/**
 * copy a function using pre-es5 logic
 * @param  {Function} fn function to copy
 * @return {Function} "copy" of fn
 */
function _legacyCopyFunc (fn) {
  var copy = function () {
    return fn.apply(this, arguments)
  }
  if (!exists(fn.length)) {
    return copy
  }

  // most compatible solution:
  // use switch to make copy's "length"
  // same as the original
  // note: only handles fns w/ up to 7 args
  switch (fn.length) {
    // case 0 is satisfied by initial value
    case 1:
      copy = function (arg0) {
        return fn.apply(this, arguments)
      }
      break
    case 2:
      copy = function (arg0, arg1) {
        return fn.apply(this, arguments)
      }
      break
    case 3:
      copy = function (arg0, arg1, arg2) {
        return fn.apply(this, arguments)
      }
      break
    case 4:
      copy = function (arg0, arg1, arg2, arg3) {
        return fn.apply(this, arguments)
      }
      break
    case 5:
      copy = function (arg0, arg1, arg2, arg3, arg4) {
        return fn.apply(this, arguments)
      }
      break
    case 6:
      copy = function (arg0, arg1, arg2, arg3, arg4, arg5) {
        return fn.apply(this, arguments)
      }
      break
    case 7:
      copy = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        return fn.apply(this, arguments)
      }
      break
  }

  return copy
}
