import { IConfig } from "../config";
import { ICellState } from "../interfaces";
import { MapGenerator1 } from "../logic/mapGenerators";

export interface ITreasuresMonstersState {
  /** клетки на карте мира - проходимость, тип местности **/
  cells2D: ICellState[][];
}

interface IProps {
  config: IConfig;
}

export const newTreasuresMonstersState = (props: IProps): ITreasuresMonstersState => {

  const map = MapGenerator1.run({
    columns: props.config.columns,
    rows: props.config.rows,
    terrainRules: Object.values(props.config.terrainRules)
  });

  return {
    cells2D: map.cells2D
  };
};
