import { IStory } from "../../../../storybook/interfaces";
import { getNewTestGameState } from "./TestGameState";
import { delay } from "../../../common";

export const testGameStateStory: IStory = {
  title: "Test Game State",
  run: async () => {
    const stateEvent1 = getNewTestGameState();
    const unsub1 = stateEvent1.on(state => console.log("state 1 changed", state));
    console.log("state 1 init", stateEvent1.getState());

    const stateEvent2 = getNewTestGameState();
    const unsub2 = stateEvent2.on(state => console.log("state 2 changed", state));
    console.log("state 2 init", stateEvent2.getState());


    await delay(1000);
    stateEvent1.setState(prevState => ({ ...prevState, health: prevState.health + 1 }));
    stateEvent1.setState(prevState => ({ ...prevState, name: 'new Name for 1 state' }));
    await delay(2000);
    stateEvent2.setState(prevState => ({ ...prevState, health: prevState.health + 1 }));
    await delay(1000);
    stateEvent1.setState(prevState => ({ ...prevState, health: prevState.health + 4 }));
    await delay(1000);
    stateEvent2.setState(prevState => ({ ...prevState, health: prevState.health - 4 }));


    return () => {
      unsub1();
      unsub2();
      stateEvent1.unSubScribeAll();
      stateEvent2.unSubScribeAll();
    };
  }
};
