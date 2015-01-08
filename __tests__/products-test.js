// __tests__/sum-test.js
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../client/scripts/index');

describe('sum', function() {
 it('adds 1 + 2 to equal 3', function() {
   var sum = require('../client/scripts/index');
   expect(sum(1, 2)).toBe(3);
 });
});