'use strict';

var EventEmitter = require('events').EventEmitter,
  modulePath = '../../lib/profiler',
  proxyquire = require('proxyquire');  

describe('profiler structure', function() {
  var Profiler = require(modulePath),
    config = {
      plugins: {
        profiler: {pid: 34562}
      }
    };
    ee = new EventEmitter();

  it('returns updateUsage function', function() {
    expect(profiler.name).to.equal('updateUsage');
  });

  it('has report function', function() {
    var profiler = new Profiler(config, ee);
    expect('report' in profiler).to.equal(true);
  });

  it('validates pid', function() {
    config.plugins.profiler.pid = 'hi';

    expect(function() {
      new Profiler(config, ee);
    }).to.throw('pid (number) is required');
  });
});

describe('profiler runs successfully', function() {
  var usageOptions = {keepHistory: true},
    usageStub = {
      lookup: function(pid, usageOptions, cb) {
        cb(null, {'cpu': 12.3, 'memory': 456778});
      }
    },
    Profiler = proxyquire(modulePath, {
      'usage': usageStub
    }),
    config = {
      plugins: {
        profiler: {pid: 34562}
      }
    };
    ee = new EventEmitter();
    
  it('listens to EventEmitter', function() {
    var profiler = new Profiler(config, ee);

    ee.emit('phaseStarted');
    var report = profiler.report();
    expect(report).to.equal(null);

    ee.emit('stats', {timestamp: '2015-09-22T22:47:53.505Z'});
    var report = profiler.report();
    expect('timestamp' in report[0]).to.equal(true);
    expect(report[0].timestamp).to.equal('2015-09-22T22:47:53.505Z');

    ee.emit('phaseCompleted');
    var report = profiler.report();
    expect(report[1].timestamp).to.equal('aggregate');
  });
});
