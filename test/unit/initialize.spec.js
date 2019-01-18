const { Promise } = require('es6-promise')

const { sinon, makeDOM, expect } = require('../helpers')

const initializeApi = require('../../lib/initialize')

const dom = makeDOM()
const { Event } = dom.window

describe('initializeApi(currentWindow, apiCreator)', function () {
  beforeEach(function () {
    this.apiCreator = sinon.stub().returns({})
    const init = initializeApi(dom.window, (...args) => this.apiCreator(...args))
    this.initialize = function () {
      return new Promise((resolve) => init(resolve))
    }
  })

  describe('callback', function () {
    beforeEach(function () {
      this.api = {}
      this.init = initializeApi(dom.window, () => this.api)
    })

    it('is not invoked before connecting', function () {
      const cb = sinon.spy()
      this.init(cb)
      expect(cb).to.not.be.called // eslint-disable-line no-unused-expressions
    })

    it('is invoked after connecting', function (done) {
      this.init(() => done())
      sendConnect()
    })

    it('is invoked when registering it after connecting', function () {
      const cb = sinon.spy()
      sendConnect()
      return wait()
        .then(() => this.init(cb))
        .then(() => {
          expect(cb).to.be.called // eslint-disable-line no-unused-expressions
        })
    })

    it('receives the result of the apiCreator', function (done) {
      this.init((arg) => {
        expect(arg).to.equal(this.api)
        done()
      })
      sendConnect()
    })
  })

  it('calls apiCreator with channel and params', function () {
    const params = { id: 'foo', val: 'x' }
    sendConnect(params)
    return this.initialize()
      .then(() => {
        const [channel, params] = this.apiCreator.args[0]
        expect(channel.call).to.be.a('function')
        expect(channel.send).to.be.a('function')
        expect(channel.addHandler).to.be.a('function')
        expect(params).to.deep.equal(params)
      })
  })

  it('calls handlers for queued messages', function () {
    sendConnect(null, [{ method: 'M', params: ['X', 'Y'] }])
    const handler = sinon.stub()
    this.apiCreator = function (channel) {
      channel.addHandler('M', handler)
    }
    return this.initialize()
      .then(() => {
        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWithExactly('X', 'Y')
      })
  })

  it('adds focus handlers', function () {
    let send = sinon.spy()
    this.apiCreator = function (channel) {
      channel.send = send
    }
    sendConnect()
    return this.initialize()
      .then(() => {
        dom.window.document.dispatchEvent(new Event('focus'))
        expect(send).to.be.calledOnce // eslint-disable-line no-unused-expressions
        expect(send).to.be.calledWithExactly('setActive', true)

        send.resetHistory()
        dom.window.document.dispatchEvent(new Event('blur'))
        expect(send).to.be.calledOnce // eslint-disable-line no-unused-expressions
        expect(send).to.be.calledWithExactly('setActive', false)
      })
  })

  function sendConnect (params, messageQueue) {
    dom.window.postMessage({
      method: 'connect',
      params: [
        params || { id: 'foo' },
        messageQueue || []
      ]
    }, '*')
  }

  function wait () {
    return new Promise((resolve) => setTimeout(resolve))
  }
})
