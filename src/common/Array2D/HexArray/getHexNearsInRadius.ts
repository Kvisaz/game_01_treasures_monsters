import { ColumnRow } from "../interfaces";
import { axialToCube, cubeToAxial } from "./axialToCube";

export function getHexNearsInRadius(column: number, row: number, cellRadius: number): ColumnRow[] {
  const neighborsInRadius: ColumnRow[] = [];
  const { x: centerX, y: centerY, z: centerZ } = axialToCube(column, row);

  // Обход всех координат в пределах радиуса
  for (let dx = -cellRadius; dx <= cellRadius; dx++) {
    for (let dy = Math.max(-cellRadius, -dx - cellRadius); dy <= Math.min(cellRadius, -dx + cellRadius); dy++) {
      const dz = -dx - dy;
      const neighborX = centerX + dx;
      const neighborY = centerY + dy;
      const neighborZ = centerZ + dz;

      if (dx !== 0 || dy !== 0 || dz !== 0) {
        const neighbor = cubeToAxial(neighborX, neighborY, neighborZ);
        neighborsInRadius.push(neighbor);
      }
    }
  }

  return neighborsInRadius;
}

export function getSafeHexNearsInRadius(props: {
  column: number;
  columns: number;
  row: number;
  rows: number;
  cellRadius: number;
  includeCenter: boolean;
}): ColumnRow[] {
  const { column, row, cellRadius, rows, columns, includeCenter } = props;
  const neighborsInRadius: ColumnRow[] = [];
  const { x: centerX, y: centerY, z: centerZ } = axialToCube(column, row);

  // Обход всех координат в пределах радиуса
  for (let dx = -cellRadius; dx <= cellRadius; dx++) {
    for (let dy = Math.max(-cellRadius, -dx - cellRadius); dy <= Math.min(cellRadius, -dx + cellRadius); dy++) {
      const dz = -dx - dy;
      const neighborX = centerX + dx;
      const neighborY = centerY + dy;
      const neighborZ = centerZ + dz;
      const isNotCenter = dx !== 0 || dy !== 0 || dz !== 0;
      if (includeCenter || isNotCenter) {
        const neighbor = cubeToAxial(neighborX, neighborY, neighborZ);
        if (isSafe(neighbor, columns, rows)) {
          neighborsInRadius.push(neighbor);
        }
      }
    }
  }

  return neighborsInRadius;
}

function isSafe(columnRow: ColumnRow, columns: number, rows: number): boolean {
  const { column, row } = columnRow;
  return column >= 0 && column < columns && row >= 0 && row < rows;
}
