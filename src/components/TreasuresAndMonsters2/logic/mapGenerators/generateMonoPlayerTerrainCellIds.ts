import { select, TMGameState, TMTerrainType } from "../../../gamestates";
import { IConfig } from "../../config";
import { generateMonoTerrainCellIds, getFirstCellForTerrainType } from "./generateMonoTerrainCellIds";
import { getSafeHexNearsInRadius } from "../../../../common";

export const generateMonoPlayerTerrainCellIds = (config: IConfig, state: TMGameState, type: TMTerrainType): number[][] => {

  const selector = select(state);
  const cellIds = generateMonoTerrainCellIds(config, state, type);
  const cellTypes = selector.cellTypes();

  /** Вокруг игрока своя территория **/
  const playerCellType = getFirstCellForTerrainType(cellTypes, TMTerrainType.ground);
  const { rows, columns } = config;
  const { column, row } = state.playerHeroCardPlace;
  const cellRadius = 2;
  const getNears = getSafeHexNearsInRadius({ column, row, cellRadius, rows, columns, includeCenter: true });
  getNears.forEach(({ column, row }) => {
    cellIds[column][row] = playerCellType.id;
  });


  return cellIds;
};
