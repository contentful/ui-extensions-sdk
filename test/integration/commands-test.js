'use strict';

var temp = require('temp');
var _ = require('lodash');
var Bluebird = require('bluebird');
var fs = Bluebird.promisifyAll(require('fs'));
var exec = require('child_process').exec;
var path = require('path');

var chai = require('../helper');
var expect = chai.expect;
var assert = chai.assert;

var server = require('./http-server');

function command (subcommand, options) {
  let binary = path.resolve(__dirname, '../../bin/cf-widget');

  return new Bluebird(function (resolve, reject) {
    exec(`${binary} ${subcommand}`, options, function (error, stdout, stderr) {
      if (error) {
        return reject({error: error, stderr: stderr});
      }

      resolve(stdout);
    });
  });
}

describe('Commands', function () {
  beforeEach(function () {
    server.start();
  });

  afterEach(function () {
    server.stop();
  });

  let execOptions;

  beforeEach(function () {
    let env = _.clone(process.env);
    env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN = 'lol-token';

    execOptions = {env: env};
  });

  ['create', 'update', 'delete', 'read'].forEach(function (subcommand) {
    describe('when the token is not defined on the environment', function () {
      it(`${subcommand} fails`, function () {
        delete execOptions.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN;

        return command(`${subcommand}`, execOptions)
          .then(assert.fail)
          .catch(function (error) {
            let regexp = /CONTENTFUL_MANAGEMENT_ACCESS_TOKEN is undefined or empty/;

            expect(error.error.code).to.eq(1);
            expect(error.stderr).to.match(regexp);
          });
      });
    });
  });

  describe('create', function () {
    it('fails if the --space-id option is not provided', function () {
      return command('create --src foo.com --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Missing required argument: space-id/);
        });
    });

    it('fails if no --src or --srcdoc options are provided', function () {
      return command('create --space-id 123 --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/no value given for: name, src or srcdoc/);
        });
    });

    it('creates a widget', function () {
      // TODO add test that works with host without protocol
      return command('create --space-id 123 --src lol.com --name lol --host http://localhost:3000', execOptions)
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.src).to.eql('lol.com');
          expect(widget.name).to.eql('lol');
        });
    });

    it('creates a widget with fieldTypes', function () {
      let cmd = 'create --space-id 123 --name lol --src lol.com --field-types t1 t2 t3 --host http://localhost:3000';

      return command(cmd, execOptions)
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.fieldTypes).to.eql(['t1', 't2', 't3']);
        });
    });

    it('creates a widget with the sidebar property set to true', function () {
      let cmd = 'create --space-id 123 --name lol --src lol.com --sidebar --host http://localhost:3000';

      return command(cmd, execOptions)
      .then(function (stdout) {
        let widget = JSON.parse(stdout);

        expect(widget.sidebar).to.be.true();
      });
    });

    it('create a widget with the sidebar property set to false', function () {
      let cmd = 'create --space-id 123 --name lol --src lol.com --no-sidebar --host http://localhost:3000';

      return command(cmd, execOptions)
      .then(function (stdout) {
        let widget = JSON.parse(stdout);

        expect(widget.sidebar).to.be.false();
      });
    });

    it('creates a widget with the sidebar property set to undefined if no sidebar option', function () {
      let cmd = 'create --space-id 123 --name lol --src lol.com --host http://localhost:3000';

      return command(cmd, execOptions)
      .then(function (stdout) {
        let widget = JSON.parse(stdout);

        expect(widget.sidebar).to.be.undefined();
      });
    });

    it('creates a widget with a custom id', function () {
      let cmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';

      return command(cmd, execOptions)
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.src).to.eql('lol.com');
          expect(widget.sys.id).to.eql('456');
        });
    });

    it('reports the error when the API request fails', function () {
      let cmd = 'create --space-id 123 --name lol --src lol.com --id fail --host http://localhost:3000';

      return command(cmd, execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Failed to create the widget/);
        });
    });

    describe('when the --srcdoc option is used', function () {
      let file;

      beforeEach(function () {
        file = temp.path();
        return fs.writeFileAsync(file, 'the-bundle-contents');
      });

      afterEach(function () {
        return fs.unlinkAsync(file);
      });

      it('reports the error when the API request fails', function () {
        let cmd = `create --space-id 123 --name lol --srcdoc ${file} --id fail --host http://localhost:3000`;

        return command(cmd, execOptions)
          .then(assert.fail)
          .catch(function (error) {
            expect(error.error.code).to.eq(1);
            expect(error.stderr).to.match(/Failed to create the widget/);
          });
      });

      it('creates a widget from a file', function () {
        let cmd = `create --space-id 123 --name lol --srcdoc ${file} --host http://localhost:3000`;

        return command(cmd, execOptions)
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.srcdoc).to.eql('the-bundle-contents');
        });
      });
    });
  });

  describe('Read', function () {
    it('fails if the --space-id option is not provided', function () {
      return command('read --id 123 --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Missing required argument: space-id/);
        });
    });

    it('fails if no --id option is provided', function () {
      return command('read --space-id 123 --src foo.com --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Missing required argument: id/);
        });
    });

    it('reports the error when the API request fails', function () {
      let cmd = 'read --space-id 123 --id fail --host http://localhost:3000';

      return command(cmd, execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Failed to read the widget/);
        });
    });

    it('reads a widget', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let readCmd = 'read --space-id 123 --id 456 --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(readCmd, execOptions);
        })
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.src).to.eql('lol.com');
          expect(widget.sys.id).to.eql('456');
        });
    });
  });

  describe('Update', function () {
    it('fails if the --space-id option is not provided', function () {
      return command('update --id 123 --src foo.com --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Missing required argument: space-id/);
        });
    });

    it('fails if no --id option is provided', function () {
      return command('update --space-id 123 --src foo.com --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/no value given for: id/);
        });
    });

    it('fails if no --srcdoc or --src options are provided', function () {
      return command('update --space-id 123 --id 123 --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/no value given for: src or srcdoc/);
        });
    });

    it('reports the error when the API request fails (without version, reading current)', function () {
      let cmd = 'update --space-id 123 --src lol.com --id fail --host http://localhost:3000';

      return command(cmd, execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Failed to update the widget/);
        });
    });

    it('reports the error when the API request fails (without version)', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id fail-update --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id fail-update --src foo.com --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(updateCmd, execOptions);
        })
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Failed to update the widget/);
        });
    });

    it('reports the error when the API request fails (with version)', function () {
      let cmd = 'update --space-id 123 --name lol --src lol.com -v 1 --id fail --host http://localhost:3000';

      return command(cmd, execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Failed to update the widget/);
        });
    });

    it('updates a widget passing the version', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 -v 1 --src foo.com --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(updateCmd, execOptions);
        })
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.src).to.eql('foo.com');
        });
    });

    it('updates a widget without explicitely giving it version', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 --src foo.com --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(updateCmd, execOptions);
        })
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.src).to.eql('foo.com');
        });
    });

    it('returns an error if neither descriptor or options are present', function () {
      let updateCmd = 'update --space-id 123 --id 456';

      return command(updateCmd, execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/no value given for: src or srcdoc/);
        });
    });

    it('updates the name of a widget', function () {
      let createCmd = 'create --space-id 123 --name lol --src l.com --id 456 --name foo --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 --name doge --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(updateCmd, execOptions);
        })
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.name).to.eql('doge');
        });
    });

    it('upates the fieldTypes of a widget', function () {
      let createCmd = 'create --space-id 123 --name lol --src l.com --id 456 --name foo --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 --field-types t1 t2 --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(updateCmd, execOptions);
        })
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.fieldTypes).to.eql(['t1', 't2']);
        });
    });

    it('updates the sibebar property to true', function () {
      let createCmd = 'create --space-id 123 --name lol --src l.com --id 456 --name foo --no-sidebar --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 --sidebar --host http://localhost:3000';

      return command(createCmd, execOptions)
      .then(function () {
        return command(updateCmd, execOptions);
      })
      .then(function (stdout) {
        let widget = JSON.parse(stdout);

        expect(widget.sidebar).to.be.true();
      });
    });

    it('updates the sidebar property to false', function () {
      let createCmd = 'create --space-id 123 --name lol --src l.com --id 456 --name foo --sidebar --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 --no-sidebar --host http://localhost:3000';

      return command(createCmd, execOptions)
      .then(function () {
        return command(updateCmd, execOptions);
      })
      .then(function (stdout) {
        let widget = JSON.parse(stdout);

        expect(widget.sidebar).to.be.false();
      });
    });

    it('does not update the sidebar property', function () {
      let createCmd = 'create --space-id 123 --name lol --src l.com --id 456 --name foo --sidebar --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 --name foo --host http://localhost:3000';

      return command(createCmd, execOptions)
      .then(function () {
        return command(updateCmd, execOptions);
      })
      .then(function (stdout) {
        let widget = JSON.parse(stdout);

        expect(widget.sidebar).to.be.true();
      });
    });

    describe('when the --srcdoc option is used', function () {
      let file;

      beforeEach(function () {
        file = temp.path();
        return fs.writeFileAsync(file, 'the-bundle-contents');
      });

      afterEach(function () {
        return fs.unlinkAsync(file);
      });

      it('reports the error when the API request fails (without version)', function () {
        let createCmd = 'create --space-id 123 --name lol --src lol.com --id fail-update --host http://localhost:3000';
        let updateCmd = `update --space-id 123 --id fail-update --srcdoc ${file} --host http://localhost:3000`;

        return command(createCmd, execOptions)
          .then(function () {
            return command(updateCmd, execOptions);
          })
          .then(assert.fail)
          .catch(function (error) {
            expect(error.error.code).to.eq(1);
            expect(error.stderr).to.match(/Failed to update the widget/);
          });
      });

      it('reports the error when the API request fails (without version, reading current)', function () {
        let updateCmd = `update --space-id 123 --id fail --srcdoc ${file} --host http://localhost:3000`;

        return command(updateCmd, execOptions)
          .then(assert.fail)
          .catch(function (error) {
            expect(error.error.code).to.eq(1);
            expect(error.stderr).to.match(/Failed to update the widget/);
          });
      });

      it('reports the error when the API request fails (with version)', function () {
        let createCmd = 'create --space-id 123 --name lol --src lol.com --id fail-update --host http://localhost:3000';
        let updateCmd = `update --space-id 123 -v 1 --id fail-update --srcdoc ${file} --host http://localhost:3000`;

        return command(createCmd, execOptions)
          .then(function () {
            return command(updateCmd, execOptions);
          })
          .then(assert.fail)
          .catch(function (error) {
            expect(error.error.code).to.eq(1);
            expect(error.stderr).to.match(/Failed to update the widget/);
          });
      });

      it('updates a widget from a file without explicitely giving its version', function () {
        let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
        let updateCmd = `update --space-id 123 --id 456 --srcdoc ${file} --host http://localhost:3000`;

        return command(createCmd, execOptions)
          .then(function () {
            return command(updateCmd, execOptions);
          })
          .then(function (stdout) {
            let widget = JSON.parse(stdout);

            expect(widget.srcdoc).to.eql('the-bundle-contents');
          });
      });
    });
  });

  describe('Delete', function () {
    it('fails if the --space-id option is not provided', function () {
      return command('update --id 123 --src foo.com --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Missing required argument: space-id/);
        });
    });

    it('fails if no --id option is provided', function () {
      return command('delete --space-id 123 --src foo.com --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Missing required argument: id/);
        });
    });

    it('reports the error when the API request fails (without version, reading current)', function () {
      let cmd = 'delete --space-id 123 --id fail --host http://localhost:3000';

      return command(cmd, execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Failed to delete the widget/);
        });
    });

    it('reports the error when the API request fails (without version, deleting)', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id fail-delete --host http://localhost:3000';
      let deleteCmd = 'delete --space-id 123 --id fail-delete --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(deleteCmd, execOptions);
        })
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Failed to delete the widget/);
        });
    });

    it('reports the error when the API request fails (with version)', function () {
      let deleteCmd = 'delete --space-id 123 -v 1 --id fail-delete --host http://localhost:3000';

      return command(deleteCmd, execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Failed to delete the widget/);
        });
    });

    it('deletes a widget', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let deleteCmd = 'delete --space-id 123 --id 456 -v 1 --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(deleteCmd, execOptions);
        })
        .then(function (stdout) {
          expect(stdout).to.be.empty();
        });
    });

    it('deletes a widget without explicitely giving its version', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let deleteCmd = 'delete --space-id 123 --id 456 --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(deleteCmd, execOptions);
        })
        .then(function (stdout) {
          expect(stdout).to.be.empty();
        });
    });
  });
});
