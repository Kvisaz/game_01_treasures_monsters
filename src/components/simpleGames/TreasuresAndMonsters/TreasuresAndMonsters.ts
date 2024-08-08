import {
  CellChecker,
  ISafeComponent,
  ISimpleGridPathMaker,
  ISimpleGridSelector,
  ISpriteGridCell
} from "../../SpriteGrid/interfaces";
import { treasuresAndMonstersConfig } from "./config";
import { Locale } from "./data";
import { SimpleGridPathMaker } from "../../SpriteGrid/path";
import { SimpleHexSelector } from "../../SpriteGrid/selectors";
import { GameCell, GameGrid, MonsterFigure, PlayerFigure, TreasureFigure } from "./components";
import { getCellFigures, isCellBadTerrain, isCellHasFigures, SimpleMonoHexMapGenerator } from "./logic";
import {
  IConfig,
  IGameCell,
  IGameFigure,
  IGameState,
  IMapStartCell,
  IMonsterCombo,
  IPlayerCardCombo,
  ITerrainRulesMap, ITreasureCard,
  ITreasureCombo, IUiCard, IUiCardPositioned
} from "./interfaces";
import { getTerrainRulesMap } from "./adapters";
import { copyDeep, forEach2D } from "../../../common";
import { DungeonFigure } from "./components/figures/DungeonFigure";
import {
  collectTreasure, getPlayerAttack,
  initGameState,
  isEndMapPortalCanBeOpened,
  isPlayerDead,
  isPlayerWin,
  killMonster,
  loseToMonster
} from "./logic/state";

interface IProps {
  scene: Phaser.Scene;
}

export class TreasuresAndMonsters implements ISafeComponent {
  private readonly config: IConfig;
  private readonly grid: GameGrid;
  private readonly figures: IGameFigure[];
  private readonly selector: ISimpleGridSelector;
  private readonly pathMaker: ISimpleGridPathMaker;
  private readonly terrainRulesMap: ITerrainRulesMap;

  private gameState: IGameState;

  constructor(private props: IProps) {
    this.config = copyDeep(treasuresAndMonstersConfig);
    const { treasureCards, monsterCards, playerCard, cellSize, columns, rows, positions } = this.config;
    /** idea T&M2 -   выбор игрока в начале игры? **/

    this.gameState = initGameState(this.config);

    // this.mapGenerator = new SimpleMonoHexMapGenerator(this.config);
    this.terrainRulesMap = getTerrainRulesMap(this.config.terrainRules);
    console.log(`Start of ${Locale.text("game.name")} game!`);
    console.log("cardsOfTreasures", treasureCards.length);
    console.log("cardsOfMonsters", monsterCards.length);

    // const startCells = this.mapGenerator.run();

    const { scene } = this.props;

    this.grid = new GameGrid({
      scene,
      columns,
      rows,
      cellSize,
      onClick: (cell) => this.onCellClick(cell as unknown as IGameCell),
      terrains: this.gameState.cells,
      terrainRulesMap: this.terrainRulesMap,
      terrainColors: this.config.terrainColors
    });

    this.pathMaker = new SimpleGridPathMaker({
      scene,
      cellMoveDurationMs: 75,
      pathColor: this.config.path.pathColor,
      cells2D: this.grid.cells2D,
      columnMax: this.grid.columnsAmount - 1,
      rowMax: this.grid.rowsAmount - 1
    });

    const cardFigures = this.addFigures(this.gameState.cells);
    console.log("cardFigures", cardFigures.length);
    console.log("cardFigures", cardFigures);
    console.log("cardFigures monsters", cardFigures.filter((c) => c.combos.monsterCombo).length);
    console.log("cardFigures treasures", cardFigures.filter((c) => c.combos.treasureCombo).length);

    this.figures = [...cardFigures];

    this.selector = new SimpleHexSelector({
      scene,
      cellSize,
      selectorColor: this.config.selector.selectorColor
    });

    this.initLogic();
  }

