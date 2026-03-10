import { describeAttachHandlerMember, sinon, expect } from '../helpers'

import createExo from '../../lib/exo'
import { Channel } from '../../lib/channel'
import { mockExoInit, mockExoInitVisualMode, mockExperienceSnapshot } from '../mocks/exo'

describe('createExo()', () => {
  let channelStub: any

  beforeEach(() => {
    channelStub = {
      addHandler: sinon.stub(),
      call: sinon.stub().resolves(undefined),
      send: sinon.stub(),
    } as unknown as Channel
  })

  describe('when exoInit is undefined', () => {
    it('returns undefined', () => {
      expect(createExo(channelStub, undefined)).to.be.undefined // eslint-disable-line no-unused-expressions
    })

    it('does not register any channel handlers', () => {
      createExo(channelStub, undefined)
      expect(channelStub.addHandler).to.not.have.been.called // eslint-disable-line no-unused-expressions
    })
  })

  describe('when exoInit is provided', () => {
    let exo: ReturnType<typeof createExo>

    beforeEach(() => {
      exo = createExo(channelStub, mockExoInit)
    })

    it('returns an object with getUiMode, onUiModeChanged, and experience', () => {
      expect(exo).to.have.all.keys(['getUiMode', 'onUiModeChanged', 'experience'])
    })

    it('registers handlers for uiModeChanged, experienceChanged, selectionChanged, and dataAssemblyChanged', () => {
      expect(channelStub.addHandler).to.have.callCount(4)
      expect(channelStub.addHandler.getCall(0)).to.have.been.calledWith(
        'exo.uiModeChanged',
        sinon.match.func,
      )
      expect(channelStub.addHandler.getCall(1)).to.have.been.calledWith(
        'exo.experienceChanged',
        sinon.match.func,
      )
      expect(channelStub.addHandler.getCall(2)).to.have.been.calledWith(
        'exo.selectionChanged',
        sinon.match.func,
      )
      expect(channelStub.addHandler.getCall(3)).to.have.been.calledWith(
        'exo.dataAssemblyChanged',
        sinon.match.func,
      )
    })

    describe('.getUiMode()', () => {
      it('returns the initial uiMode from exoInit', () => {
        expect(exo!.getUiMode()).to.equal('form')
      })

      it('returns "form" when no uiMode is provided in exoInit', () => {
        const exoNoMode = createExo(channelStub, { experience: mockExperienceSnapshot })
        expect(exoNoMode!.getUiMode()).to.equal('form')
      })

      it('returns "visual" when uiMode is visual', () => {
        const exoVisual = createExo(channelStub, mockExoInitVisualMode)
        expect(exoVisual!.getUiMode()).to.equal('visual')
      })

      it('updates after exo.uiModeChanged is dispatched', () => {
        const uiModeChangedHandler = channelStub.addHandler.getCall(0).args[1]
        uiModeChangedHandler({ mode: 'visual' })
        expect(exo!.getUiMode()).to.equal('visual')
      })
    })

    describe('.onUiModeChanged(cb)', () => {
      describeAttachHandlerMember('default behaviour', () => {
        return exo!.onUiModeChanged(() => {})
      })

      it('calls cb immediately with the initial uiMode', () => {
        const cb = sinon.stub()
        exo!.onUiModeChanged(cb)
        expect(cb).to.have.been.calledOnceWith('form')
      })

      it('calls cb when exo.uiModeChanged is dispatched', () => {
        const cb = sinon.stub()
        exo!.onUiModeChanged(cb)
        cb.resetHistory()

        const uiModeChangedHandler = channelStub.addHandler.getCall(0).args[1]
        uiModeChangedHandler({ mode: 'visual' })

        expect(cb).to.have.been.calledOnceWith('visual')
      })

      it('does not call detached cb when exo.uiModeChanged is dispatched', () => {
        const cb = sinon.stub()
        const detach = exo!.onUiModeChanged(cb)
        cb.resetHistory()
        detach()

        const uiModeChangedHandler = channelStub.addHandler.getCall(0).args[1]
        uiModeChangedHandler({ mode: 'visual' })

        expect(cb).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })
    })

    describe('.experience', () => {
      it('exposes get, onChange, save, publish, getNode, getRootNodes, selection, and dataAssembly', () => {
        expect(exo!.experience).to.have.all.keys([
          'get',
          'onChange',
          'save',
          'publish',
          'getNode',
          'getRootNodes',
          'selection',
          'dataAssembly',
        ])
      })

      describe('.get()', () => {
        it('returns the initial experience snapshot from exoInit', () => {
          expect(exo!.experience.get()).to.deep.equal(mockExperienceSnapshot)
        })

        it('returns a default snapshot when no experience is provided in exoInit', () => {
          const exoNoExp = createExo(channelStub, { uiMode: 'form' })
          const snapshot = exoNoExp!.experience.get()
          expect(snapshot.sys.type).to.equal('Experience')
          expect(snapshot.sys.id).to.equal('')
          expect(snapshot.sys.version).to.equal(0)
        })

        it('returns the updated snapshot after exo.experienceChanged is dispatched', () => {
          const updatedSnapshot = {
            sys: { id: 'exp-456', type: 'Experience' as const, version: 2 },
          }
          const experienceChangedHandler = channelStub.addHandler.getCall(1).args[1]
          experienceChangedHandler(updatedSnapshot)
          expect(exo!.experience.get()).to.deep.equal(updatedSnapshot)
        })
      })

      describe('.onChange(cb)', () => {
        describeAttachHandlerMember('default behaviour', () => {
          return exo!.experience.onChange(() => {})
        })

        it('calls cb immediately with the initial experience snapshot', () => {
          const cb = sinon.stub()
          exo!.experience.onChange(cb)
          expect(cb).to.have.been.calledOnceWith(mockExperienceSnapshot)
        })

        it('calls cb when exo.experienceChanged is dispatched', () => {
          const cb = sinon.stub()
          exo!.experience.onChange(cb)
          cb.resetHistory()

          const updatedSnapshot = {
            sys: { id: 'exp-789', type: 'Experience' as const, version: 3 },
          }
          const experienceChangedHandler = channelStub.addHandler.getCall(1).args[1]
          experienceChangedHandler(updatedSnapshot)

          expect(cb).to.have.been.calledOnceWith(updatedSnapshot)
        })

        it('does not call detached cb when exo.experienceChanged is dispatched', () => {
          const cb = sinon.stub()
          const detach = exo!.experience.onChange(cb)
          cb.resetHistory()
          detach()

          const experienceChangedHandler = channelStub.addHandler.getCall(1).args[1]
          experienceChangedHandler({
            sys: { id: 'exp-999', type: 'Experience' as const, version: 4 },
          })

          expect(cb).to.not.have.been.called // eslint-disable-line no-unused-expressions
        })
      })

      describe('.save()', () => {
        it('calls channel.call with "exo.saveExperience"', () => {
          exo!.experience.save()
          expect(channelStub.call).to.have.been.calledWith('exo.saveExperience')
        })

        it('returns the promise from channel.call', () => {
          const expectedPromise = Promise.resolve()
          channelStub.call.withArgs('exo.saveExperience').returns(expectedPromise)
          expect(exo!.experience.save()).to.equal(expectedPromise)
        })
      })

      describe('.publish()', () => {
        it('calls channel.call with "exo.publishExperience"', () => {
          exo!.experience.publish()
          expect(channelStub.call).to.have.been.calledWith('exo.publishExperience')
        })

        it('returns the promise from channel.call', () => {
          const expectedPromise = Promise.resolve()
          channelStub.call.withArgs('exo.publishExperience').returns(expectedPromise)
          expect(exo!.experience.publish()).to.equal(expectedPromise)
        })
      })

      describe('.getNode(nodeId)', () => {
        const nodeId = 'node-abc'
        let node: ReturnType<typeof exo.experience.getNode>

        beforeEach(() => {
          node = exo!.experience.getNode(nodeId)
        })

        it('returns an ExoNodeAPI object with the correct shape', () => {
          expect(node).to.have.all.keys([
            'id',
            'nodeType',
            'get',
            'onChange',
            'getContentProperty',
            'setContentProperty',
            'onContentPropertyChanged',
            'getDesignProperty',
            'setDesignProperty',
            'onDesignPropertyChanged',
            'getProperties',
            'updateProperty',
            'getBinding',
            'setBinding',
            'getBindingMetadata',
            'resolveEntryBinding',
            'getSlotDescriptor',
          ])
        })

        it('has id equal to the provided nodeId', () => {
          expect(node!.id).to.equal(nodeId)
        })

        it('has nodeType defaulting to "component"', () => {
          expect(node!.nodeType).to.equal('component')
        })

        describe('.getContentProperty(key)', () => {
          it('calls channel.call with the correct arguments', () => {
            node!.getContentProperty('title')
            expect(channelStub.call).to.have.been.calledWith(
              'exo.getNodeContentProperty',
              nodeId,
              'title',
            )
          })

          it('returns the promise from channel.call', () => {
            const expectedPromise = Promise.resolve({
              key: 'title',
              area: 'content' as const,
              value: 'Hello',
            })
            channelStub.call.withArgs('exo.getNodeContentProperty').returns(expectedPromise)
            expect(node!.getContentProperty('title')).to.equal(expectedPromise)
          })
        })

        describe('.setContentProperty(key, value)', () => {
          it('calls channel.call with the correct arguments', () => {
            node!.setContentProperty('title', 'New Title')
            expect(channelStub.call).to.have.been.calledWith(
              'exo.setNodeContentProperty',
              nodeId,
              'title',
              'New Title',
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
            node!.setDesignProperty('backgroundColor', '#fff')
            expect(channelStub.call).to.have.been.calledWith(
              'exo.setNodeDesignProperty',
              nodeId,
              'backgroundColor',
              '#fff',
            )
          })
        })
      })

      describe('.selection', () => {
        it('exposes get, onChange, set, and highlight', () => {
          expect(exo!.experience.selection).to.have.all.keys([
            'get',
            'onChange',
            'set',
            'highlight',
          ])
        })

        describe('.get()', () => {
          it('returns { nodeId: null } initially (nothing selected)', () => {
            expect(exo!.experience.selection.get()).to.deep.equal({ nodeId: null })
          })

          it('returns the updated selection after exo.selectionChanged is dispatched', () => {
            const selectionChangedHandler = channelStub.addHandler.getCall(2).args[1]
            selectionChangedHandler({ nodeId: 'node-xyz', nodeType: 'component' })
            expect(exo!.experience.selection.get()).to.deep.equal({
              nodeId: 'node-xyz',
              nodeType: 'component',
            })
          })
        })

        describe('.onChange(cb)', () => {
          describeAttachHandlerMember('default behaviour', () => {
            return exo!.experience.selection.onChange(() => {})
          })

          it('calls cb immediately with { nodeId: null } (initial selection)', () => {
            const cb = sinon.stub()
            exo!.experience.selection.onChange(cb)
            expect(cb).to.have.been.calledOnceWith({ nodeId: null })
          })

          it('calls cb when exo.selectionChanged is dispatched', () => {
            const cb = sinon.stub()
            exo!.experience.selection.onChange(cb)
            cb.resetHistory()

            const selectionChangedHandler = channelStub.addHandler.getCall(2).args[1]
            selectionChangedHandler({ nodeId: 'node-xyz', nodeType: 'component' })

            expect(cb).to.have.been.calledOnceWith({ nodeId: 'node-xyz', nodeType: 'component' })
          })

          it('calls cb with { nodeId: null } when selection is cleared', () => {
            const cb = sinon.stub()
            exo!.experience.selection.onChange(cb)
            cb.resetHistory()

            const selectionChangedHandler = channelStub.addHandler.getCall(2).args[1]
            selectionChangedHandler({ nodeId: null })

            expect(cb).to.have.been.calledOnceWith({ nodeId: null })
          })
        })

        describe('.set(nodeId)', () => {
          it('sends "exo.setSelection" to channel with the nodeId', () => {
            exo!.experience.selection.set('node-abc')
            expect(channelStub.send).to.have.been.calledWith('exo.setSelection', {
              nodeId: 'node-abc',
            })
          })

          it('accepts null to clear the selection', () => {
            exo!.experience.selection.set(null)
            expect(channelStub.send).to.have.been.calledWith('exo.setSelection', { nodeId: null })
          })
        })

        describe('.highlight(nodeId)', () => {
          it('sends "exo.highlightNode" to channel with the nodeId', () => {
            exo!.experience.selection.highlight('node-abc')
            expect(channelStub.send).to.have.been.calledWith('exo.highlightNode', {
              nodeId: 'node-abc',
            })
          })

          it('forwards flash and scrollIntoView options to channel', () => {
            exo!.experience.selection.highlight('node-abc', { flash: true, scrollIntoView: true })
            expect(channelStub.send).to.have.been.calledWith('exo.highlightNode', {
              nodeId: 'node-abc',
              flash: true,
              scrollIntoView: true,
            })
          })
        })
      })

      describe('.dataAssembly', () => {
        it('exposes get, onChange, getParameters, getParameter, getEntryBindings, setParameter, setParameters', () => {
          expect(exo!.experience.dataAssembly).to.have.all.keys([
            'get',
            'onChange',
            'getParameters',
            'getParameter',
            'getEntryBindings',
            'setParameter',
            'setParameters',
          ])
        })

        describe('.get()', () => {
          it('returns the initial empty DataAssemblySnapshot', () => {
            const snapshot = exo!.experience.dataAssembly.get()
            expect(snapshot.id).to.equal('')
            expect(snapshot.parameters).to.deep.equal({})
          })

          it('returns the updated snapshot after exo.dataAssemblyChanged is dispatched', () => {
            const updatedSnapshot = {
              id: 'da-123',
              name: 'My Assembly',
              parameters: {},
            }
            const dataAssemblyChangedHandler = channelStub.addHandler.getCall(3).args[1]
            dataAssemblyChangedHandler(updatedSnapshot)
            expect(exo!.experience.dataAssembly.get()).to.deep.equal(updatedSnapshot)
          })
        })

        describe('.onChange(cb)', () => {
          describeAttachHandlerMember('default behaviour', () => {
            return exo!.experience.dataAssembly.onChange(() => {})
          })

          it('calls cb immediately with the initial snapshot', () => {
            const cb = sinon.stub()
            exo!.experience.dataAssembly.onChange(cb)
            expect(cb).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
            expect(cb.firstCall.args[0]).to.deep.equal({ id: '', parameters: {} })
          })

          it('calls cb when exo.dataAssemblyChanged is dispatched', () => {
            const cb = sinon.stub()
            exo!.experience.dataAssembly.onChange(cb)
            cb.resetHistory()

            const updatedSnapshot = { id: 'da-456', parameters: {} }
            const dataAssemblyChangedHandler = channelStub.addHandler.getCall(3).args[1]
            dataAssemblyChangedHandler(updatedSnapshot)

            expect(cb).to.have.been.calledOnceWith(updatedSnapshot)
          })
        })

        describe('.getParameters()', () => {
          it('calls channel.call with "exo.getDataAssemblyParameters"', () => {
            exo!.experience.dataAssembly.getParameters()
            expect(channelStub.call).to.have.been.calledWith('exo.getDataAssemblyParameters')
          })
        })

        describe('.getParameter(parameterId)', () => {
          it('calls channel.call with "exo.getDataAssemblyParameter" and the parameterId', () => {
            exo!.experience.dataAssembly.getParameter('param-1')
            expect(channelStub.call).to.have.been.calledWith(
              'exo.getDataAssemblyParameter',
              'param-1',
            )
          })
        })

        describe('.getEntryBindings()', () => {
          it('calls channel.call with "exo.getDataAssemblyEntryBindings"', () => {
            exo!.experience.dataAssembly.getEntryBindings()
            expect(channelStub.call).to.have.been.calledWith('exo.getDataAssemblyEntryBindings')
          })
        })

        describe('.setParameter(parameterId, value)', () => {
          it('calls channel.call with the correct arguments', () => {
            const value = {
              sys: { type: 'Link' as const, linkType: 'Entry' as const, id: 'entry-1' },
            }
            exo!.experience.dataAssembly.setParameter('param-1', value)
            expect(channelStub.call).to.have.been.calledWith(
              'exo.setDataAssemblyParameter',
              'param-1',
              value,
            )
          })
        })

        describe('.setParameters(updates)', () => {
          it('calls channel.call with the correct arguments', () => {
            const updates = {
              'param-1': {
                sys: { type: 'Link' as const, linkType: 'Entry' as const, id: 'entry-1' },
              },
            }
            exo!.experience.dataAssembly.setParameters(updates)
            expect(channelStub.call).to.have.been.calledWith(
              'exo.setDataAssemblyParameters',
              updates,
            )
          })
        })
      })
    })
  })
})
