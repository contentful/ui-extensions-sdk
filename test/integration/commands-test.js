'use strict';

var temp = require('temp');
var _ = require('lodash');
var Bluebird = require('bluebird');
var fs = Bluebird.promisifyAll(require('fs'));

var commandsFlags = require('../../lib/cli/bin-helpers/flags');
var command = require('./helpers/command');
var chai = require('../helper');
var expect = chai.expect;
var assert = chai.assert;

var server = require('./http-server');

function testHelpOutput (flags, output) {
  flags.forEach(function (flag) {
    let description = commandsFlags.options[flag].description;
    let regexp = new RegExp(`--${flag}\\s+${description}`);

    expect(output).to.match(regexp);
  });
}

describe('Commands', function () {
  this.timeout(5000);

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
        let msg = 'CONTENTFUL_MANAGEMENT_ACCESS_TOKEN is undefined or empty';
        let command = `${subcommand} --space-id 123 --id 456`;

        return expectErrorAndMessage(command, execOptions, msg);
      });
    });
  });

  describe('Create', function () {
    var flags = [
      'space-id', 'id', 'src', 'srcdoc', 'name', 'host', 'sidebar',
      'field-types', 'descriptor'
    ];

    it('reads the host config from the environment', function () {
      execOptions.env.CONTENTFUL_MANAGEMENT_HOST = 'http://localhost:3000';

      return command('create --space-id 123 --id 456 --name foo --src foo.com', execOptions)
      .then(function (stdout) {
        let widget = JSON.parse(stdout);

        expect(widget.sys.id).to.eql('456');
        expect(widget.name).to.eql('foo');
        expect(widget.src).to.eql('foo.com');
      });
    });

    it('--host option has precedence over the CONTENTFUL_MANAGEMENT_HOST opion', function () {
      // no API listening on localhost:9999
      execOptions.env.CONTENTFUL_MANAGEMENT_HOST = 'http://localhost:9999';

      return command('create --space-id 123 --id 456 --name foo --src foo.com --host http://localhost:3000', execOptions)
      .then(function (stdout) {
        let widget = JSON.parse(stdout);

        expect(widget.sys.id).to.eql('456');
        expect(widget.name).to.eql('foo');
        expect(widget.src).to.eql('foo.com');
      });
    });

    it('shows the help when the --help flag is present', function () {
      // Use the --space-id flag because otherwise the help would be
      // shown because it's a required flag

      return command('create --space-id 123 --help', execOptions)
        .then(function (stdout) {
          testHelpOutput(flags, stdout);
        });
    });

    it('shows all the available options when no one is provided', function () {
      return command('create', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eql(1);
          testHelpOutput(flags, error.stderr);
        });
    });

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
      let msg = serverErrorMsg('put', 123, 'fail');

      return expectErrorAndMessage(cmd, execOptions, msg);
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
        let msg = serverErrorMsg('put', 123, 'fail');

        return expectErrorAndMessage(cmd, execOptions, msg);
      });

      it('reports the error when the file does not exist', function () {
        let cmd = 'create --space-id 123 --name lol --srcdoc some-unexisting-file --host http://localhost:3000';
        let msg = 'ENOENT: no such file or directory, open \'some-unexisting-file\'';

        return expectErrorAndMessage(cmd, execOptions, msg);
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
    var flags = [ 'space-id', 'id', 'host', 'all' ];

    it('reads the host config from the environment', function () {
      execOptions.env.CONTENTFUL_MANAGEMENT_HOST = 'http://localhost:3000';
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456';
      let readCmd = 'read --space-id 123 --id 456';

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

    it('--host option has precedence over the CONTENTFUL_MANAGEMENT_HOST opion', function () {
      // no API listening on localhost:9999
      execOptions.env.CONTENTFUL_MANAGEMENT_HOST = 'http://localhost:9999';

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

    it('shows the help when the --help flag is present', function () {
      // Use the --space-id flag because otherwise the help would be
      // shown because it's a required flag

      return command('read --space-id 123 --id 456 --help', execOptions)
        .then(function (stdout) {
          testHelpOutput(flags, stdout);
        });
    });

    it('shows all the available options when no one is provided', function () {
      return command('read', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eql(1);
          testHelpOutput(flags, error.stderr);
        });
    });

    it('fails if the --space-id option is not provided', function () {
      return command('read --id 123 --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Missing required argument: space-id/);
        });
    });

    it('fails if no --id or --all options are provided', function () {
      return command('read --space-id 123 --src foo.com --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/missing one of --id or --all options/);
        });
    });

    it('reports when the widget can not be found', function () {
      let cmd = 'read --space-id 123 --id not-found --host http://localhost:3000';
      let msg = notFoundMsg('get', 123, 'not-found');

      return expectErrorAndMessage(cmd, execOptions, msg);
    });

    it('reports the error when the API request fails', function () {
      let cmd = 'read --space-id 123 --id fail --host http://localhost:3000';
      let msg = serverErrorMsg('get', 123, 'fail');

      return expectErrorAndMessage(cmd, execOptions, msg);
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

    it('reads all widgets', function () {
      let createCmd1 = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let createCmd2 = 'create --space-id 123 --name foo --src foo.com --id 789 --host http://localhost:3000';
      let readCmd = 'read --space-id 123 --all --host http://localhost:3000';

      return Bluebird.all([
        command(createCmd1, execOptions),
        command(createCmd2, execOptions)
      ])
      .then(function () {
        return command(readCmd, execOptions);
      })
      .then(function (stdout) {
        let widgets = JSON.parse(stdout);
        let lolWidget = _.find(widgets, {sys: {id: '456'}});
        let fooWidget = _.find(widgets, {sys: {id: '789'}});

        expect(widgets.length).to.eq(2);
        expect(lolWidget.name).to.eql('lol');
        expect(lolWidget.src).to.eql('lol.com');
        expect(fooWidget.name).to.eql('foo');
        expect(fooWidget.src).to.eql('foo.com');
      });
    });

    it('reports the error when the API request fails (reading all widgets)', function () {
      let cmd = 'read --space-id fail --all --host http://localhost:3000';
      let msg = serverErrorMsg('get', 'fail');

      return expectErrorAndMessage(cmd, execOptions, msg);
    });
  });

  describe('Update', function () {
    let flags = [
      'space-id', 'id', 'src', 'srcdoc', 'name', 'host', 'sidebar', 'field-types', 'descriptor',
      'version', 'force'
    ];

    it('reads the host config from the environment', function () {
      execOptions.env.CONTENTFUL_MANAGEMENT_HOST = 'http://localhost:3000';
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456';
      let updateCmd = 'update --space-id 123 --id 456 --version 1 --src foo.com';

      return command(createCmd, execOptions)
        .then(function () {
          return command(updateCmd, execOptions);
        })
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.src).to.eql('foo.com');
        });
    });

    it('--host option has precedence over the CONTENTFUL_MANAGEMENT_HOST opion', function () {
      // no API listening on localhost:9999
      execOptions.env.CONTENTFUL_MANAGEMENT_HOST = 'http://localhost:9999';

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

    it('shows the help when the --help flag is present', function () {
      // Use the --space-id flag because otherwise the help would be
      // shown because it's a required flag

      return command('update --space-id 123 --help', execOptions)
        .then(function (stdout) {
          testHelpOutput(flags, stdout);
        });
    });

    it('shows all the available options when no one is provided', function () {
      return command('update', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eql(1);
          testHelpOutput(flags, error.stderr);
        });
    });

    it('fails if the --space-id option is not provided', function () {
      return command('update --id 123 --src foo.com --host http://localhost:3000', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/Missing required argument: space-id/);
        });
    });

    it('fails if no --id option is provided', function () {
      let cmd = 'update --space-id 123 --src foo.com --host http://localhost:3000';
      let msg = 'no value given for: id';

      return expectErrorAndMessage(cmd, execOptions, msg);
    });

    it('fails if no --srcdoc or --src options are provided', function () {
      let cmd = 'update --space-id 123 --id 123 --host http://localhost:3000';
      let msg = 'no value given for: src or srcdoc';

      return expectErrorAndMessage(cmd, execOptions, msg);
    });

    it('reports the error when the API request fails (without version, reading current)', function () {
      let cmd = 'update --space-id 123 --src lol.com --id fail --force --host http://localhost:3000';
      let msg = serverErrorMsg('get', 123, 'fail');

      return expectErrorAndMessage(cmd, execOptions, msg);
    });

    it('reports the error when the API request fails (without version)', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id fail-update --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id fail-update --src foo.com --force --host http://localhost:3000';
      let msg = serverErrorMsg('put', 123, 'fail-update');

      return command(createCmd, execOptions)
        .then(function () {
          return expectErrorAndMessage(updateCmd, execOptions, msg);
        });
    });

    it('reports the error when the API request fails (with version)', function () {
      let cmd = 'update --space-id 123 --name lol --src lol.com --version 1 --id fail --host http://localhost:3000';
      let msg = serverErrorMsg('put', 123, 'fail');

      return expectErrorAndMessage(cmd, execOptions, msg);
    });

    it('updates a widget passing the version', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 --version 1 --src foo.com --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(updateCmd, execOptions);
        })
        .then(function (stdout) {
          let widget = JSON.parse(stdout);

          expect(widget.src).to.eql('foo.com');
        });
    });

    it('fails to update the widget if no version is given and force option not present', function () {
      let cmd = 'update --space-id 123 --id 456 --src foo.com --host http://localhost:3000';
      let msg = 'to update without version use the --force flag';

      return expectErrorAndMessage(cmd, execOptions, msg);
    });

    it('updates a widget without explicitely giving it version', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 --src foo.com --force --host http://localhost:3000';

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
      let cmd = 'update --space-id 123 --id 456';
      let msg = 'no value given for: src or srcdoc';

      return expectErrorAndMessage(cmd, execOptions, msg);
    });

    it('updates the name of a widget', function () {
      let createCmd = 'create --space-id 123 --name lol --src l.com --id 456 --name foo --host http://localhost:3000';
      let updateCmd = 'update --space-id 123 --id 456 --name doge --force --host http://localhost:3000';

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
      let updateCmd = 'update --space-id 123 --id 456 --field-types t1 t2 --force --host http://localhost:3000';

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
      let updateCmd = 'update --space-id 123 --id 456 --sidebar --force --host http://localhost:3000';

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
      let updateCmd = 'update --space-id 123 --id 456 --no-sidebar --force --host http://localhost:3000';

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
      let updateCmd = 'update --space-id 123 --id 456 --name foo --force --host http://localhost:3000';

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
        let updateCmd = `update --space-id 123 --id fail-update --srcdoc ${file} --force --host http://localhost:3000`;
        let msg = serverErrorMsg('put', 123, 'fail-update');

        return command(createCmd, execOptions)
          .then(function () {
            return expectErrorAndMessage(updateCmd, execOptions, msg);
          });
      });

      it('reports the error when the API request fails (without version, reading current)', function () {
        let updateCmd = `update --space-id 123 --id fail --srcdoc ${file} --force --host http://localhost:3000`;
        let msg = serverErrorMsg('get', 123, 'fail');

        return expectErrorAndMessage(updateCmd, execOptions, msg);
      });

      it('reports the error when the API request fails (with version)', function () {
        let createCmd = 'create --space-id 123 --name lol --src lol.com --id fail-update --host http://localhost:3000';
        let updateCmd = `update --space-id 123 --version 1 --id fail-update --srcdoc ${file} --force --host http://localhost:3000`;
        let msg = serverErrorMsg('put', 123, 'fail-update');

        return command(createCmd, execOptions)
          .then(function () {
            return expectErrorAndMessage(updateCmd, execOptions, msg);
          });
      });

      it('reports the error when the file does not exist', function () {
        let cmd = 'update --space-id 123 --id 456 --srcdoc some-unexisting-file --force --host http://localhost:3000';
        let msg = 'ENOENT: no such file or directory, open \'some-unexisting-file\'';

        return expectErrorAndMessage(cmd, execOptions, msg);
      });

      it('updates a widget from a file without explicitely giving its version', function () {
        let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
        let updateCmd = `update --space-id 123 --id 456 --srcdoc ${file} --force --host http://localhost:3000`;

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
    let flags = ['space-id', 'id', 'version', 'force', 'host'];

    it('reads the host config from the environment', function () {
      execOptions.env.CONTENTFUL_MANAGEMENT_HOST = 'http://localhost:3000';
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456';
      let deleteCmd = 'delete --space-id 123 --id 456 --version 1';

      return command(createCmd, execOptions)
        .then(function () {
          return command(deleteCmd, execOptions);
        })
        .then(function (stdout) {
          expect(stdout).to.be.empty();
        });
    });

    it('--host option has precedence over the CONTENTFUL_MANAGEMENT_HOST opion', function () {
      // no API listening on localhost:9999
      execOptions.env.CONTENTFUL_MANAGEMENT_HOST = 'http://localhost:9999';

      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let deleteCmd = 'delete --space-id 123 --id 456 --version 1 --host http://localhost:3000';

      return command(createCmd, execOptions)
        .then(function () {
          return command(deleteCmd, execOptions);
        })
        .then(function (stdout) {
          expect(stdout).to.be.empty();
        });
    });

    it('shows the help when the --help flag is present', function () {
      // Use the --space-id and --id flags because otherwise the help would be
      // shown because they are required flags

      return command('delete --space-id 123 --id 456 --help', execOptions)
        .then(function (stdout) {
          testHelpOutput(flags, stdout);
        });
    });

    it('shows all the available options when no one is provided', function () {
      return command('delete', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eql(1);
          testHelpOutput(flags, error.stderr);
        });
    });

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

    it('fails to delete the widget if no version is given and force option not present', function () {
      return command('delete --space-id 123 --src foo.com --id 456 --host http://localshot', execOptions)
        .then(assert.fail)
        .catch(function (error) {
          expect(error.error.code).to.eq(1);
          expect(error.stderr).to.match(/to delete without version use the --force flag/);
        });
    });

    it('reports the error when the API request fails (without version, reading current)', function () {
      let cmd = 'delete --space-id 123 --id fail --force --host http://localhost:3000';
      let msg = serverErrorMsg('get', 123, 'fail');

      return expectErrorAndMessage(cmd, execOptions, msg);
    });

    it('reports the error when the API request fails (without version, deleting)', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id fail-delete --host http://localhost:3000';
      let deleteCmd = 'delete --space-id 123 --id fail-delete --force --host http://localhost:3000';
      let msg = serverErrorMsg('delete', 123, 'fail-delete');

      return command(createCmd, execOptions)
        .then(function () {
          return expectErrorAndMessage(deleteCmd, execOptions, msg);
        });
    });

    it('reports the error when the API request fails (without version, not found)', function () {
      let deleteCmd = 'delete --space-id 123 --force --id not-found --host http://localhost:3000';
      let msg = notFoundMsg('get', 123, 'not-found');

      return expectErrorAndMessage(deleteCmd, execOptions, msg);
    });

    it('reports the error when the API request fails (with version, not found)', function () {
      let deleteCmd = 'delete --space-id 123 --version 1 --id not-found --host http://localhost:3000';
      let msg = notFoundMsg('delete', 123, 'not-found');

      return expectErrorAndMessage(deleteCmd, execOptions, msg);
    });

    it('reports the error when the API request fails (with version)', function () {
      let deleteCmd = 'delete --space-id 123 --version 1 --id fail-delete --host http://localhost:3000';
      let msg = serverErrorMsg('delete', 123, 'fail-delete');

      return expectErrorAndMessage(deleteCmd, execOptions, msg);
    });

    it('deletes a widget', function () {
      let createCmd = 'create --space-id 123 --name lol --src lol.com --id 456 --host http://localhost:3000';
      let deleteCmd = 'delete --space-id 123 --id 456 --version 1 --host http://localhost:3000';

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
      let deleteCmd = 'delete --space-id 123 --id 456 --force --host http://localhost:3000';

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

function expectErrorAndMessage (commandString, execOptions, errorMessage) {
  let commandName = commandString.match(/^(\w+)/)[1];
  let regexp = errorMessageRegExp(commandName, errorMessage);

  return command(commandString, execOptions)
    .then(assert.fail)
    .catch(function (error) {
      expect(error.error.code).to.eq(1);
      expect(error.stderr).to.match(regexp);
    });
}

function resourceUrlRegexp (spaceId, id) {
  let url = `http://localhost:3000/spaces/${spaceId}/widgets`;

  if (id) {
    url = `${url}/${id}`;
  }

  url = `${url}[\\w?=_-]+`;

  return url;
}

function notFoundMsg (method, spaceId, id) {
  let url = resourceUrlRegexp(spaceId, id);

  return httpError(method, url, 'The resource can\'t be found');
}

function serverErrorMsg (method, spaceId, id) {
  let url = resourceUrlRegexp(spaceId, id);

  return httpError(method, url, 'Server failed to fulfill the request');
}

function httpError (method, pathRegexp, details) {
  return `${method} ${pathRegexp} ${details}`;
}

function errorMessageRegExp (command, details) {
  return new RegExp(`Failed to ${command} the widget: ${details}`);
}
