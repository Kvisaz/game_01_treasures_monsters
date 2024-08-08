import { IGameCell } from "../../interfaces";

export function isNoCellFigures(cell: IGameCell): boolean {
  return cell.figures.length < 1;
}
