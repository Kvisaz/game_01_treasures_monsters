import { IStory } from "../../../../storybook/interfaces";
import { getNewTestGameState } from "./TestGameState";
import { asyncFlow, delay } from "../../../common";

export const testGameStateStory: IStory = {
  title: "Test Game State",
  run: async () => {
    const stateEvent1 = getNewTestGameState();
    const unsub1 = stateEvent1.on(state => console.log("state 1 changed", state));
    console.log("state 1 init", stateEvent1.getState());

    const stateEvent2 = getNewTestGameState();
    const unsub2 = stateEvent2.on(state => console.log("state 2 changed", state));
    console.log("state 2 init", stateEvent2.getState());

    const stateEvent3 = getNewTestGameState();
    const unsub3 = stateEvent3.on(state => console.log("HEALTH 3 changed", state), ["health"]);
    const unsub31 = stateEvent3.on(state => console.log("NAME 3 changed", state), ["name"]);
    console.log("state 3 init", stateEvent3.getState());


    const { cancel, run } = asyncFlow([
      async () => console.log("state changes started"),
      async () => await delay(1000),
      async () => {
        stateEvent1.setState(prevState => ({ ...prevState, health: prevState.health + 1 }));
        stateEvent1.setState(prevState => ({ ...prevState, name: "new Name for 1 state" }));
        stateEvent3.setState(prevState => ({ ...prevState, name: "new Name3 for 3 state" }));
      },
      async () => await delay(2000),
      async () => {
        stateEvent2.setState(prevState => ({ ...prevState, health: prevState.health + 1 }));
        stateEvent3.setState(prevState => ({ ...prevState, name: "new Name31 for 3 state" }));
        stateEvent3.setState(prevState => ({ ...prevState, health: 1 }));
      },
      async () => await delay(1000),
      async () => {
        stateEvent1.setState(prevState => ({ ...prevState, health: prevState.health + 4 }));
        stateEvent3.setState(prevState => ({ ...prevState, health: 2 }));
      },
      async () => await delay(1000),
      async () => {
        stateEvent2.setState(prevState => ({ ...prevState, health: prevState.health - 4 }));
        stateEvent3.setState(prevState => ({ ...prevState, health: 3 }));
        stateEvent3.setState(prevState => ({ ...prevState, name: "some name 3" }));
      },
      async () => console.log("state changes finished")
    ]);
    run().catch(console.warn);


    return () => {
      cancel();
      unsub1();
      unsub2();
      unsub3();
      stateEvent1.unSubScribeAll();
      stateEvent2.unSubScribeAll();
      console.log("story cleared");
    };
  }
};