  destroy(): void {
    this.grid.destroy();
    this.figures.forEach((d) => d.gameObject.destroy());
    this.selector.destroy();
    this.pathMaker.destroy();
  }

  private initLogic() {
    this.setPlayerCellAsRouteStart();
  }

  private addFigures(startCells: IMapStartCell[][]): IGameFigure[] {
    const figures: IGameFigure[] = [];
    const { scene } = this.props;

    forEach2D(startCells, (startCell, column, row) => {
      if (startCell.playerCombo == null && startCell.treasureCombo == null && startCell.monsterCombo == null) {
        return;
      }

      const { playerCombo, monsterCombo, treasureCombo } = startCell;
      const figure = this.createFigureForCombo(playerCombo, monsterCombo, treasureCombo);
      if (figure == null) return;
      const cell = this.grid.getCell(column, row);
      if (cell == null) return;
      cell.placeFigure(figure);
      scene.add.existing(figure.gameObject);
      figures.push(figure);
    });

    return figures;
  }

  onCellClick(cell: IGameCell) {
    this.selector.switch(cell as unknown as ISpriteGridCell);

    if (this.pathMaker.isMovingAnimation) {
      console.warn("input blocked by pathMaker isMoveAnimation");
      return;
    }
    const { figures } = cell;
    // this.showCellInfo(cell);
    this.buildPathOrGo(cell);

    /** на 1 клетке - 1 фигура пока поэтому просто выбираем **/
    const { player, monster, treasure, isVoid } = sortFigures(figures);
    if (isVoid) {
      this.onVoidCellClick(cell);
      return;
    }

    if (player) {
      const [figure, combo] = player;
      this.onPlayerClick(cell, figure, combo);
      return;
    }

    if (monster) {
      const [figure, combo] = monster;
      this.onMonsterClick(cell, figure, combo);
      return;
    }

    if (treasure) {
      const [figure, combo] = treasure;
      this.onTreasureClick(cell, figure, combo);
      return;
    }
  }

  /** клик на игроке
   * - должен показать инфо - это ты
   * - ставить стартов
   **/
  private onPlayerClick(cell: IGameCell, figure: IGameFigure, combo: IPlayerCardCombo) {
    /** клик на игроке - перезаряжает путь **/
    this.pathMaker.setStart(cell as unknown as ISpriteGridCell);

    console.log("onPlayerClick", cell, combo, figure);
  }

  /** клик на пустой клетке
   * - просто делаем путь
   **/
  private onVoidCellClick(cell: IGameCell) {
    const { terrainRule } = cell;
    const { type, speedK } = terrainRule;
    this.showCardInfo({
      title: `${type}`,
      description: `Просто пустой кусок пространства, заполенный ${type}`
    });
    this.showPlayerCard();
  }

  /** клик на клетке с монстром
   * - делаем путь до монстра
   * - показать инфо
   *    - монстр?
   *    - подземелье?
   **/
  private onMonsterClick(cell: IGameCell, figure: IGameFigure, combo: IMonsterCombo) {

    const { isOpened, monsterCard } = combo;
    if (isOpened) {
      const about = isPlayerWin(monsterCard, this.gameState) ? "Вы сильнее монстра" : "Монстр сильнее вас";
      this.showCardInfo({
        title: `Монстр ${monsterCard.title}`,
        description: `Атака ${monsterCard.attack} - ${about}`
      });
    } else {
      this.showDungeonInfo();
    }

    this.showPlayerCard();

    /** todo info **/
  }

