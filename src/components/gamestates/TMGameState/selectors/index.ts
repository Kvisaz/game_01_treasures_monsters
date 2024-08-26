import { ICard, Id, IdCellType, ITerrain, TMGameState, TMTerrainType } from "../TMGameState";

export {};

export type CellFullData = {
  column: number;
  row: number;
  cellTypeId: Id;
  terrain: ITerrain;
}

export type CellTypeFullData = {
  id: Id;
  terrain: ITerrain;
}

/**
 * селекторы TMGameState
 **/
export const select = (state: TMGameState) => {

  /** ячейка по координатам **/
  const cell = (column: number, row: number): CellFullData => {
    const cellTypeId = state.cells[column][row];
    const cellType = state.records.cellTypes[cellTypeId];
    const terrain: ITerrain = state.records.terrainRules[cellType.terrainRuleId];

    return {
      column, row, terrain, cellTypeId
    };
  };

  const terrain = (terrainId: Id): ITerrain => {
    return state.records.terrainRules[terrainId];
  };

  const cellType = (cellTypeId: Id): CellTypeFullData => {
    const { id, terrainRuleId } = state.records.cellTypes[cellTypeId];

    return {
      id,
      terrain: terrain(terrainRuleId)
    };
  };

  const cellTypes = (): CellTypeFullData[] => {
    return Object.values(state.records.cellTypes).map(cellTypeData => cellType(cellTypeData.id));
  };

  const card = (cardId: Id): ICard => {
    return state.records.cards[cardId];
  };

  return {
    cell,
    card,
    terrain,
    cellType,
    cellTypes
  };
};
