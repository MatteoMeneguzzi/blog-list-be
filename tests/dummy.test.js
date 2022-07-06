const { dummy } = require('../utils/list_helper');

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = [];

    const result = dummy(blogs);
    expect(result).toBe(1);
  });
});
