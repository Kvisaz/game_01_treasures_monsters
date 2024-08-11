import { ICellState, ITerrainRule } from "../../../interfaces";
import { makeArray2D } from "../../../../../common";

interface IProps {
  columns: number;
  rows: number;
  terrainRules: ITerrainRule[];
}

interface IResult {
  cells2D: ICellState[][];
}

export class MapGenerator1 {

  static run({ columns, rows, terrainRules }: IProps): IResult {

    const cells2D = makeArray2D(columns, rows, (column, row) => {
      return {
        column, row, terrain: terrainRules[0]
      };
    });

    return {
      cells2D
    };
  }
}
