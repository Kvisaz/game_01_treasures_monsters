import { ITreasuresMonstersState } from "./state";
import { IConfig, terrainColors, TerrainType } from "./config";
import { HexGrid } from "./components";
import { Align, HexStrategy } from "../../common";
import { HexCellView } from "./components/HexCellView";

interface IProps {
  scene: Phaser.Scene;
  config: IConfig;
  gameState: ITreasuresMonstersState;
}

export class TreasuresAndMonsters2 {
  private unSubs: (() => void)[] = [];
  private readonly gameState: ITreasuresMonstersState;
  private readonly gridStrategy: HexStrategy;
  private readonly gameField: HexGrid;

  /** Создание конструктора - инициализация компонента
   *  по состоянию
   **/
  constructor(private props: IProps) {
    this.gameState = props.gameState;
    this.gridStrategy = new HexStrategy({ cellSize: props.config.cellSize });

    const { scene, config } = this.props;
    const { cellSize } = config;
    this.gameField = new HexGrid({
      scene,
      cells2D: this.gameState.cells2D,
      cellBuilder: ({ column, row }) => {
        const terrainType = this.gameState.cells2D[column][row].terrain.type as TerrainType;
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
    this.gameField.destroy();
    this.unSubs.forEach(unSub => unSub());
    this.unSubs = [];
  }
}
