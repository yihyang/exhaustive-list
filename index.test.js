const { isExhaustiveList } = require("./index");

test("Will throw exception if first argument is not array", () => {
  expect(() => {
    isExhaustiveList(null);
  }).toThrow("First argument must be an array");
});

test("Will throw exception if second argument is not object", () => {
  expect(() => {
    isExhaustiveList([], null);
  }).toThrow("Second argument must be an object");
});

test("Will return true if provided list is empty", () => {
  expect(isExhaustiveList([])).toStrictEqual({
    result: true,
  });
});

test("Will return true if provided list contains only 1 item", () => {
  expect(isExhaustiveList([{ min: 1, max: 2 }])).toStrictEqual({
    result: true,
  });
});

test('Will throw expection if provided list is do not contain "min" and "max" key', () => {
  expect(() => {
    isExhaustiveList([{}]);
  }).toThrow('The items inside list must contain both "min" and "max" key');
  expect(() => {
    isExhaustiveList([{ min: 1 }]);
  }).toThrow('The items inside list must contain both "min" and "max" key');
  expect(() => {
    isExhaustiveList([{ max: 2 }]);
  }).toThrow('The items inside list must contain both "min" and "max" key');
});

test('Will not throw expection if provided list contains both "min" and "max" key', () => {
  expect(() => {
    isExhaustiveList([{ min: 1, max: 2 }]);
  }).not.toThrow('The items inside list must contain both "min" and "max" key');
});

test("Will return error if list contains duplicate items", () => {
  expect(
    isExhaustiveList([
      { min: 0, max: 1 },
      { min: 0, max: 1 },
    ])
  ).toStrictEqual({
    result: false,
    errors: {
      0: ["Duplicated item"],
      1: ["Duplicated item"],
    },
  });

  expect(
    isExhaustiveList([
      { min: 0, max: 1 },
      { min: 0, max: 1 },
      { min: 3, max: 4 },
      { min: 0, max: 1 },
    ])
  ).toStrictEqual({
    result: false,
    errors: {
      0: ["Duplicated item"],
      1: ["Duplicated item"],
      3: ["Duplicated item"],
    },
  });
});

test('Will return error if options "isSorted" is set to true but the list is not sorted', () => {
  expect(
    isExhaustiveList(
      [
        { min: 2, max: 3 },
        { min: 0, max: 1 },
      ],
      {
        isSorted: true,
      }
    )
  ).toStrictEqual({
    result: false,
    errors: {
      all: ['The list is not sorted when the "isSorted" flag is true'],
    },
  });
});

test('Will not throw expection if options "isSorted" is set to false and the list is not sorted', () => {
  expect(
    isExhaustiveList(
      [
        { min: 2, max: 3 },
        { min: 0, max: 1 },
      ],
      {
        isSorted: false,
      }
    )
  ).not.toBe({
    result: false,
  });
});

test("Will return error if list items min value is greater than max value", () => {
  expect(
    isExhaustiveList(
      [
        { min: 4, max: 3 },
        { min: 2, max: 1 },
      ],
      {
        isSorted: false,
      }
    )
  ).toStrictEqual({
    result: false,
    errors: {
      0: [
        '"min" value is greater than "max"',
        'There is a gap between the current item "min" value with the "max" value of item in previous order',
      ],
      1: [
        '"min" value is greater than "max"',
        'There is a gap between the current item "max" value with the "min" value of item in next order',
      ],
    },
  });
});

test("Will return error if list items overlaps with one another", () => {
  expect(
    isExhaustiveList(
      [
        { min: 1, max: 2 },
        { min: 0, max: 2 },
      ],
      {
        isSorted: false,
      }
    )
  ).toStrictEqual({
    result: false,
    errors: {
      0: [
        '"min" value is smaller than "max" value with the item in previous order',
      ],
      1: [
        '"max" value is greater than "min" value with the item in next order',
      ],
    },
  });
});

test("Will return error if list items has a gap with the next item", () => {
  expect(
    isExhaustiveList(
      [
        { min: 4, max: 5 },
        { min: 0, max: 2 },
      ],
      {
        isSorted: false,
      }
    )
  ).toStrictEqual({
    result: false,
    errors: {
      0: [
        'There is a gap between the current item "min" value with the "max" value of item in previous order',
      ],
      1: [
        'There is a gap between the current item "max" value with the "min" value of item in next order',
      ],
    },
  });
});
