import { IStory } from "../../../storybook/interfaces";
import { TreasuresAndMonsters2 } from "./TreasuresAndMonsters2";

export const treasuresAndMonsters2Story: IStory = {
  title: "TreasuresAndMonsters2",
  run: async (scene) => {

    const treasuresAndMonsters2 = new TreasuresAndMonsters2({ scene });

    return () => {
      //destroy all
      treasuresAndMonsters2.destroy();
    };
  }
};
