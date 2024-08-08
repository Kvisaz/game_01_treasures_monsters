import { ColumnRow, ISpriteGridCellStrategy, PathProps, Point } from "../interfaces";
import {
  getHexColumn,
  getHexGridPath,
  getHexNearsInRadius,
  getHexRow,
  getHexTileStepX,
  getHexTileStepY
} from "../../../common/";

interface IProps {
  cellSize: number;
}

export class HexStrategy implements ISpriteGridCellStrategy {
  constructor(private props: IProps) {}

  getColumnRow(x: number, y: number): ColumnRow {
    const { cellSize: width } = this.props;

    return {
      column: getHexColumn(x, width),
      row: getHexRow(x, y, width),
    };
  }

  getCenterXY(column: number, row: number): Point {
    const { cellSize: width } = this.props;
    const stepX = getHexTileStepX(width);
    const stepY = getHexTileStepY(width);
    const isEvenCol = column % 2 === 1;
    const colOffsetY = isEvenCol ? stepY / 2 : 0;

    const left = column * stepX;
    const top = colOffsetY + row * stepY;

    return {
      x: left + width / 2,
      y: top + stepY / 2,
    };
  }

  getNears(column: number, row: number, cellRadius: number = 1): ColumnRow[] {
    return getHexNearsInRadius(column, row, cellRadius);
  }

  getPath(props: PathProps): ColumnRow[] {
    return getHexGridPath(props);
  }
}
