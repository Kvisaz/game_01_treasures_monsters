/**
 *  Рассчитать путь по двухмерной сетке ячеек между двумя точками
 *  @return IPoint[] массив центров ячеек с размером cellSize
 *  все ячейки рассчитываются как центры в ячейках cellSize
 *
 *  Используется алгоритм Брезенхэма
 *  разработан Джеком Элтоном Брезенхэмом в компании IBM в 1962 году.
 *  один из старейших алгоритмов в машинной графике
 *  Алгоритм широко используется, в частности, для рисования линий на экране компьютера.
 */
import { IPoint } from "./interfaces";

export function generatePathThroughCells(
  point1: IPoint,
  point2: IPoint,
  cellSize: number
): IPoint[] {
  const points: IPoint[] = [];
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const maxSteps = Math.max(Math.abs(dx), Math.abs(dy)) / cellSize;
  const xStep = dx / maxSteps;
  const yStep = dy / maxSteps;

  for (let step = 0; step <= maxSteps; step++) {
    // Calculate intermediate point
    const x = point1.x + xStep * step;
    const y = point1.y + yStep * step;

    // Adjust to the center of the nearest cell
    const adjustedX = Math.floor(x / cellSize) * cellSize + cellSize / 2;
    const adjustedY = Math.floor(y / cellSize) * cellSize + cellSize / 2;

    const isEmpty = points.length === 0;
    const prevCell = points[points.length - 1];
    const isSameCellAsPrevious = !isEmpty && prevCell.x === adjustedX && prevCell.y === adjustedY;
    // Add the point if it's new or the list is empty
    if (isEmpty || !isSameCellAsPrevious) {
      points.push({ x: adjustedX, y: adjustedY });
    }
  }

  return points;
}
