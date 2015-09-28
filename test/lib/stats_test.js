'use strict';

var modulePath = '../../lib/stats';

describe('stats structure', function() {
  var Stats = require(modulePath),
    intermediate = new Stats();

  ['_sample', '_min', '_max', '_count', '_sum', '_varianceM', '_varianceS']
  .map(function(prop) {
    it(prop + ' is present in cpu histogram', function() {
      expect(prop in intermediate.collection.cpu).to.equal(true);
    });
  });

  ['_sample', '_min', '_max', '_count', '_sum', '_varianceM', '_varianceS']
  .map(function(prop) {
    it(prop + ' is present in memory histogram', function() {
      expect(prop in intermediate.collection.memory).to.equal(true);
    });
  });

  it('has addCPU function', function() {
    expect(intermediate.addCPU).to.be.an('function');
  });

  it('has addMemory function', function() {
    expect(intermediate.addMemory).to.be.an('function');
  });

  it('has report function', function() {
    expect(intermediate.report).to.be.an('function');
  })

  it('has reset function', function() {
    expect(intermediate.reset).to.be.an('function');
  });
});

describe('validate functions', function() {
  var Stats = require(modulePath),
    intermediate = new Stats();

  it('reset function resets data', function() {
    intermediate.addCPU(0.3);
    intermediate.addMemory(123551);

    intermediate.reset();

    expect(intermediate.collection.cpu._min).to.equal(null);
    expect(intermediate.collection.cpu._count).to.equal(0);
    expect(intermediate.collection.memory._min).to.equal(null);
    expect(intermediate.collection.memory._count).to.equal(0);
  });

  it('addCPU function updates cpu', function() {
    intermediate.addCPU(0.3);
    expect(intermediate.collection.cpu._min).to.equal(0.3);
    expect(intermediate.collection.cpu._count).to.equal(1);    
  });

  it('addMemory function updates memory', function() {
    intermediate.addMemory(123551);
    expect(intermediate.collection.memory._min).to.equal(123551);
    expect(intermediate.collection.memory._count).to.equal(1);
  });

  it('report function returns result object', function() {
    var result = intermediate.report();
    expect(result).to.be.an('object');
  });
});
