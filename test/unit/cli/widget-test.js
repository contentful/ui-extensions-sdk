'use strict';

var sinon = require('sinon');
var Bluebird = require('bluebird');
var _ = require('lodash');

var expect = require('../../helper').expect;
var Widget = require('../../../lib/cli/widget');

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
        return widget.save().then(function () {
          expect(http.put).to.have.been.calledWith(
            {
              spaceId: options.spaceId,
              payload: {src: options.src},
              id: options.id
            },
            context
          );
        });
      });

      describe('when a version has been provide', function () {
        it('it calls the http.put method including the version', function () {
          options = _.extend(options, {version: 66});

          return widget.save().then(function () {
            expect(http.put).to.have.been.calledWith(
              {
                spaceId: options.spaceId,
                payload: {src: options.src},
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
        return widget.save().then(function () {
          expect(http.post).to.have.been.calledWith(
            {
              spaceId: options.spaceId,
              payload: {srcdoc: options.srcdoc}
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
        return widget.save().then(function () {
          expect(http.post).to.have.been.calledWith(
            {
              spaceId: options.spaceId,
              payload: {src: options.src}
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
