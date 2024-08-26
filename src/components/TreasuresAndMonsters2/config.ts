import { playerCards } from "../TreasuresAndMonsters/data";
import { dungeonsCards, monsterCards, treasureCards } from "./data";

/** типизация включает защиту от ошибок в ручных файлах **/
const playerCardsInGame: IConfigPlayerCard[] = playerCards.players_1_fantasy_pack5;
const monsterCardsInGame: IConfigMonsterCard[] = monsterCards.monsters_1_fantasy_pack8;
const treasureCardsInGame: IConfigTreasureCard[] = treasureCards.treasures_1_fantasy_pack16;
const dungeonsCardsInGame: IConfigDungeonCard[] = dungeonsCards.dungeons_1_fantasy_1;
const cards: IConfigCard[] = [
  ...playerCardsInGame,
  ...monsterCardsInGame,
  ...treasureCardsInGame,
  ...dungeonsCardsInGame
];

export const tmConfig2 = {
  cellSize: 72,
  columns: 18,
  rows: 14,

  terrainRules: [
    { type: "mountain", speedK: 0, probability: 0.05 },
    { type: "water", speedK: 0, probability: 0.2 },
    { type: "forest", speedK: 0.75, probability: 0.2 },
    { type: "sand", speedK: 0.5, probability: 0.2 },
    { type: "grass", speedK: 0.5, probability: 0.2 },
    { type: "ground", speedK: 0.5, probability: 0.2 }
  ],

  /**
   * Колода карт - запихиваем в нее карты из JSON
   * не сортируем, сортировка произойдет позже
   **/
  cards
} as const;

export type IConfig = typeof tmConfig2;
export type ConfigTerrainRule = IConfig["terrainRules"][number];
export type ConfigTerrainType = ConfigTerrainRule["type"];

export interface IConfigCard {
  type: "monster" | "treasure" | "player" | "dungeon";
  title: string;
  description: string;
  quote: string;
}

export interface IConfigPlayerCard extends IConfigCard{
  health: number;
  attack: number;
}

export interface IConfigMonsterCard  extends IConfigCard{
  health: number;
  attack: number;
}

export interface IConfigDungeonCard  extends IConfigCard{
}

export type IConfigBonus = 'gold' | 'health' | 'attack';
export interface IConfigTreasureCard  extends IConfigCard{
  bonuses: Partial<Record<IConfigBonus, number|undefined>>
}



/** to do move to components **/
export const terrainColors: Record<ConfigTerrainType, string> = {
  "mountain": "#5d1d06", // Приятный коричневатый цвет для гор
  "water": "#4682B4", // Спокойный синий цвет для воды
  "forest": "#005e00", // Темно-зеленый цвет для леса
  "sand": "#fce76c", // Светло-коричневый цвет для песка
  "grass": "#477242", // Яркий зеленый цвет для травы
  "ground": "#675437" // Земляной коричневый цвет
} as const;
