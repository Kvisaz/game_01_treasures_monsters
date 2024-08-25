import { State } from "../../../common";
import { TMGameState } from "./TMGameState";
import { TMEventsType, useTMEvents } from "./TMEvents";
import { IConfig } from "../../TreasuresAndMonsters2/config";

const voidState: TMGameState = {
  cells: [],
  dungeonsInGame: {},
  dungeonsOpened: {},
  monstersGraveYard: {},
  monstersInGame: {},
  playerAttack: 0,
  playerGold: 0,
  playerHealth: 0,
  playerHeroCardId: 0,
  playerHeroCardPlace: { column: -1, row: -1 },
  playerTreasures: {},
  records: { cards: {}, cellTypes: {}, terrainRules: {} },
  treasuresInGame: {}

};

export class TMStore {
  readonly events: TMEventsType;
  readonly state: State<TMGameState>

  constructor(initState?: Partial<TMGameState>) {
    const eventStore = useTMEvents();
    this.events = eventStore.events;
    this.state = new State<TMGameState>({ ...voidState, ...initState });
  }

  destroy(){
    const eventStore = useTMEvents();
    eventStore.unsubscribeAll();
    this.state.unSubScribeAll();
  }
}
