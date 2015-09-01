'use strict';

var modulePath = '../../lib/profiler',
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

describe('profiler runs successfully', function() {
  var usageSpy = sinon.spy(),
    lookupSpy = sinon.spy(),
    profiler = proxyquire(modulePath, {
    'usage': usageSpy
    }),
    pid = 34562,
    intermediate = {},
    aggregate = {},
    pendingRequests = {},
    delta = 345,
    code = 200;

  // usageStub.callsArgWithAsync
  // var chkPropsOfVariable = sinon.spy();

  // usageStub.returns({
  //   lookup: lookupSpy
  // });

  it('calls usage.lookup', function() {
    profiler(pid, intermediate, aggregate, pendingRequests, delta, code);
    console.log(usageSpy)
    expect(usageSpy).to.be.calledOnce
  });

  // it('updats cpu', function() {
  //   profiler(pid, intermediate, aggregate, pendingRequests, delta, code);

  //   lookupSpy.callsArgWith(1)

  //   expect(usageStub).to.be.called
  // });

  it('adds functions to intermediate object', function() {
    profiler(pid, intermediate, aggregate, pendingRequests, delta, code);

    expect(intermediate.addCPU).to.be.an('function');

    expect(intermediate.addMemory).to.be.an('function');
  });

  it('adds functions to aggregate object', function() {
    profiler(pid, intermediate, aggregate, pendingRequests, delta, code);

    expect(aggregate.addCPU).to.be.an('function');

    expect(aggregate.addMemory).to.be.an('function');
  });


});
