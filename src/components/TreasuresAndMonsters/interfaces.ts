import { IFigure, ISpriteGridCell } from "../SpriteGrid/interfaces";
import { GameObject } from "../../common";

export type ColumnRow = {
  column: number;
  row: number;
};

/** Config **/
export interface IConfig {
  cellSize: number;
  columns: number;
  rows: number;
  path: {
    pathColor: string;
  };
  selector: {
    selectorColor: string;
  };
  /** карты которые участвуют в игре, могут повторяться**/
  monsterCards: IMonsterCard[];
  treasureCards: ITreasureCard[];
  playerCard: IPlayerCard;
  terrainRules: ITerrainRule[];
  terrainColors: TerrainColors;
  positions: {
    player: ColumnRow;
  },
  gamePlay: {
    /** число сокровищ для открытия портала выхода с карты **/
    portalTreasurePrice: number;
    /** число  сокровищ на карте **/
    treasuresTotal: number;
    /** число монстров на карте, каждый монстр берет одно сокровище из колоды **/
    monstersTotal: number;
    /** вероятность открытого сокровища от 0 до 1**/
    openedTreasuresProbability: number;
    /** вероятность открытого монстра от 0 до 1**/
    openedMonsterProbability: number;
  }
}

export type TerrainColors = Record<TerrainType, string>;

/** Cards - карты - сущности в мире, могут комбинироваться **/
export type CardType = "monster" | "treasure" | "player";

export interface ICardTexts {
  title: string;
  description: string;
  quote: string;
}

export interface IBasicCard extends ICardTexts {
  id: number;
  type: CardType;
  title: string;
  description: string;
  quote: string;
}

export interface IMonsterCard extends IBasicCard {
  id: number;
  title: string;
  type: "monster";
  description: string;
  quote: string;
  attack: number;
  health: number;
}

export interface IPlayerCard extends IBasicCard {
  id: number;
  title: string;
  type: "player";
  description: string;
  quote: string;
  attack: number;
  health: number;
}

export interface ITreasureCard extends IBasicCard {
  id: number;
  title: string;
  type: "treasure";
  description: string;
  quote: string;
  bonuses: {
    attack?: number;
    health?: number;
    gold?: number;
  };
}

/*******************************************************
 * Игровые комбинации карт, образующие отдельные единицы
 *
 * комбинация может передвигаться по полю внутри фигуры
 * фигура - контейнер для комбо!
 ********************************************************/

/** комбинация игрока - постоянно в игре **/
export interface IPlayerCardCombo {
  playerCard: IPlayerCard;
  // награбленное
  treasureCards: ITreasureCard[];
  // побежденные монстры
  monstersWin: IMonsterCard[];
  // умер от монстра
  diedByMonster?: IMonsterCard;
}

/** монстр - существует до столкновения с игроком **/
export interface IMonsterCombo {
  monsterCard: IMonsterCard;
  // прячет сокровища
  treasureCards: ITreasureCard[];
  // вскрыто или нет, если не вскрыто - знак вопроса или данжен
  isOpened?: boolean;
}

/** сокровища - могут лежать пачкой **/
export interface ITreasureCombo {
  treasureCards: ITreasureCard[];
  // вскрыто или нет, если не вскрыто - знак вопроса или данжен
  isOpened?: boolean;
}

/**
 * комбинации в порядке важности трактовки
 * можно использовать как универсальный объект
 * для
 * - стартов
 * - обозначения фигур
 * **/
export interface ICombos {
  playerCombo?: IPlayerCardCombo;
  monsterCombo?: IMonsterCombo;
  treasureCombo?: ITreasureCombo;
}

/***************
 * Типы клеток поля
 ****************/
// Извлекаем тип для отдельного элемента массива terrains
export type TerrainType = "mountain" | "water" | "forest" | "sand" | "grass" | "ground";

export interface ITerrainRule {
  type: TerrainType;
  speedK: number;
  probability: number;
}

export type ITerrainRulesMap = Record<TerrainType, ITerrainRule>;

/***************
 * подготовка к старту игры
 ****************/
export interface ITerrainGenerator {
  generateCells(): ITerrainCell[][];
}

export interface ITerrainCell {
  terrainType: TerrainType;
}

export interface IMapGenerator {
  run(): IMapGeneratorResult;
}

/** @deprecated **/
export type MapGenerator = (props: IMapGeneratorProps) => IMapGeneratorResult;

