import { IStory } from "../../../../storybook/interfaces";
import { TestHexGridGame } from "./index";

export const testHexGridGameStory: IStory = {
  title: "Test Hex Game Story",
  run: async (scene) => {
    const game = new TestHexGridGame({ scene });

    return () => {
      game.destroy();
    };
  },
};
