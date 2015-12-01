'use strict';

var temp = require('temp');
var _ = require('lodash');
var Bluebird = require('bluebird');
var fs = Bluebird.promisifyAll(require('fs'));
var path = require('path');

var command = require('./helpers/command');
var chai = require('../helper');
var expect = chai.expect;
var assert = chai.assert;

var server = require('./http-server');


function example (options, test) {
  Object.keys(options).forEach(function (key) {
    let commands = options[key];

    if (!_.isArray(commands)) {
      commands = [commands];
    }

    test(key, commands);
  });
}

function runCommands (commands, execOptions) {
  return function () {
    return Bluebird.reduce(commands, function (acc, c) {
      return command(c, execOptions);
    }, []); // give some non 'undefined' initial value
  };
}

describe('Descriptor file', function () {
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

  describe('when a descriptor file is given', function () {
    let customDescriptor;
    let customDescriptorPath = path.resolve(process.cwd(), 'descriptor.json');

    beforeEach(function () {
      customDescriptor = {
        id: '123',
        src: 'foo.com',
        name: 'foo',
        fieldTypes: ['t1', 't2'],
        sidebar: true
      };

      return fs.writeFileAsync(customDescriptorPath, JSON.stringify(customDescriptor));
    });

    afterEach(function () {
      return fs.unlinkAsync(customDescriptorPath);
    });

    example({
      create: `create  --space-id 123 --descriptor ${customDescriptorPath} --host http://localhost:3000`,
      update: [
        'create --space-id 123 --id 123 --name lol --src foo.com --field-types Symbol --host http://localhost:3000',
        `update --space-id 123 --descriptor ${customDescriptorPath} --force --host http://localhost:3000`
      ]
    },
    function (commandName, commands) {
      it(`${commandName}s a widget`, function () {
        return runCommands(commands, execOptions)()
          .then(function (stdout) {
            let widget = JSON.parse(stdout);

            expect(widget.name).to.eql(customDescriptor.name);
            expect(widget.src).to.eql(customDescriptor.src);
            expect(widget.fieldTypes).to.eql(customDescriptor.fieldTypes);
            expect(widget.sidebar).to.be.true();
            expect(widget.sys.id).to.eql(customDescriptor.id);
            expect(widget.sys.space.sys.id).to.eql('123');
          });
      });
    });
  });

  describe('when the descriptor file does not exist', function () {
    let customDescriptorPath = path.resolve(process.cwd(), 'descriptor.json');

    example(
      {
        create: `create --space-id 123 --descriptor ${customDescriptorPath}`,
        update: `update --space-id 123 --descriptor ${customDescriptorPath}`
      },
      function (commandName, commands) {
        it(`${commandName}s returns an error`, function () {
          return runCommands(commands, execOptions)()
          .then(assert.fail)
          .catch(function (error) {
            let cause = `ENOENT: no such file or directory, stat '${customDescriptorPath}'`;
            let msg = new RegExp(`Failed to ${commandName} the widget: ${cause}`);
            expect(error.error.code).to.eq(1);
            expect(error.stderr).to.match(msg);
          });
        });
      }
    );
  });

  describe('when the cli can not open the file', function () {
    let customDescriptorPath = path.resolve(process.cwd(), 'descriptor.json');

    beforeEach(function () {
      return fs.writeFileAsync(customDescriptorPath, JSON.stringify({}))
      .then(function () {
        return fs.chmodAsync(customDescriptorPath, '300');
      });
    });

    afterEach(function () {
      return fs.unlinkAsync(customDescriptorPath);
    });

    example(
      {
        create: `create --space-id 123 --descriptor ${customDescriptorPath}`,
        update: `update --space-id 123 --descriptor ${customDescriptorPath}`
      },
      function (commandName, commands) {
        it(`${commandName} returns an error`, function () {
          return runCommands(commands, execOptions)()
          .then(assert.fail)
          .catch(function (error) {
            let cause = 'EACCES: permission denied, open \'.+\/descriptor\.json\'';
            let msg = new RegExp(`Failed to ${commandName} the widget: ${cause}`);
            expect(error.error.code).to.eq(1);
            expect(error.stderr).to.match(msg);
          });
        });
      }
    );
  });

  describe('when there is a widget.json file present', function () {
    let file, descriptor;

    beforeEach(function () {
      descriptor = {
        id: '456',
        src: 'lol.com',
        name: 'foo',
        fieldTypes: ['t1', 't2'],
        sidebar: true
      };

      file = path.resolve(process.cwd(), 'widget.json');
      return fs.writeFileAsync(file, JSON.stringify(descriptor));
    });

    afterEach(function () {
      return fs.unlinkAsync(file);
    });

    example(
      {
        create: 'create --space-id 123 --host http://localhost:3000',
        update: [
          'create --space-id 123 --id 456 --src foo.com --host http://localhost:3000',
          'update --space-id 123 --force --host http://localhost:3000'
        ]
      },
      function (commandName, commands) {
        it(`${commandName}s the widget using the values in descriptor file`, function () {
          return runCommands(commands, execOptions)()
          .then(function (stdout) {
            let widget = JSON.parse(stdout);

            expect(widget.name).to.eql(descriptor.name);
            expect(widget.src).to.eql(descriptor.src);
            expect(widget.sys.id).to.eql(descriptor.id);
          });
        });
      }
    );

    describe('when the descriptor file has the srcdoc property set', function () {
      let srdoc, bundle;

      beforeEach(function () {
        srdoc = temp.path();
        bundle = 'the-bundle-contents';

        return fs.writeFileAsync(srdoc, bundle);
      });

      afterEach(function () {
        return fs.unlinkAsync(srdoc);
      });

      example(
        {
          create: 'create --space-id 123 --host http://localhost:3000',
          update: [
            'create --space-id 123 --id 456 --src foo.com --host http://localhost:3000',
            'update --space-id 123 --force --host http://localhost:3000'
          ]
        },
        function (commandName, commands) {
          it(`${commandName}s the widget using the values in the descriptor file`, function () {
            delete descriptor.src;
            descriptor.srcdoc = srdoc;

            return fs.writeFileAsync(file, JSON.stringify(descriptor))
            .then(runCommands(commands, execOptions))
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget.srcdoc).to.eql(bundle);
              expect(widget.sys.id).to.eql(descriptor.id);
            });
          });
        }
      );

      example(
        {
          create: 'create --space-id 123 --src foo.com --host http://localhost:3000',
          update: [
            'create --space-id 123 --src wow.com --host http://localhost:3000',
            'update --space-id 123 --src foo.com --force --host http://localhost:3000'
          ]
        },
        function (commandName, commands) {
          it(`${commandName} --src excludes the srdoc property in the descriptor`, function () {
            delete descriptor.src;
            descriptor.srcdoc = srdoc;

            return fs.writeFileAsync(file, JSON.stringify(descriptor))
            .then(runCommands(commands, execOptions))
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget).to.not.have.ownProperty('srcdoc');
              expect(widget.src).to.eql('foo.com');
              expect(widget.sys.id).to.eql(descriptor.id);
            });
          });
        }
      );
    });

    example(
      {
        create: 'create --space-id 123 --src foo.com --host http://localhost:3000',
        update: [
          'create --space-id 123 --id 456  --host http://localhost:3000',
          'update --space-id 123 --src foo.com --force --host http://localhost:3000'
        ]
      },
      function (commandName, commands) {
        it(`${commandName} --src option overwrites src property in the descriptor`, function () {
          return runCommands(commands, execOptions)()
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget.src).to.eql('foo.com');
              expect(widget.sys.id).to.eql(descriptor.id);
            });
        });
      }
    );

    example(
      {
        create: 'create --space-id 123 --name doge --host http://localhost:3000',
        update: [
          'create --space-id 123 --id 456  --host http://localhost:3000',
          'update --space-id 123 --name doge --force --host http://localhost:3000'
        ]
      },
      function (commandName, commands) {
        it(`${commandName} --name option overwrites name property in the descriptor`, function () {
          return runCommands(commands, execOptions)()
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget.name).to.eql('doge');
              expect(widget.sys.id).to.eql(descriptor.id);
            });
        });
      }
    );

    example(
      {
        create: 'create --space-id 123 --field-types t3 t4 --host http://localhost:3000',
        update: [
          'create --space-id 123 --id 456  --host http://localhost:3000',
          'update --space-id 123 --field-types t3 t4 --force --host http://localhost:3000'
        ]
      },
      function (commandName, commands) {
        it(`${commandName} --field-types option overwrites fieldTypes property in the descriptor`, function () {
          return runCommands(commands, execOptions)()
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget.fieldTypes).to.eql(['t3', 't4']);
              expect(widget.sys.id).to.eql(descriptor.id);
            });
        });
      }
    );

    describe('when the --srcdoc option is used', function () {
      let srcdoc, bundle, f, b;

      f = temp.path();

      beforeEach(function () {
        srcdoc = temp.path();
        bundle = 'the-bundle-contents';
        b = 'another-bundle';

        return Bluebird.all([
          fs.writeFileAsync(srcdoc, bundle),
          fs.writeFileAsync(f, b)
        ]);
      });

      afterEach(function () {
        return Bluebird.all([
          fs.unlinkAsync(srcdoc),
          fs.unlinkAsync(f)
        ]);
      });

      example(
        {
          create: `create --space-id 123 --srcdoc ${f} --host http://localhost:3000`,
          update: [
            'create --space-id 123 --id 456  --host http://localhost:3000',
            `update --space-id 123 --srcdoc ${f} --force --host http://localhost:3000`
          ]
        },
        function (commandName, commands) {
          it(`${commandName} --srcdoc option overwrites srdoc property in the descriptor`, function () {
            delete descriptor.src;
            descriptor.srcdoc = srcdoc;

            return fs.writeFileAsync(file, JSON.stringify(descriptor))
            .then(runCommands(commands, execOptions))
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget.srcdoc).to.eql(b);
              expect(widget.sys.id).to.eql(descriptor.id);
            });
          });
        }
      );

      example(
        {
          create: `create --space-id 123 --srcdoc ${f} --host http://localhost:3000`,
          update: [
            'create --space-id 123 --id 456  --host http://localhost:3000',
            `update --space-id 123 --srcdoc ${f} --force --host http://localhost:3000`
          ]
        },
        function (commandName, commands) {
          it(`${commandName} --srcdoc excludes the src property in the descriptor`, function () {
            return fs.writeFileAsync(file, JSON.stringify(descriptor))
            .then(runCommands(commands, execOptions))
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget).to.not.have.ownProperty('src');
              expect(widget.srcdoc).to.eql(b);
              expect(widget.sys.id).to.eql(descriptor.id);
            });
          });
        }
      );
    });

    example(
      {
        create: 'create --space-id 123 --id 88 --host http://localhost:3000',
        update: [
          // TODO: use a different file when updating (or modify the
          // existing) one as now we are using the same descriptor file
          'create --space-id 123 --id 88 --host http://localhost:3000',
          'update --space-id 123 --id 88 --force --host http://localhost:3000'
        ]
      },
      function (commandName, commands) {
        it(`${commandName} --id option overwrites id property in the descriptor`, function () {
          return runCommands(commands, execOptions)()
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget.src).to.eql(descriptor.src);
              expect(widget.sys.id).to.eql('88');
            });
        });
      }
    );

    example(
      {
        create: 'create --space-id 123 --id 88 --no-sidebar --host http://localhost:3000',
        update: [
          'create --space-id 123 --id 88 --name foo --host http://localhost:3000',
          'update --space-id 123 --id 88 --no-sidebar --force --host http://localhost:3000'
        ]
      },
      function (commandName, commands) {
        it(`${commandName} --sidebar option overwrites sidebar property in the descriptor`, function () {
          return runCommands(commands, execOptions)()
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget.sidebar).to.be.false();
            });
        });
      }
    );

    example(
      {
        create: 'create --space-id 123  --host http://localhost:3000',
        update: 'update --space-id 123  --host http://localhost:3000'

      },
      function (commandName, commands) {
        it(`${commandName} errors when the descriptor file is not valid JSON`, function () {
          return fs.writeFileAsync(file, 'not-valid-json')
            .then(runCommands(commands, execOptions))
            .then(assert.fail)
            .catch(function (error) {
              let cause = '.+\/widget\.json Unexpected token o';
              let regexp = new RegExp(`Failed to ${commandName} the widget: ${cause}`);
              expect(error.error.code).to.eq(1);
              expect(error.stderr).to.match(regexp);
            });
        });
      }
    );

    example(
      {
        create: 'create --space-id 123 --host http://localhost:3000',
        update: 'update --space-id 123 --host http://localhost:3000'
      },
      function (commandName, commands) {
        it(`${commandName} errors when there are missing properties on the file (id)`, function () {
          descriptor = {src: 'foo.com'};

          return fs.writeFileAsync(file, JSON.stringify(descriptor))
            .then(runCommands(commands, execOptions))
            .then(assert.fail)
            .catch(function (error) {
              let regexp = new RegExp(`Failed to ${commandName} the widget`);
              expect(error.error.code).to.eq(1);
              expect(error.stderr).to.match(regexp);
            });
        });
      }
    );

    example(
      {
        create: 'create --space-id 123 --host http://localshot:3000',
        update: 'update --space-id 123 --host http://localshot:3000'
      },
      function (commandName, commands) {
        it('errors when there are missing properties on the file (src or srcdoc)', function () {
          descriptor = {id: 123};

          return fs.writeFileAsync(file, JSON.stringify(descriptor))
            .then(runCommands(commands, execOptions))
            .then(assert.fail)
            .catch(function (error) {
              let msg = new RegExp(`Failed to ${commandName} the widget: missing src and srcdoc in descriptor file`);
              expect(error.error.code).to.eq(1);
              expect(error.stderr).to.match(msg);
            });
        });
      }
    );

    describe('when the --descripor option is used', function () {
      describe('when the file exists', function () {
        let customDescriptor;
        let customDescriptorPath = path.resolve(process.cwd(), 'descriptor.json');

        beforeEach(function () {
          customDescriptor = {
            id: 'desc-123',
            src: 'desc-foo.com',
            name: 'desc-foo',
            fieldTypes: ['desc-t1', 'desc-t2'],
            sidebar: true
          };

          return fs.writeFileAsync(customDescriptorPath, JSON.stringify(customDescriptor));
        });

        afterEach(function () {
          return fs.unlinkAsync(customDescriptorPath);
        });

        example({
          create: `create  --space-id 123 --descriptor ${customDescriptorPath} --host http://localhost:3000`,
          update: [
            'create --space-id 123 --id desc-123 --name lol --src foo.com --host http://localhost:3000',
            `update --space-id 123 --descriptor ${customDescriptorPath} --force --host http://localhost:3000`
          ]
        },
        function (commandName, commands) {
          it(`${commandName}s a widget`, function () {
            return runCommands(commands, execOptions)()
            .then(function (stdout) {
              let widget = JSON.parse(stdout);

              expect(widget.name).to.eql(customDescriptor.name);
              expect(widget.src).to.eql(customDescriptor.src);
              expect(widget.fieldTypes).to.eql(customDescriptor.fieldTypes);
              expect(widget.sidebar).to.be.true();
              expect(widget.sys.id).to.eql(customDescriptor.id);
              expect(widget.sys.space.sys.id).to.eql('123');

              expect(widget.name).not.to.eql(descriptor.name);
              expect(widget.src).not.to.eql(descriptor.src);
              expect(widget.fieldTypes).not.to.eql(descriptor.fieldTypes);
              expect(widget.sys.id).not.to.eql(descriptor.id);
            });
          });
        });
      });

      describe('when file does not exist', function () {
        let customDescriptorPath = path.resolve(process.cwd(), 'missing-descriptor.json');

        example(
          {
            create: `create --space-id 123 --descriptor ${customDescriptorPath}`,
            update: `update --space-id 123 --descriptor ${customDescriptorPath}`
          },
          function (commandName, commands) {
            it(`${commandName}s returns an error`, function () {
              return runCommands(commands, execOptions)()
              .then(assert.fail)
              .catch(function (error) {
                let cause = `ENOENT: no such file or directory, stat '${customDescriptorPath}'`;
                let msg = new RegExp(`Failed to ${commandName} the widget: ${cause}`);
                expect(error.error.code).to.eq(1);
                expect(error.stderr).to.match(msg);
              });
            });
          }
        );
      });
    });
  });
});
