'use strict';

var localChai = require('chai'),
  localSinon = require('sinon'),
  Measured = require('measured');

localChai.use(require('sinon-chai'));

global.chai = localChai;
global.assert = localChai.assert;
global.expect = localChai.expect;
global.should = localChai.should();

global.sinon = localSinon;

global.createStat = new Statham();

function Statham() {
  this._collection = {
    // Number of requests that completed successfully
    completedRequests: new Measured.Counter(),
    latency: new Measured.Histogram(),
    // Response codes, such as 200 for HTTP.
    codes: {
    },
    cpu: new Measured.Histogram(),
    memory: new Measured.Histogram()
  };
  return this;
}

Statham.prototype.addCode = function(code) {
  if (!this._collection.codes[code]) {
    this._collection.codes[code] = new Measured.Counter();
  }
  this._collection.codes[code].inc();

  return this;
};

Statham.prototype.completedRequest = function() {
  this._collection.completedRequests.inc();

  return this;
};

Statham.prototype.addLatency = function(delta) {
  this._collection.latency.update(delta);

  return this;
};
