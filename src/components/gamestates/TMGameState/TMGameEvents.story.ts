import { IStory } from "../../../../storybook/interfaces";
import { asyncFlow, delay } from "../../../common";
import { useTMEvents } from "./TMEvents";

export const tmGameEventsStory: IStory = {
  title: "Test Game Events",
  run: async () => {
    const { events, unsubscribeAll } = useTMEvents();

    events.gameOver.on(console.log);
    events.battleEnd.on(console.log);
    events.battleStart.on(console.log);

    console.log('void test');
    const { cancel, run } = asyncFlow([
      async () => console.log("events test started"),
      () => delay(1000),
      async () => {
        console.log("changes 1");
        events.battleStart.emit({ monsterCardId: 1000 });
      },
      () => delay(1000),
      async () => {
        console.log("changes 2");
        events.battleEnd.emit({ isPlayerWin: true, monsterCardId: 1000, title: 'You win', description: 'You win monster' });
      },
      () => delay(1000),
      async () => {
        console.log("changes 3");
        events.gameOver.emit({ isPlayerWin: true, title: 'You win the games', description: 'You win monster' });
        unsubscribeAll();
      },
      () => delay(1000),
      async () => {
        console.log("changes 4");
        events.gameOver.emit({ isPlayerWin: true, title: 'You must dont see this text', description: 'You win monster' });
        events.battleStart.emit({ monsterCardId: 2000 });
        events.battleEnd.emit({ monsterCardId: 2000, isPlayerWin: true, title: 'You must dont see this text', description: 'You win monster' });
      },
      async () => console.log("state changes finished")
    ]);
    run().catch(console.warn);

    return () => {
      cancel();
      // store.unSubScribeAll();
      unsubscribeAll();
      console.log("cleared");
    };
  }
};
