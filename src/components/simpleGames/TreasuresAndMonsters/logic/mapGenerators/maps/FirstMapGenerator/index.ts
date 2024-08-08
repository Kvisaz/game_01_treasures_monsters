import {
  getEightNearsColumnRows,
  getHexNears,
  getRandomArrayElement,
  isSafeArr2Place,
  makeArray2D,
  shuffleArray,
} from "../../../../../../../common";
import {
  IComboPlace,
  IMapGenerator,
  IMapGeneratorResult,
  IMonsterCard,
  IMonsterCombo,
  IPlayerCard,
  ITerrainGenerator,
  ITerrainRule,
  ITreasureCard,
  ITreasureCombo,
  StartCells,
  StartCombos,
} from "../../../../interfaces";
import { FirstTerrainGenerator } from "../../terrains";
import { getTerrainRulesMap } from "../../../../adapters";

interface IProps {
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

export class FirstMapGenerator implements IMapGenerator {
  constructor(private props: IProps) {}

  run(): IMapGeneratorResult {
    const {
      columns,
      rows,
      terrainRules,
      treasureCards,
      monsterCards,
      openedMonsterProbability,
      openedTreasuresProbability,
      playerCard,
      hexOrSquare = 'hex',
    } = this.props;

    const terrainGenerator: ITerrainGenerator = new FirstTerrainGenerator({
      columns,
      rows,
      terrainRules,
    });

    const terrainCells = terrainGenerator.generateCells();

    const startCells: StartCells = makeArray2D(columns, rows, (column, row) => {
      return {
        terrainType: terrainCells[row][column].terrainType,
      };
    });

    const startCombos: StartCombos = [];

    /**
     * Игрок помещается в левый верхний угол
     * около него в радиусе 3 все ячейки получают тип 'grass'
     **/
    startCombos.push({
      column: 0,
      row: 0,
      playerCombo: {
        playerCard,
        treasureCards: [],
        monstersWin: [],
      },
    });
    /**
     * около игрока в радиусе 3 все ячейки получают тип 'grass'
     **/
    for (let r = 0; r < Math.min(3, rows); r++) {
      for (let c = 0; c < Math.min(3, columns); c++) {
        startCells[r][c].terrainType = "grass";
      }
    }

    /** тасуем карты монстров и сокровищ **/
    const shuffledMonsters = shuffleArray(monsterCards);
    const shuffledTreasures = shuffleArray(treasureCards);

    /** собираем комбинации **/
    const monsterCombos: IMonsterCombo[] = shuffledMonsters.map((monsterCard) => {
      const combo: IMonsterCombo = {
        monsterCard,
        treasureCards: [],
        isOpened: Math.random() < openedMonsterProbability,
      };
      const treasureCard = shuffledTreasures.pop();
      if (treasureCard) combo.treasureCards.push(treasureCard);
      else console.warn("no treasure for monster");

      return combo;
    });

    const treasureCombos: ITreasureCombo[] = shuffledTreasures.map((treasureCard) => {
      return {
        treasureCards: [treasureCard],
        isOpened: Math.random() < openedTreasuresProbability,
      };
    });

    /**
     * по всему массиву равномерно и случайно распределяются карты монстров и сокровищ
     * по правилам
     * - размещение возможно только на terrain со скоростью speedK > 0 (проходимость должна быть)
     * - на каждую карту монстра кладется в ту же ячейку еще 1 карта сокровища
     * - карт сокровищ намного больше, поэтому часто в ячейку кладется просто 1 карта сокровища
     * - все монстры получают isCardOpened = true с вероятностью openedTreasuresProbability
     * - одиночные сокровища получают isCardOpened = true с вероятностью openedTreasuresProbability
     * - если не выпадает, isCardOpened не ставится
     * **/
    const terrainRuleMap = getTerrainRulesMap(terrainRules);
    console.log("terrainRuleMap", terrainRuleMap);

    const isWalkable = (column: number, row: number) => {
      if (!isSafeArr2Place(column, row, columns, rows)) return false;

      const cell = startCells[column][row];
      const terrainRule = terrainRuleMap[cell.terrainType];
      const isWalkableTerrain = terrainRule.speedK > 0;
      console.log("isWalkable", terrainRule.type, terrainRule.speedK, isWalkableTerrain);
      if (!isWalkableTerrain) return false;

      return true;
    };

    const getCellNears = hexOrSquare === "hex" ? getHexNears : getEightNearsColumnRows;

    /** безопасно распределить так - задаем фикс степ и затем смещаем на +- 1 в случайном направлении **/

    /** TODO поменять чистый фикс степ на степ с рандомным смещением **/
    const colStep = 4;
    const rowStep = 4;

    CYCLE: for (let column = 2; column < columns; column += colStep) {
      for (let row = 2; row < rows; row += rowStep) {
        if (monsterCombos.length == 0 && treasureCombos.length == 0) break CYCLE;

        let walkableColumn = column;
        let walkableRow = row;
        /** если не проходимая или занятая ячейка **/
        while (!isWalkable(walkableColumn, walkableRow)) {
          /** берем соседей **/
          const nears = getCellNears(walkableColumn, walkableRow).filter(({ column, row }) =>
            isSafeArr2Place(column, row, columns, rows)
          );
          const randomNear = getRandomArrayElement(nears);
          walkableColumn = randomNear.column;
          walkableRow = randomNear.row;
        }

        const startCombo: IComboPlace = {
          column: walkableColumn,
          row: walkableRow,
        };
        const isMonster = monsterCombos.length > 0 && Math.random() - 0.5;
        if (isMonster) {
          startCombo.monsterCombo = monsterCombos.pop();
        } else {
          startCombo.treasureCombo = treasureCombos.pop();
        }
        startCombos.push(startCombo);
      }
    }

    return {
      startCells,
      startCombos,
    };
  }
}
