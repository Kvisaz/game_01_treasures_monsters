import { IStory } from "../../../storybook/interfaces";
import { TreasuresAndMonsters2 } from "./TreasuresAndMonsters2";
import { newTreasuresMonstersState } from "./state";
import { tmConfig2 } from "./config";

export const treasuresAndMonsters2Story: IStory = {
  title: "TreasuresAndMonsters2",
  run: async (scene) => {
    const config = tmConfig2;
    const gameState = newTreasuresMonstersState({ config });

    console.log('config', config);
    console.log('gameState', gameState);

    const treasuresAndMonsters2 = new TreasuresAndMonsters2({ scene, gameState, config });

    return () => {
      //destroy all
      treasuresAndMonsters2.destroy();
    };
  }
};
