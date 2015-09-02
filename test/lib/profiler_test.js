'use strict';

var modulePath = '../../lib/profiler',
  Measured = require('measured'),
  proxyquire = require('proxyquire');  

describe('profiler structure', function() {
  var profiler = require(modulePath),
    pid = 34562,
    intermediate = {},
    aggregate = {},
    pendingRequests = {},
    delta = 345,
    code = 200;

  it('returns updateUsage function', function() {
    expect(profiler.name).to.equal('updateUsage');
  });

  it('validates inputs', function() {
    expect(function() {
      profiler();
    }).to.throw('pid (number) is required');

    expect(function() {
      profiler(pid);
    }).to.throw('intermediate (object) is required');

    expect(function() {
      profiler(pid, intermediate);
    }).to.throw('aggregate (object) is required');

    expect(function() {
      profiler(pid, intermediate, aggregate);
    }).to.throw('pendingRequests (object) is required');

    expect(function() {
      profiler(pid, intermediate, aggregate, pendingRequests);
    }).to.throw('delta (number) is required');

    expect(function() {
      profiler(pid, intermediate, aggregate, pendingRequests, delta);
    }).to.throw('code (number) is required');
  });
});


describe('profiler does not run successfully', function() {
  var intermediate,
    aggregate,
    pendingRequests,
    pid = 34562,
    delta = 345,
    code = 200;

  var usageOptions = {keepHistory: true};
  var error = 'Error Message';

  beforeEach(function() {
    pendingRequests = new Measured.Counter();
    intermediate = createStat;
    aggregate = createStat;
    
    var usageStub = {
      lookup: function(pid, usageOptions, cb) {
        cb(error, {'cpu': 12.3, 'memory': 456778});
      }
    };

    var Profiler = proxyquire(modulePath, {
      'usage': usageStub
    })
    
    new Profiler(pid, intermediate, aggregate, pendingRequests, delta, code);
  });

  it('updates aggregate', function() {
    expect(aggregate._collection.cpu._min).to.not.equal(12.3);
    expect(aggregate._collection.memory._min).to.not.equal(456778);
    expect(aggregate._collection.latency._min).to.not.equal(345);
    expect(aggregate._collection.codes).to.not.have.property('200');
  });

});

describe('profiler runs successfully', function() {

  var intermediate,
    aggregate,
    pendingRequests,
    pid = 34562,
    delta = 345,
    code = 200;

  var usageOptions = {keepHistory: true};

  beforeEach(function() {
    pendingRequests = new Measured.Counter();
    intermediate = createStat;
    aggregate = createStat;
    
    var usageStub = {
      lookup: function(pid, usageOptions, cb) {
        cb(null, {'cpu': 12.3, 'memory': 456778});
      }
    };

    var Profiler = proxyquire(modulePath, {
      'usage': usageStub
    })
    
    new Profiler(pid, intermediate, aggregate, pendingRequests, delta, code);
  });

  it('adds functions to intermediate object', function() {
    expect(intermediate.addCPU).to.be.an('function');
    expect(intermediate.addMemory).to.be.an('function');
  });

  it('adds functions to aggregate object', function() {
    expect(aggregate.addCPU).to.be.an('function');
    expect(aggregate.addMemory).to.be.an('function');
  });

  it('calls pendingRequests', function() {
    expect(pendingRequests).to.have.property('dec');
  });

  it('updates intermediate', function() {
    expect(intermediate._collection.cpu._min).to.equal(12.3);
    expect(intermediate._collection.memory._min).to.equal(456778);
    expect(intermediate._collection.latency._min).to.equal(345);
    expect(intermediate._collection.codes).to.have.property('200');
  });

  it('updates aggregate', function() {
    expect(aggregate._collection.cpu._min).to.equal(12.3);
    expect(aggregate._collection.memory._min).to.equal(456778);
    expect(aggregate._collection.latency._min).to.equal(345);
    expect(aggregate._collection.codes).to.have.property('200');
  });

});


