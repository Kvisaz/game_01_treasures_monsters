/***************
 * Типы клеток поля
 ****************/
export interface ITerrainRule {
  type: string;
  speedK: number;
  probability: number;
}

export interface ICellState {
  terrainRule: ITerrainRule;
}
