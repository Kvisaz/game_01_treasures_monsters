import { ICellState, ITerrainRule } from "../../interfaces";
import { ColumnRow, makeArray2D } from "../../../../common";
import { ConfigTerrainRule } from "../../config";
import { getMonoTerrainBuilder, getRandomTerrainBuilder } from "./terrainSelectors";
import { TMTerrainType } from "../../../gamestates";

interface IProps {
  columns: number;
  rows: number;
  terrainSelector: TerrainRuleSelector;
}
/** @deprecated **/
type TerrainRuleSelector = (columnRow: ColumnRow) => ConfigTerrainRule;
/** @deprecated **/
interface IResult {
  cells2D: ICellState[][];
}

/** @deprecated **/
export function generateCells2D({ columns, rows, terrainSelector }: IProps): IResult {
  const cells2D = makeArray2D(columns, rows, (column, row) => {
    return {
      terrainRule: terrainSelector({ column, row })
    };
  });

  return {
    cells2D
  };
}

/** @deprecated **/
export const generateRandomCells2D = (columns: number, rows: number, terrainRules: ITerrainRule[])=> generateCells2D({
  columns, rows, terrainSelector: getRandomTerrainBuilder(terrainRules)
})

/** @deprecated **/
export const generateGrassCells2D = (columns: number, rows: number, terrainRules: ITerrainRule[])=> generateCells2D({
  columns, rows, terrainSelector: getMonoTerrainBuilder(terrainRules, TMTerrainType.grass)
})
