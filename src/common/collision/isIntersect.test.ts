import { isIntersect } from "./isIntersect";

const testData = [
  {
    obj1: { left: 0, top: 0, width: 10, height: 10 },
    obj2: { left: 5, top: 5, width: 10, height: 10 },
    expected: true,
  },
  {
    obj1: { left: 0, top: 0, width: 10, height: 10 },
    obj2: { left: 20, top: 20, width: 10, height: 10 },
    expected: false,
  },
  {
    obj1: { left: 0, top: 0, width: 10, height: 5 },
    obj2: { left: 5, top: 5, width: 5, height: 10 },
    expected: false,
  },
];

describe("isIntersect", () => {
  testData.forEach((data) => {
    it(`should return ${data.expected} for ${JSON.stringify(
      data.obj1
    )} and ${JSON.stringify(data.obj2)}`, () => {
      expect(isIntersect(data.obj1, data.obj2)).toBe(data.expected);
    });
  });
});
