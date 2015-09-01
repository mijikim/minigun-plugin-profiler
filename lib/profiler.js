'use strict';

var usage = require('usage'),
  assert = require('assert-plus');

var chkPropsOfVariable = function(object) {
  return 'completedRequest' in object &&
  'addLatency' in object &&
  'addCode' in object;
};

function updateUsage(pid, intermediate, aggregate, pendingRequests, delta, code) {

  //Validate the inputs
  // assert.number(pid, 'pid');
  assert.object(intermediate, 'intermediate');
  assert.object(aggregate, 'aggregate');
  assert.object(pendingRequests, 'pendingRequests');
  assert.number(delta, 'delta');
  assert.number(code, 'code');

  var usageOptions = {keepHistory: true};

  intermediate.addCPU = function(cpu) {
    this._collection.cpu.update(cpu);
    return this;
  };

  aggregate.addCPU = function(cpu) {
    this._collection.cpu.update(cpu);
    return this;
  };

  intermediate.addMemory = function(memory) {
    this._collection.memory.update(memory);
    return this;
  };

  aggregate.addMemory = function(memory) {
    this._collection.memory.update(memory);
    return this;
  };

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

    if (chkPropsOfVariable(intermediate)) {
      intermediate.completedRequest();
      intermediate.addLatency(delta);
      intermediate.addCode(code);
    }

    if (chkPropsOfVariable(aggregate)) {
      aggregate.completedRequest();
      aggregate.addLatency(delta);
      aggregate.addCode(code);
    }

    if ('dec' in pendingRequests) {
      pendingRequests.dec();
    }

  });
}

module.exports = updateUsage;
