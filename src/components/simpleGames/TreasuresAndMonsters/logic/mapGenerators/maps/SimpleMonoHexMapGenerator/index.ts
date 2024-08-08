import {
  forEach2D,
  getSafeHexNearsInRadius,
  makeArray2D,
  repeatArray,
  shuffleArray
} from "../../../../../../../common";
import {
  IComboPlace,
  IConfig,
  IMapStartCell,
  IMonsterCard,
  ITerrainCell,
  ITreasureCard,
  TerrainType
} from "../../../../interfaces";
import { MonoTerrainGenerator } from "../../terrains";

interface IProps extends IConfig {}

/** Генератор для гексагональной карты **/
export class SimpleMonoHexMapGenerator {
  private readonly terrainGenerator: MonoTerrainGenerator;
  private readonly grid: IMapStartCell[][];
  private readonly props: IProps;
  constructor(props: IProps) {
    this.props = props;
    const { columns, rows } = this.props;
    this.grid = makeArray2D(columns, rows, (col, row) => ({
      terrainType: "grass",
    }));

    // this.usedCellsMarker = new HexGridMarker({ columns, rows });
    this.terrainGenerator = new MonoTerrainGenerator({
      columns,
      rows,
    });
  }

  /** размещает монстров в порядке их расположения в колоде **/
  run(): IMapStartCell[][] {
    const { columns, rows, positions, treasureCards, monsterCards, gamePlay, playerCard } =
      this.props;

    const { openedTreasuresProbability, openedMonsterProbability, treasuresTotal, monstersTotal } = gamePlay;
    const monsterCardsInGame = repeatArray(shuffleArray(monsterCards), monstersTotal);
    const treasuresCardsInGame = repeatArray(shuffleArray(treasureCards), treasuresTotal);
    console.log('monsterCardsInGame', monsterCardsInGame.length);
    console.log('columns', columns);

    const terrainCells: ITerrainCell[][] = this.terrainGenerator.generateCells();
    forEach2D(terrainCells, (terrainCell, col, row) => {
      this.grid[col][row].terrainType = terrainCell.terrainType;
    });

    /** Игрока **/
    const playerColumn = positions.player.column;
    const playerRow = positions.player.row;
    this.grid[playerColumn][playerRow].playerCombo = {
      playerCard,
      treasureCards: [],
      monstersWin: [],
    };
    const playerFreeRadius = 2;
    this.setGrassAroundPlayer({
      column: playerColumn,
      row: playerRow,
      radius: playerFreeRadius,
      terrainType: "ground",
    });

    /** шагаем по сетке и размещаем карты и сокровища **/
    const colStep = 3;
    const rowStep = 3;
    const freeRadius = 1;
    let monsterCounter = 0;
    let treasureCounter = 0;
    for (let column = 0; column < columns; column += colStep) {
      for (let row = 1; row < rows; row += rowStep) {
        const nears = getSafeHexNearsInRadius({
          columns,
          rows,
          row,
          column,
          includeCenter: true,
          cellRadius: freeRadius,
        });
        const isFree = nears
          .map((near) => this.isPlaceFree(near.column, near.row) && this.isTerrainCardPlaceable(near.column, near.row))
          .reduce((previousValue, currentValue) => previousValue && currentValue, true);
        if (!isFree) continue;

        const isMonstersQueue = monsterCounter < monsterCardsInGame.length;
        const isTreasureQueue = treasureCounter < treasuresCardsInGame.length;
        const isMonster = isTreasureQueue && isMonstersQueue && Math.random() - 0.5 > 0;
        const isTreasure = isTreasureQueue && !isMonster;
        if (isMonster) {
          const monster = monsterCardsInGame[monsterCounter];
          console.log(`place monster ${monster.title} at ${column} ${row}`);
          this.grid[column][row].monsterCombo = {
            monsterCard: monster,
            treasureCards: [treasuresCardsInGame[treasureCounter]],
            isOpened: openedMonsterProbability > Math.random()
          };
          monsterCounter++;
          treasureCounter++;
          continue;
        }

        if (isTreasure) {
          this.grid[column][row].treasureCombo = {
            treasureCards: [treasuresCardsInGame[treasureCounter]],
            isOpened: openedTreasuresProbability > Math.random()
          };
          treasureCounter++;
          continue;
        }
      }
    }

    return this.grid;
  }

  private isSafeColumnRow(column: number, row: number): boolean {
    return column >= 0 && column < this.props.columns && row >= 0 && row < this.props.rows;
  }

  private isPlaceFree(column: number, row: number): boolean {
    if (!this.isSafeColumnRow(column, row)) return false;
    const { monsterCombo, treasureCombo, playerCombo } = this.grid[column][row];
    return monsterCombo == null && treasureCombo == null && playerCombo == null;
  }

  private isTerrainCardPlaceable(column: number, row: number): boolean {
    if (!this.isSafeColumnRow(column, row)) return false;
    const { terrainType } = this.grid[column][row];
    const placeableTerrains: TerrainType[] = ["ground", "grass", "forest", "sand"];
    return placeableTerrains.find((type) => type === terrainType) != null;
  }

  /** вернуть доступные для размещения свободные места на карте **/
  private getFreeStartPlaces(grid: IMapStartCell[][], amount: number): IComboPlace[] {
    const { columns, rows } = this.props;
    const freePlaces: IComboPlace[] = [];

    const step = 2;
    let column = step;
    let row = step;

    for (let i = 0; i < amount; i++) {
      const isFreeCell = grid[column][row];
    }

    freePlaces.push({
      column: 2,
      row: 2,
    });

    freePlaces.push({
      column: 4,
      row: 4,
    });

    return freePlaces;
  }

  private placeMonstersTreasures(props: {
    places: IComboPlace[];
    cards: {
      monsters: IMonsterCard[];
      treasures: ITreasureCard[];
    };
  }): IComboPlace[] {
    const { places, cards } = props;
    const { monsters, treasures } = cards;

    let monsterCounter = 0;
    let treasureCounter = 0;
    places.forEach((place) => {
      const isMonster = Math.random() - 0.5 > 0;
      const isTreasure = !isMonster;
      if (isMonster) {
        place.monsterCombo = {
          monsterCard: monsters[monsterCounter],
          treasureCards: [treasures[treasureCounter]],
        };
        monsterCounter++;
        treasureCounter++;
        return;
      }

      if (isTreasure) {
        place.treasureCombo = {
          treasureCards: [treasures[treasureCounter]],
        };
        treasureCounter++;
        return;
      }
    });

    return places;
  }

  /**
   * около игрока в радиусе 3 все ячейки получают тип 'grass'
   **/
  private setGrassAroundPlayer(props: { column: number; row: number; terrainType: TerrainType; radius: number }) {
    const { grid } = this;
    const { columns, rows } = this.props;
    const { column, row, terrainType, radius } = props;

    const getNears = getSafeHexNearsInRadius({ column, row, cellRadius: radius, rows, columns, includeCenter: true });
    getNears.forEach(({ column, row }) => {
      grid[column][row].terrainType = terrainType;
    });
  }
}
