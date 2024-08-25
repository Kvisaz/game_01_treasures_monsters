import { IStory } from "../../../../storybook/interfaces";
import { asyncFlow, delay } from "../../../common";

export const tmGameStateStory: IStory = {
  title: "Test Game State",
  run: async () => {

    console.log('void test');
    const { cancel, run } = asyncFlow([
      async () => console.log("state changes started"),
      () => delay(1000),
      async () => {
        console.log("changes 1");
      },
      () => delay(1000),
      async () => {
        console.log("changes 2");
      },
      () => delay(1000),
      async () => {
        console.log("changes 3");
      },
      async () => console.log("state changes finished")
    ]);
    run().catch(console.warn);

    return () => {
      cancel();
      // store.unSubScribeAll();
      console.log("cleared");
    };
  }
};
