import { IGameState } from "../../interfaces";
import { getNewGameFigureId } from "../utils";

export const defaultGameState: IGameState = {
  finishMapPortal: {
    isOpened: false,
    column: 0,
    row: 0,
    price: Infinity
  },
  treasures: {},
  monsters: {},
  player: {
    id: getNewGameFigureId(),
    column: 0, row: 0,
    health: 3,
    playerCard: {
      type: "player",
      id: -1,
      title: "Daniel Default",
      description: "Default Hero",
      quote: "Nobody know my, everybody uses",
      attack: 1,
      health: 3
    },
    inventory: [],
    statistics: {
      monsters: {
        killed: [],
        killedByMonster: undefined
      },
      treasures: {
        grabbed: []
      }
    }
  },
  startCells: []
};
