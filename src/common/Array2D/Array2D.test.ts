import { Array2D } from "./Array2D";

describe("Array2D", () => {
  let array2D: Array2D<number>;

  beforeEach(() => {
    array2D = new Array2D(3, 2);
  });

  describe("size", () => {
    test("should return correct rowLength", () => {
      expect(array2D.rowLength).toBe(3);
    });

    test("should return correct colHeight", () => {
      expect(array2D.colHeight).toBe(2);
    });

    test(" getters", () => {
      expect(array2D.firstRow).toBe(0);
      expect(array2D.lastRow).toBe(1);
      expect(array2D.firstColumn).toBe(0);
      expect(array2D.lastColumn).toBe(2);
    });
  });

  describe("get cells", () => {
    test("should get cell value", () => {
      array2D.setCell(1, 1, 5);
      expect(array2D.getCell(1, 1).data).toBe(5);
    });

    test("should set cell value", () => {
      array2D.setCell(1, 1, 5);
      expect(array2D.getCell(1, 1).data).toBe(5);
    });

    test("get all cells", () => {
      const copy = array2D.getAllCells();
      expect(copy.length).toBe(6);
      expect(copy.length).toBe(array2D.cols * array2D.rows);
    });
  });

  describe("moveCell", () => {
    test("should move cell data", () => {
      array2D.setCell(1, 1, 5);
      array2D.moveCell(1, 1, 2, 0);
      expect(array2D.getCell(2, 0).data).toBe(5);
      expect(array2D.getCell(1, 1).data).toBeNull();
    });
  });

  describe("swap", () => {
    test("should swap cell data", () => {
      array2D.setCell(1, 1, 5);
      array2D.setCell(2, 0, 7);
      array2D.swap(1, 1, 2, 0);
      expect(array2D.getCell(2, 0).data).toBe(5);
      expect(array2D.getCell(1, 1).data).toBe(7);
    });
  });

  describe("forEach", () => {
    test("should iterate all cells", () => {
      const mockCallback = jest.fn();
      array2D.forEach(mockCallback);
      expect(mockCallback).toBeCalledTimes(6); // 3 * 2 cells
    });
  });

  test("should set and get cells by col/row", () => {
    const rows = 3;
    const cols = 2;

    array2D = new Array2D(cols, rows);

    // Заполняем массив числами
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const value = col + row * 10;
        array2D.setCell(col, row, value);
      }
    }

    // Проверяем значения
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const value = col + row * 10;
        expect(array2D.getCell(col, row).data).toBe(value);
      }
    }
  });

  test("inside, outside", () => {
    const rows = 3;
    const cols = 2;

    array2D = new Array2D(cols, rows);

    // Заполняем массив числами
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const value = col + row * 10;
        array2D.setCell(col, row, value);
      }
    }

    // Проверяем значения
    for (let i = 0; i < 1000; i++) {
      const col = Math.round(Math.random() * cols * 2 - cols);
      const row = Math.round(Math.random() * rows * 2 - rows);
      expect(array2D.isInside(col, row)).toBe(
        col >= 0 && col < cols && row >= 0 && row < rows
      );
    }
  });

  test("get safe", () => {
    const rows = 3;
    const cols = 2;

    array2D = new Array2D(cols, rows);

    // Заполняем массив числами
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const value = col + row * 10;
        array2D.setCell(col, row, value);
      }
    }

    expect(array2D.getCellSafe(-1, 0)?.data).toBe(undefined);
    expect(array2D.getCellSafe(-11, 0)?.data).toBe(undefined);
    expect(array2D.getCellSafe(0, 0)?.data).toBe(0);
    expect(array2D.getCellSafe(0, 1)?.data).toBe(10);
    expect(array2D.getCellSafe(3, 1)?.data).toBe(undefined);
    expect(array2D.getCellSafe(2, 3)?.data).toBe(undefined);
    expect(array2D.getCellSafe(1, 2)?.data).toBe(21);
  });

  test("get all in square", () => {
    const cols = 2;
    const rows = 3;

    array2D = new Array2D(cols, rows);

    // Заполняем массив числами
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const value = col + row * 10;
        array2D.setCell(col, row, value);
      }
    }

    let cells = array2D.getInSquare(0, 0, 0);
    expect(cells.length).toBe(1);
    expect(cells[0]?.data).toBe(0);

    cells = array2D.getInSquare(1, 2, 0);
    expect(cells.length).toBe(1);
    expect(cells[0]?.data).toBe(21);

    cells = array2D.getInSquare(0, 0, 1);
    expect(cells.length).toBe(4);
    expect(cells[0]?.data).toBe(0);
    expect(cells[1]?.data).toBe(1);
    expect(cells[2]?.data).toBe(10);
    expect(cells[3]?.data).toBe(11);
  });
});
