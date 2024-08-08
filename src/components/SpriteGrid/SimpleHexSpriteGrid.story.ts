import { IStory } from "../../../storybook/interfaces";
import { SimpleHexSpriteGrid } from "./SimpleHexSpriteGrid";

export const simpleHexGridStory: IStory = {
  title: "Simple Hex Grid ",
  run: async (scene) => {
    const cellSize = 64;
    const spriteGrid = new SimpleHexSpriteGrid({
      scene,
      columns: 16,
      rows: 12,
      cellSize,
      onClick: (cell) => {
        console.log(`onClick ${cell.column} ${cell.row}`, cell);
      },
    });

    return () => {
      spriteGrid.destroy();
    };
  },
};
