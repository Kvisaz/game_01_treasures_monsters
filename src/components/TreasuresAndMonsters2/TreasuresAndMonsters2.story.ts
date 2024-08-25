import { IStory } from "../../../storybook/interfaces";
import { TreasuresAndMonsters2 } from "./TreasuresAndMonsters2";
import { tmConfig2 } from "./config";
import { TMGameState, TMStore } from "../gamestates";

export const treasuresAndMonsters2Story: IStory = {
  title: "Treasures And Monsters 2",
  run: async (scene) => {
    const config = tmConfig2;
    // const gameState = newTreasuresMonstersState({ config });

    const initState: Partial<TMGameState> = {};

    const store = new TMStore(initState);
    console.log('config', config);
    console.log('store', store);

    const treasuresAndMonsters2 = new TreasuresAndMonsters2({ scene, store, config });

    return () => {
      //destroy all
      treasuresAndMonsters2.destroy();
    };
  }
};
