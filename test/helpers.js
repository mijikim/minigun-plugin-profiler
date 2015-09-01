'use strict';

var path = require('path'),
  localChai = require('chai'),
  localSinon = require('sinon');
  
localChai
  .use(require('sinon-chai'));

global.chai = localChai;
global.assert = localChai.assert;
global.expect = localChai.expect;
global.should = localChai.should();

global.sinon = localSinon;
