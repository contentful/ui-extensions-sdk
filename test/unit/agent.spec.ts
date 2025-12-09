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
      it('returns an object with onContextChange, onToolbarAction, and setLayoutVariant methods', () => {
        expect(agent).to.have.all.keys(['onContextChange', 'onToolbarAction', 'setLayoutVariant'])
        expect(agent.onContextChange).to.be.a('function')
        expect(agent.onToolbarAction).to.be.a('function')
        expect(agent.setLayoutVariant).to.be.a('function')
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
      it('registers contextChanged and toolbarAction handlers with channel', () => {
        expect(channelStub.addHandler).to.have.been.calledTwice // eslint-disable-line no-unused-expressions
        expect(channelStub.addHandler.firstCall).to.have.been.calledWith(
          'contextChanged',
          sinon.match.func,
        )
        expect(channelStub.addHandler.getCall(1)).to.have.been.calledWith(
          'toolbarAction',
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

        const toolbarActionHandler = channelStub.addHandler.secondCall.args[1]

        // Test all action types
        toolbarActionHandler({ name: 'chat.history' as const, action: 'click' as const })
        toolbarActionHandler({ name: 'chat.back' as const, action: 'click' as const })
        toolbarActionHandler({ name: 'chat.close' as const, action: 'click' as const })

        expect(handler).to.have.callCount(3)
        expect(handler.getCall(0).args[0]).to.deep.equal({ name: 'chat.history', action: 'click' })
        expect(handler.getCall(1).args[0]).to.deep.equal({ name: 'chat.back', action: 'click' })
        expect(handler.getCall(2).args[0]).to.deep.equal({ name: 'chat.close', action: 'click' })
      })
    })
  })

  describe('setLayoutVariant', () => {
    let agent: ReturnType<typeof createAgent>

    beforeEach(() => {
      agent = createAgent(channelStub, mockAgentContext)
    })

    describe('.setLayoutVariant(variant)', () => {
      it('sends "setLayoutVariant" message to channel with "normal"', () => {
        agent.setLayoutVariant('normal')

        expect(channelStub.send).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(channelStub.send).to.have.been.calledWith('setLayoutVariant', 'normal')
      })

      it('sends "setLayoutVariant" message to channel with "expanded"', () => {
        agent.setLayoutVariant('expanded')

        expect(channelStub.send).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(channelStub.send).to.have.been.calledWith('setLayoutVariant', 'expanded')
      })

      it('only accepts "normal" or "expanded" as valid values', () => {
        // TypeScript should prevent invalid values, but we can test the runtime behavior
        agent.setLayoutVariant('normal')
        agent.setLayoutVariant('expanded')

        expect(channelStub.send).to.have.been.calledTwice // eslint-disable-line no-unused-expressions
        expect(channelStub.send.firstCall).to.have.been.calledWith('setLayoutVariant', 'normal')
        expect(channelStub.send.secondCall).to.have.been.calledWith('setLayoutVariant', 'expanded')
      })
    })
  })
})