  /** клик на клетке с сокровищем
   * - делаем путь до сокровища
   * - показать инфо
   *    - сокровище?
   *    - подземелье?
   **/
  private onTreasureClick(cell: IGameCell, figure: IGameFigure, combo: ITreasureCombo) {

    const { isOpened, treasureCards } = combo;
    console.log("onTreasureClick", cell, combo, figure);
    const card = treasureCards[0];
    if (isOpened) {
      this.showCardInfo({
        title: `Сокровище ${card.title}`,
        description: `Бонус к атаке ${card.bonuses.attack ?? 0}, бонус к здоровью ${card.bonuses.health ?? 0}`
      });
    } else {
      this.showDungeonInfo();
    }
    this.showPlayerCard();
  }

  private buildPathOrGo(cellFinishCandidate: IGameCell) {
    console.log("buildPathOrGo ", cellFinishCandidate);

    /** далее все было сделано без учета фигур - надо переделать **/
    const startCell = this.pathMaker.startCell as unknown as GameCell;
    const finishCell = this.pathMaker.finishCell as unknown as GameCell;

    /** есть клетка с выделенными фигурами
     * клик на пустой клетке строит путь от фигур до этой клетки
     * если она проходима
     * если в клетке финиша есть фигура - все равно строим до этой фигуры
     **/
    const isCanBeTarget = !isCellBadTerrain(cellFinishCandidate);
    if (startCell && isCanBeTarget) {
      console.log("run draw path");
      const finishCell = cellFinishCandidate;


      const hasMonster = getCellFigures(finishCell).monsterFigure != null;
      const cellChecker: CellChecker = (column, row) => {
        const cell = this.grid.getCell(column, row) as unknown as IGameCell;
        if (cell == null) return false;

        const isTarget = cell === finishCell;
        const isBadTerrain = isCellBadTerrain(cell);
        const isCellFigures = isCellHasFigures(cell);
        /**
         * на плохую территорию не можем ходить
         * если не таргет - то огибаем монстров и другие фигуры
         * **/
        return !isBadTerrain && (isTarget || !isCellFigures);
      };

      this.pathMaker.setFinish(finishCell as unknown as ISpriteGridCell);
      this.pathMaker.clearPath();
      this.pathMaker.drawPath(cellChecker, hasMonster);
    }

    /** клик на клетке, которая уже была выделена
     * как последняя точка пути
     * запускает движение
     * блокирует ввод
     **/
    if (startCell && finishCell && cellFinishCandidate === finishCell) {
      console.log("run move animation!");
      const gameFigure = finishCell.figures[0];
      const onComplete = () => {
        console.log("move complete in game");

        this.gameState.player.column = finishCell.column;
        this.gameState.player.row = finishCell.row;
        this.setPlayerCellAsRouteStart();

        if (gameFigure) {
          const { monsterCombo, treasureCombo } = gameFigure.combos;
          if (monsterCombo) this.onMonsterFight(monsterCombo);
          if (treasureCombo) {
            this.onTreasureGrab(treasureCombo, gameFigure)
              .catch(console.warn);
          }
        }

      };

      this.pathMaker.moveFigures(onComplete);
      return;
    }
  }

  // todo для игрока надо поставить на него стартовую точку (pathMaker)
  private createFigureForCombo(
    playerCombo: IPlayerCardCombo | undefined,
    monsterCombo: IMonsterCombo | undefined,
    treasureCombo: ITreasureCombo | undefined
  ) {
    const { scene } = this.props;
    const { cellSize } = this.config;

    /** todo TM - 2

     Данжен-компонент первичный
     - показывает монстра или сокровища не вскрытого

     **/

    if (playerCombo) {
      const { playerCard, treasureCards } = playerCombo;
      return new PlayerFigure({
        scene,
        cellSize,
        playerCard,
        treasureCards
      });
    }

    if (monsterCombo) {
      if (monsterCombo.isOpened) {
        return new MonsterFigure({
          scene,
          cellSize,
          monsterCombo
        });
      }

      return new DungeonFigure({
        scene,
        cellSize,
        monsterCombo
      });
    }

    if (treasureCombo) {
      if (treasureCombo.isOpened) {
        return new TreasureFigure({
          scene,
          cellSize,
          treasureCombo
        });
      }
      return new DungeonFigure({
        scene,
        cellSize,
        treasureCombo
      });
    }
  }

