'use strict';

describe('Module structure', function() {
  it('returns a function', function() {
		var index = require('../index');

		expect(index.name).to.equal('updateUsage');
	});
});
