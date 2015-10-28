var Code = require('code')
var Lab = require('lab')

var copyFunc = require('../index.js')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var afterEach = lab.afterEach
var beforeEach = lab.beforeEach
var expect = Code.expect
var IS_GTE_NODE_4 = process.version.split('.')[0] === 'v4'

function add (a, b) {
  return a + b
}

describe('copyFunction', function () {
  it('should copy a function', function (done) {
    var addCopy = copyFunc(add)
    expect(addCopy).to.not.equal(add)
    expect(addCopy(1, 2))
      .to.equal(add(1, 2))
      .to.equal(1 + 2)
    if (IS_GTE_NODE_4) {
      expect(addCopy.name).to.equal(add.name)
    }
    expect(addCopy.length).to.equal(add.length)
    done()
  })
  it('should copy a function and assign a customName', function (done) {
    var addCopy = copyFunc(add, 'addCopy')
    expect(addCopy).to.not.equal(add)
    expect(addCopy(1, 2))
      .to.equal(add(1, 2))
      .to.equal(1 + 2)
    if (IS_GTE_NODE_4) {
      expect(addCopy.name).to.equal('addCopy')
    }
    expect(addCopy.length).to.equal(add.length)
    done()
  })

  describe('errors', function () {
    it('should throw an error if pass a non-function', function (done) {
      expect(function () {
        copyFunc({})
      }).to.throw(Error, /fn.*function/)
      done()
    })
  })
  describe('compatibility', function () {
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
    var defineProperty = Object.defineProperty
    var fnWithoutLength = function () {}
    if (IS_GTE_NODE_4) {
      Object.defineProperty(fnWithoutLength, 'length', {
        value: null,
        writable: false,
        enumerable: false,
        configurable: true
      })
    }

    describe('no Object.getOwnPropertyDescriptor', function () {
      beforeEach(function (done) {
        delete Object.getOwnPropertyDescriptor
        done()
      })
      afterEach(function (done) {
        Object.getOwnPropertyDescriptor = getOwnPropertyDescriptor
        done()
      })

      it('should use "legacy" copy', function (done) {
        var fn = function () { return 10 }
        var fnCopy = copyFunc(fn)
        // different assertions, bc lab throws errors w/out getOwnPropDesc
        expect(fnCopy !== fn).to.be.true()
        expect(fnCopy() === fn()).to.be.true()
        expect(fnCopy.length === fn.length).to.be.true()
        done()
      })
    })

    describe('no Object.defineProperty', function () {
      beforeEach(function (done) {
        delete Object.defineProperty
        done()
      })
      afterEach(function (done) {
        Object.defineProperty = defineProperty
        done()
      })
      if (IS_GTE_NODE_4) {
        // cannot redifine fn's length
        // to test this w/out node 4+
        it('should copy a function w/ no length', function (done) {
          var fn = fnWithoutLength
          var fnCopy = copyFunc(fn)
          assertCopy(fnCopy, fn)
          done()
        })
      }
      it('should copy a function of length 0', function (done) {
        var fn = function () { return 10 }
        var fnCopy = copyFunc(fn)
        assertCopy(fnCopy, fn)
        done()
      })
      it('should copy a function of length 1', function (done) {
        var fn = function (a) { return 10 }
        var fnCopy = copyFunc(fn)
        assertCopy(fnCopy, fn)
        done()
      })
      it('should copy a function of length 2', function (done) {
        var fn = function (a, b) { return 10 }
        var fnCopy = copyFunc(fn)
        assertCopy(fnCopy, fn)
        done()
      })
      it('should copy a function of length 3', function (done) {
        var fn = function (a, b, c) { return 10 }
        var fnCopy = copyFunc(fn)
        assertCopy(fnCopy, fn)
        done()
      })
      it('should copy a function of length 4', function (done) {
        var fn = function (a, b, c, d) { return 10 }
        var fnCopy = copyFunc(fn)
        assertCopy(fnCopy, fn)
        done()
      })
      it('should copy a function of length 5', function (done) {
        var fn = function (a, b, c, d, e) { return 10 }
        var fnCopy = copyFunc(fn)
        assertCopy(fnCopy, fn)
        done()
      })
      it('should copy a function of length 6', function (done) {
        var fn = function (a, b, c, d, e, f) { return 10 }
        var fnCopy = copyFunc(fn)
        assertCopy(fnCopy, fn)
        done()
      })
      it('should copy a function of length 7', function (done) {
        var fn = function (a, b, c, d, e, f, g) { return 10 }
        var fnCopy = copyFunc(fn)
        assertCopy(fnCopy, fn)
        done()
      })
    })

    function assertCopy (fnCopy, fn) {
      expect(fnCopy).to.not.equal(fn)
      expect(fnCopy()).to.equal(fn())
      expect(fnCopy.name).to.equal(fn.name)
      if (fn.length) {
        expect(fnCopy.length).to.equal(fn.length)
      }
    }
  })
})
