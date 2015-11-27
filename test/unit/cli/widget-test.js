'use strict';

var sinon = require('sinon');
var Bluebird = require('bluebird');
var _ = require('lodash');

var expect = require('../../helper').expect;
var Widget = require('../../../lib/cli/widget');

function buildWidgetPayload (options) {
  var widget = {};
  _.extend(widget, _.pick(options, ['src', 'srcdoc', 'fieldTypes']));

  if (options.fieldTypes) {
    widget.fieldTypes = [];

    options.fieldTypes.forEach(function (fieldType) {
      if (fieldType === 'Entries') {
        widget.fieldTypes.push({type: 'Array', items: {type: 'Link', linkType: 'Entry'}});
        return;
      }

      if (fieldType === 'Assets') {
        widget.fieldTypes.push({type: 'Array', items: {type: 'Link', linkType: 'Asset'}});
        return;
      }

      if (fieldType === 'Symbols') {
        widget.fieldTypes.push({type: 'Array', items: {type: 'Symbol'}});
        return;
      }

      if (fieldType === 'Entry' || fieldType === 'Asset') {
        widget.fieldTypes.push({type: 'Link', linkType: fieldType});
        return;
      }

      widget.fieldTypes.push({type: fieldType});
    });
  }

  return {widget: widget};
}

describe('Widget', function () {
  let context, options, widget, http;
  beforeEach(function () {
    http = {
      post: sinon.stub().returns(Bluebird.resolve()),
      get: sinon.stub().returns(Bluebird.resolve()),
      delete: sinon.stub().returns(Bluebird.resolve()),
      put: sinon.stub().returns(Bluebird.resolve())
    };

    context = {http: http};
  });

  describe('#save', function () {
    describe('when an id has been provided', function () {
      beforeEach(function () {
        options = {
          spaceId: 123,
          src: 'the-src',
          id: 456
        };

        widget = new Widget(options, context);
      });

      it('it calls the http.put method with the expected arguments', function () {
        let payload = buildWidgetPayload({src: options.src});

        return widget.save().then(function () {
          expect(http.put).to.have.been.calledWith(
            {
              spaceId: options.spaceId,
              payload: payload,
              id: options.id
            },
            context
          );
        });
      });

      describe('when a version has been provided', function () {
        it('it calls the http.put method including the version', function () {
          let payload = buildWidgetPayload({src: options.src});
          options = _.extend(options, {version: 66});

          return widget.save().then(function () {
            expect(http.put).to.have.been.calledWith(
              {
                spaceId: options.spaceId,
                payload: payload,
                id: options.id,
                version: options.version
              },
              context
            );
          });
        });
      });
    });

    describe('when a srcdoc has been provided', function () {
      beforeEach(function () {
        options = {
          spaceId: 123,
          srcdoc: 'the-bundle'
        };

        widget = new Widget(options, context);
      });

      it('it saves a widget with the srcdoc property set', function () {
        let payload = buildWidgetPayload({srcdoc: options.srcdoc});

        return widget.save().then(function () {
          expect(http.post).to.have.been.calledWith(
            {
              spaceId: options.spaceId,
              payload: payload
            },
            context
          );
        });
      });
    });

    describe('when a URL has been provided', function () {
      beforeEach(function () {
        options = {
          spaceId: 123,
          src: 'the-url'
        };

        widget = new Widget(options, context);
      });

      it('it saves a widget with the src property set', function () {
        let payload = buildWidgetPayload({src: options.src});

        return widget.save().then(function () {
          expect(http.post).to.have.been.calledWith(
            {
              spaceId: options.spaceId,
              payload: payload
            },
            context
          );
        });
      });
    });

    describe('when fieldTypes have been provided', function () {
      beforeEach(function () {
        options = {
          spaceId: 123,
          src: 'the-url'
        };
      });

      [
        'Symbol', 'Text', 'Date', 'Integer', 'Number', 'Location', 'Boolean', 'Object',
        'Entry', 'Asset', 'Symbols', 'Assets', 'Entries'
      ].forEach(function (fieldType) {
        it(`saves the widget with the fieldType ${fieldType}`, function () {
          options.fieldTypes = [fieldType];
          let payload = buildWidgetPayload(options);

          widget = new Widget(options, context);

          return widget.save().then(function () {
            expect(http.post).to.have.been.calledWith(
              {
                spaceId: options.spaceId,
                payload: payload
              },
              context
            );
          });
        });
      });

      it('saves the widget with multiple fieldTypes', function () {
        options.fieldTypes = ['Symbol', 'Date', 'Symbols', 'Asset', 'Entries'];

        let payload = buildWidgetPayload(options);

        widget = new Widget(options, context);

        return widget.save().then(function () {
          expect(http.post).to.have.been.calledWith(
            {
              spaceId: options.spaceId,
              payload: payload
            },
            context
          );
        });
      });

      it('saves the widget with multiple fieldTypes (capitalizes lowercase)', function () {
        options.fieldTypes = ['symbol', 'entries'];

        widget = new Widget(options, context);

        return widget.save().then(function () {
          expect(http.post).to.have.been.calledWith(
            {
              spaceId: options.spaceId,
              payload: {
                widget: {
                  src: 'the-url',
                  fieldTypes: [
                    {type: 'Symbol'},
                    {type: 'Array', items: {type: 'Link', linkType: 'Entry'}}
                  ]
                }
              }
            },
            context
          );
        });
      });
    });
  });

  describe('#read', function () {
    beforeEach(function () {
      options = {
        spaceId: 123,
        id: 456
      };

      widget = new Widget(options, context);
    });

    it('calls the http module with the expected arguments', function () {
      return widget.read().then(function () {
        expect(http.get).to.have.been.calledWith(
          {
            spaceId: options.spaceId,
            id: options.id
          },
          context
        );
      });
    });
  });

  describe('#delete', function () {
    beforeEach(function () {
      options = {
        spaceId: 123,
        id: 456
      };

      widget = new Widget(options, context);
    });

    it('calls the http module with the expected arguments', function () {
      return widget.delete().then(function () {
        expect(http.delete).to.have.been.calledWith(
          {
            spaceId: options.spaceId,
            id: options.id
          },
          context
        );
      });
    });

    it('returns the return value from the http.delete method', function () {
      http.delete.returns(Bluebird.resolve('delete-response'));

      return widget.delete().then(function (response) {
        expect(response).to.eql('delete-response');
      });
    });
  });
});
