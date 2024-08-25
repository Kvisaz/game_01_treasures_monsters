import { IConfig } from "../config";
import { ICellState, ITerrainRule } from "../interfaces";
import { generateGrassCells2D } from "../logic/mapGenerators/generateCells2D";

/** @deprecated **/
export interface ITreasuresMonstersState {
  /** клетки на карте мира - проходимость, тип местности **/
  cells2D: ICellState[][];
}

interface IProps {
  config: IConfig;
}

export const newTreasuresMonstersState = (props: IProps): ITreasuresMonstersState => {

  const { columns, rows, terrainRules } = props.config;

  return {
    cells2D: generateGrassCells2D(columns, rows, [...terrainRules] as ITerrainRule[]).cells2D
  };
};
