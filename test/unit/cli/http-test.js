'use strict';

var sinon = require('sinon');

var expect = require('../../helper').expect;
var http = require('../../../lib/cli/http');

describe('http', function () {
  let context, requestStub;

  beforeEach(function () {
    requestStub = {
      post: sinon.stub(),
      get: sinon.stub(),
      del: sinon.stub(),
      put: sinon.stub()
    };

    context = {
      host: 'http://example.com',
      request: requestStub,
      token: 'TOKEN'
    };

    requestStub.post.onFirstCall().callsArgWith(1, null, {statusCode: 201});
    requestStub.get.onFirstCall().callsArgWith(1, null, {statusCode: 200, body: {foo: 'bar'}});
    requestStub.del.onFirstCall().callsArgWith(1, null, {statusCode: 204});
    requestStub.put.onFirstCall().callsArgWith(1, null, {statusCode: 200});
  });

  describe('#get', function () {
    it('when the host includes a port', function () {
      let options = {
        space: 123,
        id: 456
      };

      context.host = 'http://example.com:3000';

      return http.get(options, context).then(function () {
        expect(requestStub.get).to.have.been.calledWith(
          {
            url: 'http://example.com:3000/spaces/123/widgets/456',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${context.token}`
            }
          }
        );
      });
    });

    it('makes a GET request to the API', function () {
      let options = {
        space: 123,
        id: 456
      };

      return http.get(options, context).then(function () {
        expect(requestStub.get).to.have.been.calledWith(
          {
            url: 'http://example.com/spaces/123/widgets/456',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${context.token}`
            }
          }
        );
      });
    });

    it('returns a JSON object', function () {
      let options = {
        space: 123,
        id: 456
      };

      return http.get(options, context).then(function (json) {
        expect(json).to.eql({foo: 'bar'});
      });
    });

    it('throws an error if the response status is not 200', function () {
      let options = {
        space: 123,
        id: 456
      };

      requestStub.get.onFirstCall().callsArgWith(1, null, {statusCode: 404});

      return http.get(options, context).catch(function () {
        expect(true).to.be.true();
      });
    });
  });

  describe('#post', function () {
    it('makes a POST request to the API', function () {
      let options = {
        space: 123,
        payload: {foo: 'bar'}
      };

      return http.post(options, context).then(function () {
        expect(requestStub.post).to.have.been.calledWith(
          {
            url: 'http://example.com/spaces/123/widgets',
            body: JSON.stringify(options.payload),
            headers: {
              'Authorization': `Bearer ${context.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      });
    });

    it('throws an error if the response status is not 201', function () {
      let options = {
        space: 123,
        payload: {foo: 'bar'}
      };

      requestStub.post.onFirstCall().callsArgWith(1, null, {statusCode: 400});

      return http.post(options, context).catch(function () {
        expect(true).to.be.true();
      });
    });
  });

  describe('#put', function () {
    describe('when a version option is not present', function () {
      it('makes a PUT request to the API', function () {
        let options = {
          space: 123,
          payload: {foo: 'bar'},
          id: 456
        };

        requestStub.put.onFirstCall().callsArgWith(1, null, {statusCode: 201});

        return http.put(options, context).then(function () {
          expect(requestStub.put).to.have.been.calledWith(
            {
              url: 'http://example.com/spaces/123/widgets/456',
              body: JSON.stringify(options.payload),
              headers: {
                'Authorization': `Bearer ${context.token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        });
      });

      it('throws an error if the response status is not 201', function () {
        let options = {
          space: 123,
          payload: {foo: 'bar'},
          id: 456,
        };

        requestStub.put.onFirstCall().callsArgWith(1, null, {statusCode: 400});

        return http.put(options, context).catch(function () {
          expect(true).to.be.true();
        });
      });
    });

    describe('when a version option is present', function () {
      it('makes a PUT request to the API', function () {
        let options = {
          space: 123,
          payload: {foo: 'bar'},
          id: 456,
          version: 33,
        };

        requestStub.put.onFirstCall().callsArgWith(1, null, {statusCode: 200});

        return http.put(options, context).then(function () {
          expect(requestStub.put).to.have.been.calledWith(
            {
              url: 'http://example.com/spaces/123/widgets/456',
              body: JSON.stringify(options.payload),
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.token}`,
                'X-Contentful-Version': options.version
              }
            }
          );
        });
      });

      it('throws an error if the response status is not 200', function () {
        let options = {
          space: 123,
          payload: {foo: 'bar'},
          id: 456,
          version: 33
        };

        requestStub.put.onFirstCall().callsArgWith(1, null, {statusCode: 400});

        return http.put(options, context).catch(function () {
          expect(true).to.be.true();
        });
      });
    });
  });

  describe('#delete', function () {
    it('makes a DELETE request to the API', function () {
      let options = {
        space: 123,
        id: 456,
        version: 33
      };

      return http.delete(options, context).then(function () {
        expect(requestStub.del).to.have.been.calledWith(
          {
            url: 'http://example.com/spaces/123/widgets/456',
            headers: {
              'X-Contentful-Version': options.version,
              'Authorization': `Bearer ${context.token}`
            }
          }
        );
      });
    });
  });
});
