import { copyDeep, forEach2D } from "../../../../../../common";
import { CardId, IConfig, IGameState, IMonsterState, ITreasureState } from "../../../interfaces";
import { defaultGameState } from "../defaultState";
import { SimpleMonoHexMapGenerator } from "../../mapGenerators";

export const initGameState = (gameConfig: IConfig): IGameState => {
  const { playerCard, positions } = gameConfig;

  const treasures: Record<CardId, ITreasureState> = {};
  const monsters: Record<CardId, IMonsterState> = {};

  const cells = new SimpleMonoHexMapGenerator(gameConfig).run();

  forEach2D(cells, (cell, column, row) => {
    const { treasureCombo, monsterCombo } = cell;

    if (treasureCombo) {
      treasureCombo.treasureCards.forEach(card => {
        treasures[card.id] = {
          card,
          column,
          row,
          isCollected: false,
          isOpened: treasureCombo.isOpened === true
        };
      });
    }

    if (monsterCombo) {
      monsters[monsterCombo.monsterCard.id] = {
        card: monsterCombo.monsterCard,
        treasures: monsterCombo.treasureCards,
        column, row,
        isOpened: monsterCombo.isOpened === true,
        isAlive: true
      };
    }
  });

  const state: IGameState = {
    player: {
      ...defaultGameState.player,
      playerCard,
      column: positions.player.column,
      row: positions.player.row
    },
    treasures,
    monsters,
    cells,
    finishMapPortal: defaultGameState.finishMapPortal
  };

  return copyDeep(state);
};
