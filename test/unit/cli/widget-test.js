'use strict';

var sinon    = require('sinon');
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
          space: 123,
          url: 'the-url',
          id: 456
        };

        widget = new Widget(options, context);
      });

      it('it calls the http.put method with the expected arguments', function () {
        return widget.save().then(function () {
          expect(http.put).to.have.been.calledWith(
            {
              space: options.space,
              payload: {src: options.url},
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
                space: options.space,
                payload: {src: options.url},
                id: options.id,
                version: options.version
              },
              context
            );
          });
        });
      });
    });

    describe('when a bundle has been provided', function () {
      beforeEach(function () {
        options = {
          space: 123,
          bundle: 'the-bundle'
        };

        widget = new Widget(options, context);
      });

      it('it saves a widget with the srcdoc property set', function () {
        return widget.save().then(function () {
          expect(http.post).to.have.been.calledWith(
            {
              space: options.space,
              payload: {srcdoc: options.bundle}
            },
            context
          );
        });
      });
    });

    describe('when a URL has been provided', function () {
      beforeEach(function () {
        options = {
          space: 123,
          url: 'the-url'
        };

        widget = new Widget(options, context);
      });

      it('it saves a widget with the src property set', function () {
        return widget.save().then(function () {
          expect(http.post).to.have.been.calledWith(
            {
              space: options.space,
              payload: {src: options.url}
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
        space: 123,
        id: 456
      };

      widget = new Widget(options, context);
    });

    it('calls the http module with the expected arguments', function () {
      return widget.read().then(function () {
        expect(http.get).to.have.been.calledWith(
          {
            space: options.space,
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
        space: 123,
        id: 456
      };

      widget = new Widget(options, context);
    });

    it('calls the http module with the expected arguments', function () {
      return widget.delete().then(function () {
        expect(http.delete).to.have.been.calledWith(
          {
            space: options.space,
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
