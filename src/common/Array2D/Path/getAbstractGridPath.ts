/**
 *  Поиск пути между клетками на двухмерном массиве
 *  - оптимизирует поиск выбирая ближайших соседей между стартом и финишом
 *  - отбрасывает варианты за пределами доски
 *  - имеет ограничение на число проверок maxChecks
 *  - может проверять,  проходима клетко или нет!
 *  - время поиска - 0-1 ms даже для путей в сто клеток на MacBook
 *  - форма доски - гекс или квадрат - определяется в getNears
 * **/
import { ColumnRow, IGetPathArray2DProps, isAllWalkable, PathNode } from "./interfaces";

export function getAbstractGridPath({
  from,
  to,
  isWalkable = isAllWalkable,
  columnMin = 0,
  columnMax,
  rowMin = 0,
  rowMax,
  maxChecks = 10000,
  getNears
}: IGetPathArray2DProps): ColumnRow[] {
  if (!isWalkable(to.column, to.row)) return [];

  const openSet: PathNode[] = [];
  const closedSet: Set<string> = new Set();
  const startNode: PathNode = { cell: from, cost: 0 };
  openSet.push(startNode);

  let checkedCells = 0;

  while (openSet.length > 0) {
    // Сортируем список открытых ячеек по эвристическому значению (расстоянию до финишной точки)
    openSet.sort((a, b) => heuristicDistance(a.cell, to) - heuristicDistance(b.cell, to));
    const currentNode = openSet.shift(); // Берем первый элемент из отсортированного списка
    if (!currentNode) break;
    const { cell, cost } = currentNode;
    checkedCells++;
    if (checkedCells > maxChecks) {
      console.warn("checkedCells>maxChecks in getHexPath");
      return [];
    }

    if (cell.column === to.column && cell.row === to.row) {
      return getPathFromNode(currentNode);
    }

    closedSet.add(`${cell.column},${cell.row}`);

    const neighbors = getNears(cell.column, cell.row);
    for (const neighbor of neighbors) {
      if (neighbor.column < columnMin || neighbor.row < rowMin) continue;
      if (columnMax && neighbor.column > columnMax) continue;
      if (rowMax && neighbor.row > rowMax) continue;

      const neighborKey = `${neighbor.column},${neighbor.row}`;
      if (!closedSet.has(neighborKey) && isWalkable(neighbor.column, neighbor.row)) {
        const neighborNode: PathNode = { cell: neighbor, cost: cost + 1, previous: currentNode };
        const existingNeighbor = openSet.find((n) => n.cell.column === neighbor.column && n.cell.row === neighbor.row);
        if (!existingNeighbor || neighborNode.cost < existingNeighbor.cost) {
          if (existingNeighbor) openSet.splice(openSet.indexOf(existingNeighbor), 1);
          openSet.push(neighborNode);
        }
      }
    }
  }

  return [];
}

/**  Восстанавливаем путь, проходя от конечного узла к начальному **/
function getPathFromNode(currentNode: PathNode) {
  const path: ColumnRow[] = [];
  let current: PathNode | undefined = currentNode;

  while (current) {
    path.unshift(current.cell);
    current = current.previous;
  }
  return path;
}

// Функция расчета эвристического значения (эвклидово расстояние) между двумя ячейками
function heuristicDistance(cell: ColumnRow, target: ColumnRow): number {
  const dx = cell.column - target.column;
  const dy = cell.row - target.row;
  return Math.sqrt(dx * dx + dy * dy);
}
