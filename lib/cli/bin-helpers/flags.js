'use strict';

var _ = require('lodash');
var yargs = require('yargs');

let OPTIONS = {
  'space-id': {
    required: true,
    description: 'Id of a space in Contentful',
    type: 'string',
    requiresArg: true,
    for: ['all']
  },
  'host': {
    description: 'API host',
    type: 'string',
    requiresArg: true,
    for: ['all']
  },
  'srcdoc': {
    description: 'Path to widget bundle',
    type: 'string',
    requiresArg: true,
    for: ['create', 'update']
  },
  'src': {
    description: 'URL to widget bundle',
    type: 'string',
    requiresArg: true,
    for: ['create', 'update']
  },
  'id': {
    description: 'Widget id',
    type: 'string',
    requiresArg: true,
    for: ['all']
  },
  'name': {
    description: 'Widget name',
    type: 'string',
    requiresArg: true,
    for: ['create', 'update']
  },
  'descriptor': {
    description: 'Path to a widget descriptor file',
    type: 'string',
    requiresArg: true,
    for: ['create', 'update']
  },
  'field-types': {
    description: 'List of field types where to use the widget',
    type: 'array',
    requiresArg: true,
    for: ['create', 'update']
  },
  'sidebar': {
    description: 'Render the widget in the sidebar',
    type: 'boolean',
    default: undefined,
    for: ['create', 'update']
  },
  'force': {
    description: 'Force operation without explicit version',
    type: 'boolean',
    for: ['update', 'delete']
  },
  'version': {
    description: 'Current version of the widget',
    type: 'string',
    requiresArg: true,
    for: ['update', 'delete']
  },
  'all': {
    description: 'Read all the widgets in the space',
    type: 'boolean',
    for: ['read']
  }
};

let optionsRefinements = {
  delete: {
    'id': {
      required: true
    }
  }
};

exports.options = OPTIONS;
exports.for = function (command) {
  let optionDescriptors = optionDescriptorsForCommand(command);
  let argv = yargs.options(optionDescriptors).argv;
  let ARGVValues = ARGVValuesForCommand(argv, optionDescriptors, command);

  return ARGVValues;
};

function optionDescriptorsForCommand (command) {
  return _.transform(OPTIONS, function (acc, value, key) {
    let applicableTo = value.for;
    let refinement;

    if (optionsRefinements[command]) {
      refinement = optionsRefinements[command][key];
    }

    if (_.contains(applicableTo, command) || _.contains(applicableTo, 'all')) {
      let clone = _.omit(value, 'for');
      _.extend(clone, refinement);
      acc[key] = clone;
    }
  }, {});
}

function ARGVValuesForCommand (argv, optionDescriptors, command) {
  let keys = Object.keys(optionDescriptors);
  let camelcasedKeys = _.map(keys, _.camelCase);

  return _.pick(argv, camelcasedKeys);
};
