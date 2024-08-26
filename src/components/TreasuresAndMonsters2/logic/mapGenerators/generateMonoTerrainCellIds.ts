import { makeArray2D } from "../../../../common";
import { Id, select, TMGameState, TMTerrainType } from "../../../gamestates";
import { IConfig } from "../../config";

export const generateMonoTerrainCellIds = (config: IConfig, state: TMGameState, type: TMTerrainType): Id[][] => {

  const selector = select(state);
  const cellTypes = selector.cellTypes();
  const cellIds = makeArray2D(config.columns, config.rows, (col, row) => {
    const cellType = cellTypes.find(cellType => cellType.terrain.type === type);
    if (cellType == null) {
      console.warn("cellType==null");
      return cellTypes[0].id;
    }
    return cellType.id;
  });

  return cellIds;
};
