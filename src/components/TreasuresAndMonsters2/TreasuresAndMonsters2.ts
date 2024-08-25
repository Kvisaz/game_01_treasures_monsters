import { IConfig, terrainColors } from "./config";
import { HexGrid } from "./components";
import { Align, HexStrategy } from "../../common";
import { HexCellView } from "./components/HexCellView";
import { TMStore } from "../gamestates";

interface IProps {
  scene: Phaser.Scene;
  config: IConfig;
  store: TMStore
}

export class TreasuresAndMonsters2 {
  private unSubs: (() => void)[] = [];
  private readonly gridStrategy: HexStrategy;
  private readonly gameField: HexGrid;

  /** Создание конструктора - инициализация компонента
   *  по состоянию
   **/
  constructor(private props: IProps) {
    this.gridStrategy = new HexStrategy({ cellSize: props.config.cellSize });

    const { scene, config } = this.props;
    const { cellSize } = config;
    this.gameField = new HexGrid({
      scene,
      columns: config.columns,
      rows: config.rows,
      onClick: (column, row) => {
        console.log("2024 08 25 gameField onclick", column, row);
      },
      cellBuilder: (column, row ) => {
        // const terrainType = this.gameState.cells2D[column][row].terrain.type as TerrainType;
        const terrainType = 'grass';
        const color = terrainColors[terrainType] as string;
        const cell = new HexCellView({
          scene,
          color,
          cellSize
        });

        const centerPoint = this.gridStrategy.getCenterXY(column, row);
        const left = centerPoint.x - cellSize / 2;
        const top = centerPoint.y - cellSize / 2;
        Align.setLeftTop(cell, left, top);

        return cell;
      }
    });
  }

  sub(sub: () => () => void) {
    this.unSubs.push(sub());
  }

  destroy() {
    this.props.store.destroy();
    this.gameField.destroy();
    this.unSubs.forEach(unSub => unSub());
    this.unSubs = [];
  }
}
