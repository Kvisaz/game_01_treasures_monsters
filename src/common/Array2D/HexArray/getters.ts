import { getColumn, getRow } from "../SimpleArray2D";

export function getHexTileStepX(width: number): number {
  return 0.75 * width;
}

export function getHexTileStepY(width: number): number {
  return (Math.sqrt(3) * width) / 2;
}

export function getHexColumn(x: number, width: number): number {
  const stepX = getHexTileStepX(width);

  return getColumn(x, stepX);
}

export function getHexRow(x: number, y: number, width: number): number {
  const stepX = getHexTileStepX(width);
  const stepY = getHexTileStepY(width);

  const squareColumn = getColumn(x, stepX);
  const isEvenCol = squareColumn % 2 === 1;
  const colOffsetY = isEvenCol ? stepY / 2 : 0;

  const row = getRow(y - colOffsetY, stepY);

  return row;
}
