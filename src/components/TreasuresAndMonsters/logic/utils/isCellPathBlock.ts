import { IGameCell, TerrainType } from "../../interfaces";

/** в будущем это может быть не константой а проверкой на способности **/
const blockableTerrains = new Set<TerrainType>(["mountain", "water"]);

export const isCellBadTerrain = (cell: IGameCell) => blockableTerrains.has(cell.terrainRule.type);
export const isCellHasFigures = (cell: IGameCell) => cell.figures.length > 0;
export const isCellSingleFigure = (cell: IGameCell) => cell.figures.length === 1;

/** в текущей игре считаем что число фигур на 1 клетке - ограничено 1 **/
export const isCellTooMuchFigures = (cell: IGameCell) => cell.figures.length > 1;

/** функция для расчета маршрута - огибаем непроходимые участки и другие фигуры **/
export function isCellPathBlock(cell: IGameCell): boolean {
  return isCellBadTerrain(cell) || isCellHasFigures(cell);
}
