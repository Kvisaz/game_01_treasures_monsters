import { ColumnRow } from "../interfaces";

/**
 *
 * https://www.redblobgames.com/grids/hexagons/
 *
 * рецепт из нейронки
 * В гексагональной сетке можно представлять
 * каждую клетку тремя координатами (x, y, z), где сумма всех трех координат всегда равна нулю (x + y + z = 0).
 * Это позволяет использовать 3D-координаты для вычисления расстояний и соседей.
 */

export function axialToCube(column: number, row: number): { x: number; y: number; z: number } {
  const x = column;
  const z = row - (column - (column & 1)) / 2;
  const y = -x - z;
  return { x, y, z };
}

// Преобразование из 3D в 2D координаты
export function cubeToAxial(x: number, y: number, z: number): ColumnRow {
  const column = x;
  const row = z + (x - (x & 1)) / 2;
  return { column, row };
}
