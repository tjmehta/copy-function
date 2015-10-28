# copy-function [![Build Status](https://travis-ci.org/tjmehta/copy-function.svg?branch=master)](https://travis-ci.org
copy a function by wrapping it w/ a closure

## Installation
```js
npm install copy-function
```

## Usage
'''js
var copyFunc = require('copy-function')
function add (a, b) {
  return a + b
}

var addCopy = copyFunc(add)
console.log(addCopy === add) // false
console.log(addCopy(1, 2))   // 3
console.log(addCopy.name)    // "add"
console.log(addCopy.length)  // 2

// give the copy a custom name
var addCopy = copyFunc(add, 'addCopy')
console.log(addCopy.name) // "addCopy"
```

## License
MIT