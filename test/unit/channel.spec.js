import Channel from '../../lib/api/channel'
import Promise from 'yaku'
import {noop, describeAttachHandlerMember} from '../helpers'

describe(`Channel instance`, () => {
  const sourceId = 42

  let stubTargetWindow
  let postMessageSpy
  let channel
  beforeEach(() => {
    postMessageSpy = sinon.stub()
    stubTargetWindow = {
      postMessage: postMessageSpy
    }
    channel = new Channel(sourceId, stubTargetWindow)
  })

  it(`is a Channel instance`, () => {
    expect(channel).to.be.instanceof(Channel)
  })

  describe(`.sourceId`, () => {
    it(`is equal to id given to constructor`, () => {
      expect(channel.sourceId).to.equal(sourceId)
    })
  })

  describe(`.targetWindow`, () => {
    it(`is equal to object given to constructor`, () => {
      expect(channel.targetWindow).to.equal(stubTargetWindow)
    })
  })

  describeAttachHandlerMember(`.addHandler(method, handler)`, () => {
    return channel.addHandler('forSomePurpose', noop)
  })

  const messagingCases = {
    'with multiple params': {
      method: 'someMethod',
      params: [42, 'foo', {}]
    },
    'with one params value': {
      method: 'aMethod',
      params: ['']
    },
    'without params': {
      method: 'anothereMethod',
      params: []
    }
  }

  describe(`.send(method, ...params)`, () => {
    for (let msg in messagingCases) {
      describeSend(msg, messagingCases[msg])
    }

    describeSubsequentTargetWindowsPostMessageInvocations('send')
  })

  function describeSend (msg, {method, params}) {
    describe(msg, () => {
      describeTargetWindowsPostMessageInvocation('send', method, ...params)
    })
  }

  describe(`.call(method, ...params)`, () => {
    for (let msg in messagingCases) {
      describeCall(msg, messagingCases[msg])
    }

    describeSubsequentTargetWindowsPostMessageInvocations('call')
  })

  function describeCall (msg, {method, params}) {
    describe(msg, () => {
      let promise
      beforeEach(() => {
        promise = channel.call(method, ...params)
      })

      describeTargetWindowsPostMessageInvocation('call', method, ...params)

      it(`returns a Promise`, () => {
        expect(promise).to.be.instanceof(Promise)
      })

      describe(`returned Promise`, () => {
        it(`gets resolved once the call got answered with a result`, (done) => {
          const result = 'foo bar'
          answerLastCallWith({result})

          expect(promise).to.eventually.equal(result)
            .and.notify(done)
        })
        it(`gets rejected once the call got answered with an error`, (done) => {
          const error = 'What a mess!'
          answerLastCallWith({error})

          expect(promise).to.be.rejectedWith(error)
            .and.notify(done)
        })
      })

      function answerLastCallWith (data) {
        data.id = postMessageSpy.lastCall.args[0].id
        window.postMessage(data, '*')
      }
    })
  }

  function describeTargetWindowsPostMessageInvocation (member, method, ...params) {
    describe(`.${member}() call's invocation of targetWindow .postMessage()`, () => {
      beforeEach(() => {
        postMessageSpy.reset()
        channel[member](method, ...params)
      })

      it(`is done once`, () => {
        expect(postMessageSpy).to.have.callCount(1)
      })

      describe(`message data`, () => {
        itHasMessageData(`.source set to channel's source ID`, 'source', sourceId)
        itHasMessageData(`.id set to a number`, 'id', sinon.match.number)
        itHasMessageData(`.method as given to .call()`, 'method', method)
        itHasMessageData(`.params as given to .call()`, 'params', params)

        function itHasMessageData (msg, field, value) {
          it(`has ${msg}`, () => {
            expect(postMessageSpy).to.have.been.calledWith(
              sinon.match.has(field, value))
          })
        }
      })
    })
  }

  function describeSubsequentTargetWindowsPostMessageInvocations (member) {
    const msg =
      `subsequent .${member}() calls' invocation of target window's .postMessage()`

    describe(msg, () => {
      const expectedCallsCount = Object.keys(messagingCases).length
      beforeEach(() => {
        for (let msg in messagingCases) {
          const {method, params} = messagingCases[msg]
          channel[member](method, ...params)
        }
      })

      it(`is done once for each .${member}()`, () => {
        expect(postMessageSpy).to.have.callCount(expectedCallsCount)
      })

      describe(`message data`, () => {
        it(`has .id set to a number incremented by each call`, () => {
          const expectedIds = []
          for (let i = 0; i < expectedCallsCount; i++) {
            expectedIds.push(i)
          }
          let providedIds = postMessageSpy.args.map((callArgs) => {
            return callArgs[0].id
          })
          expect(providedIds).to.deep.equal(expectedIds)
        })
      })
    })
  }
})
