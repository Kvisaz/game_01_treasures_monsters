import { CellMapCollider } from "./CellMapCollider";
import { CellMapObject } from "./interfaces";

const cellSize10 = 10;

describe("CellMapCollider ordinate test", () => {
  const testCases = [
    { xOrY: 0, cellSize: 10, expected: 0 },
    { xOrY: 5, cellSize: 10, expected: 0 },
    { xOrY: 10, cellSize: 10, expected: 1 },
    { xOrY: 15, cellSize: 10, expected: 1 },
    { xOrY: 20, cellSize: 10, expected: 2 },
    { xOrY: 25, cellSize: 10, expected: 2 },
    { xOrY: 30, cellSize: 10, expected: 3 },
    { xOrY: 35, cellSize: 10, expected: 3 },
    { xOrY: 40, cellSize: 10, expected: 4 },
    { xOrY: 45, cellSize: 10, expected: 4 },
    { xOrY: 50, cellSize: 10, expected: 5 },
    // Дополнительные тестовые случаи могут быть добавлены здесь
  ];

  testCases.forEach(({ xOrY, cellSize, expected }) => {
    it(`ordinate - return ${expected} for input ${xOrY} with cell size ${cellSize}`, () => {
      const collider = new CellMapCollider({
        cellSize,
      });
      const result = collider.getCellOrdinate(xOrY);
      expect(result).toBe(expected);
    });
  });
});

describe("CellMapCollider getCurrentObjectCells", () => {
  let collider: CellMapCollider;
  beforeEach(() => {
    const worldWidth = 100;
    const worldHeight = 100;
    const cellSize = 10;
    collider = new CellMapCollider({ cellSize });
  });

  it("small object", () => {
    const testObject: CellMapObject = {
      id: "test",
      left: 2,
      top: 2,
      width: 5,
      height: 5,
    };
    collider.add(testObject);

    const placedCells = collider.getCurrentObjectCellsAsArray(testObject);

    // Проверяем, что объект размещен в ожидаемом количестве ячеек
    expect(placedCells.length).toBeGreaterThan(0);
    expect(placedCells.length).toBe(1);

    // Проверяем, что каждая ячейка содержит объект с id 'test'
    placedCells.forEach((cellObjects) => {
      expect(cellObjects).toHaveProperty("test");
    });
  });

  it("small object on border 1 and 2 column", () => {
    const testObject: CellMapObject = {
      id: "test",
      left: 5,
      top: 2,
      width: 5,
      height: 5,
    };
    collider.add(testObject);

    const placedCells = collider.getCurrentObjectCellsAsArray(testObject);

    // Проверяем, что объект размещен в ожидаемом количестве ячеек
    expect(placedCells.length).toBeGreaterThan(0);
    expect(placedCells.length).toBe(2);

    // Проверяем, что каждая ячейка содержит объект с id 'test'
    placedCells.forEach((cellObjects) => {
      expect(cellObjects).toHaveProperty("test");
    });
  });

  it("small object", () => {
    const cellSize = 10;
    const collider = new CellMapCollider({ cellSize });

    const testObject: CellMapObject = {
      id: "test",
      left: 15,
      top: 15,
      width: 20,
      height: 20,
    };
    collider.add(testObject);

    const placedCells = collider.getCurrentObjectCellsAsArray(testObject);

    // Проверяем, что объект размещен в ожидаемом количестве ячеек
    expect(placedCells.length).toBeGreaterThan(0);
    expect(placedCells.length).toBe(1);

    // Проверяем, что каждая ячейка содержит объект с id 'test'
    placedCells.forEach((cellObjects) => {
      expect(cellObjects).toHaveProperty("test");
    });
  });
});

describe("CellMapCollider getFirstCollisionObject", () => {
  let collider: CellMapCollider;

  beforeEach(() => {
    collider = new CellMapCollider({
      cellSize: cellSize10,
    });
  });

  test("should return collision object in cellsize", () => {
    const obj1 = {
      id: "1",
      left: 5,
      top: 5,
      width: cellSize10,
      height: cellSize10,
    };

    const obj2 = {
      id: "2",
      left: 15,
      top: 15,
      width: cellSize10,
      height: cellSize10,
    };

    collider.add(obj1);
    collider.add(obj2);

    const collisionObj = collider.getFirstCollisionObject(obj2);

    expect(collisionObj).toEqual(obj1);
  });

  test(" object smaller than cellsize", () => {
    const size = 2;
    const obj1 = {
      id: "1",
      left: 0,
      top: 0,
      width: size,
      height: size,
    };

    const obj2 = {
      id: "2",
      left: 5,
      top: 5,
      width: size,
      height: size,
    };

    const obj3 = {
      id: "3",
      left: 2,
      top: 2,
      width: size,
      height: size,
    };

    collider.add(obj1);
    collider.add(obj2);
    collider.add(obj3);

    const collisionObj = collider.getFirstCollisionObject(obj1);

    expect(collisionObj).toEqual(obj3);
  });

  test("should return null if no collision", () => {
    const obj = {
      id: "1",
      left: 5,
      top: 5,
      width: 5,
      height: 5,
    };

    collider.add(obj);

    const collisionObj = collider.getFirstCollisionObject(obj);

    expect(collisionObj).toEqual(undefined);
  });
});

describe("getFirstValueWithKeyNotEqual", () => {
  interface TestItem {
    data: Record<number | string, string>;
    id: number | string;
    expected: string | undefined;
  }

  const testData: TestItem[] = [
    {
      data: { 1: "a", 2: "b", 3: "c" },
      id: 2,
      expected: "a",
    },
    {
      data: { 1: "a", 2: "b" },
      id: 1,
      expected: "b",
    },
    {
      data: { 1: "a" },
      id: 1,
      expected: undefined,
    },
  ];

  test.each(testData)(
    "should return $expected when id is $id",
    ({ data, id, expected }) => {
      const result = getFirstValueWithKeyNotEqual(data, id);
      expect(result).toEqual(expected);
    }
  );
});

export function getFirstValueWithKeyNotEqual<T>(
  object: Record<number | string, T>,
  id: number | string
): T | undefined {
  for (const key in object) {
    if (key != id) {
      return object[key];
    }
  }

  return undefined;
}

describe("CellMapCollider update", () => {
  let collider: CellMapCollider;

  beforeEach(() => {
    collider = new CellMapCollider({ cellSize: 10 });
  });

  it("should remove object from single cell", () => {
    const object = { id: "1", left: 0, top: 0, width: 10, height: 10 };

    collider.add(object);

    collider.remove(object);

    expect(collider.getCurrentObjectCells(object)).toEqual({});
  });

  it("should update object position", () => {
    const object = { id: "1", left: 10, top: 10, width: 5, height: 5 };

    collider.add(object);

    expect(collider.getCurrentObjectCells(object)).toEqual({
      "1_1": { "1": object },
    });

    const oldPlace = { ...object };
    collider.update(object, 20, 20);

    expect(collider.getCurrentObjectCells(oldPlace)).toEqual({});

    expect(collider.getCurrentObjectCells(object)).toEqual({
      "2_2": { "1": object },
    });
  });
});
