import { IGameCell, IGameCellFigures } from "../../interfaces";

export function getCellFigures(cell: IGameCell): IGameCellFigures {
  const figures: IGameCellFigures = {};
  cell.figures.forEach((figure) => {
    if (figure.combos.playerCombo) {
      figures.playerFigure = figure;
      return;
    }

    if (figure.combos.monsterCombo) {
      figures.monsterFigure = figure;
      return;
    }

    if (figure.combos.treasureCombo) {
      figures.treasureFigure = figure;
      return;
    }
  });

  return figures;
}
