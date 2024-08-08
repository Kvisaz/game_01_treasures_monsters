import { getAbstractGridPath } from "./getAbstractGridPath";
import { getEightNearsColumnRows, getFourNearsColumnRows } from "../SimpleArray2D";
import { ColumnRow, WalkableCallback } from "./interfaces";

interface IProps {
  from: ColumnRow;
  to: ColumnRow;
  isWalkable?: WalkableCallback;
  columnMin?: number;
  columnMax?: number;
  rowMin?: number;
  rowMax?: number;
  maxChecks?: number;
}

/**
 * рассчитывыет путь по доске с квадратными клетками
 * - учитывает проходимость клетки
 * - правила хода - на все стороны включая по диагонали
 **/
export function getSquareGridPath(props: IProps): ColumnRow[] {
  return getAbstractGridPath({
    ...props,
    getNears: (column, row) => getEightNearsColumnRows(column, row),
  });
}

/**
 * рассчитывыет путь по доске с квадратными клетками
 * - учитывает проходимость клетки
 * - правила хода - только вверх или вниз
 **/
export function getSquareGridXYPath(props: IProps): ColumnRow[] {
  return getAbstractGridPath({
    ...props,
    getNears: (column, row) => getFourNearsColumnRows(column, row),
  });
}
