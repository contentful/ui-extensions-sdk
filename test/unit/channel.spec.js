const { sinon, makeDOM, expect } = require('../helpers')

const connect = require('../../lib/channel')

describe('channel connect', function () {
  beforeEach(function () {
    this.dom = makeDOM()
    this.postMessage = sinon.stub()
    Object.defineProperty(this.dom.window, 'parent', {
      writable: false,
      value: { postMessage: this.postMessage }
    })
  })

  it('resolves with channel and params on connect event', function (done) {
    connect(this.dom.window, (channel, params) => {
      expect(channel.send).to.be.a('function')
      expect(channel.call).to.be.a('function')
      expect(channel.addHandler).to.be.a('function')
      expect(params.id).to.equal('ID')
      done()
    })

    this.dom.window.postMessage({
      method: 'connect',
      params: [{ id: 'ID' }]
    }, '*')
  })

  describe('channel instance', function () {
    beforeEach(function (done) {
      connect(this.dom.window, (channel) => {
        this.channel = channel
        done()
      })

      this.dom.window.postMessage({
        method: 'connect',
        params: [{ id: 'SOURCE' }]
      }, '*')
    })

    describe('#send()', function () {
      it('calls post message with parameters', function () {
        this.channel.send('M', 1, 2)
        expect(this.postMessage).to.be.calledOnce // eslint-disable-line no-unused-expressions
        expect(this.postMessage).to.be.calledWithMatch({
          source: 'SOURCE',
          method: 'M',
          params: [1, 2]
        })

        this.channel.send('N', false)
        expect(this.postMessage).to.be.calledTwice // eslint-disable-line no-unused-expressions
        expect(this.postMessage).to.be.calledWithMatch({
          source: 'SOURCE',
          method: 'N',
          params: [false]
        })
      })
    })

    describe('#call()', function () {
      it('calls post message with parameters', function () {
        this.channel.call('M', 1, 2)
        expect(this.postMessage).to.be.calledOnce // eslint-disable-line no-unused-expressions
        expect(this.postMessage).to.be.calledWithMatch({
          source: 'SOURCE',
          method: 'M',
          params: [1, 2]
        })

        this.channel.call('N', false)
        expect(this.postMessage).to.be.calledTwice // eslint-disable-line no-unused-expressions
        expect(this.postMessage).to.be.calledWithMatch({
          source: 'SOURCE',
          method: 'N',
          params: [false]
        })
      })

      it('resolves promise when result is received', function () {
        const response = this.channel.call('M')
        const messageId = this.postMessage.args[0][0].id

        this.dom.window.postMessage({
          id: messageId,
          result: 'JO'
        }, '*')

        return expect(response).to.eventually.equal('JO')
      })

      it('rejects promise when error is received', function () {
        const response = this.channel.call('M')
        const messageId = this.postMessage.args[0][0].id

        this.dom.window.postMessage({
          id: messageId,
          error: 'ERROR'
        }, '*')

        return expect(response).to.be.rejected
      })
    })

    describe('#addHandler()', function () {
      it('calls callback when message is received', function (done) {
        this.channel.addHandler('method', function (...params) {
          expect(params).to.deep.equal(['a', 'b', 'c'])
          done()
        })
        this.dom.window.postMessage({
          method: 'method',
          params: ['a', 'b', 'c']
        }, '*')
      })
    })
  })
})
