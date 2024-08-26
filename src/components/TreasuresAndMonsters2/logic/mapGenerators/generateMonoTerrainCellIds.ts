import { makeArray2D } from "../../../../common";
import { CellTypeFullData, Id, select, TMGameState, TMTerrainType } from "../../../gamestates";
import { IConfig } from "../../config";

export function getFirstCellForTerrainType(cellTypes: CellTypeFullData[], type: TMTerrainType): CellTypeFullData {
  let cellType = cellTypes.find(cellType => cellType.terrain.type === type);
  if (cellType == null) {
    console.warn("cellType==null");
    cellType = cellTypes[0];
  }
  return cellType;
}

export const generateMonoTerrainCellIds = (config: IConfig, state: TMGameState, type: TMTerrainType): number[][] => {

  const selector = select(state);
  const cellTypes = selector.cellTypes();
  let cellType = getFirstCellForTerrainType(cellTypes, type);

  const cellIds = makeArray2D(config.columns, config.rows, (col, row) => cellType.id);

  return cellIds;
};
