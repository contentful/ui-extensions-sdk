const { sinon, expect, describeChannelCallingMethod } = require('../helpers')

const createApp = require('../../lib/app')

const describeAppHookMessageExchange = (description, method, stage) => {
  describe(description, () => {
    let channelStub
    let app

    beforeEach(() => {
      channelStub = { addHandler: sinon.spy(), send: sinon.spy() }
      app = createApp(channelStub)
    })

    const test = async (handler, result) => {
      expect(channelStub.addHandler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
      const [channelMethod, sendMessage] = channelStub.addHandler.args[0]
      expect(channelMethod).to.eql('appHook')

      if (handler) {
        app[method](handler)
      }

      const msg = { installationRequestId: 'xyz', stage }
      const expected = { result, ...msg }

      await sendMessage(msg)

      expect(channelStub.send).to.have.been.calledWithExactly('appHookResult', expected)
    }

    it('requires the handler to be a function', () => {
      expect(() => {
        app[method]('yolo')
      }).to.throw(/must be a function/)
    })

    it('only allows to register a handler once', () => {
      app[method](() => {})
      expect(() => {
        app[method](() => {})
      }).to.throw(/handler twice/)
    })

    it('does the exchange when handler is not defined', () => test(undefined, {}))

    describe('the exchange when handler is a synchronous function', () => {
      const scenarios = [
        ['returns hash of empty parameters', () => ({}), {}],
        ['returns hash of non-empty parameters', () => ({ test: true }), { test: true }],
        ['returns false', () => false, false],
        [
          'returns false when an error is thrown',
          () => {
            throw new Error()
          },
          false
        ],
        ['returns empty hash of parameters if a non-object is returned', () => 1, {}]
      ]

      scenarios.forEach(([description, handler, result]) => {
        it(description, () => test(handler, result))
      })
    })

    describe('the exchange when handler is an async function', () => {
      const scenarios = [
        ['returns hash of empty parameters', async () => ({}), {}],
        ['returns hash of non-empty parameters', async () => ({ test: true }), { test: true }],
        ['returns false', async () => false, false],
        [
          'returns false when an error is thrown',
          async () => {
            throw new Error()
          },
          false
        ],
        ['returns false when a promise rejects', () => Promise.reject(new Error()), false],
        ['returns empty hash of parameters if a non-object is returned', async () => 1, {}]
      ]

      scenarios.forEach(([description, handler, result]) => {
        it(description, () => test(handler, result))
      })
    })
  })
}

const APP_METHODS = ['isInstalled', 'getParameters', 'getCurrentState']

describe('createApp()', () => {
  describe('returned "app" object', () => {
    APP_METHODS.forEach(appMethod => {
      describeChannelCallingMethod({
        creator: createApp,
        methodName: appMethod,
        channelMethod: 'callAppMethod',
        args: [],
        expectedCallArgs: [appMethod]
      })
    })

    describeAppHookMessageExchange('.onConfigure(handler)', 'onConfigure', 'preInstall')

    describeAppHookMessageExchange(
      '.onConfigurationCompleted(handler)',
      'onConfigurationCompleted',
      'postInstall'
    )
  })
})
