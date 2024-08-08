import { ColumnRow, ISpriteGridCellStrategy, PathProps, Point } from "../interfaces";
import { getColumn, getNearsColumnRows, getRow } from "../../../common/Array2D";
import { getSquareGridXYPath } from "../../../common/Array2D/Path/getSquareGridPath";

interface IProps {
  cellSize: number;
}

export class SquareStrategy implements ISpriteGridCellStrategy {
  constructor(private props: IProps) {}

  getColumnRow(x: number, y: number): ColumnRow {
    const { cellSize: width } = this.props;
    const height = width;
    return {
      column: getColumn(x, width),
      row: getRow(y, height),
    };
  }

  getCenterXY(column: number, row: number): Point {
    const { cellSize } = this.props;

    return {
      x: column * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    };
  }

  getNears(column: number, row: number, cellRadius: number): ColumnRow[] {
    return getNearsColumnRows(column, row, cellRadius);
  }

  getPath(props: PathProps): ColumnRow[] {
    // проход включая диагонали
    // return getSquareGridPath(props);
    // проход только по вертикали или горизонтали
    return getSquareGridXYPath(props);
  }
}
