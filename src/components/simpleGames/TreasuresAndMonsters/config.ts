import { monsterCards, playerCards, treasureCards } from "./data";
import { IConfig } from "./interfaces";

const basicConfig: Readonly<IConfig> = {
  cellSize: 72,
  columns: 18,
  rows: 14,
  positions: {
    player: { column: 1, row: 1 }
  },
  path: {
    pathColor: "#88e7ac"
  },
  selector: {
    selectorColor: "#88e7ac",
  },
  gamePlay: {
    openedTreasuresProbability: 0.5,
    openedMonsterProbability: 0.5,
    monstersTotal: 14,
    treasuresTotal: 28,
    portalTreasurePrice: 8
  },
  playerCard: playerCards.players_1_fantasy_pack5[0],
  monsterCards: [...monsterCards.monsters_1_fantasy_pack8],
  treasureCards: [...treasureCards.treasures_1_fantasy_pack16],
  terrainRules: [
    { type: "mountain", speedK: 0, probability: 0.05 },
    { type: "water", speedK: 0, probability: 0.2 },
    { type: "forest", speedK: 0.75, probability: 0.2 },
    { type: "sand", speedK: 0.5, probability: 0.2 },
    { type: "grass", speedK: 0.5, probability: 0.2 },
    { type: "ground", speedK: 0.5, probability: 0.2 }
  ],
  terrainColors: {
    "mountain": "#5d1d06", // Приятный коричневатый цвет для гор
    "water": "#4682B4", // Спокойный синий цвет для воды
    "forest": "#005e00", // Темно-зеленый цвет для леса
    "sand": "#fce76c", // Светло-коричневый цвет для песка
    "grass": "#477242", // Яркий зеленый цвет для травы
    "ground": "#675437" // Земляной коричневый цвет
  }
};


export const treasuresAndMonstersConfig: Readonly<IConfig> = {
  ...basicConfig
};
