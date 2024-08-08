import { IStory } from "../../../storybook/interfaces";
import { SpriteGrid } from "./SpriteGrid";
import { getSimpleColorSquareProps } from "./props";

export const spriteGridStory: IStory = {
  title: "Sprite Square Grid ",
  run: async (scene) => {

    const spriteGrid = new SpriteGrid(getSimpleColorSquareProps(scene));

    return () => {
      spriteGrid.destroy();
      console.log("TODO Sprite Grid cleaning");
    };
  },
};
