import { describeAttachHandlerMember, sinon, expect } from '../helpers'

import createExperience from '../../lib/experience'
import { Channel } from '../../lib/channel'
import {
  mockExperienceInit,
  mockExperienceInitVisualMode,
  mockExperienceSnapshot,
} from '../mocks/experience'

describe('createExperience()', () => {
  let channelStub: any

  beforeEach(() => {
    channelStub = {
      addHandler: sinon.stub(),
      call: sinon.stub().resolves(undefined),
      send: sinon.stub(),
    } as unknown as Channel
  })

  describe('when experienceInit is undefined', () => {
    it('throws (mirrors createAgent; keeps the non-optional experiences type sound)', () => {
      expect(() => createExperience(channelStub, undefined)).to.throw('Context data is required')
    })

    it('does not register any channel handlers', () => {
      expect(() => createExperience(channelStub, undefined)).to.throw()
      expect(channelStub.addHandler).to.not.have.been.called // eslint-disable-line no-unused-expressions
    })
  })

  describe('when experienceInit is provided', () => {
    let experience: ReturnType<typeof createExperience>

    beforeEach(() => {
      experience = createExperience(channelStub, mockExperienceInit)
    })

    it('returns an object with context, onContextChanged, getUiMode, onUiModeChanged, and experience', () => {
      expect(experience).to.have.all.keys([
        'context',
        'onContextChanged',
        'getUiMode',
        'onUiModeChanged',
        'experience',
      ])
    })

    it('registers handlers for contextChanged, uiModeChanged, experienceChanged, selectionChanged, and dataAssemblyChanged', () => {
      expect(channelStub.addHandler).to.have.callCount(5)
      expect(channelStub.addHandler.getCall(0)).to.have.been.calledWith(
        'exo.contextChanged',
        sinon.match.func,
      )
      expect(channelStub.addHandler.getCall(1)).to.have.been.calledWith(
        'exo.uiModeChanged',
        sinon.match.func,
      )
      expect(channelStub.addHandler.getCall(2)).to.have.been.calledWith(
        'exo.experienceChanged',
        sinon.match.func,
      )
      expect(channelStub.addHandler.getCall(3)).to.have.been.calledWith(
        'exo.selectionChanged',
        sinon.match.func,
      )
      expect(channelStub.addHandler.getCall(4)).to.have.been.calledWith(
        'exo.dataAssemblyChanged',
        sinon.match.func,
      )
    })

    describe('.context', () => {
      it('defaults to { type: "experience", entityId: "" } when no context is provided', () => {
        expect(experience!.context).to.deep.equal({ type: 'experience', entityId: '' })
      })

      it('returns the provided context from experienceInit', () => {
        const experienceWithContext = createExperience(channelStub, {
          ...mockExperienceInit,
          context: { type: 'fragment', entityId: 'frag-123' },
        })
        expect(experienceWithContext!.context).to.deep.equal({
          type: 'fragment',
          entityId: 'frag-123',
        })
      })

      it('returns experience context when explicitly provided', () => {
        const experienceWithContext = createExperience(channelStub, {
          ...mockExperienceInit,
          context: { type: 'experience', entityId: 'exp-abc' },
        })
        expect(experienceWithContext!.context).to.deep.equal({
          type: 'experience',
          entityId: 'exp-abc',
        })
      })

      it('updates after exo.contextChanged is dispatched', () => {
        const contextChangedHandler = channelStub.addHandler.getCall(0).args[1]
        contextChangedHandler({ type: 'fragment', entityId: 'frag-new' })
        expect(experience!.context).to.deep.equal({ type: 'fragment', entityId: 'frag-new' })
      })
    })

    describe('.onContextChanged(cb)', () => {
      describeAttachHandlerMember('default behaviour', () => {
        return experience!.onContextChanged(() => {})
      })

      it('calls cb immediately with the initial context', () => {
        const cb = sinon.stub()
        experience!.onContextChanged(cb)
        expect(cb).to.have.been.calledOnceWith({ type: 'experience', entityId: '' })
      })

      it('calls cb when exo.contextChanged is dispatched', () => {
        const cb = sinon.stub()
        experience!.onContextChanged(cb)
        cb.resetHistory()

        const contextChangedHandler = channelStub.addHandler.getCall(0).args[1]
        contextChangedHandler({ type: 'fragment', entityId: 'frag-456' })

        expect(cb).to.have.been.calledOnceWith({ type: 'fragment', entityId: 'frag-456' })
      })

      it('does not call detached cb when exo.contextChanged is dispatched', () => {
        const cb = sinon.stub()
        const detach = experience!.onContextChanged(cb)
        cb.resetHistory()
        detach()

        const contextChangedHandler = channelStub.addHandler.getCall(0).args[1]
        contextChangedHandler({ type: 'fragment', entityId: 'frag-789' })

        expect(cb).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })
    })

    describe('.getUiMode()', () => {
      it('returns the initial uiMode from experienceInit', () => {
        expect(experience!.getUiMode()).to.equal('form')
      })

      it('returns "form" when no uiMode is provided in experienceInit', () => {
        const experienceNoMode = createExperience(channelStub, {
          experience: mockExperienceSnapshot,
        })
        expect(experienceNoMode!.getUiMode()).to.equal('form')
      })

      it('returns "visual" when uiMode is visual', () => {
        const experienceVisual = createExperience(channelStub, mockExperienceInitVisualMode)
        expect(experienceVisual!.getUiMode()).to.equal('visual')
      })

      it('updates after exo.uiModeChanged is dispatched', () => {
        const uiModeChangedHandler = channelStub.addHandler.getCall(1).args[1]
        uiModeChangedHandler({ mode: 'visual' })
        expect(experience!.getUiMode()).to.equal('visual')
      })
    })

    describe('.onUiModeChanged(cb)', () => {
      describeAttachHandlerMember('default behaviour', () => {
        return experience!.onUiModeChanged(() => {})
      })

      it('calls cb immediately with the initial uiMode', () => {
        const cb = sinon.stub()
        experience!.onUiModeChanged(cb)
        expect(cb).to.have.been.calledOnceWith('form')
      })

      it('calls cb when exo.uiModeChanged is dispatched', () => {
        const cb = sinon.stub()
        experience!.onUiModeChanged(cb)
        cb.resetHistory()

        const uiModeChangedHandler = channelStub.addHandler.getCall(1).args[1]
        uiModeChangedHandler({ mode: 'visual' })

        expect(cb).to.have.been.calledOnceWith('visual')
      })

      it('does not call detached cb when exo.uiModeChanged is dispatched', () => {
        const cb = sinon.stub()
        const detach = experience!.onUiModeChanged(cb)
        cb.resetHistory()
        detach()

        const uiModeChangedHandler = channelStub.addHandler.getCall(1).args[1]
        uiModeChangedHandler({ mode: 'visual' })

        expect(cb).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })
    })

    describe('.experience', () => {
      it('exposes get, onChange, getMetadata, setMetadata, save, publish, getNode, getRootNodes, selection, and dataAssembly', () => {
        expect(experience!.experience).to.have.all.keys([
          'get',
          'onChange',
          'getMetadata',
          'setMetadata',
          'save',
          'publish',
          'getNode',
          'getRootNodes',
          'selection',
          'dataAssembly',
        ])
      })

      describe('.get()', () => {
        it('returns the initial experience snapshot from experienceInit', () => {
          expect(experience!.experience.get()).to.deep.equal(mockExperienceSnapshot)
        })

        it('returns a default snapshot when no experience is provided in experienceInit', () => {
          const experienceNoExp = createExperience(channelStub, { uiMode: 'form' })
          const snapshot = experienceNoExp!.experience.get()
          expect(snapshot.sys.type).to.equal('Experience')
          expect(snapshot.sys.id).to.equal('')
          expect(snapshot.sys.version).to.equal(0)
        })

        it('returns the updated snapshot after exo.experienceChanged is dispatched', () => {
          const updatedSnapshot = {
            sys: { id: 'exp-456', type: 'Experience' as const, version: 2 },
          }
          const experienceChangedHandler = channelStub.addHandler.getCall(2).args[1]
          experienceChangedHandler(updatedSnapshot)
          expect(experience!.experience.get()).to.deep.equal(updatedSnapshot)
        })
      })

      describe('.onChange(cb)', () => {
        describeAttachHandlerMember('default behaviour', () => {
          return experience!.experience.onChange(() => {})
        })

        it('calls cb immediately with the initial experience snapshot', () => {
          const cb = sinon.stub()
          experience!.experience.onChange(cb)
          expect(cb).to.have.been.calledOnceWith(mockExperienceSnapshot)
        })

        it('calls cb when exo.experienceChanged is dispatched', () => {
          const cb = sinon.stub()
          experience!.experience.onChange(cb)
          cb.resetHistory()

          const updatedSnapshot = {
            sys: { id: 'exp-789', type: 'Experience' as const, version: 3 },
          }
          const experienceChangedHandler = channelStub.addHandler.getCall(2).args[1]
          experienceChangedHandler(updatedSnapshot)

          expect(cb).to.have.been.calledOnceWith(updatedSnapshot)
        })

        it('does not call detached cb when exo.experienceChanged is dispatched', () => {
          const cb = sinon.stub()
          const detach = experience!.experience.onChange(cb)
          cb.resetHistory()
          detach()

          const experienceChangedHandler = channelStub.addHandler.getCall(2).args[1]
          experienceChangedHandler({
            sys: { id: 'exp-999', type: 'Experience' as const, version: 4 },
          })

          expect(cb).to.not.have.been.called // eslint-disable-line no-unused-expressions
        })
      })

      describe('.save()', () => {
        it('calls channel.call with "exo.saveExperience"', () => {
          experience!.experience.save()
          expect(channelStub.call).to.have.been.calledWith('exo.saveExperience')
        })

        it('returns the promise from channel.call', () => {
          const expectedPromise = Promise.resolve()
          channelStub.call.withArgs('exo.saveExperience').returns(expectedPromise)
          expect(experience!.experience.save()).to.equal(expectedPromise)
        })
      })

      describe('.publish()', () => {
        it('calls channel.call with "exo.publishExperience"', () => {
          experience!.experience.publish()
          expect(channelStub.call).to.have.been.calledWith('exo.publishExperience')
        })

        it('returns the promise from channel.call', () => {
          const expectedPromise = Promise.resolve()
          channelStub.call.withArgs('exo.publishExperience').returns(expectedPromise)
          expect(experience!.experience.publish()).to.equal(expectedPromise)
        })
      })

      describe('.getMetadata()', () => {
        it('returns an empty object when the snapshot carries no metadata', () => {
          expect(experience!.experience.getMetadata()).to.deep.equal({})
        })

        it('returns the metadata from the current snapshot', () => {
          const metadata = {
            tags: [{ sys: { type: 'Link' as const, linkType: 'Tag' as const, id: 'tag-1' } }],
            concepts: [
              { sys: { type: 'Link' as const, linkType: 'TaxonomyConcept' as const, id: 'c-1' } },
            ],
            name: 'Homepage hero',
          }
          const experienceChangedHandler = channelStub.addHandler.getCall(2).args[1]
          experienceChangedHandler({
            sys: { id: 'exp-456', type: 'Experience' as const, version: 2 },
            metadata,
          })
          expect(experience!.experience.getMetadata()).to.deep.equal(metadata)
        })
      })

      describe('.setMetadata(patch)', () => {
        it('calls channel.call with "exo.setExperienceMetadata" and the patch', () => {
          const patch = { name: 'Renamed' }
          experience!.experience.setMetadata(patch)
          expect(channelStub.call).to.have.been.calledWith('exo.setExperienceMetadata', patch)
        })

        it('returns the promise from channel.call', () => {
          const expectedPromise = Promise.resolve()
          channelStub.call.withArgs('exo.setExperienceMetadata').returns(expectedPromise)
          expect(experience!.experience.setMetadata({ tags: [] })).to.equal(expectedPromise)
        })
      })

      describe('.getNode(nodeId)', () => {
        const nodeId = 'node-abc'
        let node: ReturnType<typeof experience.experience.getNode>

        beforeEach(() => {
          node = experience!.experience.getNode(nodeId)
        })

        it('returns an ExperienceNodeAPI object with the correct shape', () => {
          expect(node).to.have.all.keys([
            'id',
            'nodeType',
            'get',
            'onChange',
            'dataAssembly',
            'getDesignProperty',
            'setDesignProperty',
            'onDesignPropertyChanged',
            'getProperties',
            'getSlotDescriptor',
          ])
        })

        it('has id equal to the provided nodeId', () => {
          expect(node!.id).to.equal(nodeId)
        })

        it('has nodeType defaulting to "Component"', () => {
          expect(node!.nodeType).to.equal('Component')
        })

        it('returns the same cached instance for repeated calls and does not leak handlers', () => {
          const callsBefore = channelStub.addHandler.callCount
          const again = experience!.experience.getNode(nodeId)
          expect(again).to.equal(node)
          // No additional exo.nodeChanged.<id> handler registered on the second call.
          expect(channelStub.addHandler.callCount).to.equal(callsBefore)
        })

        describe('.dataAssembly.getParameterDefinitions()', () => {
          it('calls channel.call with the node-scoped channel and nodeId', () => {
            node!.dataAssembly.getParameterDefinitions()
            expect(channelStub.call).to.have.been.calledWith(
              'exo.getNodeParameterDefinitions',
              nodeId,
            )
          })
        })

        describe('.dataAssembly.getParameterDefinition(parameterId)', () => {
          it('calls channel.call with the node-scoped channel, nodeId, and parameterId', () => {
            node!.dataAssembly.getParameterDefinition('heroEntry')
            expect(channelStub.call).to.have.been.calledWith(
              'exo.getNodeParameterDefinition',
              nodeId,
              'heroEntry',
            )
          })
        })

        describe('.dataAssembly.setParameterValue(parameterId, value)', () => {
          it('calls channel.call with the node-scoped channel, nodeId, parameterId, and value', () => {
            const value = {
              sys: {
                type: 'ResourceLink' as const,
                linkType: 'Contentful:Entry' as const,
                urn: 'urn',
              },
            }
            node!.dataAssembly.setParameterValue('heroEntry', value)
            expect(channelStub.call).to.have.been.calledWith(
              'exo.setNodeParameterValue',
              nodeId,
              'heroEntry',
              value,
            )
          })
        })

        describe('.getDesignProperty(key)', () => {
          it('calls channel.call with the correct arguments', () => {
            node!.getDesignProperty('backgroundColor')
            expect(channelStub.call).to.have.been.calledWith(
              'exo.getNodeDesignProperty',
              nodeId,
              'backgroundColor',
            )
          })
        })

        describe('.setDesignProperty(key, value)', () => {
          it('calls channel.call with the correct arguments', () => {
            const value = { type: 'ManualDesignValue' as const, value: '#fff' }
            node!.setDesignProperty('backgroundColor', value)
            expect(channelStub.call).to.have.been.calledWith(
              'exo.setNodeDesignProperty',
              nodeId,
              'backgroundColor',
              value,
            )
          })
        })
      })

      describe('.selection', () => {
        it('exposes get, onChange, set, and highlight', () => {
          expect(experience!.experience.selection).to.have.all.keys([
            'get',
            'onChange',
            'set',
            'highlight',
          ])
        })

        describe('.get()', () => {
          it('returns { nodeId: null } initially (nothing selected)', () => {
            expect(experience!.experience.selection.get()).to.deep.equal({ nodeId: null })
          })

          it('returns the updated selection after exo.selectionChanged is dispatched', () => {
            const selectionChangedHandler = channelStub.addHandler.getCall(3).args[1]
            selectionChangedHandler({ nodeId: 'node-xyz', nodeType: 'Component' })
            expect(experience!.experience.selection.get()).to.deep.equal({
              nodeId: 'node-xyz',
              nodeType: 'Component',
            })
          })
        })

        describe('.onChange(cb)', () => {
          describeAttachHandlerMember('default behaviour', () => {
            return experience!.experience.selection.onChange(() => {})
          })

          it('calls cb immediately with { nodeId: null } (initial selection)', () => {
            const cb = sinon.stub()
            experience!.experience.selection.onChange(cb)
            expect(cb).to.have.been.calledOnceWith({ nodeId: null })
          })

          it('calls cb when exo.selectionChanged is dispatched', () => {
            const cb = sinon.stub()
            experience!.experience.selection.onChange(cb)
            cb.resetHistory()

            const selectionChangedHandler = channelStub.addHandler.getCall(3).args[1]
            selectionChangedHandler({ nodeId: 'node-xyz', nodeType: 'Component' })

            expect(cb).to.have.been.calledOnceWith({ nodeId: 'node-xyz', nodeType: 'Component' })
          })

          it('calls cb with { nodeId: null } when selection is cleared', () => {
            const cb = sinon.stub()
            experience!.experience.selection.onChange(cb)
            cb.resetHistory()

            const selectionChangedHandler = channelStub.addHandler.getCall(3).args[1]
            selectionChangedHandler({ nodeId: null })

            expect(cb).to.have.been.calledOnceWith({ nodeId: null })
          })
        })

        describe('.set(nodeId)', () => {
          it('sends "exo.setSelection" to channel with the nodeId', () => {
            experience!.experience.selection.set('node-abc')
            expect(channelStub.send).to.have.been.calledWith('exo.setSelection', {
              nodeId: 'node-abc',
            })
          })

          it('accepts null to clear the selection', () => {
            experience!.experience.selection.set(null)
            expect(channelStub.send).to.have.been.calledWith('exo.setSelection', { nodeId: null })
          })
        })

        describe('.highlight(nodeId)', () => {
          it('sends "exo.highlightNode" to channel with the nodeId', () => {
            experience!.experience.selection.highlight('node-abc')
            expect(channelStub.send).to.have.been.calledWith('exo.highlightNode', {
              nodeId: 'node-abc',
            })
          })

          it('forwards flash and scrollIntoView options to channel', () => {
            experience!.experience.selection.highlight('node-abc', {
              flash: true,
              scrollIntoView: true,
            })
            expect(channelStub.send).to.have.been.calledWith('exo.highlightNode', {
              nodeId: 'node-abc',
              flash: true,
              scrollIntoView: true,
            })
          })
        })
      })

      describe('.dataAssembly', () => {
        it('exposes get, getAvailable, onChange, and the parameter definition/value methods', () => {
          expect(experience!.experience.dataAssembly).to.have.all.keys([
            'get',
            'getAvailable',
            'onChange',
            'getParameterDefinitions',
            'getParameterDefinition',
            'setParameterValue',
            'setParameterValues',
          ])
        })

        describe('.get()', () => {
          it('returns the initial empty DataAssemblySnapshot', () => {
            const snapshot = experience!.experience.dataAssembly.get()
            expect(snapshot.id).to.equal('')
            expect(snapshot.parameters).to.deep.equal({})
          })

          it('returns the updated snapshot after exo.dataAssemblyChanged is dispatched', () => {
            const updatedSnapshot = {
              id: 'da-123',
              name: 'My Assembly',
              parameters: {},
            }
            const dataAssemblyChangedHandler = channelStub.addHandler.getCall(4).args[1]
            dataAssemblyChangedHandler(updatedSnapshot)
            expect(experience!.experience.dataAssembly.get()).to.deep.equal(updatedSnapshot)
          })
        })

        describe('.onChange(cb)', () => {
          describeAttachHandlerMember('default behaviour', () => {
            return experience!.experience.dataAssembly.onChange(() => {})
          })

          it('calls cb immediately with the initial snapshot', () => {
            const cb = sinon.stub()
            experience!.experience.dataAssembly.onChange(cb)
            expect(cb).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
            expect(cb.firstCall.args[0]).to.deep.equal({ id: '', parameters: {} })
          })

          it('calls cb when exo.dataAssemblyChanged is dispatched', () => {
            const cb = sinon.stub()
            experience!.experience.dataAssembly.onChange(cb)
            cb.resetHistory()

            const updatedSnapshot = { id: 'da-456', parameters: {} }
            const dataAssemblyChangedHandler = channelStub.addHandler.getCall(4).args[1]
            dataAssemblyChangedHandler(updatedSnapshot)

            expect(cb).to.have.been.calledOnceWith(updatedSnapshot)
          })
        })

        describe('.getAvailable()', () => {
          it('calls channel.call with "exo.getAvailableDataAssemblies"', () => {
            experience!.experience.dataAssembly.getAvailable()
            expect(channelStub.call).to.have.been.calledWith('exo.getAvailableDataAssemblies')
          })
        })

        describe('.getParameterDefinitions()', () => {
          it('calls channel.call with "exo.getDataAssemblyParameterDefinitions"', () => {
            experience!.experience.dataAssembly.getParameterDefinitions()
            expect(channelStub.call).to.have.been.calledWith(
              'exo.getDataAssemblyParameterDefinitions',
            )
          })
        })

        describe('.getParameterDefinition(parameterId)', () => {
          it('calls channel.call with "exo.getDataAssemblyParameterDefinition" and the parameterId', () => {
            experience!.experience.dataAssembly.getParameterDefinition('param-1')
            expect(channelStub.call).to.have.been.calledWith(
              'exo.getDataAssemblyParameterDefinition',
              'param-1',
            )
          })
        })

        describe('.setParameterValue(parameterId, value)', () => {
          it('calls channel.call with the correct arguments', () => {
            const value = {
              sys: {
                type: 'ResourceLink' as const,
                linkType: 'Contentful:Entry' as const,
                urn: 'crn:contentful:::content:spaces/sp/entries/entry-1',
              },
            }
            experience!.experience.dataAssembly.setParameterValue('param-1', value)
            expect(channelStub.call).to.have.been.calledWith(
              'exo.setDataAssemblyParameterValue',
              'param-1',
              value,
            )
          })
        })

        describe('.setParameterValues(updates)', () => {
          it('calls channel.call with the correct arguments', () => {
            const updates = {
              'param-1': {
                sys: {
                  type: 'ResourceLink' as const,
                  linkType: 'Contentful:Entry' as const,
                  urn: 'crn:contentful:::content:spaces/sp/entries/entry-1',
                },
              },
            }
            experience!.experience.dataAssembly.setParameterValues(updates)
            expect(channelStub.call).to.have.been.calledWith(
              'exo.setDataAssemblyParameterValues',
              updates,
            )
          })
        })
      })
    })
  })
})
