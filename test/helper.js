var chai = require('chai');
var dirtyChai = require('dirty-chai');
var sinonChai = require('sinon-chai');

chai.use(dirtyChai);
chai.use(sinonChai);

module.exports = chai;
