'use strict';

var assert = require('assert-plus'),
  Stats = require('./stats'),
  usage = require('usage');

function updateUsage(config, ee) {
  var self = this;
  self._report = [];

  var lookupInterval;
  
  //Validate pid from config
  assert.number(config.plugins.profiler.pid, 'pid');

  var pid = config.plugins.profiler.pid;
  var interval = config.plugins.profiler.interval || 2000;

  var intermediate = new Stats();
  var intermediate = new Stats();

  var usageOptions = {keepHistory: true};

  ee.on('phaseStarted', function() {
    lookupInterval = setInterval(function() {
      usage.lookup(pid, usageOptions, function(err, result) {
        if (err) {
          return;
        }

        var cpu = result.cpu;
        var memory = result.memory;

        intermediate.addCPU(cpu);
        intermediate.addMemory(memory);

        aggregate.addCPU(cpu);
        aggregate.addMemory(memory);
      });    
    }, interval);
  });

  ee.on('stats', function(stats) {
    var report = intermediate.report();
    self._report.push({
      timestamp: stats.timestamp,
      value: report
    });
    intermediate.reset();
  });

  ee.on('phaseCompleted', function() {
    var report = aggregate.report();
    self._report.push({
      timestamp: 'aggregate',
      value: report
    });
  });

  ee.on('done', function() {
    clearInterval(lookupInterval);
  });

  return this;  
}

updateUsage.prototype.report = function report() {
  if(this._report.length === 0) {
    return null;
  } else {
    return this._report;
  }
};

module.exports = updateUsage;
