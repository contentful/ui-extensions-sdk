import { sinon, makeDOM, expect } from '../helpers'

import initializeApi from '../../lib/initialize'
import { Channel } from '../../lib/channel'

describe('initializeApi(currentWindow, apiCreator)', function() {
  beforeEach(function() {
    this.dom = makeDOM()
    this.apiCreator = sinon.stub().returns({})
    const init = initializeApi(this.dom.window, (...args) => this.apiCreator(...args))
    this.initialize = function() {
      return new Promise(resolve => init(resolve))
    }
  })

  describe('callback', function() {
    beforeEach(function() {
      this.api = {}
      this.apiCreator = sinon.stub().returns(this.api)
      this.init = initializeApi(this.dom.window, this.apiCreator)
    })

    it('is not invoked before connecting', function() {
      const cb = sinon.spy()
      this.init(cb)
      expect(cb).to.not.be.called // eslint-disable-line no-unused-expressions
    })

    it('is invoked after connecting', function(done) {
      this.init(() => done())
      sendConnect(this.dom)
    })

    it('is invoked when registering it after connecting', async function() {
      const cb = sinon.spy()
      sendConnect(this.dom)
      await wait()
      await this.init(cb)
      expect(cb).to.be.called // eslint-disable-line no-unused-expressions
    })

    it('receives the result of the apiCreator', function(done) {
      this.init((arg: any) => {
        expect(arg).to.equal(this.api)
        done()
      })
      sendConnect(this.dom)
    })

    it('receives the result of the custom API creator', function(done) {
      const customApi = {}
      const makeCustomApi = sinon.stub().returns(customApi)

      this.init(
        (_: any, arg: any) => {
          expect(arg).to.equal(customApi)
          const [channel, params] = this.apiCreator.args[0]
          expect(makeCustomApi).to.be.calledWithExactly(channel, params)
          done()
        },
        { makeCustomApi }
      )

      sendConnect(this.dom)
    })
  })

  it('calls apiCreator with channel and params', function() {
    const params = { id: 'foo', val: 'x' }
    sendConnect(this.dom, params)
    return this.initialize().then(() => {
      const [channel, params] = this.apiCreator.args[0]
      expect(channel.call).to.be.a('function')
      expect(channel.send).to.be.a('function')
      expect(channel.addHandler).to.be.a('function')
      expect(params).to.deep.equal(params)
    })
  })

  it('calls handlers for queued messages', function() {
    sendConnect(this.dom, null as any, [{ method: 'M', params: ['X', 'Y'] }])
    const handler = sinon.stub()
    this.apiCreator = function(channel: Channel) {
      channel.addHandler('M', handler)
    }
    return this.initialize().then(() => {
      expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
      expect(handler).to.have.been.calledWithExactly('X', 'Y')
    })
  })

  it('adds focus handlers', function() {
    const { Event } = this.dom.window
    const send = sinon.spy()
    this.apiCreator = function(channel: Channel) {
      channel.send = send
    }
    sendConnect(this.dom)
    return this.initialize().then(() => {
      this.dom.window.document.dispatchEvent(new Event('focus'))
      expect(send).to.be.calledOnce // eslint-disable-line no-unused-expressions
      expect(send).to.be.calledWithExactly('setActive', true)

      send.resetHistory()
      this.dom.window.document.dispatchEvent(new Event('blur'))
      expect(send).to.be.calledOnce // eslint-disable-line no-unused-expressions
      expect(send).to.be.calledWithExactly('setActive', false)
    })
  })

  function sendConnect(dom: { window: Window }, params?: any, messageQueue?: any[]) {
    dom.window.postMessage(
      {
        method: 'connect',
        params: [params || { id: 'foo' }, messageQueue || []]
      },
      '*'
    )
  }

  function wait() {
    return new Promise(resolve => setTimeout(resolve))
  }
})
