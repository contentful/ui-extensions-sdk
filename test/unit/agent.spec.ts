import { describeAttachHandlerMember, sinon, expect } from '../helpers'

import createAgent from '../../lib/agent'
import { Channel } from '../../lib/channel'
import { AgentContext } from '../../lib/types'
import {
  mockAgentContext,
  mockAgentContextMinimal,
  mockAgentContextWithPartialMetadata,
} from '../mocks/agent'

describe('createAgent()', () => {
  let channelStub: any

  beforeEach(() => {
    channelStub = {
      addHandler: sinon.stub(),
      call: sinon.stub(),
      send: sinon.stub(),
    } as unknown as Channel
  })

  describe('construction error', () => {
    it('throws an error when contextData is undefined', () => {
      expect(() => {
        createAgent(channelStub, undefined)
      }).to.throw('Context data is required')
    })

    it('throws an error when contextData is null', () => {
      expect(() => {
        createAgent(channelStub, null as any)
      }).to.throw('Context data is required')
    })
  })

  describe('instance with full context', () => {
    let agent: ReturnType<typeof createAgent>

    beforeEach(() => {
      agent = createAgent(channelStub, mockAgentContext)
    })

    describe('API shape', () => {
      it('returns an object with onContextChange, onToolbarAction, onAgentLayoutVariantChange, setAgentLayoutVariant, and onInvocation methods', () => {
        expect(agent).to.have.all.keys([
          'onInvocation',
          'onContextChange',
          'onToolbarAction',
          'onAgentLayoutVariantChange',
          'setAgentLayoutVariant',
        ])
        expect(agent.onContextChange).to.be.a('function')
        expect(agent.onToolbarAction).to.be.a('function')
        expect(agent.onAgentLayoutVariantChange).to.be.a('function')
        expect(agent.setAgentLayoutVariant).to.be.a('function')
      })
    })

    describe('.onContextChange(handler)', () => {
      describeAttachHandlerMember('default behaviour', () => {
        return agent.onContextChange(() => {})
      })

      it('calls handler immediately with initial context', () => {
        const handler = sinon.stub()
        agent.onContextChange(handler)

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWith(mockAgentContext)
      })

      it('calls handler with context containing all metadata fields', () => {
        const handler = sinon.stub()
        agent.onContextChange(handler)

        const receivedContext = handler.getCall(0).args[0]
        expect(receivedContext.view).to.equal('entry-editor')
        expect(receivedContext.metadata.entryId).to.equal('test-entry-123')
        expect(receivedContext.metadata.contentTypeId).to.equal('test-content-type-456')
        expect(receivedContext.metadata.lastFocusedFieldId).to.equal('test-field-789')
      })
    })

    describe('context change handling', () => {
      it('registers contextChanged, toolbarAction, and agentLayoutVariantChanged handlers with channel', () => {
        expect(channelStub.addHandler).to.have.callCount(4)
        expect(channelStub.addHandler.firstCall).to.have.been.calledWith(
          'contextChanged',
          sinon.match.func,
        )
        expect(channelStub.addHandler.getCall(1)).to.have.been.calledWith(
          'toolbarAction',
          sinon.match.func,
        )
        expect(channelStub.addHandler.thirdCall).to.have.been.calledWith(
          'agentLayoutVariantChanged',
          sinon.match.func,
        )
        expect(channelStub.addHandler.getCall(3)).to.have.been.calledWith(
          'agentInvocation',
          sinon.match.func,
        )
      })

      it('calls handler when contextChanged event is received', () => {
        const handler = sinon.stub()
        agent.onContextChange(handler)
        handler.resetHistory() // Reset the initial call

        const newContext: AgentContext = {
          view: 'page',
          metadata: {
            entryId: 'new-entry',
          },
        }

        // Simulate channel dispatching contextChanged event
        const contextChangedHandler = channelStub.addHandler.getCall(0).args[1]
        contextChangedHandler(newContext)

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWith(newContext)
      })

      it('calls multiple handlers when contextChanged event is received', () => {
        const handler1 = sinon.stub()
        const handler2 = sinon.stub()

        agent.onContextChange(handler1)
        agent.onContextChange(handler2)

        handler1.resetHistory()
        handler2.resetHistory()

        const newContext: AgentContext = {
          view: 'home',
          metadata: {},
        }

        const contextChangedHandler = channelStub.addHandler.getCall(0).args[1]
        contextChangedHandler(newContext)

        expect(handler1).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler1).to.have.been.calledWith(newContext)
        expect(handler2).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler2).to.have.been.calledWith(newContext)
      })

      it('does not call detached handler when contextChanged event is received', () => {
        const handler = sinon.stub()
        const detach = agent.onContextChange(handler)

        handler.resetHistory()
        detach()

        const newContext: AgentContext = {
          view: 'page',
          metadata: {},
        }

        const contextChangedHandler = channelStub.addHandler.getCall(0).args[1]
        contextChangedHandler(newContext)

        expect(handler).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })

      it('continues calling remaining handlers after one is detached', () => {
        const handler1 = sinon.stub()
        const handler2 = sinon.stub()
        const handler3 = sinon.stub()

        const detach1 = agent.onContextChange(handler1)
        agent.onContextChange(handler2)
        agent.onContextChange(handler3)

        handler1.resetHistory()
        handler2.resetHistory()
        handler3.resetHistory()

        detach1()

        const newContext: AgentContext = {
          view: 'dialog',
          metadata: { entryId: 'test' },
        }

        const contextChangedHandler = channelStub.addHandler.getCall(0).args[1]
        contextChangedHandler(newContext)

        expect(handler1).to.not.have.been.called // eslint-disable-line no-unused-expressions
        expect(handler2).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler3).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
      })
    })
  })

  describe('instance with minimal context', () => {
    let agent: ReturnType<typeof createAgent>

    beforeEach(() => {
      agent = createAgent(channelStub, mockAgentContextMinimal)
    })

    it('calls handler immediately with minimal context', () => {
      const handler = sinon.stub()
      agent.onContextChange(handler)

      expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
      expect(handler).to.have.been.calledWith(mockAgentContextMinimal)
    })

    it('handles context with empty metadata object', () => {
      const handler = sinon.stub()
      agent.onContextChange(handler)

      const receivedContext = handler.getCall(0).args[0]
      expect(receivedContext.view).to.equal('home')
      expect(receivedContext.metadata).to.deep.equal({})
    })
  })

  describe('instance with partial metadata', () => {
    let agent: ReturnType<typeof createAgent>

    beforeEach(() => {
      agent = createAgent(channelStub, mockAgentContextWithPartialMetadata)
    })

    it('calls handler with context containing partial metadata', () => {
      const handler = sinon.stub()
      agent.onContextChange(handler)

      const receivedContext = handler.getCall(0).args[0]
      expect(receivedContext.view).to.equal('page')
      expect(receivedContext.metadata.entryId).to.equal('entry-abc')
      expect(receivedContext.metadata.contentTypeId).to.be.undefined // eslint-disable-line no-unused-expressions
      expect(receivedContext.metadata.lastFocusedFieldId).to.be.undefined // eslint-disable-line no-unused-expressions
    })
  })

  describe('sequential context updates', () => {
    it('handlers receive each context update in order', () => {
      const agent = createAgent(channelStub, mockAgentContext)
      const handler = sinon.stub()
      agent.onContextChange(handler)

      handler.resetHistory()

      const contexts: AgentContext[] = [
        { view: 'entry-editor', metadata: { entryId: 'entry-1' } },
        { view: 'page', metadata: { entryId: 'entry-2' } },
        { view: 'home', metadata: {} },
      ]

      const contextChangedHandler = channelStub.addHandler.getCall(0).args[1]

      contexts.forEach((context) => {
        contextChangedHandler(context)
      })

      expect(handler).to.have.callCount(3)
      expect(handler.getCall(0).args[0]).to.deep.equal(contexts[0])
      expect(handler.getCall(1).args[0]).to.deep.equal(contexts[1])
      expect(handler.getCall(2).args[0]).to.deep.equal(contexts[2])
    })
  })

  describe('toolbar action handling', () => {
    let agent: ReturnType<typeof createAgent>

    beforeEach(() => {
      agent = createAgent(channelStub, mockAgentContext)
    })

    describe('.onToolbarAction(handler)', () => {
      describeAttachHandlerMember('default behaviour', () => {
        return agent.onToolbarAction(() => {})
      })

      it('does not call handler immediately on attach', () => {
        const handler = sinon.stub()

        agent.onToolbarAction(handler)

        expect(handler).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })

      it('calls handler when toolbarAction event is received', () => {
        const handler = sinon.stub()
        agent.onToolbarAction(handler)

        const action = { name: 'chat.history' as const, action: 'click' as const }

        // Simulate channel dispatching toolbarAction event
        const toolbarActionHandler = channelStub.addHandler.getCall(1).args[1]
        toolbarActionHandler(action)

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWith(action)
      })

      it('calls multiple handlers when toolbarAction event is received', () => {
        const handler1 = sinon.stub()
        const handler2 = sinon.stub()

        agent.onToolbarAction(handler1)
        agent.onToolbarAction(handler2)

        const action = { name: 'chat.close' as const, action: 'click' as const }

        const toolbarActionHandler = channelStub.addHandler.secondCall.args[1]
        toolbarActionHandler(action)

        expect(handler1).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler1).to.have.been.calledWith(action)
        expect(handler2).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler2).to.have.been.calledWith(action)
      })

      it('does not call detached handler when toolbarAction event is received', () => {
        const handler = sinon.stub()
        const detach = agent.onToolbarAction(handler)

        detach()

        const action = { name: 'chat.back' as const, action: 'click' as const }

        const toolbarActionHandler = channelStub.addHandler.secondCall.args[1]
        toolbarActionHandler(action)

        expect(handler).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })

      it('handles different toolbar action types', () => {
        const handler = sinon.stub()
        agent.onToolbarAction(handler)

        const toolbarActionHandler = channelStub.addHandler.getCall(1).args[1]

        // Test all action types
        toolbarActionHandler({ name: 'chat.history' as const, action: 'click' as const })
        toolbarActionHandler({ name: 'chat.back' as const, action: 'click' as const })
        toolbarActionHandler({ name: 'chat.close' as const, action: 'click' as const })
        toolbarActionHandler({ name: 'chat.new' as const, action: 'click' as const })

        expect(handler).to.have.callCount(4)
        expect(handler.getCall(0).args[0]).to.deep.equal({ name: 'chat.history', action: 'click' })
        expect(handler.getCall(1).args[0]).to.deep.equal({ name: 'chat.back', action: 'click' })
        expect(handler.getCall(2).args[0]).to.deep.equal({ name: 'chat.close', action: 'click' })
        expect(handler.getCall(3).args[0]).to.deep.equal({ name: 'chat.new', action: 'click' })
      })
    })
  })

  describe('invocation handling', () => {
    let agent: ReturnType<typeof createAgent>
    let deliver: (invocation: unknown) => void

    const invocation = (id = 'inv-1') => ({
      id,
      payload: { metric: 'views', values: [1, 2] },
      sender: { appDefinitionId: 'example-app' },
    })
    // The result is sent from a promise continuation, so let microtasks run before asserting on it.
    const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

    beforeEach(() => {
      agent = createAgent(channelStub, mockAgentContext)
      deliver = channelStub.addHandler.getCall(3).args[1]
    })

    describe('.onInvocation(handler)', () => {
      it('does not call handler on attach when nothing is pending', () => {
        const handler = sinon.stub()
        agent.onInvocation(handler)

        expect(handler).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })

      it('throws when handler is not a function', () => {
        expect(() => agent.onInvocation(undefined as any)).to.throw('listener function expected')
      })

      it('calls handler with the invocation when the event is received', () => {
        const handler = sinon.stub()
        agent.onInvocation(handler)

        deliver(invocation())

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWith(invocation())
      })

      it('buffers an invocation received before a handler is attached and flushes it on attach', () => {
        deliver(invocation())
        const handler = sinon.stub()

        agent.onInvocation(handler)

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWith(invocation())
      })

      it('does not replay a consumed invocation to a later handler', () => {
        deliver(invocation())
        const first = sinon.stub()
        const detach = agent.onInvocation(first)
        detach()

        const second = sinon.stub()
        agent.onInvocation(second)

        expect(second).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })

      it('ignores a repeat of an already consumed invocation id', () => {
        const handler = sinon.stub()
        agent.onInvocation(handler)

        deliver(invocation())
        deliver(invocation())

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
      })

      it('ignores a repeat of a still-buffered invocation id', () => {
        deliver(invocation())
        deliver(invocation())
        const handler = sinon.stub()

        agent.onInvocation(handler)

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
      })

      it('delivers a different invocation id after a consumed one', () => {
        const handler = sinon.stub()
        agent.onInvocation(handler)

        deliver(invocation('inv-1'))
        deliver(invocation('inv-2'))

        expect(handler).to.have.been.calledTwice // eslint-disable-line no-unused-expressions
      })

      it('throws when a second handler is attached while one is registered', () => {
        agent.onInvocation(() => {})

        expect(() => agent.onInvocation(() => {})).to.throw(/already registered/)
      })

      it('keeps the current handler registered when a stale detach function is called', () => {
        const detachFirst = agent.onInvocation(() => {})
        detachFirst()
        const current = sinon.stub()
        agent.onInvocation(current)

        detachFirst()
        deliver(invocation())

        expect(current).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
      })

      it('buffers again after the handler is detached', () => {
        const handler = sinon.stub()
        agent.onInvocation(handler)()

        deliver(invocation())

        expect(handler).to.not.have.been.called // eslint-disable-line no-unused-expressions
        const next = sinon.stub()
        agent.onInvocation(next)
        expect(next).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
      })

      it('still delivers route-context updates after an invocation', () => {
        const contextHandler = sinon.stub()
        agent.onContextChange(contextHandler)
        agent.onInvocation(() => {})
        deliver(invocation())
        contextHandler.resetHistory()

        const newContext: AgentContext = { view: 'page', metadata: { entryId: 'next' } }
        channelStub.addHandler.getCall(0).args[1](newContext)

        expect(contextHandler).to.have.been.calledOnceWithExactly(newContext)
      })
    })

    describe('result', () => {
      it('sends a result with the invocation id once the handler returns', async () => {
        agent.onInvocation(() => {})

        deliver(invocation())
        await flush()

        expect(channelStub.send).to.have.been.calledOnceWithExactly('agentInvocationResult', {
          id: 'inv-1',
        })
      })

      it('waits for an async handler to resolve before sending the result', async () => {
        let finish!: () => void
        agent.onInvocation(() => new Promise<void>((resolve) => (finish = resolve)))

        deliver(invocation())
        await flush()
        expect(channelStub.send).to.not.have.been.called // eslint-disable-line no-unused-expressions

        finish()
        await flush()
        expect(channelStub.send).to.have.been.calledOnceWithExactly('agentInvocationResult', {
          id: 'inv-1',
        })
      })

      it('sends the result for a buffered invocation once flushed to a handler', async () => {
        deliver(invocation())
        await flush()
        expect(channelStub.send).to.not.have.been.called // eslint-disable-line no-unused-expressions

        agent.onInvocation(() => {})
        await flush()

        expect(channelStub.send).to.have.been.calledOnceWithExactly('agentInvocationResult', {
          id: 'inv-1',
        })
      })

      it('delivers only the latest buffered invocation and sends an error result for the dropped one', async () => {
        deliver(invocation('inv-1'))
        deliver(invocation('inv-2'))

        expect(channelStub.send).to.have.been.calledOnceWithExactly('agentInvocationResult', {
          id: 'inv-1',
          error: 'Superseded by a newer invocation',
        })

        const handler = sinon.stub()
        agent.onInvocation(handler)
        await flush()

        expect(handler).to.have.been.calledOnceWithExactly(invocation('inv-2'))
        expect(channelStub.send).to.have.been.calledTwice // eslint-disable-line no-unused-expressions
        expect(channelStub.send.secondCall).to.have.been.calledWithExactly(
          'agentInvocationResult',
          {
            id: 'inv-2',
          },
        )
      })

      it('does not send an error result when a buffered invocation is repeated', () => {
        deliver(invocation('inv-1'))
        deliver(invocation('inv-1'))

        expect(channelStub.send).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })

      it('sends an error result when the handler throws', async () => {
        agent.onInvocation(() => {
          throw new Error('boom')
        })

        deliver(invocation())
        await flush()

        expect(channelStub.send).to.have.been.calledOnceWithExactly('agentInvocationResult', {
          id: 'inv-1',
          error: 'boom',
        })
      })

      it('sends an error result when the handler rejects', async () => {
        agent.onInvocation(() => Promise.reject(new Error('nope')))

        deliver(invocation())
        await flush()

        expect(channelStub.send).to.have.been.calledOnceWithExactly('agentInvocationResult', {
          id: 'inv-1',
          error: 'nope',
        })
      })

      it('sends an error result when the handler rejects with undefined', async () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        agent.onInvocation(() => Promise.reject(undefined))

        deliver(invocation())
        await flush()

        expect(channelStub.send).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(channelStub.send.firstCall.args[1]).to.have.property('error')
      })
    })
  })

  describe('layout variant handling', () => {
    let agent: ReturnType<typeof createAgent>

    beforeEach(() => {
      agent = createAgent(channelStub, mockAgentContext)
    })

    describe('.onAgentLayoutVariantChange(handler)', () => {
      describeAttachHandlerMember('default behaviour', () => {
        return agent.onAgentLayoutVariantChange(() => {})
      })

      it('calls handler immediately with initial value "normal"', () => {
        const handler = sinon.stub()
        agent.onAgentLayoutVariantChange(handler)

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWith('normal')
      })

      it('calls handler when agentLayoutVariantChanged event is received', () => {
        const handler = sinon.stub()
        agent.onAgentLayoutVariantChange(handler)
        handler.resetHistory() // Reset the initial call

        // Simulate channel dispatching agentLayoutVariantChanged event
        const agentLayoutVariantChangedHandler = channelStub.addHandler.getCall(2).args[1]
        agentLayoutVariantChangedHandler('expanded')

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWith('expanded')
      })

      it('calls handler with "normal" when agentLayoutVariantChanged event is received with "normal"', () => {
        const handler = sinon.stub()
        agent.onAgentLayoutVariantChange(handler)
        handler.resetHistory() // Reset the initial call

        const agentLayoutVariantChangedHandler = channelStub.addHandler.getCall(2).args[1]
        agentLayoutVariantChangedHandler('normal')

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWith('normal')
      })

      it('calls multiple handlers when agentLayoutVariantChanged event is received', () => {
        const handler1 = sinon.stub()
        const handler2 = sinon.stub()

        agent.onAgentLayoutVariantChange(handler1)
        agent.onAgentLayoutVariantChange(handler2)

        handler1.resetHistory()
        handler2.resetHistory()

        const agentLayoutVariantChangedHandler = channelStub.addHandler.getCall(2).args[1]
        agentLayoutVariantChangedHandler('expanded')

        expect(handler1).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler1).to.have.been.calledWith('expanded')
        expect(handler2).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler2).to.have.been.calledWith('expanded')
      })

      it('does not call detached handler when agentLayoutVariantChanged event is received', () => {
        const handler = sinon.stub()
        const detach = agent.onAgentLayoutVariantChange(handler)

        handler.resetHistory()
        detach()

        const agentLayoutVariantChangedHandler = channelStub.addHandler.getCall(2).args[1]
        agentLayoutVariantChangedHandler('expanded')

        expect(handler).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })
    })

    describe('.setAgentLayoutVariant(variant)', () => {
      it('sends "setAgentLayoutVariant" message to channel with "normal"', () => {
        agent.setAgentLayoutVariant('normal')

        expect(channelStub.send).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(channelStub.send).to.have.been.calledWith('setAgentLayoutVariant', 'normal')
      })

      it('sends "setAgentLayoutVariant" message to channel with "expanded"', () => {
        agent.setAgentLayoutVariant('expanded')

        expect(channelStub.send).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(channelStub.send).to.have.been.calledWith('setAgentLayoutVariant', 'expanded')
      })

      it('only accepts "normal" or "expanded" as valid values', () => {
        // TypeScript should prevent invalid values, but we can test the runtime behavior
        agent.setAgentLayoutVariant('normal')
        agent.setAgentLayoutVariant('expanded')

        expect(channelStub.send).to.have.been.calledTwice // eslint-disable-line no-unused-expressions
        expect(channelStub.send.firstCall).to.have.been.calledWith(
          'setAgentLayoutVariant',
          'normal',
        )
        expect(channelStub.send.secondCall).to.have.been.calledWith(
          'setAgentLayoutVariant',
          'expanded',
        )
      })

      it('throws error for invalid layout variant', () => {
        expect(() => {
          agent.setAgentLayoutVariant('invalid' as any)
        }).to.throw('Invalid layout variant "invalid". Expected "expanded" or "normal".')
      })

      it('throws error for empty string layout variant', () => {
        expect(() => {
          agent.setAgentLayoutVariant('' as any)
        }).to.throw('Invalid layout variant "". Expected "expanded" or "normal".')
      })

      it('throws error for null layout variant', () => {
        expect(() => {
          agent.setAgentLayoutVariant(null as any)
        }).to.throw(/Invalid layout variant/)
      })

      it('throws error for undefined layout variant', () => {
        expect(() => {
          agent.setAgentLayoutVariant(undefined as any)
        }).to.throw(/Invalid layout variant/)
      })

      it('dispatches agentLayoutVariantChanged signal when agentLayoutVariantChanged event is received', () => {
        const handler = sinon.stub()
        agent.onAgentLayoutVariantChange(handler)
        handler.resetHistory()

        const agentLayoutVariantChangedHandler = channelStub.addHandler.getCall(2).args[1]

        // Simulate receiving 'expanded' variant change
        agentLayoutVariantChangedHandler('expanded')

        expect(handler).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(handler).to.have.been.calledWith('expanded')

        // Simulate receiving 'normal' variant change
        agentLayoutVariantChangedHandler('normal')

        expect(handler).to.have.been.calledTwice // eslint-disable-line no-unused-expressions
        expect(handler.secondCall).to.have.been.calledWith('normal')
      })
    })
  })
})
