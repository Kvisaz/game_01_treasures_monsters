import { IStory } from "../../../../storybook/interfaces";
import { asyncFlow, delay } from "../../../common";
import { getVoidState, TMStore } from "./store";

export const tmStoreStory: IStory = {
  title: "Test Store",
  run: async () => {
    const store = new TMStore(getVoidState());

    store.state.on(state => console.log("state changed"));
    store.state.on(state => console.log("playerHealth changed", state.playerHealth), "playerHealth");
    store.state.on(state => console.log("playerAttack changed", state.playerAttack), "playerAttack");
    store.state.on(state => console.log("playerGold changed", state.playerGold), "playerGold");

    store.events.gameOver.on(console.log);
    store.events.battleEnd.on(console.log);
    store.events.battleStart.on(console.log);

    console.log("void test");
    let step = 1;
    const logStep = () => console.log(`step ${step++}`);
    const testFlow = asyncFlow([
      async () => {
        logStep();
        store.state.setState(prevState => ({
          ...prevState,
          playerHealth: 1000
        }));
      },
      () => delay(1000),
      async () => {
        logStep();
        store.state.setState(prevState => ({
          ...prevState,
          playerHealth: prevState.playerHealth - 500,
          playerGold: 100
        }));
      },
      () => delay(1000),
      async () => {
        logStep();
        store.state.setState(prevState => ({
          ...prevState,
          playerHealth: prevState.playerHealth - 500,
          playerGold: 200
        }));
        store.events.gameOver.emit({
          isPlayerWin: false,
          title: 'You lose',
          description: 'game over!'
        })
      },
      () => delay(1000),
      async () => {
        logStep();
        // store.destroy();
        store.state.setState(prevState => ({
          ...prevState,
          playerHealth: prevState.playerHealth - 500,
          playerGold: 300
        }));
      },
      () => delay(1000),
      async () => {
        logStep();
        store.state.setState(prevState => ({
          ...prevState,
          playerHealth: prevState.playerHealth - 500,
          playerGold: 400
        }));
      },
      () => delay(1000),
      async () => {
        logStep();
        store.state.setState(prevState => ({
          ...prevState,
          playerHealth: prevState.playerHealth - 500,
          playerGold: 500
        }));
      },

      async () => console.log("state changes finished")
    ]);
    testFlow.run().catch(console.warn);

    return () => {
      testFlow.cancel();
      store.destroy();
      console.log("cleared");
    };
  }
};
