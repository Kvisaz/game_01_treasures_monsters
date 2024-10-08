/**
 * Состояние игры Сокровища и монстры - поле, фигуры, игрок
 *
 * метафора карточной игры
 * - карты не меняются
 *
 * - архитектура флагов
 * ---- если у карты есть уникальное состояние, отличающеея от дефолтного
 * ---- оно обозначается через поле стейта с доступом по id
 *
 * Что должно отображать
 * - типы поверхностей
 * - подземелья на карте (скрывают остальных кроме игрок)
 * - монстры на карте (скрывают сокровища и тащат за собой)
 * - сокровища на карте
 * - карту игрока на поле
 * - стату игрока - здоровье, атаку, сокровища, собранные им сокровища
 * - убитые монстры
 * - вскрытые подземелья
 *
 * Что должно восстанавливать в начале игры
 * - все ячейки
 * - все подземелья со статусом открыто или нет
 * - всех выживших и убитых монстров
 * - все сокровища, собранные во время игры
 *
 * Когда меняется стейт?
 * - начало игры, восстановление из сейва
 * - перемещение игрока с ячейки на ячейку
 * - перемещение монстра с ячейки на ячейку
 * - начало боя? Бой имеет свой стейт? пока ограничимся что нет
 * - окончание боя
 *
 * Столкновение с сокровищем
 * - сокровище уходит с поля
 * - сокровище уходит к игроку
 *
 * Столкновение с монстром - бой
 * - атака монстра больше
 *    - игрок теряет 1 жизнь и имеет право ходить
 *    - монстр остается на той же ячейке (не движется в текущей концепции)
 *    - сокровище монстра остается на той же ячейке
 * - атака игрока больше
 *    - монстр уходит на кладбище
 *    - сокровище уходит с поля к игроку
 *
 * Столкновение с сокровищем
 *    - сокровище уходит с поля к игроку
 *    - бонусы сокровища  меняют состояние игрока - атаку, здоровье, золото
 *
 * Условие геймувера
 * - WIN сокровища собраны до определенной нормы и жизнь игрока > 0
 * - FAIL - игрок убит, жизнь игрока <= 0
 **/
export interface TMGameState {
  /** нормализованные базы с быстрым доступом по id **/
  records: {
    /** ячейки поля **/
    cellTypes: Record<CellTypeId, IdCellType>;
    /** правила земли - тип, скорость перемещения, частота генерации **/
    terrainRules: IdRecord<ITerrain>;
    /** доступные карты в игре **/
    cards: IdRecord<ICard>;
  };

  /**
   *  Общий массив ячеек - он создается в начале игры
   *  хранит типы ячеек
   *  не изменяем
   *  Id - cellTypes
   **/
  cells: CellTypeId[][];


  /**
   * Карта игрока - в данной игре одна
   * Id - cards
   */
  playerHeroCardId: Id;
  playerHeroCardPlace: ColumnRow;
  /** сокровища игрока не видны на поле, но влияют на его параметры **/
  playerTreasures: FlagRecord;
  /** параметры которые могут меняться от сбора сокровищ  **/

  /** @subscribe -UI-subscribe **/
  playerHealth: number;
  /** @subscribe -UI-subscribe **/
  playerGold: number;
  /** @subscribe -UI-subscribe **/
  playerAttack: number;
  /**
   * монстр который убьет игрока
   * - для показа в статистике и геймовере
   *
   * Id - cards
   * **/
  playerKiller?: Id;

  /**
   * Монстры на поле
   * - видны на поле, если их координаты не совпадают с закрытым подземельем
   * - СКРЫВАЮТ сокровища с совпадающими координатами
   * - ... если будут перемещаться - будут передвигать за собой сокровища с теми же координатами
   * что означает что монстры будут собирать сокровища тоже
   *
   * Id - card, value = координаты
   **/
  monstersInGame: IdRecord<ColumnRowNumber>;

  /** Поверженные монстры
   *
   * Id - cards, value = true, если убит
   * **/
  monstersGraveYard: FlagRecord;

  /**
   * Сокровища
   * - видны на поле, если их координаты не совпадают с закрытым подземельем или сокровищем
   *
   * Id - card, value = координаты
   **/
  treasuresInGame: IdRecord<ColumnRowNumber>;

  /** Подземелья
   *  - СКРЫВАЮТ  сокровища и монстров с теми же координатами, пока подземелье не откроют
   *
   *  Id - card, value = координаты
   ***/
  dungeonsInGame: IdRecord<ColumnRowNumber>;

  /** вскрытые подземелья помечаются этой записью
   * Id - card, value = true, если открыто
   **/
  dungeonsOpened: FlagRecord;
}

/*********************
 * Базовые типы
 * ******************/

/**
 * уникальный идентификатор карты в игре
 * это не означает уникальность карты по типу и свойствам
 * это просто идентификатор для всех карт,
 * несколько одинаковых монстров должны иметь разные id и тд
 * допустим в колоду добавили три гоблина
 * у каждого гоблина будет разны id
 **/
export type Id = string;
export type CellTypeId = number;
export type IdObject<T = {}> = { id: Id } & T;
export type IdRecord<T> = Record<Id, IdObject<T>>;
export type IdOptionalRecord<T> = Record<Id, IdObject<T> | undefined>;
export type FlagRecord = IdOptionalRecord<boolean>;

export interface ColumnRow {
  column: number;
  row: number;
};

/** число которое кодирует column, row в одно число
 *  по формуле
 *  const columnRowNumber = column + row * columns
 **/
export type ColumnRowNumber = number;

export interface IdCellType {
  id: number;
  terrainRuleId: Id;
}

export enum TMTerrainType {
  grass ='grass',
  ground='ground',
  forest = 'forest',
  mountain = 'mountain',
  sand = 'sand',
  water = 'water',
}

export interface ITerrain {
  readonly type: TMTerrainType;
  readonly speedK: number;
  readonly probability: number;
}

export interface ITerrainRule {
  id: Id;
  type: TMTerrainType;
  speedK: number;
  probability: number;
}

/**
 * карты в игре
 * - персонажи
 * - монстры
 * - сокровища деньги
 * - сокровища артефакты
 * - подземелья, в которых хранится что
 * - ... расширим потом, типа наземных строений
 **/
export interface ICard {
  id: Id;
  type: CardType;
  title: string;
  description: string;
  quote: string;
}

export enum CardType {
  /** герой или монстр, параметры одинаковы, это сущность которая живет и дерется и движется сама **/
  monster = "monster",
  player = "player",
  /** сокровища с денежным или иным эффектом - переходят к существами или валяются просто так **/
  treasure = "treasure",
  /** локация, в которой неизвестно что скрывается - пока такой функционал **/
  dungeon = "dungeon",

  not_set='not_set'
}

/** Существо имеет атаку и здоровье, другие свойства пока не включаем **/
export interface ICreatureCard extends ICard {
  attack: number;
  health: number;
  /** кандидаты - свойства **/
  // скорость перемещения по всем землям
  // velocity: number;
}

export interface ITreasureCard extends ICard {
  /** эффекты которые может оказывать сокровище **/
  effects: Record<ITreasureEffect, number | undefined>;
}

export enum ITreasureEffect {
  gold = "gold",
  health = "health",
  attack = "attack"
}
