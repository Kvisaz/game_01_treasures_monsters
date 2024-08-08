import { CellCollider } from "./index";

describe("CellCollider", () => {
  it("test sizes", () => {
    const cellCollider1 = new CellCollider({
      worldWidth: 10,
      worldHeight: 10,
      worldCellSize: 1,
    });
    const expected = {
      columns: 10,
      rows: 10,
      columnMax: 9,
      rowMax: 9,
    };
    expect(cellCollider1.grid.cols).toBe(expected.columns);
    expect(cellCollider1.grid.rows).toBe(expected.rows);
    expect(cellCollider1.grid.lastColumn).toBe(expected.columnMax);
    expect(cellCollider1.grid.lastRow).toBe(expected.rowMax);
  });

  it("getCellOrdinate", () => {
    const cellCollider1 = new CellCollider({
      worldWidth: 10,
      worldHeight: 10,
      worldCellSize: 1,
    });
    const tests = [
      { x: 0, y: 0, column: 0, row: 0 },
      { x: 1, y: 0, column: 1, row: 0 },
      { x: 2, y: 0, column: 2, row: 0 },
      { x: 10, y: 0, column: 10, row: 0 },
    ];

    tests.forEach((test) => {
      expect(cellCollider1.getCellOrdinate(test.x)).toBe(test.column);
      expect(cellCollider1.getCellOrdinate(test.y)).toBe(test.row);
    });
  });

  it("getCellOrdinate radius 5", () => {
    const cellCollider1 = new CellCollider({
      worldWidth: 10,
      worldHeight: 10,
      worldCellSize: 5,
    });
    const tests = [
      { x: 0, y: 0, column: 0, row: 0 },
      { x: 1, y: 0, column: 0, row: 0 },
      { x: 2, y: 0, column: 0, row: 0 },
      { x: 9, y: 0, column: 1, row: 0 },
      { x: 10, y: 0, column: 2, row: 0 },
    ];

    tests.forEach((test) => {
      expect(cellCollider1.getCellOrdinate(test.x)).toBe(test.column);
      expect(cellCollider1.getCellOrdinate(test.y)).toBe(test.row);
    });
  });

  it("test place", () => {
    const cellCollider1 = new CellCollider({
      worldWidth: 10,
      worldHeight: 10,
      worldCellSize: 1,
    });
    const circles = [
      { id: 3, centerX: 0, centerY: 0, radius: 1 },
      { id: 1, centerX: 2, centerY: 2, radius: 1 },
      { id: 2, centerX: 5, centerY: 5, radius: 2 },
    ];
    circles.forEach((circle) =>
      cellCollider1.placeCircleObject(
        circle.id,
        circle.centerX,
        circle.centerY,
        circle.radius
      )
    );

    expect(cellCollider1.getObjectId(0, 0)).toEqual(3);

    expect(cellCollider1.getObjectId(2, 2)).toEqual(1);
    expect(cellCollider1.getObjectId(1, 1)).toEqual(1);
    expect(cellCollider1.getObjectId(1, 2)).toEqual(1);
    expect(cellCollider1.getObjectId(2, 1)).toEqual(1);
  });
});

describe("CellCollider get cells", () => {
  it("test get cells", () => {
    const cellCollider1 = new CellCollider({
      worldWidth: 10,
      worldHeight: 10,
      worldCellSize: 1,
    });
    const circles = [
      { id: 3, centerX: 0, centerY: 0, radius: 1 },
      { id: 1, centerX: 2, centerY: 2, radius: 1 },
      { id: 2, centerX: 5, centerY: 5, radius: 2 },
    ];
    circles.forEach((circle) =>
      cellCollider1.placeCircleObject(
        circle.id,
        circle.centerX,
        circle.centerY,
        circle.radius
      )
    );

    expect(cellCollider1.grid.length).toEqual(100);

    const cells1 = cellCollider1.getCellsInSquare(0, 0, 10, 10);
    expect(cells1.length).toEqual(100);

    const cells2 = cellCollider1.getCellsInSquare(0, 0, 0, 0);
    expect(cells2.length).toEqual(1);

    expect(cellCollider1.getCellsInSquare(0, 0, 1, 0).length).toEqual(2);
    expect(cellCollider1.getCellsInSquare(0, 0, 1, 1).length).toEqual(4);
    expect(cellCollider1.getCellsInSquare(0, 0, 4, 4).length).toEqual(25);
  });

  it("test get cells 2", () => {
    const cellCollider1 = new CellCollider({
      worldWidth: 10,
      worldHeight: 10,
      worldCellSize: 5,
    });
    const circles = [
      { id: 3, centerX: 0, centerY: 0, radius: 1 },
      { id: 1, centerX: 1, centerY: 1, radius: 1 },
    ];
    circles.forEach((circle) =>
      cellCollider1.placeCircleObject(
        circle.id,
        circle.centerX,
        circle.centerY,
        circle.radius
      )
    );

    expect(cellCollider1.grid.length).toEqual(4);

    const cells1 = cellCollider1.getCellsInSquare(0, 0, 10, 10);
    expect(cells1.length).toEqual(4);

    expect(cellCollider1.getCellsInSquare(0, 0, 0, 0).length).toEqual(1);
    expect(cellCollider1.getCellsInSquare(0, 0, 4, 4).length).toEqual(1);
    expect(cellCollider1.getCellsInSquare(0, 0, 5, 0).length).toEqual(2);
    expect(cellCollider1.getCellsInSquare(0, 0, 5, 5).length).toEqual(4);
    expect(cellCollider1.getCellsInSquare(0, 0, 100, 100).length).toEqual(4);
    // потому что квадрат вышел за рамки сетки
    expect(
      cellCollider1.getCellsInSquare(-1000, -1000, 100, 100).length
    ).toEqual(0);
    // потому что квадрат захватил сетку
    expect(cellCollider1.getCellsInSquare(-10, -10, 20, 20).length).toEqual(4);
  });

  it("test get objects", () => {
    const cellCollider1 = new CellCollider({
      worldWidth: 10,
      worldHeight: 10,
      worldCellSize: 1,
    });
    const circles = [
      { id: 3, centerX: 0, centerY: 0, radius: 1 },
      { id: 1, centerX: 2, centerY: 2, radius: 1 },
      { id: 2, centerX: 5, centerY: 5, radius: 2 },
    ];
    circles.forEach((circle) =>
      cellCollider1.placeCircleObject(
        circle.id,
        circle.centerX,
        circle.centerY,
        circle.radius
      )
    );

    const objectIds = cellCollider1.getObjectIdsInSquare(0, 0, 10, 10);

    console.log("cellCollider1", cellCollider1.grid);

    const ids = Object.values(objectIds);
    expect(ids.length).toEqual(3);
    expect(objectIds[1]).toEqual(1);
    expect(objectIds[2]).toEqual(2);
    expect(objectIds[3]).toEqual(3);
    expect(objectIds[5]).toEqual(undefined);
  });
});
