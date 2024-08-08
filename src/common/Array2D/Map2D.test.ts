import { Map2D } from "./Map2D";
import { IArray2DCell } from "./interfaces";

describe("Map2D", () => {
  it("adds and gets cells", () => {
    const map = new Map2D<string>();

    map.add({ column: 1, row: 2, data: "test" });

    const cell = map.get(1, 2);

    expect(cell).toEqual({ column: 1, row: 2, data: "test" });
  });

  it("overrides value for existing cell", () => {
    const map = new Map2D<number>();

    map.add({ column: 1, row: 2, data: 5 });
    map.add({ column: 1, row: 2, data: 10 });

    expect(map.get(1, 2)?.data).toBe(10);
  });

  it("checks if cell exists", () => {
    const map = new Map2D<string>();

    map.add({ column: 1, row: 2, data: "test" });

    expect(map.has(1, 2)).toBeTruthy();
    expect(map.has(2, 1)).toBeFalsy();
  });

  it("deletes cells", () => {
    const map = new Map2D<string>();

    map.add({ column: 1, row: 2, data: "test" });
    map.delete(1, 2);

    expect(map.has(1, 2)).toBeFalsy();
  });

  it("clears all cells", () => {
    const map = new Map2D<string>();

    map.add({ column: 1, row: 2, data: "test" });

    map.clear();

    expect(map.size).toBe(0);
  });

  it("iterates cells with forEach", () => {
    const cells: IArray2DCell<string>[] = [];

    const map = new Map2D<string>();

    map.add({ column: 1, row: 2, data: "cell1" });
    map.add({ column: 3, row: 4, data: "cell2" });

    map.forEach((cell) => {
      cells.push(cell);
    });

    expect(cells).toEqual([
      { column: 1, row: 2, data: "cell1" },
      { column: 3, row: 4, data: "cell2" },
    ]);
  });

  it("returns correct size", () => {
    const map = new Map2D<number>();

    map.add({ column: 1, row: 2, data: 5 });
    map.add({ column: 3, row: 4, data: 10 });

    expect(map.size).toBe(2);

    map.delete(1, 2);

    expect(map.size).toBe(1);
  });

  it("allows different data types", () => {
    interface User {
      name: string;
    }

    const map = new Map2D<User>();

    map.add({ column: 1, row: 1, data: { name: "John" } });

    const user = map.get(1, 1);

    expect(user?.data?.name).toBe("John");
  });
});
