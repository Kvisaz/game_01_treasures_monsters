import { IStory } from "../../../../storybook/interfaces";
import { asyncFlow, delay } from "../../../common";
import { getNewTMGameState } from "./TMGameState";

export const tmGameStateStory: IStory = {
  title: "Test Game State",
  run: async () => {
    const store = getNewTMGameState({ columns: 4, rows: 4 });
    store.on(state => console.log("state 1 changed", state));
    console.log("state 1 init", store.getState());

    const { cancel, run } = asyncFlow([
      async () => console.log("state changes started"),
      () => delay(1000),
      () => delay(1000),
      () => delay(1000),
      async () => console.log("state changes finished")
    ]);
    run().catch(console.warn);

    return () => {
      cancel();
      store.unSubScribeAll();
      console.log("cleared");
    };
  }
};
