import { IStory } from "../../../storybook/interfaces";
import { SpriteGrid } from "./SpriteGrid";
import { getSimpleColorHexProps } from "./props";

export const spriteHexGridStory: IStory = {
  title: "Sprite Hex Grid ",
  run: async (scene) => {

    const spriteGrid = new SpriteGrid( getSimpleColorHexProps(scene));

    return () => {
      spriteGrid.destroy();
      console.log("TODO Sprite Grid cleaning");
    };
  },
};
