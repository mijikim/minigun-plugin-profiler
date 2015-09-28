var Measured = require('measured');

function Stats() {
  this.collection = {
    cpu: new Measured.Histogram(),
    memory: new Measured.Histogram()
  };
  return this;
};

Stats.prototype.addCPU = function(cpu) {
  this.collection.cpu.update(cpu);
  return this;
};

Stats.prototype.addMemory = function(memory) {
  this.collection.memory.update(memory);
  return this;
};

Stats.prototype.report = function() {
  var cpu = this.collection.cpu.toJSON();
  var memory = this.collection.memory.toJSON();

  var result = {
    cpu: {
      min: cpu.min !== 'undefined' ? Math.round(cpu.min * 100) / 100 : null,
      max: cpu.max ? Math.round(cpu.max * 100) / 100 : null,
      median: cpu.median ? Math.round(cpu.median * 100) / 100 : null,
      p95: cpu.p95 ? Math.round(cpu.p95 * 100) / 100 : null,
      p99: cpu.p99 ? Math.round(cpu.p99 * 100) / 100 : null  
    },
    memory: {
      min: memory.min ? Math.round(memory.min / (1024 * 1024) * 100) / 100 : null,
      max: memory.max ? Math.round(memory.max / (1024 * 1024) * 100) / 100 : null,
      median: memory.median ? Math.round(memory.median / (1024 * 1024) * 100) / 100 : null,
      p95: memory.p95 ? Math.round(memory.p95 / (1024 * 1024) * 100) / 100  : null,
      p99: memory.p99 ? Math.round(memory.p99 / (1024 * 1024) * 100) / 100  : null
    }
  };

  return result;
};

Stats.prototype.reset = function() {
  this.collection.cpu.reset();
  this.collection.memory.reset();
};

module.exports = Stats;
