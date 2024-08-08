import { ColumnRow } from "../interfaces";

export function getHexNears(column: number, row: number): ColumnRow[] {
  const neighbors: ColumnRow[] = [];
  const isOddCol = column % 2 === 0;
  // Define the possible relative positions for neighbors in a hex grid
  const directions = isOddCol
    ? [
      { column: -1, row: 0 },
      { column: -1, row: -1 },
      { column: 0, row: -1 },
      { column: 1, row: -1 },
      { column: 1, row: 0 },
      { column: 0, row: 1 },
    ]
    : [
      { column: -1, row: 1 },
      { column: -1, row: 0 },
      { column: 0, row: -1 },
      { column: 1, row: 0 },
      { column: 1, row: 1 },
      { column: 0, row: 1 },
    ];

  // Calculate the neighbor coordinates
  for (const direction of directions) {
    const neighborColumn = column + direction.column;
    const neighborRow = row + direction.row;
    neighbors.push({ column: neighborColumn, row: neighborRow });
  }

  return neighbors;
}
