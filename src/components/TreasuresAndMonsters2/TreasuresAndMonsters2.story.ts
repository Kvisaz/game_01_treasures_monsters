import { IStory } from "../../../storybook/interfaces";
import { TreasuresAndMonsters2 } from "./TreasuresAndMonsters2";
import { tmConfig2 } from "./config";
import { TMGameState, TMStore } from "../gamestates";
import { initState } from "./logic";

export const treasuresAndMonsters2Story: IStory = {
  title: "Treasures And Monsters 2",
  run: async (scene) => {
    const config = tmConfig2;
    console.log('to do - try to restore state from last save');
    const state = initState(config);

    const store = new TMStore(state);
    console.log('config', config);
    console.log('store', store);

    const treasuresAndMonsters2 = new TreasuresAndMonsters2({ scene, store, config });

    return () => {
      //destroy all
      treasuresAndMonsters2.destroy();
    };
  }
};
