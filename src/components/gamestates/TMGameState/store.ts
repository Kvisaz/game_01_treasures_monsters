import { State } from "../../../common";
import { TMGameState } from "./TMGameState";
import { TMEventsType, useTMEvents } from "./TMEvents";
import { select } from "./selectors";

const voidState: TMGameState = {
  cells: [],
  dungeonsInGame: {},
  dungeonsOpened: {},
  monstersGraveYard: {},
  monstersInGame: {},
  playerAttack: 0,
  playerGold: 0,
  playerHealth: 0,
  playerHeroCardId: "-1",
  playerHeroCardPlace: { column: -1, row: -1 },
  playerTreasures: {},
  records: { cards: {}, cellTypes: {}, terrainRules: {} },
  treasuresInGame: {}
};

export const getVoidState = () => JSON.parse(JSON.stringify(voidState)) as TMGameState;

export class TMStore {
  readonly events: TMEventsType;
  readonly state: State<TMGameState>;

  constructor(initState: TMGameState) {
    const eventStore = useTMEvents();
    this.events = eventStore.events;
    this.state = new State<TMGameState>(initState);
  }

  select() {
    return select(this.state.getState());
  }

  destroy() {
    const eventStore = useTMEvents();
    eventStore.unsubscribeAll();
    this.state.unSubScribeAll();
  }
}
