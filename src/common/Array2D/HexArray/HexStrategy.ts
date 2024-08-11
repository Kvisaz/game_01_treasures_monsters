import { getHexColumn, getHexRow, getHexTileStepX, getHexTileStepY } from "./getters";
import { ColumnRow } from "../../../components/SpriteGrid/interfaces";

interface IPoint {
  x: number;
  y: number;
}

interface IProps {
  cellSize: number;
}

/**
 * Гексагональная доска особым образом интерпретирует двухмерный массив
 * - важны размеры ячейки
 * - тут все хексы опираются на сторону, не угол
 * - смещены четные ряды
 **/
export class HexStrategy {
  constructor(private props: IProps) {
  }

  getCenterXY(column: number, row: number): IPoint {
    const { cellSize: width } = this.props;
    const stepX = getHexTileStepX(width);
    const stepY = getHexTileStepY(width);
    const isEvenCol = column % 2 === 1;
    const colOffsetY = isEvenCol ? stepY / 2 : 0;

    const left = column * stepX;
    const top = colOffsetY + row * stepY;

    return {
      x: left + width / 2,
      y: top + stepY / 2
    };
  }

  getColumnRow(x: number, y: number): ColumnRow {
    const { cellSize: width } = this.props;

    return {
      column: getHexColumn(x, width),
      row: getHexRow(x, y, width)
    };
  }
}