export interface IMapGeneratorProps {
  columns: number;
  rows: number;
  playerCard: IPlayerCard;
  monsterCards: IMonsterCard[];
  treasureCards: ITreasureCard[];
  terrainRules: ITerrainRule[];
  /** вероятность открытого сокровища от 0 до 1**/
  openedTreasuresProbability: number;
  /** вероятность открытого монстра от 0 до 1**/
  openedMonsterProbability: number;
  hexOrSquare?: "hex" | "square";
}

export interface IMapGeneratorResult {
  startCells: StartCells;
  startCombos: StartCombos;
}

export interface IMapStartCell extends ICombos, ITerrainCell {
  terrainType: TerrainType;
  playerCombo?: IPlayerCardCombo;
  monsterCombo?: IMonsterCombo;
  treasureCombo?: ITreasureCombo;
}

export type StartCells = IMapStartCell[][];

export interface IComboPlace extends ICombos {
  column: number;
  row: number;
  playerCombo?: IPlayerCardCombo;
  monsterCombo?: IMonsterCombo;
  treasureCombo?: ITreasureCombo;
}

export type StartCombos = IComboPlace[];

/***************
 * Фигуры на поле
 ****************/
export type FigureType = "monster" | "treasure" | "player" | "dungeon";

export interface IGameFigure extends IFigure {
  gameObject: GameObject;
  isMovableWhenSelected: boolean;
  /** каждая фигура на поле представляет собой какую-то комбинацию карт**/
  combos: ICombos;
}

/** вот что мы размещаем на карте - точки интереса,
 в текущей терминологии dungeons **/
export interface IFigureStartPlace {
  /** если определено - это игрок, у него могут быть стартовые сокровища **/
  playerCard?: IPlayerCard;
  /** если определено - это монстр, он защищает сокровища **/
  monsterCard?: IMonsterCard;
  /** сокровища могут быть пустыми (для игрока к примеру) **/
  treasureCards: ITreasureCard[];
  /**
   * для всех кроме игрока - может быть скрытой, тогда на поле показывается данжен, знак вопроса
   * **/
  isOpened?: boolean;
  column: number;
  row: number;
}

/***************
 * Ячейки поля
 * хранят в себе координаты
 * и текущие фигуры
 ****************/
export interface IGameCell extends ISpriteGridCell<IGameFigure> {
  figures: IGameFigure[];
  terrainRule: ITerrainRule;
}

/** ячейка может содержать монстра или игрока или отдельное сокровище **/
export interface IGameCellFigures {
  playerFigure?: IGameFigure;
  monsterFigure?: IGameFigure;
  treasureFigure?: IGameFigure;
}

/************************
 *  GameState
 ***********************/
export interface IGameState {
  /** to do это кандидат на удаление - они были для совместимости **/
  startCells: IMapStartCell[][];
  /** to do это кандидат на новое состояние
   * - клетки с правилами клеток и только их
   * - есть ли там фигуры - извлекается просто из перебора фигур
   **/
  cells2D?: ICellState[];
  finishMapPortal: {
    isOpened: boolean;
    column: number;
    row: number;
    price: number;
  };
  /** сокровища без монстров **/
  treasures: Record<FigureInGameId, ITreasureState>;
  /** монстры с сокровищами **/
  monsters: Record<FigureInGameId, IMonsterState>;
  player: {
    id: FigureInGameId,
    column: number;
    row: number;
    health: number;
    playerCard: IPlayerCard;
    inventory: ITreasureCard[];
    statistics: {
      monsters: {
        killed: IMonsterCard[];
        killedByMonster?: IMonsterCard;
      };
      treasures: {
        grabbed: ITreasureCard[]
      }
    }
  };
}

/** состояние ячейки на поле **/
export interface ICellState {
  /** тип поверхности **/
  terrainRule: ITerrainRule;
  /** фигуры в ячейке не нужны так как мы можем их быстро извлекать перебором **/
  // figures: Record<FigureInGameId, FigureInGameId>;
}

export interface ITreasureState {
  card: ITreasureCard;
  column: number;
  row: number;
  isOpened: boolean;
  isCollected: boolean;
}

export interface IMonsterState {
  card: IMonsterCard;
  treasures: ITreasureCard[];
  column: number;
  row: number;
  isOpened: boolean;
  isAlive: boolean;
}

/**
 * уникальный для всех игровых фигур id в игре
 * не должно быть одинаковых id даже для фигур разных типов
 **/
export type FigureInGameId = number;

/************************
 *  Видимая карточка
 **********************/
export interface IUiCard {
  /** картинка для иллюстрации **/
  imageKey?: string;
  /** краткий заголовок **/
  title: string;
  /** описание сущности **/
  description: string;
  /** художественная цитата, выводится под текстом**/
  quote?: string;
}

export interface IUiCardPositioned extends IUiCard {
  x?: number;
  y?: number;
}