  private onMonsterFight(monsterCombo: IMonsterCombo) {
    const { monsterCard } = monsterCombo;
    const { gameState } = this;
    console.log("TO DO FIGHT WITH ", monsterCombo.monsterCard.title);
    if (isPlayerWin(monsterCard, gameState)) {
      killMonster(monsterCard, gameState);
      console.log("You win!");
    } else {
      loseToMonster(monsterCard, gameState);
      console.log("You loose!");
      if (isPlayerDead(gameState)) {
        console.log("GAME OVER - YOU ARE DEAD");
      }
    }
  }

  private async onTreasureGrab(treasureCombo: ITreasureCombo, gameFigure: IGameFigure) {
    console.log("TO DO grab TREASURE WITH ", treasureCombo.treasureCards);
    const { treasureCards } = treasureCombo;
    const { gameState } = this;
    treasureCards.forEach(card => collectTreasure(card, gameState));
    await this.showTreasureGrabAnimation(treasureCards);

    console.log("TO DO  КАК СИНХРОНИЗИРОВАТЬ СОСТОЯНИЕ?");
    console.log("TO DO  1. добывать данные о фигурах из gameState через column, row");
    console.log("TO DO  1.1 убрать инфу о фигурах из cell");
    gameFigure.gameObject?.destroy();

    this.showPlayerCard();
    if (isEndMapPortalCanBeOpened(gameState)) {
      console.log("TO DO - OPEN END MAP PORTAL");
    }
  }

  /** только ячейку ставит **/
  private setPlayerCellAsRouteStart() {
    const { column, row } = this.gameState.player;
    const cell = this.grid.getCell(column, row);

    // todo keep Player State in GameState
    this.pathMaker.setStart(cell as unknown as ISpriteGridCell);
  }

  private showDungeonInfo() {
    this.showCardInfo({
      title: `Подземелье`,
      description: `В нем точно есть сокровища и могут прятаться монстры`
    });
  }

  private showCellInfo(cell: IGameCell) {
    const { row, column, terrainRule, figures } = cell;
    console.log("cell terrain ", terrainRule.type, { ...terrainRule });
    console.log("cell figures", figures);
    console.log("click on cell", column, row, cell);
  }

  private showPlayerCard() {
    const { playerCard, health, inventory } = this.gameState.player;
    const attack = getPlayerAttack(this.gameState);
    this.showCardInfo({
      title: `Вы ${playerCard.title}`,
      description: `Здоровье ${health}, Атака ${attack} `
    });
  }


  private showCardInfo({ title, description, imageKey, quote }: IUiCardPositioned) {
    console.log("================");
    console.log(title);
    console.log(description);
    if (quote) console.log(quote);
    console.log("================");
  }


  /*********
   * анимации
   */
  private async showTreasureGrabAnimation(treasureCards: ITreasureCard[]) {
    console.log("You collect treasures ", ...treasureCards);
  }
}

function sortFigures(figures: IGameFigure[]) {
  let player: [IGameFigure, IPlayerCardCombo] | undefined;
  let monster: [IGameFigure, IMonsterCombo] | undefined;
  let treasure: [IGameFigure, ITreasureCombo] | undefined;
  let isVoid = true;

  figures.forEach((figure) => {
    const { playerCombo, monsterCombo, treasureCombo } = figure.combos;

    if (playerCombo) {
      player = [figure, playerCombo];
      isVoid = false;
      return;
    }

    if (monsterCombo) {
      monster = [figure, monsterCombo];
      isVoid = false;
      return;
    }

    if (treasureCombo) {
      treasure = [figure, treasureCombo];
      isVoid = false;
      return;
    }
  });

  return {
    player,
    monster,
    treasure,
    isVoid
  };
}
