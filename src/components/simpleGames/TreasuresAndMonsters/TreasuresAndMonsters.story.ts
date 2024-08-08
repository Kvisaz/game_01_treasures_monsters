import { IStory } from "../../../../storybook/interfaces";
import { TreasuresAndMonsters } from "./TreasuresAndMonsters";

export const treasuresAndMonstersStory: IStory = {
  title: "Treasures And Monsters",
  run: async (scene) => {

    const game = new TreasuresAndMonsters({
      scene
    });
    console.log('TreasuresAndMonsters created');
    return () => {
      game.destroy();
      console.log('TreasuresAndMonsters destroyed');
    };
  }
};
