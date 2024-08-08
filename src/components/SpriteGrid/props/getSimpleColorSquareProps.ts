import { ISpriteGridProps } from "../SpriteGrid";
import { ISpriteGridColorCellData, SpriteGridColorCell } from "../cells";
import { getRandomArrayElementWithFilter } from "../../../common";
import { SimpleCirclePlayerObject } from "../objects";
import { SpriteGridHexSelector } from "../selectors";
import { SquareStrategy } from "../strategies";
import { SimplePathBuilder } from "../path";

export function getSimpleColorSquareProps(scene: Phaser.Scene): ISpriteGridProps<ISpriteGridColorCellData> {
  const cellSize = 64;

  return {
    scene,
    columns: 64,
    rows: 64,
    cellSize: 64,
    onClick: (column, row) => {
      console.log(`onClick ${column} ${row}`);
    },
    cellBuilder: (column, row, cellSize) => {
      const color = getRandomColor();
      const isPathBlock = color === "#af0000";
      return new SpriteGridColorCell({
        scene,
        column,
        row,
        cellSize,
        isPathBlock,
        color,
      });
    },
    startFigurePlaces: [{
      figure: new SimpleCirclePlayerObject({ scene, size: cellSize * 0.65 }),
      column: 0,
      row: 0
    }],
    cellSelector: new SpriteGridHexSelector({
      scene,
      cellSize,
    }),
    gridStrategy: new SquareStrategy({ cellSize }),
    pathBuilder: new SimplePathBuilder({ scene, cellSize })
  };
}

function getRandomColor() {
  return getRandomArrayElementWithFilter(["#b47c00", "#4d725c", "#fff6d6", "#8c8cb6", "#dedede", "#af0000"]);
}
