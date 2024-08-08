import { isCollide } from "./isCollide";
import { IRectangleCollideTest } from "./interfaces";

describe("isCollide", () => {
  it("should check two near objects", function () {
    const obj1 = {
      left: 0,
      top: 0,
      width: 10,
      height: 10,
    };
    const obj2 = {
      left: 10,
      top: 10,
      width: 10,
      height: 10,
    };
    expect(isCollide(obj1, obj2)).toBe(true);
  });

  it("array", () => {
    const testData: IRectangleCollideTest[] = [
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
        expected: true,
      },
    ];
    testData.forEach((data) => {
      expect(isCollide(data.obj1, data.obj2)).toBe(data.expected);
    });
  });
});
