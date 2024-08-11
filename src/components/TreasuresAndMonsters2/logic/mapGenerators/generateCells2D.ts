import { ICellState, ITerrainRule } from "../../interfaces";
import { ColumnRow, makeArray2D } from "../../../../common";
import { TerrainRule } from "../../config";
import { getMonoTerrainBuilder, getRandomTerrainBuilder } from "./terrainSelectors";

interface IProps {
  columns: number;
  rows: number;
  terrainSelector: TerrainRuleSelector;
}

type TerrainRuleSelector = (columnRow: ColumnRow) => TerrainRule;

interface IResult {
  cells2D: ICellState[][];
}

export function generateCells2D({ columns, rows, terrainSelector }: IProps): IResult {
  const cells2D = makeArray2D(columns, rows, (column, row) => {
    return {
      column, row, terrain: terrainSelector({ column, row })
    };
  });

  return {
    cells2D
  };
}

export const generateRandomCells2D = (columns: number, rows: number, terrainRules: ITerrainRule[])=> generateCells2D({
  columns, rows, terrainSelector: getRandomTerrainBuilder(terrainRules)
})

export const generateGrassCells2D = (columns: number, rows: number, terrainRules: ITerrainRule[])=> generateCells2D({
  columns, rows, terrainSelector: getMonoTerrainBuilder(terrainRules, 'grass')
})
